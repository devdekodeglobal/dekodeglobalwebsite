import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HeroScenery({ timeOfDay = 'noon' }) {
  // 5 Evolution Stages:
  // 0 = Barren Land (Dawn of Time)
  // 1 = Countryside Cabin (Agrarian Era)
  // 2 = Industrial Town (Brick Brownstones & Clock Tower)
  // 3 = AI Metropolis (Skyscrapers & Neon Tech Towers)
  // 4 = AI Meteor Impact (Cosmic Impact Flash & Reset)
  const [evolutionStage, setEvolutionStage] = useState(0);

  useEffect(() => {
    const stageDurations = [6000, 6000, 6000, 7000, 4500]; // Duration per stage in ms
    const currentDuration = stageDurations[evolutionStage] || 6000;

    const timer = setTimeout(() => {
      setEvolutionStage((prev) => (prev + 1) % 5);
    }, currentDuration);

    return () => clearTimeout(timer);
  }, [evolutionStage]);

  const isNight = timeOfDay === 'night';
  const isEvening = timeOfDay === 'evening';

  const getWindowFill = () => {
    switch (timeOfDay) {
      case 'morning': return '#fef08a';
      case 'noon': return '#e0f2fe';
      case 'evening': return '#fed7aa';
      case 'night': return '#fbbf24';
      default: return '#e0f2fe';
    }
  };

  const windowFill = getWindowFill();
  const windowGlow = (isNight || isEvening)
    ? 'drop-shadow(0px 0px 8px rgba(251, 191, 36, 0.85))'
    : 'none';

  return (
    <div className="hero-scenery-wrapper" aria-hidden="true">
      {/* Continuous Looping Sun (Parabolic Arc: Right -> Top -> Left) */}
      <motion.div
        className="celestial-sun-container"
        animate={{
          x: ['42vw', '0vw', '-42vw', '-42vw', '42vw'],
          y: ['22vh', '-16vh', '22vh', '60vh', '60vh'],
          opacity: [0, 1, 1, 0, 0],
        }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
      >
        <div className="sun-core" />
        <div className="sun-glow-ring" />
      </motion.div>

      {/* Continuous Looping Moon (180° Out of Phase) */}
      <motion.div
        className="celestial-moon-container"
        animate={{
          x: ['42vw', '0vw', '-42vw', '-42vw', '42vw'],
          y: ['60vh', '-16vh', '22vh', '22vh', '60vh'],
          opacity: [0, 1, 1, 0, 0],
        }}
        transition={{ duration: 40, repeat: Infinity, delay: 20, ease: 'linear' }}
      >
        <div className="moon-core">
          <div className="moon-crater crater-1" />
          <div className="moon-crater crater-2" />
        </div>
        <div className="moon-glow-ring" />
      </motion.div>

      {/* Fluttering Butterflies in Cabin/Barren Stages */}
      {(evolutionStage === 0 || evolutionStage === 1) && (
        <motion.svg
          key="bf-1"
          className="fluttering-butterfly butterfly-1"
          viewBox="0 0 40 40"
          initial={{ opacity: 0, x: -50, y: 150 }}
          animate={{
            opacity: [0, 1, 1, 0],
            x: [50, 350, 750, 1100],
            y: [120, 50, 120, 60],
            rotate: [-12, 15, -8, 12],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        >
          <path d="M 20 20 Q 5 5 2 20 Q 5 35 20 20" fill="#f43f5e" opacity="0.9" />
          <path d="M 20 20 Q 35 5 38 20 Q 35 35 20 20" fill="#fb7185" opacity="0.9" />
          <line x1="20" y1="10" x2="20" y2="30" stroke="#881337" strokeWidth="2.5" strokeLinecap="round" />
        </motion.svg>
      )}

      {/* STAGE 4: BLAZING AI METEOR IMPACT & SHOCKWAVE FLASH */}
      <AnimatePresence>
        {evolutionStage === 4 && (
          <>
            {/* Blazing AI Meteor */}
            <motion.svg
              key="ai-meteor"
              className="ai-meteor-container"
              viewBox="0 0 1000 600"
              initial={{ x: '60vw', y: '-40vh', opacity: 0, scale: 0.4 }}
              animate={{
                x: ['60vw', '-10vw'],
                y: ['-40vh', '40vh'],
                opacity: [0, 1, 1, 0],
                scale: [0.4, 1.4, 1.8, 0.5],
              }}
              transition={{ duration: 2.2, ease: 'easeIn' }}
            >
              {/* Fiery Tail Flare */}
              <path
                d="M 600 100 L 950 0 L 800 180 Z"
                fill="url(#meteorTailGrad)"
                opacity="0.85"
              />
              <defs>
                <linearGradient id="meteorTailGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.95" />
                  <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.75" />
                  <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Core Meteor Orb */}
              <circle cx="600" cy="100" r="32" fill="#fffef0" style={{ filter: 'drop-shadow(0 0 30px #38bdf8) drop-shadow(0 0 60px #f59e0b)' }} />
              <circle cx="600" cy="100" r="48" fill="none" stroke="#38bdf8" strokeWidth="6" opacity="0.8" />
            </motion.svg>

            {/* Shockwave Flash Screen Overlay */}
            <motion.div
              key="shockwave-burst"
              className="shockwave-flash"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: [0, 0.95, 0.4, 0], scale: [0.8, 1.3, 1] }}
              transition={{ duration: 2.4, delay: 1.8, ease: 'easeOut' }}
            />
          </>
        )}
      </AnimatePresence>

      {/* DYNAMIC SCENERY EVOLUTION (viewBox 0 0 1920 360) */}
      <div className="scenery-buildings-container">
        <svg
          className="scenery-svg"
          viewBox="0 0 1920 360"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="mountainGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isNight ? '#1e1b4b' : isEvening ? '#581c87' : '#94a3b8'} stopOpacity="0.8" />
              <stop offset="100%" stopColor={isNight ? '#020617' : isEvening ? '#311b92' : '#cbd5e1'} stopOpacity="0.95" />
            </linearGradient>

            <linearGradient id="hillGrad1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isNight ? '#065f46' : isEvening ? '#854d0e' : '#22c55e'} />
              <stop offset="100%" stopColor={isNight ? '#022c22' : isEvening ? '#451a03' : '#15803d'} />
            </linearGradient>

            <linearGradient id="hillGrad2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isNight ? '#044e3b' : isEvening ? '#713f12' : '#16a34a'} />
              <stop offset="100%" stopColor={isNight ? '#01231a' : isEvening ? '#361402' : '#166534'} />
            </linearGradient>

            <linearGradient id="lampLightCone" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fef08a" stopOpacity={isNight || isEvening ? 0.45 : 0.15} />
              <stop offset="100%" stopColor="#fef08a" stopOpacity="0" />
            </linearGradient>

            <linearGradient id="neonGlow" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#818cf8" />
            </linearGradient>
          </defs>

          {/* LAYER 1: Distant Misty Mountain Peaks (Constant Base) */}
          <path
            d="M 0 160 Q 300 80 650 140 Q 1000 70 1400 130 Q 1700 90 1920 150 L 1920 360 L 0 360 Z"
            fill="url(#mountainGrad)"
            opacity="0.5"
          />

          {/* LAYER 2: Rolling Hills Base */}
          <path
            d="M 0 190 Q 450 110 950 170 Q 1450 230 1920 150 L 1920 360 L 0 360 Z"
            fill="url(#hillGrad1)"
          />

          {/* STAGE 0 & 1: PRISTINE LAND & COUNTRYSIDE CABIN */}
          <AnimatePresence>
            {(evolutionStage === 0 || evolutionStage === 1) && (
              <g className="barren-nature-layer">
                {/* Winding Blue River Stream */}
                <path
                  d="M 750 220 Q 820 250 880 360 L 960 360 Q 890 260 810 220 Z"
                  fill="#38bdf8"
                  opacity="0.8"
                />

                {/* Front Rolling Hill */}
                <path
                  d="M 0 220 Q 500 150 1000 210 Q 1500 270 1920 200 L 1920 360 L 0 360 Z"
                  fill="url(#hillGrad2)"
                />

                {/* STAGE 1: Timber Cabin Rises Up from Earth */}
                {evolutionStage === 1 && (
                  <motion.g
                    key="cabin-era"
                    initial={{ opacity: 0, y: 120 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 120 }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                  >
                    {/* Cabin 1 */}
                    <rect x="180" y="170" width="140" height="110" rx="6" fill="#78350f" />
                    <polygon points="160,170 250,95 340,170" fill="#b45309" />
                    <rect x="290" y="90" width="22" height="50" fill="#475569" rx="3" />
                    <motion.circle cx="301" cy="78" r="8" fill="#f8fafc" opacity="0.6" animate={{ y: [-5, -30], opacity: [0.6, 0] }} transition={{ duration: 3, repeat: Infinity }} />
                    <rect x="205" y="190" width="35" height="35" rx="6" fill={windowFill} style={{ filter: windowGlow }} />
                    <rect x="260" y="210" width="38" height="70" rx="4" fill="#451a03" />

                    {/* Cabin 2 */}
                    <rect x="1140" y="180" width="150" height="100" rx="6" fill="#92400e" />
                    <polygon points="1120,180 1215,110 1310,180" fill="#d97706" />
                    <rect x="1165" y="200" width="35" height="32" rx="4" fill={windowFill} style={{ filter: windowGlow }} />
                    <rect x="1230" y="215" width="38" height="65" rx="4" fill="#451a03" />

                    {/* Water Mill */}
                    <circle cx="750" cy="270" r="26" stroke="#78350f" strokeWidth="5" fill="none" />

                    {/* Pine & Oak Trees */}
                    <rect x="520" y="190" width="18" height="105" fill="#451a03" rx="4" />
                    <circle cx="529" cy="170" r="48" fill={isNight ? '#064e3b' : '#22c55e'} />
                    <rect x="1560" y="200" width="16" height="90" fill="#451a03" rx="3" />
                    <circle cx="1568" cy="180" r="44" fill={isNight ? '#065f46' : '#16a34a'} />
                  </motion.g>
                )}
              </g>
            )}
          </AnimatePresence>

          {/* STAGE 2: INDUSTRIAL TOWN (Brick Brownstones & Clock Tower) */}
          <AnimatePresence>
            {evolutionStage === 2 && (
              <motion.g
                key="town-era"
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              >
                {/* Brick Apartments */}
                <rect x="110" y="120" width="140" height="200" rx="6" fill={isNight ? '#3730a3' : '#f87171'} />
                {[0, 1, 2].map((r) =>
                  [0, 1].map((c) => (
                    <rect key={`t1-${r}-${c}`} x={130 + c * 50} y={145 + r * 45} width="28" height="30" rx="3" fill={windowFill} style={{ filter: windowGlow }} />
                  ))
                )}

                {/* Gothic Clock Tower */}
                <rect x="410" y="70" width="140" height="250" rx="6" fill={isNight ? '#311b92' : '#6366f1'} />
                <polygon points="400,70 480,0 560,70" fill={isNight ? '#1a237e' : '#4338ca'} />
                <circle cx="480" cy="110" r="22" fill="#fffef0" stroke="#fbbf24" strokeWidth="3.5" />
                <line x1="480" y1="110" x2="480" y2="95" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" />
                <line x1="480" y1="110" x2="492" y2="110" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" />
                {[0, 1, 2].map((r) =>
                  [0, 1].map((c) => (
                    <rect key={`t2-${r}-${c}`} x={435 + c * 50} y={150 + r * 48} width="24" height="32" rx="4" fill={windowFill} style={{ filter: windowGlow }} />
                  ))
                )}

                {/* Townhouse */}
                <rect x="850" y="130" width="140" height="190" rx="6" fill={isNight ? '#4338ca' : '#fbbf24'} />
                <path d="M 840 130 L 920 85 L 1000 130 Z" fill={isNight ? '#312e81' : '#f59e0b'} />
                {[0, 1].map((r) =>
                  [0, 1].map((c) => (
                    <rect key={`t3-${r}-${c}`} x={870 + c * 48} y={155 + r * 50} width="24" height="34" rx="4" fill={windowFill} style={{ filter: windowGlow }} />
                  ))
                )}

                {/* Brownstone */}
                <rect x="1350" y="110" width="140" height="210" rx="6" fill={isNight ? '#4c1d95' : '#e11d48'} />
                {[0, 1, 2].map((r) =>
                  [0, 1].map((c) => (
                    <rect key={`t4-${r}-${c}`} x={1370 + c * 50} y={130 + r * 52} width="30" height="36" rx="4" fill={windowFill} style={{ filter: windowGlow }} />
                  ))
                )}

                {/* Streetlamps */}
                <line x1="320" y1="260" x2="320" y2="320" stroke="#0f172a" strokeWidth="4.5" />
                <circle cx="320" cy="255" r="9" fill="#fde047" />
                <line x1="1150" y1="260" x2="1150" y2="320" stroke="#0f172a" strokeWidth="4.5" />
                <circle cx="1150" cy="255" r="9" fill="#fde047" />

                {/* Road */}
                <rect x="0" y="320" width="1920" height="40" fill="#334155" />
              </motion.g>
            )}
          </AnimatePresence>

          {/* STAGE 3 & 4: AI METROPOLIS (Skyscrapers & Neon Spires -> Meteor Impact Disintegration) */}
          <AnimatePresence>
            {(evolutionStage === 3 || evolutionStage === 4) && (
              <motion.g
                key="metropolis-era"
                initial={{ opacity: 0, y: 120 }}
                animate={
                  evolutionStage === 4
                    ? { opacity: [1, 0.8, 0], y: [0, 20, 140], scaleY: [1, 0.9, 0] }
                    : { opacity: 1, y: 0, scaleY: 1 }
                }
                transition={
                  evolutionStage === 4
                    ? { duration: 1.8, delay: 1.8, ease: 'easeIn' }
                    : { duration: 1.2, ease: 'easeOut' }
                }
              >
                {/* Background Spire Silhouettes */}
                <rect x="20" y="80" width="110" height="240" rx="4" fill={isNight ? '#1e1b4b' : '#94a3b8'} opacity="0.6" />
                <rect x="760" y="30" width="140" height="290" rx="4" fill={isNight ? '#312e81' : '#cbd5e1'} opacity="0.6" />
                <rect x="1680" y="80" width="120" height="240" rx="4" fill={isNight ? '#1e1b4b' : '#94a3b8'} opacity="0.6" />

                {/* Skyscraper 1 */}
                <rect x="150" y="60" width="140" height="260" rx="8" fill={isNight ? '#1e293b' : '#38bdf8'} />
                <path d="M 150 60 L 220 10 L 290 60 Z" fill={isNight ? '#0f172a' : '#0284c7'} />
                <line x1="220" y1="10" x2="220" y2="-20" stroke="#f43f5e" strokeWidth="3" />
                <circle cx="220" cy="-20" r="4" fill="#f43f5e" />

                {/* Clock Tower */}
                <rect x="310" y="70" width="130" height="250" rx="6" fill={isNight ? '#311b92' : '#6366f1'} />
                <polygon points="300,70 375,0 450,70" fill={isNight ? '#1a237e' : '#4338ca'} />
                <circle cx="375" cy="110" r="22" fill="#fffef0" stroke="#fbbf24" strokeWidth="3.5" />

                {/* High Tech Corporate Tower with Neon Strip */}
                <rect x="620" y="40" width="160" height="280" rx="10" fill={isNight ? '#1e1b4b' : '#818cf8'} />
                <rect x="640" y="18" width="120" height="22" rx="4" fill="url(#neonGlow)" />
                {[0, 1, 2, 3, 4, 5].map((r) =>
                  [0, 1, 2].map((c) => (
                    <rect key={`m1-${r}-${c}`} x={642 + c * 42} y={60 + r * 38} width="28" height="22" rx="3" fill={windowFill} style={{ filter: windowGlow }} />
                  ))
                )}

                {/* Yellow Loft */}
                <rect x="800" y="100" width="145" height="220" rx="8" fill={isNight ? '#3730a3' : '#facc15'} />

                {/* Glass Pavilion */}
                <rect x="960" y="120" width="145" height="200" rx="8" fill={isNight ? '#1e293b' : '#475569'} />
                <circle cx="1032" cy="100" r="14" fill="#94a3b8" />

                {/* Modern High-Tech Tower */}
                <rect x="1280" y="40" width="160" height="280" rx="8" fill={isNight ? '#0f172a' : '#0284c7'} />
                <line x1="1280" y1="40" x2="1280" y2="320" stroke="#38bdf8" strokeWidth="4" />
                <line x1="1440" y1="40" x2="1440" y2="320" stroke="#38bdf8" strokeWidth="4" />

                {/* Art Deco Skyscraper */}
                <rect x="1620" y="50" width="135" height="270" rx="8" fill={isNight ? '#1e1b4b' : '#a855f7'} />
                <polygon points="1620,50 1687,10 1755,50" fill={isNight ? '#0f172a' : '#9333ea'} />

                {/* Edge Skyscraper */}
                <rect x="1770" y="90" width="145" height="230" rx="6" fill={isNight ? '#1e293b' : '#0f766e'} />

                {/* Glowing Streetlamps */}
                <g className="streetlamps">
                  <polygon points="230,250 330,250 360,310 200,310" fill="url(#lampLightCone)" />
                  <line x1="280" y1="245" x2="280" y2="310" stroke="#0f172a" strokeWidth="4.5" />
                  <circle cx="280" cy="240" r="9" fill="#fde047" />

                  <polygon points="1130,250 1230,250 1260,310 1100,310" fill="url(#lampLightCone)" />
                  <line x1="1180" y1="245" x2="1180" y2="310" stroke="#0f172a" strokeWidth="4.5" />
                  <circle cx="1180" cy="240" r="9" fill="#fde047" />
                </g>

                <rect x="0" y="310" width="1920" height="50" fill={isNight ? '#0f172a' : '#334155'} />
              </motion.g>
            )}
          </AnimatePresence>
        </svg>
      </div>
    </div>
  );
}
