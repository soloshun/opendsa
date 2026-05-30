"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shuffle, RotateCcw } from "lucide-react";

interface InputPanelProps {
  array: number[];
  target: number;
  onArrayChange: (array: number[]) => void;
  onTargetChange: (target: number) => void;
  onRandomize: () => void;
  onReset: () => void;
  disabled?: boolean;
}

export function InputPanel({
  array,
  target,
  onArrayChange,
  onTargetChange,
  onRandomize,
  onReset,
  disabled = false,
}: InputPanelProps) {
  const [arrayInput, setArrayInput] = useState(array.join(", "));
  const [error, setError] = useState<string | null>(null);

  const handleArrayChange = (value: string) => {
    setArrayInput(value);
    setError(null);

    try {
      const newArray = value
        .split(",")
        .map((v) => v.trim())
        .filter((v) => v !== "")
        .map((v) => {
          const num = parseInt(v, 10);
          if (isNaN(num)) throw new Error(`Invalid number: ${v}`);
          return num;
        });

      if (newArray.length === 0) {
        setError("Array cannot be empty");
        return;
      }

      if (newArray.length > 15) {
        setError("Maximum 15 elements allowed");
        return;
      }

      onArrayChange(newArray);
    } catch {
      setError("Please enter valid comma-separated numbers");
    }
  };

  const handleTargetChange = (value: string) => {
    const num = parseInt(value, 10);
    if (!isNaN(num)) {
      onTargetChange(num);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="array-input" className="text-sm">
          Array (comma-separated)
        </Label>
        <Input
          id="array-input"
          value={arrayInput}
          onChange={(e) => handleArrayChange(e.target.value)}
          placeholder="e.g., 5, 3, 8, 1, 2"
          disabled={disabled}
          className={error ? "border-red-500" : ""}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="target-input" className="text-sm">
          Target Value
        </Label>
        <Input
          id="target-input"
          type="number"
          value={target}
          onChange={(e) => handleTargetChange(e.target.value)}
          placeholder="e.g., 8"
          disabled={disabled}
        />
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onRandomize}
          disabled={disabled}
          className="flex-1"
        >
          <Shuffle className="size-4 mr-2" />
          Random
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            onReset();
            setArrayInput(array.join(", "));
          }}
          disabled={disabled}
          className="flex-1"
        >
          <RotateCcw className="size-4 mr-2" />
          Reset
        </Button>
      </div>
    </div>
  );
}
