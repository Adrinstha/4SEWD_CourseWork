import { createContext, useState, useEffect } from "react";
import * as authService from "../services/authService.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() =>
    authService.getCurrentUser()
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function initAuth() {
      try {
        const user = await authService.checkAuthStatus();
        setCurrentUser(user);
      } catch {
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    }
    initAuth();
  }, []);

  async function login(email, password) {
    setIsLoading(true);
    try {
      const user = await authService.login(email, password);
      setCurrentUser(user);
      return user;
    } finally {
      setIsLoading(false);
    }
  }

  function logout() {
    authService.logout();
    setCurrentUser(null);
  }

  const value = {
    currentUser,
    isAuthenticated: Boolean(currentUser),
    isAdmin: currentUser?.role === "admin",
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
