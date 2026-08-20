import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { resolveVisualFeatures, resolveVisualMode, resolveFallbackVisualState } from '../utils/visualIntent';
import BookingSummary from './BookingSummary.jsx';

const CodeLine = ({ delay = 0, width = "100%", color = "rgba(255,255,255,0.2)" }) => (
  <motion.div 
    initial={{ width: 0, opacity: 0 }}
    animate={{ width, opacity: 1 }}
    transition={{ delay, duration: 0.5 }}
    style={{ height: '6px', background: color, borderRadius: '3px', marginBottom: '8px' }}
  />
);

const ExperienceMapAnimation = ({ features, level }) => {
  const visibleFeatures = (features.length ? features : ['Experience', 'Content', 'Action'])
    .slice(0, Math.max(2, Math.min(features.length || 3, level + 1)));
  return (
    <div className="experience-map" aria-label="Visual map of the current project requirements">
      <motion.div
        className="experience-map-person"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <LucideIcons.UserRound size={22} />
        <span>Visitor</span>
      </motion.div>
      <div className="experience-map-path" aria-hidden="true">
        <motion.span initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} />
      </div>
      <div className="experience-map-features">
        {visibleFeatures.map((feature, index) => (
          <motion.div
            key={feature}
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.12 * index }}
            className="experience-map-feature"
          >
            <LucideIcons.Sparkles size={15} />
            <span>{feature}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

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

const AIAgentAnimation = ({ level, visualState }) => {
  const ThemeIcon = (visualState?.themeIcon && LucideIcons[visualState.themeIcon]) ? LucideIcons[visualState.themeIcon] : LucideIcons.Bot;
  const themeColor = visualState?.themeColor || '#8b5cf6';

  return (
    <div className="ai-agent-container" style={{ position: 'relative', width: '100%', background: 'transparent' }}>
      {/* Background Glow */}
      <motion.div 
        animate={{ scale: [1, 1.05, 1], opacity: [0.6, 1, 0.6] }} 
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', background: `radial-gradient(circle at 50% 50%, ${themeColor}15 0%, transparent 50%)`, zIndex: 0, pointerEvents: 'none' }} 
      />
      <div className="ai-agent-scaler" style={{ position: 'absolute', top: '15px', left: '50%', width: '480px', height: '260px', marginLeft: '-240px', transformOrigin: 'top center', zIndex: 1 }}>
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
        <Node delay={0} icon={LucideIcons.FileText} title="Webhook" color="var(--color-brand-blue)" x={0} y={72} />

        {/* Level 2: Core Agent */}
        {level >= 2 && (
          <Node delay={0.5} icon={ThemeIcon} title="AI Brain" color={themeColor} x={150} y={72} />
        )}

        {/* Level 3: Tools */}
        {level >= 3 && (
          <>
            <Node delay={0.4} icon={LucideIcons.Layers} title="Memory DB" color="var(--color-brand-blue)" x={52} y={200} />
            <Node delay={0.5} icon={LucideIcons.Server} title="LLM Model" color="#f59e0b" x={150} y={200} />
            <Node delay={0.6} icon={LucideIcons.Wrench} title="Search Tool" color="#10b981" x={248} y={200} />
          </>
        )}

        {/* Level 4: Logic & Actions */}
        {level >= 4 && (
          <>
            <Node delay={0.4} icon={LucideIcons.GitMerge} title="Condition" color="#f43f5e" x={300} y={72} />
            <Node delay={0.8} icon={LucideIcons.MessageSquare} title="Chat Alert" color="#eab308" x={420} y={32} />
            <Node delay={1.0} icon={LucideIcons.Database} title="Update CRM" color="var(--color-brand-blue)" x={420} y={112} />
          </>
        )}
      </div>
    </div>
  );
};

const CloudInfraAnimation = ({ level, visualState }) => {
  const themeColor = visualState?.themeColor || 'var(--color-brand-blue)';
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '300px', position: 'relative', overflow: 'hidden' }}>
      {/* Background Glow */}
      <motion.div 
        animate={{ scale: [1, 1.05, 1], opacity: [0.6, 1, 0.6] }} 
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', background: `radial-gradient(circle at 50% 50%, ${themeColor}15 0%, transparent 50%)`, zIndex: 0, pointerEvents: 'none' }} 
      />
      <div style={{ position: 'relative', width: '300px', height: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
        
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
            <LucideIcons.Cloud size={14} color="var(--color-brand-blue)" /> API
          </motion.div>
          <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', delay: 0.4 }} style={{ position: 'absolute', top: '20px', right: '0px', background: 'rgba(4, 51, 100, 0.8)', padding: '6px 12px', borderRadius: '8px', color: 'white', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', border: '1px solid var(--color-brand-blue)' }}>
            <LucideIcons.Database size={14} color="var(--color-accent-yellow)" /> DB
          </motion.div>
          <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', delay: 0.6 }} style={{ position: 'absolute', bottom: '20px', left: '0px', background: 'rgba(4, 51, 100, 0.8)', padding: '6px 12px', borderRadius: '8px', color: 'white', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', border: '1px solid var(--color-brand-blue)' }}>
            <LucideIcons.Shield size={14} color="#22c55e" /> Auth
          </motion.div>
        </>
      )}
      </div>
    </div>
  );
};

