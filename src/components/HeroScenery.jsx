import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';

export default function HeroScenery({
  timeOfDay = 'noon',
  realTime = new Date()
}) {
  const isNight = timeOfDay === 'night';
  const isEvening = timeOfDay === 'evening';
  const isMorning = timeOfDay === 'morning';
  const isAfternoon = timeOfDay === 'noon';
  const isDawn = timeOfDay === 'dawn';
  const isGolden = timeOfDay === 'golden';
  const isLateNight = timeOfDay === 'latenight';

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



  // Extract the decimal time logic so it can be used on every frame
  const getCoordinatesForTime = (decimalTime, mobileState) => {
    let normalizedTime = decimalTime;
    while (normalizedTime < 0) normalizedTime += 24;
    while (normalizedTime >= 24) normalizedTime -= 24;

    const centerX = 50;
    const radiusX = mobileState ? 35 : 25;

    const edgeY = mobileState ? 25 : 35;
    const peakDayY = mobileState ? 8 : 10;
    const peakNightY = mobileState ? 10 : 18;

    // Sun Angle: starts at 0 (left edge) at 6 AM, goes to PI (right edge) at 18 (6 PM).
    const sunAngle = ((normalizedTime - 6) / 24) * 2 * Math.PI;
    const sunRadiusY = edgeY - peakDayY;
    const sunX = centerX - radiusX * Math.cos(sunAngle);
    const sunY = edgeY - sunRadiusY * Math.sin(sunAngle);

    // Moon Angle: starts at 0 (left edge) at 18 (6 PM).
    const moonAngle = ((normalizedTime - 18) / 24) * 2 * Math.PI;
    const moonRadiusY = edgeY - peakNightY;
    const moonX = centerX - radiusX * Math.cos(moonAngle);
    const moonY = edgeY - moonRadiusY * Math.sin(moonAngle);

    const isDaytime = normalizedTime >= 6 && normalizedTime < 18;
    const isNighttime = !isDaytime;
    
    const sunScale = isDaytime ? 1 + (0.15 * Math.sin(sunAngle)) : 1;
    const moonScale = isNighttime ? 1 + (0.15 * Math.sin(moonAngle)) : 1;

    let sunOpacity = 0;
    let moonOpacity = 1;

    if (normalizedTime >= 7 && normalizedTime <= 17) {
      sunOpacity = 1; 
      moonOpacity = 0;
    } else if (normalizedTime > 17 && normalizedTime < 19) {
      const p = (normalizedTime - 17) / 2; // 0 to 1
      sunOpacity = 1 - p; 
      moonOpacity = p;
    } else if (normalizedTime > 5 && normalizedTime < 7) {
      const p = (normalizedTime - 5) / 2; // 0 to 1
      sunOpacity = p; 
      moonOpacity = 1 - p;
    } else {
      sunOpacity = 0;
      moonOpacity = 1;
    }

    return { sunX, sunY, sunScale, sunOpacity, moonX, moonY, moonScale, moonOpacity };
  };

  // 1. Initialize a motion value with the exact decimal time when component mounts
  const [initialDecimal] = useState(() => {
    const hours = realTime.getHours();
    const minutes = realTime.getMinutes();
    return hours + minutes / 60;
  });
  const animatedTime = useMotionValue(initialDecimal);

  // 2. Whenever realTime updates, smoothly animate the motion value over 7 seconds
  useEffect(() => {
    const hours = realTime.getHours();
    const minutes = realTime.getMinutes();
    let targetDecimal = hours + minutes / 60;

    // Ensure we animate forward over the day transition correctly if it crosses midnight
    // e.g. 23:00 to 01:00 should animate forward, not backward.
    // For now, since it sweeps from -6 hours, it's a direct sweep.
    if (targetDecimal < animatedTime.get() && (animatedTime.get() - targetDecimal > 12)) {
      targetDecimal += 24;
    }

    const controls = animate(animatedTime, targetDecimal, {
      type: "tween",
      duration: 7,
      ease: "easeInOut"
    });

    return controls.stop;
  }, [realTime, animatedTime]);

  // 3. Derive our exact visual properties dynamically on every frame!
  const sunX = useTransform(animatedTime, t => `calc(${getCoordinatesForTime(t, isMobile).sunX}vw - 55px)`);
  const sunY = useTransform(animatedTime, t => `calc(${getCoordinatesForTime(t, isMobile).sunY}vh - 55px)`);
  const sunScale = useTransform(animatedTime, t => getCoordinatesForTime(t, isMobile).sunScale);
  const sunOpac = useTransform(animatedTime, t => getCoordinatesForTime(t, isMobile).sunOpacity);

  const moonX = useTransform(animatedTime, t => `calc(${getCoordinatesForTime(t, isMobile).moonX}vw - 55px)`);
  const moonY = useTransform(animatedTime, t => `calc(${getCoordinatesForTime(t, isMobile).moonY}vh - 55px)`);
  const moonScale = useTransform(animatedTime, t => getCoordinatesForTime(t, isMobile).moonScale);
  const moonOpac = useTransform(animatedTime, t => getCoordinatesForTime(t, isMobile).moonOpacity);

  return (
    <div className="hero-scenery-wrapper minimalist-sky" aria-hidden="true" style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      
      {/* Sky Gradients Layer */}
      <AnimatePresence mode="wait">
        {isDawn && (
          <motion.div
            key="grad-dawn"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 7, ease: 'easeInOut' }}
            style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(236, 72, 153, 0.4) 0%, rgba(192, 132, 252, 0.3) 50%, rgba(46, 16, 101, 0.2) 100%)', zIndex: 0, willChange: 'opacity' }}
          />
        )}
        {isMorning && (
          <motion.div
            key="grad-morning"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 7, ease: 'easeInOut' }}
            style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(167, 139, 250, 0.4) 0%, rgba(96, 165, 250, 0.3) 50%, rgba(67, 56, 202, 0.2) 100%)', zIndex: 0, willChange: 'opacity' }}
          />
        )}
        {isAfternoon && (
          <motion.div
            key="grad-afternoon"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 7, ease: 'easeInOut' }}
            style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(14, 165, 233, 0.4) 0%, rgba(56, 189, 248, 0.3) 50%, rgba(3, 105, 161, 0.2) 100%)', zIndex: 0, willChange: 'opacity' }}
          />
        )}
        {isGolden && (
          <motion.div
            key="grad-golden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 7, ease: 'easeInOut' }}
            style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(239, 68, 68, 0.4) 0%, rgba(234, 88, 12, 0.3) 50%, rgba(154, 52, 18, 0.2) 100%)', zIndex: 0, willChange: 'opacity' }}
          />
        )}
        {isEvening && (
          <motion.div
            key="grad-evening"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 7, ease: 'easeInOut' }}
            style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(225, 29, 72, 0.4) 0%, rgba(147, 51, 234, 0.3) 50%, rgba(30, 27, 75, 0.2) 100%)', zIndex: 0, willChange: 'opacity' }}
          />
        )}
        {isNight && (
          <motion.div
            key="grad-night"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 7, ease: 'easeInOut' }}
            style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(3, 7, 18, 0.95) 0%, rgba(15, 23, 42, 0.9) 60%, rgba(30, 27, 75, 0.8) 100%)', zIndex: 0, willChange: 'opacity' }}
          />
        )}
        {isLateNight && (
          <motion.div
            key="grad-latenight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 7, ease: 'easeInOut' }}
            style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(2, 6, 23, 0.95) 0%, rgba(15, 23, 42, 0.9) 60%, rgba(30, 41, 59, 0.8) 100%)', zIndex: 0, willChange: 'opacity' }}
          />
        )}
      </AnimatePresence>

      {/* Elegant Slow-Moving Cosmic Nebula for Night (Replaces Shooting Stars) */}
      <AnimatePresence>
        {(isNight || isLateNight) && (
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
        {(isNight || isMorning || isEvening || isLateNight || isDawn) && (
          <motion.div
            className="stars-container"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: isNight || isLateNight ? 1 : 0.3,
              y: [0, -20, 0] // Subtle drift
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              opacity: { duration: 3.5, ease: 'easeInOut' },
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
        {(!isNight && !isLateNight) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.8 }}
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
                  backgroundColor: isEvening ? '#fda4af' : isGolden ? '#fcd34d' : isMorning ? '#fef08a' : isDawn ? '#f9a8d4' : '#e0f2fe',
                  boxShadow: `0 0 ${sp.size * 3}px ${isEvening ? 'rgba(244,63,94,0.6)' : isGolden ? 'rgba(251,191,36,0.6)' : isMorning ? 'rgba(253,224,71,0.6)' : isDawn ? 'rgba(244,114,182,0.6)' : 'rgba(56,189,248,0.6)'}`,
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

      {/* Sun Visuals */}
      <motion.div
        className="celestial-body-container"
        style={{
          position: 'absolute',
          x: sunX,
          y: sunY,
          scale: sunScale,
          opacity: sunOpac,
          zIndex: 2,
          willChange: 'transform, opacity'
        }}
      >
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="sun-core" />
          <div className="sun-glow-ring" />
        </div>
      </motion.div>

      {/* Moon Visuals */}
      <motion.div
        className="celestial-body-container"
        style={{
          position: 'absolute',
          x: moonX,
          y: moonY,
          scale: moonScale,
          opacity: moonOpac,
          zIndex: 2,
          willChange: 'transform, opacity'
        }}
      >
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="moon-core">
            <div className="moon-crater crater-1" />
            <div className="moon-crater crater-2" />
          </div>
          <div className="moon-glow-ring" />
        </div>
      </motion.div>
    </div>
  );
}
