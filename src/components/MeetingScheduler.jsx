import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Globe2,
  LoaderCircle,
  RefreshCw,
} from 'lucide-react';
import { createMeetingSlotProvider } from '../meetings/meetingProviderFactory.js';
import { CalendarBookingService } from '../meetings/calendarBookingService.js';
import { voiceConfig } from '../voice/config.js';
import BookingSummary from './BookingSummary.jsx';
import {
  dateFromLocalKey,
  formatTimeInZone,
  getTimeZoneAbbreviation,
  toLocalDateKey,
} from '../utils/calendarPresentation.js';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^\+?[0-9][0-9\s().-]{6,24}$/;
const readableCompanyTimezone = (timezone) => (
  ['Asia/Kolkata', 'Asia/Calcutta'].includes(timezone) ? 'IST' : getTimeZoneAbbreviation(timezone)
);

export default function MeetingScheduler({
  projectSummary,
  onBooked,
  selectedDateKey,
  onDateSelect,
  selectedSlotId,
  onSlotSelect,
  onSlotsChange,
}) {
  const [slots, setSlots] = useState([]);
  const [localSelectedDateKey, setLocalSelectedDateKey] = useState('');
  const [localSelectedSlotId, setLocalSelectedSlotId] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [consent, setConsent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', company: '', phone: '', projectSummary, website: '' });
  const timeSectionRef = useRef(null);
  const detailsHeadingRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const timezone = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC', []);
  const provider = useMemo(() => createMeetingSlotProvider({
    provider: voiceConfig.meetingProvider,
    companyTimezone: voiceConfig.companyTimezone,
  }), []);
  const booking = useMemo(() => new CalendarBookingService(), []);
  const activeSelectedDateKey = selectedDateKey === undefined ? localSelectedDateKey : selectedDateKey;
  const activeSelectedSlotId = selectedSlotId === undefined ? localSelectedSlotId : selectedSlotId;
  const selectedSlot = useMemo(
    () => slots.find((slot) => slot.id === activeSelectedSlotId) || null,
    [activeSelectedSlotId, slots],
  );
  const companyTimezone = slots[0]?.companyTimezone || voiceConfig.companyTimezone;
  const companyTimezoneLabel = readableCompanyTimezone(companyTimezone);

  const slotsByDate = useMemo(() => slots.reduce((groups, slot) => {
    const key = toLocalDateKey(slot.iso);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(slot);
    return groups;
  }, new Map()), [slots]);
  const todayKey = toLocalDateKey(new Date());
  const dateRailDays = useMemo(() => {
    const availableDateKeys = [...slotsByDate.keys()].sort();
    const startDate = dateFromLocalKey(todayKey);
    const lastDate = dateFromLocalKey(availableDateKeys.at(-1));
    if (!startDate || !lastDate || lastDate < startDate) return [];

    const days = [];
    for (const cursor = new Date(startDate); cursor <= lastDate; cursor.setDate(cursor.getDate() + 1)) {
      days.push({
        date: new Date(cursor),
        dateKey: toLocalDateKey(cursor),
      });
    }
    return days;
  }, [slotsByDate, todayKey]);
  const selectedDateSlots = slotsByDate.get(activeSelectedDateKey) || [];
  const selectedDate = dateFromLocalKey(activeSelectedDateKey);
  const selectedDateLabel = selectedDate?.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const selectSlot = useCallback((slot) => {
    setLocalSelectedSlotId(slot?.id || null);
    onSlotSelect?.(slot);
    setError('');
  }, [onSlotSelect]);

  const selectDate = useCallback((dateKey) => {
    setLocalSelectedDateKey(dateKey || '');
    onDateSelect?.(dateKey || '');
    selectSlot(null);
    setError('');
  }, [onDateSelect, selectSlot]);

  const loadSlots = useCallback(async () => {
    setStatus('loading');
    setError('');
    selectDate('');
    selectSlot(null);
    try {
      const nextSlots = [...await provider.getAvailableSlots(undefined, timezone)]
        .sort((left, right) => Date.parse(left.iso) - Date.parse(right.iso));
      setSlots(nextSlots);
      onSlotsChange?.(nextSlots);
      const firstAvailableDateKey = nextSlots.map((slot) => toLocalDateKey(slot.iso)).sort()[0];
      if (firstAvailableDateKey) selectDate(firstAvailableDateKey);
      setStatus(nextSlots.length ? 'ready' : 'empty');
    } catch (nextError) {
      setSlots([]);
      onSlotsChange?.([]);
      setError(nextError.message);
      setStatus('error');
    }
  }, [onSlotsChange, provider, selectDate, selectSlot, timezone]);

  useEffect(() => { loadSlots(); }, [loadSlots]);

  useEffect(() => {
    if (!activeSelectedDateKey || selectedSlot || !timeSectionRef.current) return;
    const frame = requestAnimationFrame(() => timeSectionRef.current?.focus({ preventScroll: true }));
    return () => cancelAnimationFrame(frame);
  }, [activeSelectedDateKey, selectedSlot]);

  useEffect(() => {
    if (!selectedSlot || !detailsHeadingRef.current) return;
    const frame = requestAnimationFrame(() => detailsHeadingRef.current?.focus({ preventScroll: true }));
    return () => cancelAnimationFrame(frame);
  }, [selectedSlot]);

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const submit = async (event) => {
    event.preventDefault();
    if (!selectedSlot) return setError('Choose a meeting time first.');
    if (form.name.trim().length < 2 || !emailPattern.test(form.email) || form.company.trim().length < 2 || !phonePattern.test(form.phone.trim()) || form.projectSummary.trim().length < 4) {
      return setError('Add your name, valid email, company, phone number, and a short project summary.');
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
    <form className={`meeting-scheduler ${activeSelectedDateKey ? 'has-selected-date' : ''}`} onSubmit={submit}>
      <header className="meeting-scheduler-heading">
        <div>
          <strong>Book a discovery call</strong>
          <small>30 minutes with the DEKODE team</small>
        </div>
        <span className="meeting-duration-chip"><i aria-hidden="true" />30 min · Video call</span>
      </header>

      <aside className="meeting-availability-card" aria-label="DEKODE availability and timezone information">
        <div><CalendarDays size={14} /><strong>Mon-Fri</strong></div>
        <div><Clock3 size={14} /><strong>9:00-17:00</strong><span>{companyTimezoneLabel}</span></div>
        <div className="meeting-timezone-copy"><Globe2 size={14} /><span>Shown in</span><strong>{timezone.replaceAll('_', ' ')}</strong></div>
      </aside>

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
        <section className="meeting-calendar" aria-labelledby="meeting-calendar-title">
          <div className="meeting-calendar-header">
            <div><strong id="meeting-calendar-title">Choose a date</strong></div>
          </div>
          <div className="meeting-date-rail" role="group" aria-label="Available meeting dates">
            {dateRailDays.map(({ date, dateKey }) => {
              const hasSlots = slotsByDate.has(dateKey);
              const fullDate = date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
              return (
                <button
                  type="button"
                  key={dateKey}
                  className={`${activeSelectedDateKey === dateKey ? 'is-selected' : ''} ${todayKey === dateKey ? 'is-today' : ''}`}
                  disabled={!hasSlots}
                  onClick={() => selectDate(dateKey)}
                  aria-label={`${fullDate}${hasSlots ? ', times available' : ', unavailable'}`}
                  aria-pressed={activeSelectedDateKey === dateKey}
                  aria-current={todayKey === dateKey ? 'date' : undefined}
                >
                  <small>{date.toLocaleDateString(undefined, { weekday: 'short' })}</small>
                  <strong>{date.getDate()}</strong>
                  <span>{date.toLocaleDateString(undefined, { month: 'short' })}</span>
                </button>
              );
            })}
          </div>
          <div className="meeting-calendar-legend"><span><i /> Available</span><span><i /> Today</span></div>
        </section>
      )}

      <AnimatePresence initial={false}>
        {activeSelectedDateKey && status !== 'loading' && (
          <motion.section
            key={activeSelectedDateKey}
            className="meeting-time-section"
            ref={timeSectionRef}
            tabIndex="-1"
            aria-labelledby="meeting-time-title"
            initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduceMotion ? 0 : -6 }}
            transition={{ duration: reduceMotion ? 0 : 0.22 }}
          >
            <div className="meeting-section-heading"><span><strong id="meeting-time-title">Choose an available time</strong></span><em>{selectedDateLabel}</em></div>
            <div className="meeting-time-rail" role="group" aria-label={`Available times for ${selectedDateLabel}`}>
              {selectedDateSlots.map((slot) => (
                <button key={slot.id} type="button" className={selectedSlot?.id === slot.id ? 'is-selected' : ''} onClick={() => selectSlot(slot)} aria-pressed={selectedSlot?.id === slot.id}>
                  {formatTimeInZone(slot.iso, timezone)}
                </button>
              ))}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {slots.length > 0 && (
        <motion.div
          className={`meeting-details-stage ${selectedSlot ? 'is-unlocked' : 'is-locked'}`}
          initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
          animate={{ opacity: selectedSlot ? 1 : 0.58, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.24 }}
        >
            <div className="meeting-details-heading" ref={detailsHeadingRef} tabIndex="-1">
              <span><strong>Review and complete your details</strong></span>
              {selectedSlot ? (
                <span className="meeting-selection-confirmed"><CheckCircle2 size={16} /> {selectedDateLabel}, {formatTimeInZone(selectedSlot.iso, timezone)}</span>
              ) : (
                <span className="meeting-details-locked"><Clock3 size={15} /> Choose a time to unlock</span>
              )}
            </div>
            <fieldset className="meeting-booking-fields" disabled={!selectedSlot} aria-disabled={!selectedSlot}>
              <label className="meeting-floating-field"><span>Name</span><input required placeholder=" " value={form.name} onChange={(event) => update('name', event.target.value)} autoComplete="name" /></label>
              <label className="meeting-floating-field"><span>Email</span><input required type="email" placeholder=" " value={form.email} onChange={(event) => update('email', event.target.value)} autoComplete="email" /></label>
              <label className="meeting-floating-field"><span>Company</span><input required placeholder=" " value={form.company} onChange={(event) => update('company', event.target.value)} autoComplete="organization" /></label>
              <label className="meeting-floating-field"><span>Phone number</span><input required type="tel" placeholder=" " value={form.phone} onChange={(event) => update('phone', event.target.value)} autoComplete="tel" inputMode="tel" /></label>
              <label className="meeting-summary-field meeting-floating-field"><span>Project summary</span><textarea required rows="3" placeholder=" " value={form.projectSummary} onChange={(event) => update('projectSummary', event.target.value)} /></label>
              <label className="meeting-honeypot" aria-hidden="true"><span>Website</span><input tabIndex="-1" autoComplete="off" value={form.website} onChange={(event) => update('website', event.target.value)} /></label>
              <label className="meeting-consent"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} /><span>I consent to DEKODE using these details to arrange this meeting.</span></label>
              <button type="submit" className="meeting-book-btn" disabled={status === 'booking'}>{status === 'booking' ? <><LoaderCircle className="meeting-spin" size={17} /> Booking...</> : 'Confirm meeting'}</button>
            </fieldset>
        </motion.div>
      )}
      <div className="meeting-mobile-summary">
        <BookingSummary
          compact
          slots={slots}
          selectedDateKey={activeSelectedDateKey}
          selectedSlotId={activeSelectedSlotId}
        />
      </div>
      {error && slots.length > 0 && <p className="meeting-scheduler-error" role="alert">{error}</p>}
    </form>
  );
}
