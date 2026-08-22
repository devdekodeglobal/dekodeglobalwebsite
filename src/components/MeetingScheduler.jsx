import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Globe2,
  LoaderCircle,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { createMeetingSlotProvider } from "../meetings/meetingProviderFactory.js";
import { CalendarBookingService } from "../meetings/calendarBookingService.js";
import { voiceConfig } from "../voice/config.js";
import {
  dateFromLocalKey,
  formatTimeInZone,
  getTimeZoneAbbreviation,
  toLocalDateKey,
} from "../utils/calendarPresentation.js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^\+?[0-9][0-9\s().-]{6,24}$/;
const readableCompanyTimezone = (timezone) =>
  ["Asia/Kolkata", "Asia/Calcutta"].includes(timezone)
    ? "IST"
    : getTimeZoneAbbreviation(timezone);

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
  const [localSelectedDateKey, setLocalSelectedDateKey] = useState("");
  const [localSelectedSlotId, setLocalSelectedSlotId] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [consent, setConsent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    projectSummary,
    website: "",
  });
  const [touched, setTouched] = useState({});
  const [showValidationHints, setShowValidationHints] = useState(false);
  const [openPicker, setOpenPicker] = useState("date");
  const timeSectionRef = useRef(null);
  const timeRailRef = useRef(null);
  const detailsHeadingRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const timezone = useMemo(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
    [],
  );
  const provider = useMemo(
    () =>
      createMeetingSlotProvider({
        provider: voiceConfig.meetingProvider,
        companyTimezone: voiceConfig.companyTimezone,
      }),
    [],
  );
  const booking = useMemo(() => new CalendarBookingService(), []);
  const activeSelectedDateKey =
    selectedDateKey === undefined ? localSelectedDateKey : selectedDateKey;
  const activeSelectedSlotId =
    selectedSlotId === undefined ? localSelectedSlotId : selectedSlotId;
  const selectedSlot = useMemo(
    () => slots.find((slot) => slot.id === activeSelectedSlotId) || null,
    [activeSelectedSlotId, slots],
  );
  const companyTimezone =
    slots[0]?.companyTimezone || voiceConfig.companyTimezone;
  const companyTimezoneLabel = readableCompanyTimezone(companyTimezone);

  const slotsByDate = useMemo(
    () =>
      slots.reduce((groups, slot) => {
        const key = toLocalDateKey(slot.iso);
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(slot);
        return groups;
      }, new Map()),
    [slots],
  );
  const todayKey = toLocalDateKey(new Date());
  const dateRailDays = useMemo(() => {
    const availableDateKeys = [...slotsByDate.keys()].sort();
    const startDate = dateFromLocalKey(todayKey);
    const lastDate = dateFromLocalKey(availableDateKeys.at(-1));
    if (!startDate || !lastDate || lastDate < startDate) return [];

    const days = [];
    for (
      const cursor = new Date(startDate);
      cursor <= lastDate;
      cursor.setDate(cursor.getDate() + 1)
    ) {
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
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  const projectSummaryValue = form.projectSummary || "";
  const fieldErrors = useMemo(
    () => ({
      slot: selectedSlot ? "" : "Choose a meeting time first.",
      name: form.name.trim().length >= 2 ? "" : "Add your name.",
      email: emailPattern.test(form.email)
        ? ""
        : "Enter a valid email address.",
      company:
        form.company.trim().length >= 2 ? "" : "Company name is required.",
      phone: phonePattern.test(form.phone.trim())
        ? ""
        : "Enter a valid phone number. Include the country code if needed.",
      projectSummary:
        projectSummaryValue.trim().length >= 4
          ? ""
          : "Tell us what this is about.",
      consent: consent ? "" : "Please confirm consent before booking.",
    }),
    [
      consent,
      form.company,
      form.email,
      form.name,
      form.phone,
      projectSummaryValue,
      selectedSlot,
    ],
  );
  const firstValidationHint = Object.values(fieldErrors).find(Boolean) || "";
  const isFormComplete = Boolean(
    selectedSlot &&
    form.name.trim().length >= 2 &&
    emailPattern.test(form.email) &&
    form.company.trim().length >= 2 &&
    phonePattern.test(form.phone.trim()) &&
    projectSummaryValue.trim().length >= 4 &&
    consent,
  );
  const canSubmit = isFormComplete && status !== "booking";

  const selectSlot = useCallback(
    (slot) => {
      setLocalSelectedSlotId(slot?.id || null);
      onSlotSelect?.(slot);
      setError("");
    },
    [onSlotSelect],
  );

  const selectDate = useCallback(
    (dateKey) => {
      setLocalSelectedDateKey(dateKey || "");
      onDateSelect?.(dateKey || "");
      selectSlot(null);
      setError("");
    },
    [onDateSelect, selectSlot],
  );

  const loadSlots = useCallback(async () => {
    setStatus("loading");
    setError("");
    selectDate("");
    selectSlot(null);
    try {
      const nextSlots = [
        ...(await provider.getAvailableSlots(undefined, timezone)),
      ].sort((left, right) => Date.parse(left.iso) - Date.parse(right.iso));
      setSlots(nextSlots);
      onSlotsChange?.(nextSlots);
      setOpenPicker(nextSlots.length ? "date" : "");
      setStatus(nextSlots.length ? "ready" : "empty");
    } catch (nextError) {
      setSlots([]);
      onSlotsChange?.([]);
      setError(nextError.message);
      setStatus("error");
    }
  }, [onSlotsChange, provider, selectDate, selectSlot, timezone]);

  useEffect(() => {
    loadSlots();
  }, [loadSlots]);

  useEffect(() => {
    if (!activeSelectedDateKey || selectedSlot || !timeSectionRef.current)
      return;
    const frame = requestAnimationFrame(() =>
      timeSectionRef.current?.focus({ preventScroll: true }),
    );
    return () => cancelAnimationFrame(frame);
  }, [activeSelectedDateKey, selectedSlot]);

  useEffect(() => {
    timeRailRef.current?.scrollTo({ left: 0, behavior: "auto" });
  }, [activeSelectedDateKey]);

  useEffect(() => {
    if (!selectedSlot || !detailsHeadingRef.current) return;
    const frame = requestAnimationFrame(() =>
      detailsHeadingRef.current?.focus({ preventScroll: true }),
    );
    return () => cancelAnimationFrame(frame);
  }, [selectedSlot]);

  const update = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
    setError("");
  };
  const markTouched = (key) =>
    setTouched((current) => ({ ...current, [key]: true }));
  const shouldShowFieldError = (key) =>
    Boolean((showValidationHints || touched[key]) && fieldErrors[key]);
  const togglePicker = (picker) => {
    if (picker === "time" && !activeSelectedDateKey) return;
    setOpenPicker((current) => (current === picker ? "" : picker));
  };
  const handleDateSelect = (dateKey) => {
    selectDate(dateKey);
    setOpenPicker("time");
  };
  const handleSlotSelect = (slot) => {
    selectSlot(slot);
    setOpenPicker("");
  };
  const submit = async (event) => {
    event.preventDefault();
    setShowValidationHints(true);
    if (!selectedSlot) return setError("Choose a meeting time first.");
    if (
      form.name.trim().length < 2 ||
      !emailPattern.test(form.email) ||
      form.company.trim().length < 2 ||
      !phonePattern.test(form.phone.trim()) ||
      projectSummaryValue.trim().length < 4
    ) {
      return setError(
        "Add your name, valid email, company, phone number, and what this is about.",
      );
    }
    if (!consent) return setError("Please confirm consent before booking.");
    if (selectedSlot.isMock) {
      return setError(
        "This is a preview slot only. Connect the Google Calendar environment variables to accept bookings.",
      );
    }
    setStatus("booking");
    setError("");
    try {
      const result = await booking.book({
        slot: selectedSlot,
        ...form,
        timezone,
        consent,
      });
      setStatus("booked");
      onBooked?.(result, selectedSlot);
    } catch (nextError) {
      setError(nextError.message);
      setStatus("error");
      if (nextError.status === 409) loadSlots();
    }
  };

  if (status === "booked") {
    return (
      <div className="meeting-scheduler-success">
        <CheckCircle2 size={30} />
        <strong>Discovery call booked</strong>
        <span>A calendar invitation is on its way to your email.</span>
      </div>
    );
  }

  return (
    <form
      className={`meeting-scheduler ${activeSelectedDateKey ? "has-selected-date" : ""}`}
      onSubmit={submit}
    >
      <header className="meeting-scheduler-heading">
        <div>
          <span className="meeting-scheduler-eyebrow"> Discovery Call</span>
          <strong>Book 30 minutes with DEKODE</strong>
          <small>A quick, focused conversation about your project.</small>
        </div>
        <span className="meeting-duration-chip">
          <i aria-hidden="true" />
          30 min · Video call
        </span>
      </header>

      <aside
        className="meeting-availability-card"
        aria-label="DEKODE availability and timezone information"
      >
        <div>
          <CalendarDays size={14} />
          <strong>Mon-Fri</strong>
        </div>
        <div>
          <Clock3 size={14} />
          <strong>9:00-17:00</strong>
          <span>{companyTimezoneLabel}</span>
        </div>
        <div className="meeting-timezone-copy">
          <Globe2 size={14} />
          <span>Shown in</span>
          <strong>{timezone.replaceAll("_", " ")}</strong>
        </div>
      </aside>

      <div className="meeting-when-wrap">
        <div
          className="meeting-when-row"
          role="group"
          aria-label="Choose meeting date and time"
        >
          <button
            type="button"
            className={`meeting-when-field ${activeSelectedDateKey ? "is-filled" : ""} ${openPicker === "date" ? "is-open" : ""}`}
            onClick={() => togglePicker("date")}
            aria-expanded={openPicker === "date"}
            aria-controls="meeting-date-picker-panel"
          >
            <CalendarDays size={16} />
            <span>
              <small>Date</small>
              <strong>
                {selectedDate
                  ? selectedDate.toLocaleDateString(undefined, {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })
                  : "Select date"}
              </strong>
            </span>
            <ChevronDown
              className="meeting-when-chevron"
              size={15}
              aria-hidden="true"
            />
          </button>
          <span className="meeting-when-divider" aria-hidden="true" />
          <button
            type="button"
            className={`meeting-when-field ${selectedSlot ? "is-filled" : ""} ${openPicker === "time" ? "is-open" : ""}`}
            disabled={!activeSelectedDateKey}
            onClick={() => togglePicker("time")}
            aria-expanded={openPicker === "time"}
            aria-controls="meeting-time-picker-panel"
          >
            <Clock3 size={16} />
            <span>
              <small>Time</small>
              <strong>
                {selectedSlot
                  ? formatTimeInZone(selectedSlot.iso, timezone)
                  : "Select time"}
              </strong>
            </span>
            <ChevronDown
              className="meeting-when-chevron"
              size={15}
              aria-hidden="true"
            />
          </button>
        </div>

        <AnimatePresence initial={false}>
          {openPicker && (
            <motion.div
              key={openPicker}
              id={
                openPicker === "date"
                  ? "meeting-date-picker-panel"
                  : "meeting-time-picker-panel"
              }
              className="meeting-when-panel"
              initial={{ opacity: 0, height: 0, y: reduceMotion ? 0 : -4 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: reduceMotion ? 0 : -4 }}
              transition={{ duration: reduceMotion ? 0 : 0.24 }}
            >
              <div className="meeting-when-panel-inner">
                {status === "loading" ? (
                  <div className="meeting-scheduler-state">
                    <LoaderCircle className="meeting-spin" size={20} /> Checking
                    live availability...
                  </div>
                ) : status === "empty" ||
                  (status === "error" && slots.length === 0) ? (
                  <div className="meeting-scheduler-state">
                    <div>
                      <span>
                        {error || "No open times are currently available."}
                      </span>
                      <a href="mailto:contactus@dekodeglobal.com?subject=Discovery%20call%20request">
                        Request a callback instead
                      </a>
                    </div>
                    <button
                      type="button"
                      className="meeting-icon-btn"
                      onClick={loadSlots}
                      aria-label="Reload availability"
                      title="Reload availability"
                    >
                      <RefreshCw size={17} />
                    </button>
                  </div>
                ) : openPicker === "date" ? (
                  <div
                    className="meeting-date-rail"
                    role="group"
                    aria-label="Available meeting dates"
                  >
                    {dateRailDays.map(({ date, dateKey }) => {
                      const hasSlots = slotsByDate.has(dateKey);
                      const fullDate = date.toLocaleDateString(undefined, {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      });
                      return (
                        <button
                          type="button"
                          key={dateKey}
                          className={`${activeSelectedDateKey === dateKey ? "is-selected" : ""} ${todayKey === dateKey ? "is-today" : ""}`}
                          disabled={!hasSlots}
                          onClick={() => handleDateSelect(dateKey)}
                          aria-label={`${fullDate}${hasSlots ? ", times available" : ", unavailable"}`}
                          aria-pressed={activeSelectedDateKey === dateKey}
                          aria-current={
                            todayKey === dateKey ? "date" : undefined
                          }
                        >
                          <small>
                            {date.toLocaleDateString(undefined, {
                              weekday: "short",
                            })}
                          </small>
                          <strong>{date.getDate()}</strong>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div
                    className="meeting-time-picker"
                    ref={timeSectionRef}
                    tabIndex="-1"
                  >
                    <div className="meeting-section-heading">
                      <span>
                        <strong id="meeting-time-title">
                          Choose an available time
                        </strong>
                      </span>
                      <em>{selectedDateLabel}</em>
                    </div>
                    <div
                      ref={timeRailRef}
                      className="meeting-time-rail"
                      role="group"
                      aria-label={`Available times for ${selectedDateLabel}`}
                    >
                      {selectedDateSlots.map((slot) => (
                        <button
                          key={slot.id}
                          type="button"
                          className={
                            selectedSlot?.id === slot.id ? "is-selected" : ""
                          }
                          onClick={() => handleSlotSelect(slot)}
                          aria-pressed={selectedSlot?.id === slot.id}
                        >
                          {formatTimeInZone(slot.iso, timezone)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {status !== "loading" &&
      (status === "empty" || (status === "error" && slots.length === 0)) &&
      !openPicker ? (
        <div className="meeting-scheduler-state">
          <div>
            <span>{error || "No open times are currently available."}</span>
            <a href="mailto:contactus@dekodeglobal.com?subject=Discovery%20call%20request">
              Request a callback instead
            </a>
          </div>
          <button
            type="button"
            className="meeting-icon-btn"
            onClick={loadSlots}
            aria-label="Reload availability"
            title="Reload availability"
          >
            <RefreshCw size={17} />
          </button>
        </div>
      ) : null}

      {slots.length > 0 && (
        <motion.div
          className={`meeting-details-stage ${selectedSlot ? "is-unlocked" : "is-locked"}`}
          initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
          animate={{ opacity: selectedSlot ? 1 : 0.58, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.24 }}
        >
          <div
            className="meeting-details-heading"
            ref={detailsHeadingRef}
            tabIndex="-1"
          >
            <span>
              <strong>Your details</strong>
            </span>
            {selectedSlot ? (
              <span className="meeting-selection-confirmed">
                <CheckCircle2 size={16} /> {selectedDateLabel},{" "}
                {formatTimeInZone(selectedSlot.iso, timezone)}
              </span>
            ) : (
              <span className="meeting-details-locked">
                <Clock3 size={15} /> Pick a date and time
              </span>
            )}
          </div>
          <fieldset
            className="meeting-booking-fields"
            disabled={!selectedSlot}
            aria-disabled={!selectedSlot}
          >
            <label
              className={`meeting-booking-field ${shouldShowFieldError("name") ? "has-error" : ""}`}
            >
              <input
                required
                placeholder="Name"
                aria-label="Name"
                value={form.name}
                onBlur={() => markTouched("name")}
                onChange={(event) => update("name", event.target.value)}
                autoComplete="name"
                aria-invalid={shouldShowFieldError("name")}
              />
            </label>
            <label
              className={`meeting-booking-field ${shouldShowFieldError("email") ? "has-error" : ""}`}
            >
              <input
                required
                type="email"
                placeholder="Email"
                aria-label="Email"
                value={form.email}
                onBlur={() => markTouched("email")}
                onChange={(event) => update("email", event.target.value)}
                autoComplete="email"
                aria-invalid={shouldShowFieldError("email")}
              />
            </label>
            <label
              className={`meeting-booking-field ${shouldShowFieldError("company") ? "has-error" : ""}`}
            >
              <input
                required
                placeholder="Company"
                aria-label="Company"
                value={form.company}
                onBlur={() => markTouched("company")}
                onChange={(event) => update("company", event.target.value)}
                autoComplete="organization"
                aria-invalid={shouldShowFieldError("company")}
              />
            </label>
            <label
              className={`meeting-booking-field ${shouldShowFieldError("phone") ? "has-error" : ""}`}
            >
              <input
                required
                type="tel"
                placeholder="Phone number"
                aria-label="Phone number"
                value={form.phone}
                onBlur={() => markTouched("phone")}
                onChange={(event) => update("phone", event.target.value)}
                autoComplete="tel"
                inputMode="tel"
                aria-invalid={shouldShowFieldError("phone")}
              />
            </label>
            <label
              className={`meeting-booking-field meeting-summary-field ${shouldShowFieldError("projectSummary") ? "has-error" : ""}`}
            >
              <textarea
                required
                rows="3"
                placeholder="What's this about?"
                aria-label="What's this about?"
                value={projectSummaryValue}
                onBlur={() => markTouched("projectSummary")}
                onChange={(event) =>
                  update("projectSummary", event.target.value)
                }
                aria-invalid={shouldShowFieldError("projectSummary")}
              />
            </label>
            <label className="meeting-honeypot" aria-hidden="true">
              <span>Website</span>
              <input
                tabIndex="-1"
                autoComplete="off"
                value={form.website}
                onChange={(event) => update("website", event.target.value)}
              />
            </label>
            <label
              className={`meeting-consent ${shouldShowFieldError("consent") ? "has-error" : ""}`}
            >
              <input
                required
                type="checkbox"
                checked={consent}
                onBlur={() => markTouched("consent")}
                onChange={(event) => {
                  setConsent(event.target.checked);
                  setError("");
                }}
              />
              <span>
                I consent to DEKODE using these details to arrange this meeting.{" "}
                <i aria-hidden="true">*</i>
              </span>
            </label>
            <div
              className="meeting-book-action"
              onClick={() => {
                if (!canSubmit) setShowValidationHints(true);
              }}
            >
              <button
                type="submit"
                className="meeting-book-btn"
                disabled={!canSubmit}
                aria-describedby={
                  !canSubmit && firstValidationHint
                    ? "meeting-submit-hint"
                    : undefined
                }
              >
                {status === "booking" ? (
                  <>
                    <LoaderCircle className="meeting-spin" size={17} />{" "}
                    Booking...
                  </>
                ) : (
                  "Confirm meeting"
                )}
              </button>
            </div>
          </fieldset>
        </motion.div>
      )}
      {error && slots.length > 0 && (
        <p className="meeting-scheduler-error" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
