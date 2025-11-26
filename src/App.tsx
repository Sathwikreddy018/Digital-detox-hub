import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "@/pages/Home";
import Today from "@/pages/Today";
import ProgressPage from "@/pages/Progress";
import Rewards from "@/pages/Rewards";
import RewardWallet from "@/pages/RewardWallet";
import Support from "@/pages/Support";
import FocusGarden from "@/pages/FocusGarden";
import Alarms from "@/pages/Alarms";
import AuthPage from "@/pages/Auth";

import { RequireAuth } from "@/components/RequireAuth";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<AuthPage />} />

        {/* Protected */}
        <Route
          path="/today"
          element={
            <RequireAuth>
              <Today />
            </RequireAuth>
          }
        />

        <Route
          path="/progress"
          element={
            <RequireAuth>
              <ProgressPage />
            </RequireAuth>
          }
        />

        <Route
          path="/rewards"
          element={
            <RequireAuth>
              <Rewards />
            </RequireAuth>
          }
        />

        <Route
          path="/wallet"
          element={
            <RequireAuth>
              <RewardWallet />
            </RequireAuth>
          }
        />

        <Route
          path="/focus-garden"
          element={
            <RequireAuth>
              <FocusGarden />
            </RequireAuth>
          }
        />

        <Route
          path="/alarms"
          element={
            <RequireAuth>
              <Alarms />
            </RequireAuth>
          }
        />

        {/* Support page stays public */}
        <Route path="/support" element={<Support />} />
      </Routes>
    </Router>
  );
}

export default App;
