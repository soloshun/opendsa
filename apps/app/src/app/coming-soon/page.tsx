"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";

// Terminal typing effect hook
function useTypingEffect(text: string, speed: number = 50, delay: number = 0) {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let charIndex = 0;

    const startTyping = () => {
      const typeChar = () => {
        if (charIndex < text.length) {
          setDisplayedText(text.slice(0, charIndex + 1));
          charIndex++;
          timeout = setTimeout(typeChar, speed);
        } else {
          setIsComplete(true);
        }
      };
      typeChar();
    };

    timeout = setTimeout(startTyping, delay);
    return () => clearTimeout(timeout);
  }, [text, speed, delay]);

  return { displayedText, isComplete };
}

// Matrix rain character - client-only with stable random values
function MatrixChar({ index }: { index: number }) {
  const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン01";
  const [char, setChar] = useState("0");
  const [mounted, setMounted] = useState(false);

  // Generate stable random values based on index (seeded pseudo-random)
  const { left, duration, delay, opacity } = useMemo(() => {
    const seed = (index * 9301 + 49297) % 233280;
    const rnd1 = seed / 233280;
    const seed2 = (seed * 9301 + 49297) % 233280;
    const rnd2 = seed2 / 233280;
    const seed3 = (seed2 * 9301 + 49297) % 233280;
    const rnd3 = seed3 / 233280;
    const seed4 = (seed3 * 9301 + 49297) % 233280;
    const rnd4 = seed4 / 233280;

    return {
      left: rnd1 * 100,
      duration: 8 + rnd2 * 4,
      delay: rnd3 * 5,
      opacity: 0.15 + rnd4 * 0.2,
    };
  }, [index]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const interval = setInterval(() => {
      setChar(chars[Math.floor(Math.random() * chars.length)]);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: `${left}%`,
        color: "hsl(142 71% 45%)",
        opacity: opacity,
        fontFamily: "var(--font-jetbrains), monospace",
        fontSize: "14px",
        pointerEvents: "none",
        userSelect: "none",
        animationName: "matrix-fall",
        animationDuration: `${duration}s`,
        animationTimingFunction: "linear",
        animationIterationCount: "infinite",
        animationDelay: `${delay}s`,
      }}
    >
      {char}
    </div>
  );
}

// Progress bar component
function ProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + Math.random() * 3;
      });
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ width: "100%", maxWidth: "400px", margin: "0 auto" }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        fontSize: "12px",
        fontFamily: "var(--font-jetbrains), monospace",
        color: "hsl(0 0% 60%)",
        marginBottom: "4px"
      }}>
        <span>Building visualizers...</span>
        <span>{Math.min(Math.floor(progress), 99)}%</span>
      </div>
      <div style={{
        height: "8px",
        width: "100%",
        borderRadius: "9999px",
        overflow: "hidden",
        backgroundColor: "hsl(0 0% 10%)"
      }}>
        <div
          style={{
            height: "100%",
            borderRadius: "9999px",
            transition: "width 0.2s",
            width: `${Math.min(progress, 99)}%`,
            backgroundColor: "hsl(142 71% 45%)"
          }}
        />
      </div>
    </div>
  );
}

