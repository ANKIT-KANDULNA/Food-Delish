import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { apiFetch, initApiAuth } from "../../utils/api";
import {
  BarChart2, ShoppingBag, Users, TrendingUp,
  PackageCheck, ChevronDown, ToggleLeft, ToggleRight,
  LogOut, RefreshCw,
} from "lucide-react";

const STATUS_LABELS = {
  placed:           { label: "Placed",          color: "bg-blue-100 text-blue-600" },
  confirmed:        { label: "Confirmed",        color: "bg-indigo-100 text-indigo-600" },
  preparing:        { label: "Preparing",        color: "bg-yellow-100 text-yellow-700" },
  out_for_delivery: { label: "Out for Delivery", color: "bg-orange-100 text-orange-600" },
  delivered:        { label: "Delivered",        color: "bg-green-100 text-green-600" },
  cancelled:        { label: "Cancelled",        color: "bg-red-100 text-red-600" },
};

const ALL_STATUSES = Object.keys(STATUS_LABELS);

// ── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-5">
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-gray-400 text-xs font-semibold uppercase">{label}</p>
        <p className="text-2xl font-black text-gray-900">{value}</p>
      </div>
    </div>
  );
}

// ── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const cfg = STATUS_LABELS[status] || { label: status, color: "bg-gray-100 text-gray-500" };
  return (
    <span className={`text-xs font-bold px-3 py-1 rounded-full ${cfg.color}`}>{cfg.label}</span>
  );
}

// ── Order Status Updater ─────────────────────────────────────────────────────
function StatusUpdater({ orderId, currentStatus, onUpdate }) {
  const [status, setStatus]   = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await apiFetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      onUpdate(orderId, status);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2 mt-2">
      <select
        value={status}
        onChange={e => setStatus(e.target.value)}
        className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 outline-none bg-white"
      >
        {ALL_STATUSES.map(s => (
          <option key={s} value={s}>{STATUS_LABELS[s].label}</option>
        ))}
      </select>
      <button
        onClick={handleUpdate}
        disabled={loading || status === currentStatus}
        className="text-xs bg-[rgb(252,90,9)] text-white px-3 py-1.5 rounded-lg font-semibold 
          disabled:opacity-40 hover:bg-orange-600 transition"
      >
        {loading ? "…" : "Update"}
      </button>
    </div>
  );
}

