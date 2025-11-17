import { useState } from "react";
import {
  createOrUpdateWeeklyReflection,
  getReflectionForWeek,
} from "@/utils/reflections";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

interface WeeklyReflectionCardProps {
  weekStartDate: string; // "YYYY-MM-DD"
}

const glassCard =
  "rounded-2xl border border-slate-700/80 bg-slate-900/80 backdrop-blur shadow-lg";

export function WeeklyReflectionCard({
  weekStartDate,
}: WeeklyReflectionCardProps) {
  const existing = getReflectionForWeek(weekStartDate);

  const [highlight, setHighlight] = useState(existing?.highlight ?? "");
  const [challenge, setChallenge] = useState(existing?.challenge ?? "");
  const [nextWeekFocus, setNextWeekFocus] = useState(
    existing?.nextWeekFocus ?? ""
  );
  const [saved, setSaved] = useState(false);

  function handleSave() {
    createOrUpdateWeeklyReflection({
      weekStartDate,
      highlight,
      challenge,
      nextWeekFocus,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <Card className={`p-6 h-full flex flex-col gap-4 ${glassCard}`}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-300" />
          <h2 className="text-lg font-semibold text-slate-50">
            Weekly reflection
          </h2>
        </div>
        <span className="text-[11px] text-slate-400">
          Week starting {weekStartDate}
        </span>
      </div>

      <p className="text-xs text-slate-300">
        A short check-in to turn this week’s experience into a better plan for
        next week.
      </p>

      <div className="space-y-3 text-sm">
        <div className="space-y-1.5">
          <p className="font-medium text-[11px] uppercase tracking-wide text-slate-400">
            This week went well when…
          </p>
          <Textarea
            rows={2}
            value={highlight}
            onChange={(e) => setHighlight(e.target.value)}
            placeholder="Example: Evenings were mostly screen-free and I slept earlier."
            className="bg-slate-950/60 border-slate-700 text-slate-100 placeholder:text-slate-500"
          />
        </div>

        <div className="space-y-1.5">
          <p className="font-medium text-[11px] uppercase tracking-wide text-slate-400">
            The hardest part was…
          </p>
          <Textarea
            rows={2}
            value={challenge}
            onChange={(e) => setChallenge(e.target.value)}
            placeholder="Example: After dinner I automatically opened Reels when bored."
            className="bg-slate-950/60 border-slate-700 text-slate-100 placeholder:text-slate-500"
          />
        </div>

        <div className="space-y-1.5">
          <p className="font-medium text-[11px] uppercase tracking-wide text-slate-400">
            Next week I want to focus on…
          </p>
          <Textarea
            rows={2}
            value={nextWeekFocus}
            onChange={(e) => setNextWeekFocus(e.target.value)}
            placeholder="Example: Having a default activity when I feel like scrolling."
            className="bg-slate-950/60 border-slate-700 text-slate-100 placeholder:text-slate-500"
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 pt-1">
        <Button onClick={handleSave} size="sm">
          Save reflection
        </Button>
        {saved && (
          <span className="text-[11px] text-emerald-300">
            Saved for this week
          </span>
        )}
      </div>
    </Card>
  );
}
