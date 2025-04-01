import { ReactNode, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth.tsx";

interface ProtectedRouteProps {
  children: ReactNode;
  roles?: string[];
}

export function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    // If finished loading and not authenticated, redirect to login
    if (!isLoading && !isAuthenticated) {
      setLocation("/login");
    }

    // If roles are specified, check if the user has one of those roles
    if (!isLoading && isAuthenticated && roles && user) {
      if (!roles.includes(user.role)) {
        setLocation("/dashboard"); // Redirect to dashboard if user doesn't have required role
      }
    }
  }, [isLoading, isAuthenticated, setLocation, roles, user]);

  // Show nothing while loading or during redirects
  if (isLoading || !isAuthenticated) {
    return null;
  }

  // If roles are specified, only render if user has appropriate role
  if (roles && user && !roles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