// ── Admin Panel ──────────────────────────────────────────────────────────────
function AdminPanel() {
  const { accessToken, refreshAccessToken, logout, user } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab]         = useState("orders");
  const [orders, setOrders]   = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage]       = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");

  // Initialize api auth
  useEffect(() => {
    initApiAuth({ getAccessToken: () => accessToken, refreshAccessToken, logout });
  }, [accessToken, refreshAccessToken, logout]);

  // Redirect non-admins
  useEffect(() => {
    if (user && user.role !== "admin") navigate("/");
  }, [user, navigate]);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const qs = `?page=${page}&limit=15${statusFilter ? `&status=${statusFilter}` : ""}`;
      const data = await apiFetch(`/api/orders${qs}`);
      if (data) {
        setOrders(data.orders || []);
        setTotalPages(data.totalPages || 1);
      }
    } catch { /* handled in apiFetch */ }
    setLoading(false);
  }, [page, statusFilter]);

  const fetchAnalytics = useCallback(async () => {
    try {
      const data = await apiFetch("/api/orders/admin/analytics");
      if (data) setAnalytics(data);
    } catch {}
  }, []);

  const fetchMenu = useCallback(async () => {
    try {
      const data = await apiFetch("/api/menu?limit=50");
      if (data) setMenuItems(data.items || []);
    } catch {}
  }, []);

  useEffect(() => {
    if (tab === "orders")    { fetchOrders(); fetchAnalytics(); }
    if (tab === "menu")      fetchMenu();
    if (tab === "analytics") fetchAnalytics();
  }, [tab, fetchOrders, fetchAnalytics, fetchMenu]);

  const handleStatusUpdate = (orderId, newStatus) => {
    setOrders(prev =>
      prev.map(o => o.orderId === orderId ? { ...o, status: newStatus } : o)
    );
  };

  const handleToggleItem = async (id) => {
    try {
      const data = await apiFetch(`/api/menu/${id}/toggle`, { method: "PATCH" });
      if (data) {
        setMenuItems(prev => prev.map(m => m._id === id ? data.item : m));
      }
    } catch (err) { alert(err.message); }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🍽️</span>
            <div>
              <h1 className="font-black text-gray-900 text-lg leading-none">FoodDelish</h1>
              <p className="text-xs text-gray-400">Admin Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 hidden sm:block">
              Welcome, <strong className="text-gray-800">{user?.name}</strong>
            </span>
            <button
              onClick={() => logout().then(() => navigate("/login"))}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-500 transition font-medium"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-gray-200 rounded-2xl p-1 mb-8 w-fit">
          {[
            { id: "orders",    icon: ShoppingBag,  label: "Orders" },
            { id: "menu",      icon: PackageCheck, label: "Menu" },
            { id: "analytics", icon: BarChart2,    label: "Analytics" },
          ].map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => { setTab(id); setPage(1); }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition ${
                tab === id
                  ? "bg-[rgb(252,90,9)] text-white shadow-sm"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* ── ORDERS TAB ─────────────────────────────────────────────────── */}
        {tab === "orders" && (
          <>
            {/* Quick stats */}
            {analytics && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard icon={TrendingUp}  label="Total Revenue"  value={`₹${analytics.totalRevenue?.toFixed(0) || 0}`} color="bg-green-100 text-green-600" />
                <StatCard icon={ShoppingBag} label="Total Orders"   value={analytics.statusBreakdown?.reduce((s, x) => s + x.count, 0) || 0} color="bg-orange-100 text-orange-600" />
                <StatCard icon={PackageCheck} label="Delivered"     value={analytics.statusBreakdown?.find(x => x._id === "delivered")?.count || 0} color="bg-blue-100 text-blue-600" />
                <StatCard icon={Users}        label="Active Orders" value={analytics.statusBreakdown?.filter(x => !["delivered","cancelled"].includes(x._id)).reduce((s,x) => s+x.count, 0) || 0} color="bg-purple-100 text-purple-600" />
              </div>
            )}

            {/* Filter + Refresh */}
            <div className="flex flex-wrap gap-3 items-center mb-6">
              <select
                value={statusFilter}
                onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
                className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none bg-white"
              >
                <option value="">All Statuses</option>
                {ALL_STATUSES.map(s => (
                  <option key={s} value={s}>{STATUS_LABELS[s].label}</option>
                ))}
              </select>
              <button
                onClick={fetchOrders}
                className="flex items-center gap-2 text-sm text-gray-500 border border-gray-200 rounded-xl px-4 py-2.5 bg-white hover:bg-gray-50"
              >
                <RefreshCw className="w-4 h-4" /> Refresh
              </button>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="bg-white rounded-2xl h-20 animate-pulse" />
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="font-medium">No orders found</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        {["Order ID","Customer","Items","Total","Status","Update","Date"].map(h => (
                          <th key={h} className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase whitespace-nowrap">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(order => (
                        <tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50/50">
                          <td className="px-5 py-4 font-mono text-xs text-gray-600 whitespace-nowrap">{order.orderId}</td>
                          <td className="px-5 py-4">
                            <p className="font-semibold text-gray-800">{order.user?.name}</p>
                            <p className="text-xs text-gray-400">{order.user?.email}</p>
                          </td>
                          <td className="px-5 py-4 text-gray-600">{order.items?.length} item{order.items?.length !== 1 ? "s" : ""}</td>
                          <td className="px-5 py-4 font-bold text-gray-800">₹{order.totalAmount}</td>
                          <td className="px-5 py-4"><StatusBadge status={order.status} /></td>
                          <td className="px-5 py-4">
                            <StatusUpdater
                              orderId={order.orderId}
                              currentStatus={order.status}
                              onUpdate={handleStatusUpdate}
                            />
                          </td>
                          <td className="px-5 py-4 text-gray-400 text-xs whitespace-nowrap">
                            {new Date(order.createdAt).toLocaleDateString("en-IN")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {totalPages > 1 && (
                  <div className="flex justify-between items-center px-5 py-3 border-t border-gray-100">
                    <button disabled={page===1} onClick={() => setPage(p=>p-1)} className="text-sm text-gray-500 disabled:opacity-30">← Prev</button>
                    <span className="text-sm text-gray-400">Page {page} of {totalPages}</span>
                    <button disabled={page===totalPages} onClick={() => setPage(p=>p+1)} className="text-sm text-gray-500 disabled:opacity-30">Next →</button>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* ── MENU TAB ───────────────────────────────────────────────────── */}
        {tab === "menu" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Menu Items ({menuItems.length})</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {menuItems.map(item => (
                <div
                  key={item._id}
                  className={`bg-white rounded-2xl border border-gray-100 p-5 transition-opacity ${
                    item.isAvailable ? "" : "opacity-50"
                  }`}
                >
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-800 truncate">{item.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{item.category}</p>
                      <p className="text-sm font-semibold text-[rgb(252,90,9)] mt-1">₹{item.price}</p>
                    </div>
                    {item.image && (
                      <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      item.isVeg ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"
                    }`}>
                      {item.isVeg ? "🟢 Veg" : "🔴 Non-veg"}
                    </span>
                    <button
                      onClick={() => handleToggleItem(item._id)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-800 transition"
                    >
                      {item.isAvailable
                        ? <><ToggleRight className="w-5 h-5 text-green-500" /> Available</>
                        : <><ToggleLeft className="w-5 h-5 text-gray-400" /> Unavailable</>
                      }
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── ANALYTICS TAB ──────────────────────────────────────────────── */}
        {tab === "analytics" && analytics && (
          <div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard icon={TrendingUp}   label="Total Revenue"  value={`₹${analytics.totalRevenue?.toFixed(0) || 0}`}  color="bg-green-100 text-green-600" />
              <StatCard icon={ShoppingBag}  label="Total Orders"   value={analytics.statusBreakdown?.reduce((s,x) => s+x.count,0) || 0} color="bg-orange-100 text-orange-600" />
              <StatCard icon={PackageCheck} label="Delivered"      value={analytics.statusBreakdown?.find(x=>x._id==="delivered")?.count || 0} color="bg-blue-100 text-blue-600" />
              <StatCard icon={Users}        label="Cancelled"      value={analytics.statusBreakdown?.find(x=>x._id==="cancelled")?.count || 0} color="bg-red-100 text-red-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Status breakdown */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="font-bold text-gray-800 mb-5">Orders by Status</h3>
                {analytics.statusBreakdown?.map(({ _id, count }) => {
                  const cfg = STATUS_LABELS[_id];
                  const total = analytics.statusBreakdown.reduce((s,x)=>s+x.count,0);
                  const pct = total ? Math.round((count/total)*100) : 0;
                  return (
                    <div key={_id} className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700">{cfg?.label || _id}</span>
                        <span className="text-gray-500">{count} ({pct}%)</span>
                      </div>
                      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[rgb(252,90,9)] transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Recent orders */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="font-bold text-gray-800 mb-5">Recent Orders</h3>
                {analytics.recentOrders?.map(order => (
                  <div key={order._id} className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{order.user?.name}</p>
                      <p className="text-xs text-gray-400 font-mono">{order.orderId}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-800">₹{order.totalAmount}</p>
                      <StatusBadge status={order.status} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPanel;
