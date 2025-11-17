import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Leaf, SunMedium, Droplets, Sparkles } from "lucide-react";

import { loadLogs } from "@/utils/storage";
import type { DailyLog } from "@/types/detox";

const glassCard =
  "rounded-2xl border border-slate-700/80 bg-slate-900/80 backdrop-blur shadow-lg";

type GardenLevel = {
  id: number;
  name: string;
  emoji: string;
  minSessions: number;
  maxSessions: number | null; // null = no upper bound
  description: string;
};

const GARDEN_LEVELS: GardenLevel[] = [
  {
    id: 0,
    name: "Empty Soil",
    emoji: "🪴",
    minSessions: 0,
    maxSessions: 0,
    description: "Your garden is ready. Every focus sprint plants a seed.",
  },
  {
    id: 1,
    name: "Tiny Sprout",
    emoji: "🌱",
    minSessions: 1,
    maxSessions: 9,
    description: "Your first seeds are sprouting. Keep showing up.",
  },
  {
    id: 2,
    name: "Calm Patch",
    emoji: "🌿",
    minSessions: 10,
    maxSessions: 19,
    description: "You’ve grown a small patch of focus. It’s getting real.",
  },
  {
    id: 3,
    name: "Deep Focus Grove",
    emoji: "🌳",
    minSessions: 20,
    maxSessions: 39,
    description: "You’ve built a grove of focused days. Distractions fear you.",
  },
  {
    id: 4,
    name: "Blooming Sanctuary",
    emoji: "🌸",
    minSessions: 40,
    maxSessions: null,
    description:
      "Your garden is in full bloom. You’ve turned focus into a habit.",
  },
];

function getGardenLevel(totalSessions: number): GardenLevel {
  for (const level of GARDEN_LEVELS) {
    if (
      totalSessions >= level.minSessions &&
      (level.maxSessions === null || totalSessions <= level.maxSessions)
    ) {
      return level;
    }
  }
  return GARDEN_LEVELS[0];
}

function getNextLevel(current: GardenLevel | null): GardenLevel | null {
  if (!current) return null;
  const idx = GARDEN_LEVELS.findIndex((l) => l.id === current.id);
  if (idx < 0 || idx === GARDEN_LEVELS.length - 1) return null;
  return GARDEN_LEVELS[idx + 1];
}

