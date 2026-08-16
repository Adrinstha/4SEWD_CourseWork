import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";

function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleLoginSubmit(event) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!identifier.trim() || !password) {
      setErrorMessage("Please enter your username/email and password.");
      return;
    }

    try {
      setIsSubmitting(true);
      await login(identifier.trim(), password);
      navigate("/products");
    } catch (error) {
      setErrorMessage(error.message || "Failed to sign in.");
    } finally {
      setIsSubmitting(false);
    }
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
          <p className="desc" style={{ marginBottom: "0.5rem" }}>
            Inventory Management System
          </p>
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
        <form onSubmit={handleLoginSubmit}>
          <div className="group">
            <label htmlFor="login-identifier">
              Username or Email <span className="required">*</span>
            </label>
            <input
              id="login-identifier"
              className="input"
              type="text"
              placeholder="Username or email"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
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
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
