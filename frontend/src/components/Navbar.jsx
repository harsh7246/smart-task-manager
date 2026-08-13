import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-semibold text-lg text-primary-600 dark:text-primary-500">
          Smart Task Manager
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            className="text-sm px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Toggle dark mode"
          >
            {dark ? "☀️ Light" : "🌙 Dark"}
          </button>
          {user && (
            <>
              <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:inline">
                {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm px-3 py-1.5 rounded-lg bg-gray-900 dark:bg-primary-600 text-white hover:opacity-90"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
