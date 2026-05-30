import type { AnimationStep, AlgorithmMeta, SearchResult } from "@opendsa/types";

/**
 * Binary Search algorithm metadata
 */
export const binarySearchMeta: AlgorithmMeta = {
  id: "binary-search",
  name: "Binary Search",
  category: "searching",
  description:
    "An efficient search algorithm that works on sorted arrays by repeatedly dividing the search interval in half.",
  complexity: {
    time: {
      best: "O(1)",
      average: "O(log n)",
      worst: "O(log n)",
    },
    space: "O(1)",
  },
  tags: ["search", "divide-and-conquer", "sorted", "efficient"],
  difficulty: "beginner",
};

/**
 * Binary Search - Pure algorithm implementation
 * @param arr - Sorted array to search
 * @param target - Value to find
 * @returns Index of target if found, -1 otherwise
 */
export function binarySearch(arr: number[], target: number): number {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return -1;
}

/**
 * Binary Search with step generation for visualization
 * @param arr - Sorted array to search
 * @param target - Value to find
 * @returns Search result with animation steps
 */
export function binarySearchWithSteps(
  arr: number[],
  target: number
): { result: SearchResult; steps: AnimationStep[] } {
  const steps: AnimationStep[] = [];
  let comparisons = 0;
  let left = 0;
  let right = arr.length - 1;

  // Initial step
  steps.push({
    id: `step-0`,
    type: "reset",
    indices: [],
    description: `Starting binary search for target value ${target} in sorted array`,
    codeLineNumbers: [1, 2],
    metadata: { target, arrayLength: arr.length, left, right },
  });

  // Highlight initial search range
  steps.push({
    id: `step-${steps.length}`,
    type: "highlight",
    indices: Array.from({ length: right - left + 1 }, (_, i) => left + i),
    description: `Initial search range: indices ${left} to ${right}`,
    codeLineNumbers: [1, 2],
    metadata: { left, right },
  });

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    comparisons++;

    // Show current boundaries and midpoint
    steps.push({
      id: `step-${steps.length}`,
      type: "highlight",
      indices: [left, mid, right].filter((v, i, a) => a.indexOf(v) === i), // unique values
      values: [arr[left], arr[mid], arr[right]],
      description: `Left: ${left}, Mid: ${mid}, Right: ${right}. Checking middle element ${arr[mid]}`,
      codeLineNumbers: [4, 5],
      metadata: { left, mid, right, midValue: arr[mid] },
    });

    // Highlight the middle element specifically
    steps.push({
      id: `step-${steps.length}`,
      type: "pivot",
      indices: [mid],
      values: [arr[mid]],
      description: `Middle element at index ${mid} is ${arr[mid]}`,
      codeLineNumbers: [5],
      metadata: { mid, midValue: arr[mid] },
    });

    // Compare step
    steps.push({
      id: `step-${steps.length}`,
      type: "compare",
      indices: [mid],
      values: [arr[mid]],
      description: `Comparing ${arr[mid]} with target ${target}`,
      codeLineNumbers: [7],
      metadata: { comparison: `${arr[mid]} vs ${target}`, midValue: arr[mid], target },
    });

    if (arr[mid] === target) {
      // Found!
      steps.push({
        id: `step-${steps.length}`,
        type: "found",
        indices: [mid],
        values: [arr[mid]],
        description: `Target ${target} found at index ${mid}! Total comparisons: ${comparisons}`,
        codeLineNumbers: [8],
        metadata: { foundIndex: mid, comparisons },
      });

      return {
        result: {
          index: mid,
          found: true,
          comparisons,
        },
        steps,
      };
    } else if (arr[mid] < target) {
      // Search right half
      steps.push({
        id: `step-${steps.length}`,
        type: "mark-checked",
        indices: Array.from({ length: mid - left + 1 }, (_, i) => left + i),
        description: `${arr[mid]} < ${target}, so target must be in right half. Eliminating indices ${left} to ${mid}`,
        codeLineNumbers: [9, 10],
        metadata: { eliminatedRange: [left, mid], newLeft: mid + 1 },
      });

      left = mid + 1;
    } else {
      // Search left half
      steps.push({
        id: `step-${steps.length}`,
        type: "mark-checked",
        indices: Array.from({ length: right - mid + 1 }, (_, i) => mid + i),
        description: `${arr[mid]} > ${target}, so target must be in left half. Eliminating indices ${mid} to ${right}`,
        codeLineNumbers: [11, 12],
        metadata: { eliminatedRange: [mid, right], newRight: mid - 1 },
      });

      right = mid - 1;
    }

    // Show remaining search range
    if (left <= right) {
      steps.push({
        id: `step-${steps.length}`,
        type: "highlight",
        indices: Array.from({ length: right - left + 1 }, (_, i) => left + i),
        description: `New search range: indices ${left} to ${right} (${right - left + 1} elements remaining)`,
        codeLineNumbers: [3],
        metadata: { left, right, remainingElements: right - left + 1 },
      });
    }
  }

  // Target not found
  steps.push({
    id: `step-${steps.length}`,
    type: "not-found",
    indices: [],
    description: `Target ${target} not found in the array. Total comparisons: ${comparisons}`,
    codeLineNumbers: [15],
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
 * Default code for Binary Search visualization
 */
export const binarySearchCode = `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) {
      return mid;  // Found!
    } else if (arr[mid] < target) {
      left = mid + 1;  // Search right half
    } else {
      right = mid - 1;  // Search left half
    }
  }
  return -1;  // Not found
}`;