function parseDate(dateStr: string): Date | null {
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

const FocusGarden = () => {
  const logs = loadLogs();

  const totalSessions = logs.reduce(
    (sum: number, log: DailyLog) => sum + (log.focusSessions ?? 0),
    0
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayISO = today.toISOString().split("T")[0];

  const todayLog = logs.find((l) => l.date === todayISO);
  const todaySessions = todayLog?.focusSessions ?? 0;

  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 6);

  let weeklySessions = 0;
  let weeklyFocusDays = 0;
  logs.forEach((log) => {
    const d = parseDate(log.date);
    if (!d) return;
    if (d < sevenDaysAgo || d > today) return;
    const count = log.focusSessions ?? 0;
    weeklySessions += count;
    if (count > 0) weeklyFocusDays++;
  });

  // Focus streak = consecutive days with focusSessions > 0 ending today
  let focusStreak = 0;
  let cursor = new Date(today);
  while (true) {
    const iso = cursor.toISOString().split("T")[0];
    const log = logs.find((l) => l.date === iso);
    const count = log?.focusSessions ?? 0;
    if (count > 0) {
      focusStreak++;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }

  // Find the day with max focus sessions (best focus day)
  let bestFocusDate: string | null = null;
  let bestFocusCount = 0;
  logs.forEach((log) => {
    const count = log.focusSessions ?? 0;
    if (count > bestFocusCount) {
      bestFocusCount = count;
      bestFocusDate = log.date;
    }
  });

  const currentLevel = getGardenLevel(totalSessions);
  const nextLevel = getNextLevel(currentLevel);

  let levelProgress = 1;
  if (nextLevel) {
    const range = nextLevel.minSessions - currentLevel.minSessions || 1;
    const within = totalSessions - currentLevel.minSessions;
    levelProgress = Math.min(Math.max(within / range, 0), 1);
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <section className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-50 mb-1">
              Focus Garden
            </h1>
            <p className="text-sm text-slate-300 max-w-xl">
              Every focus session you log is like watering a plant. Watch your
              garden grow as you protect your attention.
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="text-xs"
            asChild
          >
            <a href="/today">Log a focus sprint</a>
          </Button>
        </section>

        {/* Top stats */}
        <section className="grid gap-4 md:grid-cols-3">
          <Card className={`p-6 ${glassCard}`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Droplets className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400 uppercase tracking-wide">
                  Total focus sessions
                </p>
                <p className="text-2xl font-semibold text-slate-50">
                  {totalSessions}
                </p>
                <p className="text-xs text-slate-400">
                  Each session waters your garden.
                </p>
              </div>
            </div>
          </Card>

          <Card className={`p-6 ${glassCard}`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                <SunMedium className="w-5 h-5 text-cyan-300" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400 uppercase tracking-wide">
                  Last 7 days
                </p>
                <p className="text-2xl font-semibold text-slate-50">
                  {weeklySessions}
                </p>
                <p className="text-xs text-slate-400">
                  Focus on {weeklyFocusDays} of 7 days.
                </p>
              </div>
            </div>
          </Card>

          <Card className={`p-6 ${glassCard}`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center">
                <Leaf className="w-5 h-5 text-violet-300" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400 uppercase tracking-wide">
                  Focus streak
                </p>
                <p className="text-2xl font-semibold text-slate-50">
                  {focusStreak} day{focusStreak === 1 ? "" : "s"}
                </p>
                <p className="text-xs text-slate-400">
                  Consecutive days with at least one focus session.
                </p>
              </div>
            </div>
          </Card>
        </section>

        {/* Main garden view */}
        <section className="grid gap-6 lg:grid-cols-[1.4fr,1.1fr]">
          {/* Main plant */}
          <Card className={`p-6 ${glassCard}`}>
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-slate-50">
                  Your main plant
                </h2>
              </div>
              <Badge
                variant="outline"
                className="text-[11px] border-emerald-400/60 text-emerald-200 bg-emerald-500/10"
              >
                {currentLevel.name}
              </Badge>
            </div>

            <div className="flex flex-col items-center gap-4 py-2">
              <div className="relative w-40 h-40 sm:w-48 sm:h-48">
                <div className="absolute inset-0 rounded-full bg-slate-950/80 border border-slate-700" />
                <div className="absolute inset-4 rounded-full bg-gradient-to-br from-emerald-500/30 to-cyan-500/20" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                  <div className="text-5xl mb-2">{currentLevel.emoji}</div>
                  <p className="text-xs text-slate-300 mb-1">
                    Total focus sessions
                  </p>
                  <p className="text-xl font-semibold text-slate-50">
                    {totalSessions}
                  </p>
                </div>
              </div>

              <p className="text-sm text-slate-300 text-center max-w-md">
                {currentLevel.description}
              </p>

              {/* Progress to next level */}
              {nextLevel ? (
                <div className="w-full max-w-md space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Next stage:</span>
                    <span className="text-slate-100">
                      {nextLevel.name} at {nextLevel.minSessions} sessions
                    </span>
                  </div>
                  <Progress
                    value={levelProgress * 100}
                    className="h-2 bg-slate-800"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>{currentLevel.minSessions}</span>
                    <span>{nextLevel.minSessions}</span>
                  </div>
                </div>
              ) : (
                <p className="text-[11px] text-emerald-200">
                  You’ve reached the final stage. Now your goal is to keep the
                  garden alive by returning for small focus sprints.
                </p>
              )}
            </div>
          </Card>

          {/* Side plots / highlights */}
          <div className="space-y-4">
            <Card className={`p-5 ${glassCard}`}>
              <h3 className="text-sm font-semibold text-slate-50 mb-2">
                Today&apos;s watering
              </h3>
              <p className="text-xs text-slate-300 mb-2">
                Focus sessions you&apos;ve logged today.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
                    <Droplets className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-slate-50">
                      {todaySessions}
                    </p>
                    <p className="text-xs text-slate-400">
                      session{todaySessions === 1 ? "" : "s"} today
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs"
                  asChild
                >
                  <a href="/today#focus">Add another sprint</a>
                </Button>
              </div>
            </Card>

            <Card className={`p-5 ${glassCard}`}>
              <h3 className="text-sm font-semibold text-slate-50 mb-2">
                Best focus day
              </h3>
              {bestFocusDate && bestFocusCount > 0 ? (
                <>
                  <p className="text-sm text-slate-100 mb-1">
                    {new Date(bestFocusDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-xs text-slate-300 mb-3">
                    You did {bestFocusCount} focus session
                    {bestFocusCount === 1 ? "" : "s"} on this day.
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Use this as a reference. What was different about that day?
                    Time of day, environment, or mindset?
                  </p>
                </>
              ) : (
                <p className="text-sm text-slate-300">
                  Once you have a few focus sessions, we&apos;ll highlight your
                  strongest day here.
                </p>
              )}
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
};

export default FocusGarden;
