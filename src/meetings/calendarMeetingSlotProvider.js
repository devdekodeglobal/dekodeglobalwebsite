import { MeetingSlotProvider } from './meetingSlotProvider.js';

export class CalendarMeetingSlotProvider extends MeetingSlotProvider {
  constructor({ endpoint = '/api/calendar/availability' } = {}) {
    super();
    this.endpoint = endpoint;
  }

  async getAvailableSlots(_now, visitorTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone) {
    const url = new URL(this.endpoint, globalThis.location?.origin || 'http://localhost');
    url.searchParams.set('timezone', visitorTimezone);
    const response = await fetch(`${url.pathname}${url.search}`);
    const result = await response.json().catch(() => ({}));
    if (!response.ok || !Array.isArray(result.slots)) {
      throw new Error(result.error || 'Calendar availability could not be loaded.');
    }
    return result.slots;
  }
}
