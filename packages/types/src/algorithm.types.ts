import type { AnimationStep } from "./animation.types";

/**
 * Categories of algorithms
 */
export type AlgorithmCategory =
  | "searching"
  | "sorting"
  | "graph"
  | "tree"
  | "dp"
  | "data-structure";

/**
 * Difficulty levels
 */
export type Difficulty = "beginner" | "intermediate" | "advanced";

/**
 * Time complexity representation
 */
export interface TimeComplexity {
  best: string;
  average: string;
  worst: string;
}

/**
 * Algorithm complexity information
 */
export interface Complexity {
  time: TimeComplexity;
  space: string;
}

/**
 * Metadata for an algorithm
 */
export interface AlgorithmMeta {
  /** Unique identifier (slug) */
  id: string;
  /** Display name */
  name: string;
  /** Category */
  category: AlgorithmCategory;
  /** Short description */
  description: string;
  /** Complexity information */
  complexity: Complexity;
  /** Tags for searching */
  tags: string[];
  /** Difficulty level */
  difficulty: Difficulty;
}

/**
 * Result of running an algorithm with step generation
 */
export interface AlgorithmResult<T = unknown> {
  /** The final result */
  result: T;
  /** Animation steps for visualization */
  steps: AnimationStep[];
}

/**
 * Options for search algorithms
 */
export interface SearchOptions {
  /** Target value to search for */
  target: number;
}

/**
 * Result of a search algorithm
 */
export interface SearchResult {
  /** Index where the target was found, or -1 if not found */
  index: number;
  /** Whether the target was found */
  found: boolean;
  /** Number of comparisons made */
  comparisons: number;
}
