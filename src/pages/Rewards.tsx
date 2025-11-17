import { Card } from "@/components/ui/card";
import { Badge as UIBadge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import { Trophy, Award, Flame } from "lucide-react";

import { loadPlan } from "@/utils/storage";
import { calculateRewardData } from "@/utils/rewards";
import type { Badge as BadgeType } from "@/types/detox";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Rewards = () => {
  const plan = loadPlan();
  const rewards = calculateRewardData(); // uses plan + logs from storage

  // All earned badges from RewardData (daily + streak + milestone)
  const earnedBadges = rewards.badges;

  // Define a few "goal" badges to show as locked if not earned
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

  // If there is no plan at all
  if (!plan) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">No Detox Plan Yet</h2>
            <p className="text-muted-foreground mb-6">
              Create a detox plan to start earning rewards
            </p>
            <Link to="/create-plan">
              <Button>Create Plan</Button>
            </Link>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Your Rewards
          </h1>
          <p className="text-muted-foreground">
            Celebrate your digital detox achievements
          </p>
        </div>

        {/* Summary cards */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                <Trophy className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{earnedBadges.length}</p>
                <p className="text-sm text-muted-foreground">Badges Earned</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Flame className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{rewards.currentStreak}</p>
                <p className="text-sm text-muted-foreground">Current Streak</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                <Award className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {rewards.totalDaysCompleted}
                </p>
                <p className="text-sm text-muted-foreground">Days Completed</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Earned badges */}
        {earnedBadges.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Earned Badges</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {earnedBadges.map((badge) => (
                <Card
                  key={badge.id}
                  className="p-6 hover:shadow-lg transition-shadow bg-gradient-to-br from-card to-accent/5"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-5xl">{badge.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">
                        {badge.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {badge.description}
                      </p>
                      {badge.earnedDate && (
                        <UIBadge variant="secondary" className="text-xs">
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

        {/* Locked / available badges */}
        {lockedBadges.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Available Badges</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {lockedBadges.map((badge) => (
                <Card
                  key={badge.id}
                  className="p-6 opacity-60 hover:opacity-80 transition-opacity"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-5xl grayscale">{badge.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">
                        {badge.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {badge.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* If no badges at all */}
        {earnedBadges.length === 0 && (
          <Card className="p-8 text-center mt-8">
            <p className="text-xl text-muted-foreground mb-2">
              Start your journey to earn badges!
            </p>
            <p className="text-sm text-muted-foreground">
              Complete your daily tasks to unlock achievements.
            </p>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Rewards;
