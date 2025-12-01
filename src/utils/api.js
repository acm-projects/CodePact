// src/utils/api.js

const API_BASE = "http://localhost:3000";

/**
 * Request wrapper
 */
async function request(url, method = "GET", body) {
  const options = {
    method,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const res = await fetch(`${API_BASE}${url}`, options);

    let data = null;
    try {
      data = await res.json();
    } catch {
      // If JSON fails, data stays null
    }

    return {
      ok: res.ok,
      status: res.status,
      data,
      error: !res.ok ? (data?.message || "Server error") : null,
    };
  } catch (err) {
    return {
      ok: false,
      status: 0,
      data: null,
      error: err.message || "Network error",
    };
  }
}

/**
 * AUTH API
 */
export const authAPI = {
  signup: (body) => request("/api/signup", "POST", body),
  login: (body) => request("/api/signin", "POST", body),
  logout: () => request("/api/logout", "POST"),
  me: () => request("/api/auth/me", "GET"),
};

/**
 * GROUP/SQUAD API (placeholder for later)
 */
export const groupAPI = {
  // add real functions 
};

/**
 * AI API — placeholder only
 * Prevents app from crashing if imported.
 */
export const aiAPI = {
  sendPrompt: async () => ({
    ok: false,
    data: null,
    error: "AI interviewer not implemented yet.",
  }),
};
