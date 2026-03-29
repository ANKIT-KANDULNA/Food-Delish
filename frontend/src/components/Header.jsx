import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Header() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef();

    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target))
                setDropdownOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <header className="flex justify-between items-center p-9 bg-[rgb(252,90,9)] text-white">
            <Link to="/">
                <h1 className="text-3xl font-extrabold tracking-wide">FOOD DELiSH</h1>
            </Link>

            <div className="flex gap-10 items-center text-lg">
                <nav className="flex gap-8">
                    <Link to="/menu" className="relative group px-1 py-1">
                        <span className="transition group-hover:text-yellow-200">Menu</span>
                        <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-yellow-200 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                    <Link to="/birthday" className="relative group px-1 py-1">
                        <span className="transition group-hover:text-yellow-200">Birthday Party</span>
                        <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-yellow-200 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                    <Link to="/careers" className="relative group px-1 py-1">
                        <span className="transition group-hover:text-yellow-200">Careers</span>
                        <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-yellow-200 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                    <Link to="/about" className="relative group px-1 py-1">
                        <span className="transition group-hover:text-yellow-200">About</span>
                        <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-yellow-200 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                </nav>

                <span className="text-white/50">|</span>

                {user ? (
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center gap-2 hover:opacity-80 transition">
                            {user.photo
                                ? <img src={user.photo} className="w-8 h-8 rounded-full" />
                                : <div className="w-8 h-8 rounded-full bg-white text-[rgb(252,90,9)] font-bold flex items-center justify-center">
                                    {user.name?.charAt(0).toUpperCase()}
                                  </div>
                            }
                            <span className="font-medium">Hi, {user.name} 👋</span>
                        </button>

                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-2xl shadow-lg z-50 overflow-hidden">
                                <div className="px-4 py-3 border-b">
                                    <p className="font-semibold">{user.name}</p>
                                    <p className="text-sm text-gray-400">{user.email}</p>
                                </div>
                                <Link to="/profile"
                                    className="block px-4 py-3 hover:bg-gray-50 transition"
                                    onClick={() => setDropdownOpen(false)}>
                                    👤 My Profile
                                </Link>
                                <Link to="/orders"
                                    className="block px-4 py-3 hover:bg-gray-50 transition"
                                    onClick={() => setDropdownOpen(false)}>
                                    🧾 My Orders
                                </Link>
                                <button onClick={handleLogout}
                                    className="w-full text-left px-4 py-3 text-red-500 hover:bg-red-50 transition">
                                    🚪 Logout
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <nav className="flex gap-4">
                        <Link to="/register" className="px-4 py-1 rounded-full bg-white text-[rgb(252,90,9)] font-medium hover:scale-105 transition">
                            Register
                        </Link>
                        <Link to="/login" className="px-4 py-1 rounded-full border border-white hover:bg-white hover:text-[rgb(252,90,9)] transition">
                            Login
                        </Link>
                    </nav>
                )}
            </div>
        </header>
    );
}

export default Header;