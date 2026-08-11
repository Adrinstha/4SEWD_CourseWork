import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";
import { validatePassword } from "../utils/passwordValidation.js";

function LoginPage() {
  const [activeTab, setActiveTab] = useState("login"); // 'login' | 'signup'

  // Login form state
  const [email, setEmail] = useState("admin@stockflow.com");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // Signup form state
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, signup } = useAuth();
  const navigate = useNavigate();

  // Password validation analysis for real-time strength meter
  const pwdValidation = validatePassword(signupPassword);

  async function handleLoginSubmit(event) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!email.trim() || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    try {
      setIsSubmitting(true);
      await login(email, password);
      navigate("/products");
    } catch (error) {
      setErrorMessage(error.message || "Failed to sign in.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSignupSubmit(event) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!signupName.trim() || !signupEmail.trim() || !signupPassword) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      setErrorMessage("Passwords do not match. Please re-enter passwords.");
      return;
    }

    // Check password strength validation
    if (!pwdValidation.isValid) {
      setErrorMessage(
        "Password is not strong enough! Please fulfill all password requirements below before signing up.",
      );
      return;
    }

    try {
      setIsSubmitting(true);
      await signup({
        name: signupName,
        email: signupEmail,
        password: signupPassword,
      });
      setSuccessMessage("Account created successfully! Redirecting...");
      setTimeout(() => {
        navigate("/products");
      }, 800);
    } catch (error) {
      setErrorMessage(error.message || "Failed to create account.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleFillDemoCredentials(demoEmail, demoPwd) {
    setEmail(demoEmail);
    setPassword(demoPwd);
    setErrorMessage("");
  }

  return (
    <div className="container small" style={{ marginTop: "3rem", marginBottom: "3rem" }}>
      <div className="card">
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <h1
            style={{
              fontSize: "2.25rem",
              fontWeight: "800",
              color: "var(--primary)",
              marginBottom: "0.25rem",
              letterSpacing: "-0.03em",
            }}
          >
            StockFlow
          </h1>
          <p className="desc" style={{ marginBottom: "1rem" }}>
            Inventory Management System
          </p>

          {/* Login / Signup Tabs */}
          <div
            style={{
              display: "inline-flex",
              backgroundColor: "var(--background)",
              padding: "4px",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border)",
              width: "100%",
              maxWidth: "320px",
            }}
          >
            <button
              type="button"
              onClick={() => {
                setActiveTab("login");
                setErrorMessage("");
                setSuccessMessage("");
              }}
              style={{
                flex: 1,
                padding: "8px 16px",
                border: "none",
                borderRadius: "var(--radius-sm)",
                fontSize: "0.9rem",
                fontWeight: "600",
                cursor: "pointer",
                backgroundColor: activeTab === "login" ? "#ffffff" : "transparent",
                color: activeTab === "login" ? "var(--primary)" : "var(--text-muted)",
                boxShadow: activeTab === "login" ? "var(--shadow-sm)" : "none",
                transition: "var(--transition)",
              }}
            >
              Sign In
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("signup");
                setErrorMessage("");
                setSuccessMessage("");
              }}
              style={{
                flex: 1,
                padding: "8px 16px",
                border: "none",
                borderRadius: "var(--radius-sm)",
                fontSize: "0.9rem",
                fontWeight: "600",
                cursor: "pointer",
                backgroundColor: activeTab === "signup" ? "#ffffff" : "transparent",
                color: activeTab === "signup" ? "var(--primary)" : "var(--text-muted)",
                boxShadow: activeTab === "signup" ? "var(--shadow-sm)" : "none",
                transition: "var(--transition)",
              }}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Global Error & Success Banners */}
        {errorMessage && (
          <div
            className="alert alert--error"
            role="alert"
            style={{
              marginBottom: "1.25rem",
              backgroundColor: "var(--danger-light)",
              color: "var(--danger)",
              border: "1px solid rgba(225, 29, 72, 0.3)",
              padding: "0.75rem 1rem",
              borderRadius: "var(--radius-sm)",
              fontSize: "0.875rem",
              whiteSpace: "pre-line",
            }}
          >
            ⚠️ {errorMessage}
          </div>
        )}

        {successMessage && (
          <div
            className="alert alert--success"
            role="status"
            style={{
              marginBottom: "1.25rem",
              backgroundColor: "var(--success-light)",
              color: "var(--success)",
              border: "1px solid rgba(13, 148, 136, 0.3)",
              padding: "0.75rem 1rem",
              borderRadius: "var(--radius-sm)",
              fontSize: "0.875rem",
            }}
          >
            ✓ {successMessage}
          </div>
        )}

        {/* LOGIN FORM */}
        {activeTab === "login" && (
          <form onSubmit={handleLoginSubmit}>
            <div className="group">
              <label htmlFor="login-email">
                Email Address <span className="required">*</span>
              </label>
              <input
                id="login-email"
                className="input"
                type="email"
                placeholder="e.g. admin@stockflow.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="group">
              <label htmlFor="login-password">
                Password <span className="required">*</span>
              </label>
              <input
                id="login-password"
                className="input"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="group">
              <label
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontWeight: "normal",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember me
              </label>
            </div>

            <div className="footer">
              <button
                className="button button--primary"
                type="submit"
                style={{ width: "100%" }}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing in..." : "Login"}
              </button>
            </div>

            {/* Quick Credentials Demo Box */}
            <div
              style={{
                marginTop: "1.5rem",
                padding: "1rem",
                backgroundColor: "var(--background)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border)",
                fontSize: "0.825rem",
              }}
            >
              <p
                style={{
                  fontWeight: "700",
                  marginBottom: "0.5rem",
                  color: "var(--text-main)",
                }}
              >
                🔑 Quick Demo Credentials:
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  flexWrap: "wrap",
                }}
              >
                <button
                  type="button"
                  className="button button--secondary button--small"
                  onClick={() =>
                    handleFillDemoCredentials("admin@stockflow.com", "Admin123!")
                  }
                  title="Full access (Add, Edit, Delete products)"
                >
                  Fill Admin (`Admin123!`)
                </button>

                <button
                  type="button"
                  className="button button--secondary button--small"
                  onClick={() =>
                    handleFillDemoCredentials("user@stockflow.com", "User123!")
                  }
                  title="Read-only access (View products only)"
                >
                  Fill User (`User123!`)
                </button>
              </div>
            </div>
          </form>
        )}

        {/* SIGNUP FORM */}
        {activeTab === "signup" && (
          <form onSubmit={handleSignupSubmit}>
            <div className="group">
              <label htmlFor="signup-name">
                Full Name <span className="required">*</span>
              </label>
              <input
                id="signup-name"
                className="input"
                type="text"
                placeholder="Enter your full name"
                value={signupName}
                onChange={(e) => setSignupName(e.target.value)}
                required
              />
            </div>

            <div className="group">
              <label htmlFor="signup-email">
                Email Address <span className="required">*</span>
              </label>
              <input
                id="signup-email"
                className="input"
                type="email"
                placeholder="Enter your email address"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                required
              />
            </div>

            <div className="group">
              <label htmlFor="signup-password">
                Password <span className="required">*</span>
              </label>
              <input
                id="signup-password"
                className="input"
                type="password"
                placeholder="Create a strong password"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                required
              />

              {/* Password Strength Indicator */}
              {signupPassword.length > 0 && (
                <div style={{ marginTop: "0.75rem" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "0.35rem",
                      fontSize: "0.75rem",
                    }}
                  >
                    <span style={{ color: "var(--text-muted)" }}>
                      Password Strength:
                    </span>
                    <span
                      style={{
                        fontWeight: "700",
                        textTransform: "uppercase",
                        color:
                          pwdValidation.strength === "strong"
                            ? "var(--success)"
                            : pwdValidation.strength === "medium"
                            ? "#d97706"
                            : "var(--danger)",
                      }}
                    >
                      {pwdValidation.strength}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div
                    style={{
                      height: "6px",
                      width: "100%",
                      backgroundColor: "var(--border)",
                      borderRadius: "3px",
                      overflow: "hidden",
                      marginBottom: "0.75rem",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${(pwdValidation.metCount / pwdValidation.totalCount) * 100}%`,
                        backgroundColor:
                          pwdValidation.strength === "strong"
                            ? "var(--success)"
                            : pwdValidation.strength === "medium"
                            ? "#f59e0b"
                            : "var(--danger)",
                        transition: "all 0.3s ease",
                      }}
                    />
                  </div>

                  {/* Requirements Checklist */}
                  <ul
                    style={{
                      listStyle: "none",
                      padding: 0,
                      margin: 0,
                      fontSize: "0.78rem",
                      display: "grid",
                      gap: "0.25rem",
                    }}
                  >
                    {pwdValidation.requirements.map((req) => (
                      <li
                        key={req.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.35rem",
                          color: req.isMet
                            ? "var(--success)"
                            : "var(--text-muted)",
                          fontWeight: req.isMet ? "600" : "normal",
                        }}
                      >
                        <span>{req.isMet ? "✓" : "○"}</span>
                        <span>{req.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="group">
              <label htmlFor="signup-confirm-password">
                Confirm Password <span className="required">*</span>
              </label>
              <input
                id="signup-confirm-password"
                className="input"
                type="password"
                placeholder="Confirm your password"
                value={signupConfirmPassword}
                onChange={(e) => setSignupConfirmPassword(e.target.value)}
                required
              />
              {signupConfirmPassword.length > 0 &&
                signupPassword !== signupConfirmPassword && (
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--danger)",
                      marginTop: "0.35rem",
                    }}
                  >
                    ✖ Passwords do not match
                  </p>
                )}
            </div>

            <div className="footer">
              <button
                className="button button--primary"
                type="submit"
                style={{ width: "100%" }}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating Account..." : "Sign Up"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default LoginPage;
