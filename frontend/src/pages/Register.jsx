import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { auth, googleProvider } from "../firebase";
import { signInWithPopup } from "firebase/auth";

const API = import.meta.env.VITE_API_URL;

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      return setError("Please fill in all fields");
    }
    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }
    if (password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) return setError(data.message);

      // Auto-login successful
      login({ name: data.name, role: data.role, photo: data.photo }, data.accessToken);
      navigate("/");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const { displayName, email: gEmail, photoURL } = result.user;

      // Sync with our backend
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
      setError("Google registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fff8f3] py-12 px-4">
      <div className="bg-white p-10 rounded-3xl shadow-md w-full max-w-md">
        <h1 className="text-3xl font-black text-gray-900 mb-2 text-center">Join Us 🚀</h1>
        <p className="text-gray-400 text-sm mb-8 text-center">Create your account for FoodDelish</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-5 animate-pulse">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-orange-400 transition"
          />
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-orange-400 transition"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-orange-400 transition"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 mb-2 outline-none focus:border-orange-400 transition"
          />
        </div>

        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full bg-[rgb(252,90,9)] text-white py-3 mt-6 rounded-2xl font-bold text-lg mb-4 disabled:opacity-60 transition hover:bg-orange-600 shadow-lg shadow-orange-200"
        >
          {loading ? "Creating account…" : "Register"}
        </button>

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-gray-400 text-xs uppercase font-bold">OR</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        <button
          onClick={handleGoogleRegister}
          disabled={loading}
          className="w-full border border-gray-300 py-3 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-gray-50 transition disabled:opacity-60"
        >
          <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
          Sign up with Google
        </button>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <span
            className="text-[rgb(252,90,9)] font-bold cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Log in
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;