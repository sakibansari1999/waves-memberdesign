import React, { createContext, useContext, useState, useEffect } from "react";
import { MemberProfile } from "@shared/types";

interface User {
  id: string;
  email: string;
  loginMethod: "otp" | "password";
  profile?: MemberProfile; // Full profile from login response
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isNewLogin: boolean; // Flag to track if user just logged in
  login: (user: User, tokenData?: { accessToken: string; refreshToken: string }) => void;
  logout: () => void;
  loading: boolean;
  updateProfile: (profile: MemberProfile) => void; // Update profile after save
  clearNewLoginFlag: () => void; // Clear the new login flag after redirecting
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isNewLogin, setIsNewLogin] = useState(false);

  // Check authentication status on app load
  useEffect(() => {
    const checkAuth = () => {
      try {
        // Check if there's a user and token in localStorage
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("accessToken");

        if (storedUser && storedToken) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setToken(storedToken);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Failed to restore auth state:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (newUser: User, tokenData?: { accessToken: string; refreshToken: string }) => {
    setUser(newUser);
    setIsAuthenticated(true);
    setIsNewLogin(true); // Mark as new login to trigger profile check

    // Store user info in localStorage
    localStorage.setItem("user", JSON.stringify(newUser));

    // Store token if provided (for Laravel Sanctum)
    if (tokenData?.accessToken) {
      setToken(tokenData.accessToken);
      localStorage.setItem("accessToken", tokenData.accessToken);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setToken(null);
    setIsNewLogin(false);

    // Clear from localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
  };

  const clearNewLoginFlag = () => {
    setIsNewLogin(false);
  };

  const updateProfile = (profile: MemberProfile) => {
    setUser((prevUser) => {
      if (!prevUser) return null;
      const updatedUser = { ...prevUser, profile };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, token, isNewLogin, login, logout, loading, updateProfile, clearNewLoginFlag }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
