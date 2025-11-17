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

const TRIGGERS = [
  "Boredom",
  "Stress",
  "Notifications",
  "Habit",
  "FOMO",
  "Loneliness",
];

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

  // Helper: ensure a log exists for today
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

  // Toggle block
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

  // Toggle replacement activity
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

  // Mood change
  const handleMoodChange = (mood: Mood) => {
    ensureTodayLog({ mood });
  };

  // Triggers toggle
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

  // Gratitude note
  const handleGratitudeChange = (value: string) => {
    ensureTodayLog({ gratitudeNote: value });
  };

  // Focus sessions
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
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">No Detox Plan Yet</h2>
            <p className="text-muted-foreground mb-6">
              Create a detox plan to start tracking your progress
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
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <section>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {plan.title}
          </h1>
          <p className="text-muted-foreground">
            {new Date(today).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </section>

        {/* Summary + Focus */}
        <section className="grid gap-4 md:grid-cols-2">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Today's Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  Time blocks completed:
                </span>
                <span className="font-semibold">
                  {completedBlocksCount}/{totalBlocks}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  Activity completed:
                </span>
                <span className="font-semibold">
                  {todayLog?.didActivity ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  Focus sessions today:
                </span>
                <span className="font-semibold">{focusSessions}</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">Focus Mode</h2>
              </div>
              <span className="text-xs text-muted-foreground">
                Each session = intentional screen-free time
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              When you decide to focus (for example, 25–30 minutes away from
              your phone), log a focus session here.
            </p>
            <Button variant="outline" onClick={handleAddFocusSession}>
              + Log a focus session
            </Button>
          </Card>
        </section>

        {/* Focus areas */}
        {plan.focusAreas.length > 0 && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-3">Focus Areas</h2>
            <div className="flex flex-wrap gap-2">
              {plan.focusAreas.map((area) => (
                <Badge key={area} variant="secondary">
                  {area}
                </Badge>
              ))}
            </div>
          </Card>
        )}

        {/* Replacement activities */}
        {plan.activities.length > 0 && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-3">
              Replacement Activities
            </h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {plan.activities.map((activity, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  {activity}
                </li>
              ))}
            </ul>
          </Card>
        )}

        {/* Screen-free time blocks */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">
            Screen-Free Time Blocks
          </h2>
          <div className="space-y-3">
            {plan.timeBlocks.map((block) => {
              const isCompleted =
                todayLog?.completedBlocks.includes(block.id) || false;

              return (
                <div
                  key={block.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{block.label}</p>
                      <p className="text-sm text-muted-foreground">
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

        {/* Replacement activity toggle */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Replacement Activity</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Did you do at least one replacement activity today?
              </p>
            </div>
            <Checkbox
              checked={todayLog?.didActivity || false}
              onCheckedChange={handleActivityToggle}
            />
          </div>
        </Card>

        {/* Mood */}
        <Card className="p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">How are you feeling?</h2>
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
                className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                  todayLog?.mood === mood.value
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="text-3xl mb-2">{mood.emoji}</div>
                <div className="text-sm font-medium">{mood.label}</div>
              </button>
            ))}
          </div>
        </Card>

        {/* Triggers */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-2">
            What tempted you today?
          </h2>
          <p className="text-sm text-muted-foreground mb-3">
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
                  className={`px-3 py-1 rounded-full text-sm border transition-all ${
                    active
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted text-foreground border-border hover:border-primary/50"
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </Card>

        {/* Gratitude */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-2">Gratitude note</h2>
          <p className="text-sm text-muted-foreground mb-3">
            Write one good thing about today. It can be very small.
          </p>
          <Textarea
            rows={3}
            placeholder="I felt good when..."
            value={todayLog?.gratitudeNote ?? ""}
            onChange={(e) => handleGratitudeChange(e.target.value)}
          />
        </Card>

        {/* Support message */}
        {supportMessage && (
          <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
            <div className="flex items-start gap-3">
              <Heart className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">{supportMessage.title}</h3>
                <p className="text-muted-foreground">{supportMessage.body}</p>
              </div>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Today;
