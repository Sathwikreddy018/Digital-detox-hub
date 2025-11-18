import { NavLink } from "@/components/NavLink";
import { Waves, Leaf, Bell } from "lucide-react";
import { useAlarmRunner } from "@/hooks/useAlarmRunner";

const Navbar = () => {
  // Run alarm checks globally while the app is open
  useAlarmRunner();

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-3">
          {/* Brand */}
          <NavLink to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-emerald-500/60 to-cyan-500/60 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.35)]">
                <Waves className="w-4 h-4 text-slate-950" />
              </div>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-semibold text-sm sm:text-base text-slate-50">
                Digital Detox
              </span>
              <span className="text-[10px] sm:text-[11px] text-slate-400">
                Calm • Focus • Control
              </span>
            </div>
          </NavLink>

          {/* Nav links */}
          <div className="flex items-center justify-end flex-1">
            <div className="flex items-center gap-1 sm:gap-2 rounded-full bg-slate-900/80 border border-slate-700/80 px-1.5 py-1 shadow-lg shadow-black/40">
              <NavLink
                to="/"
                className="px-2 sm:px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-medium text-slate-300 hover:text-slate-50 hover:bg-slate-800/80 transition-colors"
                activeClassName="text-slate-50 bg-primary/20 shadow-sm"
              >
                Home
              </NavLink>

              <NavLink
                to="/today"
                className="px-2 sm:px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-medium text-slate-300 hover:text-slate-50 hover:bg-slate-800/80 transition-colors"
                activeClassName="text-slate-50 bg-primary/20 shadow-sm"
              >
                Today
              </NavLink>

              <NavLink
                to="/progress"
                className="px-2 sm:px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-medium text-slate-300 hover:text-slate-50 hover:bg-slate-800/80 transition-colors"
                activeClassName="text-slate-50 bg-primary/20 shadow-sm"
              >
                Progress
              </NavLink>

              <NavLink
                to="/focus-garden"
                className="px-2 sm:px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-medium text-slate-300 hover:text-slate-50 hover:bg-slate-800/80 transition-colors"
                activeClassName="text-slate-50 bg-primary/20 shadow-sm"
              >
                <span className="flex items-center gap-1">
                  <Leaf className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Focus Garden</span>
                </span>
              </NavLink>

              <NavLink
                to="/rewards"
                className="px-2 sm:px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-medium text-slate-300 hover:text-slate-50 hover:bg-slate-800/80 transition-colors"
                activeClassName="text-slate-50 bg-primary/20 shadow-sm"
              >
                Rewards
              </NavLink>

              <NavLink
                to="/wallet"
                className="px-2 sm:px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-medium text-slate-300 hover:text-slate-50 hover:bg-slate-800/80 transition-colors"
                activeClassName="text-slate-50 bg-primary/20 shadow-sm"
              >
                Reward Wallet
              </NavLink>

              {/* New Alarms link */}
              <NavLink
                to="/alarms"
                className="px-2 sm:px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-medium text-slate-300 hover:text-slate-50 hover:bg-slate-800/80 transition-colors"
                activeClassName="text-slate-50 bg-primary/20 shadow-sm"
              >
                <span className="flex items-center gap-1">
                  <Bell className="w-3.5 h-3.5 text-amber-300" />
                  <span>Alarms</span>
                </span>
              </NavLink>

              <NavLink
                to="/support"
                className="px-2.5 sm:px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-medium text-slate-100 border border-emerald-400/40 bg-emerald-500/10 hover:bg-emerald-500/20 hover:border-emerald-300 transition-colors"
                activeClassName="text-slate-50 bg-emerald-500/25 shadow-sm"
              >
                Support
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
