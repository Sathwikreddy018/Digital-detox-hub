import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { PiggyBank, Gift, Sparkles } from "lucide-react";

import { loadLogs } from "@/utils/storage"; // if you still use "@/lib/storage", change this import
import type { DailyLog } from "@/types/detox";

// Local type for this page (you can also reuse CustomReward from types if you prefer)
type CustomReward = {
  id: string;
  title: string;
  cost: number;
  description?: string;
  redeemed?: boolean;
  redeemedDate?: string;
};

const STORAGE_KEY = "detox_custom_rewards_v1";
const COINS_PER_COMPLETED_DAY = 10;

function isLogCompleted(log: DailyLog): boolean {
  return (log.completedBlocks?.length ?? 0) > 0 && log.didActivity === true;
}

const RewardWallet = () => {
  const [rewards, setRewards] = useState<CustomReward[]>([]);
  const [title, setTitle] = useState("");
  const [cost, setCost] = useState<string>("");
  const [description, setDescription] = useState("");

  // Load logs to compute coins
  const logs = loadLogs();

  // Compute total coins earned from logs
  const totalCoins = useMemo(() => {
    const completedDays = logs.filter(isLogCompleted).length;
    return completedDays * COINS_PER_COMPLETED_DAY;
  }, [logs]);

  // Coins already "spent" on redeemed rewards
  const spentCoins = useMemo(() => {
    return rewards
      .filter((r) => r.redeemed)
      .reduce((sum, r) => sum + r.cost, 0);
  }, [rewards]);

  const availableCoins = totalCoins - spentCoins;

  // Load rewards from localStorage on mount
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: CustomReward[] = JSON.parse(raw);
        setRewards(parsed);
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  // Save rewards whenever they change
  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(rewards));
  }, [rewards]);

  const handleAddReward = () => {
    const trimmedTitle = title.trim();
    const parsedCost = parseInt(cost, 10);

    if (!trimmedTitle || isNaN(parsedCost) || parsedCost <= 0) {
      alert("Please enter a valid reward name and cost (positive number).");
      return;
    }

    const newReward: CustomReward = {
      id: crypto.randomUUID(),
      title: trimmedTitle,
      cost: parsedCost,
      description: description.trim() || undefined,
      redeemed: false,
    };

    setRewards((prev) => [...prev, newReward]);
    setTitle("");
    setCost("");
    setDescription("");
  };

  const handleRedeem = (id: string) => {
    setRewards((prev) =>
      prev.map((r) =>
        r.id === id && !r.redeemed
          ? {
              ...r,
              redeemed: true,
              redeemedDate: new Date().toISOString(),
            }
          : r
      )
    );
  };

  const handleResetRedemptions = () => {
    if (!confirm("Reset all redemptions? This will mark all rewards as unredeemed.")) {
      return;
    }
    setRewards((prev) =>
      prev.map((r) => ({
        ...r,
        redeemed: false,
        redeemedDate: undefined,
      }))
    );
  };

  const activeRewards = rewards.filter((r) => !r.redeemed);
  const redeemedRewards = rewards.filter((r) => r.redeemed);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <section>
          <h1 className="text-3xl font-bold mb-2">Detox Coins & Reward Wallet</h1>
          <p className="text-muted-foreground max-w-2xl text-sm">
            Every day you complete your detox tasks, you earn <strong>Detox Coins</strong>.
            Use those coins to redeem meaningful rewards that you choose for yourself.
          </p>
        </section>

        {/* Coins summary */}
        <section className="grid gap-4 md:grid-cols-3">
          <Card className="p-6 flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center">
              <PiggyBank className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Total Coins Earned
              </p>
              <p className="text-2xl font-semibold">{totalCoins}</p>
              <p className="text-xs text-muted-foreground">
                {COINS_PER_COMPLETED_DAY} coins / completed day
              </p>
            </div>
          </Card>

          <Card className="p-6 flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-secondary/10 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Available Coins
              </p>
              <p className="text-2xl font-semibold">{availableCoins}</p>
              <p className="text-xs text-muted-foreground">
                You can spend these on rewards
              </p>
            </div>
          </Card>

          <Card className="p-6 flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-accent/10 flex items-center justify-center">
              <Gift className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Rewards Redeemed
              </p>
              <p className="text-2xl font-semibold">{redeemedRewards.length}</p>
              <p className="text-xs text-muted-foreground">
                You&apos;ve already treated yourself
              </p>
            </div>
          </Card>
        </section>

        {/* Create reward form */}
        <section className="grid gap-4 md:grid-cols-[2fr,3fr]">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-3">Create a new reward</h2>
            <p className="text-xs text-muted-foreground mb-4">
              Define small or big rewards you want to give yourself when you stay
              consistent with your detox.
            </p>

            <div className="space-y-3 text-sm">
              <div>
                <Label htmlFor="reward-title">Reward name</Label>
                <Input
                  id="reward-title"
                  placeholder="Example: Movie night, Pizza treat"
                  className="mt-1"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="reward-cost">Cost (coins)</Label>
                <Input
                  id="reward-cost"
                  type="number"
                  min={1}
                  className="mt-1"
                  placeholder="Example: 50"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="reward-desc">Description (optional)</Label>
                <Input
                  id="reward-desc"
                  placeholder="Example: Order my favourite pizza on Sunday"
                  className="mt-1"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <Button size="sm" onClick={handleAddReward}>
                  Add Reward
                </Button>
                {rewards.length > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleResetRedemptions}
                  >
                    Reset redemptions
                  </Button>
                )}
              </div>
            </div>
          </Card>

          {/* Active rewards */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-3">Available rewards</h2>
            {activeRewards.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                You haven&apos;t created any rewards yet. Start by adding one on the left.
              </p>
            ) : (
              <div className="space-y-3">
                {activeRewards.map((reward) => {
                  const canRedeem = availableCoins >= reward.cost;
                  return (
                    <div
                      key={reward.id}
                      className="flex items-start justify-between gap-3 border border-border rounded-lg p-3"
                    >
                      <div>
                        <p className="font-medium flex items-center gap-2">
                          {reward.title}
                          <Badge variant="outline">
                            {reward.cost} coins
                          </Badge>
                        </p>
                        {reward.description && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {reward.description}
                          </p>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant={canRedeem ? "default" : "outline"}
                        disabled={!canRedeem}
                        onClick={() => handleRedeem(reward.id)}
                      >
                        {canRedeem ? "Redeem" : "Not enough coins"}
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </section>

        {/* Redeemed rewards history */}
        {redeemedRewards.length > 0 && (
          <section>
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-3">
                Rewards you&apos;ve already redeemed
              </h2>
              <div className="space-y-2 text-sm">
                {redeemedRewards.map((reward) => (
                  <div
                    key={reward.id}
                    className="flex items-center justify-between border border-border rounded-lg p-3 bg-muted/60"
                  >
                    <div>
                      <p className="font-medium">{reward.title}</p>
                      {reward.description && (
                        <p className="text-xs text-muted-foreground">
                          {reward.description}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        Cost: {reward.cost} coins
                      </p>
                      {reward.redeemedDate && (
                        <p className="text-xs text-muted-foreground">
                          Redeemed on{" "}
                          {new Date(
                            reward.redeemedDate
                          ).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </section>
        )}
      </main>
    </div>
  );
};

export default RewardWallet;
