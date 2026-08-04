import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
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
const weekdayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

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
  const [viewDate, setViewDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [consent, setConsent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', company: '', projectSummary, website: '' });
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
  const companyTimezoneLabel = getTimeZoneAbbreviation(companyTimezone);

  const slotsByDate = useMemo(() => slots.reduce((groups, slot) => {
    const key = toLocalDateKey(slot.iso);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(slot);
    return groups;
  }, new Map()), [slots]);
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

  const currentYear = new Date().getFullYear();
  const availableYears = [...new Set([
    currentYear,
    currentYear + 1,
    currentYear + 2,
    viewDate.getFullYear(),
    ...slots.map((slot) => new Date(slot.iso).getFullYear()),
  ])].filter(Number.isFinite).sort((a, b) => a - b);
  const firstWeekday = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();
  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
  const calendarDays = Array.from({ length: 42 }, (_, index) => {
    const day = index - firstWeekday + 1;
    return day >= 1 && day <= daysInMonth ? day : null;
  });
  const visibleDatePrefix = `${viewDate.getFullYear()}-${String(viewDate.getMonth() + 1).padStart(2, '0')}`;
  const todayKey = toLocalDateKey(new Date());
  const monthOptions = Array.from({ length: 12 }, (_, month) => ({
    value: month,
    label: new Intl.DateTimeFormat(undefined, { month: 'long' }).format(new Date(2020, month, 1)),
  }));
  const moveMonth = (offset) => setViewDate((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1));

  return (
    <form className="meeting-scheduler" onSubmit={submit}>
      <header className="meeting-scheduler-heading">
        <div>
          <span className="meeting-heading-icon"><CalendarDays size={19} /></span>
          <span><strong>Book a discovery call</strong><small>Start with a date. We will guide you from there.</small></span>
        </div>
      </header>

      <aside className="meeting-availability-card" aria-label="DEKODE availability and timezone information">
        <div><CalendarDays size={16} /><span><small>Working days</small><strong>Monday - Friday</strong></span></div>
        <div><Clock3 size={16} /><span><small>Working hours</small><strong>9:00 AM - 5:00 PM {companyTimezoneLabel}</strong></span></div>
        <div className="meeting-timezone-copy"><Globe2 size={16} /><span><small>Times shown in</small><strong>{timezone.replaceAll('_', ' ')}</strong><em>Converted from {companyTimezone.replaceAll('_', ' ')}</em></span></div>
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
            <div><small>Step 1</small><strong id="meeting-calendar-title">Choose a date</strong></div>
            <div className="meeting-calendar-navigation">
              <button type="button" onClick={() => moveMonth(-1)} aria-label="Previous month" title="Previous month"><ChevronLeft size={17} /></button>
              <select value={viewDate.getMonth()} onChange={(event) => setViewDate(new Date(viewDate.getFullYear(), Number(event.target.value), 1))} aria-label="Calendar month">
                {monthOptions.map((month) => <option key={month.value} value={month.value}>{month.label}</option>)}
              </select>
              <select value={viewDate.getFullYear()} onChange={(event) => setViewDate(new Date(Number(event.target.value), viewDate.getMonth(), 1))} aria-label="Calendar year">
                {availableYears.map((year) => <option key={year} value={year}>{year}</option>)}
              </select>
              <button type="button" onClick={() => moveMonth(1)} aria-label="Next month" title="Next month"><ChevronRight size={17} /></button>
            </div>
          </div>
          <div className="meeting-calendar-grid">
            {weekdayLabels.map((day, index) => <span className="meeting-calendar-weekday" key={`${day}-${index}`}>{day}</span>)}
            {calendarDays.map((day, index) => {
              if (!day) return <span key={`empty-${index}`} aria-hidden="true" />;
              const dateKey = `${visibleDatePrefix}-${String(day).padStart(2, '0')}`;
              const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day, 12);
              const isWeekend = date.getDay() === 0 || date.getDay() === 6;
              const hasSlots = slotsByDate.has(dateKey);
              const unavailable = isWeekend || !hasSlots;
              const fullDate = date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
              return (
                <button
                  type="button"
                  key={dateKey}
                  className={`${activeSelectedDateKey === dateKey ? 'is-selected' : ''} ${todayKey === dateKey ? 'is-today' : ''}`}
                  disabled={unavailable}
                  onClick={() => selectDate(dateKey)}
                  aria-label={`${fullDate}${hasSlots ? ', times available' : ', unavailable'}`}
                  aria-pressed={activeSelectedDateKey === dateKey}
                >
                  {day}
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
            <div className="meeting-section-heading"><span><small>Step 2</small><strong id="meeting-time-title">Choose an available time</strong></span><em>{selectedDateLabel}</em></div>
            <div className="meeting-time-grid">
              {selectedDateSlots.map((slot) => (
                <button key={slot.id} type="button" className={selectedSlot?.id === slot.id ? 'is-selected' : ''} onClick={() => selectSlot(slot)} aria-pressed={selectedSlot?.id === slot.id}>
                  {formatTimeInZone(slot.iso, timezone)}
                </button>
              ))}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <div className="meeting-mobile-summary">
        <BookingSummary
          compact
          slots={slots}
          selectedDateKey={activeSelectedDateKey}
          selectedSlotId={activeSelectedSlotId}
        />
      </div>

      <AnimatePresence initial={false}>
        {selectedSlot && (
          <motion.div
            className="meeting-details-stage"
            initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.24 }}
          >
            <div className="meeting-details-heading" ref={detailsHeadingRef} tabIndex="-1">
              <span><small>Steps 3 and 4</small><strong>Review and complete your details</strong></span>
              <span className="meeting-selection-confirmed"><CheckCircle2 size={16} /> {selectedDateLabel}, {formatTimeInZone(selectedSlot.iso, timezone)}</span>
            </div>
            <div className="meeting-booking-fields">
              <label><span>Name</span><input value={form.name} onChange={(event) => update('name', event.target.value)} autoComplete="name" /></label>
              <label><span>Email</span><input type="email" value={form.email} onChange={(event) => update('email', event.target.value)} autoComplete="email" /></label>
              <label><span>Company <small>(optional)</small></span><input value={form.company} onChange={(event) => update('company', event.target.value)} autoComplete="organization" /></label>
              <label className="meeting-summary-field"><span>Project summary</span><textarea rows="3" value={form.projectSummary} onChange={(event) => update('projectSummary', event.target.value)} /></label>
              <label className="meeting-honeypot" aria-hidden="true"><span>Website</span><input tabIndex="-1" autoComplete="off" value={form.website} onChange={(event) => update('website', event.target.value)} /></label>
              <label className="meeting-consent"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} /><span>I consent to DEKODE using these details to arrange this meeting.</span></label>
              <button type="submit" className="meeting-book-btn" disabled={status === 'booking'}>{status === 'booking' ? <><LoaderCircle className="meeting-spin" size={17} /> Booking...</> : 'Confirm meeting'}</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {error && slots.length > 0 && <p className="meeting-scheduler-error" role="alert">{error}</p>}
    </form>
  );
}
