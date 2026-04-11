/**
 * api.js — Authenticated fetch wrapper with automatic refresh-token retry
 *
 * Usage: import { apiFetch } from "../utils/api";
 *        const data = await apiFetch("/api/orders/my");
 */

const API_BASE = import.meta.env.VITE_API_URL ?? "";

// We store a reference to the AuthContext helpers outside React
// so this module can call them without prop-drilling.
let _getAccessToken = () => sessionStorage.getItem("accessToken");
let _refreshAccessToken = async () => null;
let _logout = () => {};

export function initApiAuth({ getAccessToken, refreshAccessToken, logout }) {
  _getAccessToken = getAccessToken;
  _refreshAccessToken = refreshAccessToken;
  _logout = logout;
}

export async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;

  const makeHeaders = (token) => ({
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  });

  let token = _getAccessToken();

  let res = await fetch(url, {
    ...options,
    credentials: "include",
    headers: makeHeaders(token),
  });

  // If access token expired, try refreshing once
  if (res.status === 401) {
    token = await _refreshAccessToken();
    if (!token) { _logout(); return null; }

    res = await fetch(url, {
      ...options,
      credentials: "include",
      headers: makeHeaders(token),
    });
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Request failed" }));
    throw new Error(err.message || "Request failed");
  }

  return res.json();
}
