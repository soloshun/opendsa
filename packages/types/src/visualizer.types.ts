import type { ComponentType } from "react";
import type { AnimationStep } from "./animation.types";
import type { AlgorithmMeta, AlgorithmCategory } from "./algorithm.types";

/**
 * Props passed to visualizer components
 */
export interface VisualizerProps<T = unknown> {
  /** The data being visualized */
  data: T;
  /** Current step index */
  currentStep: number;
  /** All animation steps */
  steps: AnimationStep[];
  /** Whether animation is playing */
  isPlaying: boolean;
  /** Current animation speed */
  speed: number;
  /** Highlighted indices */
  highlightedIndices?: number[];
  /** Found index (for search algorithms) */
  foundIndex?: number;
}

/**
 * Props for control components
 */
export interface ControlsProps {
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onSpeedChange: (speed: number) => void;
  onDataChange: (data: unknown) => void;
  isPlaying: boolean;
  currentStep: number;
  totalSteps: number;
  speed: number;
}

/**
 * A complete visualizer plugin definition
 */
export interface VisualizerPlugin<TInput = unknown, TOptions = unknown> {
  /** Algorithm metadata */
  meta: AlgorithmMeta;
  /** The visualization component */
  component: ComponentType<VisualizerProps<TInput>>;
  /** Optional custom controls component */
  controls?: ComponentType<ControlsProps>;
  /** Generate animation steps from input */
  generateSteps: (input: TInput, options?: TOptions) => AnimationStep[];
  /** Default input data */
  defaultInput: TInput;
  /** Default code to display */
  defaultCode: string;
  /** Validate input data */
  validateInput?: (input: unknown) => input is TInput;
}

/**
 * Registry of visualizer plugins
 */
export interface VisualizerRegistry {
  /** Register a new plugin */
  register: (plugin: VisualizerPlugin) => void;
  /** Get a plugin by ID */
  get: (id: string) => VisualizerPlugin | undefined;
  /** Get all plugins in a category */
  getByCategory: (category: AlgorithmCategory) => VisualizerPlugin[];
  /** Get all registered plugins */
  getAll: () => VisualizerPlugin[];
  /** Get all available categories */
  getCategories: () => AlgorithmCategory[];
}
