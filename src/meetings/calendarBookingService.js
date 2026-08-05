export class CalendarBookingService {
  constructor({ endpoint = '/api/calendar/book' } = {}) {
    this.endpoint = endpoint;
  }

  async book({ slot, name, email, company, phone, projectSummary, timezone, consent, website = '' }) {
    if (!consent) throw new Error('Please confirm consent before booking.');
    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        visitorName: name,
        visitorEmail: email,
        company,
        phone,
        projectSummary,
        startIso: slot?.iso,
        timezone,
        website,
      }),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.booked) {
      const error = new Error(result.error || 'The meeting could not be booked.');
      error.status = response.status;
      throw error;
    }
    return result;
  }
}