const EcommerceAnimation = ({ level, visualState, features = [] }) => {
  const ThemeIcon = (visualState?.themeIcon && LucideIcons[visualState.themeIcon]) ? LucideIcons[visualState.themeIcon] : LucideIcons.ShoppingCart;
  const themeColor = visualState?.themeColor || 'var(--color-accent-yellow)';
  const projectTitle = visualState?.projectTitle || '';

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
            {projectTitle && <span style={{ fontSize: '10px', marginRight: '8px', opacity: 0.8 }}>{projectTitle}</span>}
            <ThemeIcon size={14} color={themeColor} />
            <motion.span key={level} initial={{ scale: 1.5, color: themeColor }} animate={{ scale: 1, color: 'white' }} style={{ fontSize: '12px', fontWeight: 'bold' }}>
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
                style={{ 
                  height: '60px', 
                  width: '100%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  backgroundColor: level >= 2 ? `${themeColor}33` : 'rgba(255,255,255,0.05)',
                  borderBottom: level >= 2 ? `1px solid ${themeColor}55` : 'none'
                }}
              >
                {level >= 2 && <ThemeIcon size={22} color={themeColor} />}
              </motion.div>
              <div style={{ padding: '8px' }}>
                <CodeLine delay={0.4} width={level >= 2 ? "90%" : "0%"} />
                <CodeLine delay={0.5} width={level >= 2 ? "60%" : "0%"} />
                {features[card - 1] && level >= 2 && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ display: 'inline-block', fontSize: '8px', background: 'rgba(255,255,255,0.12)', color: 'white', padding: '1px 5px', borderRadius: '3px', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {features[card - 1]}
                  </motion.div>
                )}
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: level >= 2 ? 1 : 0 }} 
                  style={{ marginTop: '8px', width: '40px', height: '12px', background: themeColor, borderRadius: '4px' }}
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
              <LucideIcons.CheckCircle2 size={20} />
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

