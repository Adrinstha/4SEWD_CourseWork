import { hashPassword } from "../utils/hashPassword.js";

const CURRENT_USER_KEY = "stockflow_current_user";

// Pre-computed SHA-256 hash for default password 'admin123'
const DEFAULT_USERS = [
  {
    email: "adrinshrestha16@gmail.com",
    passwordHash: "240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9",
    name: "Admin User",
  },
];

export function getCurrentUser() {
  try {
    const saved = localStorage.getItem(CURRENT_USER_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error("Error reading auth session:", error);
    return null;
  }
}

export async function login(email, password) {
  const normalizedEmail = email.trim().toLowerCase();
  const user = DEFAULT_USERS.find(
    (u) => u.email.toLowerCase() === normalizedEmail,
  );

  if (!user) {
    throw new Error("No account found with this email address.");
  }

  const computedHash = await hashPassword(password);
  if (computedHash !== user.passwordHash) {
    throw new Error("Invalid password. Please try again.");
  }

  const sessionUser = {
    email: user.email,
    name: user.name,
    loggedInAt: new Date().toISOString(),
  };

  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser));
  return sessionUser;
}

export function logout() {
  localStorage.removeItem(CURRENT_USER_KEY);
}
