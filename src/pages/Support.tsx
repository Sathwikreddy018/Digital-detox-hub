import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Wind, BookOpen, Sparkles } from "lucide-react";

import {
  getSupportMessage,
  getBreathingExercise,
  getGroundingExercise,
  getJournalingPrompt,
} from "@/utils/support";
import { getLogForToday } from "@/utils/today";
import { BreathingGame } from "@/components/BreathingGame";

const glassCard =
  "rounded-2xl border border-slate-700/80 bg-slate-900/80 backdrop-blur shadow-lg";

type SenseKey = "see" | "touch" | "hear" | "smell" | "taste";

const GROUNDING_TEMPLATE: {
  key: SenseKey;
  label: string;
  target: number;
}[] = [
  { key: "see", label: "Things you can see", target: 5 },
  { key: "touch", label: "Things you can touch", target: 4 },
  { key: "hear", label: "Things you can hear", target: 3 },
  { key: "smell", label: "Things you can smell", target: 2 },
  { key: "taste", label: "Things you can taste", target: 1 },
];

const REMINDERS = [
  "Your feelings are valid. It's okay to have difficult days.",
  "Change takes time. Be patient with yourself.",
  "You're building healthier habits, one day at a time.",
  "It's okay to reach out to someone you trust.",
];

const Support = () => {
  const todayLog = getLogForToday();
  const mood = todayLog?.mood;
  const reminder = getSupportMessage(mood);
  const breathing = getBreathingExercise(); // still used as text
  const grounding = getGroundingExercise(); // not shown directly but we keep it if you want later
  const journaling = getJournalingPrompt();

  // Journaling session state
  const [journalActive, setJournalActive] = useState(false);
  const [journalSecondsLeft, setJournalSecondsLeft] = useState(180); // 3 minutes
  const [journalText, setJournalText] = useState("");
  const [journalCompleted, setJournalCompleted] = useState(false);

  // Grounding interactive state
  const [groundingState, setGroundingState] = useState(
    () =>
      GROUNDING_TEMPLATE.map((s) => ({
        ...s,
        completed: 0,
      })) // completed count per sense
  );

  // “Remember” selection
  const [selectedReminderIndex, setSelectedReminderIndex] = useState<number | null>(
    null
  );

  // Journaling timer effect
  useEffect(() => {
    if (!journalActive) return;

    if (journalSecondsLeft <= 0) {
      setJournalActive(false);
      setJournalCompleted(true);
      return;
    }

    const id = window.setInterval(() => {
      setJournalSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => window.clearInterval(id);
  }, [journalActive, journalSecondsLeft]);

  const startJournaling = () => {
    setJournalActive(true);
    setJournalCompleted(false);
    setJournalSecondsLeft(180);
  };

  const stopJournaling = () => {
    setJournalActive(false);
  };

  // Format seconds as mm:ss
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const groundingAllDone = groundingState.every(
    (s) => s.completed >= s.target
  );

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-slate-50 mb-2">
            Support & Care
          </h1>
          <p className="text-sm text-slate-300">
            When it&apos;s hard to stay off screens, use these tools instead of
            just willpower.
          </p>
        </div>

        {/* Today’s reminder, mood-aware */}
        <Card
          className={`p-8 mb-4 ${glassCard} bg-gradient-to-br from-emerald-500/10 to-cyan-500/10`}
        >
          <div className="flex items-start gap-4">
            <Heart className="w-8 h-8 text-rose-300 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-semibold mb-2 text-slate-50">
                {reminder.title}
              </h2>
              <p className="text-sm text-slate-100/90">{reminder.body}</p>
              {mood && (
                <p className="mt-2 text-[11px] text-slate-300">
                  Based on how you&apos;re feeling today:{" "}
                  <span className="font-medium">{mood}</span>.
                </p>
              )}
            </div>
          </div>
        </Card>

        <div className="grid gap-6">
          {/* Breathing mini-game (interactive) */}
          <BreathingGame />

          {/* Breathing text helper (still uses utils, but much shorter) */}
          <Card className={`p-6 ${glassCard}`}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <Wind className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-slate-50">
                1-minute reset script
              </h2>
            </div>
            <p className="text-xs text-slate-300 mb-2">
              Use this wording if your mind starts racing while you breathe:
            </p>
            <p className="text-sm text-slate-100">{breathing.body}</p>
          </Card>

          {/* Interactive journaling session */}
          <Card className={`p-6 ${glassCard}`}>
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-50">
                    3-minute journaling
                  </h2>
                  <p className="text-xs text-slate-300">
                    Short prompt to get thoughts out of your head.
                  </p>
                </div>
              </div>
              <div className="text-right text-xs text-slate-300">
                <p>Timer</p>
                <p className="font-mono text-slate-100">
                  {formatTime(journalSecondsLeft)}
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-100 mb-3">{journaling.body}</p>

            <Textarea
              rows={5}
              value={journalText}
              onChange={(e) => setJournalText(e.target.value)}
              placeholder="Write freely for a few minutes. Nobody else will read this."
              className="bg-slate-950/70 border-slate-700 text-slate-100 placeholder:text-slate-500 mb-3"
            />

            <div className="flex items-center justify-between gap-3">
              <div className="text-[11px] text-slate-400">
                {journalCompleted
                  ? "Nice work. Close this when you feel a bit lighter."
                  : journalActive
                  ? "Keep writing until the timer ends. Don’t worry about being perfect."
                  : "Click start and keep writing until the timer hits zero."}
              </div>

              <div className="flex items-center gap-2">
                {journalActive ? (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs"
                    onClick={stopJournaling}
                  >
                    Pause
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    className="text-xs"
                    onClick={startJournaling}
                  >
                    {journalCompleted ? "Start again" : "Start 3-minute session"}
                  </Button>
                )}
              </div>
            </div>
          </Card>

          {/* Interactive 5-4-3-2-1 grounding */}
          <Card className={`p-6 ${glassCard}`}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-cyan-500/20 rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-cyan-300" />
              </div>
            </div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-semibold text-slate-50">
                5-4-3-2-1 grounding
              </h2>
              <span className="text-[11px] text-slate-300">
                Tap to track as you go
              </span>
            </div>
            <p className="text-sm text-slate-300 mb-4">
              When you feel overwhelmed, use your senses to come back to the
              present. For each row, notice something, say it in your head, and
              tap a dot.
            </p>

            <div className="space-y-3">
              {groundingState.map((s, idx) => (
                <div key={s.key} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300">{s.label}</span>
                    <span className="text-slate-400">
                      {s.completed}/{s.target}
                    </span>
                  </div>
                  <div className="flex gap-1.5">
                    {Array.from({ length: s.target }).map((_, i) => {
                      const filled = i < s.completed;
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() =>
                            setGroundingState((prev) =>
                              prev.map((p, j) =>
                                j === idx
                                  ? { ...p, completed: i + 1 }
                                  : p
                              )
                            )
                          }
                          className={`w-5 h-5 rounded-full border transition ${
                            filled
                              ? "bg-cyan-400 border-cyan-300"
                              : "bg-slate-900 border-slate-700 hover:border-cyan-300"
                          }`}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 text-[11px] text-slate-400">
              {groundingAllDone
                ? "You completed the full 5-4-3-2-1. Notice how your body feels now."
                : "Move through each sense slowly. You don’t need to rush; just keep tapping as you go."}
            </div>
          </Card>

          {/* Interactive “Remember” – pick today’s anchor */}
          <Card
            className={`p-6 ${glassCard} bg-gradient-to-br from-emerald-500/10 to-primary/10`}
          >
            <h2 className="text-xl font-semibold mb-3 text-slate-50">
              Choose today&apos;s reminder
            </h2>
            <p className="text-sm text-slate-300 mb-3">
              Pick one sentence to keep in mind for the rest of the day.
            </p>

            <div className="grid gap-2">
              {REMINDERS.map((text, index) => {
                const selected = selectedReminderIndex === index;
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedReminderIndex(index)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm border transition ${
                      selected
                        ? "bg-emerald-500/20 border-emerald-300 text-slate-50"
                        : "bg-slate-950/70 border-slate-700 text-slate-100 hover:border-emerald-300/70"
                    }`}
                  >
                    {text}
                  </button>
                );
              })}
            </div>

            {selectedReminderIndex !== null && (
              <p className="mt-3 text-[11px] text-emerald-200">
                This is your anchor for today. Whenever you feel like giving up
                or scrolling, repeat it once in your head.
              </p>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Support;