const MobileAppAnimation = ({ level, visualState, features = [] }) => {
  const ThemeIcon = (visualState?.themeIcon && LucideIcons[visualState.themeIcon]) ? LucideIcons[visualState.themeIcon] : LucideIcons.ShoppingCart;
  const themeColor = visualState?.themeColor || 'var(--color-brand-blue)';
  const projectTitle = visualState?.projectTitle || 'App Built';

  return (
    <div className="mobile-app-container" style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', overflow: 'hidden', height: '300px' }}>
      {/* Background Glow */}
      <motion.div 
        animate={{ scale: [1, 1.05, 1], opacity: [0.6, 1, 0.6] }} 
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', background: `radial-gradient(circle at 50% 50%, ${themeColor}15 0%, transparent 50%)`, zIndex: 0, pointerEvents: 'none' }} 
      />
      <div className="device-frame mobile-app-scaler" style={{ position: 'relative', width: '260px', height: '520px', padding: 0, overflow: 'hidden', background: '#0f172a', transformOrigin: 'top center', zIndex: 1, transform: 'scale(0.55)' }}>
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
          <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <ThemeIcon size={14} color={themeColor} />
          </div>
          <div style={{ width: '100px', height: '12px', background: 'rgba(255,255,255,0.1)', borderRadius: '6px' }} />
          <div style={{ width: '30px', height: '30px', borderRadius: '10px', background: 'rgba(255,255,255,0.1)' }} />
        </motion.div>

        {/* Level 2: Skeleton Feed */}
        {level >= 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} style={{ width: '100%', height: '140px', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', position: 'relative', overflow: 'hidden', border: level >= 2 ? `1px solid ${themeColor}33` : '1px solid transparent' }}>
              {level >= 2 && (
                <div style={{ position: 'absolute', top: '15px', right: '15px', color: themeColor, opacity: 0.3 }}>
                  <ThemeIcon size={36} />
                </div>
              )}
              <CodeLine delay={0.4} width="80%" />
              <CodeLine delay={0.5} width="50%" />
              {features.length > 0 && (
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '6px' }}>
                  {features.slice(0, 3).map((feat) => (
                    <span key={feat} style={{ fontSize: '8px', background: `${themeColor}22`, border: `1px solid ${themeColor}44`, color: 'white', padding: '1px 5px', borderRadius: '3px' }}>
                      {feat}
                    </span>
                  ))}
                </div>
              )}
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
              <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 + i*0.1 }} style={{ width: '24px', height: '24px', borderRadius: '8px', background: i === 1 ? themeColor : 'rgba(255,255,255,0.3)' }} />
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
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: themeColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <LucideIcons.CheckCircle2 size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ color: '#0f172a', fontWeight: 'bold', fontSize: '13px', lineHeight: '1' }}>{projectTitle}</div>
            <div style={{ color: '#64748b', fontSize: '11px', marginTop: '2px' }}>Ready for TestFlight</div>
          </div>
        </motion.div>
      )}
      </div>
    </div>
  );
};

