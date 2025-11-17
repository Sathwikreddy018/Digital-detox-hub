import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  activateChallenge,
  completeChallengeDay,
  getChallengesWithProgress,
} from "@/utils/challenges";
import { Flag, Target, Star } from "lucide-react";

const glassCard =
  "rounded-2xl border border-slate-700/80 bg-slate-900/80 backdrop-blur shadow-lg";

export function ChallengesPanel() {
  const [challenges, setChallenges] = useState(() =>
    getChallengesWithProgress()
  );

  const refresh = () => {
    setChallenges(getChallengesWithProgress());
  };

  const handleStart = (id: any) => {
    activateChallenge(id);
    refresh();
  };

  const handleDidToday = (id: any) => {
    completeChallengeDay(id, true);
    refresh();
  };

  return (
    <Card className={`p-6 space-y-4 ${glassCard}`}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Flag className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-slate-50">
            Detox challenges
          </h2>
        </div>
        <span className="text-[11px] px-2 py-0.5 rounded-full bg-primary/15 text-primary">
          Extra motivation
        </span>
      </div>
      <p className="text-sm text-slate-300">
        Take on small challenges to keep your streak exciting and unlock extra
        rewards.
      </p>

      <div className="grid gap-3 md:grid-cols-2">
        {challenges.map((c) => {
          const progress = c.progress;
          const status = progress?.status ?? "locked";
          const progressValue = progress?.currentDays ?? 0;
          const ratio =
            c.targetDays > 0 ? progressValue / c.targetDays : 0;

          return (
            <div
              key={c.id}
              className="flex flex-col justify-between rounded-xl border border-slate-700 bg-slate-950/70 p-3 space-y-3"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold flex items-center gap-1.5 text-slate-50">
                    <Target className="w-4 h-4 text-primary" />
                    {c.title}
                  </h3>
                  <span className="rounded-full border border-slate-600 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-300">
                    {status === "locked"
                      ? "Locked"
                      : status === "active"
                      ? "In progress"
                      : "Completed"}
                  </span>
                </div>
                <p className="text-xs text-slate-300">{c.description}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">
                    Target: {c.targetDays} day
                    {c.targetDays > 1 ? "s" : ""}
                  </span>
                  <span className="font-medium text-slate-50">
                    {progressValue}/{c.targetDays}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${Math.min(ratio, 1) * 100}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                {status === "locked" && (
                  <Button
                    size="xs"
                    variant="outline"
                    className="text-[11px]"
                    onClick={() => handleStart(c.id)}
                  >
                    Start challenge
                  </Button>
                )}
                {status === "active" && (
                  <Button
                    size="xs"
                    variant="outline"
                    className="text-[11px]"
                    onClick={() => handleDidToday(c.id)}
                  >
                    I did it today
                  </Button>
                )}
                {status === "completed" && (
                  <span className="flex items-center gap-1 text-[11px] text-emerald-300">
                    <Star className="w-3 h-3" /> Completed!
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
