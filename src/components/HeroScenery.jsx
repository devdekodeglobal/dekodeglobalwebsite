import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HeroScenery({ timeOfDay = 'noon' }) {
  const isNight = timeOfDay === 'night';
  const isEvening = timeOfDay === 'evening';
  const isMorning = timeOfDay === 'morning';
  const isAfternoon = timeOfDay === 'noon';

  // Generate 250 static stars only once per session for a richer night sky
  const stars = useMemo(() => Array.from({ length: 250 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    delay: Math.random() * 5,
    duration: Math.random() * 3 + 2,
    opacity: Math.random() * 0.6 + 0.4,
  })), []);

  // Celestial Positions mapped for an arc across the screen
  // Instead of two bodies, a single celestial body morphs across the sky
  const celestialConfig = {
    morning: {
      body: { x: '15vw', y: '30vh', scale: 1 },
      sunOpacity: 1,
      moonOpacity: 0,
    },
    noon: {
      body: { x: '50vw', y: '10vh', scale: 1 },
      sunOpacity: 1,
      moonOpacity: 0,
    },
    evening: {
      body: { x: '85vw', y: '45vh', scale: 1.2 },
      sunOpacity: 1,
      moonOpacity: 0, // Still the sun, getting larger as it sets
    },
    night: {
      body: { x: '50vw', y: '20vh', scale: 1 },
      sunOpacity: 0, // Sun fades out completely
      moonOpacity: 1, // Moon fades in perfectly in its place
    }
  };

  const targetState = celestialConfig[timeOfDay] || celestialConfig.noon;

  return (
    <div className="hero-scenery-wrapper minimalist-sky" aria-hidden="true" style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      
      {/* Dynamic Sky Gradient Underlay for extra twilight depth */}
      <AnimatePresence>
        {isEvening && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 3, ease: 'easeInOut' }}
            style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(244,63,94,0.3) 0%, transparent 60%)', zIndex: 0 }}
          />
        )}
        {isNight && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 3, ease: 'easeInOut' }}
            style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(2,6,23,0.8) 0%, rgba(30,27,75,0.8) 100%)', zIndex: 0 }}
          />
        )}
      </AnimatePresence>

      {/* Starry Night Layer */}
      <AnimatePresence>
        {(isNight || isEvening) && (
          <motion.div
            className="stars-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: isNight ? 1 : 0.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 3, ease: 'easeInOut' }}
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
                  boxShadow: `0 0 ${star.size * 2}px rgba(255, 255, 255, 0.8)`
                }}
                animate={{ opacity: [star.opacity * 0.2, star.opacity, star.opacity * 0.2] }}
                transition={{ duration: star.duration, delay: star.delay, repeat: Infinity, ease: 'easeInOut' }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Unified Celestial Body (Sun that morphs into Moon) */}
      <motion.div
        className="celestial-body-container"
        initial={false}
        animate={{
          x: `calc(${targetState.body.x} - 55px)`,
          y: `calc(${targetState.body.y} - 55px)`,
          scale: targetState.body.scale,
        }}
        // Slowed down transition: much higher damping/stiffness creates a slower, majestic sweeping arc
        transition={{ type: 'spring', damping: 40, stiffness: 20, mass: 1 }}
        style={{ zIndex: 2 }}
      >
        {/* Sun Visuals */}
        <motion.div
          style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          initial={false}
          animate={{ opacity: targetState.sunOpacity }}
          transition={{ duration: 2, ease: 'easeInOut' }}
        >
          <div className="sun-core" />
          <div className="sun-glow-ring" />
        </motion.div>

        {/* Moon Visuals */}
        <motion.div
          style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          initial={false}
          animate={{ opacity: targetState.moonOpacity }}
          transition={{ duration: 2, ease: 'easeInOut' }}
        >
          <div className="moon-core">
            <div className="moon-crater crater-1" />
            <div className="moon-crater crater-2" />
          </div>
          <div className="moon-glow-ring" />
        </motion.div>
      </motion.div>
    </div>
  );
}
