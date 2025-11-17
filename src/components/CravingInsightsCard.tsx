import { Card } from "@/components/ui/card";
import { getCravingInsightsForPlan } from "@/utils/craving";
import { Brain, Clock, Flame, ShieldCheck } from "lucide-react";

interface CravingInsightsCardProps {
  planId?: string;
}

const glassCard =
  "rounded-2xl border border-slate-700/80 bg-slate-900/80 backdrop-blur shadow-lg";

function formatBucket(bucket: string | null) {
  if (!bucket) return "—";
  if (bucket === "morning") return "Morning (5–12)";
  if (bucket === "afternoon") return "Afternoon (12–5)";
  if (bucket === "evening") return "Evening (5–10)";
  return "Night (10–5)";
}

export function CravingInsightsCard({ planId }: CravingInsightsCardProps) {
  const insights = getCravingInsightsForPlan(planId);

  // No data state
  if (!insights || insights.totalUrges === 0) {
    return (
      <Card
        className={`p-6 h-full flex flex-col justify-between ${glassCard}`}
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Brain className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-slate-50">
              Craving insights
            </h2>
          </div>
          <p className="text-sm text-slate-300">
            Use <span className="font-medium">“I’m tempted”</span> on the Today
            page. Once we have a few entries, we’ll show your patterns here.
          </p>
        </div>
      </Card>
    );
  }

  // Data state
  return (
    <Card className={`p-6 h-full flex flex-col gap-4 ${glassCard}`}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-slate-50">
            Craving insights
          </h2>
        </div>
        <span className="text-[11px] px-2 py-0.5 rounded-full bg-primary/15 text-primary font-medium">
          Based on Urge Rescue
        </span>
      </div>

      <div className="grid gap-3 text-sm">
        {/* Total urges + avg strength */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-300">
            <Flame className="w-4 h-4 text-amber-300" />
            <span>Total urges</span>
          </div>
          <span className="font-semibold text-slate-50">
            {insights.totalUrges}{" "}
            <span className="text-xs text-slate-400">
              ({insights.averageStrength.toFixed(1)}/5 avg strength)
            </span>
          </span>
        </div>

        {/* Resisted */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span>Resisted</span>
          </div>
          <span className="font-semibold text-slate-50">
            {insights.resisted}/{insights.totalUrges}
          </span>
        </div>

        {/* Most common trigger */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-300">
            <Brain className="w-4 h-4 text-cyan-300" />
            <span>Most common trigger</span>
          </div>
          <span className="font-semibold capitalize text-slate-50">
            {insights.mostCommonTrigger ?? "—"}
          </span>
        </div>

        {/* Risky time */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-300">
            <Clock className="w-4 h-4 text-violet-300" />
            <span>Most risky time</span>
          </div>
          <span className="font-semibold text-slate-50">
            {formatBucket(insights.worstTimeBucket)}
            {insights.peakHour !== null && (
              <>
                {" "}
                <span className="text-xs text-slate-400">
                  (around {insights.peakHour.toString().padStart(2, "0")}:00)
                </span>
              </>
            )}
          </span>
        </div>
      </div>

      <p className="mt-2 text-[11px] text-slate-400">
        Use this to protect your most risky hours with screen-free blocks and
        better replacement activities.
      </p>
    </Card>
  );
}
