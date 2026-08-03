import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HeroScenery({ timeOfDay = 'noon' }) {
  const [sceneryMode, setSceneryMode] = useState('city');

  // Morph between City and Nature every 22 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setSceneryMode((prev) => (prev === 'city' ? 'nature' : 'city'));
    }, 22000);
    return () => clearInterval(timer);
  }, []);

  const isNight = timeOfDay === 'night';
  const isEvening = timeOfDay === 'evening';
  const isNature = sceneryMode === 'nature';

  // Dynamic colors based on time of day
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

      {/* Fluttering Butterflies (Active in Nature mode) */}
      <AnimatePresence>
        {isNature && (
          <>
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

            <motion.svg
              key="bf-2"
              className="fluttering-butterfly butterfly-2"
              viewBox="0 0 40 40"
              initial={{ opacity: 0, x: 200, y: 200 }}
              animate={{
                opacity: [0, 1, 1, 0],
                x: [300, 650, 950, 1300],
                y: [160, 70, 150, 80],
                rotate: [10, -15, 10, -5],
              }}
              transition={{ duration: 16, repeat: Infinity, delay: 2, ease: 'easeInOut' }}
            >
              <path d="M 20 20 Q 5 5 2 20 Q 5 35 20 20" fill="#f59e0b" opacity="0.9" />
              <path d="M 20 20 Q 35 5 38 20 Q 35 35 20 20" fill="#fbbf24" opacity="0.9" />
              <line x1="20" y1="10" x2="20" y2="30" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />
            </motion.svg>
          </>
        )}
      </AnimatePresence>

      {/* Dynamic 4-Layer Edge-to-Edge Vector Artwork (viewBox 0 0 1920 360) */}
      <AnimatePresence mode="wait">
        {!isNature ? (
          /* ULTRA-DETAILED 4-LAYER CITY SKYLINE & PARK PROMENADE */
          <motion.div
            key="city-scenery"
            className="scenery-buildings-container"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
          >
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

                <linearGradient id="lampLightCone" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fef08a" stopOpacity={isNight || isEvening ? 0.45 : 0.15} />
                  <stop offset="100%" stopColor="#fef08a" stopOpacity="0" />
                </linearGradient>

                <linearGradient id="neonGlow" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#818cf8" />
                </linearGradient>
              </defs>

              {/* LAYER 1: Distant Mountain Peaks */}
              <g className="layer-1-mountains">
                <path
                  d="M 0 180 Q 200 110 420 150 Q 650 90 900 140 Q 1150 70 1400 130 Q 1650 100 1920 160 L 1920 360 L 0 360 Z"
                  fill="url(#mountainGrad)"
                  opacity="0.65"
                />
              </g>

              {/* LAYER 2: Background Skyscraper Spires */}
              <g className="layer-2-spires" opacity={isNight ? 0.5 : isEvening ? 0.6 : 0.75}>
                <rect x="20" y="80" width="110" height="240" rx="4" fill={isNight ? '#1e1b4b' : isEvening ? '#4c1d95' : '#94a3b8'} />
                <rect x="180" y="40" width="130" height="280" rx="4" fill={isNight ? '#312e81' : isEvening ? '#581c87' : '#cbd5e1'} />
                <rect x="480" y="90" width="100" height="230" rx="4" fill={isNight ? '#1e1b4b' : isEvening ? '#4c1d95' : '#94a3b8'} />
                <rect x="760" y="30" width="140" height="290" rx="4" fill={isNight ? '#312e81' : isEvening ? '#581c87' : '#cbd5e1'} />
                <rect x="1080" y="70" width="120" height="250" rx="4" fill={isNight ? '#1e1b4b' : isEvening ? '#4c1d95' : '#94a3b8'} />
                <rect x="1380" y="50" width="130" height="270" rx="4" fill={isNight ? '#312e81' : isEvening ? '#581c87' : '#cbd5e1'} />
                <rect x="1680" y="80" width="120" height="240" rx="4" fill={isNight ? '#1e1b4b' : isEvening ? '#4c1d95' : '#94a3b8'} />
              </g>

              {/* LAYER 3: Midground Detailed Architecture (12 Buildings, x=0 to 1920) */}

              {/* Building 1: Brick Apartment with Fire Escapes */}
              <g className="b-1">
                <rect x="10" y="110" width="130" height="210" rx="6" fill={isNight ? '#3730a3' : isEvening ? '#9f1239' : '#f87171'} />
                <rect x="5" y="100" width="140" height="12" rx="3" fill={isNight ? '#1e1b4b' : isEvening ? '#881337' : '#ef4444'} />
                {[0, 1, 2].map((r) =>
                  [0, 1].map((c) => (
                    <rect key={`b1-${r}-${c}`} x={30 + c * 45} y={130 + r * 45} width="25" height="30" rx="3" fill={windowFill} style={{ filter: windowGlow }} />
                  ))
                )}
                <path d="M 25 155 L 125 155 M 25 200 L 125 200 M 25 245 L 125 245" stroke="#1e1b4b" strokeWidth="2.5" opacity="0.65" />
              </g>

              {/* Building 2: Skyscraper with Spire & Beacon */}
              <g className="b-2">
                <rect x="150" y="60" width="140" height="260" rx="8" fill={isNight ? '#1e293b' : isEvening ? '#431407' : '#38bdf8'} />
                <path d="M 150 60 L 220 10 L 290 60 Z" fill={isNight ? '#0f172a' : isEvening ? '#292524' : '#0284c7'} />
                <line x1="220" y1="10" x2="220" y2="-20" stroke="#f43f5e" strokeWidth="3" />
                <circle cx="220" cy="-20" r="4" fill="#f43f5e" />
                {[0, 1, 2, 3, 4].map((r) => (
                  <rect key={`b2-${r}`} x={170} y={80 + r * 42} width="100" height="24" rx="4" fill={windowFill} opacity={0.85} style={{ filter: windowGlow }} />
                ))}
              </g>

              {/* Building 3: GOTHIC CLOCK TOWER with Glowing Clock Face */}
              <g className="b-3">
                <rect x="310" y="70" width="130" height="250" rx="6" fill={isNight ? '#311b92' : isEvening ? '#581c87' : '#6366f1'} />
                <polygon points="300,70 375,0 450,70" fill={isNight ? '#1a237e' : isEvening ? '#3b0764' : '#4338ca'} />
                <circle cx="375" cy="110" r="22" fill="#fffef0" stroke="#fbbf24" strokeWidth="3.5" />
                <line x1="375" y1="110" x2="375" y2="95" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" />
                <line x1="375" y1="110" x2="387" y2="110" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" />
                {[0, 1, 2].map((r) =>
                  [0, 1].map((c) => (
                    <rect key={`b3-${r}-${c}`} x={335 + c * 45} y={150 + r * 48} width="24" height="32" rx="4" fill={windowFill} style={{ filter: windowGlow }} />
                  ))
                )}
              </g>

              {/* Building 4: Townhouse with Water Tower */}
              <g className="b-4">
                <rect x="470" y="130" width="130" height="190" rx="6" fill={isNight ? '#4338ca' : isEvening ? '#7c2d12' : '#fbbf24'} />
                <path d="M 460 130 L 535 85 L 610 130 Z" fill={isNight ? '#312e81' : isEvening ? '#7c2d12' : '#f59e0b'} />
                <rect x="490" y="55" width="30" height="30" fill="#78350f" rx="3" />
                <line x1="495" y1="85" x2="495" y2="100" stroke="#451a03" strokeWidth="3" />
                <line x1="515" y1="85" x2="515" y2="100" stroke="#451a03" strokeWidth="3" />
                {[0, 1].map((r) =>
                  [0, 1].map((c) => (
                    <rect key={`b4-${r}-${c}`} x={490 + c * 45} y={155 + r * 50} width="24" height="34" rx="4" fill={windowFill} style={{ filter: windowGlow }} />
                  ))
                )}
                <rect x="523" y="260" width="24" height="60" rx="4" fill={isNight ? '#1e1b4b' : '#78350f'} />
              </g>

              {/* Building 5: Corporate Tech Tower */}
              <g className="b-5">
                <rect x="620" y="40" width="160" height="280" rx="10" fill={isNight ? '#1e1b4b' : isEvening ? '#311b92' : '#818cf8'} />
                <rect x="640" y="18" width="120" height="22" rx="4" fill="url(#neonGlow)" />
                {[0, 1, 2, 3, 4, 5].map((r) =>
                  [0, 1, 2].map((c) => (
                    <rect key={`b5-${r}-${c}`} x={642 + c * 42} y={60 + r * 38} width="28" height="22" rx="3" fill={windowFill} style={{ filter: windowGlow }} />
                  ))
                )}
              </g>

              {/* Building 6: Yellow Urban Loft */}
              <g className="b-6">
                <rect x="800" y="100" width="145" height="220" rx="8" fill={isNight ? '#3730a3' : isEvening ? '#9a3412' : '#facc15'} />
                <rect x="820" y="85" width="105" height="15" rx="4" fill={isNight ? '#1e1b4b' : isEvening ? '#7c2d12' : '#eab308'} />
                {[0, 1, 2].map((r) =>
                  [0, 1].map((c) => (
                    <rect key={`b6-${r}-${c}`} x={825 + c * 55} y={120 + r * 55} width="38" height="36" rx="5" fill={windowFill} style={{ filter: windowGlow }} />
                  ))
                )}
              </g>

              {/* Building 7: Glass Pavilion */}
              <g className="b-7">
                <rect x="960" y="120" width="145" height="200" rx="8" fill={isNight ? '#1e293b' : isEvening ? '#334155' : '#475569'} />
                <circle cx="1032" cy="100" r="14" fill="#94a3b8" />
                {[0, 1, 2, 3].map((r) =>
                  [0, 1].map((c) => (
                    <rect key={`b7-${r}-${c}`} x={982 + c * 55} y={140 + r * 42} width="35" height="28" rx="4" fill={windowFill} style={{ filter: windowGlow }} />
                  ))
                )}
              </g>

              {/* Building 8: Classic Brownstone */}
              <g className="b-8">
                <rect x="1130" y="100" width="135" height="220" rx="6" fill={isNight ? '#4c1d95' : isEvening ? '#831843' : '#e11d48'} />
                <rect x="1120" y="90" width="155" height="12" fill={isNight ? '#3b0764' : isEvening ? '#701a75' : '#be123c'} rx="3" />
                {[0, 1, 2].map((r) =>
                  [0, 1].map((c) => (
                    <rect key={`b8-${r}-${c}`} x={1150 + c * 50} y={120 + r * 55} width="30" height="38" rx="4" fill={windowFill} style={{ filter: windowGlow }} />
                  ))
                )}
              </g>

              {/* Building 9: Modern Highrise */}
              <g className="b-9">
                <rect x="1280" y="40" width="160" height="280" rx="8" fill={isNight ? '#0f172a' : isEvening ? '#1e1b4b' : '#0284c7'} />
                <line x1="1280" y1="40" x2="1280" y2="320" stroke="#38bdf8" strokeWidth="4" />
                <line x1="1440" y1="40" x2="1440" y2="320" stroke="#38bdf8" strokeWidth="4" />
                {[0, 1, 2, 3, 4, 5].map((r) =>
                  [0, 1, 2].map((c) => (
                    <rect key={`b9-${r}-${c}`} x={1300 + c * 42} y={60 + r * 38} width="28" height="22" rx="3" fill={windowFill} style={{ filter: windowGlow }} />
                  ))
                )}
              </g>

              {/* Building 10: Industrial Loft */}
              <g className="b-10">
                <rect x="1460" y="130" width="140" height="190" rx="6" fill={isNight ? '#312e81' : isEvening ? '#431407' : '#d97706'} />
                <rect x="1570" y="60" width="16" height="70" fill="#78350f" rx="2" />
                {[0, 1].map((r) =>
                  [0, 1].map((c) => (
                    <rect key={`b10-${r}-${c}`} x={1480 + c * 50} y={155 + r * 55} width="32" height="38" rx="4" fill={windowFill} style={{ filter: windowGlow }} />
                  ))
                )}
              </g>

              {/* Building 11: Art Deco Tower */}
              <g className="b-11">
                <rect x="1620" y="50" width="135" height="270" rx="8" fill={isNight ? '#1e1b4b' : isEvening ? '#4a044e' : '#a855f7'} />
                <polygon points="1620,50 1687,10 1755,50" fill={isNight ? '#0f172a' : isEvening ? '#2e0249' : '#9333ea'} />
                {[0, 1, 2, 3, 4].map((r) =>
                  [0, 1].map((c) => (
                    <rect key={`b11-${r}-${c}`} x={1640 + c * 48} y={75 + r * 42} width="30" height="25" rx="3" fill={windowFill} style={{ filter: windowGlow }} />
                  ))
                )}
              </g>

              {/* Building 12: Edge Glass Building */}
              <g className="b-12">
                <rect x="1770" y="90" width="145" height="230" rx="6" fill={isNight ? '#1e293b' : isEvening ? '#1c1917' : '#0f766e'} />
                {[0, 1, 2, 3].map((r) =>
                  [0, 1].map((c) => (
                    <rect key={`b12-${r}-${c}`} x={1790 + c * 55} y={110 + r * 45} width="35" height="30" rx="4" fill={windowFill} style={{ filter: windowGlow }} />
                  ))
                )}
              </g>

              {/* LAYER 4: PARK PROMENADE & STREETLAMPS */}
              <polygon points="230,250 330,250 360,310 200,310" fill="url(#lampLightCone)" />
              <line x1="280" y1="245" x2="280" y2="310" stroke="#0f172a" strokeWidth="4.5" />
              <circle cx="280" cy="240" r="9" fill="#fde047" />

              <polygon points="650,250 750,250 780,310 620,310" fill="url(#lampLightCone)" />
              <line x1="700" y1="245" x2="700" y2="310" stroke="#0f172a" strokeWidth="4.5" />
              <circle cx="700" cy="240" r="9" fill="#fde047" />

              <polygon points="1130,250 1230,250 1260,310 1100,310" fill="url(#lampLightCone)" />
              <line x1="1180" y1="245" x2="1180" y2="310" stroke="#0f172a" strokeWidth="4.5" />
              <circle cx="1180" cy="240" r="9" fill="#fde047" />

              <polygon points="1600,250 1700,250 1730,310 1570,310" fill="url(#lampLightCone)" />
              <line x1="1650" y1="245" x2="1650" y2="310" stroke="#0f172a" strokeWidth="4.5" />
              <circle cx="1650" cy="240" r="9" fill="#fde047" />

              {/* Layered Trees & Flower Beds */}
              <g className="promenade-trees">
                <rect x="440" y="240" width="12" height="70" fill="#451a03" rx="3" />
                <circle cx="446" cy="220" r="30" fill={isNight ? '#064e3b' : '#22c55e'} />
                <circle cx="446" cy="205" r="22" fill={isNight ? '#065f46' : '#4ade80'} />

                <rect x="1360" y="240" width="12" height="70" fill="#451a03" rx="3" />
                <circle cx="1366" cy="220" r="32" fill={isNight ? '#064e3b' : '#15803d'} />
              </g>

              <g className="flower-beds">
                <circle cx="210" cy="302" r="5" fill="#f43f5e" />
                <circle cx="230" cy="300" r="4" fill="#fbbf24" />
                <circle cx="250" cy="303" r="5" fill="#38bdf8" />
                <circle cx="630" cy="302" r="5" fill="#f472b6" />
                <circle cx="650" cy="300" r="4" fill="#f59e0b" />
                <circle cx="1110" cy="302" r="5" fill="#a855f7" />
                <circle cx="1130" cy="300" r="4" fill="#fb7185" />
              </g>

              <rect x="0" y="310" width="1920" height="50" fill={isNight ? '#0f172a' : isEvening ? '#1c1917' : '#334155'} />
            </svg>
          </motion.div>
        ) : (
          /* ULTRA-RICH ENCHANTED FAIRY-TALE COUNTRYSIDE SCENERY */
          <motion.div
            key="nature-scenery"
            className="scenery-buildings-container"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
          >
            <svg
              className="scenery-svg"
              viewBox="0 0 1920 360"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="hillGrad1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={isNight ? '#065f46' : isEvening ? '#854d0e' : '#22c55e'} />
                  <stop offset="100%" stopColor={isNight ? '#022c22' : isEvening ? '#451a03' : '#15803d'} />
                </linearGradient>

                <linearGradient id="hillGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={isNight ? '#044e3b' : isEvening ? '#713f12' : '#16a34a'} />
                  <stop offset="100%" stopColor={isNight ? '#01231a' : isEvening ? '#361402' : '#166534'} />
                </linearGradient>

                <linearGradient id="streamGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#0284c7" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.95" />
                </linearGradient>

                <linearGradient id="cabinWallGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={isNight ? '#4c1d95' : '#78350f'} />
                  <stop offset="100%" stopColor={isNight ? '#2e1065' : '#451a03'} />
                </linearGradient>

                <linearGradient id="cabinRoofGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={isNight ? '#311b92' : '#b45309'} />
                  <stop offset="100%" stopColor={isNight ? '#1e1b4b' : '#78350f'} />
                </linearGradient>
              </defs>

              {/* LAYER 1: Distant Atmospheric Misty Mountain Peaks */}
              <path
                d="M 0 160 Q 300 80 650 140 Q 1000 70 1400 130 Q 1700 90 1920 150 L 1920 360 L 0 360 Z"
                fill={isNight ? '#0f172a' : isEvening ? '#581c87' : '#94a3b8'}
                opacity="0.45"
              />

              {/* LAYER 2: Back Rolling Hills & Stream */}
              <path
                d="M 0 190 Q 450 110 950 170 Q 1450 230 1920 150 L 1920 360 L 0 360 Z"
                fill="url(#hillGrad1)"
              />

              {/* Gentle Winding Blue River Stream */}
              <path
                d="M 750 220 Q 820 250 880 360 L 960 360 Q 890 260 810 220 Z"
                fill="url(#streamGrad)"
              />

              {/* LAYER 3: Front Rolling Hills */}
              <path
                d="M 0 220 Q 500 150 1000 210 Q 1500 270 1920 200 L 1920 360 L 0 360 Z"
                fill="url(#hillGrad2)"
              />

              {/* TIMBER CABIN 1 with Stone Chimney, Shingle Roof & Flower Boxes */}
              <g className="timber-cabin-1">
                {/* Stone Masonry Foundation */}
                <rect x="175" y="220" width="150" height="75" rx="6" fill="#334155" />
                {/* Timber Log Walls */}
                <rect x="180" y="170" width="140" height="60" rx="4" fill="url(#cabinWallGrad)" />
                {/* Log Line Accents */}
                <line x1="180" y1="185" x2="320" y2="185" stroke="#451a03" strokeWidth="2" opacity="0.6" />
                <line x1="180" y1="200" x2="320" y2="200" stroke="#451a03" strokeWidth="2" opacity="0.6" />
                <line x1="180" y1="215" x2="320" y2="215" stroke="#451a03" strokeWidth="2" opacity="0.6" />

                {/* Shingle Pitched Roof */}
                <polygon points="160,170 250,95 340,170" fill="url(#cabinRoofGrad)" />
                <line x1="160" y1="170" x2="250" y2="95" stroke="#f59e0b" strokeWidth="3" />
                <line x1="250" y1="95" x2="340" y2="170" stroke="#f59e0b" strokeWidth="3" />

                {/* Stone Chimney */}
                <rect x="290" y="90" width="22" height="50" fill="#475569" rx="3" />
                {/* Animated Rising Chimney Smoke Puffs */}
                <motion.circle cx="301" cy="78" r="8" fill="#f8fafc" opacity="0.6" animate={{ y: [-5, -30], opacity: [0.6, 0] }} transition={{ duration: 3, repeat: Infinity }} />
                <motion.circle cx="301" cy="78" r="5" fill="#e2e8f0" opacity="0.8" animate={{ y: [-2, -20], opacity: [0.8, 0] }} transition={{ duration: 2.4, repeat: Infinity, delay: 0.8 }} />

                {/* Arched Window with Cross Mullions & Flower Box */}
                <rect x="205" y="190" width="35" height="35" rx="10" fill={windowFill} style={{ filter: windowGlow }} />
                <line x1="222.5" y1="190" x2="222.5" y2="225" stroke="#78350f" strokeWidth="2" />
                <line x1="205" y1="207.5" x2="240" y2="207.5" stroke="#78350f" strokeWidth="2" />
                {/* Flower Box */}
                <rect x="200" y="226" width="45" height="8" rx="2" fill="#78350f" />
                <circle cx="208" cy="224" r="3.5" fill="#f43f5e" />
                <circle cx="218" cy="223" r="3.5" fill="#fbbf24" />
                <circle cx="228" cy="224" r="3.5" fill="#f472b6" />
                <circle cx="238" cy="223" r="3.5" fill="#38bdf8" />

                {/* Wooden Front Door */}
                <rect x="260" y="210" width="38" height="75" rx="4" fill="#451a03" />
                <circle cx="290" cy="248" r="3" fill="#fbbf24" />
              </g>

              {/* TIMBER CABIN 2 */}
              <g className="timber-cabin-2">
                <rect x="1135" y="225" width="160" height="70" rx="6" fill="#334155" />
                <rect x="1140" y="180" width="150" height="50" rx="4" fill="url(#cabinWallGrad)" />
                <polygon points="1120,180 1215,110 1310,180" fill="url(#cabinRoofGrad)" />
                <rect x="1260" y="105" width="20" height="45" fill="#475569" rx="3" />
                <motion.circle cx="1270" cy="92" r="7" fill="#f8fafc" opacity="0.6" animate={{ y: [-5, -28], opacity: [0.6, 0] }} transition={{ duration: 3.2, repeat: Infinity, delay: 1.2 }} />

                <circle cx="1215" cy="150" r="16" fill={windowFill} style={{ filter: windowGlow }} />
                <line x1="1215" y1="134" x2="1215" y2="166" stroke="#78350f" strokeWidth="2" />
                <line x1="1199" y1="150" x2="1231" y2="150" stroke="#78350f" strokeWidth="2" />

                <rect x="1165" y="200" width="35" height="32" rx="4" fill={windowFill} style={{ filter: windowGlow }} />
                <rect x="1230" y="215" width="38" height="75" rx="4" fill="#451a03" />
              </g>

              {/* Water Mill Wheel beside Stream */}
              <g className="water-mill">
                <circle cx="750" cy="270" r="28" stroke="#78350f" strokeWidth="5" fill="none" />
                <line x1="750" y1="242" x2="750" y2="298" stroke="#78350f" strokeWidth="3" />
                <line x1="722" y1="270" x2="778" y2="270" stroke="#78350f" strokeWidth="3" />
                <circle cx="750" cy="270" r="7" fill="#451a03" />
              </g>

              {/* LAYER 4: Detailed Oak & Pine Trees */}
              <g className="nature-trees">
                {/* Oak Tree 1 */}
                <rect x="520" y="190" width="18" height="105" fill="#451a03" rx="4" />
                <circle cx="529" cy="170" r="48" fill={isNight ? '#064e3b' : '#22c55e'} />
                <circle cx="529" cy="145" r="38" fill={isNight ? '#065f46' : '#4ade80'} />
                <circle cx="510" cy="165" r="28" fill={isNight ? '#064e3b' : '#16a34a'} />

                {/* Pine Tree 1 */}
                <rect x="880" y="180" width="18" height="110" fill="#451a03" rx="4" />
                <polygon points="840,240 889,160 938,240" fill={isNight ? '#064e3b' : '#15803d'} />
                <polygon points="850,195 889,130 928,195" fill={isNight ? '#065f46' : '#22c55e'} />
                <polygon points="860,150 889,95 918,150" fill={isNight ? '#047857' : '#4ade80'} />

                {/* Oak Tree 2 */}
                <rect x="1560" y="200" width="16" height="90" fill="#451a03" rx="3" />
                <circle cx="1568" cy="180" r="44" fill={isNight ? '#065f46' : '#16a34a'} />
                <circle cx="1568" cy="160" r="34" fill={isNight ? '#047857' : '#22c55e'} />
              </g>

              {/* Winding Dirt Path & Wooden Fences */}
              <path
                d="M 280 285 Q 400 270 550 300 Q 700 330 850 290 Q 1000 250 1200 285"
                stroke="#78350f"
                strokeWidth="16"
                strokeLinecap="round"
                fill="none"
                opacity="0.45"
              />

              <g className="wooden-fence" opacity="0.85">
                <line x1="100" y1="270" x2="160" y2="270" stroke="#78350f" strokeWidth="4" />
                <line x1="100" y1="280" x2="160" y2="280" stroke="#78350f" strokeWidth="4" />
                <line x1="105" y1="262" x2="105" y2="290" stroke="#451a03" strokeWidth="4" />
                <line x1="130" y1="262" x2="130" y2="290" stroke="#451a03" strokeWidth="4" />
                <line x1="155" y1="262" x2="155" y2="290" stroke="#451a03" strokeWidth="4" />
              </g>

              {/* Glowing Wild Mushrooms */}
              <g className="glowing-mushrooms">
                <path d="M 430 295 Q 436 276 442 295 Z" fill="#38bdf8" />
                <circle cx="436" cy="276" r="8" fill="#38bdf8" />
                <path d="M 980 298 Q 986 280 992 298 Z" fill="#f472b6" />
                <circle cx="986" cy="280" r="8" fill="#f472b6" />
                <path d="M 1480 292 Q 1486 274 1492 292 Z" fill="#facc15" />
                <circle cx="1486" cy="274" r="8" fill="#facc15" />
              </g>
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
