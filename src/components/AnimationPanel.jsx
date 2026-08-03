import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDays, CheckCircle2, ChevronLeft, ChevronRight, Clock, Server, Database, Cloud, Shield, ShoppingCart, GitMerge, FileText, MessageSquare, Bot, Wrench, Layers } from 'lucide-react';
import { resolveVisualMode } from '../utils/visualIntent';

const CodeLine = ({ delay = 0, width = "100%", color = "rgba(255,255,255,0.2)" }) => (
  <motion.div 
    initial={{ width: 0, opacity: 0 }}
    animate={{ width, opacity: 1 }}
    transition={{ delay, duration: 0.5 }}
    style={{ height: '6px', background: color, borderRadius: '3px', marginBottom: '8px' }}
  />
);

// --- Domain Specific Animations ---

const Node = ({ delay, icon: Icon, title, color, x, y }) => (
  <motion.div
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ type: "spring", delay }}
    style={{
      position: 'absolute', top: y, left: x,
      background: 'rgba(15, 23, 42, 0.9)', border: `2px solid ${color}`, borderRadius: '12px',
      padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: `0 8px 20px rgba(0,0,0,0.5)`, zIndex: 10
    }}
    title={title}
  >
    <div style={{ color: color }}>
      <Icon size={28} strokeWidth={2.5} />
    </div>
  </motion.div>
);

const Path = ({ delay, d, active }) => (
  <>
    <motion.path
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1, delay }}
      d={d} stroke="rgba(255,255,255,0.2)" strokeWidth="2" fill="none"
    />
    {active && (
      <motion.circle r="3" fill="#22c55e" filter="blur(1px)">
        <animateMotion dur="2s" repeatCount="indefinite" path={d} />
      </motion.circle>
    )}
  </>
);

const AIAgentAnimation = ({ level }) => {
  return (
    <div className="ai-agent-container" style={{ position: 'relative', width: '100%', background: 'transparent' }}>
      <div className="ai-agent-scaler" style={{ position: 'absolute', top: '15px', left: '50%', width: '480px', height: '260px', marginLeft: '-240px', transformOrigin: 'top center' }}>
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0, overflow: 'visible' }}>
          {/* Connection to Agent */}
          {level >= 2 && <Path delay={0.2} d="M 50 100 C 90 100, 110 100, 150 100" active={level >= 3} />}
          
          {/* Connections to Tools */}
          {level >= 3 && (
            <>
              <Path delay={0.4} d="M 178 128 C 178 180, 80 160, 80 200" active={level >= 4} />
              <Path delay={0.5} d="M 178 128 C 178 180, 178 180, 178 200" active={level >= 4} />
              <Path delay={0.6} d="M 178 128 C 178 180, 276 160, 276 200" active={level >= 4} />
            </>
          )}

          {/* Connection to Condition */}
          {level >= 4 && <Path delay={0.2} d="M 206 100 C 250 100, 260 100, 300 100" active={true} />}
          
          {/* Connections from Condition */}
          {level >= 4 && (
            <>
              <Path delay={0.6} d="M 356 100 C 390 100, 390 60, 420 60" active={true} />
              <Path delay={0.8} d="M 356 100 C 390 100, 390 140, 420 140" active={true} />
            </>
          )}
        </svg>

        {/* Level 1: Trigger */}
        <Node delay={0} icon={FileText} title="Webhook" color="var(--color-brand-blue)" x={0} y={72} />

        {/* Level 2: Core Agent */}
        {level >= 2 && (
          <Node delay={0.5} icon={Bot} title="AI Brain" color="#8b5cf6" x={150} y={72} />
        )}

        {/* Level 3: Tools */}
        {level >= 3 && (
          <>
            <Node delay={0.4} icon={Layers} title="Memory DB" color="var(--color-brand-blue)" x={52} y={200} />
            <Node delay={0.5} icon={Server} title="LLM Model" color="#f59e0b" x={150} y={200} />
            <Node delay={0.6} icon={Wrench} title="Search Tool" color="#10b981" x={248} y={200} />
          </>
        )}

        {/* Level 4: Logic & Actions */}
        {level >= 4 && (
          <>
            <Node delay={0.4} icon={GitMerge} title="Condition" color="#f43f5e" x={300} y={72} />
            <Node delay={0.8} icon={MessageSquare} title="Chat Alert" color="#eab308" x={420} y={32} />
            <Node delay={1.0} icon={Database} title="Update CRM" color="var(--color-brand-blue)" x={420} y={112} />
          </>
        )}
      </div>
    </div>
  );
};

