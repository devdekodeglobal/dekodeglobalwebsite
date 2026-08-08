import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const generateExplosion = (particles, width, height) => {
  let boxShadow = [];
  let boxShadow2 = [];
  for (let i = 0; i < particles; i++) {
    const x = Math.floor(Math.random() * width) - width / 2;
    const y = Math.floor(Math.random() * height) - height / 1.2;
    const color = `hsl(${Math.floor(Math.random() * 360)}, 100%, 60%)`;
    boxShadow.push(`${x}px ${y}px ${color}`);
    boxShadow2.push(`0 0 #fff`);
  }
  return {
    boxShadow: boxShadow.join(', '),
    boxShadow2: boxShadow2.join(', ')
  };
};

const explosion = generateExplosion(50, 500, 500);

const styles = `
  .holiday-effects-container {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
    z-index: 10;
  }

  /* NYE Glow Text */
  .nye-text {
    position: absolute;
    top: 25vh;
    left: 50%;
    transform: translateX(-50%);
    font-size: 8rem;
    font-family: 'Playfair Display', serif;
    font-weight: 900;
    color: transparent;
    -webkit-text-stroke: 2px rgba(255,215,0,0.8);
    filter: drop-shadow(0 0 30px rgba(255,215,0,0.6));
    animation: pulse-glow 4s infinite alternate;
  }
  
  @keyframes pulse-glow {
    0% { filter: drop-shadow(0 0 20px rgba(255,215,0,0.4)); transform: translateX(-50%) scale(1); }
    100% { filter: drop-shadow(0 0 50px rgba(255,215,0,1)); transform: translateX(-50%) scale(1.05); }
  }

  /* Cute Houses Silhouette */
  .cute-houses {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 120px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 100' preserveAspectRatio='none'%3E%3Cpath fill='%231e293b' d='M0,100 L0,50 L20,30 L40,50 L40,100 Z'/%3E%3Crect x='15' y='60' width='10' height='15' fill='%23fef08a' opacity='0.8'/%3E%3Cpath fill='%230f172a' d='M50,100 L50,40 L75,15 L100,40 L100,100 Z'/%3E%3Crect x='65' y='60' width='8' height='12' fill='%23fef08a' opacity='0.7'/%3E%3Crect x='80' y='60' width='8' height='12' fill='%23fef08a' opacity='0.9'/%3E%3Cpath fill='%23334155' d='M110,100 L110,60 L130,40 L150,60 L150,100 Z'/%3E%3Crect x='125' y='70' width='10' height='10' fill='%23fef08a' opacity='0.6'/%3E%3Cpath fill='%231e293b' d='M160,100 L160,45 L180,25 L200,45 L200,100 Z'/%3E%3Ccircle cx='180' cy='60' r='6' fill='%23fef08a' opacity='0.8'/%3E%3C/svg%3E");
    background-size: 250px 120px;
    background-repeat: repeat-x;
    background-position: bottom;
    z-index: 5;
  }

  /* Advanced CSS Fireworks */
  .pyro > .before, .pyro > .after {
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    box-shadow: ${explosion.boxShadow2};
    animation: 1s bang ease-out infinite backwards, 1s gravity ease-in infinite backwards, 5s position linear infinite backwards;
  }
  .pyro > .after {
    animation-delay: 1.25s, 1.25s, 1.25s;
    animation-duration: 1.25s, 1.25s, 6.25s;
  }
  @keyframes bang {
    to { box-shadow: ${explosion.boxShadow}; }
  }
  @keyframes gravity {
    to { transform: translateY(200px); opacity: 0; }
  }
  @keyframes position {
    0%, 19.9% { margin-top: 10%; margin-left: 40%; }
    20%, 39.9% { margin-top: 40%; margin-left: 30%; }
    40%, 59.9% { margin-top: 20%; margin-left: 70%; }
    60%, 79.9% { margin-top: 30%; margin-left: 20%; }
    80%, 99.9% { margin-top: 30%; margin-left: 80%; }
  }

  /* St. Patrick's Hills */
  .st-pat-hills {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 25vh;
    background-image: 
      radial-gradient(ellipse at 30% 120%, #4ade80 40%, transparent 41%),
      radial-gradient(ellipse at 80% 130%, #22c55e 45%, transparent 46%),
      radial-gradient(ellipse at 50% 110%, #16a34a 35%, transparent 36%);
    background-size: 100vw 25vh;
    background-repeat: no-repeat;
    opacity: 0.95;
    z-index: 1;
  }

  /* Floating Clovers */
  .clover {
    position: absolute;
    animation: gentle-bob 4s ease-in-out infinite alternate;
    z-index: 2;
  }

  /* St. Patrick's CSS Mascot */
  .css-mascot-container {
    position: absolute;
    bottom: 5vh;
    right: 5vw;
    transform: scale(0.6);
    transform-origin: bottom right;
    width: 250px;
    height: 350px;
    z-index: 5;
    animation: gentle-bob-mascot 3s ease-in-out infinite alternate;
  }
  @keyframes gentle-bob-mascot {
    0% { transform: scale(0.6) translateY(0); }
    100% { transform: scale(0.6) translateY(-15px); }
  }
  .css-mushroom {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 180px;
    height: 140px;
  }
  .mushroom-stem {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 80px;
    background-color: #f8fafc;
    border-radius: 15px;
    box-shadow: inset -8px 0 0 rgba(0,0,0,0.05);
  }
  .mushroom-cap {
    position: absolute;
    top: 0;
    left: 0;
    width: 180px;
    height: 90px;
    background-color: #ef4444;
    border-top-left-radius: 90px;
    border-top-right-radius: 90px;
    border-bottom-left-radius: 25px;
    border-bottom-right-radius: 25px;
    overflow: hidden;
    box-shadow: inset -10px -10px 0 rgba(0,0,0,0.2);
  }
  .mushroom-spot {
    position: absolute;
    background: #fff;
    border-radius: 50%;
    opacity: 0.9;
  }
  .css-leprechaun {
    position: absolute;
    bottom: 120px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 150px;
  }
  .lep-body {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 70px;
    background: #16a34a;
    border-radius: 30px 30px 15px 15px;
    box-shadow: inset -8px 0 0 rgba(0,0,0,0.2);
  }
  .lep-head {
    position: absolute;
    bottom: 60px;
    left: 50%;
    transform: translateX(-50%);
    width: 70px;
    height: 70px;
    background: #fed7aa;
    border-radius: 50%;
    box-shadow: inset -5px -5px 0 rgba(0,0,0,0.1);
  }
  .lep-beard {
    position: absolute;
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
    width: 84px;
    height: 45px;
    background: #ea580c;
    border-radius: 0 0 42px 42px;
  }
  .lep-eyes {
    position: absolute;
    top: 25px;
    left: 50%;
    transform: translateX(-50%);
    width: 34px;
    height: 8px;
    display: flex;
    justify-content: space-between;
  }
  .lep-eye {
    width: 8px;
    height: 8px;
    background: #1e293b;
    border-radius: 50%;
  }
  .lep-smile {
    position: absolute;
    top: 40px;
    left: 50%;
    transform: translateX(-50%);
    width: 12px;
    height: 6px;
    border-bottom: 2px solid #ea580c;
    border-radius: 0 0 10px 10px;
  }
  .lep-hat {
    position: absolute;
    bottom: 48px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 70px;
  }
  .lep-hat-brim {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 15px;
    background: #15803d;
    border-radius: 8px;
    box-shadow: inset -5px -5px 0 rgba(0,0,0,0.2);
  }
  .lep-hat-top {
    position: absolute;
    bottom: 15px;
    left: 50%;
    transform: translateX(-50%);
    width: 66px;
    height: 60px;
    background: #16a34a;
    border-radius: 6px 6px 0 0;
    box-shadow: inset -8px 0 0 rgba(0,0,0,0.2);
  }
  .lep-hat-band {
    position: absolute;
    bottom: 15px;
    left: 50%;
    transform: translateX(-50%);
    width: 66px;
    height: 15px;
    background: #1e293b;
  }
  .lep-hat-buckle {
    position: absolute;
    bottom: 13px;
    left: 50%;
    transform: translateX(-50%);
    width: 20px;
    height: 14px;
    border: 3px solid #facc15;
    border-radius: 2px;
  }
  /* Women's Day Scene */
  .vivid-aurora {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50vh;
    background: linear-gradient(to top, #1e1b4b, transparent);
    z-index: 1;
  }
  .vivid-aurora::after {
    content: '';
    position: absolute;
    bottom: -10vh;
    left: 0;
    width: 100%;
    height: 40vh;
    background: 
      radial-gradient(ellipse at 30% 80%, rgba(219, 39, 119, 0.4) 30%, transparent 50%),
      radial-gradient(ellipse at 70% 100%, rgba(14, 165, 233, 0.4) 40%, transparent 60%),
      radial-gradient(ellipse at 50% 80%, rgba(217, 119, 6, 0.3) 30%, transparent 50%);
    filter: blur(30px);
    opacity: 0.9;
    animation: aurora-shift 8s ease-in-out infinite alternate;
  }
  @keyframes aurora-shift {
    0% { transform: scale(1) translate(0, 0); }
    100% { transform: scale(1.05) translate(10px, -10px); }
  }

  /* Removed clean CSS block - using elegant SVG instead */
  .venus-container {
    position: absolute;
    bottom: 12vh;
    left: 50%;
    transform: translateX(-50%);
    z-index: 5;
    animation: gentle-bob 5s ease-in-out infinite alternate;
  }
  .floating-flower {
    position: absolute;
    animation: gentle-bob 4s ease-in-out infinite alternate;
    z-index: 2;
  }
  @keyframes spin-slow {
    100% { transform: rotate(360deg); }
  }

  /* Holi Scene - Transparent Background for Sun/Moon */
  .powder-cloud {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.8;
    animation: powder-drift 12s ease-in-out infinite alternate;
    z-index: 2;
  }
  .powder-pink {
    width: 65vw; height: 65vh;
    background: #ec4899;
    top: -15vh; left: -10vw;
    animation-delay: 0s;
  }
  .powder-yellow {
    width: 55vw; height: 55vh;
    background: #eab308;
    bottom: -10vh; right: -5vw;
    animation-delay: -3s;
  }
  .powder-cyan {
    width: 45vw; height: 45vh;
    background: #06b6d4;
    top: 20vh; right: 20vw;
    animation-delay: -7s;
  }
  .powder-orange {
    width: 50vw; height: 50vh;
    background: #f97316;
    bottom: 10vh; left: 10vw;
    animation-delay: -5s;
  }
  
  @keyframes powder-drift {
    0% { transform: scale(1) translate(0, 0) rotate(0deg); }
    100% { transform: scale(1.3) translate(30px, -40px) rotate(10deg); }
  }

  /* Mother's Day Scene */
  .mothers-day-glow {
    position: absolute;
    bottom: -10vh;
    left: 0;
    width: 100%;
    height: 60vh;
    background: radial-gradient(ellipse at 50% 100%, rgba(244, 114, 182, 0.3) 0%, transparent 70%);
    filter: blur(30px);
    z-index: 1;
    animation: soft-glow-pulse 6s ease-in-out infinite alternate;
  }
  
  @keyframes soft-glow-pulse {
    0% { opacity: 0.6; transform: scale(1); }
    100% { opacity: 1; transform: scale(1.1); }
  }

  .soft-sparkle {
    position: absolute;
    width: 4px; 
    height: 4px;
    background: #fbcfe8;
    border-radius: 50%;
    box-shadow: 0 0 12px 4px rgba(244, 114, 182, 0.6);
    animation: sparkle-pulse 4s ease-in-out infinite alternate;
    z-index: 2;
    will-change: opacity, transform;
  }
  
  @keyframes sparkle-pulse {
    0% { opacity: 0.2; transform: scale(0.7); }
    100% { opacity: 0.9; transform: scale(1.3); }
  }

  .mothers-day-ground {
    position: absolute;
    bottom: -15vh;
    left: -10vw;
    width: 120vw;
    height: 35vh;
    background: linear-gradient(to bottom, #752033 0%, #4a2228 40%, #2a1118 100%);
    border-radius: 50% 50% 0 0;
    z-index: 4;
  }

  .bg-cherry-tree {
    position: absolute;
    bottom: 5vh;
    width: clamp(180px, 25vw, 300px);
    height: clamp(180px, 25vw, 300px);
    opacity: 0.85;
    z-index: 2; /* Important: trees go behind the solid ground (z-index 4) */
    filter: drop-shadow(0 10px 10px rgba(0,0,0,0.2));
  }
  .tree-left { left: 2%; transform: scaleX(-1); }
  .tree-right { right: 2%; }
  .tree-left-back { left: 15%; bottom: 4vh; transform: scale(0.6) scaleX(-1); opacity: 0.5; z-index: 1; filter: blur(2px); }
  .tree-right-back { right: 18%; bottom: 3vh; transform: scale(0.7); opacity: 0.6; z-index: 1; filter: blur(1.5px); }

  /* Easter Scene */
  .easter-ground {
    position: absolute;
    bottom: -15vh;
    left: -10vw;
    width: 120vw;
    height: 35vh;
    background: 
      radial-gradient(circle at 20% 30%, rgba(244, 114, 182, 0.9) 0%, transparent 50%),
      radial-gradient(circle at 80% 40%, rgba(56, 189, 248, 0.9) 0%, transparent 50%),
      radial-gradient(circle at 50% 70%, rgba(167, 139, 250, 0.9) 0%, transparent 50%),
      radial-gradient(circle at 35% 80%, rgba(253, 224, 71, 0.9) 0%, transparent 50%),
      linear-gradient(to bottom, #4ade80 0%, #16a34a 100%);
    background-size: 200% 200%;
    border-radius: 50% 50% 0 0;
    z-index: 4;
    box-shadow: inset 0 20px 50px rgba(255, 255, 255, 0.6);
    animation: mesh-shift 10s ease-in-out infinite alternate, floor-hue-shift 15s linear infinite;
  }
  @keyframes mesh-shift {
    0% { background-position: 0% 0%; }
    100% { background-position: 100% 100%; }
  }
  @keyframes floor-hue-shift {
    0% { filter: hue-rotate(0deg); }
    100% { filter: hue-rotate(360deg); }
  }
  .easter-bunny {
    position: absolute;
    bottom: 6vh;
    right: 15vw;
    z-index: 5;
    animation: bunny-hop 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) infinite alternate;
    transform-origin: bottom center;
    transform: scale(0.75);
  }
  @keyframes bunny-hop {
    0% { transform: translateY(0) scale(0.75) scaleY(0.9) scaleX(1.1); }
    100% { transform: translateY(-30px) scale(0.75) scaleY(1.05) scaleX(0.95); }
  }
  .aurora-egg {
    animation: aurora-glow 4s ease-in-out infinite alternate;
  }
  @keyframes aurora-glow {
    0% { filter: drop-shadow(0 0 10px #f472b6) drop-shadow(0 0 20px #a855f7) hue-rotate(0deg); }
    100% { filter: drop-shadow(0 0 20px #38bdf8) drop-shadow(0 0 40px #2dd4bf) hue-rotate(90deg); }
  }
  .scattered-egg {
    position: absolute;
    z-index: 5;
    animation: gentle-bob 4s ease-in-out infinite alternate;
  }

  /* Thanksgiving Scene */
  .thanksgiving-ground {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 15vh;
    background: #0f0a0a;
    z-index: 4;
  }
  .autumn-ember {
    position: absolute;
    border-radius: 50%;
    z-index: 3;
    animation: ember-float linear infinite;
  }
  @keyframes ember-float {
    0% { transform: translateY(10vh) scale(0); opacity: 0; }
    20% { opacity: 1; transform: translateY(0vh) scale(1.5); }
    100% { transform: translateY(-80vh) scale(0.5); opacity: 0; }
  }
  .thanksgiving-sun {
    position: absolute;
    bottom: 5vh;
    left: 50%;
    transform: translateX(-50%);
    width: 60vw;
    height: 60vw;
    border-radius: 50%;
    background: radial-gradient(circle, #fcd34d 0%, #f59e0b 30%, #ea580c 60%, transparent 80%);
    filter: blur(40px);
    z-index: 1;
    animation: sun-pulse 6s ease-in-out infinite alternate;
  }
  @keyframes sun-pulse {
    0% { opacity: 0.8; }
    100% { opacity: 1; filter: blur(30px); }
  }
  .windmill-blade {
    transform-origin: 50px 50px;
    animation: windmill-spin 30s linear infinite;
  }
  @keyframes windmill-spin {
    100% { transform: rotate(360deg); }
  }
  .turkey-feather {
    transform-origin: 100px 150px;
    animation: feather-fan 4s ease-in-out infinite alternate;
  }
  @keyframes feather-fan {
    0% { transform: rotate(calc(var(--base-rot) * 0.7)); }
    100% { transform: rotate(calc(var(--base-rot) * 1.3)); }
  }

  /* Dussehra Scene */
  body:has(.dussehra-sky) .sun-core,
  body:has(.dussehra-sky) .moon-core {
     background: radial-gradient(circle at 35% 35%, #fef08a, #ef4444 60%, #991b1b 100%) !important;
     box-shadow: 0 0 35px rgba(239, 68, 68, 0.9), 0 0 80px rgba(153, 27, 27, 0.6) !important;
  }
  body:has(.dussehra-sky) .sun-glow-ring,
  body:has(.dussehra-sky) .moon-glow-ring {
     background: radial-gradient(circle, rgba(239, 68, 68, 0.5) 0%, transparent 70%) !important;
  }

  .dussehra-sky {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 50% 100%, #b91c1c 0%, #7f1d1d 25%, #450a0a 55%, transparent 100%);
    z-index: 1;
    opacity: 0.85;
  }
  
  .dussehra-ground {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 35vh;
    background: linear-gradient(to top, #170000 0%, #450a0a 45%, transparent 100%);
    z-index: 4;
    pointer-events: none;
  }

  .ember {
    position: absolute;
    width: 4px;
    height: 4px;
    background: #fef08a;
    border-radius: 50%;
    box-shadow: 0 0 12px 4px #ea580c;
    animation: ember-rise 5s ease-in infinite;
    z-index: 3;
    opacity: 0;
    will-change: transform, opacity;
  }
  
  @keyframes ember-rise {
    0% { transform: translateY(10vh) scale(0.5); opacity: 1; }
    50% { opacity: 1; }
    100% { transform: translateY(-40vh) scale(1.5); opacity: 0; }
  }

  .battle-char {
    position: absolute;
    z-index: 2;
    animation: battle-float 4s ease-in-out infinite alternate;
  }
  
  .ram-container {
    bottom: 15vh;
    left: 2vw;
    --flip: 1;
  }
  
  .ravana-container {
    bottom: 15vh;
    right: 2vw;
    --flip: -1;
    animation-duration: 5s;
    animation-direction: alternate-reverse;
  }
  
  @media (max-width: 768px) {
    .ram-container {
      bottom: 10vh;
      left: -2vw;
    }
    .ravana-container {
      bottom: 10vh;
      right: -5vw;
    }
  }
  
  @keyframes battle-float {
    0% { transform: translateY(0px) scaleX(var(--flip)); }
    100% { transform: translateY(-10px) scaleX(var(--flip)); }
  }

  .flying-arrow {
    position: absolute;
    width: clamp(40px, 10vw, 80px);
    height: 2px;
    background: linear-gradient(to right, transparent, #fcd34d, #ffffff);
    box-shadow: 0 0 10px #f59e0b;
    z-index: 3;
    border-radius: 2px;
    animation: arrow-shoot linear infinite;
  }
  
  @keyframes arrow-shoot {
    0% { transform: translateX(0); opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { transform: translateX(clamp(150px, 40vw, 500px)); opacity: 0; }
  }

  .mother-child-container {
    position: absolute;
    bottom: 8vh;
    right: 5vw;
    transform: scale(0.6);
    transform-origin: bottom right;
    z-index: 5;
    animation: gentle-bob-mother 6s ease-in-out infinite alternate;
  }
  
  @keyframes gentle-bob-mother {
    0% { transform: scale(0.6) translateY(0); }
    100% { transform: scale(0.6) translateY(-10px); }
  }
  
  /* Christmas Scene */
  .christmas-sky {
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, #0f172a 0%, #1e1b4b 60%, #312e81 100%);
    z-index: 1;
    opacity: 0.9;
  }

  .snow-flake {
    position: absolute;
    top: -10vh;
    background: #ffffff;
    border-radius: 50%;
    z-index: 3;
    animation: snow-fall linear infinite;
  }
  
  @keyframes snow-fall {
    0% { transform: translateY(0) translateX(0); opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { transform: translateY(110vh) translateX(30px); opacity: 0; }
  }

  .santa-sleigh {
    position: absolute;
    top: 20vh;
    left: -30vw;
    z-index: 5;
    animation: santa-fly 20s linear infinite;
  }
  
  @media (max-width: 768px) {
    .santa-sleigh {
      transform: scale(0.6);
      top: 15vh;
    }
  }

  @keyframes santa-fly {
    0% { transform: translateX(-20vw) translateY(0) rotate(5deg); }
    30% { transform: translateX(30vw) translateY(-5vh) rotate(-2deg); }
    70% { transform: translateX(70vw) translateY(5vh) rotate(2deg); }
    100% { transform: translateX(120vw) translateY(-10vh) rotate(-5deg); }
  }

  .falling-gift {
    position: absolute;
    width: 14px;
    height: 14px;
    border: 2px solid #fcd34d;
    z-index: 4;
    animation: gift-drop 4s ease-in infinite;
  }
  
  .falling-gift::after {
    content: '';
    position: absolute;
    top: -6px;
    left: 3px;
    width: 4px;
    height: 4px;
    border: 2px solid #fcd34d;
    border-radius: 50%;
  }

  @keyframes gift-drop {
    0% { transform: translateY(0) rotate(0deg) scale(1); opacity: 0; }
    5% { opacity: 1; }
    70% { opacity: 1; }
    100% { transform: translateY(60vh) rotate(180deg) scale(0.5); opacity: 0; }
  }
  
  @media (max-width: 768px) {
    .bg-cherry-tree {
      width: 140px;
      height: 140px;
      bottom: 15vh;
    }
    .tree-left { left: 2%; }
    .tree-right { right: 2%; }
  }

  /* Halloween Scene */
  .halloween-sky {
    position: absolute;
    inset: 0;
    /* Toxic spooky glow: Emerald Green to Deep Purple to Pitch Black */
    background: radial-gradient(circle at 50% 110%, #064e3b 0%, #1e1b4b 50%, #020617 100%);
    z-index: 1;
    opacity: 0.95;
  }

  .bat {
    position: absolute;
    z-index: 3;
    animation: bat-fly linear infinite;
  }

  .bat svg {
    animation: bat-flap 0.25s ease-in-out infinite alternate;
  }

  @keyframes bat-fly {
    0% { transform: translate(120vw, 20vh) scale(0.5); opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { transform: translate(-20vw, -10vh) scale(1.5); opacity: 0; }
  }

  @keyframes bat-flap {
    0% { transform: scaleY(1); }
    100% { transform: scaleY(-0.3); }
  }

  .ghost {
    position: absolute;
    z-index: 4;
    animation: ghost-float 25s linear infinite;
  }

  .ghost svg {
    animation: ghost-wobble 3s ease-in-out infinite alternate;
  }

  @keyframes ghost-float {
    0% { transform: translate(-20vw, 60vh) scale(0.8); opacity: 0; }
    10% { opacity: 0.8; }
    90% { opacity: 0.8; }
    100% { transform: translate(120vw, 30vh) scale(1.2); opacity: 0; }
  }

  @keyframes ghost-wobble {
    0% { transform: translateY(0) rotate(-5deg); }
    100% { transform: translateY(-25px) rotate(5deg); }
  }

  @keyframes float-up {
    0% { transform: translateY(0) scale(1); opacity: 0; }
    10% { opacity: 1; }
    80% { opacity: 0.8; }
    100% { transform: translateY(-120vh) scale(0.6); opacity: 0; }
  }

  @keyframes flame-flicker {
    0% { transform: scale(1) rotate(-2deg); opacity: 0.8; filter: drop-shadow(0 0 10px #facc15); }
    100% { transform: scale(1.1) rotate(2deg) translateY(-2px); opacity: 1; filter: drop-shadow(0 0 15px #fef08a); }
  }

  @keyframes spark-core {
    0% { transform: scale(1); }
    100% { transform: scale(1.5); }
  }

  @keyframes spark-shoot {
    0% { transform: rotate(var(--rot)) translateY(0) scaleY(1); opacity: 1; }
    100% { transform: rotate(var(--rot)) translateY(40px) scaleY(0.2); opacity: 0; }
  }
`;

