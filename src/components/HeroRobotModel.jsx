import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Float } from '@react-three/drei';
import robotModelUrl from '../assets/cute-robot-companion.glb?url';

// Preload the model
useGLTF.preload(robotModelUrl);

function RobotModel({ isNight }) {
  const { scene } = useGLTF(robotModelUrl);
  const robotRef = useRef();

  // Smooth mouse-follow and gentle auto-rotation
  useFrame((state) => {
    if (!robotRef.current) return;

    // Gentle continuous spin
    const baseRotationY = state.clock.getElapsedTime() * 0.15;
    
    // Calculate targets based on mouse pointer (-1 to 1)
    const targetRotX = -(state.pointer.y * Math.PI) * 0.08;
    const targetRotY = baseRotationY + (state.pointer.x * Math.PI) * 0.12;
    
    // Smooth interpolation (lerp)
    robotRef.current.rotation.x += (targetRotX - robotRef.current.rotation.x) * 0.08;
    robotRef.current.rotation.y += (targetRotY - robotRef.current.rotation.y) * 0.08;
  });

  // Apply materials configuration or custom lighting properties to model if needed
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        // Make the materials slightly metallic/rough to catch dynamic lighting beautifully
        if (child.material) {
          child.material.roughness = 0.3;
          child.material.metalness = 0.1;
        }
      }
    });
  }, [scene]);

  return (
    <primitive 
      ref={robotRef}
      object={scene} 
      scale={2.2} 
      position={[0, -0.6, 0]} 
    />
  );
}

export default function HeroRobotModel({ isNight }) {
  // Dynamic light colors based on Day/Night theme
  // Day: Warm sunset/sunlight tones (gold, bright orange, warm white)
  // Night: Cyberpunk/Lunar tones (cool teal, soft violet/purple, moonlight)
  const ambientColor = isNight ? '#1e1b4b' : '#fef08a';
  const ambientIntensity = isNight ? 1.2 : 1.8;

  const dirLightColor1 = isNight ? '#818cf8' : '#fb923c'; // Indigo vs Orange
  const dirLightIntensity1 = isNight ? 3.0 : 4.0;

  const dirLightColor2 = isNight ? '#c084fc' : '#38bdf8'; // Purple vs Sky Blue
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

      {/* Subtle Blue/Cyan Rim Light to catch edges */}
      <directionalLight 
        position={[0, -3, 3]} 
        color={isNight ? '#22d3ee' : '#f472b6'} 
        intensity={1.5} 
      />

      <Float 
        speed={2.2} 
        rotationIntensity={0.15} 
        floatIntensity={0.4} 
        floatingRange={[-0.15, 0.15]}
      >
        <RobotModel isNight={isNight} />
      </Float>
    </>
  );
}
