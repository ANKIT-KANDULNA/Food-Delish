import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { apiFetch, initApiAuth } from "../utils/api";
import { Link } from "react-router-dom";
import { ChevronLeft, Mail, User as UserIcon, MapPin, Trash2, PlusCircle, Star } from "lucide-react";

function Profile() {
  const { user, accessToken, refreshAccessToken, logout } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initApiAuth({ getAccessToken: () => accessToken, refreshAccessToken, logout });
  }, [accessToken, refreshAccessToken, logout]);

  useEffect(() => {
    // Fetch profile data (including addresses) from backend
    apiFetch("/api/auth/profile")
      .then(data => {
        if (data?.addresses) setAddresses(data.addresses);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#fff8f3] py-10 px-6">
      <div className="max-w-4xl mx-auto">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-900 transition mb-8 font-medium"
        >
          <ChevronLeft className="w-5 h-5" /> Back to Home
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Info Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center">
              <div className="relative inline-block mb-4">
                {user.photo ? (
                  <img src={user.photo} className="w-24 h-24 rounded-full border-4 border-orange-50" />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-orange-100 text-[rgb(252,90,9)] text-3xl font-black flex items-center justify-center border-4 border-orange-50">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                {user.role === "admin" && (
                  <span className="absolute -bottom-1 -right-1 bg-indigo-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter">
                    Admin
                  </span>
                )}
              </div>
              <h2 className="text-xl font-black text-gray-900">{user.name}</h2>
              <p className="text-gray-400 text-sm mb-6 uppercase tracking-widest font-bold mt-1">
                Member since 2024
              </p>

              <div className="space-y-3 text-left">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <UserIcon className="w-4 h-4 text-[rgb(252,90,9)]" />
                  <span>{user.name}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Mail className="w-4 h-4 text-[rgb(252,90,9)]" />
                  <span className="truncate">{user.email}</span>
                </div>
              </div>

              <button 
                onClick={logout}
                className="w-full mt-8 py-3 rounded-2xl border border-red-100 text-red-500 font-bold text-sm hover:bg-red-50 transition"
              >
                Logout Account
              </button>
            </div>
            
            {user.role === "admin" && (
              <Link to="/admin" className="block mt-4 bg-indigo-600 text-white text-center py-4 rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition">
                Go to Admin Dashboard
              </Link>
            )}
          </div>

          {/* Addresses Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-[rgb(252,90,9)]" />
                  Saved Addresses
                </h3>
                <button className="flex items-center gap-2 text-sm font-bold text-[rgb(252,90,9)] hover:opacity-80 transition">
                  <PlusCircle className="w-5 h-5" /> Add New
                </button>
              </div>

              {loading ? (
                <div className="space-y-4">
                  {[1, 2].map(i => (
                    <div key={i} className="h-24 bg-gray-50 rounded-2xl animate-pulse" />
                  ))}
                </div>
              ) : addresses.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-400 text-sm">No addresses saved yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {addresses.map((addr, i) => (
                    <div key={i} className="group relative bg-gray-50 rounded-2xl p-5 border border-transparent hover:border-orange-100 transition">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-gray-900 flex items-center gap-2">
                            {addr.label || "Home"}
                            {addr.isDefault && (
                              <span className="bg-orange-100 text-[rgb(252,90,9)] text-[10px] px-2 py-0.5 rounded-full font-black uppercase">
                                Default
                              </span>
                            )}
                          </p>
                          <p className="text-sm font-semibold text-gray-700 mt-1">{addr.fullName}</p>
                          <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">
                            {addr.addressLine}, {addr.city} - {addr.pincode}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">📞 {addr.phone}</p>
                        </div>
                        <button className="text-gray-300 hover:text-red-500 transition">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-[rgb(252,90,9)] rounded-3xl p-8 text-white shadow-lg shadow-orange-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-widest opacity-80 mb-1">Loyalty Rewards</p>
                <h3 className="text-2xl font-black">Foodie Silver Tier</h3>
                <p className="text-sm mt-2 opacity-90">120 points until next reward!</p>
              </div>
              <Star className="w-12 h-12 text-white/20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
