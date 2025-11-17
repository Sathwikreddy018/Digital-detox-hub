// src/pages/Home.tsx (or whatever your landing route file is)

import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Sparkles,
  ArrowRight,
  Brain,
  Activity,
  Shield,
  AlarmClock,
  Trophy,
} from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        {/* HERO */}
        <section className="grid gap-10 lg:grid-cols-[1.1fr,0.9fr] items-center">
          {/* Left: copy */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-200">
              <Sparkles className="w-3.5 h-3.5" />
              <span>New: Urge Rescue · Craving insights · Detox challenges</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight">
                Digital Detox that feels{" "}
                <span className="bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
                  intentional
                </span>
                , not punishing.
              </h1>
              <p className="text-sm sm:text-base text-slate-300 max-w-xl">
                Plan screen-free time, rescue yourself from “just 5 minutes”
                scrolls, and understand when cravings actually hit you. All in
                one simple hub that runs locally in your browser.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link to="/create-plan">
                <Button size="lg" className="gap-2 bg-emerald-500 hover:bg-emerald-600">
                  Start my detox
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>

              <Link to="/today">
                <Button size="lg" variant="outline" className="border-slate-600 bg-slate-900/40">
                  View today&apos;s plan
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap gap-6 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>No accounts · no data leaving your device</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>Designed for week-long experiments, not forever bans</span>
              </div>
            </div>
          </div>

          {/* Right: “preview” card */}
          <div className="relative">
            <div className="pointer-events-none absolute -inset-6 rounded-3xl bg-emerald-500/20 blur-3xl opacity-40" />
            <Card className="relative z-10 rounded-3xl border-slate-700 bg-slate-900/80 backdrop-blur p-5 sm:p-6 text-slate-50 space-y-4 shadow-2xl">
              <header className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    Today · Active plan
                  </p>
                  <h2 className="text-lg font-semibold">7-Day Social Detox</h2>
                </div>
                <span className="rounded-full bg-emerald-500/15 text-emerald-300 text-xs px-3 py-1">
                  Day 3 · On track
                </span>
              </header>

              {/* Progress row */}
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="rounded-2xl bg-slate-900/80 border border-slate-700 p-3 space-y-1">
                  <p className="text-slate-400">Today</p>
                  <p className="text-xl font-semibold">3 / 4</p>
                  <p className="text-[11px] text-emerald-300">Blocks done</p>
                </div>
                <div className="rounded-2xl bg-slate-900/80 border border-slate-700 p-3 space-y-1">
                  <p className="text-slate-400">Streak</p>
                  <p className="text-xl font-semibold">5 days</p>
                  <p className="text-[11px] text-slate-400">Grace 1x per plan</p>
                </div>
                <div className="rounded-2xl bg-slate-900/80 border border-slate-700 p-3 space-y-1">
                  <p className="text-slate-400">Urges</p>
                  <p className="text-xl font-semibold">2</p>
                  <p className="text-[11px] text-emerald-300">1 resisted 💪</p>
                </div>
              </div>

              {/* Time blocks */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                  Today&apos;s screen-free blocks
                </p>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2">
                    <div>
                      <p className="font-medium">Morning deep work</p>
                      <p className="text-[11px] text-slate-400">08:00 – 09:00</p>
                    </div>
                    <span className="rounded-full bg-emerald-500/15 text-emerald-300 px-2 py-1 text-[11px]">
                      Done
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/40 px-3 py-2">
                    <div>
                      <p className="font-medium">Evening scroll-free</p>
                      <p className="text-[11px] text-slate-400">19:00 – 20:00</p>
                    </div>
                    <span className="rounded-full bg-amber-500/10 text-amber-300 px-2 py-1 text-[11px]">
                      Next
                    </span>
                  </div>
                </div>
              </div>

              {/* Feature pills */}
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900/70 border border-slate-700 px-2.5 py-1 text-[11px] text-slate-300">
                  <Brain className="w-3.5 h-3.5 text-emerald-300" />
                  Urge Rescue Mode
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900/70 border border-slate-700 px-2.5 py-1 text-[11px] text-slate-300">
                  <Activity className="w-3.5 h-3.5 text-cyan-300" />
                  Craving insights
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900/70 border border-slate-700 px-2.5 py-1 text-[11px] text-slate-300">
                  <Trophy className="w-3.5 h-3.5 text-amber-300" />
                  Detox challenges
                </span>
              </div>
            </Card>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="space-y-6">
          <h2 className="text-xl sm:text-2xl font-semibold">
            How Digital Detox Hub works
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-slate-800 bg-slate-900/70 p-5 space-y-2">
              <div className="flex items-center gap-2 text-emerald-300 text-xs font-semibold uppercase tracking-wide">
                <AlarmClock className="w-4 h-4" />
                Step 1 · Plan your week
              </div>
              <p className="font-medium text-sm">
                Set focus areas, replacement activities and screen-free time blocks.
              </p>
              <p className="text-xs text-slate-400">
                You decide how strict the plan is. The app just keeps you honest.
              </p>
            </Card>
            <Card className="border-slate-800 bg-slate-900/70 p-5 space-y-2">
              <div className="flex items-center gap-2 text-cyan-300 text-xs font-semibold uppercase tracking-wide">
                <Shield className="w-4 h-4" />
                Step 2 · Handle cravings
              </div>
              <p className="font-medium text-sm">
                When you’re about to open a distracting app, tap “I’m tempted”.
              </p>
              <p className="text-xs text-slate-400">
                Urge Rescue Mode guides a quick reset and logs triggers & strength.
              </p>
            </Card>
            <Card className="border-slate-800 bg-slate-900/70 p-5 space-y-2">
              <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold uppercase tracking-wide">
                <Activity className="w-4 h-4" />
                Step 3 · Learn & improve
              </div>
              <p className="font-medium text-sm">
                Progress, cravings, weekly reflection and challenges keep you evolving.
              </p>
              <p className="text-xs text-slate-400">
                You see when cravings spike, what triggers them, and what to try next.
              </p>
            </Card>
          </div>
        </section>

        {/* WHAT MAKES IT DIFFERENT */}
        <section className="space-y-5 pb-10">
          <h2 className="text-xl sm:text-2xl font-semibold">
            What makes this detox different?
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-slate-800 bg-slate-900/70 p-5 space-y-2">
              <p className="text-sm font-semibold flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-300" />
                Built for slips, not perfection
              </p>
              <p className="text-xs text-slate-400">
                Grace Day, Urge Rescue and weekly reflection assume you’ll slip
                sometimes. The goal is awareness and better experiments, not guilt.
              </p>
            </Card>
            <Card className="border-slate-800 bg-slate-900/70 p-5 space-y-2">
              <p className="text-sm font-semibold flex items-center gap-2">
                <Brain className="w-4 h-4 text-cyan-300" />
                Data that actually helps behaviour change
              </p>
              <p className="text-xs text-slate-400">
                Craving insights highlight your risky hours and common triggers
                so you can design better replacement habits.
              </p>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