export default function HolidayEffects({ holidayId = null, holidayName = "" }) {
  const renderScene = () => {
    if (holidayId === 'easter') {
      return (
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          {/* Sunny Glow */}
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 100%, rgba(253, 224, 71, 0.2) 0%, transparent 60%)', zIndex: 1 }} />
          
          {/* Solid Curved Grass Ground */}
          <div className="easter-ground" />
          
          {/* Easter Bunny & Basket */}
          <div className="easter-bunny">
            <svg width="200" height="250" viewBox="0 0 150 200" style={{ filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.2))' }}>
              {/* Bunny Ears */}
              <ellipse cx="60" cy="50" rx="15" ry="40" fill="#ffffff" transform="rotate(-15 60 50)" />
              <ellipse cx="60" cy="50" rx="7" ry="30" fill="#fbcfe8" transform="rotate(-15 60 50)" />
              <ellipse cx="90" cy="50" rx="15" ry="40" fill="#ffffff" transform="rotate(15 90 50)" />
              <ellipse cx="90" cy="50" rx="7" ry="30" fill="#fbcfe8" transform="rotate(15 90 50)" />
              
              {/* Bunny Body */}
              <ellipse cx="75" cy="150" rx="45" ry="50" fill="#ffffff" />
              <ellipse cx="75" cy="155" rx="30" ry="40" fill="#f1f5f9" />
              
              {/* Bunny Head */}
              <circle cx="75" cy="90" r="35" fill="#ffffff" />
              
              {/* Face */}
              <g>
                {/* Left Eye */}
                <circle cx="60" cy="85" r="6.5" fill="#0f172a" />
                <circle cx="58" cy="82" r="2.5" fill="#ffffff" />
                <circle cx="63" cy="87" r="1" fill="#ffffff" />
                {/* Right Eye */}
                <circle cx="90" cy="85" r="6.5" fill="#0f172a" />
                <circle cx="88" cy="82" r="2.5" fill="#ffffff" />
                <circle cx="93" cy="87" r="1" fill="#ffffff" />
                {/* Blush */}
                <ellipse cx="50" cy="92" rx="7" ry="4" fill="#fbcfe8" opacity="0.8" />
                <ellipse cx="100" cy="92" rx="7" ry="4" fill="#fbcfe8" opacity="0.8" />
              </g>
              <ellipse cx="75" cy="95" rx="5" ry="3" fill="#f472b6" />
              <path d="M 75 99 Q 65 105 75 110 Q 85 105 75 99 Z" fill="#ffffff" />
              
              {/* Easter Basket */}
              <path d="M 20 160 Q 20 180 40 190 L 110 190 Q 130 180 130 160 Z" fill="#b45309" />
              <path d="M 20 160 Q 75 120 130 160" fill="none" stroke="#b45309" strokeWidth="8" />
              
              {/* Easter Eggs (Designer) */}
              <g transform="rotate(-20 45 165)">
                <ellipse cx="45" cy="165" rx="12" ry="16" fill="#f472b6" />
                <path d="M 33 160 Q 45 165 57 160" fill="none" stroke="#ffffff" strokeWidth="2" />
                <circle cx="45" cy="172" r="2" fill="#ffffff" />
              </g>
              <g>
                <ellipse cx="70" cy="160" rx="12" ry="16" fill="#38bdf8" />
                <path d="M 58 160 Q 70 170 82 160" fill="none" stroke="#fde047" strokeWidth="3" />
                <path d="M 58 155 Q 70 165 82 155" fill="none" stroke="#ffffff" strokeWidth="1" strokeDasharray="2 2" />
              </g>
              <g transform="rotate(20 95 165)">
                <ellipse cx="95" cy="165" rx="12" ry="16" fill="#fde047" />
                <path d="M 83 165 L 107 165" fill="none" stroke="#a78bfa" strokeWidth="4" />
                <path d="M 83 160 L 107 160" fill="none" stroke="#ffffff" strokeWidth="1" />
                <path d="M 83 170 L 107 170" fill="none" stroke="#ffffff" strokeWidth="1" />
              </g>
              <g transform="rotate(-10 55 175)">
                <ellipse cx="55" cy="175" rx="10" ry="14" fill="#a78bfa" />
                <circle cx="55" cy="170" r="3" fill="#fde047" />
                <circle cx="50" cy="178" r="2" fill="#fde047" />
                <circle cx="60" cy="178" r="2" fill="#fde047" />
              </g>
              <g transform="rotate(10 85 175)">
                <ellipse cx="85" cy="175" rx="10" ry="14" fill="#4ade80" />
                <path d="M 75 175 Q 85 185 95 175" fill="none" stroke="#ffffff" strokeWidth="2" />
                <path d="M 75 170 L 95 170" fill="none" stroke="#f472b6" strokeWidth="1.5" strokeDasharray="2 2" />
              </g>
            </svg>
          </div>
        </div>
      );
    }

    if (holidayId === 'thanksgiving') {
      const Ember = ({ size, color, delay, duration, left }) => (
        <div className="autumn-ember" style={{ 
          width: size, height: size, background: color, left, 
          animationDelay: delay, animationDuration: duration, 
          boxShadow: `0 0 10px ${color}`
        }} />
      );

      return (
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          {/* Majestic Sunset Sun */}
          <div className="thanksgiving-sun" />
          
          {/* Solid Black Silhouette Ground */}
          <div className="thanksgiving-ground" />
          
          {/* Glowing Upward Embers */}
          <Ember size="4px" color="#fef08a" left="15vw" delay="0s" duration="5s" />
          <Ember size="6px" color="#f59e0b" left="30vw" delay="2s" duration="7s" />
          <Ember size="5px" color="#ea580c" left="45vw" delay="4s" duration="6s" />
          <Ember size="8px" color="#ef4444" left="60vw" delay="1s" duration="8s" />
          <Ember size="4px" color="#fef08a" left="75vw" delay="5s" duration="6s" />
          <Ember size="6px" color="#f59e0b" left="90vw" delay="3s" duration="9s" />
          <Ember size="7px" color="#ea580c" left="25vw" delay="6s" duration="10s" />
          <Ember size="5px" color="#ef4444" left="80vw" delay="7s" duration="7s" />
          
          {/* Silhouette Windmill */}
          <div style={{ position: 'absolute', bottom: '5vh', left: '15vw', zIndex: 5 }}>
            <svg width="150" height="200" viewBox="0 0 100 200">
              <path d="M 40 200 L 60 200 L 55 50 L 45 50 Z" fill="#0f0a0a" />
              <g className="windmill-blade">
                <rect x="48" y="5" width="4" height="90" fill="#0f0a0a" />
                <rect x="5" y="48" width="90" height="4" fill="#0f0a0a" />
                <path d="M 52 10 L 70 10 L 70 45 L 52 45 Z" fill="#0f0a0a" opacity="0.9" />
                <path d="M 10 52 L 10 70 L 45 70 L 45 52 Z" fill="#0f0a0a" opacity="0.9" />
                <path d="M 48 90 L 30 90 L 30 55 L 48 55 Z" fill="#0f0a0a" opacity="0.9" />
                <path d="M 90 48 L 90 30 L 55 30 L 55 48 Z" fill="#0f0a0a" opacity="0.9" />
              </g>
            </svg>
          </div>
          
          {/* Majestic Turkey Silhouette */}
          <div style={{ position: 'absolute', bottom: '5vh', right: '20vw', zIndex: 5 }}>
            <svg width="200" height="200" viewBox="0 0 200 200">
              {/* Feathers */}
              {[...Array(9)].map((_, i) => {
                const rot = -60 + (i * 15);
                return (
                  <ellipse 
                    key={i} 
                    cx="100" cy="150" rx="15" ry="70" 
                    fill="#0f0a0a" 
                    className="turkey-feather"
                    style={{ '--base-rot': `${rot}deg` }}
                  />
                );
              })}
              {/* Turkey Body & Head */}
              <ellipse cx="100" cy="150" rx="35" ry="30" fill="#0f0a0a" />
              <path d="M 90 130 C 70 100, 60 90, 70 70 C 80 50, 95 60, 95 80 C 95 100, 110 130, 100 150 Z" fill="#0f0a0a" />
              <circle cx="75" cy="65" r="3" fill="#ea580c" /> {/* Glowing Eye */}
              <path d="M 65 75 L 55 80 L 68 82 Z" fill="#0f0a0a" /> {/* Beak */}
            </svg>
          </div>
        </div>
      );
    }

    if (holidayId === 'halloween') {
      return (
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          {/* Spooky Dark Sky */}
          <div className="halloween-sky" />

          {/* Flying Bats */}
          {[...Array(5)].map((_, i) => (
            <div 
              key={i} 
              className="bat" 
              style={{ 
                animationDelay: `${i * 3}s`,
                animationDuration: `${12 + Math.random() * 8}s`,
                top: `${5 + Math.random() * 30}vh`
              }}
            >
              <svg width="40" height="20" viewBox="0 0 40 20" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>
                <path d="M 20 10 Q 15 -5 0 5 Q 10 15 20 12 Q 30 15 40 5 Q 25 -5 20 10 Z" fill="#020617" />
              </svg>
            </div>
          ))}

          {/* Floating Ghost */}
          <div className="ghost" style={{ animationDelay: '2s' }}>
            <svg width="60" height="80" viewBox="0 0 60 80" style={{ filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.4))' }}>
              <path d="M 10 40 Q 10 10 30 10 Q 50 10 50 40 L 50 70 Q 45 60 40 70 Q 35 80 30 70 Q 25 60 20 70 Q 15 80 10 70 Z" fill="rgba(255,255,255,0.7)" />
              <circle cx="22" cy="30" r="4.5" fill="#020617" />
              <circle cx="38" cy="30" r="4.5" fill="#020617" />
              <ellipse cx="30" cy="42" rx="4" ry="7" fill="#020617" />
            </svg>
          </div>

          {/* Spooky Graveyard at the bottom */}
          <svg width="100%" height="30vh" viewBox="0 0 2000 200" preserveAspectRatio="xMidYMax slice" style={{ position: 'absolute', bottom: 0, left: 0, zIndex: 4, filter: 'drop-shadow(0 -5px 15px rgba(0,0,0,0.5))' }}>
            <defs>
              <linearGradient id="graveGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#475569" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
            </defs>

            {/* Distant Hills */}
            <path d="M -200 160 Q 300 90 800 170 T 2200 130 L 2200 200 L -200 200 Z" fill="#1e1b4b" opacity="0.6" />
            <path d="M -200 180 Q 400 140 900 190 T 2200 160 L 2200 200 L -200 200 Z" fill="#0f172a" opacity="0.9" />

            {/* Creeping Ground Fog Background */}
            <path d="M -200 190 Q 200 160 500 185 T 1500 160 T 2200 190 L 2200 200 L -200 200 Z" fill="#64748b" opacity="0.2" filter="blur(8px)" />
            <path d="M -200 170 Q 350 140 800 180 T 1800 150 T 2200 180 L 2200 200 L -200 200 Z" fill="#94a3b8" opacity="0.1" filter="blur(15px)" />

            {/* Creepy Dead Trees Background */}
            <g transform="translate(250, 50) scale(1.2)" fill="none" stroke="#020617" strokeWidth="6" strokeLinecap="round">
              <path d="M 50 150 L 50 50 Q 30 20 10 30" />
              <path d="M 50 80 Q 70 50 90 40" />
              <path d="M 50 60 Q 30 50 20 10" />
              {/* Spider Web */}
              <g stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeLinecap="round">
                <path d="M 50 60 L 75 48" />
                <path d="M 50 70 L 85 43" />
                <path d="M 50 80 L 95 38" />
                <path d="M 50 65 Q 60 58 65 52" />
                <path d="M 50 75 Q 68 65 75 48" />
              </g>
            </g>
            <g transform="translate(1600, 60) scale(1.5)" fill="none" stroke="#020617" strokeWidth="5" strokeLinecap="round">
              <path d="M 50 150 L 50 50 Q 70 20 90 30" />
              <path d="M 50 80 Q 30 50 10 40" />
              {/* Spider Web */}
              <g stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeLinecap="round">
                <path d="M 50 60 L 30 45" />
                <path d="M 50 70 L 20 42" />
                <path d="M 50 80 L 10 40" />
                <path d="M 50 65 Q 40 55 35 50" />
                <path d="M 50 75 Q 30 60 25 45" />
              </g>
            </g>

            {/* Tombstones */}
            <g transform="translate(450, 140)">
              <rect x="0" y="0" width="40" height="60" fill="url(#graveGrad)" rx="20" />
              <rect x="-5" y="55" width="50" height="5" fill="#1e293b" rx="2" />
              <path d="M 10 25 L 30 25 M 20 15 L 20 40" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
            </g>
            
            <g transform="translate(950, 130) rotate(-5)">
              <rect x="0" y="0" width="50" height="70" fill="url(#graveGrad)" rx="25" />
              <rect x="-5" y="65" width="60" height="5" fill="#1e293b" rx="2" />
              <circle cx="25" cy="30" r="15" fill="none" stroke="#0f172a" strokeWidth="3" />
            </g>
            
            <g transform="translate(1350, 150) rotate(8)">
              <rect x="0" y="0" width="35" height="50" fill="url(#graveGrad)" rx="15" />
              <rect x="-5" y="45" width="45" height="5" fill="#1e293b" rx="2" />
              <path d="M 17 15 L 17 35" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
            </g>

            {/* Glowing Jack-o'-lanterns */}
            <g transform="translate(550, 160)">
              <ellipse cx="20" cy="15" rx="20" ry="15" fill="#ea580c" />
              <ellipse cx="20" cy="15" rx="12" ry="15" fill="#ea580c" stroke="#c2410c" strokeWidth="2" />
              <path d="M 20 0 Q 15 -10 25 -15" fill="none" stroke="#166534" strokeWidth="4" strokeLinecap="round" />
              {/* Face */}
              <polygon points="10,10 15,18 5,18" fill="#fef08a" filter="drop-shadow(0 0 5px #fef08a)" />
              <polygon points="30,10 35,18 25,18" fill="#fef08a" filter="drop-shadow(0 0 5px #fef08a)" />
              <path d="M 10 22 Q 20 28 30 22 L 25 25 L 20 22 L 15 25 Z" fill="#fef08a" filter="drop-shadow(0 0 5px #fef08a)" />
            </g>

            <g transform="translate(1100, 155) scale(1.2)">
              <ellipse cx="20" cy="15" rx="22" ry="16" fill="#ea580c" />
              <ellipse cx="20" cy="15" rx="14" ry="16" fill="#ea580c" stroke="#c2410c" strokeWidth="2" />
              <path d="M 20 0 Q 25 -10 15 -15" fill="none" stroke="#166534" strokeWidth="4" strokeLinecap="round" />
              {/* Scary Face */}
              <path d="M 8 8 L 15 15 L 8 15 Z" fill="#fef08a" filter="drop-shadow(0 0 6px #fef08a)" />
              <path d="M 32 8 L 25 15 L 32 15 Z" fill="#fef08a" filter="drop-shadow(0 0 6px #fef08a)" />
              <path d="M 8 22 Q 20 30 32 22 L 28 26 L 20 22 L 12 26 Z" fill="#fef08a" filter="drop-shadow(0 0 6px #fef08a)" />
            </g>

            <g transform="translate(800, 175) scale(0.8)">
              <ellipse cx="20" cy="15" rx="18" ry="14" fill="#ea580c" />
              <path d="M 20 0 Q 15 -5 20 -10" fill="none" stroke="#166534" strokeWidth="3" strokeLinecap="round" />
              {/* Surprised Face */}
              <circle cx="12" cy="12" r="3" fill="#fef08a" filter="drop-shadow(0 0 4px #fef08a)" />
              <circle cx="28" cy="12" r="3" fill="#fef08a" filter="drop-shadow(0 0 4px #fef08a)" />
              <ellipse cx="20" cy="22" rx="5" ry="7" fill="#fef08a" filter="drop-shadow(0 0 4px #fef08a)" />
            </g>

            {/* Foreground Creepy Trees */}
            <g transform="translate(100, 20) scale(1.6)" fill="none" stroke="#020617" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M 50 150 L 50 70 Q 30 40 10 30" />
              <path d="M 50 100 Q 80 60 100 40 Q 110 30 115 10" />
              <path d="M 75 80 Q 90 90 105 85" />
              <path d="M 35 60 Q 20 50 10 70" />
            </g>
            
            <g transform="translate(1750, 40) scale(1.4)" fill="none" stroke="#020617" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M 50 150 L 50 70 Q 70 40 90 30" />
              <path d="M 50 100 Q 20 60 0 40" />
              <path d="M 25 80 Q 10 90 -5 85" />
            </g>

            {/* Creeping Ground Fog Foreground */}
            <path d="M -200 195 Q 400 175 1000 195 T 2200 185 L 2200 200 L -200 200 Z" fill="#94a3b8" opacity="0.15" filter="blur(10px)" />

            {/* Pitch Black Ground Base (Rolling Hill to avoid flat line) */}
            <path d="M -200 200 Q 300 160 800 185 T 2200 170 L 2200 250 L -200 250 Z" fill="#020617" />
          </svg>
        </div>
      );
    }

    if (holidayId === 'christmas') {
      return (
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          {/* Deep Night Sky */}
          <div className="christmas-sky" />

          {/* Falling Snow */}
          {[...Array(50)].map((_, i) => (
            <div 
              key={i} 
              className="snow-flake" 
              style={{ 
                left: `${Math.random() * 100}vw`, 
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${5 + Math.random() * 8}s`,
                width: `${2 + Math.random() * 4}px`,
                height: `${2 + Math.random() * 4}px`,
                opacity: 0.3 + Math.random() * 0.7
              }} 
            />
          ))}

          {/* Snowy Village at the bottom */}
          <svg width="100%" height="30vh" viewBox="0 0 2000 200" preserveAspectRatio="xMidYMax slice" style={{ position: 'absolute', bottom: 0, left: 0, zIndex: 4, filter: 'drop-shadow(0 -5px 15px rgba(0,0,0,0.3))' }}>
            <defs>
              <linearGradient id="snowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#cbd5e1" />
              </linearGradient>
              <linearGradient id="houseGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#334155" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
            </defs>
            {/* Distant Hills */}
            <path d="M -200 150 Q 300 80 800 160 T 2200 120 L 2200 200 L -200 200 Z" fill="#e2e8f0" opacity="0.4" />
            <path d="M -200 170 Q 400 130 900 180 T 2200 150 L 2200 200 L -200 200 Z" fill="#e2e8f0" opacity="0.7" />
            
            {/* Background Trees */}
            <g transform="translate(250, 100) scale(1.2)">
              <polygon points="20,0 40,80 0,80" fill="#064e3b" stroke="#064e3b" strokeWidth="8" strokeLinejoin="round" />
            </g>
            <g transform="translate(750, 110) scale(0.9)">
              <polygon points="20,0 40,80 0,80" fill="#064e3b" stroke="#064e3b" strokeWidth="8" strokeLinejoin="round" />
            </g>
            <g transform="translate(1300, 90) scale(1.4)">
              <polygon points="20,0 40,80 0,80" fill="#064e3b" stroke="#064e3b" strokeWidth="8" strokeLinejoin="round" />
            </g>

            {/* Cuter House 1 (Left) */}
            <g transform="translate(450, 70)">
              <rect x="65" y="-5" width="14" height="40" fill="#475569" rx="3" />
              <rect x="62" y="-10" width="20" height="12" fill="url(#snowGrad)" rx="6" />
              <rect x="0" y="50" width="90" height="70" fill="url(#houseGrad)" rx="8" />
              <polygon points="0,50 45,10 90,50" fill="url(#snowGrad)" stroke="url(#snowGrad)" strokeWidth="18" strokeLinejoin="round" strokeLinecap="round" />
              <rect x="20" y="80" width="16" height="22" fill="#fef08a" rx="6" filter="drop-shadow(0 0 6px #fef08a)" />
              <rect x="54" y="80" width="16" height="22" fill="#fef08a" rx="6" filter="drop-shadow(0 0 6px #fef08a)" />
            </g>

            {/* Cuter House 2 (Center) */}
            <g transform="translate(950, 50)">
              <rect x="15" y="-15" width="16" height="50" fill="#475569" rx="3" />
              <rect x="12" y="-20" width="22" height="12" fill="url(#snowGrad)" rx="6" />
              <rect x="0" y="40" width="110" height="100" fill="url(#houseGrad)" rx="10" />
              <polygon points="0,40 55,-10 110,40" fill="url(#snowGrad)" stroke="url(#snowGrad)" strokeWidth="20" strokeLinejoin="round" strokeLinecap="round" />
              <rect x="25" y="85" width="18" height="26" fill="#fef08a" rx="8" filter="drop-shadow(0 0 8px #fef08a)" />
              <rect x="67" y="85" width="18" height="26" fill="#fef08a" rx="8" filter="drop-shadow(0 0 8px #fef08a)" />
              <circle cx="55" cy="20" r="12" fill="#fef08a" filter="drop-shadow(0 0 8px #fef08a)" />
            </g>

            {/* Cuter House 3 (Right) */}
            <g transform="translate(1450, 80)">
              <rect x="95" y="-10" width="16" height="40" fill="#475569" rx="3" />
              <rect x="92" y="-15" width="22" height="12" fill="url(#snowGrad)" rx="6" />
              <rect x="0" y="30" width="130" height="80" fill="url(#houseGrad)" rx="8" />
              <polygon points="0,30 65,-15 130,30" fill="url(#snowGrad)" stroke="url(#snowGrad)" strokeWidth="18" strokeLinejoin="round" strokeLinecap="round" />
              <rect x="35" y="65" width="22" height="26" fill="#fef08a" rx="6" filter="drop-shadow(0 0 6px #fef08a)" />
              <rect x="73" y="65" width="22" height="26" fill="#fef08a" rx="6" filter="drop-shadow(0 0 6px #fef08a)" />
            </g>
            
            {/* Foreground Evergreen Trees */}
            <g transform="translate(120, 130) scale(1.1)">
              <polygon points="20,0 40,70 0,70" fill="#022c22" stroke="#022c22" strokeWidth="8" strokeLinejoin="round" />
              <polygon points="20,0 35,70 5,70" fill="#f8fafc" opacity="0.6" transform="scale(0.8) translate(5, 5)" stroke="#f8fafc" strokeWidth="6" strokeLinejoin="round" />
            </g>
            <g transform="translate(600, 140) scale(0.9)">
              <polygon points="20,0 40,70 0,70" fill="#022c22" stroke="#022c22" strokeWidth="8" strokeLinejoin="round" />
            </g>
            <g transform="translate(1200, 120) scale(1.3)">
              <polygon points="20,0 40,70 0,70" fill="#022c22" stroke="#022c22" strokeWidth="8" strokeLinejoin="round" />
              <polygon points="20,0 40,70 0,70" fill="#f8fafc" opacity="0.4" transform="scale(0.8) translate(5, 5)" stroke="#f8fafc" strokeWidth="6" strokeLinejoin="round" />
            </g>
            <g transform="translate(1800, 110) scale(1.5)">
              <polygon points="20,0 40,70 0,70" fill="#022c22" stroke="#022c22" strokeWidth="8" strokeLinejoin="round" />
            </g>

            {/* Snow Ground Base */}
            <path d="M -200 185 Q 800 170 2200 185 L 2200 200 L -200 200 Z" fill="#ffffff" />
          </svg>

          {/* Flying Santa & Reindeers */}
          <div className="santa-sleigh">
            {/* Dropping Gifts */}
            <div className="falling-gift" style={{ left: '50px', top: '70px', background: '#ef4444', animationDelay: '2s' }} />
            <div className="falling-gift" style={{ left: '55px', top: '70px', background: '#3b82f6', animationDelay: '5s' }} />
            <div className="falling-gift" style={{ left: '45px', top: '70px', background: '#22c55e', animationDelay: '9s' }} />
            <div className="falling-gift" style={{ left: '60px', top: '70px', background: '#a855f7', animationDelay: '14s' }} />
            <div className="falling-gift" style={{ left: '50px', top: '70px', background: '#ec4899', animationDelay: '18s' }} />

            <svg width="400" height="150" viewBox="0 0 400 150" style={{ filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.5))' }}>
              {/* Reindeer 1 (Front - Rudolph) */}
              <g transform="translate(300, 60)">
                <path d="M 0 25 L 15 15 L 35 15 L 45 25 L 40 35 L 30 40 L 10 30 Z" fill="#78350f" />
                <path d="M 35 15 L 40 5 L 55 10 L 45 25 Z" fill="#78350f" />
                <circle cx="55" cy="10" r="3.5" fill="#ef4444" filter="drop-shadow(0 0 6px #ef4444)" />
                <path d="M 40 5 Q 35 -10 45 -15 Q 50 -5 45 0" fill="none" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 0 25 L -10 40 L 5 45 L 10 35 Z" fill="#451a03" />
                <path d="M 30 25 L 35 45 L 45 35 Z" fill="#451a03" /> 
              </g>

              {/* Reindeer 2 (Middle) */}
              <g transform="translate(200, 70)">
                <path d="M 0 25 L 15 15 L 35 15 L 45 25 L 40 35 L 30 40 L 10 30 Z" fill="#78350f" />
                <path d="M 35 15 L 40 5 L 55 10 L 45 25 Z" fill="#78350f" />
                <circle cx="55" cy="10" r="3" fill="#1e293b" />
                <path d="M 40 5 Q 35 -10 45 -15 Q 50 -5 45 0" fill="none" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 5 25 L -5 45 L 10 40 Z" fill="#451a03" />
                <path d="M 35 25 L 40 45 L 50 35 Z" fill="#451a03" /> 
              </g>

              {/* Magical Golden Reins */}
              <path d="M 90 70 Q 180 90 300 75" fill="none" stroke="#fcd34d" strokeWidth="2" strokeDasharray="5,5" />
              <path d="M 90 70 Q 150 100 200 85" fill="none" stroke="#fcd34d" strokeWidth="2" strokeDasharray="5,5" />

              {/* Sleigh */}
              <g transform="translate(10, 50)">
                {/* Sleigh Body */}
                <path d="M 0 30 Q 30 60 100 30 L 110 5 L 80 15 L 10 15 Z" fill="#b91c1c" />
                <path d="M 0 30 Q 30 60 100 30" fill="none" stroke="#fcd34d" strokeWidth="4" />
                {/* Runners */}
                <path d="M -10 45 Q 50 70 120 35" fill="none" stroke="#fcd34d" strokeWidth="4" strokeLinecap="round" />
                <path d="M 10 32 L 5 48" stroke="#fcd34d" strokeWidth="3" />
                <path d="M 85 30 L 95 40" stroke="#fcd34d" strokeWidth="3" />
                
                {/* Santa Claus */}
                <circle cx="85" cy="0" r="14" fill="#ef4444" /> {/* Body */}
                <circle cx="92" cy="-18" r="8" fill="#fca5a5" /> {/* Face */}
                <circle cx="95" cy="-12" r="10" fill="#ffffff" /> {/* Beard */}
                <path d="M 82 -20 L 96 -32 L 102 -20 Z" fill="#ef4444" /> {/* Hat */}
                <circle cx="96" cy="-32" r="4" fill="#ffffff" />
                
                {/* Massive Toy Sack */}
                <circle cx="45" cy="5" r="22" fill="#166534" />
                <circle cx="60" cy="0" r="18" fill="#15803d" />
                <path d="M 35 -10 L 45 10 L 60 -5 Z" fill="#14532d" />
              </g>
            </svg>
          </div>
        </div>
      );
    }

    if (holidayId === 'holi') {
      return (
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          {/* Drifting Color Powder Clouds overlaying the sky */}
          <div className="powder-cloud powder-pink" />
          <div className="powder-cloud powder-yellow" />
          <div className="powder-cloud powder-cyan" />
          <div className="powder-cloud powder-orange" />
        </div>
      );
    }

    if (holidayId === 'mothers_day') {
      const BgTree = ({ className }) => (
        <svg className={`bg-cherry-tree ${className}`} viewBox="-20 -20 240 240">
          <path d="M 100 200 C 100 150, 90 120, 100 80 M 100 120 C 130 100, 150 80, 140 50 M 95 100 C 70 80, 50 70, 60 40" stroke="#4a2228" strokeWidth="8" fill="none" strokeLinecap="round" />
          <circle cx="100" cy="70" r="40" fill="#fbcfe8" opacity="0.9" />
          <circle cx="130" cy="50" r="35" fill="#f472b6" opacity="0.8" />
          <circle cx="60" cy="50" r="35" fill="#f472b6" opacity="0.8" />
          <circle cx="90" cy="30" r="45" fill="#fbcfe8" opacity="1" />
          <circle cx="110" cy="20" r="30" fill="#f472b6" opacity="0.7" />
        </svg>
      );

      return (
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          {/* Soft Floral Glow */}
          <div className="mothers-day-glow" />

          {/* Background Cherry Blossom Trees */}
          <BgTree className="tree-left-back" />
          <BgTree className="tree-right-back" />
          <BgTree className="tree-left" />
          <BgTree className="tree-right" />

          {/* Ground */}
          <div className="mothers-day-ground" />

          {/* Elegant Mother & Child SVG Silhouette */}
          <div className="mother-child-container">
            <svg width="280" height="280" viewBox="0 0 200 200" style={{ filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.3))' }}>
              <defs>
                <linearGradient id="motherDress" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f43f5e" />
                  <stop offset="100%" stopColor="#9f1239" />
                </linearGradient>
                <linearGradient id="childDress" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fde047" />
                  <stop offset="100%" stopColor="#ca8a04" />
                </linearGradient>
              </defs>

              {/* Child Figure */}
              <path d="M 130 100 Q 150 120 170 200 L 80 200 Q 110 120 130 100 Z" fill="url(#childDress)" />
              <circle cx="132" cy="85" r="16" fill="#78350f" /> {/* Hair */}
              <circle cx="128" cy="90" r="14" fill="#fef08a" /> {/* Face */}

              {/* Mother Figure */}
              <path d="M 80 70 Q 110 90 120 200 L 20 200 Q 50 90 80 70 Z" fill="url(#motherDress)" />
              <circle cx="85" cy="50" r="20" fill="#0f172a" /> {/* Hair base */}
              <circle cx="78" cy="56" r="16" fill="#fef08a" /> {/* Face */}
              <circle cx="88" cy="38" r="12" fill="#0f172a" /> {/* Elegant Bun */}
              
              {/* Mother's arm embracing child (Sleeve + Hand) */}
              <path d="M 95 85 Q 125 95 140 125" fill="none" stroke="url(#motherDress)" strokeWidth="12" strokeLinecap="round" />
              <circle cx="140" cy="125" r="5" fill="#fef08a" /> {/* Mother's hand */}
            </svg>
          </div>



          {/* Gentle Magical Sparkles */}
          <div className="soft-sparkle" style={{ top: '30%', left: '20%', animationDelay: '0s' }} />
          <div className="soft-sparkle" style={{ top: '60%', right: '25%', animationDelay: '1.5s', width: '6px', height: '6px' }} />
          <div className="soft-sparkle" style={{ top: '40%', left: '40%', animationDelay: '3s' }} />
          <div className="soft-sparkle" style={{ top: '20%', right: '35%', animationDelay: '0.8s', width: '3px', height: '3px' }} />
          <div className="soft-sparkle" style={{ top: '75%', left: '15%', animationDelay: '2.2s' }} />
          <div className="soft-sparkle" style={{ top: '50%', right: '15%', animationDelay: '1.1s' }} />
          <div className="soft-sparkle" style={{ top: '85%', left: '35%', animationDelay: '2.5s', width: '5px', height: '5px' }} />
        </div>
      );
    }

    if (holidayId === 'dussehra') {
      const ravanaFaces = [
        <g key="f0"><path d="M 143 46 L 147 48 L 143 49 Z" fill="#fef08a" /><path d="M 157 46 L 153 48 L 157 49 Z" fill="#fef08a" /><path d="M 146 55 Q 150 53 154 55 L 150 58 Z" fill="#ffffff" /></g>, // Angry Snarl
        <g key="f1"><path d="M 143 47 Q 145 45 147 47 Q 145 48 143 47" fill="#fef08a" /><path d="M 153 47 Q 155 45 157 47 Q 155 48 153 47" fill="#fef08a" /><path d="M 144 55 Q 150 58 156 55" fill="none" stroke="#ffffff" strokeWidth="1.5" /></g>, // Evil Grin
        <g key="f2"><circle cx="145" cy="48" r="2" fill="#ef4444" /><circle cx="155" cy="48" r="2" fill="#ef4444" /><ellipse cx="150" cy="56" rx="3" ry="5" fill="#000000" /><path d="M 148 53 L 152 53 L 150 55 Z" fill="#ffffff" /></g>, // Screaming
        <g key="f3"><rect x="143" y="47" width="4" height="1.5" fill="#fef08a" /><rect x="153" y="47" width="4" height="1.5" fill="#fef08a" /><path d="M 145 56 Q 150 57 155 54" fill="none" stroke="#ffffff" strokeWidth="1" /></g>, // Sneaky
        <g key="f4"><path d="M 142 46 L 148 49 L 142 50 Z" fill="#fef08a" /><path d="M 158 46 L 152 49 L 158 50 Z" fill="#fef08a" /><path d="M 145 55 Q 150 58 155 55 Q 150 53 145 55" fill="#000000" /><path d="M 146 55 L 148 57 L 150 55 L 152 57 L 154 55" fill="none" stroke="#ffffff" strokeWidth="1.5" /></g>, // Intense Main
        <g key="f5"><circle cx="145" cy="48" r="1.5" fill="#fef08a" /><circle cx="155" cy="48" r="1.5" fill="#fef08a" /><line x1="146" y1="56" x2="154" y2="56" stroke="#000000" strokeWidth="2" /></g>, // Menacing
        <g key="f6"><circle cx="144" cy="47" r="2.5" fill="#fef08a" /><circle cx="156" cy="49" r="1.5" fill="#fef08a" /><path d="M 145 55 Q 148 53 150 56 Q 153 58 155 54" fill="none" stroke="#ffffff" strokeWidth="1" /></g>, // Deranged
        <g key="f7"><circle cx="145" cy="48" r="2.5" fill="#fef08a" /><circle cx="155" cy="48" r="2.5" fill="#fef08a" /><circle cx="150" cy="56" r="2.5" fill="#000000" /></g>, // Shocked
        <g key="f8"><path d="M 143 47 Q 145 49 148 47" fill="none" stroke="#ef4444" strokeWidth="2" /><path d="M 152 47 Q 155 49 157 47" fill="none" stroke="#ef4444" strokeWidth="2" /><path d="M 143 54 Q 150 59 157 54 L 150 55 Z" fill="#ffffff" /></g>, // Sadistic
        <g key="f9"><path d="M 142 49 L 147 47 L 145 50 Z" fill="#fef08a" /><path d="M 158 49 L 153 47 L 155 50 Z" fill="#fef08a" /><ellipse cx="150" cy="55" rx="4" ry="3" fill="#000000" /><line x1="147" y1="53" x2="153" y2="53" stroke="#ffffff" strokeWidth="1.5" /></g> // Roaring
      ];

      return (
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          {/* Fiery Hellish Sky and Ground */}
          <div className="dussehra-sky" />
          <div className="dussehra-ground" />

          {/* Floating Embers */}
          {[...Array(25)].map((_, i) => (
            <div 
              key={i} 
              className="ember" 
              style={{ 
                left: `${Math.random() * 100}vw`, 
                bottom: `${Math.random() * 30}vh`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }} 
            />
          ))}

          {/* Ram - Left Side (Realistic Blue Skin & Golden Dhoti) */}
          <div className="battle-char ram-container">
            {/* Flying Glowing Arrows positioned perfectly inside the container to align with the bow */}
            <div className="flying-arrow" style={{ top: '38%', left: '70%', animationDuration: '1.5s', animationDelay: '0s' }} />
            <div className="flying-arrow" style={{ top: '42%', left: '60%', animationDuration: '2s', animationDelay: '0.8s' }} />
            <div className="flying-arrow" style={{ top: '35%', left: '80%', animationDuration: '1.8s', animationDelay: '1.2s' }} />

            <svg width="clamp(100px, 25vw, 250px)" height="clamp(120px, 30vw, 300px)" viewBox="-20 -20 280 290" style={{ filter: 'drop-shadow(0 0 15px rgba(56, 189, 248, 0.6))' }}>
              <defs>
                <linearGradient id="ramSkin" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#60a5fa" />
                  <stop offset="100%" stopColor="#1e3a8a" />
                </linearGradient>
                <linearGradient id="ramDhoti" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#b45309" />
                </linearGradient>
              </defs>

              {/* Back Arm holding bow (Skin) */}
              <path d="M 125 70 Q 170 65 190 90" fill="none" stroke="url(#ramSkin)" strokeWidth="12" strokeLinecap="round" />
              
              {/* Strong Torso (Skin) */}
              <path d="M 85 70 Q 110 45 135 70 L 125 140 Q 110 150 95 140 Z" fill="url(#ramSkin)" />
              
              {/* Heroic Stance Legs / Dhoti (Clothes) */}
              <path d="M 90 130 Q 70 180 60 250 L 100 250 Q 110 190 115 150 Q 120 190 130 250 L 170 250 Q 150 180 130 130 Z" fill="url(#ramDhoti)" />
              
              {/* Head & Neck (Skin) */}
              <circle cx="110" cy="40" r="16" fill="url(#ramSkin)" />
              
              {/* Golden Crown */}
              <path d="M 100 25 L 105 0 L 115 0 L 120 25 Z" fill="#fcd34d" />
              
              {/* Front Arm pulling string (Skin) */}
              <path d="M 95 75 Q 120 100 140 90" fill="none" stroke="url(#ramSkin)" strokeWidth="14" strokeLinecap="round" />
              
              {/* Massive Golden Bow */}
              <path d="M 190 10 Q 240 90 190 170" fill="none" stroke="#fcd34d" strokeWidth="8" strokeLinecap="round" />
              <line x1="190" y1="10" x2="190" y2="170" stroke="rgba(252, 211, 77, 0.7)" strokeWidth="2" /> {/* Bow String */}
              
              {/* Glowing Divine Arrow */}
              <line x1="130" y1="90" x2="195" y2="90" stroke="#fef08a" strokeWidth="4" />
              <polygon points="195,85 210,90 195,95" fill="#fef08a" />
            </svg>
          </div>

          {/* Massive 10-Headed Ravana - Right Side */}
          <div className="battle-char ravana-container">
            <svg width="clamp(140px, 35vw, 400px)" height="clamp(140px, 35vw, 400px)" viewBox="-20 -20 340 340" style={{ filter: 'drop-shadow(0 0 20px rgba(153, 27, 27, 0.9))' }}>
              <defs>
                <linearGradient id="ravanaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#450a0a" />
                  <stop offset="100%" stopColor="#000000" />
                </linearGradient>
              </defs>
              <path d="M 150 100 Q 250 120 280 300 L 20 300 Q 50 120 150 100 Z" fill="url(#ravanaGrad)" />
              
              {/* 10 Heads */}
              {[...Array(10)].map((_, i) => (
                <g key={i} transform={`translate(${i * 22 - 100}, ${Math.abs(4.5 - i) * 12})`}>
                  <circle cx="150" cy="50" r="14" fill="#7f1d1d" />
                  <path d="M 140 38 L 150 15 L 160 38 Z" fill="#b91c1c" />
                  {ravanaFaces[i]}
                </g>
              ))}

              {/* Multiple Arms & Weapons */}
              <path d="M 100 120 Q 50 100 20 150" fill="none" stroke="url(#ravanaGrad)" strokeWidth="15" strokeLinecap="round" />
              <path d="M 100 140 Q 30 150 10 200" fill="none" stroke="url(#ravanaGrad)" strokeWidth="15" strokeLinecap="round" />
              <path d="M 200 120 Q 250 100 280 150" fill="none" stroke="url(#ravanaGrad)" strokeWidth="15" strokeLinecap="round" />
              <path d="M 200 140 Q 270 150 290 200" fill="none" stroke="url(#ravanaGrad)" strokeWidth="15" strokeLinecap="round" />
              
              <circle cx="20" cy="150" r="12" fill="#dc2626" />
              <line x1="20" y1="150" x2="10" y2="90" stroke="#dc2626" strokeWidth="8" />
              <path d="M 280 140 L 290 80 L 270 80 Z" fill="#dc2626" />
            </svg>
          </div>
        </div>
      );
    }

    if (holidayId === 'womens_day') {
      return (
        <div style={{ position: 'absolute', inset: 0 }}>
          {/* Vivid Aurora Background */}
          <div className="vivid-aurora" />

          {/* Elegant SVG Women Holding Hands */}
          <div style={{
            position: 'absolute',
            bottom: '1vh',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 5,
            animation: 'gentle-bob 5s ease-in-out infinite alternate'
          }}>
            <svg width="250" height="200" viewBox="0 0 140 200" style={{ filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.4))' }}>
              <defs>
                <linearGradient id="dress1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f43f5e" />
                  <stop offset="100%" stopColor="#9f1239" />
                </linearGradient>
                <linearGradient id="dress2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#1e3a8a" />
                </linearGradient>
                <linearGradient id="dress3" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#064e3b" />
                </linearGradient>
              </defs>

              {/* Necks (Fixing the decapitation issue!) */}
              <rect x="27" y="55" width="6" height="15" fill="#fcd34d"/>
              <rect x="67" y="40" width="6" height="15" fill="#c2410c"/>
              <rect x="107" y="50" width="6" height="15" fill="#fef08a"/>

              {/* Dresses with flowing curves */}
              <path d="M 60 50 Q 70 65 80 50 L 100 180 Q 70 195 40 180 Z" fill="url(#dress2)"/>
              <path d="M 22 65 Q 30 75 38 65 L 50 180 Q 30 190 10 180 Z" fill="url(#dress1)"/>
              <path d="M 102 60 Q 110 70 118 60 L 130 180 Q 110 190 90 180 Z" fill="url(#dress3)"/>

              {/* Arms linking and holding hands */}
              <path d="M 36 75 Q 50 85 66 75" stroke="#fcd34d" strokeWidth="4" fill="none" strokeLinecap="round"/>
              <path d="M 104 70 Q 90 85 74 75" stroke="#fef08a" strokeWidth="4" fill="none" strokeLinecap="round"/>
              
              {/* Outer resting arms */}
              <path d="M 22 75 Q 15 90 20 110" stroke="#fcd34d" strokeWidth="3" fill="none" strokeLinecap="round"/>
              <path d="M 118 70 Q 125 90 120 110" stroke="#fef08a" strokeWidth="3" fill="none" strokeLinecap="round"/>

              {/* Woman 2 Head & Afro Hair */}
              <circle cx="70" cy="22" r="14" fill="#0f172a"/> 
              <circle cx="60" cy="26" r="10" fill="#1e293b"/> 
              <circle cx="80" cy="26" r="10" fill="#1e293b"/> 
              <circle cx="70" cy="35" r="11" fill="#c2410c"/>
              
              {/* Woman 1 Head & Hair */}
              <circle cx="30" cy="50" r="10" fill="#fcd34d"/>
              <path d="M 22 40 Q 10 65 25 75 Q 25 55 38 42 Q 30 35 22 40" fill="#78350f" />

              {/* Woman 3 Head & Bob Hair */}
              <circle cx="110" cy="45" r="10" fill="#fef08a"/>
              {/* Fixed bob hair to fit perfectly */}
              <path d="M 100 42 Q 110 32 120 42 L 123 55 Q 110 50 103 55 Z" fill="#ea580c"/>
            </svg>
          </div>

          {/* Floating Stars/Sparkles to match the image */}
          <div className="floating-flower" style={{ top: '15vh', left: '20vw', animationDelay: '0s' }}>
             <div style={{ width: '10px', height: '10px', background: '#fef08a', borderRadius: '50%', filter: 'blur(2px)' }} />
          </div>
          <div className="floating-flower" style={{ top: '35vh', right: '25vw', animationDelay: '1.5s' }}>
             <div style={{ width: '15px', height: '15px', background: '#f472b6', borderRadius: '50%', filter: 'blur(3px)' }} />
          </div>
          <div className="floating-flower" style={{ top: '40vh', left: '30vw', animationDelay: '0.8s' }}>
             <div style={{ width: '8px', height: '8px', background: '#38bdf8', borderRadius: '50%', filter: 'blur(2px)' }} />
          </div>
        </div>
      );
    }

    // We are focusing ONLY on New Year's for now
    if (holidayId === 'st_patricks_day') {
      return (
        <div style={{ position: 'absolute', inset: 0 }}>
          {/* St. Patrick's Hills */}
          <div className="st-pat-hills" />

          {/* Giant Background SVG Clover */}
          <div className="css-mascot-container">
            <svg width="250" height="250" viewBox="0 0 100 100" style={{ position: 'absolute', top: '-120px', left: '0', opacity: '0.2', zIndex: -1 }}>
               <path d="M50 50 C 25 25, 0 50, 50 50 C 25 75, 50 100, 50 50 C 75 75, 100 50, 50 50 C 75 25, 50 0, 50 50 Z" fill="#22c55e" />
            </svg>

            {/* CSS Leprechaun Mascot */}
            <div className="css-leprechaun">
              <div className="lep-body" />
              <div className="lep-head">
                <div className="lep-beard" />
                <div className="lep-eyes">
                  <div className="lep-eye" />
                  <div className="lep-eye" />
                </div>
                <div className="lep-smile" />
                <div className="lep-hat">
                  <div className="lep-hat-top" />
                  <div className="lep-hat-band" />
                  <div className="lep-hat-brim" />
                  <div className="lep-hat-buckle" />
                </div>
              </div>
            </div>

            {/* CSS Mushroom */}
            <div className="css-mushroom">
              <div className="mushroom-stem" />
              <div className="mushroom-cap">
                <div className="mushroom-spot" style={{ width: '25px', height: '25px', top: '15px', left: '30px' }} />
                <div className="mushroom-spot" style={{ width: '15px', height: '15px', top: '45px', left: '15px' }} />
                <div className="mushroom-spot" style={{ width: '30px', height: '30px', top: '25px', left: '80px' }} />
                <div className="mushroom-spot" style={{ width: '20px', height: '20px', top: '55px', left: '60px' }} />
                <div className="mushroom-spot" style={{ width: '18px', height: '18px', top: '10px', left: '130px' }} />
                <div className="mushroom-spot" style={{ width: '22px', height: '22px', top: '40px', left: '120px' }} />
              </div>
            </div>
          </div>

          {/* Floating Clovers */}
          <div className="clover" style={{ top: '20vh', left: '10vw', animationDelay: '0s', transform: 'scale(0.8)' }}>
             <svg width="40" height="40" viewBox="0 0 40 40" fill="#22c55e" style={{ filter: 'drop-shadow(0 0 5px rgba(34, 197, 94, 0.6))' }}>
                <path d="M20 20 C 10 10, 0 20, 20 20 C 10 30, 20 40, 20 20 C 30 30, 40 20, 20 20 C 30 10, 20 0, 20 20 Z" />
                <path d="M20 20 L 15 35" stroke="#22c55e" strokeWidth="3" />
             </svg>
          </div>
          <div className="clover" style={{ top: '15vh', right: '20vw', animationDelay: '1.5s', transform: 'scale(1.2)' }}>
             <svg width="40" height="40" viewBox="0 0 40 40" fill="#4ade80" style={{ filter: 'drop-shadow(0 0 5px rgba(74, 222, 128, 0.6))' }}>
                <path d="M20 20 C 10 10, 0 20, 20 20 C 10 30, 20 40, 20 20 C 30 30, 40 20, 20 20 C 30 10, 20 0, 20 20 Z" />
                <path d="M20 20 L 15 35" stroke="#4ade80" strokeWidth="3" />
             </svg>
          </div>
        </div>
      );
    }

    if (holidayId === 'diwali') {
      return (
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          {/* Advanced Fireworks */}
          <div className="pyro">
            <div className="before" />
            <div className="after" />
          </div>

          {/* Beautiful Floor Mandala & Art Scene */}
          <div className="diwali-scene" style={{ position: 'absolute', inset: 0 }}>
            {/* Floor Mandala */}
            <div style={{ position: 'absolute', bottom: '-20vh', left: '50%', transform: 'translateX(-50%) rotateX(60deg)', width: '60vw', height: '60vw', borderRadius: '50%', border: '5px dashed rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '80%', height: '80%', borderRadius: '50%', border: '15px dotted rgba(253, 224, 71, 0.3)' }} />
              <div style={{ position: 'absolute', width: '50%', height: '50%', borderRadius: '50%', border: '5px solid rgba(251, 146, 60, 0.4)' }} />
              <div style={{ position: 'absolute', width: '20%', height: '20%', borderRadius: '50%', background: 'rgba(234, 88, 12, 0.5)' }} />
            </div>

            {/* Static Floor Diyas */}
            {[15, 30, 70, 85].map((pos, i) => (
              <div key={i} style={{ position: 'absolute', bottom: '2vh', left: `${pos}vw`, transform: 'scale(0.8)' }}>
                <svg width="40" height="30" viewBox="0 0 40 30" style={{ filter: 'drop-shadow(0 4px 10px rgba(234, 88, 12, 0.8))' }}>
                  <g style={{ animation: 'flame-flicker 0.4s infinite alternate', transformOrigin: 'center bottom' }}>
                    <path d="M 20 2 Q 26 12 20 18 Q 14 12 20 2 Z" fill="#fef08a" />
                    <path d="M 20 6 Q 23 12 20 16 Q 17 12 20 6 Z" fill="#fff" />
                  </g>
                  <path d="M 5 18 Q 20 35 35 18 L 25 18 Q 20 25 15 18 Z" fill="#9a3412" />
                  <path d="M 8 18 Q 20 25 32 18 Z" fill="#78350f" />
                </svg>
              </div>
            ))}

            {/* Character: Girl holding Sparkler */}
            <div className="diwali-girl-container" style={{ position: 'absolute', bottom: '5vh', left: '15vw', width: '150px', height: '200px' }}>
              <svg width="150" height="200" viewBox="0 0 150 200">
                <circle cx="75" cy="65" r="40" fill="#262626" />
                <path d="M 75 100 Q 20 180 30 190 L 120 190 Q 130 180 75 100 Z" fill="#be123c" />
                <path d="M 75 100 L 50 140 L 100 140 Z" fill="#e11d48" />
                <circle cx="75" cy="70" r="32" fill="#fed7aa" />
                <circle cx="62" cy="65" r="5" fill="#000" />
                <circle cx="88" cy="65" r="5" fill="#000" />
                <circle cx="60" cy="63" r="1.5" fill="#fff" />
                <circle cx="86" cy="63" r="1.5" fill="#fff" />
                <path d="M 67 78 Q 75 88 83 78" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="55" cy="75" r="5" fill="#fca5a5" opacity="0.6" />
                <circle cx="95" cy="75" r="5" fill="#fca5a5" opacity="0.6" />
                <path d="M 43 65 Q 75 35 107 65 Q 75 45 43 65 Z" fill="#262626" />
                <path d="M 90 115 L 120 140 L 110 160" stroke="#fed7aa" strokeWidth="10" strokeLinecap="round" fill="none" />
                <path d="M 60 115 L 30 90 L 20 60" stroke="#fed7aa" strokeWidth="10" strokeLinecap="round" fill="none" />
                <path d="M 20 60 L 5 15" stroke="#a1a1aa" strokeWidth="3" />
              </svg>
              {/* CSS Sparkler for Girl */}
              <div style={{ position: 'absolute', top: '10px', left: '0px' }}>
                <div style={{ position: 'absolute', width: '10px', height: '10px', background: '#fef08a', borderRadius: '50%', filter: 'drop-shadow(0 0 10px #facc15)', animation: 'spark-core 0.1s infinite alternate' }} />
                {[...Array(8)].map((_, i) => (
                  <div key={i} style={{ position: 'absolute', top: '5px', left: '4px', width: '2px', height: '12px', background: '#fff', borderRadius: '2px', transformOrigin: 'center top', animation: 'spark-shoot 0.4s linear infinite', animationDelay: `${Math.random() * 0.4}s`, '--rot': `${i * 45}deg` }} />
                ))}
              </div>
            </div>

            {/* Character: Ganesha holding Sparkler */}
            <div className="diwali-ganesha-container" style={{ position: 'absolute', bottom: '5vh', right: '15vw', width: '180px', height: '200px' }}>
              <svg width="180" height="200" viewBox="0 0 180 200">
                <path d="M 50 90 Q 10 70 30 130 Q 50 120 60 100 Z" fill="#fde68a" />
                <path d="M 130 90 Q 170 70 150 130 Q 130 120 120 100 Z" fill="#fde68a" />
                <circle cx="90" cy="140" r="45" fill="#fde68a" />
                <path d="M 50 150 Q 90 190 130 150 L 110 190 L 70 190 Z" fill="#fbbf24" />
                <path d="M 50 150 Q 90 180 130 150 Z" fill="#ea580c" />
                <path d="M 50 150 Q 90 165 130 150" fill="none" stroke="#dc2626" strokeWidth="5" />
                <circle cx="90" cy="85" r="40" fill="#fde68a" />
                <path d="M 90 100 C 110 140, 130 170, 90 170 C 80 170, 70 160, 75 150" fill="none" stroke="#fde68a" strokeWidth="18" strokeLinecap="round" />
                <path d="M 90 100 C 110 140, 130 170, 90 170 C 80 170, 70 160, 75 150" fill="none" stroke="#d97706" strokeWidth="2" strokeDasharray="5 5" opacity="0.3" />
                <path d="M 65 75 Q 72 70 78 78" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round" />
                <path d="M 115 75 Q 108 70 102 78" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round" />
                <path d="M 90 55 L 85 70 L 95 70 Z" fill="#dc2626" />
                <path d="M 60 50 L 70 10 L 90 25 L 110 10 L 120 50 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
                <circle cx="70" cy="25" r="3" fill="#ef4444" />
                <circle cx="110" cy="25" r="3" fill="#ef4444" />
                <circle cx="90" cy="35" r="4" fill="#3b82f6" />
                <path d="M 50 125 L 20 145 L 30 165" stroke="#fde68a" strokeWidth="12" strokeLinecap="round" fill="none" />
                <path d="M 130 125 L 150 100 L 160 70" stroke="#fde68a" strokeWidth="12" strokeLinecap="round" fill="none" />
                <path d="M 160 70 L 175 25" stroke="#a1a1aa" strokeWidth="3" />
              </svg>
              {/* CSS Sparkler for Ganesha */}
              <div style={{ position: 'absolute', top: '20px', left: '170px' }}>
                <div style={{ position: 'absolute', width: '10px', height: '10px', background: '#fef08a', borderRadius: '50%', filter: 'drop-shadow(0 0 10px #facc15)', animation: 'spark-core 0.1s infinite alternate' }} />
                {[...Array(8)].map((_, i) => (
                  <div key={i} style={{ position: 'absolute', top: '5px', left: '4px', width: '2px', height: '12px', background: '#fff', borderRadius: '2px', transformOrigin: 'center top', animation: 'spark-shoot 0.4s linear infinite', animationDelay: `${Math.random() * 0.4}s`, '--rot': `${i * 45}deg` }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (holidayId === 'new_years' || holidayId === 'new_years_eve') {
      return (
        <div style={{ position: 'absolute', inset: 0 }}>
          {/* Cute Houses Background */}
          <div className="cute-houses" />
          
          {/* Advanced Fireworks */}
          <div className="pyro">
            <div className="before" />
            <div className="after" />
          </div>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="holiday-effects-container" style={{ zIndex: holidayId === 'holi' ? -1 : 10 }}>
      <style>{styles}</style>

      <AnimatePresence mode="wait">
        <motion.div
          key={holidayId}
          initial={{ opacity: 0, filter: 'blur(10px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, filter: 'blur(10px)' }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          style={{ position: 'absolute', inset: 0 }}
        >
          {renderScene()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
