import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { apiFetch, initApiAuth } from "../utils/api";
import { useNavigate } from "react-router-dom";

// Status display map
const STATUS_CONFIG = {
  placed:           { label: "Order Placed",         icon: "🛒", color: "text-blue-500",   step: 1 },
  confirmed:        { label: "Confirmed",             icon: "✅", color: "text-indigo-500", step: 2 },
  preparing:        { label: "Being Prepared",        icon: "👨‍🍳", color: "text-yellow-500", step: 3 },
  out_for_delivery: { label: "Out for Delivery",      icon: "🛵", color: "text-orange-500", step: 4 },
  delivered:        { label: "Delivered",             icon: "🎉", color: "text-green-500",  step: 5 },
  cancelled:        { label: "Cancelled",             icon: "❌", color: "text-red-500",    step: -1 },
};

const STEPS = ["placed", "confirmed", "preparing", "out_for_delivery", "delivered"];

function StatusBar({ status }) {
  if (status === "cancelled") {
    return <p className="text-red-500 font-semibold">❌ This order was cancelled</p>;
  }
  const currentStep = STATUS_CONFIG[status]?.step || 1;
  return (
    <div className="flex items-center gap-1 my-4 overflow-x-auto pb-2">
      {STEPS.map((s, i) => {
        const cfg = STATUS_CONFIG[s];
        const done = cfg.step <= currentStep;
        const active = cfg.step === currentStep;
        return (
          <div key={s} className="flex items-center gap-1 flex-shrink-0">
            <div className="flex flex-col items-center">
              <span className={`text-xl ${active ? "scale-125 transition-transform" : ""}`}>
                {cfg.icon}
              </span>
              <span
                className={`text-[10px] font-medium mt-1 whitespace-nowrap ${
                  done ? "text-orange-500" : "text-gray-300"
                }`}
              >
                {cfg.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`h-0.5 w-8 rounded ${
                  STATUS_CONFIG[STEPS[i + 1]].step <= currentStep
                    ? "bg-orange-400"
                    : "bg-gray-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function OrderCard({ order }) {
  const [open, setOpen] = useState(false);
  const cfg = STATUS_CONFIG[order.status] || {};
  const date = new Date(order.createdAt).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-bold text-gray-800 text-sm">{order.orderId}</p>
          <p className="text-gray-400 text-xs mt-0.5">{date}</p>
        </div>
        <div className="text-right">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 ${cfg.color}`}>
            {cfg.icon} {cfg.label}
          </span>
          <p className="font-black text-gray-900 mt-1">₹{order.totalAmount}</p>
        </div>
      </div>

      <StatusBar status={order.status} />

      <p className="text-sm text-gray-500">
        {order.items.length} item{order.items.length > 1 ? "s" : ""} ·{" "}
        Paid via <span className="font-medium capitalize">{order.paymentMethod}</span>
        {order.paymentStatus === "paid" && (
          <span className="ml-2 text-green-500 text-xs font-semibold">✓ Paid</span>
        )}
      </p>

      {order.estimatedDelivery && order.status !== "delivered" && order.status !== "cancelled" && (
        <p className="text-xs text-orange-500 font-medium mt-1">
          ETA: {new Date(order.estimatedDelivery).toLocaleTimeString("en-IN", {
            hour: "2-digit", minute: "2-digit",
          })}
        </p>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="text-xs text-[rgb(252,90,9)] font-semibold mt-3 hover:underline"
      >
        {open ? "Hide details ▲" : "View details ▼"}
      </button>

      {open && (
        <div className="mt-4 border-t border-gray-100 pt-4">
          <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Items</h4>
          {order.items.map((item, idx) => (
            <div key={idx} className="flex justify-between text-sm text-gray-700 mb-1">
              <span>{item.name} × {item.quantity}</span>
              <span>₹{(item.price * item.quantity).toFixed(0)}</span>
            </div>
          ))}
          <div className="border-t border-gray-100 mt-3 pt-3 space-y-1 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal</span><span>₹{order.subtotal}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Delivery</span>
              <span>{order.deliveryFee === 0 ? "Free 🎉" : `₹${order.deliveryFee}`}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-green-500">
                <span>Discount</span><span>−₹{order.discount}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-gray-800 pt-1 border-t border-gray-100">
              <span>Total</span><span>₹{order.totalAmount}</span>
            </div>
          </div>

          <h4 className="text-xs font-semibold text-gray-500 uppercase mt-4 mb-2">Delivery To</h4>
          <p className="text-sm text-gray-700">
            {order.deliveryAddress?.fullName} · {order.deliveryAddress?.phone}
          </p>
          <p className="text-sm text-gray-500">
            {order.deliveryAddress?.addressLine}, {order.deliveryAddress?.city} — {order.deliveryAddress?.pincode}
          </p>

          {order.statusHistory?.length > 0 && (
            <>
              <h4 className="text-xs font-semibold text-gray-500 uppercase mt-4 mb-2">Timeline</h4>
              {[...order.statusHistory].reverse().map((h, i) => (
                <div key={i} className="flex gap-3 mb-2">
                  <span className="text-orange-400 text-xs mt-0.5">●</span>
                  <div>
                    <p className="text-sm font-medium text-gray-700 capitalize">
                      {STATUS_CONFIG[h.status]?.label || h.status}
                    </p>
                    {h.note && <p className="text-xs text-gray-400">{h.note}</p>}
                    <p className="text-xs text-gray-400">
                      {new Date(h.timestamp).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}

function Orders() {
  const { accessToken, refreshAccessToken, logout } = useAuth();
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage]       = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  // Wire up the api utility
  useEffect(() => {
    initApiAuth({
      getAccessToken:     () => accessToken,
      refreshAccessToken,
      logout,
    });
  }, [accessToken, refreshAccessToken, logout]);

  useEffect(() => {
    setLoading(true);
    apiFetch(`/api/orders/my?page=${page}&limit=10`)
      .then(data => {
        if (!data) return;
        setOrders(data.orders || []);
        setTotalPages(data.totalPages || 1);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div className="min-h-screen bg-[#fff8f3]">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => navigate("/")} className="text-gray-400 hover:text-gray-700">
            ← Back
          </button>
          <h1 className="text-2xl font-black text-gray-900">My Orders</h1>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl h-32 animate-pulse" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-5xl mb-4">🍽️</p>
            <p className="text-lg font-semibold">No orders yet</p>
            <p className="text-sm mb-6">Your order history will appear here.</p>
            <button
              onClick={() => navigate("/menu")}
              className="bg-[rgb(252,90,9)] text-white px-8 py-3 rounded-2xl font-bold hover:bg-orange-600 transition"
            >
              Browse Menu
            </button>
          </div>
        ) : (
          <>
            {orders.map(order => (
              <OrderCard key={order._id} order={order} />
            ))}

            {totalPages > 1 && (
              <div className="flex justify-center gap-3 mt-6">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="px-5 py-2 rounded-xl bg-white border border-gray-200 text-sm font-medium disabled:opacity-40"
                >
                  ← Prev
                </button>
                <span className="px-5 py-2 text-sm text-gray-500">
                  {page} / {totalPages}
                </span>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(p => p + 1)}
                  className="px-5 py-2 rounded-xl bg-white border border-gray-200 text-sm font-medium disabled:opacity-40"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Orders;
