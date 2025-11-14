"use client";

import React from "react";

export default function LightRig() {
  return (
    <>
      {/* Scene background for hero only (light) */}
      {/* @ts-expect-error three fiber color attach */}
      <color attach="background" args={["#F7FAFF"]} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[2.5, 3, 2.5]} intensity={0.4} color={"#ffffff"} />
      <directionalLight position={[-2, -1, 2]} intensity={0.25} color={"#e0f2ff"} />
    </>
  );
}












