import { useState } from "react";
import { register } from "../api";

function Register({ onRegistered, onLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);
    try {
      const response = await register(name, email, password);
      setSuccess(`${response.message}. You can now sign in.`);
      setName("");
      setEmail("");
      setPassword("");
      window.setTimeout(onRegistered, 900);
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : "Unable to create account."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div className="form-heading">
        <p className="eyebrow accent">GET STARTED</p>
        <h2>Create your account</h2>
        <p>Join us in a few quick steps.</p>
      </div>
      <form onSubmit={handleSubmit} className="auth-form">
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        <label>
          Full name
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Alex Morgan"
            autoComplete="name"
            required
          />
        </label>
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
            placeholder="At least 6 characters"
            autoComplete="new-password"
            minLength={6}
            required
          />
        </label>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating account..." : "Create account"}
        </button>
      </form>
      <p className="form-switch">
        Already have an account?{" "}
        <button type="button" className="text-button" onClick={onLogin}>
          Sign in
        </button>
      </p>
    </>
  );
}

export default Register;
