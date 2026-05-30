"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ArrayVisualizer } from "@/components/visualizer/array-visualizer";
import { ControlPanel } from "@/components/visualizer/control-panel";
import { StepInfo } from "@/components/visualizer/step-info";
import { CodeDisplay } from "@/components/visualizer/code-display";
import { InputPanel } from "@/components/visualizer/input-panel";
import type { AnimationStep } from "@opendsa/types";
import { Badge } from "@/components/ui/badge";
import { Clock, Cpu, HardDrive, AlertTriangle } from "lucide-react";

// Inline the algorithm logic to avoid module import issues during build
function binarySearchWithSteps(
  arr: number[],
  target: number
): { result: { index: number; found: boolean; comparisons: number }; steps: AnimationStep[] } {
  const steps: AnimationStep[] = [];
  let comparisons = 0;
  let left = 0;
  let right = arr.length - 1;

  steps.push({
    id: `step-0`,
    type: "reset",
    indices: [],
    description: `Starting binary search for target value ${target} in sorted array`,
    codeLineNumbers: [1, 2],
    metadata: { target, arrayLength: arr.length, left, right },
  });

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

    steps.push({
      id: `step-${steps.length}`,
      type: "highlight",
      indices: [left, mid, right].filter((v, i, a) => a.indexOf(v) === i),
      values: [arr[left], arr[mid], arr[right]],
      description: `Left: ${left}, Mid: ${mid}, Right: ${right}. Checking middle element ${arr[mid]}`,
      codeLineNumbers: [4, 5],
      metadata: { left, mid, right, midValue: arr[mid] },
    });

    steps.push({
      id: `step-${steps.length}`,
      type: "pivot",
      indices: [mid],
      values: [arr[mid]],
      description: `Middle element at index ${mid} is ${arr[mid]}`,
      codeLineNumbers: [5],
      metadata: { mid, midValue: arr[mid] },
    });

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
        result: { index: mid, found: true, comparisons },
        steps,
      };
    } else if (arr[mid] < target) {
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

  steps.push({
    id: `step-${steps.length}`,
    type: "not-found",
    indices: [],
    description: `Target ${target} not found in the array. Total comparisons: ${comparisons}`,
    codeLineNumbers: [15],
    metadata: { comparisons },
  });

  return {
    result: { index: -1, found: false, comparisons },
    steps,
  };
}

// Sorted array for binary search
const DEFAULT_ARRAY = [11, 12, 22, 25, 34, 45, 64, 90];
const DEFAULT_TARGET = 25;

