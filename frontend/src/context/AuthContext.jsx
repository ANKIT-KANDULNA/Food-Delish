import { createContext, useContext, useState, useCallback } from "react";

const AuthContext = createContext();
const API = import.meta.env.VITE_API_URL;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user")); } catch { return null; }
  });
  const [accessToken, setAccessToken] = useState(
    () => sessionStorage.getItem("accessToken") || null
  );

  // Called after login/register API call returns tokens
  const login = useCallback((userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData));
    sessionStorage.setItem("accessToken", token);
    setUser(userData);
    setAccessToken(token);
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch(`${API}/api/auth/logout`, {
        method: "POST",
        credentials: "include", // sends the refresh-token cookie
      });
    } catch { /* best-effort */ }
    localStorage.removeItem("user");
    sessionStorage.removeItem("accessToken");
    setUser(null);
    setAccessToken(null);
  }, []);

  // Silently get a fresh access token using the HttpOnly refresh cookie
  const refreshAccessToken = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Refresh failed");
      const data = await res.json();
      sessionStorage.setItem("accessToken", data.accessToken);
      setAccessToken(data.accessToken);
      return data.accessToken;
    } catch {
      // Refresh token expired — force logout
      logout();
      return null;
    }
  }, [logout]);

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout, refreshAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}