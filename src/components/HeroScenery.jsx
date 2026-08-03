import React from 'react';
import { motion } from 'framer-motion';

export default function HeroScenery({ timeOfDay = 'noon' }) {
  const isNight = timeOfDay === 'night';
  const isEvening = timeOfDay === 'evening';

  // Sun Trajectory variants across 4 stages
  const sunVariants = {
    morning: { x: 120, y: 60, opacity: 1, scale: 0.95, transition: { duration: 1.5, ease: 'easeInOut' } },
    noon: { x: 0, y: -30, opacity: 1, scale: 1.15, transition: { duration: 1.5, ease: 'easeInOut' } },
    evening: { x: -420, y: 70, opacity: 1, scale: 1.05, transition: { duration: 1.5, ease: 'easeInOut' } },
    night: { x: -550, y: 220, opacity: 0, scale: 0.5, transition: { duration: 1.2, ease: 'easeInOut' } },
  };

  // Moon Trajectory variants
  const moonVariants = {
    night: { y: 0, opacity: 1, scale: 1, transition: { duration: 1.5, ease: 'easeInOut' } },
    morning: { y: 160, opacity: 0, scale: 0.6, transition: { duration: 1.2, ease: 'easeInOut' } },
    noon: { y: 160, opacity: 0, scale: 0.6, transition: { duration: 1.2, ease: 'easeInOut' } },
    evening: { y: 160, opacity: 0, scale: 0.6, transition: { duration: 1.2, ease: 'easeInOut' } },
  };

  // Staggered rise variants for buildings
  const buildingContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const buildingItemVariants = {
    hidden: { y: 180, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 120,
        damping: 14,
      },
    },
  };

  // Window Fill colors per stage
  const getWindowFill = () => {
    switch (timeOfDay) {
      case 'morning': return '#fef08a'; // Soft warm sunrise
      case 'noon': return '#e0f2fe';    // Sky reflection
      case 'evening': return '#fed7aa'; // Crimson sunset glow
      case 'night': return '#fbbf24';   // Bright amber night light
      default: return '#e0f2fe';
    }
  };

  const windowFill = getWindowFill();
  const windowGlow = (isNight || isEvening) 
    ? 'drop-shadow(0px 0px 8px rgba(251, 191, 36, 0.75))' 
    : 'none';

  return (
    <div className="hero-scenery-wrapper" aria-hidden="true">
      {/* Visual Sun */}
      <motion.div
        className={`celestial-sun-container sun-stage-${timeOfDay}`}
        variants={sunVariants}
        animate={timeOfDay}
        initial={timeOfDay}
      >
        <div className="sun-core" />
        <div className="sun-glow-ring" />
      </motion.div>

      {/* Visual Moon */}
      <motion.div
        className="celestial-moon-container"
        variants={moonVariants}
        animate={timeOfDay}
        initial={timeOfDay}
      >
        <div className="moon-core">
          <div className="moon-crater crater-1" />
          <div className="moon-crater crater-2" />
        </div>
        <div className="moon-glow-ring" />
      </motion.div>

      {/* Cartoon Building Scenery Vector */}
      <motion.div
        className="scenery-buildings-container"
        variants={buildingContainerVariants}
        initial="hidden"
        animate="visible"
      >
        <svg
          className="scenery-svg"
          viewBox="0 0 1400 320"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMax slice"
        >
          {/* Background Far Buildings Layer */}
          <g className="far-buildings-layer" opacity={isNight ? 0.45 : isEvening ? 0.55 : 0.75}>
            <motion.rect variants={buildingItemVariants} x="80" y="70" width="90" height="250" rx="4" fill={isNight ? '#1e1b4b' : isEvening ? '#4c1d95' : '#94a3b8'} />
            <motion.rect variants={buildingItemVariants} x="220" y="40" width="110" height="280" rx="4" fill={isNight ? '#312e81' : isEvening ? '#581c87' : '#cbd5e1'} />
            <motion.rect variants={buildingItemVariants} x="540" y="90" width="85" height="230" rx="4" fill={isNight ? '#1e1b4b' : isEvening ? '#4c1d95' : '#94a3b8'} />
            <motion.rect variants={buildingItemVariants} x="820" y="30" width="120" height="290" rx="4" fill={isNight ? '#312e81' : isEvening ? '#581c87' : '#cbd5e1'} />
            <motion.rect variants={buildingItemVariants} x="1100" y="80" width="100" height="240" rx="4" fill={isNight ? '#1e1b4b' : isEvening ? '#4c1d95' : '#94a3b8'} />
          </g>

          {/* Midground Cartoon Buildings Layer */}
          {/* Building 1: Classic Brick Apartment */}
          <motion.g variants={buildingItemVariants} className="building-group">
            <rect x="30" y="110" width="130" height="210" rx="6" fill={isNight ? '#3730a3' : isEvening ? '#9f1239' : '#f87171'} />
            <rect x="25" y="100" width="140" height="12" rx="3" fill={isNight ? '#1e1b4b' : isEvening ? '#881337' : '#ef4444'} />
            {[0, 1, 2].map((row) =>
              [0, 1].map((col) => (
                <rect
                  key={`b1-${row}-${col}`}
                  x={50 + col * 45}
                  y={130 + row * 45}
                  width="25"
                  height="30"
                  rx="3"
                  fill={windowFill}
                  style={{ filter: windowGlow, transition: 'fill 1.2s ease' }}
                />
              ))
            )}
          </motion.g>

          {/* Building 2: Modern Skyscraper */}
          <motion.g variants={buildingItemVariants} className="building-group">
            <rect x="190" y="60" width="140" height="260" rx="8" fill={isNight ? '#1e293b' : isEvening ? '#431407' : '#38bdf8'} />
            <path d="M 190 60 L 260 10 L 330 60 Z" fill={isNight ? '#0f172a' : isEvening ? '#292524' : '#0284c7'} />
            {[0, 1, 2, 3, 4].map((row) => (
              <rect
                key={`b2-${row}`}
                x="210"
                y={80 + row * 42}
                width="100"
                height="24"
                rx="4"
                fill={windowFill}
                opacity={isNight ? 0.9 : 0.8}
                style={{ filter: windowGlow, transition: 'fill 1.2s ease' }}
              />
            ))}
          </motion.g>

          {/* Building 3: Townhouse */}
          <motion.g variants={buildingItemVariants} className="building-group">
            <rect x="360" y="130" width="120" height="190" rx="6" fill={isNight ? '#4338ca' : isEvening ? '#7c2d12' : '#fbbf24'} />
            <path d="M 350 130 L 420 85 L 490 130 Z" fill={isNight ? '#312e81' : isEvening ? '#7c2d12' : '#f59e0b'} />
            <circle cx="420" cy="112" r="10" fill={windowFill} style={{ filter: windowGlow }} />
            {[0, 1].map((row) =>
              [0, 1].map((col) => (
                <rect
                  key={`b3-${row}-${col}`}
                  x={380 + col * 42}
                  y={155 + row * 50}
                  width="24"
                  height="34"
                  rx="4"
                  fill={windowFill}
                  style={{ filter: windowGlow, transition: 'fill 1.2s ease' }}
                />
              ))
            )}
            <rect x="408" y="260" width="24" height="60" rx="4" fill={isNight ? '#1e1b4b' : '#78350f'} />
          </motion.g>

          {/* Trees & Scenery Accent */}
          <motion.g variants={buildingItemVariants} className="tree-group">
            <rect x="510" y="240" width="12" height="80" fill="#78350f" rx="3" />
            <circle cx="516" cy="220" r="32" fill={isNight ? '#065f46' : isEvening ? '#064e3b' : '#22c55e'} />
            <circle cx="516" cy="205" r="24" fill={isNight ? '#047857' : isEvening ? '#065f46' : '#4ade80'} />

            <rect x="555" y="250" width="10" height="70" fill="#78350f" rx="2" />
            <circle cx="560" cy="235" r="25" fill={isNight ? '#065f46' : isEvening ? '#047857' : '#16a34a'} />
          </motion.g>

          {/* Building 4: Corporate Tower */}
          <motion.g variants={buildingItemVariants} className="building-group">
            <rect x="600" y="40" width="160" height="280" rx="10" fill={isNight ? '#1e1b4b' : isEvening ? '#311b92' : '#818cf8'} />
            <rect x="620" y="20" width="120" height="20" rx="4" fill={isNight ? '#312e81' : isEvening ? '#1a237e' : '#6366f1'} />
            {[0, 1, 2, 3, 4, 5].map((row) =>
              [0, 1, 2].map((col) => (
                <rect
                  key={`b4-${row}-${col}`}
                  x={622 + col * 42}
                  y={60 + row * 38}
                  width="28"
                  height="22"
                  rx="3"
                  fill={windowFill}
                  style={{ filter: windowGlow, transition: 'fill 1.2s ease' }}
                />
              ))
            )}
          </motion.g>

          {/* Building 5: Yellow Urban Loft */}
          <motion.g variants={buildingItemVariants} className="building-group">
            <rect x="790" y="100" width="150" height="220" rx="8" fill={isNight ? '#3730a3' : isEvening ? '#9a3412' : '#facc15'} />
            <rect x="810" y="85" width="110" height="15" rx="4" fill={isNight ? '#1e1b4b' : isEvening ? '#7c2d12' : '#eab308'} />
            {[0, 1, 2].map((row) =>
              [0, 1].map((col) => (
                <rect
                  key={`b5-${row}-${col}`}
                  x={815 + col * 60}
                  y={120 + row * 55}
                  width="40"
                  height="36"
                  rx="5"
                  fill={windowFill}
                  style={{ filter: windowGlow, transition: 'fill 1.2s ease' }}
                />
              ))
            )}
          </motion.g>

          {/* Building 6: Glass Pavilion */}
          <motion.g variants={buildingItemVariants} className="building-group">
            <rect x="970" y="140" width="130" height="180" rx="6" fill={isNight ? '#1e293b' : isEvening ? '#334155' : '#475569'} />
            {[0, 1, 2].map((row) =>
              [0, 1].map((col) => (
                <rect
                  key={`b6-${row}-${col}`}
                  x={990 + col * 45}
                  y={160 + row * 45}
                  width="30"
                  height="30"
                  rx="4"
                  fill={windowFill}
                  style={{ filter: windowGlow, transition: 'fill 1.2s ease' }}
                />
              ))
            )}
          </motion.g>

          {/* Right Trees */}
          <motion.g variants={buildingItemVariants} className="tree-group">
            <rect x="1130" y="230" width="12" height="90" fill="#78350f" rx="3" />
            <circle cx="1136" cy="210" r="35" fill={isNight ? '#065f46' : isEvening ? '#047857' : '#22c55e'} />
          </motion.g>

          {/* Foreground Road & Sidewalk Line */}
          <rect x="0" y="310" width="1400" height="10" fill={isNight ? '#0f172a' : isEvening ? '#1c1917' : '#334155'} />
        </svg>
      </motion.div>
    </div>
  );
}
