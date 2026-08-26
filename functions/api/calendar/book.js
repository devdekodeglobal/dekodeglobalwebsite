import { createCalendarBooking, readCalendarConfig } from '../_calendar/googleCalendar.js';
import { adapt } from '../_vercel_adapter.js';

const MAX_BODY_BYTES = 16_000;
const sanitize = (value, limit) => [...String(value ?? '')]
  .map((character) => character.charCodeAt(0) < 32 ? ' ' : character)
  .join('')
  .replace(/[<>]/g, ' ')
  .trim()
  .slice(0, limit);
const validEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const validPhone = (value) => /^\+?[0-9][0-9\s().-]{6,24}$/.test(value);

export default async function handler(request, response) {
  response.setHeader('Cache-Control', 'private, no-store, max-age=0');
  if (request.method !== 'POST') return response.status(405).json({ ok: false, error: 'Method not allowed.' });
  if (Number(request.headers['content-length'] || 0) > MAX_BODY_BYTES) {
    return response.status(413).json({ ok: false, error: 'Request is too large.' });
  }

  const payload = request.body || {};
  const booking = {
    visitorName: sanitize(payload.visitorName, 120),
    visitorEmail: sanitize(payload.visitorEmail, 254),
    company: sanitize(payload.company, 160),
    phone: sanitize(payload.phone, 30),
    projectSummary: sanitize(payload.projectSummary, 2000),
    startIso: sanitize(payload.startIso, 40),
    visitorTimezone: sanitize(payload.timezone, 100) || 'UTC',
  };
  if (booking.visitorName.length < 2 || !validEmail(booking.visitorEmail) || booking.company.length < 2 || !validPhone(booking.phone) || booking.projectSummary.length < 4 || !Number.isFinite(Date.parse(booking.startIso))) {
    return response.status(400).json({ ok: false, error: 'Name, valid email, company, phone number, project summary, and meeting time are required.' });
  }
  if (payload.website) return response.status(400).json({ ok: false, error: 'The booking could not be submitted.' });

  try {
    const result = await createCalendarBooking(readCalendarConfig(), booking);
    console.info('[DEKODE Calendar] Meeting booked.', { eventId: result.eventId, startIso: result.startIso });
    return response.status(201).json({
      ok: true,
      booked: true,
      startIso: result.startIso,
      endIso: result.endIso,
      meetLink: result.meetLink,
      message: 'Your discovery call is booked. A calendar invitation has been sent to your email.',
    });
  } catch (error) {
    if (error.code === 'SLOT_UNAVAILABLE') return response.status(409).json({ ok: false, error: error.message });
    if (error.code === 'CALENDAR_NOT_CONFIGURED') return response.status(503).json({ ok: false, error: 'Live calendar booking is not configured yet.' });
    console.error('[DEKODE Calendar] Booking failed.', { message: error.message, status: error.status });
    return response.status(502).json({ ok: false, error: 'The meeting could not be booked. Please try again.' });
  }
}

export async function onRequest(context) {
  return adapt(context, handler);
}
