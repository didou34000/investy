"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import MarketCurve from "./MarketCurve";
import LightRig from "./LightRig";
import { useMotionSafeState } from "@/hooks/useReducedMotionSafe";

interface Hero3DProps {
  websocketUrl?: string;
}

function SceneContent({ websocketUrl }: Hero3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { reduced, visible } = useMotionSafeState();
  useFrame((state, delta) => {
    if (!groupRef.current) return;
    if (reduced || !visible) return;
    groupRef.current.rotation.y += delta * 0.12; // slow yaw
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.06; // gentle pitch oscillation
  });
  return (
    <group ref={groupRef}>
      <LightRig />
      <MarketCurve websocketUrl={websocketUrl} />
    </group>
  );
}

export default function Hero3D({ websocketUrl }: Hero3DProps) {
  const { reduced, visible } = useMotionSafeState();
  const frameloop = reduced || !visible ? "demand" : "always";
  return (
    <div style={{ width: "100%", height: "clamp(300px, 40vh, 640px)", pointerEvents: "none" }}>
      <Canvas dpr={[1, 2]} frameloop={frameloop} camera={{ fov: 45, position: [0, 0.3, 3.2] }}>
        <SceneContent websocketUrl={websocketUrl} />
      </Canvas>
    </div>
  );
}


