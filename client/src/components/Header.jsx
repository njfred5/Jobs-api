import { useAuth } from "../context/AuthContext.jsx";

export default function Header({ view, setView, savedCount, onLogin, theme, toggleTheme }) {
  const { user, logout } = useAuth();

  return (
    <header className="header">
      <h1>🌍 Remote Jobs</h1>
      <nav>
        <button className={view === "search" ? "tab active" : "tab"} onClick={() => setView("search")}>
          Search
        </button>
        <button
          className={view === "saved" ? "tab active" : "tab"}
          onClick={() => (user ? setView("saved") : onLogin())}
        >
          Saved {user && <span className="badge">{savedCount}</span>}
        </button>
      </nav>
      <div className="header-actions">
        <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle dark mode">
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
        {user ? (
          <>
            <span className="muted">Hi, {user.name}</span>
            <button className="btn ghost" onClick={logout}>Log out</button>
          </>
        ) : (
          <button className="btn" onClick={onLogin}>Log in</button>
        )}
      </div>
    </header>
  );
}
