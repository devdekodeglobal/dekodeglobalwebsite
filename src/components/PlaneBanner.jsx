import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./PlaneBanner.css";

const clients = [
  "Partnering with a National Eyewear Brand",
  "Transforming a Global Food Conglomerate",
  "Modernizing Enterprise Healthcare",
  "Scaling Leading Fintech Platforms"
];

// Realistic Red Piper Cub Plane matching user reference image
const PiperCubPlane = () => (
  <svg viewBox="0 0 160 80" width="140" height="70" className="piper-plane-svg">
    <defs>
      <radialGradient id="prop-blur" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
        <stop offset="60%" stopColor="rgba(255,255,255,0.4)" />
        <stop offset="100%" stopColor="rgba(255,255,255,0)" />
      </radialGradient>
    </defs>

    {/* Propeller Blur Disk & Spinning Blade */}
    <ellipse cx="14" cy="42" rx="5" ry="26" fill="url(#prop-blur)" className="spinning-prop-blur" />
    <line x1="14" y1="16" x2="14" y2="68" stroke="rgba(255,255,255,0.85)" strokeWidth="2.5" className="spinning-prop-blade" />

    {/* Propeller Nose Cone (Chrome/Metallic) */}
    <path d="M 14 38 Q 9 42 14 46 L 24 46 L 24 38 Z" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.5" />

    {/* Main Engine Cowling */}
    <path d="M 24 35 Q 24 31 34 31 L 44 31 L 44 51 L 34 51 Q 24 51 24 45 Z" fill="#043364" />
    
    {/* Fuselage Main Body */}
    <path d="M 44 31 L 88 34 L 138 38 L 138 44 L 88 49 L 44 51 Z" fill="#3576C1" />
    
    {/* Aerodynamic Side Stripe */}
    <path d="M 26 42 Q 65 41 138 41 L 138 43 Q 65 43 26 44 Z" fill="#FEB611" />

    {/* Cockpit Window & Pilot Silhouette */}
    <path d="M 46 31 L 64 23 L 80 23 L 77 35 L 46 35 Z" fill="#0f172a" opacity="0.9" />
    {/* Pilot Head & Shoulder Silhouette */}
    <circle cx="66" cy="29" r="4.5" fill="#64748b" />
    <path d="M 58 35 Q 66 31 74 35 Z" fill="#64748b" />

    {/* High Wing Assembly */}
    <path d="M 30 22 L 95 22 C 97 22 98 23 97 24 L 32 25 C 30 25 29 24 30 22 Z" fill="#FEB611" />
    {/* Wing Struts */}
    <line x1="47" y1="49" x2="54" y2="25" stroke="#043364" strokeWidth="2" />
    <line x1="47" y1="49" x2="75" y2="24" stroke="#043364" strokeWidth="2" />

    {/* Wingtip Light */}
    <circle cx="31" cy="22" r="1.5" fill="#ffffff" />

    {/* Vertical Tail Fin */}
    <path d="M 116 37 L 133 17 C 136 17 138 19 137 23 L 134 39 Z" fill="#043364" />
    {/* Horizontal Tail Stabilizer */}
    <path d="M 119 41 L 140 41 L 137 44 L 119 44 Z" fill="#FEB611" />

    {/* Main Tundra Landing Gear */}
    <line x1="44" y1="50" x2="40" y2="63" stroke="#334155" strokeWidth="2.5" />
    <line x1="52" y1="50" x2="40" y2="63" stroke="#334155" strokeWidth="2" />
    {/* Large Tundra Wheel */}
    <circle cx="40" cy="64" r="7.5" fill="#0f172a" />
    <circle cx="40" cy="64" r="3.5" fill="#FEB611" />

    {/* Tail Wheel */}
    <line x1="131" y1="43" x2="133" y2="51" stroke="#334155" strokeWidth="1.5" />
    <circle cx="133" cy="52" r="2.5" fill="#0f172a" />

    {/* Tow Harness / V-Bridle Lines extending to the rear */}
    <line x1="134" y1="39" x2="160" y2="24" stroke="#1e293b" strokeWidth="1.5" />
    <line x1="134" y1="44" x2="160" y2="56" stroke="#1e293b" strokeWidth="1.5" />
  </svg>
);

export default function PlaneBanner({ timeOfDay = "night", onBannerClick }) {
  const [flights, setFlights] = useState([{ id: Date.now(), clientIndex: 0 }]);

  useEffect(() => {
    let clientIndex = 0;
    const spawnInterval = setInterval(() => {
      clientIndex = (clientIndex + 1) % clients.length;
      setFlights((prev) => [...prev, { id: Date.now(), clientIndex }]);
    }, 15000); // spawn a new plane every 15s

    return () => clearInterval(spawnInterval);
  }, []);

  const handleAnimationComplete = (id) => {
    setFlights((prev) => prev.filter((flight) => flight.id !== id));
  };

  return (
    <div className={`plane-banner-container time-${timeOfDay}`} aria-hidden="true">
      <AnimatePresence>
        {flights.map((flight) => (
          <motion.div
            key={flight.id}
            className="plane-and-banner"
            initial={{ x: "120vw" }}
            animate={{ x: "-160vw" }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 26,
              ease: "linear"
            }}
            onAnimationComplete={() => handleAnimationComplete(flight.id)}
          >
            <div className="plane-assembly">
              {/* Red Piper Cub Plane */}
              <div className="plane-wrapper">
                <PiperCubPlane />
              </div>

              {/* Banner Tow Harness & Lead Bar */}
              <div className="banner-lead-bar">
                <div className="grommet grommet-top"></div>
                <div className="grommet grommet-bottom"></div>
              </div>

              {/* Realistic Wavy White Banner with Phase Lag */}
              <div 
                className="banner-cloth-wrapper"
                onClick={() => onBannerClick && onBannerClick(clients[flight.clientIndex])}
                style={{ cursor: "pointer" }}
              >
                <div className="banner-cloth">
                  <span className="banner-text">{clients[flight.clientIndex]}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
