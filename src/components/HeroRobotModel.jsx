import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Float, Html } from '@react-three/drei';
import robotModelUrl from '../assets/cute-robot-companion.glb?url';

// Preload model
useGLTF.preload(robotModelUrl);

const ROBOT_PHRASES = [
  "Hi! I'm your DEKODE AI companion. Ask me anything!",
  "Let me help turn your bright ideas into reality!",
  "Looking for AI strategy, cloud, or web solutions?",
  "Click me anytime to see my dance moves!",
  "What digital product would you like to build today?",
];

function RobotModel({ timeOfDay }) {
  const { scene } = useGLTF(robotModelUrl);
  const robotRef = useRef();
  
  const [danceTimer, setDanceTimer] = useState(0);
  const [danceRoutine, setDanceRoutine] = useState(0); // 0: Flip, 1: Shuffle, 2: Hop
  const [speechText, setSpeechText] = useState(
    "Hi! I'm DEKODE Companion. Click me to talk or dance!"
  );
  const [showSpeech, setShowSpeech] = useState(true);

  // Auto-hide speech bubble after 5 seconds initially
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSpeech(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // Female voice synthesis selector
  const speakFemaleVoice = (text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();

    // Search for female voices in browser speech synthesis engine
    const femaleVoice = voices.find((v) =>
      /female|samantha|victoria|zira|karen|serena|fiona|google us english/i.test(v.name)
    ) || voices.find((v) => v.lang.startsWith('en'));

    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }

    utterance.pitch = 1.35; // Bright friendly companion tone
    utterance.rate = 1.05;
    window.speechSynthesis.speak(utterance);
  };

  // Frame animation: Mouse cursor tracking + 3 Dance Routines
  useFrame((state, delta) => {
    if (!robotRef.current) return;

    // Decay dance timer
    if (danceTimer > 0) {
      setDanceTimer((prev) => Math.max(0, prev - delta));
    }

    const baseY = 0;
    const time = state.clock.getElapsedTime();

    if (danceTimer > 0) {
      // Execute selected Dance Routine
      if (danceRoutine === 0) {
        // Routine 0: Backflip Spin Combo
        const progress = (2.2 - danceTimer) / 2.2;
        robotRef.current.rotation.x = Math.sin(progress * Math.PI * 2) * Math.PI;
        robotRef.current.position.y = baseY + Math.sin(progress * Math.PI) * 0.35;
        robotRef.current.rotation.y = time * 8;
      } else if (danceRoutine === 1) {
        // Routine 1: Side Shuffle & Wiggle
        robotRef.current.rotation.z = Math.sin(time * 18) * 0.35;
        robotRef.current.position.x = Math.sin(time * 12) * 0.15;
        robotRef.current.position.y = baseY + Math.abs(Math.sin(time * 14)) * 0.15;
        robotRef.current.rotation.y = (state.pointer.x * Math.PI) * 0.15;
      } else {
        // Routine 2: High Trampoline Hop & Nod
        robotRef.current.position.y = baseY + Math.abs(Math.sin(time * 16)) * 0.4;
        robotRef.current.rotation.x = Math.sin(time * 14) * 0.25;
        robotRef.current.rotation.y = (state.pointer.x * Math.PI) * 0.15 + Math.sin(time * 8) * 0.2;
      }
    } else {
      // Smooth reset to natural standing posture
      robotRef.current.position.x += (0 - robotRef.current.position.x) * 0.1;
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

    // Trigger 2.2 second dance & pick next routine
    setDanceTimer(2.2);
    setDanceRoutine((prev) => (prev + 1) % 3);

    // Pick random phrase & speak with female voice
    const randomPhrase = ROBOT_PHRASES[Math.floor(Math.random() * ROBOT_PHRASES.length)];
    setSpeechText(randomPhrase);
    setShowSpeech(true);

    speakFemaleVoice(randomPhrase);
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
    <group position={[1.85, -0.65, 0]}>
      {/* Compact HTML Speech Bubble anchored directly above robot head */}
      {showSpeech && (
        <Html position={[0, 0.65, 0]} center distanceFactor={8} zIndexRange={[100, 0]}>
          <div className="robot-speech-bubble" onClick={() => setShowSpeech(false)}>
            <div className="speech-bubble-text">{speechText}</div>
            <div className="speech-bubble-arrow" />
          </div>
        </Html>
      )}

      <primitive 
        ref={robotRef}
        object={scene} 
        scale={0.55} 
        position={[0, 0, 0]} 
        onClick={handleClick}
        onPointerOver={() => (document.body.style.cursor = 'pointer')}
        onPointerOut={() => (document.body.style.cursor = 'auto')}
      />
    </group>
  );
}

export default function HeroRobotModel({ timeOfDay = 'noon' }) {
  // Dynamic light colors based on 4-stage timeOfDay theme
  const getLighting = () => {
    switch (timeOfDay) {
      case 'morning':
        return {
          ambientColor: '#fed7aa',
          ambientIntensity: 1.6,
          dir1Color: '#fb923c',
          dir1Intensity: 3.5,
          dir2Color: '#f472b6',
          dir2Intensity: 2.2,
          rimColor: '#fde047',
        };
      case 'noon':
        return {
          ambientColor: '#fef08a',
          ambientIntensity: 1.8,
          dir1Color: '#f59e0b',
          dir1Intensity: 4.0,
          dir2Color: '#38bdf8',
          dir2Intensity: 2.5,
          rimColor: '#67e8f9',
        };
      case 'evening':
        return {
          ambientColor: '#4c1d95',
          ambientIntensity: 1.5,
          dir1Color: '#ef4444',
          dir1Intensity: 3.8,
          dir2Color: '#c084fc',
          dir2Intensity: 2.5,
          rimColor: '#fb7185',
        };
      case 'night':
      default:
        return {
          ambientColor: '#1e1b4b',
          ambientIntensity: 1.2,
          dir1Color: '#818cf8',
          dir1Intensity: 3.0,
          dir2Color: '#c084fc',
          dir2Intensity: 2.0,
          rimColor: '#22d3ee',
        };
    }
  };

  const lights = getLighting();

  return (
    <>
      <ambientLight color={lights.ambientColor} intensity={lights.ambientIntensity} />
      <directionalLight position={[5, 5, 5]} color={lights.dir1Color} intensity={lights.dir1Intensity} castShadow />
      <directionalLight position={[-5, 3, -2]} color={lights.dir2Color} intensity={lights.dir2Intensity} />
      <directionalLight position={[0, -3, 3]} color={lights.rimColor} intensity={1.5} />

      <Float speed={1.5} rotationIntensity={0.08} floatIntensity={0.2} floatingRange={[-0.05, 0.05]}>
        <RobotModel timeOfDay={timeOfDay} />
      </Float>
    </>
  );
}
