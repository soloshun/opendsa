/**
 * Animation step types for visualizations
 */
export type StepType =
  | "compare"
  | "swap"
  | "highlight"
  | "found"
  | "not-found"
  | "visit"
  | "mark-sorted"
  | "mark-checked"
  | "pivot"
  | "partition"
  | "insert"
  | "delete"
  | "reset";

/**
 * Represents a single step in the animation
 */
export interface AnimationStep {
  /** Unique identifier for the step */
  id: string;
  /** Type of the animation step */
  type: StepType;
  /** Indices involved in this step */
  indices: number[];
  /** Optional values at the indices */
  values?: unknown[];
  /** Human-readable description of what's happening */
  description: string;
  /** Line numbers in the code that correspond to this step */
  codeLineNumbers?: number[];
  /** Additional metadata for the step */
  metadata?: Record<string, unknown>;
}

/**
 * Current state of the animation
 */
export interface AnimationState {
  /** All steps in the animation */
  steps: AnimationStep[];
  /** Current step index */
  currentStep: number;
  /** Whether the animation is currently playing */
  isPlaying: boolean;
  /** Animation speed (1-100) */
  speed: number;
  /** Direction of playback */
  direction: "forward" | "backward";
}

/**
 * Animation control functions
 */
export interface AnimationControls {
  /** Start playing the animation */
  play: () => void;
  /** Pause the animation */
  pause: () => void;
  /** Reset to the beginning */
  reset: () => void;
  /** Move forward one step */
  stepForward: () => void;
  /** Move backward one step */
  stepBackward: () => void;
  /** Jump to a specific step */
  goToStep: (step: number) => void;
  /** Set the animation speed */
  setSpeed: (speed: number) => void;
}
