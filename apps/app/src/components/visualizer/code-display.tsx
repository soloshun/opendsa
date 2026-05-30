"use client";

interface CodeDisplayProps {
  code: string;
  highlightedLines?: number[];
}

export function CodeDisplay({ code, highlightedLines = [] }: CodeDisplayProps) {
  const lines = code.split("\n");

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-muted/50">
        <div className="flex gap-1.5">
          <div className="size-3 rounded-full bg-red-500/80" />
          <div className="size-3 rounded-full bg-yellow-500/80" />
          <div className="size-3 rounded-full bg-green-500/80" />
        </div>
        <span className="text-xs text-muted-foreground font-mono">algorithm.js</span>
      </div>
      <pre className="p-4 text-sm font-mono overflow-x-auto">
        <code>
          {lines.map((line, index) => {
            const lineNumber = index + 1;
            const isHighlighted = highlightedLines.includes(lineNumber);

            return (
              <div
                key={index}
                className={`flex transition-colors ${
                  isHighlighted
                    ? "bg-primary/10 border-l-2 border-primary -ml-[2px] pl-[2px]"
                    : ""
                }`}
              >
                <span className="w-8 text-right pr-4 text-muted-foreground/50 select-none">
                  {lineNumber}
                </span>
                <span className={isHighlighted ? "text-foreground" : "text-muted-foreground"}>
                  {line || " "}
                </span>
              </div>
            );
          })}
        </code>
      </pre>
    </div>
  );
}
