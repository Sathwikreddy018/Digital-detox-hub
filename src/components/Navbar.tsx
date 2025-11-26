import { NavLink } from "@/components/NavLink";
import { Waves, Bell, Leaf } from "lucide-react";
import { useAuth } from "@/components/AuthContext";
import { useAlarmRunner } from "@/hooks/useAlarmRunner"; // ✅ fixed path

const Navbar = () => {
  useAlarmRunner();

  const { user, logout } = useAuth();
  const userInitial = user?.email?.[0]?.toUpperCase() ?? "?";

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <NavLink
            to="/"
            className="flex items-center gap-2 text-emerald-400 hover:opacity-80 transition"
            activeClassName=""
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-600/20 flex items-center justify-center">
              <Waves className="w-5 h-5" />
            </div>
            <span className="font-semibold text-lg">Digital Detox</span>
          </NavLink>

          {/* Links */}
          <div className="flex items-center gap-1 sm:gap-2">
            <NavLink
              to="/today"
              className="px-3 py-2 rounded-md text-xs sm:text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition"
              activeClassName="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30"
            >
              Today
            </NavLink>

            <NavLink
              to="/progress"
              className="px-3 py-2 rounded-md text-xs sm:text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition"
              activeClassName="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30"
            >
              Progress
            </NavLink>

            <NavLink
              to="/rewards"
              className="px-3 py-2 rounded-md text-xs sm:text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition"
              activeClassName="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30"
            >
              Rewards
            </NavLink>

            <NavLink
              to="/wallet"
              className="px-3 py-2 rounded-md text-xs sm:text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition"
              activeClassName="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30"
            >
              Wallet
            </NavLink>

            <NavLink
              to="/focus-garden"
              className="px-3 py-2 rounded-md text-xs sm:text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition"
              activeClassName="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30"
            >
              Focus Garden
            </NavLink>

            <NavLink
              to="/alarms"
              className="px-3 py-2 rounded-md text-xs sm:text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition"
              activeClassName="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30"
            >
              Alarms
            </NavLink>

            <NavLink
              to="/support"
              className="px-3 py-2 rounded-md text-xs sm:text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition"
              activeClassName="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30"
            >
              Support
            </NavLink>
          </div>

          {/* Right section → Login / Logout */}
          {!user ? (
            <NavLink
              to="/auth"
              className="px-4 py-1.5 rounded-full text-xs font-medium bg-slate-800 text-slate-200 border border-slate-600 hover:bg-slate-700 transition"
              activeClassName="bg-emerald-500/30 border-emerald-400 text-emerald-200"
            >
              Login
            </NavLink>
          ) : (
            <div className="flex items-center gap-3">
              {/* User avatar */}
              <div className="w-8 h-8 rounded-full bg-emerald-600/40 border border-emerald-300/40 flex items-center justify-center text-xs font-bold text-white">
                {userInitial}
              </div>

              {/* Logout */}
              <button
                onClick={() => logout()}
                className="px-3 py-1.5 rounded-full text-[11px] font-medium text-slate-200 border border-slate-600 bg-slate-800 hover:bg-red-600/20 hover:border-red-300 transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
