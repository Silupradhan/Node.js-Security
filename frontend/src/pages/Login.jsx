import { useState } from "react";
import { login } from "../api";

function Login({ onLogin, onRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const response = await login(email, password);
      onLogin({ token: response.token, user: response.user });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to log in.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div className="form-heading">
        <p className="eyebrow accent">WELCOME BACK</p>
        <h2>Sign in to your account</h2>
        <p>Enter your details to continue.</p>
      </div>
      <form onSubmit={handleSubmit} className="auth-form">
        {error && <div className="error-message">{error}</div>}
        <label>
          Email address
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            autoComplete="current-password"
            minLength={6}
            required
          />
        </label>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>
      </form>
      <p className="form-switch">
        Don&apos;t have an account?{" "}
        <button type="button" className="text-button" onClick={onRegister}>
          Create one
        </button>
      </p>
    </>
  );
}

export default Login;