const CloudInfraAnimation = ({ level }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '300px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'relative', width: '300px', height: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        
        {/* Network Lines */}
        {level >= 3 && (
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0, overflow: 'visible' }}>
            <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5 }} d="M 150 150 C 50 150, 50 50, 50 50" stroke="rgba(53, 118, 193, 0.5)" strokeWidth="2" fill="none" />
            <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 0.2 }} d="M 150 150 C 250 150, 250 50, 250 50" stroke="rgba(53, 118, 193, 0.5)" strokeWidth="2" fill="none" />
            <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 0.4 }} d="M 150 150 C 50 150, 50 250, 50 250" stroke="rgba(53, 118, 193, 0.5)" strokeWidth="2" fill="none" />
          </svg>
        )}

      {/* Level 1 & 2: Server Rack */}
      <div style={{ background: '#0f172a', padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {[3, 2, 1].map((row) => (
          <motion.div 
            key={row}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 * row }}
            style={{ width: '120px', height: '24px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', display: 'flex', alignItems: 'center', padding: '0 8px', gap: '6px' }}
          >
            {/* Level 2: Power Up */}
            <motion.div 
              initial={{ background: 'rgba(255,255,255,0.2)' }}
              animate={level >= 2 ? { background: '#22c55e', boxShadow: '0 0 8px #22c55e' } : {}}
              transition={{ delay: 0.5 + (4 - row) * 0.3 }}
              style={{ width: '6px', height: '6px', borderRadius: '50%' }}
            />
            <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }} />
          </motion.div>
        ))}
      </div>

      {/* Level 4: Floating Service Badges */}
      {level >= 4 && (
        <>
          <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', delay: 0.2 }} style={{ position: 'absolute', top: '20px', left: '0px', background: 'rgba(4, 51, 100, 0.8)', padding: '6px 12px', borderRadius: '8px', color: 'white', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', border: '1px solid var(--color-brand-blue)' }}>
            <Cloud size={14} color="var(--color-brand-blue)" /> API
          </motion.div>
          <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', delay: 0.4 }} style={{ position: 'absolute', top: '20px', right: '0px', background: 'rgba(4, 51, 100, 0.8)', padding: '6px 12px', borderRadius: '8px', color: 'white', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', border: '1px solid var(--color-brand-blue)' }}>
            <Database size={14} color="var(--color-accent-yellow)" /> DB
          </motion.div>
          <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', delay: 0.6 }} style={{ position: 'absolute', bottom: '20px', left: '0px', background: 'rgba(4, 51, 100, 0.8)', padding: '6px 12px', borderRadius: '8px', color: 'white', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', border: '1px solid var(--color-brand-blue)' }}>
            <Shield size={14} color="#22c55e" /> Auth
          </motion.div>
        </>
      )}
      </div>
    </div>
  );
};

const EcommerceAnimation = ({ level }) => {
  return (
    <div className="browser-frame" style={{ width: '100%', height: '300px', display: 'flex', flexDirection: 'column' }}>
      <div className="browser-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: '1rem' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          <div className="browser-dot" />
          <div className="browser-dot" />
          <div className="browser-dot" />
        </div>
        
        {/* Level 3: Cart */}
        {level >= 3 && (
          <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'white' }}>
            <ShoppingCart size={14} />
            <motion.span key={level} initial={{ scale: 1.5, color: 'var(--color-accent-yellow)' }} animate={{ scale: 1, color: 'white' }} style={{ fontSize: '12px', fontWeight: 'bold' }}>
              3
            </motion.span>
          </motion.div>
        )}
      </div>

      <div style={{ padding: '1rem', flex: 1, position: 'relative' }}>
        {/* Level 1 & 2: Product Grid */}
        <div style={{ display: 'flex', gap: '10px' }}>
          {[1, 2, 3].map((card) => (
            <motion.div key={card} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: card * 0.1 }} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: '8px', overflow: 'hidden' }}>
              <motion.div 
                initial={{ background: 'rgba(255,255,255,0.05)' }}
                animate={level >= 2 ? { background: 'rgba(53, 118, 193, 0.3)' } : {}}
                style={{ height: '60px', width: '100%' }}
              />
              <div style={{ padding: '8px' }}>
                <CodeLine delay={0.4} width={level >= 2 ? "90%" : "0%"} />
                <CodeLine delay={0.5} width={level >= 2 ? "60%" : "0%"} />
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: level >= 2 ? 1 : 0 }} 
                  style={{ marginTop: '8px', width: '40px', height: '12px', background: 'var(--color-accent-yellow)', borderRadius: '4px' }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Level 4: Checkout Confirmation */}
        {level >= 4 && (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0, y: 20 }} 
            animate={{ scale: 1, opacity: 1, y: 0 }} 
            transition={{ type: 'spring', damping: 12 }}
            style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', background: 'white', borderRadius: '12px', padding: '15px 20px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', gap: '12px', zIndex: 10 }}
          >
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              <CheckCircle2 size={20} />
            </div>
            <div>
              <div style={{ color: '#0f172a', fontWeight: 'bold', fontSize: '14px' }}>Order Confirmed</div>
              <div style={{ color: '#64748b', fontSize: '10px' }}>Receipt sent to email</div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

