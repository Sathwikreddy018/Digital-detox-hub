import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { PiggyBank, Gift, Sparkles } from "lucide-react";

import { loadLogs } from "@/utils/storage";
import type { DailyLog } from "@/types/detox";

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

const glassCard =
  "rounded-2xl border border-slate-700/80 bg-slate-900/80 backdrop-blur shadow-lg";

const RewardWallet = () => {
  const [rewards, setRewards] = useState<CustomReward[]>([]);
  const [title, setTitle] = useState("");
  const [cost, setCost] = useState<string>("");
  const [description, setDescription] = useState("");

  const logs = loadLogs();

  const totalCoins = useMemo(() => {
    const completedDays = logs.filter(isLogCompleted).length;
    return completedDays * COINS_PER_COMPLETED_DAY;
  }, [logs]);

  const spentCoins = useMemo(() => {
    return rewards
      .filter((r) => r.redeemed)
      .reduce((sum, r) => sum + r.cost, 0);
  }, [rewards]);

  const availableCoins = totalCoins - spentCoins;

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
    if (
      !confirm(
        "Reset all redemptions? This will mark all rewards as unredeemed."
      )
    ) {
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
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <section>
          <h1 className="text-3xl font-bold mb-2 text-slate-50">
            Detox Coins & Reward Wallet
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl">
            Every day you complete your detox tasks, you earn{" "}
            <span className="font-semibold">Detox Coins</span>. Use those coins
            to redeem meaningful rewards you choose for yourself.
          </p>
        </section>

        {/* Coins summary */}
        <section className="grid gap-4 md:grid-cols-3">
          <Card className={`p-6 flex items-center gap-3 ${glassCard}`}>
            <div className="w-11 h-11 rounded-full bg-primary/20 flex items-center justify-center">
              <PiggyBank className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-[11px] text-slate-400 uppercase tracking-wide">
                Total coins earned
              </p>
              <p className="text-2xl font-semibold text-slate-50">
                {totalCoins}
              </p>
              <p className="text-xs text-slate-400">
                {COINS_PER_COMPLETED_DAY} coins / completed day
              </p>
            </div>
          </Card>

          <Card className={`p-6 flex items-center gap-3 ${glassCard}`}>
            <div className="w-11 h-11 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <p className="text-[11px] text-slate-400 uppercase tracking-wide">
                Available coins
              </p>
              <p className="text-2xl font-semibold text-slate-50">
                {availableCoins}
              </p>
              <p className="text-xs text-slate-400">
                You can spend these on rewards
              </p>
            </div>
          </Card>

          <Card className={`p-6 flex items-center gap-3 ${glassCard}`}>
            <div className="w-11 h-11 rounded-full bg-amber-500/20 flex items-center justify-center">
              <Gift className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <p className="text-[11px] text-slate-400 uppercase tracking-wide">
                Rewards redeemed
              </p>
              <p className="text-2xl font-semibold text-slate-50">
                {redeemedRewards.length}
              </p>
              <p className="text-xs text-slate-400">
                You&apos;ve already treated yourself
              </p>
            </div>
          </Card>
        </section>

        {/* Create reward form + active rewards */}
        <section className="grid gap-4 md:grid-cols-[2fr,3fr]">
          <Card className={`p-6 ${glassCard}`}>
            <h2 className="text-lg font-semibold mb-3 text-slate-50">
              Create a new reward
            </h2>
            <p className="text-xs text-slate-300 mb-4">
              Define small or big rewards you want to give yourself when you
              stay consistent with your detox.
            </p>

            <div className="space-y-3 text-sm">
              <div>
                <Label
                  htmlFor="reward-title"
                  className="text-xs text-slate-200"
                >
                  Reward name
                </Label>
                <Input
                  id="reward-title"
                  placeholder="Example: Movie night, Pizza treat"
                  className="mt-1 bg-slate-950/70 border-slate-700 text-slate-100 placeholder:text-slate-500"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <Label
                  htmlFor="reward-cost"
                  className="text-xs text-slate-200"
                >
                  Cost (coins)
                </Label>
                <Input
                  id="reward-cost"
                  type="number"
                  min={1}
                  className="mt-1 bg-slate-950/70 border-slate-700 text-slate-100 placeholder:text-slate-500"
                  placeholder="Example: 50"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                />
              </div>

              <div>
                <Label
                  htmlFor="reward-desc"
                  className="text-xs text-slate-200"
                >
                  Description (optional)
                </Label>
                <Input
                  id="reward-desc"
                  placeholder="Example: Order my favourite pizza on Sunday"
                  className="mt-1 bg-slate-950/70 border-slate-700 text-slate-100 placeholder:text-slate-500"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <Button size="sm" onClick={handleAddReward}>
                  Add reward
                </Button>
                {rewards.length > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-slate-300 hover:bg-slate-900/70"
                    onClick={handleResetRedemptions}
                  >
                    Reset redemptions
                  </Button>
                )}
              </div>
            </div>
          </Card>

          <Card className={`p-6 ${glassCard}`}>
            <h2 className="text-lg font-semibold mb-3 text-slate-50">
              Available rewards
            </h2>
            {activeRewards.length === 0 ? (
              <p className="text-sm text-slate-300">
                You haven&apos;t created any rewards yet. Start by adding one on
                the left.
              </p>
            ) : (
              <div className="space-y-3">
                {activeRewards.map((reward) => {
                  const canRedeem = availableCoins >= reward.cost;
                  return (
                    <div
                      key={reward.id}
                      className="flex items-start justify-between gap-3 border border-slate-700 rounded-lg p-3 bg-slate-950/70"
                    >
                      <div>
                        <p className="font-medium flex items-center gap-2 text-slate-50">
                          {reward.title}
                          <Badge
                            variant="outline"
                            className="border-slate-600 text-slate-200"
                          >
                            {reward.cost} coins
                          </Badge>
                        </p>
                        {reward.description && (
                          <p className="text-xs text-slate-300 mt-1">
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
            <Card className={`p-6 ${glassCard}`}>
              <h2 className="text-lg font-semibold mb-3 text-slate-50">
                Rewards you&apos;ve already redeemed
              </h2>
              <div className="space-y-2 text-sm">
                {redeemedRewards.map((reward) => (
                  <div
                    key={reward.id}
                    className="flex items-center justify-between border border-slate-700 rounded-lg p-3 bg-slate-950/70"
                  >
                    <div>
                      <p className="font-medium text-slate-50">
                        {reward.title}
                      </p>
                      {reward.description && (
                        <p className="text-xs text-slate-300">
                          {reward.description}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-400">
                        Cost: {reward.cost} coins
                      </p>
                      {reward.redeemedDate && (
                        <p className="text-xs text-slate-400">
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
