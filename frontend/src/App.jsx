import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";

const SESSION_KEY = "securely-session";

function getStoredSession() {
  try {
    const value = localStorage.getItem(SESSION_KEY);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

function App() {
  const [session, setSession] = useState(getStoredSession);
  const [page, setPage] = useState(
    window.location.pathname === "/dashboard" || Boolean(getStoredSession())
      ? "dashboard"
      : "login"
  );

  function handleLogin(nextSession) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(nextSession));
    setSession(nextSession);
    window.history.pushState({}, "", "/dashboard");
    setPage("dashboard");
  }

  function handleLogout() {
    localStorage.removeItem(SESSION_KEY);
    setSession(null);
    window.history.pushState({}, "", "/");
    setPage("login");
  }

  if (session && page === "dashboard") {
    return <Dashboard user={session.user} onLogout={handleLogout} />;
  }

  return (
    <main className="auth-layout">
      <section className="brand-panel">
        <div className="brand-mark">S</div>
        <p className="eyebrow">SECURITY FIRST</p>
        <h1>Everything you need, protected.</h1>
        <p className="brand-copy">
          A simple, secure home for your account and the work that matters to
          you.
        </p>
        <div className="security-note">
          <span className="shield-icon">✓</span>
          <span>Your data is protected with every request.</span>
        </div>
      </section>
      <section className="form-panel">
        <div className="form-shell">
          {page === "login" ? (
            <Login
              onLogin={handleLogin}
              onRegister={() => setPage("register")}
            />
          ) : (
            <Register
              onRegistered={() => setPage("login")}
              onLogin={() => setPage("login")}
            />
          )}
        </div>
      </section>
    </main>
  );
}

export default App;
