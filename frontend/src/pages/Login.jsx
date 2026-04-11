import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";

const API = import.meta.env.VITE_API_URL ?? "";

function Login() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) return setError("Please fill in all fields");
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",          // receive HttpOnly refresh cookie
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.message);
      login({ name: data.name, role: data.role, photo: data.photo }, data.accessToken);
      navigate("/");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const { displayName, email: gEmail, photoURL } = result.user;

      // Sync with our backend to get our own JWT pair
      const res = await fetch(`${API}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: displayName, email: gEmail, photo: photoURL }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.message);
      login({ name: data.name, role: data.role, photo: data.photo }, data.accessToken);
      navigate("/");
    } catch {
      setError("Google login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fff8f3]">
      <div className="bg-white p-10 rounded-3xl shadow-md w-full max-w-md">
        <h1 className="text-3xl font-black text-gray-900 mb-2">Welcome back 👋</h1>
        <p className="text-gray-400 text-sm mb-8">Log in to continue to FoodDelish</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-5">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleLogin()}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 mb-4 outline-none focus:border-orange-400 transition"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleLogin()}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 mb-6 outline-none focus:border-orange-400 transition"
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-[rgb(252,90,9)] text-white py-3 rounded-2xl font-bold text-lg mb-4 disabled:opacity-60 transition hover:bg-orange-600"
        >
          {loading ? "Logging in…" : "Login"}
        </button>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full border border-gray-300 py-3 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-gray-50 transition disabled:opacity-60"
        >
          <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
          Continue with Google
        </button>

        <p className="text-center text-sm text-gray-400 mt-5">
          No account?{" "}
          <span
            className="text-[rgb(252,90,9)] font-semibold cursor-pointer"
            onClick={() => navigate("/register")}
          >
            Register here
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;