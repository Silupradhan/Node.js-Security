const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

async function request(path, body) {
  let response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body)
    });
  } catch {
    throw new Error("Unable to reach the server. Is the backend running?");
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message ?? "Something went wrong. Please try again.");
  }

  return data;
}

async function get(path) {
  let response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      method: "GET",
      credentials: "include"
    });
  } catch {
    throw new Error("Unable to reach the server. Is the backend running?");
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message ?? "Something went wrong. Please try again.");
  }

  return data;
}

export function login(email, password) {
  return request("/api/auth/login", { email, password });
}

export function getCurrentUser() {
  return get("/api/auth/me");
}

export function register(name, email, password) {
  return request("/api/auth/register", {
    name,
    email,
    password
  });
}
