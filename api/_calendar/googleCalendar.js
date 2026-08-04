const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_CALENDAR_API = 'https://www.googleapis.com/calendar/v3';

const DEFAULTS = Object.freeze({
  timezone: 'Australia/Melbourne',
  businessDays: [1, 2, 3, 4, 5],
  workdayStart: '09:00',
  workdayEnd: '17:00',
  meetingMinutes: 30,
  bufferMinutes: 15,
  minimumNoticeHours: 0,
  daysToSearch: 31,
  maximumSlots: 250,
});

const integer = (value, fallback, minimum, maximum) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? Math.min(maximum, Math.max(minimum, parsed)) : fallback;
};

const timeValue = (value, fallback) => /^([01]\d|2[0-3]):[0-5]\d$/.test(value || '') ? value : fallback;

export function readCalendarConfig(env = process.env) {
  const businessDays = String(env.GOOGLE_CALENDAR_BUSINESS_DAYS || '1,2,3,4,5')
    .split(',')
    .map((value) => Number.parseInt(value.trim(), 10))
    .filter((value) => value >= 0 && value <= 6);

  return {
    calendarId: env.GOOGLE_CALENDAR_ID || '',
    clientId: env.GOOGLE_CLIENT_ID || '',
    clientSecret: env.GOOGLE_CLIENT_SECRET || '',
    refreshToken: env.GOOGLE_REFRESH_TOKEN || '',
    timezone: env.GOOGLE_CALENDAR_TIMEZONE || DEFAULTS.timezone,
    businessDays: businessDays.length ? [...new Set(businessDays)] : DEFAULTS.businessDays,
    workdayStart: timeValue(env.GOOGLE_CALENDAR_WORKDAY_START, DEFAULTS.workdayStart),
    workdayEnd: timeValue(env.GOOGLE_CALENDAR_WORKDAY_END, DEFAULTS.workdayEnd),
    meetingMinutes: integer(env.GOOGLE_CALENDAR_MEETING_DURATION_MINUTES, DEFAULTS.meetingMinutes, 15, 120),
    bufferMinutes: integer(env.GOOGLE_CALENDAR_BUFFER_MINUTES, DEFAULTS.bufferMinutes, 0, 120),
    minimumNoticeHours: integer(env.GOOGLE_CALENDAR_MINIMUM_NOTICE_HOURS, DEFAULTS.minimumNoticeHours, 0, 168),
    daysToSearch: integer(env.GOOGLE_CALENDAR_DAYS_TO_SEARCH, DEFAULTS.daysToSearch, 1, 31),
    maximumSlots: integer(env.GOOGLE_CALENDAR_MAXIMUM_SLOTS, DEFAULTS.maximumSlots, 1, 500),
  };
}

export function assertCalendarConfigured(config) {
  const missing = [
    ['GOOGLE_CALENDAR_ID', config.calendarId],
    ['GOOGLE_CLIENT_ID', config.clientId],
    ['GOOGLE_CLIENT_SECRET', config.clientSecret],
    ['GOOGLE_REFRESH_TOKEN', config.refreshToken],
  ].filter(([, value]) => !value).map(([name]) => name);
  if (missing.length) {
    const error = new Error(`Calendar is not configured: ${missing.join(', ')}`);
    error.code = 'CALENDAR_NOT_CONFIGURED';
    throw error;
  }
}

const partsInTimezone = (date, timeZone) => Object.fromEntries(
  new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
  }).formatToParts(date).filter((part) => part.type !== 'literal').map((part) => [part.type, Number(part.value)]),
);

export function zonedDateTimeToUtc({ year, month, day, hour, minute }, timeZone) {
  const desired = Date.UTC(year, month - 1, day, hour, minute, 0, 0);
  let candidate = desired;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const observed = partsInTimezone(new Date(candidate), timeZone);
    const observedValue = Date.UTC(observed.year, observed.month - 1, observed.day, observed.hour, observed.minute, observed.second);
    const adjustment = desired - observedValue;
    candidate += adjustment;
    if (adjustment === 0) break;
  }
  return new Date(candidate);
}

const addCalendarDays = ({ year, month, day }, amount) => {
  const date = new Date(Date.UTC(year, month - 1, day + amount));
  return { year: date.getUTCFullYear(), month: date.getUTCMonth() + 1, day: date.getUTCDate() };
};

const minutesFromTime = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

export function generateCandidateSlots(config, now = new Date()) {
  const today = partsInTimezone(now, config.timezone);
  const startMinutes = minutesFromTime(config.workdayStart);
  const endMinutes = minutesFromTime(config.workdayEnd);
  const minimumStart = now.getTime() + config.minimumNoticeHours * 3_600_000;
  const slots = [];

  for (let offset = 0; offset <= config.daysToSearch; offset += 1) {
    const date = addCalendarDays(today, offset);
    const weekday = new Date(Date.UTC(date.year, date.month - 1, date.day)).getUTCDay();
    if (!config.businessDays.includes(weekday)) continue;
    for (let minute = startMinutes; minute + config.meetingMinutes <= endMinutes; minute += config.meetingMinutes + config.bufferMinutes) {
      const start = zonedDateTimeToUtc({ ...date, hour: Math.floor(minute / 60), minute: minute % 60 }, config.timezone);
      if (start.getTime() < minimumStart) continue;
      const end = new Date(start.getTime() + config.meetingMinutes * 60_000);
      slots.push({ start, end });
    }
  }
  return slots;
}

