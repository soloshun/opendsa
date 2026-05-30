"use client";

import { motion } from "framer-motion";
import type { AnimationStep } from "@opendsa/types";

interface ArrayVisualizerProps {
  array: number[];
  currentStep: AnimationStep | null;
  highlightedIndices: number[];
  foundIndex: number | null;
  checkedIndices: number[];
}

export function ArrayVisualizer({
  array,
  currentStep,
  highlightedIndices,
  foundIndex,
  checkedIndices,
}: ArrayVisualizerProps) {
  const getBarColor = (index: number) => {
    if (foundIndex === index) {
      return "bg-green-500 shadow-green-500/50 shadow-lg";
    }
    if (highlightedIndices.includes(index)) {
      return "bg-primary shadow-primary/30 shadow-md";
    }
    if (checkedIndices.includes(index)) {
      return "bg-muted-foreground/30";
    }
    return "bg-muted-foreground/50";
  };

  const getBarScale = (index: number) => {
    if (foundIndex === index) return 1.1;
    if (highlightedIndices.includes(index)) return 1.05;
    return 1;
  };

  const maxValue = Math.max(...array, 1);

  return (
    <div className="flex items-end justify-center gap-2 h-64 p-4">
      {array.map((value, index) => (
        <motion.div
          key={index}
          className="relative flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: 1,
            y: 0,
            scale: getBarScale(index),
          }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          {/* Value label on top */}
          <motion.span
            className={`text-sm font-mono mb-1 ${
              foundIndex === index
                ? "text-green-500 font-bold"
                : highlightedIndices.includes(index)
                ? "text-primary font-semibold"
                : "text-muted-foreground"
            }`}
            animate={{
              scale: highlightedIndices.includes(index) || foundIndex === index ? 1.2 : 1,
            }}
          >
            {value}
          </motion.span>

          {/* Bar */}
          <motion.div
            className={`w-12 rounded-t-md transition-colors duration-300 ${getBarColor(index)}`}
            style={{
              height: `${(value / maxValue) * 180}px`,
              minHeight: "20px",
            }}
            animate={{
              scale: getBarScale(index),
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          />

          {/* Index label */}
          <span className="text-xs text-muted-foreground mt-1 font-mono">
            [{index}]
          </span>
        </motion.div>
      ))}
    </div>
  );
}
