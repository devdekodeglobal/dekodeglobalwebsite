import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HeroScenery({ timeOfDay = 'noon' }) {
  const isNight = timeOfDay === 'night';
  const isEvening = timeOfDay === 'evening';

  // Generate 150 static stars only once per session
  const stars = useMemo(() => Array.from({ length: 150 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    delay: Math.random() * 5,
    duration: Math.random() * 3 + 2,
    opacity: Math.random() * 0.5 + 0.5,
  })), []);

  // Celestial Positions mapped for an arc across the screen
  // Sun travels from left to right and sets. Moon rises from left to right.
  const celestialConfig = {
    morning: {
      sun: { x: '15vw', y: '30vh', opacity: 1, scale: 1 },
      moon: { x: '15vw', y: '120vh', opacity: 0, scale: 0.8 },
    },
    noon: {
      sun: { x: '50vw', y: '10vh', opacity: 1, scale: 1 },
      moon: { x: '50vw', y: '120vh', opacity: 0, scale: 0.8 },
    },
    evening: {
      sun: { x: '85vw', y: '45vh', opacity: 1, scale: 1.2 },
      moon: { x: '15vw', y: '90vh', opacity: 0.5, scale: 0.8 }, // Moon starts peaking
    },
    night: {
      sun: { x: '85vw', y: '120vh', opacity: 0, scale: 0.8 }, // Sun has set
      moon: { x: '50vw', y: '20vh', opacity: 1, scale: 1 }, // Moon is high
    }
  };

  const sunTarget = celestialConfig[timeOfDay]?.sun || celestialConfig.noon.sun;
  const moonTarget = celestialConfig[timeOfDay]?.moon || celestialConfig.noon.moon;

  return (
    <div className="hero-scenery-wrapper minimalist-sky" aria-hidden="true" style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      
      {/* Starry Night Layer */}
      <AnimatePresence>
        {(isNight || isEvening) && (
          <motion.div
            className="stars-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: isNight ? 1 : 0.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            style={{ position: 'absolute', inset: 0, zIndex: 1 }}
          >
            {stars.map(star => (
              <motion.div
                key={star.id}
                style={{
                  position: 'absolute',
                  left: `${star.x}%`,
                  top: `${star.y}%`,
                  width: `${star.size}px`,
                  height: `${star.size}px`,
                  backgroundColor: '#fff',
                  borderRadius: '50%',
                }}
                animate={{ opacity: [star.opacity * 0.3, star.opacity, star.opacity * 0.3] }}
                transition={{ duration: star.duration, delay: star.delay, repeat: Infinity, ease: 'easeInOut' }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sun */}
      <motion.div
        className="celestial-sun-container"
        initial={false}
        animate={{
          x: `calc(${sunTarget.x} - 55px)`,
          y: `calc(${sunTarget.y} - 55px)`,
          opacity: sunTarget.opacity,
          scale: sunTarget.scale,
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 45, mass: 1 }}
        style={{ zIndex: 2 }}
      >
        <div className="sun-core" />
        <div className="sun-glow-ring" />
      </motion.div>

      {/* Moon */}
      <motion.div
        className="celestial-moon-container"
        initial={false}
        animate={{
          x: `calc(${moonTarget.x} - 50px)`,
          y: `calc(${moonTarget.y} - 50px)`,
          opacity: moonTarget.opacity,
          scale: moonTarget.scale,
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 45, mass: 1 }}
        style={{ zIndex: 2 }}
      >
        <div className="moon-core">
          <div className="moon-crater crater-1" />
          <div className="moon-crater crater-2" />
        </div>
        <div className="moon-glow-ring" />
      </motion.div>
    </div>
  );
}
