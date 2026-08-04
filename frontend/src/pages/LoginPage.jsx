import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";

function LoginPage() {
  const [email, setEmail] = useState("adrinshrestha16@gmail.com");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");

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

  return (
    <div className="container small" style={{ marginTop: "4rem" }}>
      <div className="card">
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: "700",
              color: "var(--primary)",
              marginBottom: "0.25rem",
            }}
          >
            StockFlow
          </h1>
          <p className="desc" style={{ marginBottom: 0 }}>
            Sign in to access your inventory dashboard
          </p>
        </div>

        {errorMessage && (
          <div
            className="alert alert--error"
            role="alert"
            style={{ marginBottom: "1.25rem" }}
          >
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="group">
            <label htmlFor="login-email">
              Email Address <span className="required">*</span>
            </label>
            <input
              id="login-email"
              className="input"
              type="email"
              placeholder="admin@example.com"
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
              className="btn primary"
              type="submit"
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
