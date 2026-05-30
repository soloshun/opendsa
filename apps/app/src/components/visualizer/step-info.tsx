"use client";

import type { AnimationStep } from "@opendsa/types";
import { Info, CheckCircle, XCircle, Search } from "lucide-react";

interface StepInfoProps {
  step: AnimationStep | null;
  algorithmName: string;
}

export function StepInfo({ step, algorithmName }: StepInfoProps) {
  const getIcon = () => {
    if (!step) return <Info className="size-4" />;
    
    switch (step.type) {
      case "found":
        return <CheckCircle className="size-4 text-green-500" />;
      case "not-found":
        return <XCircle className="size-4 text-red-500" />;
      case "compare":
      case "highlight":
        return <Search className="size-4 text-primary" />;
      default:
        return <Info className="size-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = () => {
    if (!step) return "border-border";
    
    switch (step.type) {
      case "found":
        return "border-green-500/50 bg-green-500/5";
      case "not-found":
        return "border-red-500/50 bg-red-500/5";
      case "compare":
      case "highlight":
        return "border-primary/50 bg-primary/5";
      default:
        return "border-border";
    }
  };

  return (
    <div className={`rounded-xl border p-4 transition-colors ${getStatusColor()}`}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5">{getIcon()}</div>
        <div className="flex-1">
          <h4 className="font-medium text-foreground">{algorithmName}</h4>
          <p className="text-sm text-muted-foreground mt-1">
            {step?.description || "Press play or step forward to start the visualization"}
          </p>
          {step?.metadata && (
            <div className="mt-2 flex flex-wrap gap-2">
              {Object.entries(step.metadata).map(([key, value]) => (
                <span
                  key={key}
                  className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground"
                >
                  <span className="font-medium">{key}:</span>
                  <span className="font-mono">{String(value)}</span>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
