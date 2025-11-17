import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge as UIBadge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import { Trophy, Award, Flame, HeartHandshake } from "lucide-react";

import { loadPlan } from "@/utils/storage";
import { calculateRewardData, useGraceDayForToday } from "@/utils/rewards";
import type { Badge as BadgeType, RewardData } from "@/types/detox";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChallengesPanel } from "@/components/ChallengesPanel";

const glassCard =
  "rounded-2xl border border-slate-700/80 bg-slate-900/80 backdrop-blur shadow-lg";

const Rewards = () => {
  const plan = loadPlan();
  const [rewards, setRewards] = useState<RewardData>(() =>
    calculateRewardData()
  );

  const earnedBadges = rewards.badges;

  const predefinedBadges: BadgeType[] = [
    {
      id: "streak-3",
      name: "3-Day Streak",
      description: "Maintain your detox for 3 days in a row.",
      icon: "🔥",
      earned: false,
      type: "streak",
    },
    {
      id: "streak-5",
      name: "5-Day Streak",
      description: "Stay consistent for 5 continuous days.",
      icon: "🔥",
      earned: false,
      type: "streak",
    },
    {
      id: "streak-7",
      name: "7-Day Streak",
      description: "Complete a full week of your detox.",
      icon: "🔥",
      earned: false,
      type: "streak",
    },
    {
      id: "milestone-full-plan",
      name: "Full Plan Completed",
      description: "Complete every day of your detox plan.",
      icon: "🏆",
      earned: false,
      type: "milestone",
    },
  ];

  const earnedIds = new Set(earnedBadges.map((b) => b.id));
  const lockedBadges = predefinedBadges.filter((b) => !earnedIds.has(b.id));

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
              Create a detox plan to start earning rewards.
            </p>
            <Link to="/create-plan">
              <Button>Create Plan</Button>
            </Link>
          </Card>
        </main>
      </div>
    );
  }

  const handleUseGraceDay = () => {
    if (rewards.graceDayUsed) return;
    const updated = useGraceDayForToday();
    setRewards(updated);
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-50 mb-2">
            Your Rewards
          </h1>
          <p className="text-sm text-slate-300">
            Celebrate your digital detox achievements and streaks.
          </p>
        </div>

        {/* Summary cards */}
        <div className="grid sm:grid-cols-3 gap-4">
          <Card className={`p-6 ${glassCard}`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
                <Trophy className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-50">
                  {earnedBadges.length}
                </p>
                <p className="text-xs text-slate-300">Badges earned</p>
              </div>
            </div>
          </Card>

          <Card className={`p-6 ${glassCard}`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                <Flame className="w-5 h-5 text-orange-300" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-50">
                  {rewards.currentStreak}
                </p>
                <p className="text-xs text-slate-300">Current streak</p>
              </div>
            </div>
          </Card>

          <Card className={`p-6 ${glassCard}`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-cyan-500/20 rounded-full flex items-center justify-center">
                <Award className="w-5 h-5 text-cyan-300" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-50">
                  {rewards.totalDaysCompleted}
                </p>
                <p className="text-xs text-slate-300">Days completed</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Grace Day card */}
        <Card className={`p-6 ${glassCard}`}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-rose-500/20 rounded-full flex items-center justify-center">
              <HeartHandshake className="w-5 h-5 text-rose-300" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-50">
                Grace Day
              </h2>
              <p className="text-sm text-slate-300">
                Once per plan, you can use a Grace Day to be kind to yourself if
                you miss a day without breaking your streak.
              </p>
            </div>
          </div>
          {rewards.graceDayUsed ? (
            <p className="text-sm text-slate-300">
              Grace Day already used on{" "}
              <span className="font-medium text-slate-50">
                {rewards.graceDayDate
                  ? new Date(rewards.graceDayDate).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }
                    )
                  : "this plan"}
              </span>
              .
            </p>
          ) : (
            <Button variant="outline" onClick={handleUseGraceDay}>
              Use my Grace Day
            </Button>
          )}
        </Card>

        {/* Detox Challenges */}
        <ChallengesPanel />

        {/* Earned badges */}
        {earnedBadges.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-slate-50">
              Earned badges
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {earnedBadges.map((badge) => (
                <Card
                  key={badge.id}
                  className={`p-6 ${glassCard} bg-gradient-to-br from-slate-900/80 to-emerald-900/30`}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-5xl">{badge.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1 text-slate-50">
                        {badge.name}
                      </h3>
                      <p className="text-sm text-slate-300 mb-2">
                        {badge.description}
                      </p>
                      {badge.earnedDate && (
                        <UIBadge
                          variant="secondary"
                          className="text-[11px] bg-slate-800 text-slate-100 border-slate-600"
                        >
                          Earned{" "}
                          {new Date(badge.earnedDate).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </UIBadge>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Locked badges */}
        {lockedBadges.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-slate-50">
              Available badges
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {lockedBadges.map((badge) => (
                <Card
                  key={badge.id}
                  className={`p-6 ${glassCard} opacity-70 hover:opacity-90 transition-opacity`}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-5xl grayscale">{badge.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1 text-slate-50">
                        {badge.name}
                      </h3>
                      <p className="text-sm text-slate-300">
                        {badge.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {earnedBadges.length === 0 && (
          <Card className={`p-8 text-center ${glassCard}`}>
            <p className="text-lg text-slate-200 mb-2">
              Start your journey to earn badges!
            </p>
            <p className="text-sm text-slate-300">
              Complete your daily tasks to unlock achievements.
            </p>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Rewards;
