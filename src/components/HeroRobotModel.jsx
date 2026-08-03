import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Float, Html } from '@react-three/drei';
import robotModelUrl from '../assets/cute-robot-companion.glb?url';

// Preload the model
useGLTF.preload(robotModelUrl);

const ROBOT_PHRASES = [
  "Hi! I'm your DEKODE AI companion. Ask me anything!",
  "Let me help you turn your bright ideas into reality!",
  "Looking for AI strategy, cloud, or web solutions?",
  "Click me anytime to see my dance moves!",
  "What digital product would you like to build today?",
];

function RobotModel({ isNight }) {
  const { scene } = useGLTF(robotModelUrl);
  const robotRef = useRef();
  
  const [danceTimer, setDanceTimer] = useState(0);
  const [speechText, setSpeechText] = useState(
    "Hi! I'm DEKODE Companion. Click me to talk or dance!"
  );
  const [showSpeech, setShowSpeech] = useState(true);

  // Auto-hide speech bubble initially after 6s
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSpeech(false);
    }, 6000);
    return () => clearTimeout(timer);
  }, []);

  // Frame animation: cursor-tracking (NO auto spin) + dance bounce on click
  useFrame((state, delta) => {
    if (!robotRef.current) return;

    // Decay dance timer
    if (danceTimer > 0) {
      setDanceTimer((prev) => Math.max(0, prev - delta));
    }

    // Base position
    const baseY = -0.9;
    
    if (danceTimer > 0) {
      // Dance hop & tilt wiggle!
      const time = state.clock.getElapsedTime();
      robotRef.current.position.y = baseY + Math.abs(Math.sin(time * 14)) * 0.25;
      robotRef.current.rotation.z = Math.sin(time * 12) * 0.18;
      robotRef.current.rotation.y = (state.pointer.x * Math.PI) * 0.15 + Math.sin(time * 10) * 0.3;
    } else {
      // Reset position & tilt smoothly
      robotRef.current.position.y += (baseY - robotRef.current.position.y) * 0.1;
      robotRef.current.rotation.z += (0 - robotRef.current.rotation.z) * 0.1;

      // Mouse tracking ONLY (no continuous auto rotation)
      const targetRotX = -(state.pointer.y * Math.PI) * 0.08;
      const targetRotY = (state.pointer.x * Math.PI) * 0.15; // Face forward, look at mouse

      robotRef.current.rotation.x += (targetRotX - robotRef.current.rotation.x) * 0.08;
      robotRef.current.rotation.y += (targetRotY - robotRef.current.rotation.y) * 0.08;
    }
  });

  const handleClick = (e) => {
    e.stopPropagation();
    
    // Trigger 2.2 second dance
    setDanceTimer(2.2);

    // Pick random phrase
    const randomPhrase = ROBOT_PHRASES[Math.floor(Math.random() * ROBOT_PHRASES.length)];
    setSpeechText(randomPhrase);
    setShowSpeech(true);

    // Voice Synthesis (Audio Speech)
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(randomPhrase);
      utterance.pitch = 1.25; // Cute robotic companion pitch
      utterance.rate = 1.05;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Configure model materials
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          child.material.roughness = 0.3;
          child.material.metalness = 0.1;
        }
      }
    });
  }, [scene]);

  return (
    <group position={[1.85, -0.9, 0]}>
      {/* HTML Speech Bubble floating above robot head */}
      {showSpeech && (
        <Html position={[0, 1.3, 0]} center distanceFactor={8} zIndexRange={[100, 0]}>
          <div className="robot-speech-bubble" onClick={() => setShowSpeech(false)}>
            <div className="speech-bubble-text">{speechText}</div>
            <div className="speech-bubble-arrow" />
          </div>
        </Html>
      )}

      <primitive 
        ref={robotRef}
        object={scene} 
        scale={0.95} 
        position={[0, 0, 0]} 
        onClick={handleClick}
        onPointerOver={() => (document.body.style.cursor = 'pointer')}
        onPointerOut={() => (document.body.style.cursor = 'auto')}
      />
    </group>
  );
}

export default function HeroRobotModel({ isNight }) {
  // Dynamic light colors based on Day/Night theme
  const ambientColor = isNight ? '#1e1b4b' : '#fef08a';
  const ambientIntensity = isNight ? 1.2 : 1.8;

  const dirLightColor1 = isNight ? '#818cf8' : '#fb923c';
  const dirLightIntensity1 = isNight ? 3.0 : 4.0;

  const dirLightColor2 = isNight ? '#c084fc' : '#38bdf8';
  const dirLightIntensity2 = isNight ? 2.0 : 2.5;

  return (
    <>
      {/* Ambient Lighting */}
      <ambientLight color={ambientColor} intensity={ambientIntensity} />

      {/* Primary Key Light */}
      <directionalLight 
        position={[5, 5, 5]} 
        color={dirLightColor1} 
        intensity={dirLightIntensity1} 
        castShadow
      />

      {/* Fill Light / Accent */}
      <directionalLight 
        position={[-5, 3, -2]} 
        color={dirLightColor2} 
        intensity={dirLightIntensity2} 
      />

      {/* Subtle Rim Light */}
      <directionalLight 
        position={[0, -3, 3]} 
        color={isNight ? '#22d3ee' : '#f472b6'} 
        intensity={1.5} 
      />

      <Float 
        speed={1.5} 
        rotationIntensity={0.08} 
        floatIntensity={0.25} 
        floatingRange={[-0.08, 0.08]}
      >
        <RobotModel isNight={isNight} />
      </Float>
    </>
  );
}
