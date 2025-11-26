import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/components/AuthContext";

interface Props {
  children: JSX.Element;
}

export const RequireAuth = ({ children }: Props) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-200">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  return children;
};
