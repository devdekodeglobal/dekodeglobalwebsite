import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HeroScenery({ timeOfDay = 'noon' }) {
  const isNight = timeOfDay === 'night';
  const isEvening = timeOfDay === 'evening';
  const isMorning = timeOfDay === 'morning';
  const isAfternoon = timeOfDay === 'noon';

  // Generate static twinkling stars with a subtle parallax-ready grouping
  const stars = useMemo(() => Array.from({ length: 220 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    delay: Math.random() * 5,
    duration: Math.random() * 3 + 2,
    opacity: Math.random() * 0.7 + 0.3,
  })), []);

  // Ambient sparkles (soft glowing orbs) for daytime & evening
  const sparkles = useMemo(() => Array.from({ length: 25 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 80,
    size: Math.random() * 4 + 2,
    duration: 6 + Math.random() * 6,
    delay: Math.random() * 5,
  })), []);

  // Celestial Positions mapped across the 4 stages
  // Raised the dawn/dusk positions to ~45/135 degrees so they sit beautifully above the chat UI
  const celestialConfig = {
    morning: {
      body: { x: '25vw', y: '32vh', scale: 1 },
      sunOpacity: 0.9,
      moonOpacity: 0,
    },
    noon: {
      body: { x: '50vw', y: '12vh', scale: 1.1 },
      sunOpacity: 1,
      moonOpacity: 0,
    },
    evening: {
      body: { x: '75vw', y: '32vh', scale: 1.15 },
      sunOpacity: 1,
      moonOpacity: 0,
    },
    night: {
      body: { x: '50vw', y: '20vh', scale: 1 },
      sunOpacity: 0,
      moonOpacity: 1,
    }
  };

  const targetState = celestialConfig[timeOfDay] || celestialConfig.noon;

  return (
    <div className="hero-scenery-wrapper minimalist-sky" aria-hidden="true" style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      
      {/* Rich Atmospheric Sky Gradients */}
      <AnimatePresence mode="wait">
        {isMorning && (
          <motion.div
            key="grad-morning"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.5, ease: 'easeInOut' }}
            style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(251, 146, 60, 0.4) 0%, rgba(147, 51, 234, 0.25) 40%, rgba(30, 27, 75, 0.6) 100%)', zIndex: 0 }}
          />
        )}
        {isAfternoon && (
          <motion.div
            key="grad-noon"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.5, ease: 'easeInOut' }}
            style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 10%, rgba(186, 230, 253, 0.5) 0%, rgba(56, 189, 248, 0.15) 55%, transparent 85%)', zIndex: 0 }}
          />
        )}
        {isEvening && (
          <motion.div
            key="grad-evening"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.5, ease: 'easeInOut' }}
            style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(225, 29, 72, 0.4) 0%, rgba(147, 51, 234, 0.3) 50%, rgba(30, 27, 75, 0.2) 100%)', zIndex: 0 }}
          />
        )}
        {isNight && (
          <motion.div
            key="grad-night"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.5, ease: 'easeInOut' }}
            style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(3, 7, 18, 0.95) 0%, rgba(15, 23, 42, 0.9) 60%, rgba(30, 27, 75, 0.8) 100%)', zIndex: 0 }}
          />
        )}
      </AnimatePresence>

      {/* Elegant Slow-Moving Cosmic Nebula for Night (Replaces Shooting Stars) */}
      <AnimatePresence>
        {isNight && (
          <>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: [0.15, 0.35, 0.15],
                scale: [0.9, 1.1, 0.9],
                rotate: [0, 10, 0]
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                top: '-20%',
                left: '-10%',
                width: '120%',
                height: '80vh',
                background: 'radial-gradient(ellipse at 30% 40%, rgba(56, 189, 248, 0.2), transparent 70%)',
                filter: 'blur(60px)',
                zIndex: 0.5,
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: [0.1, 0.25, 0.1],
                scale: [1, 1.2, 1],
                rotate: [0, -5, 0]
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
              style={{
                position: 'absolute',
                top: '-10%',
                right: '-20%',
                width: '120%',
                height: '80vh',
                background: 'radial-gradient(ellipse at 70% 30%, rgba(168, 85, 247, 0.15), transparent 70%)',
                filter: 'blur(60px)',
                zIndex: 0.5,
              }}
            />
          </>
        )}
      </AnimatePresence>

      {/* Starry Night Layer with Slow Parallax Drift */}
      <AnimatePresence>
        {(isNight || isMorning || isEvening) && (
          <motion.div
            className="stars-container"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: isNight ? 1 : isMorning ? 0.35 : 0.5,
              y: [0, -20, 0] // Subtle drift
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              opacity: { duration: 2.5, ease: 'easeInOut' },
              y: { duration: 60, repeat: Infinity, ease: 'linear' }
            }}
            style={{ position: 'absolute', inset: -40, zIndex: 1 }}
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

      {/* Floating Ambient Light Orbs (Daytime & Sunset) */}
      <AnimatePresence>
        {!isNight && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
            style={{ position: 'absolute', inset: 0, zIndex: 1.5 }}
          >
            {sparkles.map(sp => (
              <motion.div
                key={sp.id}
                style={{
                  position: 'absolute',
                  left: `${sp.x}%`,
                  top: `${sp.y}%`,
                  width: `${sp.size}px`,
                  height: `${sp.size}px`,
                  borderRadius: '50%',
                  backgroundColor: isEvening ? '#fda4af' : isMorning ? '#fef08a' : '#e0f2fe',
                  boxShadow: `0 0 ${sp.size * 3}px ${isEvening ? 'rgba(244,63,94,0.6)' : 'rgba(253,224,71,0.6)'}`,
                }}
                animate={{
                  y: [`${sp.y}%`, `${sp.y - 8}%`, `${sp.y}%`],
                  opacity: [0.1, 0.6, 0.1],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: sp.duration,
                  delay: sp.delay,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Unified Celestial Body (Sun morphs into Moon) */}
      <motion.div
        className="celestial-body-container"
        initial={false}
        animate={{
          x: `calc(${targetState.body.x} - 55px)`,
          y: `calc(${targetState.body.y} - 55px)`,
          scale: targetState.body.scale,
        }}
        transition={{ type: 'spring', damping: 35, stiffness: 20, mass: 1 }}
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
