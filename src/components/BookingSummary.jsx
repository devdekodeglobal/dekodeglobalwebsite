import React, { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { CalendarDays, Check, CheckCircle2, Circle, Clock3, Globe2 } from 'lucide-react';
import {
  dateFromLocalKey,
  formatTimeInZone,
} from '../utils/calendarPresentation.js';
import { voiceConfig } from '../voice/config.js';

const progressLabels = ['Choose date', 'Choose time', 'Details', 'Confirm'];

export default function BookingSummary({
  slots = [],
  selectedDateKey = '',
  selectedSlotId,
  bookingComplete = false,
  compact = false,
}) {
  const reduceMotion = useReducedMotion();
  const userTimezone = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC', []);
  const selectedDate = dateFromLocalKey(selectedDateKey);
  const selectedSlot = slots.find((slot) => slot.id === selectedSlotId) || null;
  const companyTimezone = selectedSlot?.companyTimezone || slots[0]?.companyTimezone || voiceConfig.companyTimezone;
  const completedProgress = bookingComplete ? 4 : selectedSlot ? 2 : selectedDate ? 1 : 0;
  const activeProgress = bookingComplete ? 4 : selectedSlot ? 2 : selectedDate ? 1 : 0;

  return (
    <section className={`booking-summary ${compact ? 'is-compact' : ''}`} aria-label="Booking summary" aria-live="polite">
      <div className="booking-progress" aria-label={`Booking progress: ${completedProgress} of 4 steps complete`}>
        {progressLabels.map((label, index) => {
          const step = index + 1;
          const complete = step <= completedProgress;
          const active = !bookingComplete && index === activeProgress;
          return (
            <React.Fragment key={label}>
              <div className={`booking-progress-step ${complete ? 'is-complete' : ''} ${active ? 'is-active' : ''}`}>
                <span>{complete ? <Check size={12} /> : <Circle size={10} />}</span>
                <small>{label}</small>
              </div>
              {index < progressLabels.length - 1 && <i className={complete ? 'is-complete' : ''} aria-hidden="true" />}
            </React.Fragment>
          );
        })}
      </div>

      {!selectedDate ? (
        <motion.div
          className="booking-summary-empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reduceMotion ? 0 : 0.2 }}
        >
          <span><CalendarDays size={24} /></span>
          <strong>No meeting selected yet</strong>
          <p>Select a date to begin.</p>
        </motion.div>
      ) : (
        <motion.div
          key={selectedDateKey}
          className="booking-summary-selection"
          initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.22 }}
        >
          <div className="booking-summary-date">
            <span>{selectedDate.getDate()}</span>
            <div>
              <strong>{selectedDate.toLocaleDateString(undefined, { month: 'long' })}</strong>
              <small>{selectedDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric' })}</small>
            </div>
            <CheckCircle2 size={19} />
          </div>

          {selectedSlot ? (
            <motion.div
              className="booking-summary-time"
              initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.22 }}
            >
              <Clock3 size={18} />
              <span><small>Selected time</small><strong>{formatTimeInZone(selectedSlot.iso, userTimezone)}</strong><em>{userTimezone.replaceAll('_', ' ')}</em></span>
              <CheckCircle2 size={18} />
            </motion.div>
          ) : (
            <div className="booking-summary-prompt"><Clock3 size={17} /><span>Choose an available time.</span></div>
          )}

          <div className="booking-summary-timezones">
            <Globe2 size={17} />
            <div><small>Your timezone</small><strong>{userTimezone.replaceAll('_', ' ')}</strong></div>
            <div><small>Company timezone</small><strong>{companyTimezone.replaceAll('_', ' ')}</strong></div>
            {selectedSlot && <p>Local {formatTimeInZone(selectedSlot.iso, userTimezone)} equals {formatTimeInZone(selectedSlot.iso, companyTimezone)} company time.</p>}
          </div>

          {bookingComplete && <div className="booking-summary-complete"><CheckCircle2 size={18} /> Meeting confirmed</div>}
        </motion.div>
      )}
    </section>
  );
}
