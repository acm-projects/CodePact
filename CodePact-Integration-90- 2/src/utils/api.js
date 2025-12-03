// src/utils/api.js

const API_BASE = "http://localhost:3000";

async function request(url, method = "GET", body) {
  const options = {
    method,
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(url, options);

  let data = null;
  try {
    data = await res.json();
  } catch {}

  return {
    ok: res.ok,
    status: res.status,
    data,
    error: !res.ok ? "Server error" : null,
  };
}

/* ===========================
   AUTH API  (matches server.js)
   =========================== */
export const authAPI = {
  signup: (data) => request(`${API_BASE}/signup`, "POST", data),
  login: (data) => request(`${API_BASE}/signin`, "POST", data),
  me: () => request(`${API_BASE}/getUserDetails`),
};

/* ===========================
   GROUP API  (your Squads.jsx needs this)
   matches GroupController routes in server.js
   =========================== */
export const groupAPI = {
  addGroup: ({ name, members }) =>
    request(
      `${API_BASE}/addGroupData?name=${encodeURIComponent(name)}&members=${members ?? 0}`
    ),

  getGroupList: () => request(`${API_BASE}/getGroupList`),

  getMembers: ({ groupName }) =>
    request(
      `${API_BASE}/getMembers?groupName=${encodeURIComponent(groupName)}`
    ),

  findGroupByCode: ({ code }) =>
    request(`${API_BASE}/findCodeGroup?code=${encodeURIComponent(code)}`),

  getGroupCode: ({ groupName }) =>
    request(
      `${API_BASE}/getGroupCode?groupName=${encodeURIComponent(groupName)}`
    ),
};

/* ===========================
   AI API (placeholder so imports stop failing)
   =========================== */
export const aiAPI = {
  chat: async () => ({
    ok: false,
    error: "AI API not implemented in local mode",
  }),
};
