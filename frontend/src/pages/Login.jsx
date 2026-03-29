import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) return setError(data.message);
      login({ name: data.name }, data.token);
      navigate("/");
    } catch {
      setError("Something went wrong");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      login({ name: user.displayName, email: user.email, photo: user.photoURL }, user.accessToken);
      navigate("/");
    } catch {
      setError("Google login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fff8f3]">
      <div className="bg-white p-10 rounded-3xl shadow-md w-full max-w-md">
        <h1 className="text-3xl font-black text-gray-900 mb-8">Login</h1>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 mb-4 outline-none"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 mb-6 outline-none"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-[rgb(252,90,9)] text-white py-3 rounded-2xl font-bold text-lg mb-4"
        >
          Login
        </button>

        <button
          onClick={handleGoogleLogin}
          className="w-full border border-gray-300 py-3 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-gray-50 transition"
        >
          <img src="https://www.google.com/favicon.ico" className="w-5 h-5" />
          Continue with Google
        </button>

        <p className="text-center text-sm text-gray-400 mt-4">
          Account nahi hai?{" "}
          <span
            className="text-[rgb(252,90,9)] font-semibold cursor-pointer"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;