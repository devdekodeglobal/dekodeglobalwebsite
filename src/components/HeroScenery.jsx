import React from 'react';
import { motion } from 'framer-motion';

export default function HeroScenery({ isNight }) {
  // Animation variants for celestial objects (Sun & Moon)
  const sunVariants = {
    day: { y: 0, opacity: 1, scale: 1, transition: { duration: 1.2, ease: [0.34, 1.56, 0.64, 1] } },
    night: { y: 140, opacity: 0, scale: 0.6, transition: { duration: 0.9, ease: 'easeInOut' } },
  };

  const moonVariants = {
    night: { y: 0, opacity: 1, scale: 1, transition: { duration: 1.2, ease: [0.34, 1.56, 0.64, 1] } },
    day: { y: 140, opacity: 0, scale: 0.6, transition: { duration: 0.9, ease: 'easeInOut' } },
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

  // Color dynamics based on Day/Night
  const windowFill = isNight ? '#fbbf24' : '#bae6fd';
  const windowGlow = isNight ? 'drop-shadow(0px 0px 6px rgba(251, 191, 36, 0.7))' : 'none';

  return (
    <div className="hero-scenery-wrapper" aria-hidden="true">
      {/* Visual Sun */}
      <motion.div
        className="celestial-sun-container"
        variants={sunVariants}
        animate={isNight ? 'night' : 'day'}
        initial={isNight ? 'night' : 'day'}
      >
        <div className="sun-core" />
        <div className="sun-glow-ring" />
      </motion.div>

      {/* Visual Moon */}
      <motion.div
        className="celestial-moon-container"
        variants={moonVariants}
        animate={isNight ? 'night' : 'day'}
        initial={isNight ? 'night' : 'day'}
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
          <g className="far-buildings-layer" opacity={isNight ? 0.45 : 0.65}>
            {/* Far Left Highrise */}
            <motion.rect variants={buildingItemVariants} x="80" y="70" width="90" height="250" rx="4" fill={isNight ? '#1e1b4b' : '#94a3b8'} />
            <motion.rect variants={buildingItemVariants} x="220" y="40" width="110" height="280" rx="4" fill={isNight ? '#312e81' : '#cbd5e1'} />
            <motion.rect variants={buildingItemVariants} x="540" y="90" width="85" height="230" rx="4" fill={isNight ? '#1e1b4b' : '#94a3b8'} />
            <motion.rect variants={buildingItemVariants} x="820" y="30" width="120" height="290" rx="4" fill={isNight ? '#312e81' : '#cbd5e1'} />
            <motion.rect variants={buildingItemVariants} x="1100" y="80" width="100" height="240" rx="4" fill={isNight ? '#1e1b4b' : '#94a3b8'} />
          </g>

          {/* Midground Cartoon Buildings Layer */}
          {/* Building 1: Classic Brick Apartment (Left) */}
          <motion.g variants={buildingItemVariants} className="building-group">
            <rect x="30" y="110" width="130" height="210" rx="6" fill={isNight ? '#3730a3' : '#f87171'} />
            {/* Roof trim */}
            <rect x="25" y="100" width="140" height="12" rx="3" fill={isNight ? '#1e1b4b' : '#ef4444'} />
            {/* Windows */}
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
                  style={{ filter: windowGlow, transition: 'fill 0.8s ease' }}
                />
              ))
            )}
          </motion.g>

          {/* Building 2: Modern Skyscraper (Center-Left) */}
          <motion.g variants={buildingItemVariants} className="building-group">
            <rect x="190" y="60" width="140" height="260" rx="8" fill={isNight ? '#1e293b' : '#38bdf8'} />
            {/* Diagonal Spire Roof */}
            <path d="M 190 60 L 260 10 L 330 60 Z" fill={isNight ? '#0f172a' : '#0284c7'} />
            {/* Glass strip windows */}
            {[0, 1, 2, 3, 4].map((row) => (
              <rect
                key={`b2-${row}`}
                x="210"
                y={80 + row * 42}
                width="100"
                height="24"
                rx="4"
                fill={windowFill}
                opacity={isNight ? 0.9 : 0.75}
                style={{ filter: windowGlow, transition: 'fill 0.8s ease' }}
              />
            ))}
          </motion.g>

          {/* Building 3: Townhouse (Center) */}
          <motion.g variants={buildingItemVariants} className="building-group">
            <rect x="360" y="130" width="120" height="190" rx="6" fill={isNight ? '#4338ca' : '#fbbf24'} />
            {/* Triangle Roof */}
            <path d="M 350 130 L 420 85 L 490 130 Z" fill={isNight ? '#312e81' : '#f59e0b'} />
            {/* Round window */}
            <circle cx="420" cy="112" r="10" fill={windowFill} style={{ filter: windowGlow }} />
            {/* Windows */}
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
                  style={{ filter: windowGlow, transition: 'fill 0.8s ease' }}
                />
              ))
            )}
            {/* Door */}
            <rect x="408" y="260" width="24" height="60" rx="4" fill={isNight ? '#1e1b4b' : '#78350f'} />
          </motion.g>

          {/* Trees & Scenery Accent (Center Gap) */}
          <motion.g variants={buildingItemVariants} className="tree-group">
            <rect x="510" y="240" width="12" height="80" fill="#78350f" rx="3" />
            <circle cx="516" cy="220" r="32" fill={isNight ? '#065f46' : '#22c55e'} />
            <circle cx="516" cy="205" r="24" fill={isNight ? '#047857' : '#4ade80'} />

            <rect x="555" y="250" width="10" height="70" fill="#78350f" rx="2" />
            <circle cx="560" cy="235" r="25" fill={isNight ? '#065f46' : '#16a34a'} />
          </motion.g>

          {/* Building 4: Corporate Tower (Center-Right) */}
          <motion.g variants={buildingItemVariants} className="building-group">
            <rect x="600" y="40" width="160" height="280" rx="10" fill={isNight ? '#1e1b4b' : '#818cf8'} />
            <rect x="620" y="20" width="120" height="20" rx="4" fill={isNight ? '#312e81' : '#6366f1'} />
            {/* Grid Windows */}
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
                  style={{ filter: windowGlow, transition: 'fill 0.8s ease' }}
                />
              ))
            )}
          </motion.g>

          {/* Building 5: Yellow Urban Loft (Right) */}
          <motion.g variants={buildingItemVariants} className="building-group">
            <rect x="790" y="100" width="150" height="220" rx="8" fill={isNight ? '#3730a3' : '#facc15'} />
            {/* Roof Top Accent */}
            <rect x="810" y="85" width="110" height="15" rx="4" fill={isNight ? '#1e1b4b' : '#eab308'} />
            {/* Large Loft Windows */}
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
                  style={{ filter: windowGlow, transition: 'fill 0.8s ease' }}
                />
              ))
            )}
          </motion.g>

          {/* Building 6: Glass Pavilion (Far Right) */}
          <motion.g variants={buildingItemVariants} className="building-group">
            <rect x="970" y="140" width="130" height="180" rx="6" fill={isNight ? '#1e293b' : '#475569'} />
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
                  style={{ filter: windowGlow, transition: 'fill 0.8s ease' }}
                />
              ))
            )}
          </motion.g>

          {/* Right Trees */}
          <motion.g variants={buildingItemVariants} className="tree-group">
            <rect x="1130" y="230" width="12" height="90" fill="#78350f" rx="3" />
            <circle cx="1136" cy="210" r="35" fill={isNight ? '#065f46' : '#22c55e'} />
          </motion.g>

          {/* Foreground Road & Sidewalk Line */}
          <rect x="0" y="310" width="1400" height="10" fill={isNight ? '#0f172a' : '#334155'} />
        </svg>
      </motion.div>
    </div>
  );
}
