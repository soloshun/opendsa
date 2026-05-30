import type { AnimationStep, AlgorithmMeta, SearchResult } from "@opendsa/types";

/**
 * Linear Search algorithm metadata
 */
export const linearSearchMeta: AlgorithmMeta = {
  id: "linear-search",
  name: "Linear Search",
  category: "searching",
  description:
    "A simple search algorithm that checks each element sequentially until the target is found or the end is reached.",
  complexity: {
    time: {
      best: "O(1)",
      average: "O(n)",
      worst: "O(n)",
    },
    space: "O(1)",
  },
  tags: ["search", "sequential", "basic", "beginner"],
  difficulty: "beginner",
};

/**
 * Linear Search - Pure algorithm implementation
 * @param arr - Array to search
 * @param target - Value to find
 * @returns Index of target if found, -1 otherwise
 */
export function linearSearch(arr: number[], target: number): number {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i;
    }
  }
  return -1;
}

/**
 * Linear Search with step generation for visualization
 * @param arr - Array to search
 * @param target - Value to find
 * @returns Search result with animation steps
 */
export function linearSearchWithSteps(
  arr: number[],
  target: number
): { result: SearchResult; steps: AnimationStep[] } {
  const steps: AnimationStep[] = [];
  let comparisons = 0;

  // Initial step - show the array and target
  steps.push({
    id: `step-0`,
    type: "reset",
    indices: [],
    description: `Starting linear search for target value ${target}`,
    codeLineNumbers: [1],
    metadata: { target, arrayLength: arr.length },
  });

  for (let i = 0; i < arr.length; i++) {
    comparisons++;

    // Highlight current element being checked
    steps.push({
      id: `step-${steps.length}`,
      type: "highlight",
      indices: [i],
      values: [arr[i]],
      description: `Checking index ${i}: comparing ${arr[i]} with target ${target}`,
      codeLineNumbers: [2, 3],
      metadata: { currentIndex: i, currentValue: arr[i], target },
    });

    // Compare step
    steps.push({
      id: `step-${steps.length}`,
      type: "compare",
      indices: [i],
      values: [arr[i]],
      description:
        arr[i] === target
          ? `Found! ${arr[i]} equals ${target}`
          : `${arr[i]} does not equal ${target}, moving to next`,
      codeLineNumbers: [3],
      metadata: { comparison: `${arr[i]} === ${target}`, result: arr[i] === target },
    });

    if (arr[i] === target) {
      // Found the target
      steps.push({
        id: `step-${steps.length}`,
        type: "found",
        indices: [i],
        values: [arr[i]],
        description: `Target ${target} found at index ${i}! Total comparisons: ${comparisons}`,
        codeLineNumbers: [4],
        metadata: { foundIndex: i, comparisons },
      });

      return {
        result: {
          index: i,
          found: true,
          comparisons,
        },
        steps,
      };
    }

    // Mark as checked (not found here)
    steps.push({
      id: `step-${steps.length}`,
      type: "mark-checked",
      indices: [i],
      values: [arr[i]],
      description: `Index ${i} checked, not a match`,
      codeLineNumbers: [2],
      metadata: { checkedIndex: i },
    });
  }

  // Target not found
  steps.push({
    id: `step-${steps.length}`,
    type: "not-found",
    indices: [],
    description: `Target ${target} not found in the array. Total comparisons: ${comparisons}`,
    codeLineNumbers: [7],
    metadata: { comparisons },
  });

  return {
    result: {
      index: -1,
      found: false,
      comparisons,
    },
    steps,
  };
}

/**
 * Default code for Linear Search visualization
 */
export const linearSearchCode = `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i;  // Found!
    }
  }
  return -1;  // Not found
}`;
