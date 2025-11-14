"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef } from "react";

function Rotator() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.2;
    ref.current.rotation.x += delta * 0.05;
  });
  return (
    <mesh ref={ref} castShadow receiveShadow>
      <icosahedronGeometry args={[1.2, 0]} />
      <meshStandardMaterial color="#60A5FA" metalness={0.2} roughness={0.3} />
    </mesh>
  );
}

export default function HeroScene() {
  return (
    <div className="w-full h-full">
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 4], fov: 50 }} shadows>
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 3, 3]} intensity={0.8} castShadow />
        <group position={[0, 0, 0]}>
          <Rotator />
        </group>
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
      </Canvas>
    </div>
  );
}












