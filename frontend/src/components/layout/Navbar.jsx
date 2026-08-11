import { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth.js";

function Navbar() {
  const { currentUser, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Ensure dark mode attribute is removed completely for warm light mode
    document.documentElement.removeAttribute("data-theme");
  }, []);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="app-header">
      <div className="app-header__inner">
        <NavLink to="/products" className="brand">
          StockFlow
        </NavLink>

        <nav className="primary-nav" aria-label="Primary navigation">
          <NavLink
            to="/products"
            className={({ isActive }) =>
              isActive
                ? "primary-nav__link primary-nav__link--active"
                : "primary-nav__link"
            }
          >
            Products
          </NavLink>

          <NavLink
            to="/suppliers"
            className={({ isActive }) =>
              isActive
                ? "primary-nav__link primary-nav__link--active"
                : "primary-nav__link"
            }
          >
            Suppliers
          </NavLink>

          {/* Logged in User Badge */}
          {currentUser && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "4px 10px",
                borderRadius: "9999px",
                backgroundColor: isAdmin
                  ? "rgba(79, 70, 229, 0.08)"
                  : "var(--navbar-hover)",
                border: `1px solid ${
                  isAdmin ? "rgba(79, 70, 229, 0.25)" : "var(--border)"
                }`,
                fontSize: "0.78rem",
                fontWeight: "600",
              }}
            >
              <span style={{ color: "var(--text-main)" }}>
                {currentUser.name || currentUser.email}
              </span>
              <span
                style={{
                  padding: "2px 6px",
                  borderRadius: "4px",
                  fontSize: "0.7rem",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  backgroundColor: isAdmin ? "var(--primary)" : "#64748b",
                  color: "#ffffff",
                }}
              >
                {isAdmin ? "Admin" : "User"}
              </span>
            </div>
          )}

          <button
            className="button button--secondary button--small"
            type="button"
            onClick={handleLogout}
          >
            Log out
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
