import { hashPassword } from "../utils/hashPassword.js";
import { validatePassword } from "../utils/passwordValidation.js";

const CURRENT_USER_KEY = "stockflow_current_user";
const USERS_STORAGE_KEY = "stockflow_users";

// Default system accounts with exact SHA-256 hashes and plain text fallbacks for fail-safe authentication
const DEFAULT_USERS = [
  {
    email: "admin@stockflow.com",
    name: "System Admin",
    role: "admin",
    plainPassword: "Admin123!",
    // SHA-256 hash of "Admin123!"
    passwordHash: "3eb3fe66b31e3b4d10fa70b5cad49c7112294af6ae4e476a1c405155d45aa121",
  },
  {
    email: "adrinshrestha16@gmail.com",
    name: "Admin User",
    role: "admin",
    plainPassword: "admin123",
    // SHA-256 hash of "admin123"
    passwordHash: "240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9",
  },
  {
    email: "user@stockflow.com",
    name: "Regular User",
    role: "user",
    plainPassword: "User123!",
    // SHA-256 hash of "User123!"
    passwordHash: "bc5848f227cc161eb5f68dfe98cb13110a9c843ce69e953a88107d865583d397",
  },
];

export function getStoredUsers() {
  try {
    const saved = localStorage.getItem(USERS_STORAGE_KEY);
    const customUsers = saved ? JSON.parse(saved) : [];
    return [...DEFAULT_USERS, ...customUsers];
  } catch (error) {
    console.error("Error reading stored users:", error);
    return DEFAULT_USERS;
  }
}

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
  const allUsers = getStoredUsers();
  const user = allUsers.find(
    (u) => u.email.toLowerCase() === normalizedEmail,
  );

  if (!user) {
    throw new Error("No account found with this email address.");
  }

  const computedHash = await hashPassword(password);
  
  // Check either hashed password match or plain password match for default accounts
  const isMatch =
    computedHash === user.passwordHash ||
    (user.plainPassword && password === user.plainPassword);

  if (!isMatch) {
    throw new Error("Invalid password. Please try again.");
  }

  const sessionUser = {
    email: user.email,
    name: user.name,
    role: user.role || "user",
    loggedInAt: new Date().toISOString(),
  };

  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser));
  return sessionUser;
}

export async function signup({ name, email, password, role = "user" }) {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedName = name.trim();

  if (!normalizedName || !normalizedEmail || !password) {
    throw new Error("Please fill in all required fields.");
  }

  // Check if email already exists
  const allUsers = getStoredUsers();
  const existingUser = allUsers.find(
    (u) => u.email.toLowerCase() === normalizedEmail,
  );

  if (existingUser) {
    throw new Error("An account with this email address already exists.");
  }

  // Validate password strength
  const validation = validatePassword(password);
  if (!validation.isValid) {
    throw new Error(
      `Password is not strong enough! Missing requirements:\n- ${validation.errors.join("\n- ")}`,
    );
  }

  const passwordHash = await hashPassword(password);
  const newUser = {
    email: normalizedEmail,
    name: normalizedName,
    role: role,
    passwordHash: passwordHash,
    createdAt: new Date().toISOString(),
  };

  // Save to stored custom users
  try {
    const saved = localStorage.getItem(USERS_STORAGE_KEY);
    const customUsers = saved ? JSON.parse(saved) : [];
    customUsers.push(newUser);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(customUsers));
  } catch (error) {
    console.error("Error saving new user:", error);
    throw new Error("Failed to create account. Please try again.");
  }

  // Automatically log in newly signed up user
  const sessionUser = {
    email: newUser.email,
    name: newUser.name,
    role: newUser.role,
    loggedInAt: new Date().toISOString(),
  };

  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser));
  return sessionUser;
}

export function logout() {
  localStorage.removeItem(CURRENT_USER_KEY);
}
