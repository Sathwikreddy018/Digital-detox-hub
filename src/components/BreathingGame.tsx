import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wind } from "lucide-react";

const glassCard =
  "rounded-2xl border border-slate-700/80 bg-slate-900/80 backdrop-blur shadow-lg";

type Phase = "in" | "hold" | "out";

type CycleStep = {
  phase: Phase;
  label: string;
  seconds: number;
};

const CYCLE: CycleStep[] = [
  { phase: "in", label: "Breathe in", seconds: 4 },
  { phase: "hold", label: "Hold", seconds: 2 },
  { phase: "out", label: "Breathe out", seconds: 6 },
];

const TOTAL_GAME_SECONDS = 60; // 1 minute

export function BreathingGame() {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedGameSeconds, setElapsedGameSeconds] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepElapsed, setStepElapsed] = useState(0);

  const intervalRef = useRef<number | null>(null);

  const currentStep = CYCLE[currentStepIndex];
  const stepProgress = Math.min(stepElapsed / currentStep.seconds, 1);

  // Start game
  const handleStart = () => {
    setIsRunning(true);
    setElapsedGameSeconds(0);
    setCurrentStepIndex(0);
    setStepElapsed(0);
  };

  // Stop + reset
  const handleStop = () => {
    setIsRunning(false);
    setElapsedGameSeconds(0);
    setCurrentStepIndex(0);
    setStepElapsed(0);
  };

  // Timer logic
  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const startTime = performance.now() - elapsedGameSeconds * 1000;

    intervalRef.current = window.setInterval(() => {
      const now = performance.now();
      const totalElapsed = (now - startTime) / 1000;

      if (totalElapsed >= TOTAL_GAME_SECONDS) {
        setElapsedGameSeconds(TOTAL_GAME_SECONDS);
        setIsRunning(false);
        if (intervalRef.current !== null) {
          window.clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        return;
      }

      setElapsedGameSeconds(totalElapsed);

      // step logic
      setStepElapsed((prev) => {
        const next = prev + 0.1; // 100ms tick
        if (next >= currentStep.seconds) {
          // move to next step
          setCurrentStepIndex((prevIndex) => (prevIndex + 1) % CYCLE.length);
          return 0;
        }
        return next;
      });
    }, 100);

    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning]); // intentionally not including currentStep to avoid restarting interval

  const gameProgress = Math.min(
    elapsedGameSeconds / TOTAL_GAME_SECONDS,
    1
  );

  const phaseColor =
    currentStep.phase === "in"
      ? "from-emerald-400 to-emerald-500"
      : currentStep.phase === "hold"
      ? "from-cyan-400 to-cyan-500"
      : "from-violet-400 to-violet-500";

  const done = !isRunning && elapsedGameSeconds === TOTAL_GAME_SECONDS;

  return (
    <Card className={`p-6 flex flex-col gap-4 ${glassCard}`}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Wind className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-slate-50">
            1-minute Calm Breathing
          </h2>
        </div>
        <span className="text-[11px] text-slate-400">
          Mini-game · Just 60 seconds
        </span>
      </div>

      <p className="text-sm text-slate-300">
        Follow the circle for one minute. When you feel like scrolling, play
        this once before you decide.
      </p>

      {/* Big breathing circle */}
      <div className="flex flex-col items-center gap-3 py-2">
        <div className="relative w-40 h-40 sm:w-48 sm:h-48">
          <div className="absolute inset-0 rounded-full bg-slate-900/90 border border-slate-700" />
          <div
            className={`absolute inset-4 rounded-full bg-gradient-to-br ${phaseColor} opacity-80 transition-transform`}
            style={{
              transform: `scale(${0.5 + stepProgress * 0.5})`,
            }}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <span className="text-xs uppercase tracking-wide text-slate-300">
              {currentStep.label}
            </span>
            <span className="text-3xl font-semibold text-slate-50">
              {Math.max(
                currentStep.seconds - Math.floor(stepElapsed),
                1
              )}
            </span>
          </div>
        </div>

        {/* Overall game progress bar */}
        <div className="w-full max-w-xs mt-2">
          <div className="flex justify-between text-[11px] text-slate-400 mb-1">
            <span>0s</span>
            <span>60s</span>
          </div>
          <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${gameProgress * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Buttons + status */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <div className="text-[11px] text-slate-400">
          {done
            ? "Nice. Notice if the urge feels a little softer now."
            : isRunning
            ? "Stay with the rhythm. If your mind wanders, gently come back."
            : "Press start and just follow the circle for one minute."}
        </div>

        {isRunning ? (
          <Button
            size="sm"
            variant="outline"
            className="text-xs"
            onClick={handleStop}
          >
            Stop
          </Button>
        ) : (
          <Button size="sm" className="text-xs" onClick={handleStart}>
            {done ? "Do another minute" : "Start 1-minute game"}
          </Button>
        )}
      </div>
    </Card>
  );
}