const MobileAppAnimation = ({ level }) => {
  return (
    <div className="mobile-app-container" style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
      <div className="device-frame mobile-app-scaler" style={{ position: 'relative', width: '260px', height: '520px', padding: 0, overflow: 'hidden', background: '#0f172a', transformOrigin: 'top center' }}>
        {/* iOS Dynamic Island */}
      <motion.div 
        initial={{ width: 0 }} 
        animate={{ width: '80px' }} 
        transition={{ type: 'spring', delay: 0.2 }}
        style={{ position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)', height: '24px', background: 'black', borderRadius: '12px', zIndex: 20 }}
      />
      
      <div style={{ padding: '40px 15px 15px 15px', display: 'flex', flexDirection: 'column', height: '100%', gap: '15px' }}>
        {/* Level 1: App Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
          <div style={{ width: '100px', height: '12px', background: 'rgba(255,255,255,0.1)', borderRadius: '6px' }} />
          <div style={{ width: '30px', height: '30px', borderRadius: '10px', background: 'rgba(255,255,255,0.1)' }} />
        </motion.div>

        {/* Level 2: Skeleton Feed */}
        {level >= 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} style={{ width: '100%', height: '140px', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
              <CodeLine delay={0.4} width="80%" />
              <CodeLine delay={0.5} width="50%" />
            </motion.div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              {[1, 2].map(i => (
                 <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 + i*0.1 }} style={{ flex: 1, height: '100px', background: 'rgba(255,255,255,0.05)', borderRadius: '16px' }} />
              ))}
            </div>
          </div>
        )}

        {/* Level 3: Colors & Bottom Tab Bar */}
        {level >= 3 && (
          <motion.div 
            initial={{ y: 50, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ type: 'spring', delay: 0.3 }}
            style={{ position: 'absolute', bottom: '15px', left: '15px', right: '15px', height: '60px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', borderRadius: '30px', display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}
          >
            {[1, 2, 3, 4].map(i => (
              <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 + i*0.1 }} style={{ width: '24px', height: '24px', borderRadius: '8px', background: i === 1 ? 'var(--color-brand-blue)' : 'rgba(255,255,255,0.3)' }} />
            ))}
          </motion.div>
        )}
      </div>

      {/* Level 4: iOS Ready Notification */}
      {level >= 4 && (
        <motion.div 
          initial={{ y: -50, opacity: 0, x: '-50%' }} 
          animate={{ y: 40, opacity: 1, x: '-50%' }} 
          transition={{ type: 'spring', damping: 12, delay: 0.2 }}
          style={{ position: 'absolute', top: 0, left: '50%', width: '85%', background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)', borderRadius: '20px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', zIndex: 30 }}
        >
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--color-brand-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <CheckCircle2 size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ color: '#0f172a', fontWeight: 'bold', fontSize: '13px', lineHeight: '1' }}>App Built</div>
            <div style={{ color: '#64748b', fontSize: '11px', marginTop: '2px' }}>Ready for TestFlight</div>
          </div>
        </motion.div>
      )}
      </div>
    </div>
  );
};

const toLocalDateKey = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

