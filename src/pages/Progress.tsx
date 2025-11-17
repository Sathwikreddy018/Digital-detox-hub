import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Navbar from "@/components/Navbar";
import { CheckCircle2, XCircle, TrendingUp, Activity } from "lucide-react";

import { loadPlan, loadLogs } from "@/utils/storage";
import { CravingInsightsCard } from "@/components/CravingInsightsCard";
import { WeeklyReflectionCard } from "@/components/WeeklyReflectionCard";

const glassCard =
  "rounded-2xl border border-slate-700/80 bg-slate-900/80 backdrop-blur shadow-lg";

const ProgressPage = () => {
  const plan = loadPlan();
  const logs = loadLogs();

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
              Create a detox plan to start tracking progress.
            </p>
            <Link to="/create-plan">
              <Button>Create Plan</Button>
            </Link>
          </Card>
        </main>
      </div>
    );
  }

  const getStats = (planStartDate: string, planEndDate: string, logs: any[]) => {
    const start = new Date(planStartDate);
    const end = new Date(planEndDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const actualEnd = end < today ? end : today;

    const totalDays =
      Math.floor(
        (actualEnd.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
      ) + 1;

    const completedDays = logs.filter((log) => {
      const logDate = new Date(log.date);
      return (
        logDate >= start &&
        logDate <= actualEnd &&
        log.completedBlocks.length > 0 &&
        log.didActivity
      );
    }).length;

    let streak = 0;
    const todayStr = today.toISOString().split("T")[0];
    let currentDate = new Date(todayStr);

    while (currentDate >= start) {
      const dateStr = currentDate.toISOString().split("T")[0];
      const log = logs.find((l) => l.date === dateStr);

      if (log && log.completedBlocks.length > 0 && log.didActivity) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return { totalDays: Math.max(totalDays, 0), completedDays, streak };
  };

  const stats = getStats(plan.startDate, plan.endDate, logs);
  const progressPercentage =
    stats.totalDays > 0 ? (stats.completedDays / stats.totalDays) * 100 : 0;

  const getDayStatus = (dateStr: string) => {
    const log = logs.find((l) => l.date === dateStr);
    if (!log) return "none";
    if (log.completedBlocks.length > 0 && log.didActivity) return "completed";
    if (log.completedBlocks.length > 0 || log.didActivity) return "partial";
    return "none";
  };

  const generateDaysList = () => {
    const start = new Date(plan.startDate);
    const end = new Date(plan.endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const days: Date[] = [];
    let current = new Date(start);

    while (current <= end && current <= today) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return days;
  };

  const daysList = generateDaysList();

  // WEEKLY SUMMARY (last 7 days)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 6);

  let weeklyBlocks = 0;
  let weeklyDaysWithActivity = 0;
  const moodCounts: Record<string, number> = {};
  const triggerCounts: Record<string, number> = {};

  logs.forEach((log) => {
    const d = new Date(log.date);
    if (d < sevenDaysAgo || d > today) return;

    weeklyBlocks += log.completedBlocks?.length ?? 0;
    if (log.didActivity) weeklyDaysWithActivity++;

    if (log.mood) {
      moodCounts[log.mood] = (moodCounts[log.mood] || 0) + 1;
    }

    if (log.triggers && Array.isArray(log.triggers)) {
      log.triggers.forEach((t: string) => {
        triggerCounts[t] = (triggerCounts[t] || 0) + 1;
      });
    }
  });

  const mostCommonMood =
    Object.keys(moodCounts).length === 0
      ? "No data"
      : Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0][0];

  const topTriggers = Object.entries(triggerCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name, count]) => `${name} (${count})`);

  const weekStartISO = sevenDaysAgo.toISOString().split("T")[0];

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-50 mb-2">
            Your Progress
          </h1>
          <p className="text-sm text-slate-300">
            Track your digital detox journey over time.
          </p>
        </div>

        <div className="grid gap-6">
          {/* Stats cards */}
          <div className="grid sm:grid-cols-3 gap-4">
            <Card className={`p-6 ${glassCard}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-50">
                    {stats.completedDays}
                  </p>
                  <p className="text-xs text-slate-300">Completed days</p>
                </div>
              </div>
            </Card>

            <Card className={`p-6 ${glassCard}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-cyan-300" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-50">
                    {stats.streak}
                  </p>
                  <p className="text-xs text-slate-300">Current streak</p>
                </div>
              </div>
            </Card>

            <Card className={`p-6 ${glassCard}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <span className="text-amber-200 font-bold text-lg">
                    {stats.totalDays}
                  </span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-50">
                    {Math.round(progressPercentage)}%
                  </p>
                  <p className="text-xs text-slate-300">Total progress</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Weekly summary */}
          <Card className={`p-6 ${glassCard}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Activity className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-lg font-semibold text-slate-50">
                Weekly summary (last 7 days)
              </h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-slate-400">Blocks completed</p>
                <p className="text-xl font-semibold text-slate-50">
                  {weeklyBlocks}
                </p>
              </div>
              <div>
                <p className="text-slate-400">
                  Days with replacement activity
                </p>
                <p className="text-xl font-semibold text-slate-50">
                  {weeklyDaysWithActivity}
                </p>
              </div>
              <div>
                <p className="text-slate-400">Most common mood</p>
                <p className="text-xl font-semibold capitalize text-slate-50">
                  {mostCommonMood}
                </p>
              </div>
            </div>
            {topTriggers.length > 0 && (
              <div className="mt-4">
                <p className="text-xs text-slate-400 mb-1">
                  Top triggers this week:
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  {topTriggers.map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700 text-slate-100"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Craving insights + Weekly reflection */}
          <div className="grid gap-6 md:grid-cols-2">
            <CravingInsightsCard planId={(plan as any)?.id} />
            <WeeklyReflectionCard weekStartDate={weekStartISO} />
          </div>

          {/* Overall progress */}
          <Card className={`p-6 ${glassCard}`}>
            <h2 className="text-lg font-semibold mb-4 text-slate-50">
              Overall progress
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-300">
                <span>
                  {stats.completedDays} of {stats.totalDays} days completed
                </span>
                <span className="font-medium text-slate-50">
                  {Math.round(progressPercentage)}%
                </span>
              </div>
              <Progress
                value={progressPercentage}
                className="h-2 bg-slate-800"
              />
            </div>
          </Card>

          {/* Daily breakdown */}
          <Card className={`p-6 ${glassCard}`}>
            <h2 className="text-lg font-semibold mb-4 text-slate-50">
              Daily breakdown
            </h2>
            <div className="grid grid-cols-7 gap-2">
              {daysList.map((day) => {
                const dateStr = day.toISOString().split("T")[0];
                const status = getDayStatus(dateStr);

                return (
                  <div
                    key={dateStr}
                    className="aspect-square flex flex-col items-center justify-center p-2 rounded-lg border border-slate-700 bg-slate-950/60 hover:bg-slate-900/80 transition-colors"
                  >
                    <span className="text-[11px] text-slate-400 mb-1">
                      {day.getDate()}
                    </span>
                    {status === "completed" && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                    )}
                    {status === "partial" && (
                      <div className="w-5 h-5 rounded-full border-2 border-cyan-300" />
                    )}
                    {status === "none" && (
                      <XCircle className="w-5 h-5 text-slate-700" />
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-center gap-6 mt-6 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border-2 border-cyan-300" />
                <span>Partial</span>
              </div>
              <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-slate-700" />
                <span>Missed</span>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ProgressPage;
