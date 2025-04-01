import { ReactNode } from "react";
import { Link } from "wouter";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  // For simplicity, we're just returning the children directly
  // In a real app, we would check authentication status
  return (
    <>
      {children}
    </>
  );
}