const CalendarBookingAnimation = ({ slots = [], selectedSlotId, onSelectSlot }) => {
  const initialSlot = slots.find((slot) => slot.id === selectedSlotId) || slots[0];
  const initialDate = initialSlot ? new Date(initialSlot.iso) : new Date();
  const [viewDate, setViewDate] = React.useState(() => new Date(initialDate.getFullYear(), initialDate.getMonth(), 1));
  const [selectedDateKey, setSelectedDateKey] = React.useState(() => toLocalDateKey(initialSlot?.iso));

  const slotsByDate = React.useMemo(() => slots.reduce((groups, slot) => {
    const key = toLocalDateKey(slot.iso);
    if (!key) return groups;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(slot);
    return groups;
  }, new Map()), [slots]);

  React.useEffect(() => {
    const nextSlot = slots.find((slot) => slot.id === selectedSlotId) || slots[0];
    if (!nextSlot) return;
    const nextDate = new Date(nextSlot.iso);
    setSelectedDateKey(toLocalDateKey(nextSlot.iso));
    setViewDate(new Date(nextDate.getFullYear(), nextDate.getMonth(), 1));
  }, [selectedSlotId, slots]);

  const currentYear = new Date().getFullYear();
  const availableYears = React.useMemo(() => {
    const years = new Set([currentYear, currentYear + 1, currentYear + 2, viewDate.getFullYear()]);
    slots.forEach((slot) => years.add(new Date(slot.iso).getFullYear()));
    return [...years].filter(Number.isFinite).sort((a, b) => a - b);
  }, [currentYear, slots, viewDate]);
  const firstWeekday = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();
  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
  const days = Array.from({ length: 42 }, (_, index) => {
    const day = index - firstWeekday + 1;
    return day >= 1 && day <= daysInMonth ? day : null;
  });
  const visibleDatePrefix = `${viewDate.getFullYear()}-${String(viewDate.getMonth() + 1).padStart(2, '0')}`;
  const selectedDateIsVisible = selectedDateKey.startsWith(visibleDatePrefix);
  const visibleSlots = selectedDateIsVisible ? slotsByDate.get(selectedDateKey) || [] : [];
  const moveMonth = (offset) => setViewDate((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1));
  const updateMonth = (month) => setViewDate((current) => new Date(current.getFullYear(), Number(month), 1));
  const updateYear = (year) => setViewDate((current) => new Date(Number(year), current.getMonth(), 1));
  const timeFormatter = React.useMemo(() => new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  }), []);

  return (
    <div className="booking-calendar-visual">
      <div className="booking-calendar-header">
        <div className="booking-calendar-title">
          <CalendarDays size={20} />
          <strong>Choose a date</strong>
        </div>
        <div className="booking-calendar-navigation">
          <button type="button" onClick={() => moveMonth(-1)} aria-label="Previous month" title="Previous month"><ChevronLeft size={16} /></button>
          <select value={viewDate.getMonth()} onChange={(event) => updateMonth(event.target.value)} aria-label="Calendar month">
            {Array.from({ length: 12 }, (_, month) => (
              <option key={month} value={month}>{new Intl.DateTimeFormat(undefined, { month: 'long' }).format(new Date(2020, month, 1))}</option>
            ))}
          </select>
          <select value={viewDate.getFullYear()} onChange={(event) => updateYear(event.target.value)} aria-label="Calendar year">
            {availableYears.map((year) => <option key={year} value={year}>{year}</option>)}
          </select>
          <button type="button" onClick={() => moveMonth(1)} aria-label="Next month" title="Next month"><ChevronRight size={16} /></button>
        </div>
      </div>

      <div className="booking-calendar-grid">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
          <span className="booking-calendar-weekday" key={`${day}-${index}`}>{day}</span>
        ))}
        {days.map((day, index) => {
          const dateKey = day ? `${visibleDatePrefix}-${String(day).padStart(2, '0')}` : '';
          const hasSlots = slotsByDate.has(dateKey);
          return day ? (
            <motion.button
              type="button"
              key={dateKey}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.006 * index }}
              className={selectedDateKey === dateKey ? 'is-selected' : ''}
              disabled={!hasSlots}
              onClick={() => {
                setSelectedDateKey(dateKey);
                if (selectedSlotId && toLocalDateKey(slots.find((slot) => slot.id === selectedSlotId)?.iso) !== dateKey) {
                  onSelectSlot?.(null);
                }
              }}
              aria-label={`${day} ${new Intl.DateTimeFormat(undefined, { month: 'long' }).format(viewDate)}${hasSlots ? ', times available' : ', unavailable'}`}
            >
              {day}
            </motion.button>
          ) : <span key={`empty-${index}`} aria-hidden="true" />;
        })}
      </div>

      <div className="booking-calendar-times" aria-live="polite">
        <Clock size={15} />
        {visibleSlots.length ? visibleSlots.map((slot) => (
          <button
            type="button"
            key={slot.id}
            className={selectedSlotId === slot.id ? 'is-selected' : ''}
            onClick={() => onSelectSlot?.(slot)}
          >
            {timeFormatter.format(new Date(slot.iso))}
          </button>
        )) : <span className="booking-calendar-empty">{slots.length ? 'Select an available date' : 'Loading live availability...'}</span>}
      </div>
    </div>
  );
};

