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
import { Clock, Cpu, HardDrive } from "lucide-react";

// Inline the algorithm logic to avoid module import issues during build
function linearSearchWithSteps(
  arr: number[],
  target: number
): { result: { index: number; found: boolean; comparisons: number }; steps: AnimationStep[] } {
  const steps: AnimationStep[] = [];
  let comparisons = 0;

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

    steps.push({
      id: `step-${steps.length}`,
      type: "highlight",
      indices: [i],
      values: [arr[i]],
      description: `Checking index ${i}: comparing ${arr[i]} with target ${target}`,
      codeLineNumbers: [2, 3],
      metadata: { currentIndex: i, currentValue: arr[i], target },
    });

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
        result: { index: i, found: true, comparisons },
        steps,
      };
    }

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

  steps.push({
    id: `step-${steps.length}`,
    type: "not-found",
    indices: [],
    description: `Target ${target} not found in the array. Total comparisons: ${comparisons}`,
    codeLineNumbers: [7],
    metadata: { comparisons },
  });

  return {
    result: { index: -1, found: false, comparisons },
    steps,
  };
}

const DEFAULT_ARRAY = [64, 34, 25, 12, 22, 11, 90, 45];
const DEFAULT_TARGET = 22;

const linearSearchCode = `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i;  // Found!
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

export default function LinearSearchPage() {
  const [array, setArray] = useState(DEFAULT_ARRAY);
  const [target, setTarget] = useState(DEFAULT_TARGET);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(50);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Generate steps using useMemo (derived state)
  const steps = useMemo(() => {
    const { steps: newSteps } = linearSearchWithSteps(array, target);
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
    const newArray = Array.from(
      { length: 8 },
      () => Math.floor(Math.random() * 90) + 10
    );
    const randomTarget = newArray[Math.floor(Math.random() * newArray.length)];
    setArray(newArray);
    setTarget(randomTarget);
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
                  <BreadcrumbPage>Linear Search</BreadcrumbPage>
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
                Linear Search
              </h1>
              <p className="text-muted-foreground mt-1">
                A simple search algorithm that checks each element sequentially
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="gap-1.5">
                <Clock className="size-3" />
                <span>O(n)</span>
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
              <StepInfo step={currentStepData} algorithmName="Linear Search" />

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
                onArrayChange={setArray}
                onTargetChange={setTarget}
                onRandomize={handleRandomize}
                onReset={handleInputReset}
                disabled={isPlaying}
              />

              {/* Code Display */}
              <CodeDisplay
                code={linearSearchCode}
                highlightedLines={currentStepData?.codeLineNumbers}
              />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
