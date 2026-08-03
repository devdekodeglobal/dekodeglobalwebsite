import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HeroScenery({ timeOfDay = 'noon' }) {
  const [sceneryMode, setSceneryMode] = useState('city'); // 'city' | 'nature'

  // Morph between City and Nature every 22 seconds automatically
  useEffect(() => {
    const timer = setInterval(() => {
      setSceneryMode((prev) => (prev === 'city' ? 'nature' : 'city'));
    }, 22000);
    return () => clearInterval(timer);
  }, []);

  const isNight = timeOfDay === 'night';
  const isEvening = timeOfDay === 'evening';
  const isNature = sceneryMode === 'nature';

  // Window Fill colors per stage
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
    ? 'drop-shadow(0px 0px 8px rgba(251, 191, 36, 0.75))' 
    : 'none';

  return (
    <div className="hero-scenery-wrapper" aria-hidden="true">
      {/* Sun & Moon ambient rays */}
      <div className="celestial-sun-container sun-fluid-sun">
        <div className="sun-core" />
        <div className="sun-glow-ring" />
      </div>

      {/* Fluttering Butterflies (Active in Nature mode) */}
      <AnimatePresence>
        {isNature && (
          <>
            <motion.svg
              key="butterfly-1"
              className="fluttering-butterfly butterfly-1"
              viewBox="0 0 40 40"
              initial={{ opacity: 0, x: -50, y: 150 }}
              animate={{
                opacity: [0, 1, 1, 0],
                x: [50, 250, 450, 650],
                y: [120, 60, 110, 50],
                rotate: [-12, 15, -8, 12],
              }}
              transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
            >
              {/* Left Wing */}
              <path d="M 20 20 Q 5 5 2 20 Q 5 35 20 20" fill="#f43f5e" opacity="0.9" />
              {/* Right Wing */}
              <path d="M 20 20 Q 35 5 38 20 Q 35 35 20 20" fill="#fb7185" opacity="0.9" />
              {/* Body */}
              <line x1="20" y1="10" x2="20" y2="30" stroke="#881337" strokeWidth="2.5" strokeLinecap="round" />
            </motion.svg>

            <motion.svg
              key="butterfly-2"
              className="fluttering-butterfly butterfly-2"
              viewBox="0 0 40 40"
              initial={{ opacity: 0, x: 200, y: 200 }}
              animate={{
                opacity: [0, 1, 1, 0],
                x: [300, 550, 750, 950],
                y: [160, 80, 140, 70],
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

      {/* Dynamic Scenery: City Skyline vs Nature Fields & Huts */}
      <AnimatePresence mode="wait">
        {!isNature ? (
          /* CITY SKYLINE SCENERY */
          <motion.div
            key="city-scenery"
            className="scenery-buildings-container"
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 80 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
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
                <rect x="80" y="70" width="90" height="250" rx="4" fill={isNight ? '#1e1b4b' : isEvening ? '#4c1d95' : '#94a3b8'} />
                <rect x="220" y="40" width="110" height="280" rx="4" fill={isNight ? '#312e81' : isEvening ? '#581c87' : '#cbd5e1'} />
                <rect x="540" y="90" width="85" height="230" rx="4" fill={isNight ? '#1e1b4b' : isEvening ? '#4c1d95' : '#94a3b8'} />
                <rect x="820" y="30" width="120" height="290" rx="4" fill={isNight ? '#312e81' : isEvening ? '#581c87' : '#cbd5e1'} />
                <rect x="1100" y="80" width="100" height="240" rx="4" fill={isNight ? '#1e1b4b' : isEvening ? '#4c1d95' : '#94a3b8'} />
              </g>

              {/* Midground Cartoon Buildings Layer */}
              {/* Building 1: Brick Apartment */}
              <g className="building-group">
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
              </g>

              {/* Building 2: Modern Skyscraper */}
              <g className="building-group">
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
              </g>

              {/* Building 3: Townhouse */}
              <g className="building-group">
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
              </g>

              {/* Trees */}
              <g className="tree-group">
                <rect x="510" y="240" width="12" height="80" fill="#78350f" rx="3" />
                <circle cx="516" cy="220" r="32" fill={isNight ? '#065f46' : isEvening ? '#064e3b' : '#22c55e'} />
                <circle cx="516" cy="205" r="24" fill={isNight ? '#047857' : isEvening ? '#065f46' : '#4ade80'} />
              </g>

              {/* Building 4: Corporate Tower */}
              <g className="building-group">
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
              </g>

              {/* Building 5: Yellow Urban Loft */}
              <g className="building-group">
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
              </g>

              {/* Building 6: Glass Pavilion */}
              <g className="building-group">
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
              </g>

              {/* Foreground Road */}
              <rect x="0" y="310" width="1400" height="10" fill={isNight ? '#0f172a' : isEvening ? '#1c1917' : '#334155'} />
            </svg>
          </motion.div>
        ) : (
          /* NATURE FIELDS, WOODEN HUTS & FLOWERS SCENERY */
          <motion.div
            key="nature-scenery"
            className="scenery-buildings-container"
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 80 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          >
            <svg
              className="scenery-svg"
              viewBox="0 0 1400 320"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMidYMax slice"
            >
              {/* Back Rolling Hills */}
              <path
                d="M 0 200 Q 300 120 650 180 Q 1000 240 1400 160 L 1400 320 L 0 320 Z"
                fill={isNight ? '#064e3b' : isEvening ? '#78350f' : '#15803d'}
                opacity="0.75"
              />

              {/* Front Rolling Hills */}
              <path
                d="M 0 230 Q 350 160 750 220 Q 1150 280 1400 210 L 1400 320 L 0 320 Z"
                fill={isNight ? '#022c22' : isEvening ? '#451a03' : '#16a34a'}
              />

              {/* Countryside Wooden Hut 1 (Left) */}
              <g className="hut-group-1">
                {/* Base */}
                <rect x="140" y="180" width="130" height="110" rx="6" fill={isNight ? '#3b0764' : '#78350f'} />
                {/* Thatched Roof */}
                <polygon points="125,180 205,110 285,180" fill={isNight ? '#1e1b4b' : '#b45309'} />
                {/* Hut Window */}
                <rect x="165" y="205" width="30" height="32" rx="4" fill={windowFill} style={{ filter: windowGlow }} />
                {/* Hut Door */}
                <rect x="215" y="225" width="32" height="65" rx="3" fill="#451a03" />
              </g>

              {/* Countryside Wooden Hut 2 (Right) */}
              <g className="hut-group-2">
                <rect x="840" y="190" width="140" height="100" rx="6" fill={isNight ? '#3b0764' : '#92400e'} />
                <polygon points="820,190 910,120 1000,190" fill={isNight ? '#1e1b4b' : '#d97706'} />
                <circle cx="910" cy="160" r="12" fill={windowFill} style={{ filter: windowGlow }} />
                <rect x="865" y="215" width="32" height="32" rx="4" fill={windowFill} style={{ filter: windowGlow }} />
                <rect x="920" y="225" width="35" height="65" rx="3" fill="#451a03" />
              </g>

              {/* Big Lush Nature Trees */}
              <g className="nature-trees">
                {/* Tree 1 */}
                <rect x="420" y="190" width="16" height="100" fill="#451a03" rx="4" />
                <circle cx="428" cy="170" r="45" fill={isNight ? '#064e3b' : '#22c55e'} />
                <circle cx="428" cy="145" r="35" fill={isNight ? '#065f46' : '#4ade80'} />

                {/* Tree 2 */}
                <rect x="680" y="180" width="18" height="110" fill="#451a03" rx="4" />
                <circle cx="689" cy="160" r="50" fill={isNight ? '#064e3b' : '#15803d'} />

                {/* Tree 3 */}
                <rect x="1120" y="200" width="14" height="90" fill="#451a03" rx="3" />
                <circle cx="1127" cy="180" r="40" fill={isNight ? '#065f46' : '#16a34a'} />
              </g>

              {/* Wildflowers */}
              <g className="wildflowers">
                <circle cx="340" cy="270" r="6" fill="#f43f5e" />
                <circle cx="370" cy="280" r="5" fill="#fbbf24" />
                <circle cx="610" cy="275" r="6" fill="#38bdf8" />
                <circle cx="760" cy="285" r="5" fill="#f472b6" />
                <circle cx="1040" cy="270" r="6" fill="#f59e0b" />
              </g>
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
