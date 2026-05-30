"use client";

import { Play, Pause, RotateCcw, SkipBack, SkipForward, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface ControlPanelProps {
  isPlaying: boolean;
  currentStep: number;
  totalSteps: number;
  speed: number;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onSpeedChange: (speed: number) => void;
  onGoToStep: (step: number) => void;
}

export function ControlPanel({
  isPlaying,
  currentStep,
  totalSteps,
  speed,
  onPlay,
  onPause,
  onReset,
  onStepForward,
  onStepBackward,
  onSpeedChange,
  onGoToStep,
}: ControlPanelProps) {
  return (
    <div className="flex flex-col gap-4 p-4 rounded-xl border border-border bg-card">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-mono text-foreground">
            {currentStep} / {totalSteps}
          </span>
        </div>
        <Slider
          value={[currentStep]}
          min={0}
          max={Math.max(totalSteps, 1)}
          step={1}
          onValueChange={(value) => onGoToStep(value[0])}
          className="cursor-pointer"
        />
      </div>

      {/* Main Controls */}
      <div className="flex items-center justify-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={onReset}
          disabled={currentStep === 0 && !isPlaying}
          title="Reset"
        >
          <RotateCcw className="size-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={onStepBackward}
          disabled={currentStep === 0 || isPlaying}
          title="Previous Step"
        >
          <ChevronLeft className="size-4" />
        </Button>

        <Button
          variant="default"
          size="icon"
          className="size-12"
          onClick={isPlaying ? onPause : onPlay}
          disabled={currentStep >= totalSteps && !isPlaying}
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause className="size-5" />
          ) : (
            <Play className="size-5 ml-0.5" />
          )}
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={onStepForward}
          disabled={currentStep >= totalSteps || isPlaying}
          title="Next Step"
        >
          <ChevronRight className="size-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={() => onGoToStep(totalSteps)}
          disabled={currentStep >= totalSteps}
          title="Go to End"
        >
          <SkipForward className="size-4" />
        </Button>
      </div>

      {/* Speed Control */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Speed</span>
          <span className="font-mono text-foreground">{speed}%</span>
        </div>
        <Slider
          value={[speed]}
          min={10}
          max={100}
          step={10}
          onValueChange={(value) => onSpeedChange(value[0])}
        />
      </div>
    </div>
  );
}
