import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  createCalendarBooking,
  generateCandidateSlots,
  getAvailableCalendarSlots,
  readCalendarConfig,
  removeBusySlots,
} from '../api/_calendar/googleCalendar.js';
import {
  dateFromLocalKey,
  formatTimeInZone,
  toLocalDateKey,
} from '../src/utils/calendarPresentation.js';

const config = {
  calendarId: 'calendar@example.com',
  clientId: 'client-id',
  clientSecret: 'client-secret',
  refreshToken: 'refresh-token',
  timezone: 'UTC',
  businessDays: [1, 2, 3, 4, 5],
  workdayStart: '09:00',
  workdayEnd: '11:00',
  meetingMinutes: 30,
  bufferMinutes: 15,
  minimumNoticeHours: 0,
  daysToSearch: 1,
  maximumSlots: 10,
};

const jsonResponse = (body, ok = true, status = 200) => ({
  ok,
  status,
  json: async () => body,
});

test('calendar configuration remains server-only and uses safe defaults', async () => {
  const parsed = readCalendarConfig({ GOOGLE_CALENDAR_ID: 'private@example.com' });
  assert.equal(parsed.calendarId, 'private@example.com');
  assert.equal(parsed.meetingMinutes, 30);
  assert.equal(parsed.bufferMinutes, 15);
  assert.equal(parsed.minimumNoticeHours, 0);
  assert.equal(parsed.daysToSearch, 31);
  assert.equal(parsed.maximumSlots, 250);

  const [example, scheduler] = await Promise.all([
    readFile(new URL('../.env.example', import.meta.url), 'utf8'),
    readFile(new URL('../src/components/MeetingScheduler.jsx', import.meta.url), 'utf8'),
  ]);
  assert.match(example, /GOOGLE_CLIENT_SECRET=/);
  assert.doesNotMatch(example, /GOOGLE_CLIENT_SECRET=\S+/);
  assert.doesNotMatch(scheduler, /GOOGLE_CLIENT_SECRET|GOOGLE_REFRESH_TOKEN/);
});

test('calendar presentation groups local dates and formats existing slots without changing them', () => {
  const iso = '2026-08-03T09:00:00.000Z';
  assert.equal(toLocalDateKey(iso), toLocalDateKey(new Date(iso)));
  assert.equal(dateFromLocalKey('2026-08-18').getDate(), 18);
  assert.match(formatTimeInZone(iso, 'Asia/Kolkata'), /2:30/);
  assert.equal(iso, '2026-08-03T09:00:00.000Z');
});

test('candidate slots follow business hours and busy intervals remove buffered conflicts', () => {
  const now = new Date('2026-08-03T08:00:00.000Z');
  const candidates = generateCandidateSlots(config, now);
  assert.equal(candidates[0].start.toISOString(), '2026-08-03T09:00:00.000Z');
  assert.equal(candidates[0].end.toISOString(), '2026-08-03T09:30:00.000Z');
  assert.equal(candidates[1].start.toISOString(), '2026-08-03T09:45:00.000Z');

  const available = removeBusySlots(candidates, [{
    start: '2026-08-03T09:30:00.000Z',
    end: '2026-08-03T10:00:00.000Z',
  }], 15);
  assert.ok(available.every((slot) => slot.start.toISOString() !== '2026-08-03T09:00:00.000Z'));
  assert.ok(available.every((slot) => slot.start.toISOString() !== '2026-08-03T09:45:00.000Z'));
});

test('same-day booking keeps future slots available when no notice period is configured', () => {
  const candidates = generateCandidateSlots(config, new Date('2026-08-03T10:00:00.000Z'));

  assert.equal(candidates[0].start.toISOString(), '2026-08-03T10:30:00.000Z');
  assert.ok(candidates.every((slot) => slot.start.getTime() >= new Date('2026-08-03T10:00:00.000Z').getTime()));
});

test('availability reads free-busy data and returns visitor-timezone labels', async () => {
  const calls = [];
  const fetchImpl = async (url, options) => {
    calls.push({ url: String(url), options });
    if (String(url).includes('oauth2.googleapis.com')) return jsonResponse({ access_token: 'access-token' });
    return jsonResponse({ calendars: { [config.calendarId]: { busy: [] } } });
  };
  const slots = await getAvailableCalendarSlots(config, {
    now: new Date('2026-08-03T08:00:00.000Z'),
    visitorTimezone: 'Asia/Kolkata',
    fetchImpl,
  });
  assert.ok(slots.length > 0);
  assert.equal(slots[0].visitorTimezone, 'Asia/Kolkata');
  assert.equal(slots[0].isMock, false);
  assert.equal(calls.length, 2);
  assert.match(calls[1].url, /freeBusy/);
});

test('booking rechecks availability before creating the event and attendee invite', async () => {
  const calls = [];
  const fetchImpl = async (url, options) => {
    calls.push({ url: String(url), options });
    if (String(url).includes('oauth2.googleapis.com')) return jsonResponse({ access_token: 'access-token' });
    if (String(url).includes('freeBusy')) return jsonResponse({ calendars: { [config.calendarId]: { busy: [] } } });
    return jsonResponse({
      id: 'event-1',
      start: { dateTime: '2026-08-03T09:00:00.000Z' },
      end: { dateTime: '2026-08-03T09:30:00.000Z' },
      hangoutLink: 'https://meet.google.com/example',
    });
  };
  const result = await createCalendarBooking(config, {
    visitorName: 'Alex Morgan',
    visitorEmail: 'alex@example.com',
    company: 'Acme',
    phone: '+61 421 196 363',
    projectSummary: 'Build a customer support platform.',
    startIso: '2026-08-03T09:00:00.000Z',
    visitorTimezone: 'UTC',
    now: new Date('2026-08-03T08:00:00.000Z'),
  }, fetchImpl);
  assert.equal(result.eventId, 'event-1');
  assert.equal(result.meetLink, 'https://meet.google.com/example');
  const eventCall = calls.find((call) => call.url.includes('/events?'));
  const eventBody = JSON.parse(eventCall.options.body);
  assert.equal(eventBody.attendees[0].email, 'alex@example.com');
  assert.match(eventBody.description, /Company: Acme/);
  assert.match(eventBody.description, /Phone: \+61 421 196 363/);
  assert.equal(eventBody.guestsCanInviteOthers, false);
  assert.equal(calls.filter((call) => call.url.includes('freeBusy')).length, 1);
});
