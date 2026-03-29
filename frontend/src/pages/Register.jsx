import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (!res.ok) return setError(data.message);

      navigate("/login");

    } catch {
      setError("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fff8f3]">
      <div className="bg-white p-10 rounded-3xl shadow-md w-full max-w-md">
        <h1 className="text-3xl font-black text-gray-900 mb-8">Register</h1>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {["name", "email", "password"].map(field => (
          <input
            key={field}
            type={field === "password" ? "password" : "text"}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={form[field]}
            onChange={e => setForm({ ...form, [field]: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 mb-4 outline-none"
          />
        ))}

        <button
          onClick={handleRegister}
          className="w-full bg-[rgb(252,90,9)] text-white py-3 rounded-2xl font-bold text-lg"
        >
          Register
        </button>

        <p className="text-center text-sm text-gray-400 mt-4">
          Already registered?{" "}
          <span
            className="text-[rgb(252,90,9)] font-semibold cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;