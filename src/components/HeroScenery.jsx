import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HeroScenery({ timeOfDay = 'noon' }) {
  const isNight = timeOfDay === 'night';
  const isEvening = timeOfDay === 'evening';
  const isMorning = timeOfDay === 'morning';
  const isAfternoon = timeOfDay === 'noon';

  // Responsive layout state to adjust celestial positions for mobile screens
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia("(max-width: 768px)").matches
  );

  useEffect(() => {
    const media = window.matchMedia("(max-width: 768px)");
    const updateLayoutMode = (event) => setIsMobile(event.matches);
    // Add event listener (using addEventListener for modern browser support)
    if (media.addEventListener) {
      media.addEventListener("change", updateLayoutMode);
    } else {
      media.addListener(updateLayoutMode);
    }
    return () => {
      if (media.removeEventListener) {
        media.removeEventListener("change", updateLayoutMode);
      } else {
        media.removeListener(updateLayoutMode);
      }
    };
  }, []);

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
  // Adjust dawn/dusk positions based on device size so they sit beautifully above the chat UI
  const celestialConfig = {
    morning: {
      body: { x: isMobile ? '15vw' : '25vw', y: isMobile ? '20vh' : '32vh', scale: 1 },
      sunOpacity: 0.9,
      moonOpacity: 0,
    },
    noon: {
      body: { x: '50vw', y: isMobile ? '10vh' : '12vh', scale: 1.1 },
      sunOpacity: 1,
      moonOpacity: 0,
    },
    evening: {
      body: { x: isMobile ? '85vw' : '75vw', y: isMobile ? '20vh' : '32vh', scale: 1.15 },
      sunOpacity: 1,
      moonOpacity: 0,
    },
    night: {
      body: { x: '50vw', y: isMobile ? '12vh' : '20vh', scale: 1 },
      sunOpacity: 0,
      moonOpacity: 1,
    }
  };

  const targetState = celestialConfig[timeOfDay] || celestialConfig.noon;

  return (
    <div className="hero-scenery-wrapper minimalist-sky" aria-hidden="true" style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      <style>{styles}</style>

      {/* Ambient Layer Removed */}

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

      {/* Unified Celestial Body (Sun morphs into Moon) - Hidden during sports scenes */}
      {!(holidayId === 'cricket' || holidayId === 'soccer') && (
        <motion.div
          className="celestial-body-container"
          initial={false}
          animate={{
            x: `calc(${targetState.body.x} - 55px)`,
            y: `calc(${targetState.body.y} - 55px)`,
            scale: holidayId === 'yoga_day' ? [targetState.body.scale, targetState.body.scale * 1.15, targetState.body.scale] : targetState.body.scale,
            filter: (function () {
              if (holidayId === 'halloween') return 'drop-shadow(0 0 20px rgba(234, 88, 12, 0.8))'; // Vibrant Orange Glow
              if (holidayId === 'earth_day' || holidayId === 'environment_day') return 'sepia(0.8) hue-rotate(90deg) saturate(2.5)'; // Earth Green
              if (holidayId === 'valentines_day' || holidayId === 'mothers_day') return 'sepia(0.6) hue-rotate(-80deg) saturate(2.5)'; // Rose Pink
              if (holidayId === 'st_patricks_day') return 'sepia(0.9) hue-rotate(85deg) saturate(3)'; // Shamrock Green
              if (holidayId === 'diwali') return 'sepia(0.9) hue-rotate(-10deg) saturate(3) brightness(1.2)'; // Diya Golden Flame
              if (holidayId === 'christmas' || holidayId === 'christmas_countdown') return 'sepia(0.8) hue-rotate(-15deg) saturate(3) brightness(1.3)'; // Festive Red-Gold
              if (holidayId === 'womens_day') return 'sepia(0.5) hue-rotate(-90deg) saturate(2.5)'; // Sakura Pink
              if (holidayId === 'mens_day' || holidayId === 'fathers_day') return 'sepia(0.8) hue-rotate(180deg) saturate(2.5)'; // Sapphire Blue
              if (holidayId === 'yoga_day') return 'sepia(0.6) hue-rotate(140deg) saturate(2)'; // Teal Pulse
              if (holidayId === 'friendship_day') return 'saturate(3) brightness(1.2)'; // Warm Gold
              if (holidayId === 'new_years' || holidayId === 'new_years_eve') return 'saturate(2) brightness(1.3) contrast(1.1)'; // Golden Starburst
              return 'sepia(0) hue-rotate(0deg) saturate(1) brightness(1)'; // Default
            })()
          }}
          transition={{
            x: { type: 'tween', duration: 2.5, ease: 'linear' },
            y: { type: 'tween', duration: 2.5, ease: (timeOfDay === 'morning' || timeOfDay === 'evening') ? 'easeIn' : 'easeOut' },
            scale: holidayId === 'yoga_day' ? { duration: 4, ease: 'easeInOut', repeat: Infinity } : { type: 'tween', duration: 2.5, ease: 'easeInOut' },
            filter: { duration: 2.5, ease: 'easeInOut' }
          }}
          style={{ zIndex: 50 }}
        >
          {/* Halloween Jack-O-Lantern Glowing Carved Face */}
          {holidayId === 'halloween' && (
            <div style={{ position: 'absolute', inset: 0, zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
              <svg width="75" height="75" viewBox="0 0 100 100">
                {/* Solid Pumpkin Shell based on timeOfDay */}
                <motion.circle
                  cx="50" cy="50" r="48"
                  initial={false}
                  animate={{
                    fill: timeOfDay === 'night' ? '#c2410c' :
                      timeOfDay === 'evening' ? '#ea580c' :
                        timeOfDay === 'morning' ? '#fb923c' : '#f97316'
                  }}
                  transition={{ duration: 2 }}
                />

                {/* Pumpkin texture lines */}
                <path d="M 50 2 Q 25 50 50 98" fill="none" stroke="#7c2d12" strokeWidth="3" opacity="0.4" />
                <path d="M 50 2 Q 75 50 50 98" fill="none" stroke="#7c2d12" strokeWidth="3" opacity="0.4" />
                <path d="M 50 2 Q 0 50 50 98" fill="none" stroke="#7c2d12" strokeWidth="2" opacity="0.2" />
                <path d="M 50 2 Q 100 50 50 98" fill="none" stroke="#7c2d12" strokeWidth="2" opacity="0.2" />

                {/* Changing Face Logic with Dynamic Glow (Matching the classic 3D carved look) */}
                {/* Base Carved Shadow (Dark Layer) - creates the 3D depth */}
                <motion.g
                  transform="translate(0, 3)"
                  initial={false}
                  animate={{
                    fill: (timeOfDay === 'morning' || timeOfDay === 'noon') ? '#78350f' : '#450a0a'
                  }}
                  transition={{ duration: 2 }}
                >
                  <path d="M 22 48 L 42 38 L 42 52 Z" />
                  <path d="M 78 48 L 58 38 L 58 52 Z" />
                  <path d="M 50 52 L 45 60 L 55 60 Z" />
                  <path d="M 15 65 L 25 75 L 35 60 L 50 75 L 65 60 L 75 75 L 85 65 L 80 82 L 65 68 L 50 88 L 35 68 L 20 82 Z" />
                </motion.g>

                {/* Glowing Inner Layer (Light Layer) - only glows in evening/night */}
                <motion.g
                  initial={false}
                  animate={{
                    opacity: (timeOfDay === 'morning' || timeOfDay === 'noon') ? 0 : 1,
                    fill: timeOfDay === 'night' ? '#fef08a' : '#fca5a5',
                    filter: timeOfDay === 'night'
                      ? 'drop-shadow(0 0 6px #fef08a) drop-shadow(0 0 12px #f97316)'
                      : 'drop-shadow(0 0 4px #ef4444) drop-shadow(0 0 8px #ea580c)'
                  }}
                  transition={{ duration: 2 }}
                >
                  <path d="M 22 48 L 42 38 L 42 52 Z" />
                  <path d="M 78 48 L 58 38 L 58 52 Z" />
                  <path d="M 50 52 L 45 60 L 55 60 Z" />
                  <path d="M 15 65 L 25 75 L 35 60 L 50 75 L 65 60 L 75 75 L 85 65 L 80 82 L 65 68 L 50 88 L 35 68 L 20 82 Z" />
                </motion.g>
              </svg>
            </div>
          )}

          {/* Earth Day Globe Outline */}
          {(holidayId === 'earth_day' || holidayId === 'environment_day') && (
            <div style={{ position: 'absolute', inset: 0, zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
              <svg width="80" height="80" viewBox="0 0 100 100" fill="rgba(34,197,94,0.4)">
                <path d="M 20 30 Q 40 10 70 20 Q 90 40 80 70 Q 50 90 20 70 Q 10 40 20 30 Z" />
              </svg>
            </div>
          )}

          {/* Diwali Radiant Mandala Outline */}
          {holidayId === 'diwali' && (
            <div style={{ position: 'absolute', inset: 0, zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
              <motion.svg
                width="90" height="90" viewBox="0 0 100 100"
                fill="none" stroke="rgba(253, 224, 71, 0.8)" strokeWidth="1.5"
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                style={{ filter: 'drop-shadow(0 0 5px rgba(253, 224, 71, 0.5))' }}
              >
                {/* Outer Lotus Petals */}
                {[...Array(12)].map((_, i) => (
                  <path
                    key={`outer-${i}`}
                    d="M 50 10 Q 60 25 50 40 Q 40 25 50 10 Z"
                    transform={`rotate(${i * 30} 50 50)`}
                    fill="rgba(250, 204, 21, 0.2)"
                  />
                ))}
                {/* Inner Star/Petals */}
                {[...Array(8)].map((_, i) => (
                  <path
                    key={`inner-${i}`}
                    d="M 50 25 L 55 45 L 50 50 L 45 45 Z"
                    transform={`rotate(${i * 45} 50 50)`}
                    stroke="rgba(251, 146, 60, 0.9)"
                    fill="rgba(251, 146, 60, 0.3)"
                  />
                ))}
                {/* Center Ring */}
                <circle cx="50" cy="50" r="15" strokeDasharray="3 3" />
                <circle cx="50" cy="50" r="8" fill="rgba(253, 224, 71, 0.5)" />
              </motion.svg>
            </div>
          )}

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
      )}
    </div>
  );
}
