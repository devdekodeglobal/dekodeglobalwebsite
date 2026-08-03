import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Calendar, CheckCircle2, LoaderCircle, RefreshCw } from 'lucide-react';
import { createMeetingSlotProvider } from '../meetings/meetingProviderFactory.js';
import { CalendarBookingService } from '../meetings/calendarBookingService.js';
import { voiceConfig } from '../voice/config.js';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function MeetingScheduler({
  projectSummary,
  onBooked,
  selectedSlotId,
  onSlotSelect,
  onSlotsChange,
}) {
  const [slots, setSlots] = useState([]);
  const [localSelectedSlotId, setLocalSelectedSlotId] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [consent, setConsent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', company: '', projectSummary, website: '' });
  const timezone = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC', []);
  const provider = useMemo(() => createMeetingSlotProvider({
    provider: voiceConfig.meetingProvider,
    companyTimezone: voiceConfig.companyTimezone,
  }), []);
  const booking = useMemo(() => new CalendarBookingService(), []);
  const activeSelectedSlotId = selectedSlotId === undefined ? localSelectedSlotId : selectedSlotId;
  const selectedSlot = useMemo(
    () => slots.find((slot) => slot.id === activeSelectedSlotId) || null,
    [activeSelectedSlotId, slots],
  );

  const selectSlot = useCallback((slot) => {
    setLocalSelectedSlotId(slot?.id || null);
    onSlotSelect?.(slot);
    setError('');
  }, [onSlotSelect]);

  const loadSlots = useCallback(async () => {
    setStatus('loading');
    setError('');
    selectSlot(null);
    try {
      const nextSlots = await provider.getAvailableSlots(undefined, timezone);
      setSlots(nextSlots);
      onSlotsChange?.(nextSlots);
      setStatus(nextSlots.length ? 'ready' : 'empty');
    } catch (nextError) {
      setSlots([]);
      onSlotsChange?.([]);
      setError(nextError.message);
      setStatus('error');
    }
  }, [onSlotsChange, provider, selectSlot, timezone]);

  useEffect(() => { loadSlots(); }, [loadSlots]);

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const submit = async (event) => {
    event.preventDefault();
    if (!selectedSlot) return setError('Choose a meeting time first.');
    if (form.name.trim().length < 2 || !emailPattern.test(form.email) || form.projectSummary.trim().length < 4) {
      return setError('Add your name, a valid email, and a short project summary.');
    }
    if (!consent) return setError('Please confirm consent before booking.');
    if (selectedSlot.isMock) {
      return setError('This is a preview slot only. Connect the Google Calendar environment variables to accept bookings.');
    }
    setStatus('booking');
    setError('');
    try {
      const result = await booking.book({ slot: selectedSlot, ...form, timezone, consent });
      setStatus('booked');
      onBooked?.(result, selectedSlot);
    } catch (nextError) {
      setError(nextError.message);
      setStatus('error');
      if (nextError.status === 409) loadSlots();
    }
  };

  if (status === 'booked') {
    return <div className="meeting-scheduler-success"><CheckCircle2 size={30} /><strong>Discovery call booked</strong><span>A calendar invitation is on its way to your email.</span></div>;
  }

  return (
    <form className="meeting-scheduler" onSubmit={submit}>
      <div className="meeting-scheduler-heading">
        <div><Calendar size={19} /><strong>Select a discovery call time</strong></div>
        <span>Shown in {timezone.replaceAll('_', ' ')}</span>
      </div>

      {status === 'loading' ? (
        <div className="meeting-scheduler-state"><LoaderCircle className="meeting-spin" size={20} /> Checking live availability...</div>
      ) : status === 'empty' || status === 'error' && slots.length === 0 ? (
        <div className="meeting-scheduler-state">
          <div>
            <span>{error || 'No open times are currently available.'}</span>
            <a href="mailto:contactus@dekodeglobal.com?subject=Discovery%20call%20request">Request a callback instead</a>
          </div>
          <button type="button" className="meeting-icon-btn" onClick={loadSlots} aria-label="Reload availability" title="Reload availability"><RefreshCw size={17} /></button>
        </div>
      ) : (
        <div className="meeting-slot-grid">
          {slots.slice(0, 12).map((slot) => (
            <button key={slot.id} type="button" className={selectedSlot?.id === slot.id ? 'is-selected' : ''} onClick={() => selectSlot(slot)}>
              {slot.label}
            </button>
          ))}
        </div>
      )}

      {selectedSlot && (
        <div className="meeting-booking-fields">
          <label><span>Name</span><input value={form.name} onChange={(event) => update('name', event.target.value)} autoComplete="name" /></label>
          <label><span>Email</span><input type="email" value={form.email} onChange={(event) => update('email', event.target.value)} autoComplete="email" /></label>
          <label><span>Company <small>(optional)</small></span><input value={form.company} onChange={(event) => update('company', event.target.value)} autoComplete="organization" /></label>
          <label className="meeting-summary-field"><span>Project summary</span><textarea rows="3" value={form.projectSummary} onChange={(event) => update('projectSummary', event.target.value)} /></label>
          <label className="meeting-honeypot" aria-hidden="true"><span>Website</span><input tabIndex="-1" autoComplete="off" value={form.website} onChange={(event) => update('website', event.target.value)} /></label>
          <label className="meeting-consent"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} /><span>I consent to DEKODE using these details to arrange this meeting.</span></label>
          <button type="submit" className="meeting-book-btn" disabled={status === 'booking'}>{status === 'booking' ? <><LoaderCircle className="meeting-spin" size={17} /> Booking...</> : 'Confirm meeting'}</button>
        </div>
      )}
      {error && slots.length > 0 && <p className="meeting-scheduler-error" role="alert">{error}</p>}
    </form>
  );
}