const binarySearchCode = `function binarySearch(arr, target) {
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

// Derive visualization state from steps and current step index
function deriveVisualizationState(steps: AnimationStep[], currentStep: number) {
  let highlightedIndices: number[] = [];
  let foundIndex: number | null = null;
  const checkedIndices: number[] = [];

  // Replay steps up to currentStep to get the correct visual state
  for (let i = 0; i <= currentStep && i < steps.length; i++) {
    const step = steps[i];
    
    switch (step.type) {
      case "reset":
        highlightedIndices = [];
        foundIndex = null;
        break;
      case "highlight":
      case "compare":
      case "pivot":
        highlightedIndices = step.indices;
        break;
      case "found":
        foundIndex = step.indices[0];
        highlightedIndices = [];
        break;
      case "mark-checked":
        step.indices.forEach((idx) => {
          if (!checkedIndices.includes(idx)) {
            checkedIndices.push(idx);
          }
        });
        highlightedIndices = [];
        break;
      case "not-found":
        highlightedIndices = [];
        break;
    }
  }

  return { highlightedIndices, foundIndex, checkedIndices };
}

export default function BinarySearchPage() {
  const [array, setArray] = useState(DEFAULT_ARRAY);
  const [target, setTarget] = useState(DEFAULT_TARGET);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(50);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Generate steps using useMemo (derived state)
  const steps = useMemo(() => {
    const { steps: newSteps } = binarySearchWithSteps(array, target);
    return newSteps;
  }, [array, target]);

  // Reset currentStep when array or target changes
  const prevArrayRef = useRef(array);
  const prevTargetRef = useRef(target);
  if (prevArrayRef.current !== array || prevTargetRef.current !== target) {
    prevArrayRef.current = array;
    prevTargetRef.current = target;
    if (currentStep !== 0) {
      setCurrentStep(0);
      setIsPlaying(false);
    }
  }

  // Derive visualization state from steps and currentStep
  const { highlightedIndices, foundIndex, checkedIndices } = useMemo(
    () => deriveVisualizationState(steps, currentStep),
    [steps, currentStep]
  );

  // Animation loop using useEffect with cleanup
  useEffect(() => {
    if (!isPlaying) return;

    if (currentStep >= steps.length - 1) {
      setIsPlaying(false);
      return;
    }

    const delay = Math.max(100, 1000 - speed * 9);
    timerRef.current = setTimeout(() => {
      setCurrentStep((prev) => prev + 1);
    }, delay);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isPlaying, currentStep, steps.length, speed]);

  const handlePlay = useCallback(() => {
    if (currentStep >= steps.length - 1) {
      setCurrentStep(0);
    }
    setIsPlaying(true);
  }, [currentStep, steps.length]);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const handleReset = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(0);
  }, []);

  const handleStepForward = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  }, [currentStep, steps.length]);

  const handleStepBackward = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const handleRandomize = useCallback(() => {
    // Generate random sorted array for binary search
    const newArray = Array.from(
      { length: 8 },
      () => Math.floor(Math.random() * 90) + 10
    ).sort((a, b) => a - b);
    const randomTarget = newArray[Math.floor(Math.random() * newArray.length)];
    setArray(newArray);
    setTarget(randomTarget);
  }, []);

  const handleArrayChange = useCallback((newArray: number[]) => {
    // Sort the array for binary search
    const sortedArray = [...newArray].sort((a, b) => a - b);
    setArray(sortedArray);
  }, []);

  const handleInputReset = useCallback(() => {
    setArray(DEFAULT_ARRAY);
    setTarget(DEFAULT_TARGET);
  }, []);

  const currentStepData = steps[currentStep] || null;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Searching</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Binary Search</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-6 p-6">
          {/* Header */}
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Binary Search
              </h1>
              <p className="text-muted-foreground mt-1">
                An efficient divide-and-conquer search algorithm for sorted arrays
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="gap-1.5">
                <Clock className="size-3" />
                <span>O(log n)</span>
              </Badge>
              <Badge variant="outline" className="gap-1.5">
                <HardDrive className="size-3" />
                <span>O(1)</span>
              </Badge>
              <Badge variant="secondary" className="gap-1.5">
                <Cpu className="size-3" />
                <span>Beginner</span>
              </Badge>
            </div>
          </div>

          {/* Important Note */}
          <div className="flex items-start gap-3 rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
            <AlertTriangle className="size-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-500">Sorted Array Required</p>
              <p className="text-sm text-muted-foreground mt-1">
                Binary search only works on sorted arrays. The input will be automatically sorted.
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Visualization Area */}
            <div className="lg:col-span-2 space-y-4">
              {/* Array Visualizer */}
              <div className="rounded-xl border border-border bg-card p-4">
                <ArrayVisualizer
                  array={array}
                  currentStep={currentStepData}
                  highlightedIndices={highlightedIndices}
                  foundIndex={foundIndex}
                  checkedIndices={checkedIndices}
                />
              </div>

              {/* Step Info */}
              <StepInfo step={currentStepData} algorithmName="Binary Search" />

              {/* Control Panel */}
              <ControlPanel
                isPlaying={isPlaying}
                currentStep={currentStep}
                totalSteps={steps.length - 1}
                speed={speed}
                onPlay={handlePlay}
                onPause={handlePause}
                onReset={handleReset}
                onStepForward={handleStepForward}
                onStepBackward={handleStepBackward}
                onSpeedChange={setSpeed}
                onGoToStep={setCurrentStep}
              />
            </div>

            {/* Side Panel */}
            <div className="space-y-4">
              {/* Input Panel */}
              <InputPanel
                array={array}
                target={target}
                onArrayChange={handleArrayChange}
                onTargetChange={setTarget}
                onRandomize={handleRandomize}
                onReset={handleInputReset}
                disabled={isPlaying}
              />

              {/* Code Display */}
              <CodeDisplay
                code={binarySearchCode}
                highlightedLines={currentStepData?.codeLineNumbers}
              />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
