import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/Navbar";
import { Clock, Heart, Target } from "lucide-react";

import { DailyLog, DetoxPlan, Mood } from "@/types/detox";
import { loadPlan, loadLogs, saveLogs } from "@/utils/storage";
import { getSupportMessage } from "@/utils/support";
import { UrgeRescue } from "@/components/UrgeRescue";

const TRIGGERS = [
  "Boredom",
  "Stress",
  "Notifications",
  "Habit",
  "FOMO",
  "Loneliness",
];

const glassCard =
  "rounded-2xl border border-slate-700/80 bg-slate-900/80 backdrop-blur shadow-lg";

const Today = () => {
  const [plan, setPlan] = useState<DetoxPlan | null>(null);
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    setPlan(loadPlan());
    setLogs(loadLogs());
  }, []);

  const todayLog = logs.find((log) => log.date === today);

  useEffect(() => {
    saveLogs(logs);
  }, [logs]);

  const ensureTodayLog = (override?: Partial<DailyLog>): DailyLog => {
    const existingIndex = logs.findIndex((log) => log.date === today);
    if (existingIndex >= 0) {
      const updated: DailyLog = { ...logs[existingIndex], ...override };
      const newLogs = [...logs];
      newLogs[existingIndex] = updated;
      setLogs(newLogs);
      return updated;
    } else {
      const base: DailyLog = {
        date: today,
        completedBlocks: [],
        didActivity: false,
        mood: undefined,
        triggers: [],
        gratitudeNote: "",
        focusSessions: 0,
        ...override,
      };
      setLogs([...logs, base]);
      return base;
    }
  };

  const handleBlockToggle = (blockId: string) => {
    const index = logs.findIndex((log) => log.date === today);
    if (index >= 0) {
      const current = logs[index];
      const has = current.completedBlocks.includes(blockId);
      const updated: DailyLog = {
        ...current,
        completedBlocks: has
          ? current.completedBlocks.filter((id) => id !== blockId)
          : [...current.completedBlocks, blockId],
      };
      const newLogs = [...logs];
      newLogs[index] = updated;
      setLogs(newLogs);
    } else {
      ensureTodayLog({ completedBlocks: [blockId] });
    }
  };

  const handleActivityToggle = () => {
    const index = logs.findIndex((log) => log.date === today);
    if (index >= 0) {
      const current = logs[index];
      const updated: DailyLog = {
        ...current,
        didActivity: !current.didActivity,
      };
      const newLogs = [...logs];
      newLogs[index] = updated;
      setLogs(newLogs);
    } else {
      ensureTodayLog({ didActivity: true });
    }
  };

  const handleMoodChange = (mood: Mood) => {
    ensureTodayLog({ mood });
  };

  const handleTriggerToggle = (trigger: string) => {
    const index = logs.findIndex((log) => log.date === today);
    if (index >= 0) {
      const current = logs[index];
      const currentTriggers = current.triggers ?? [];
      const has = currentTriggers.includes(trigger);
      const updated: DailyLog = {
        ...current,
        triggers: has
          ? currentTriggers.filter((t) => t !== trigger)
          : [...currentTriggers, trigger],
      };
      const newLogs = [...logs];
      newLogs[index] = updated;
      setLogs(newLogs);
    } else {
      ensureTodayLog({ triggers: [trigger] });
    }
  };

  const handleGratitudeChange = (value: string) => {
    ensureTodayLog({ gratitudeNote: value });
  };

  const handleAddFocusSession = () => {
    const index = logs.findIndex((log) => log.date === today);
    if (index >= 0) {
      const current = logs[index];
      const currentCount = current.focusSessions ?? 0;
      const updated: DailyLog = {
        ...current,
        focusSessions: currentCount + 1,
      };
      const newLogs = [...logs];
      newLogs[index] = updated;
      setLogs(newLogs);
    } else {
      ensureTodayLog({ focusSessions: 1 });
    }
  };

  const supportMessage = todayLog?.mood
    ? getSupportMessage(todayLog.mood)
    : null;

  if (!plan) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className={`p-8 text-center ${glassCard}`}>
            <h2 className="text-2xl font-bold mb-4 text-slate-50">
              No Detox Plan Yet
            </h2>
            <p className="text-sm text-slate-300 mb-6">
              Create a detox plan to start tracking your progress.
            </p>
            <Link to="/create-plan">
              <Button>Create Plan</Button>
            </Link>
          </Card>
        </main>
      </div>
    );
  }

  const completedBlocksCount = todayLog?.completedBlocks.length || 0;
  const totalBlocks = plan.timeBlocks.length;
  const todaysTriggers = todayLog?.triggers ?? [];
  const focusSessions = todayLog?.focusSessions ?? 0;

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-50 mb-1">
              {plan.title}
            </h1>
            <p className="text-sm text-slate-300">
              {new Date(today).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              <UrgeRescue planId={(plan as any)?.id} />
              <Link to="/support">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-slate-200 hover:bg-slate-900/60"
                >
                  Need support?
                </Button>
              </Link>
            </div>
            <span className="text-[11px] text-slate-400">
              Today is day{" "}
              <span className="font-medium">
                {plan.currentDay ?? "?"}
              </span>{" "}
              of your plan
            </span>
          </div>
        </section>

        {/* Top summary */}
        <section className="grid gap-4 md:grid-cols-3">
          <Card className={`p-5 ${glassCard}`}>
            <h2 className="text-sm font-semibold mb-3 text-slate-100">
              Today at a glance
            </h2>
            <div className="space-y-3 text-sm text-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">
                  Time blocks completed
                </span>
                <span className="font-semibold">
                  {completedBlocksCount}/{totalBlocks}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">
                  Replacement activity
                </span>
                <span className="font-semibold">
                  {todayLog?.didActivity ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">
                  Focus sessions today
                </span>
                <span className="font-semibold">{focusSessions}</span>
              </div>
            </div>
          </Card>

          <Card className={`p-5 md:col-span-2 ${glassCard}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                <h2 className="text-sm font-semibold text-slate-50">
                  Focus Mode
                </h2>
              </div>
              <span className="text-[11px] text-slate-400">
                Each logged session = intentional screen-free focus sprint
              </span>
            </div>
            <p className="text-sm text-slate-300 mb-4">
              When you decide to focus (for example, 25–30 minutes away from
              your phone), log a focus session. Over time, this builds your
              focus streak alongside your detox streak.
            </p>
            <Button variant="outline" onClick={handleAddFocusSession}>
              + Log a focus session
            </Button>
          </Card>
        </section>

        {/* Main grid */}
        <section className="grid gap-6 lg:grid-cols-[1.4fr,1.1fr]">
          <div className="space-y-6">
            {/* Screen-free time blocks */}
            <Card className={`p-6 ${glassCard}`}>
              <h2 className="text-lg font-semibold mb-4 text-slate-50">
                Screen-free time blocks
              </h2>
              <div className="space-y-3">
                {plan.timeBlocks.map((block) => {
                  const isCompleted =
                    todayLog?.completedBlocks.includes(block.id) || false;

                  return (
                    <div
                      key={block.id}
                      className="flex items-center justify-between p-4 border border-slate-700 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-slate-400" />
                        <div>
                          <p className="font-medium text-slate-100">
                            {block.label}
                          </p>
                          <p className="text-sm text-slate-400">
                            {block.start} – {block.end}
                          </p>
                        </div>
                      </div>
                      <Checkbox
                        checked={isCompleted}
                        onCheckedChange={() => handleBlockToggle(block.id)}
                      />
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Replacement activity */}
            <Card className={`p-6 space-y-4 ${glassCard}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-50">
                    Replacement activity
                  </h2>
                  <p className="text-sm text-slate-300 mt-1">
                    Did you do at least one replacement activity today?
                  </p>
                </div>
                <Checkbox
                  checked={todayLog?.didActivity || false}
                  onCheckedChange={handleActivityToggle}
                />
              </div>

              {plan.activities.length > 0 && (
                <div className="border-t border-slate-700 pt-3">
                  <p className="text-xs font-medium text-slate-400 mb-2">
                    Your go-to alternatives
                  </p>
                  <ul className="space-y-1.5 text-sm text-slate-200">
                    {plan.activities.map((activity, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {activity}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          </div>

          <div className="space-y-6">
            {/* Focus areas */}
            {plan.focusAreas.length > 0 && (
              <Card className={`p-6 ${glassCard}`}>
                <h2 className="text-lg font-semibold mb-3 text-slate-50">
                  Focus areas
                </h2>
                <div className="flex flex-wrap gap-2">
                  {plan.focusAreas.map((area) => (
                    <Badge
                      key={area}
                      variant="secondary"
                      className="bg-slate-800 text-slate-50 border-slate-600"
                    >
                      {area}
                    </Badge>
                  ))}
                </div>
              </Card>
            )}

            {/* Mood */}
            <Card className={`p-6 ${glassCard}`}>
              <div className="mb-4">
                <h2 className="text-lg font-semibold mb-1 text-slate-50">
                  How are you feeling?
                </h2>
                <p className="text-sm text-slate-300">
                  Your mood helps the support tips and progress insights.
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { value: "good", label: "Good", emoji: "😊" },
                  { value: "okay", label: "Okay", emoji: "😌" },
                  { value: "stressful", label: "Stressful", emoji: "😰" },
                  { value: "overwhelmed", label: "Overwhelmed", emoji: "😔" },
                ].map((mood) => (
                  <button
                    key={mood.value}
                    onClick={() => handleMoodChange(mood.value as Mood)}
                    className={`p-4 rounded-xl border-2 text-left transition-all hover:scale-[1.02] ${
                      todayLog?.mood === mood.value
                        ? "border-primary bg-slate-900/90 shadow-sm"
                        : "border-slate-700 bg-slate-900/70 hover:border-primary/60"
                    }`}
                  >
                    <div className="text-2xl mb-1">{mood.emoji}</div>
                    <div className="text-sm font-medium text-slate-100">
                      {mood.label}
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            {/* Triggers */}
            <Card className={`p-6 ${glassCard}`}>
              <h2 className="text-lg font-semibold mb-2 text-slate-50">
                What tempted you today?
              </h2>
              <p className="text-sm text-slate-300 mb-3">
                Select anything that made it harder to stay off screens.
              </p>
              <div className="flex flex-wrap gap-2">
                {TRIGGERS.map((t) => {
                  const active = todaysTriggers.includes(t);
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => handleTriggerToggle(t)}
                      className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                        active
                          ? "bg-primary text-primary-foreground border-primary shadow-sm"
                          : "bg-slate-900/60 text-slate-100 border-slate-700 hover:border-primary/60"
                      }`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </Card>

            {/* Gratitude + support */}
            <Card className={`p-6 space-y-4 ${glassCard}`}>
              <div>
                <h2 className="text-lg font-semibold mb-1 text-slate-50">
                  Gratitude note
                </h2>
                <p className="text-sm text-slate-300 mb-2">
                  Write one good thing about today. It can be very small.
                </p>
                <Textarea
                  rows={3}
                  placeholder="I felt good when..."
                  value={todayLog?.gratitudeNote ?? ""}
                  onChange={(e) => handleGratitudeChange(e.target.value)}
                  className="bg-slate-900/80 border-slate-700 text-slate-100"
                />
              </div>

              {supportMessage && (
                <div className="mt-2 rounded-xl border border-rose-400/40 bg-rose-500/10 p-4 flex items-start gap-3">
                  <Heart className="w-5 h-5 text-rose-300 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-sm mb-1 text-rose-50">
                      {supportMessage.title}
                    </h3>
                    <p className="text-xs text-rose-100/90">
                      {supportMessage.body}
                    </p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Today;
