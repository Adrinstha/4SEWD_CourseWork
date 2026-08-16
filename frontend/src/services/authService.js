import { apiClient, setToken, removeToken, getToken } from "./apiClient.js";

const CURRENT_USER_KEY = "stockflow_current_user";

export function getCurrentUser() {
  try {
    const saved = localStorage.getItem(CURRENT_USER_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error("Error reading stored user:", error);
    return null;
  }
}

export async function login(identifier, password) {
  try {
    const data = await apiClient("/api/auth/login", {
      method: "POST",
      body: { email: identifier, username: identifier, password },
    });

    if (data.token) {
      setToken(data.token);
    }

    const sessionUser = {
      id: data.user.id,
      email: data.user.email,
      name: data.user.name || data.user.username,
      username: data.user.username,
      role: data.user.role || "user",
      loggedInAt: new Date().toISOString(),
    };

    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser));
    return sessionUser;
  } catch (error) {
    throw new Error(error.message || "Invalid credentials. Please try again.", { cause: error });
  }
}

export async function checkAuthStatus() {
  const token = getToken();
  if (!token) return null;

  try {
    const data = await apiClient("/api/auth/me");
    if (data.user) {
      const sessionUser = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name || data.user.username,
        username: data.user.username,
        role: data.user.role || "user",
        loggedInAt: new Date().toISOString(),
      };
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser));
      return sessionUser;
    }
    return null;
  } catch {
    removeToken();
    localStorage.removeItem(CURRENT_USER_KEY);
    return null;
  }
}

export function logout() {
  removeToken();
  localStorage.removeItem(CURRENT_USER_KEY);
}
