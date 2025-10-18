"use client";

import React from "react";
import { motion } from "framer-motion";

export default function Section({ 
  children, 
  className, 
  delay = 0 
}: { 
  children: React.ReactNode; 
  className?: string; 
  delay?: number;
}) {
  return (
    <motion.section
      className={className}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.25, 0.8, 0.3, 1], delay }}
    >
      {children}
    </motion.section>
  );
}