const overlaps = (slot, interval, bufferMinutes) => {
  const buffer = bufferMinutes * 60_000;
  return slot.start.getTime() < new Date(interval.end).getTime() + buffer
    && slot.end.getTime() > new Date(interval.start).getTime() - buffer;
};

export function removeBusySlots(candidates, busyIntervals, bufferMinutes = 0) {
  return candidates.filter((slot) => !busyIntervals.some((interval) => overlaps(slot, interval, bufferMinutes)));
}

export function formatPublicSlot(slot, visitorTimezone, companyTimezone) {
  const timezone = visitorTimezone || 'UTC';
  let label;
  try {
    label = new Intl.DateTimeFormat('en', {
      timeZone: timezone, weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
    }).format(slot.start);
  } catch {
    label = new Intl.DateTimeFormat('en', {
      timeZone: 'UTC', weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
    }).format(slot.start);
  }
  return {
    id: slot.start.toISOString(),
    iso: slot.start.toISOString(),
    endIso: slot.end.toISOString(),
    label,
    visitorTimezone: timezone,
    companyTimezone,
    isMock: false,
  };
}

async function googleRequest(url, options, fetchImpl = fetch) {
  const response = await fetchImpl(url, { ...options, signal: AbortSignal.timeout(10_000) });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(body.error?.message || body.error_description || 'Google Calendar request failed.');
    error.status = response.status;
    throw error;
  }
  return body;
}

export async function getGoogleAccessToken(config, fetchImpl = fetch) {
  const body = new URLSearchParams({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    refresh_token: config.refreshToken,
    grant_type: 'refresh_token',
  });
  const result = await googleRequest(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  }, fetchImpl);
  return result.access_token;
}

export async function getBusyIntervals(config, timeMin, timeMax, fetchImpl = fetch) {
  const accessToken = await getGoogleAccessToken(config, fetchImpl);
  const result = await googleRequest(`${GOOGLE_CALENDAR_API}/freeBusy`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ timeMin, timeMax, timeZone: config.timezone, items: [{ id: config.calendarId }] }),
  }, fetchImpl);
  return result.calendars?.[config.calendarId]?.busy || [];
}

export async function getAvailableCalendarSlots(config, { now = new Date(), visitorTimezone = 'UTC', fetchImpl = fetch } = {}) {
  assertCalendarConfigured(config);
  const candidates = generateCandidateSlots(config, now);
  if (!candidates.length) return [];
  const busy = await getBusyIntervals(
    config,
    candidates[0].start.toISOString(),
    candidates[candidates.length - 1].end.toISOString(),
    fetchImpl,
  );
  return removeBusySlots(candidates, busy, config.bufferMinutes)
    .slice(0, config.maximumSlots)
    .map((slot) => formatPublicSlot(slot, visitorTimezone, config.timezone));
}

export async function createCalendarBooking(config, booking, fetchImpl = fetch) {
  assertCalendarConfigured(config);
  const available = await getAvailableCalendarSlots(config, {
    now: booking.now || new Date(),
    visitorTimezone: booking.visitorTimezone,
    fetchImpl,
  });
  const selected = available.find((slot) => slot.iso === booking.startIso);
  if (!selected) {
    const error = new Error('That time is no longer available. Please choose another slot.');
    error.code = 'SLOT_UNAVAILABLE';
    throw error;
  }

  const accessToken = await getGoogleAccessToken(config, fetchImpl);
  const calendarId = encodeURIComponent(config.calendarId);
  const event = await googleRequest(`${GOOGLE_CALENDAR_API}/calendars/${calendarId}/events?conferenceDataVersion=1&sendUpdates=all`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      summary: `DEKODE discovery call - ${booking.visitorName}`,
      description: [
        `Company: ${booking.company}`,
        `Phone: ${booking.phone}`,
        booking.projectSummary ? `Project: ${booking.projectSummary}` : '',
        'Booked through dekodeglobal.com',
      ].filter(Boolean).join('\n\n'),
      start: { dateTime: selected.iso, timeZone: config.timezone },
      end: { dateTime: selected.endIso, timeZone: config.timezone },
      attendees: [{ email: booking.visitorEmail, displayName: booking.visitorName }],
      conferenceData: { createRequest: { requestId: crypto.randomUUID(), conferenceSolutionKey: { type: 'hangoutsMeet' } } },
      guestsCanInviteOthers: false,
    }),
  }, fetchImpl);

  return {
    eventId: event.id,
    startIso: event.start?.dateTime || selected.iso,
    endIso: event.end?.dateTime || selected.endIso,
    htmlLink: event.htmlLink || null,
    meetLink: event.hangoutLink || event.conferenceData?.entryPoints?.find((entry) => entry.entryPointType === 'video')?.uri || null,
  };
}