const DefaultWebAnimation = ({ level }) => {
  return (
    <div className="browser-frame" style={{ width: '100%', maxWidth: '100%', height: '300px', display: 'flex', flexDirection: 'column' }}>
      <div className="browser-header">
        <div className="browser-dot" />
        <div className="browser-dot" />
        <div className="browser-dot" />
        <motion.div initial={{width: 0}} animate={{width: '100px'}} transition={{delay: 0.3}} style={{ marginLeft: '10px', height: '12px', background: 'rgba(255,255,255,0.1)', borderRadius: '6px' }} />
      </div>
      <div style={{ padding: '1rem', display: 'flex', gap: '1rem', flex: 1 }}>
        {level >= 2 && (
          <>
            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} style={{ width: '60px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} style={{ height: '60px', background: 'var(--color-brand-blue)', borderRadius: '8px' }} />
              {level >= 3 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', gap: '10px', flex: 1 }}>
                  <div style={{ flex: 2, background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '10px' }}>
                    <CodeLine delay={0.2} width="80%" />
                    <CodeLine delay={0.3} width="60%" />
                  </div>
                  <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }} />
                </motion.div>
              )}
            </div>
          </>
        )}
      </div>
      {level >= 4 && (
         <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ position: 'absolute', top: '40%', right: '-10px', padding: '8px 12px', borderRadius: '16px', background: 'white', color: '#22c55e', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}>
            <CheckCircle2 size={14} /> Ready
         </motion.div>
      )}
    </div>
  );
};

export default function AnimationPanel({
  projectType,
  level,
  messages = [],
  meetingSlots = [],
  selectedMeetingSlotId,
  onMeetingSlotSelect,
}) {
  const [activeTab, setActiveTab] = React.useState('web');

  React.useEffect(() => {
    if (!messages || messages.length === 0) return;
    
    const inferredMode = resolveVisualMode(projectType, messages);
    if (inferredMode === 'web' || inferredMode === 'mobile') setActiveTab(inferredMode);
  }, [messages, projectType]);

  React.useEffect(() => {
    setActiveTab('web'); // Reset to default when projectType changes
  }, [projectType]);

  if (level === 0 || !projectType) {
    return null;
  }

  const isMobileAndWeb = projectType === 'Mobile & Web';
  const inferredMode = resolveVisualMode(projectType, messages);
  const visualMode = isMobileAndWeb && ['web', 'mobile'].includes(inferredMode)
    ? activeTab
    : inferredMode;
  const userTurnCount = messages.filter((message) => message.sender === 'user').length;
  const dynamicLevel = Math.max(level, Math.min(4, userTurnCount + 1));

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {isMobileAndWeb && (
        <div style={{ 
          display: 'flex', 
          gap: '4px', 
          marginBottom: '20px', 
          background: 'rgba(15, 23, 42, 0.4)', 
          padding: '4px', 
          borderRadius: '24px', 
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <button
            type="button"
            onClick={() => setActiveTab('web')}
            style={{
              padding: '6px 18px',
              borderRadius: '20px',
              border: 'none',
              background: activeTab === 'web' ? 'var(--color-brand-blue)' : 'transparent',
              color: activeTab === 'web' ? 'white' : 'rgba(255,255,255,0.6)',
              cursor: 'pointer',
              fontSize: '11px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            Web App
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('mobile')}
            style={{
              padding: '6px 18px',
              borderRadius: '20px',
              border: 'none',
              background: activeTab === 'mobile' ? 'var(--color-brand-blue)' : 'transparent',
              color: activeTab === 'mobile' ? 'white' : 'rgba(255,255,255,0.6)',
              cursor: 'pointer',
              fontSize: '11px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            Mobile App
          </button>
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={`${projectType}-${visualMode}`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.4 }}
          style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
        >
          {visualMode === 'calendar' ? (
            <CalendarBookingAnimation
              slots={meetingSlots}
              selectedSlotId={selectedMeetingSlotId}
              onSelectSlot={onMeetingSlotSelect}
            />
          ) : visualMode === 'ai' ? (
            <AIAgentAnimation level={dynamicLevel} />
          ) : visualMode === 'cloud' ? (
            <CloudInfraAnimation level={dynamicLevel} />
          ) : visualMode === 'ecommerce' ? (
            <EcommerceAnimation level={dynamicLevel} />
          ) : visualMode === 'mobile' ? (
            <MobileAppAnimation level={dynamicLevel} />
          ) : (
            <DefaultWebAnimation level={dynamicLevel} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
