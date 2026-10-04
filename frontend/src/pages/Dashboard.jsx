import { useEffect, useState } from "react";
import { getCurrentUser } from "../api";

function Dashboard({ user: initialUser, onLogout }) {
  const [user, setUser] = useState(initialUser);
  const [error, setError] = useState("");

  useEffect(() => {
    let isCurrent = true;

    getCurrentUser()
      .then((response) => {
        if (isCurrent) {
          setUser(response.user);
        }
      })
      .catch((reason) => {
        if (isCurrent) {
          setError(
            reason instanceof Error
              ? reason.message
              : "Unable to load your account."
          );
        }
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  if (error) {
    return (
      <main className="dashboard-layout">
        <section className="dashboard-content">
          <div className="error-message">{error}</div>
          <button type="button" className="logout-button" onClick={onLogout}>
            Return to sign in
          </button>
        </section>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="dashboard-layout">
        <section className="dashboard-content">
          <p>Loading your account...</p>
        </section>
      </main>
    );
  }

  return (
    <main className="dashboard-layout">
      <nav className="topbar">
        <div className="nav-brand">
          <span className="brand-mark small">S</span>
          <span>securely</span>
        </div>
        <button type="button" className="logout-button" onClick={onLogout}>
          Log out
        </button>
      </nav>
      <section className="dashboard-content">
        <p className="eyebrow accent">YOUR WORKSPACE</p>
        <h1>Good to see you, {user.name.split(" ")[0]}.</h1>
        <p className="dashboard-intro">
          Your account is ready. Here&apos;s a quick overview of your secure
          workspace.
        </p>
        <div className="dashboard-grid">
          <article className="profile-card">
            <div className="avatar">{user.name.charAt(0).toUpperCase()}</div>
            <div>
              <p className="card-label">SIGNED IN AS</p>
              <h2>{user.name}</h2>
              <p>{user.email}</p>
            </div>
            <span className="role-badge">{user.role}</span>
          </article>
          <article className="status-card">
            <span className="status-icon">✓</span>
            <div>
              <p className="card-label">ACCOUNT STATUS</p>
              <h2>Protected</h2>
              <p>Your session is active and secure.</p>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}

export default Dashboard;
