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

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="flex flex-col md:flex-row justify-between items-center p-4 md:p-9 bg-[rgb(252,90,9)] text-white relative">
            <div className="flex justify-between w-full md:w-auto items-center">
                <Link to="/">
                    <h1 className="text-2xl md:text-3xl font-extrabold tracking-wide">FOOD DELiSH</h1>
                </Link>
                <button 
                    className="md:hidden text-white focus:outline-none" 
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
                    </svg>
                </button>
            </div>

            <div className={`${mobileMenuOpen ? "flex" : "hidden"} md:flex flex-col md:flex-row gap-6 md:gap-10 mt-6 md:mt-0 items-center text-lg w-full md:w-auto transition-all`}>
                <nav className="flex flex-col md:flex-row gap-4 md:gap-8 w-full md:w-auto text-center md:text-left">
                    <Link to="/menu" className="relative group px-1 py-1" onClick={() => setMobileMenuOpen(false)}>
                        <span className="transition group-hover:text-yellow-200">Menu</span>
                        <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-yellow-200 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                    <Link to="/birthday" className="relative group px-1 py-1" onClick={() => setMobileMenuOpen(false)}>
                        <span className="transition group-hover:text-yellow-200">Birthday Party</span>
                        <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-yellow-200 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                    <Link to="/careers" className="relative group px-1 py-1" onClick={() => setMobileMenuOpen(false)}>
                        <span className="transition group-hover:text-yellow-200">Careers</span>
                        <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-yellow-200 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                    <Link to="/about" className="relative group px-1 py-1" onClick={() => setMobileMenuOpen(false)}>
                        <span className="transition group-hover:text-yellow-200">About</span>
                        <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-yellow-200 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                </nav>

                <span className="hidden md:block text-white/50">|</span>
                <div className="w-full md:w-auto h-px bg-white/20 md:hidden my-2"></div>

                {user ? (
                    <div className="relative w-full md:w-auto" ref={dropdownRef}>
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center justify-center md:justify-start gap-2 hover:opacity-80 transition w-full md:w-auto">
                            {user.photo
                                ? <img src={user.photo} className="w-8 h-8 rounded-full" />
                                : <div className="w-8 h-8 rounded-full bg-white text-[rgb(252,90,9)] font-bold flex items-center justify-center">
                                    {user.name?.charAt(0).toUpperCase()}
                                  </div>
                            }
                            <span className="font-medium">Hi, {user.name} 👋</span>
                        </button>

                        {dropdownOpen && (
                            <div className="absolute right-0 md:right-0 left-0 md:left-auto mt-2 w-full md:w-48 bg-white text-gray-800 rounded-2xl shadow-lg z-50 overflow-hidden text-center md:text-left">
                                <div className="px-4 py-3 border-b">
                                    <p className="font-semibold">{user.name}</p>
                                    <p className="text-sm text-gray-400">{user.email}</p>
                                </div>
                                <Link to="/profile"
                                    className="block px-4 py-3 hover:bg-gray-50 transition"
                                    onClick={() => { setDropdownOpen(false); setMobileMenuOpen(false); }}>
                                    👤 My Profile
                                </Link>
                                <Link to="/orders"
                                    className="block px-4 py-3 hover:bg-gray-50 transition"
                                    onClick={() => { setDropdownOpen(false); setMobileMenuOpen(false); }}>
                                    🧾 My Orders
                                </Link>
                                <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                                    className="w-full text-center md:text-left px-4 py-3 text-red-500 hover:bg-red-50 transition">
                                    🚪 Logout
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <nav className="flex flex-col md:flex-row gap-4 w-full md:w-auto pb-4 md:pb-0">
                        <Link to="/register" className="px-4 py-2 md:py-1 text-center rounded-full bg-white text-[rgb(252,90,9)] font-medium hover:scale-105 transition" onClick={() => setMobileMenuOpen(false)}>
                            Register
                        </Link>
                        <Link to="/login" className="px-4 py-2 md:py-1 text-center rounded-full border border-white hover:bg-white hover:text-[rgb(252,90,9)] transition" onClick={() => setMobileMenuOpen(false)}>
                            Login
                        </Link>
                    </nav>
                )}
            </div>
        </header>
    );
}

export default Header;