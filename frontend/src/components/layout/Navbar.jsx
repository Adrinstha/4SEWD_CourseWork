import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth.js";

function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("stockflow_theme") || "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("stockflow_theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }

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

          <button
            className="button button--secondary button--small"
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={`Switch to ${theme === "light" ? "Dark" : "Light"} mode`}
          >
            {theme === "light" ? "🌙 Dark" : "☀️ Light"}
          </button>

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