// Animated logo
function AnimatedLogo() {
  return (
    <div style={{ position: "relative" }}>
      {/* Glow behind */}
      <div style={{
        position: "absolute",
        inset: "-16px",
        borderRadius: "16px",
        filter: "blur(24px)",
        opacity: 0.2,
        backgroundColor: "hsl(142 71% 45%)"
      }} />

      {/* Logo */}
      <div style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        gap: "12px"
      }}>
        <div style={{
          position: "relative",
          display: "flex",
          height: "56px",
          width: "56px",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "12px",
          backgroundColor: "hsl(142 71% 45%)",
          boxShadow: "0 0 20px hsl(142 71% 45% / 0.3), 0 0 40px hsl(142 71% 45% / 0.1)"
        }}>
          <span style={{
            fontFamily: "var(--font-jetbrains), monospace",
            fontSize: "20px",
            fontWeight: "bold",
            color: "hsl(0 0% 2%)"
          }}>
            {"<>"}
          </span>
        </div>
        <div>
          <h1 style={{
            fontSize: "28px",
            fontWeight: "bold",
            letterSpacing: "-0.025em",
            color: "hsl(0 0% 98%)",
            margin: 0,
            fontFamily: "var(--font-syne), system-ui, sans-serif"
          }}>
            OPEN<span style={{ color: "hsl(142 71% 45%)", textShadow: "0 0 10px hsl(142 71% 45% / 0.5)" }}>DSA</span>
          </h1>
          <p style={{
            fontSize: "12px",
            fontFamily: "var(--font-jetbrains), monospace",
            color: "hsl(0 0% 60%)",
            margin: 0
          }}>
            v0.1.0-alpha
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ComingSoon() {
  const [mounted, setMounted] = useState(false);
  const { displayedText: line1, isComplete: line1Done } = useTypingEffect(
    "$ initializing opendsa...",
    40,
    500
  );
  const { displayedText: line2, isComplete: line2Done } = useTypingEffect(
    "$ loading algorithm visualizers...",
    40,
    2000
  );
  const { displayedText: line3 } = useTypingEffect(
    "$ status: UNDER_DEVELOPMENT",
    40,
    3500
  );

  const [showContent, setShowContent] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 4500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toISOString().replace("T", " ").split(".")[0] + " UTC");
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "hsl(0 0% 3%)" }} />
    );
  }

  return (
    <div style={{
      position: "relative",
      minHeight: "100vh",
      overflow: "hidden",
      backgroundColor: "hsl(0 0% 3%)"
    }}>
      {/* Matrix rain background */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", opacity: 0.3 }}>
        {[...Array(30)].map((_, i) => (
          <MatrixChar key={i} index={i} />
        ))}
      </div>

      {/* Grid pattern */}
      <div className="grid-pattern" style={{ position: "absolute", inset: 0 }} />

      {/* Scanlines */}
      <div className="scanlines" style={{ position: "absolute", inset: 0, opacity: 0.5 }} />

      {/* Gradient orbs */}
      <div style={{
        position: "absolute",
        top: "25%",
        left: "25%",
        width: "500px",
        height: "500px",
        borderRadius: "50%",
        filter: "blur(200px)",
        backgroundColor: "hsl(142 71% 45%)",
        opacity: 0.05
      }} />
      <div style={{
        position: "absolute",
        bottom: "25%",
        right: "25%",
        width: "400px",
        height: "400px",
        borderRadius: "50%",
        filter: "blur(150px)",
        backgroundColor: "hsl(142 71% 45%)",
        opacity: 0.03
      }} />

      {/* Main content */}
      <div style={{
        position: "relative",
        zIndex: 10,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 16px"
      }}>
        {/* Logo */}
        <AnimatedLogo />

        {/* Terminal window */}
        <div style={{ marginTop: "40px", width: "100%", maxWidth: "672px" }}>
          <div style={{
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            backgroundColor: "hsl(0 0% 4%)",
            border: "1px solid hsl(0 0% 15%)"
          }}>
            {/* Terminal header */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 16px",
              backgroundColor: "hsl(0 0% 6%)",
              borderBottom: "1px solid hsl(0 0% 15%)"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ display: "flex", gap: "6px" }}>
                  <div style={{ height: "12px", width: "12px", borderRadius: "50%", backgroundColor: "#ef4444" }} />
                  <div style={{ height: "12px", width: "12px", borderRadius: "50%", backgroundColor: "#eab308" }} />
                  <div style={{ height: "12px", width: "12px", borderRadius: "50%", backgroundColor: "#22c55e" }} />
                </div>
                <span style={{ marginLeft: "12px", fontSize: "12px", fontFamily: "var(--font-jetbrains), monospace", color: "hsl(0 0% 60%)" }}>
                  opendsa@dev ~ bash
                </span>
              </div>
              <span style={{ fontSize: "10px", fontFamily: "var(--font-jetbrains), monospace", color: "hsl(0 0% 60%)" }}>
                {currentTime}
              </span>
            </div>

            {/* Terminal content */}
            <div style={{ padding: "24px", fontFamily: "var(--font-jetbrains), monospace", fontSize: "14px" }}>
              {/* Line 1 */}
              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ color: "hsl(142 71% 45%)" }}>{line1}</span>
                {!line1Done && (
                  <span className="cursor-blink" style={{ marginLeft: "2px", display: "inline-block", width: "8px", height: "16px", backgroundColor: "hsl(142 71% 45%)" }} />
                )}
              </div>

              {/* Line 2 */}
              {line1Done && (
                <div style={{ display: "flex", alignItems: "center", marginTop: "8px" }}>
                  <span style={{ color: "hsl(142 71% 45%)" }}>{line2}</span>
                  {!line2Done && (
                    <span className="cursor-blink" style={{ marginLeft: "2px", display: "inline-block", width: "8px", height: "16px", backgroundColor: "hsl(142 71% 45%)" }} />
                  )}
                </div>
              )}

              {/* Line 3 */}
              {line2Done && (
                <div style={{ display: "flex", alignItems: "center", marginTop: "8px" }}>
                  <span style={{ color: "#facc15" }}>{line3}</span>
                </div>
              )}

              {/* Status output */}
              {showContent && (
                <div style={{ paddingTop: "16px", marginTop: "16px", borderTop: "1px solid hsl(0 0% 15% / 0.5)" }}>
                  <div style={{ color: "hsl(0 0% 60%)", marginBottom: "12px" }}>
                    <span style={{ color: "hsl(0 0% 98%)" }}>→</span> Algorithm Engine: <span style={{ color: "#facc15" }}>building</span>
                  </div>
                  <div style={{ color: "hsl(0 0% 60%)", marginBottom: "12px" }}>
                    <span style={{ color: "hsl(0 0% 98%)" }}>→</span> Visualization Core: <span style={{ color: "#facc15" }}>in progress</span>
                  </div>
                  <div style={{ color: "hsl(0 0% 60%)", marginBottom: "12px" }}>
                    <span style={{ color: "hsl(0 0% 98%)" }}>→</span> UI Components: <span style={{ color: "hsl(142 71% 45%)" }}>ready</span>
                  </div>
                  <div style={{ color: "hsl(0 0% 60%)" }}>
                    <span style={{ color: "hsl(0 0% 98%)" }}>→</span> Documentation: <span style={{ color: "hsl(142 71% 45%)" }}>available</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Coming soon message */}
        {showContent && (
          <div className="animate-fadeIn" style={{ marginTop: "40px", textAlign: "center" }}>
            <div style={{ marginBottom: "24px" }}>
              <h2 style={{
                fontSize: "clamp(28px, 5vw, 48px)",
                fontWeight: 800,
                letterSpacing: "-0.025em",
                color: "hsl(0 0% 98%)",
                margin: 0,
                fontFamily: "var(--font-syne), system-ui, sans-serif"
              }}>
                COMING <span style={{ color: "hsl(142 71% 45%)", textShadow: "0 0 10px hsl(142 71% 45% / 0.5)" }}>SOON</span>
              </h2>
              <p style={{
                marginTop: "8px",
                fontSize: "14px",
                color: "hsl(0 0% 60%)",
                maxWidth: "400px",
                marginLeft: "auto",
                marginRight: "auto"
              }}>
                We&apos;re building something amazing. The open-source algorithm visualization platform is under active development.
              </p>
            </div>

            {/* Progress bar */}
            <ProgressBar />

            {/* Action buttons */}
            <div style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              paddingTop: "16px",
              marginTop: "24px"
            }}>
              <Link
                href="https://github.com/soloshun/opendsa"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  borderRadius: "9999px",
                  padding: "12px 24px",
                  fontSize: "14px",
                  fontWeight: 600,
                  textDecoration: "none",
                  backgroundColor: "hsl(142 71% 45%)",
                  color: "hsl(0 0% 2%)",
                  boxShadow: "0 0 20px hsl(142 71% 45% / 0.3)"
                }}
              >
                <svg style={{ height: "20px", width: "20px" }} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                Star on GitHub
              </Link>

              <Link
                href="https://opendsa.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  borderRadius: "9999px",
                  padding: "12px 24px",
                  fontSize: "14px",
                  fontWeight: 500,
                  textDecoration: "none",
                  backgroundColor: "transparent",
                  color: "hsl(0 0% 98%)",
                  border: "1px solid hsl(0 0% 15%)"
                }}
              >
                <svg style={{ height: "16px", width: "16px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                Visit Website
              </Link>

              <Link
                href="https://docs-opendsa.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  borderRadius: "9999px",
                  padding: "12px 24px",
                  fontSize: "14px",
                  fontWeight: 500,
                  textDecoration: "none",
                  backgroundColor: "transparent",
                  color: "hsl(0 0% 98%)",
                  border: "1px solid hsl(0 0% 15%)"
                }}
              >
                <svg style={{ height: "16px", width: "16px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Read Docs
              </Link>
            </div>

            {/* Tech stack hint */}
            <div style={{
              paddingTop: "24px",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              fontSize: "12px",
              fontFamily: "var(--font-jetbrains), monospace",
              color: "hsl(0 0% 60%)"
            }}>
              {["Next.js 14", "TypeScript", "Framer Motion", "D3.js", "Tailwind"].map((tech) => (
                <span
                  key={tech}
                  style={{
                    padding: "4px 8px",
                    borderRadius: "4px",
                    backgroundColor: "hsl(0 0% 10%)",
                    border: "1px solid hsl(0 0% 15%)"
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{
          position: "absolute",
          bottom: "24px",
          left: 0,
          right: 0,
          textAlign: "center"
        }}>
          <p style={{
            fontSize: "12px",
            fontFamily: "var(--font-jetbrains), monospace",
            color: "hsl(0 0% 60%)"
          }}>
            Made with 💚 by{" "}
            <Link
              href="https://github.com/soloshun"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "hsl(142 71% 45%)", textDecoration: "none" }}
            >
              @soloshun
            </Link>
            {" "}• MIT License
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes matrix-fall {
          0% {
            transform: translateY(-100%);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh);
            opacity: 0;
          }
        }
        
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        
        .cursor-blink {
          animation: blink 1s infinite;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        
        .grid-pattern {
          background-image: 
            linear-gradient(to right, hsl(0 0% 15%) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(0 0% 15%) 1px, transparent 1px);
          background-size: 40px 40px;
          opacity: 0.3;
        }
        
        .scanlines {
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 0, 0, 0.1) 2px,
            rgba(0, 0, 0, 0.1) 4px
          );
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
