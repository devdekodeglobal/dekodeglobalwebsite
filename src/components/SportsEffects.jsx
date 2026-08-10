import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SportsEffects({ activeSport = null }) {
  const generateBalls = (count) => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * 90 + 5,
      delay: Math.random() * 3,
      duration: Math.random() * 2 + 2,
      scale: Math.random() * 0.5 + 0.5,
      rotation: Math.random() * 360,
    }));
  };

  const cricketBalls = useMemo(() => generateBalls(8), []);

  return (
    <div className="sports-effects-container" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 15, overflow: 'hidden' }}>
      <AnimatePresence>
        {activeSport === 'cricket' && (
          <motion.div key="cricket" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }} style={{ position: 'absolute', inset: 0 }}>
            {cricketBalls.map(ball => (
              <motion.div key={ball.id} initial={{ y: '-20vh', x: `${ball.x}vw`, rotate: 0 }} animate={{ y: ['-20vh', '80vh', '40vh', '100vh'], rotate: [0, 360, 720, 1080] }} transition={{ duration: ball.duration * 1.5, delay: ball.delay, repeat: Infinity, ease: "easeInOut" }} style={{ position: 'absolute', width: '40px', height: '40px', transform: `scale(${ball.scale})` }}>
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="50" r="48" fill="#dc2626" stroke="#991b1b" strokeWidth="2"/>
                  <path d="M 50 2 C 70 20 70 80 50 98" fill="none" stroke="#fcd34d" strokeWidth="4" strokeDasharray="4,4"/>
                  <path d="M 50 2 C 30 20 30 80 50 98" fill="none" stroke="#fcd34d" strokeWidth="4" strokeDasharray="4,4"/>
                </svg>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
