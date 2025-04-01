import { createContext, useContext, useState, ReactNode } from "react";
import { User } from "@/lib/types";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithUsername: (username: string, password: string) => Promise<void>;
  googleLogin: () => Promise<void>;
  logout: () => Promise<void>;
}

// Create mock user for testing
const mockUser: User = {
  id: 1,
  username: "testuser",
  email: "test@example.com",
  name: "Test User",
  role: "owner",
  createdAt: new Date(),
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  isAuthenticated: false,
  login: async () => {},
  loginWithUsername: async () => {},
  googleLogin: async () => {},
  logout: async () => {},
});

export const SimpleAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(mockUser); // Mock authenticated by default
  const [isLoading, setIsLoading] = useState(false);

  // Simplified login functions
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setUser(mockUser);
      setIsLoading(false);
    }, 1000);
  };

  const loginWithUsername = async (username: string, password: string) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setUser(mockUser);
      setIsLoading(false);
    }, 1000);
  };

  const googleLogin = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setUser(mockUser);
      setIsLoading(false);
    }, 1000);
  };

  const logout = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setUser(null);
      setIsLoading(false);
    }, 500);
  };

  const contextValue: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    loginWithUsername,
    googleLogin,
    logout
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useSimpleAuth = () => useContext(AuthContext);