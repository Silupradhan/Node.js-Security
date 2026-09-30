function Dashboard({ user, onLogout }) {
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
