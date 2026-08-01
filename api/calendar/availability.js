import { getAvailableCalendarSlots, readCalendarConfig } from '../_calendar/googleCalendar.js';

const noStore = (response) => response.setHeader('Cache-Control', 'private, no-store, max-age=0');

export default async function handler(request, response) {
  noStore(response);
  if (request.method !== 'GET') return response.status(405).json({ ok: false, error: 'Method not allowed.' });

  const requestUrl = new URL(request.url || '/api/calendar/availability', 'http://localhost');
  const visitorTimezone = String(request.query?.timezone || requestUrl.searchParams.get('timezone') || 'UTC').slice(0, 100);
  try {
    const slots = await getAvailableCalendarSlots(readCalendarConfig(), { visitorTimezone });
    return response.status(200).json({ ok: true, slots });
  } catch (error) {
    if (error.code === 'CALENDAR_NOT_CONFIGURED') {
      return response.status(503).json({ ok: false, error: 'Live calendar availability is not configured yet.' });
    }
    console.error('[DEKODE Calendar] Availability failed.', { message: error.message, status: error.status });
    return response.status(502).json({ ok: false, error: 'Calendar availability is temporarily unavailable.' });
  }
}
