import { NavLink } from "@/components/NavLink";
import { Waves } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-card/95">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <NavLink to="/" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
            <Waves className="w-6 h-6" />
            <span className="font-semibold text-lg">Digital Detox</span>
          </NavLink>
          
          <div className="flex items-center gap-1 sm:gap-2">
            <NavLink
              to="/"
              className="px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              activeClassName="text-primary bg-primary/10"
            >
              Home
            </NavLink>
            <NavLink
              to="/today"
              className="px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              activeClassName="text-primary bg-primary/10"
            >
              Today
            </NavLink>
            <NavLink
              to="/progress"
              className="px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              activeClassName="text-primary bg-primary/10"
            >
              Progress
            </NavLink>
            <NavLink
              to="/rewards"
              className="px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              activeClassName="text-primary bg-primary/10"
            >
              Rewards
            </NavLink>
            {/* 🚀 New Wallet Link Added Here */}
            <NavLink
              to="/wallet"
              className="px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              activeClassName="text-primary bg-primary/10"
            >
              Reward Wallet
            </NavLink>
            <NavLink
              to="/support"
              className="px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              activeClassName="text-primary bg-primary/10"
            >
              Support
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;