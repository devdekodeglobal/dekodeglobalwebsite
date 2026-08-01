import { CalendarMeetingSlotProvider } from './calendarMeetingSlotProvider.js';
import { MockMeetingSlotProvider } from './mockMeetingSlotProvider.js';

export function createMeetingSlotProvider({ provider = 'calendar', companyTimezone } = {}) {
  if (provider === 'mock') return new MockMeetingSlotProvider({ companyTimezone });
  return new CalendarMeetingSlotProvider();
}
