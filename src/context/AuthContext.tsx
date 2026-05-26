"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface UserData {
  name: string;
  email: string;
  role: string;
  avatar: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserData | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER: UserData = {
  name: "Alex Morgan",
  email: "ceo@saascompany.com",
  role: "Chief Executive Officer",
  avatar: "AM",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserData | null>(null);

  // On mount, check localStorage for existing session
  useEffect(() => {
    try {
      const stored = localStorage.getItem("eos_auth");
      if (stored === "true") {
        setIsAuthenticated(true);
        setUser(DEMO_USER);
      }
    } catch {
      // localStorage not available
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1500));
    if (email === "ceo@saascompany.com" && password === "Demo@123") {
      setUser(DEMO_USER);
      setIsAuthenticated(true);
      try {
        localStorage.setItem("eos_auth", "true");
      } catch {
        // localStorage not available
      }
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    try {
      localStorage.removeItem("eos_auth");
    } catch {
      // localStorage not available
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