const DefaultWebAnimation = ({ level, visualState, features = [] }) => {
  const ThemeIcon = (visualState?.themeIcon && LucideIcons[visualState.themeIcon]) ? LucideIcons[visualState.themeIcon] : null;
  const themeColor = visualState?.themeColor || 'var(--color-brand-blue)';
  const projectTitle = visualState?.projectTitle || '';

  return (
    <div className="browser-frame" style={{ width: '100%', maxWidth: '100%', height: '300px', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      
      {/* Background Glow */}
      <motion.div 
        animate={{ scale: [1, 1.05, 1], opacity: [0.6, 1, 0.6] }} 
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', background: `radial-gradient(circle at 50% 50%, ${themeColor}15 0%, transparent 50%)`, zIndex: 0, pointerEvents: 'none' }} 
      />

      <div className="browser-header" style={{ position: 'relative', zIndex: 1 }}>
        <div className="browser-dot" />
        <div className="browser-dot" />
        <div className="browser-dot" />
        <motion.div initial={{width: 0}} animate={{width: '100px'}} transition={{delay: 0.3}} style={{ marginLeft: '10px', height: '12px', background: 'rgba(255,255,255,0.1)', borderRadius: '6px' }} />
        {projectTitle && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginLeft: 'auto', fontSize: '10px', color: 'white', opacity: 0.8 }}>{projectTitle}</motion.span>}
      </div>
      <div style={{ padding: '1rem', display: 'flex', gap: '1rem', flex: 1, position: 'relative', zIndex: 1 }}>
        {level >= 2 && (
          <>
            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} style={{ width: '60px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} style={{ height: '60px', background: `linear-gradient(135deg, ${themeColor} 0%, ${themeColor}88 100%)`, borderRadius: '8px', display: 'flex', alignItems: 'center', paddingLeft: '15px', boxShadow: `0 4px 15px ${themeColor}44`, border: `1px solid ${themeColor}55` }}>
                 {ThemeIcon && (
                   <motion.div
                     animate={{ rotate: [0, -5, 5, 0], scale: [1, 1.1, 1] }}
                     transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                   >
                     <ThemeIcon size={24} color="rgba(255,255,255,0.9)" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} />
                   </motion.div>
                 )}
              </motion.div>
              {level >= 3 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', gap: '10px', flex: 1 }}>
                  <div style={{ flex: 2, background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <CodeLine delay={0.2} width="85%" />
                    <CodeLine delay={0.3} width="65%" />
                    <CodeLine delay={0.4} width="40%" />
                  </div>
                  <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '8px', display: 'flex', flexDirection: 'column', gap: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    {features.slice(0, 3).map((feat, idx) => (
                      <motion.div 
                        initial={{ opacity: 0, x: 10 }} 
                        animate={{ opacity: 1, x: 0, scale: [1, 1.02, 1] }} 
                        transition={{ 
                          scale: { repeat: Infinity, duration: 3, ease: "easeInOut", delay: idx * 0.5 },
                          default: { delay: 0.4 + (idx * 0.1) } 
                        }} 
                        key={feat} 
                        style={{ fontSize: '9px', background: `linear-gradient(90deg, ${themeColor}22 0%, transparent 100%)`, borderLeft: `2px solid ${themeColor}`, color: 'white', padding: '6px 8px', borderRadius: '0 4px 4px 0', fontWeight: '500' }}
                      >
                        {feat}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </>
        )}
      </div>
      {level >= 4 && (
         <motion.div 
           initial={{ y: 20, opacity: 0, scale: 0.9 }} 
           animate={{ y: [0, -6, 0], opacity: 1, scale: 1 }} 
           transition={{ 
             y: { repeat: Infinity, duration: 3, ease: "easeInOut" },
             default: { type: 'spring', damping: 15 }
           }}
           style={{ 
             position: 'absolute', 
             bottom: '20px', 
             left: '50%',
             transform: 'translateX(-50%)',
             padding: '10px 20px', 
             borderRadius: '24px', 
             background: 'rgba(15, 23, 42, 0.8)', 
             backdropFilter: 'blur(12px)',
             border: `1px solid ${themeColor}66`,
             color: 'white', 
             fontSize: '13px', 
             fontWeight: '600', 
             display: 'flex', 
             alignItems: 'center', 
             gap: '8px', 
             boxShadow: `0 10px 30px ${themeColor}33`,
             zIndex: 20
           }}
         >
            <div style={{ background: themeColor, borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LucideIcons.CheckCircle2 size={12} color="white" strokeWidth={3} />
            </div>
            Project Defined
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
  selectedMeetingDateKey = '',
  selectedMeetingSlotId,
  bookingComplete = false,
  conversationSummary = '',
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

  const latestMessageWithVisualState = [...messages].reverse().find(m => m.visualState);
  const aiVisualState = latestMessageWithVisualState?.visualState || resolveFallbackVisualState(projectType, messages);

  const isMobileAndWeb = projectType === 'Mobile & Web';
  // The user requested to disable the discovery call / calendar jump in the animation panel for now.
  const inferredMode = aiVisualState?.mode || resolveVisualMode(projectType, messages);
  const visualFeatures = resolveVisualFeatures([
    ...messages,
    ...(conversationSummary ? [{ sender: 'user', text: conversationSummary }] : []),
  ]);
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
            <BookingSummary
              slots={meetingSlots}
              selectedDateKey={selectedMeetingDateKey}
              selectedSlotId={selectedMeetingSlotId}
              bookingComplete={bookingComplete}
            />
          ) : visualMode === 'journey' ? (
            <ExperienceMapAnimation features={visualFeatures} level={dynamicLevel} />
          ) : visualMode === 'ai' ? (
            <AIAgentAnimation level={dynamicLevel} visualState={aiVisualState} />
          ) : visualMode === 'cloud' ? (
            <CloudInfraAnimation level={dynamicLevel} visualState={aiVisualState} />
          ) : visualMode === 'ecommerce' ? (
            <EcommerceAnimation level={dynamicLevel} visualState={aiVisualState} features={visualFeatures} />
          ) : visualMode === 'mobile' ? (
            <MobileAppAnimation level={dynamicLevel} visualState={aiVisualState} features={visualFeatures} />
          ) : (
            <DefaultWebAnimation level={dynamicLevel} visualState={aiVisualState} features={visualFeatures} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
