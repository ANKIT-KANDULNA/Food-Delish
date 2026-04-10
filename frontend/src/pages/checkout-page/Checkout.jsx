import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import CheckoutHeader from "./CheckoutHeader";
import CheckoutForm from "./CheckoutForm";
import CheckoutOrder from "./CheckoutOrder";
import { useAuth } from "../../context/AuthContext";
import { apiFetch, initApiAuth } from "../../utils/api";

function Checkout({ cartItems, setCartItems }) {
  const { accessToken, refreshAccessToken, logout } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress]         = useState({
    fullName: "", phone: "", addressLine: "", city: "", pincode: "",
  });
  const [promoCode, setPromoCode]     = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [discount, setDiscount]       = useState(0);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");
  const [success, setSuccess]         = useState(null); // placed order data

  useEffect(() => {
    initApiAuth({ getAccessToken: () => accessToken, refreshAccessToken, logout });
  }, [accessToken, refreshAccessToken, logout]);

  const handleAddressChange = (field, value) => {
    setAddress(prev => ({ ...prev, [field]: value }));
  };

  const handleApplyPromo = () => {
    if (promoCode === "FIRST50") {
      setDiscount(50);
      setPromoApplied(true);
    } else {
      setError("Invalid promo code. Try FIRST50!");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handlePlaceOrder = async () => {
    // Validate address
    const required = ["fullName", "phone", "addressLine", "city", "pincode"];
    for (const field of required) {
      if (!address[field]?.trim()) {
        setError(`Please fill in your ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`);
        return;
      }
    }
    if (cartItems.length === 0) {
      setError("Your cart is empty!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = {
        items: cartItems.map(item => ({
          menuItemId: item.id || item._id || item.name,
          name:       item.name,
          variant:    item.variant || "Regular",
          price:      item.price,
          quantity:   item.quantity || 1,
          image:      item.image || "",
        })),
        deliveryAddress: address,
        paymentMethod: "cod",
        promoCode: promoApplied ? promoCode : undefined,
      };

      const data = await apiFetch("/api/orders", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (!data) return; // refreshAccessToken failed, redirected to login

      // Clear cart after successful order
      setCartItems([]);
      sessionStorage.removeItem("cart");
      setSuccess(data.order);
    } catch (err) {
      setError(err.message || "Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Success Screen ──────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen bg-[#fff8f3] flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-md p-10 max-w-md w-full text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-500 animate-bounce" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Order Placed! 🎉</h2>
          <p className="text-gray-500 text-sm mb-1">
            Your order <span className="font-bold text-gray-700">{success.orderId}</span> has been placed.
          </p>
          <p className="text-gray-500 text-sm mb-6">
            Estimated delivery:{" "}
            <span className="font-bold text-orange-500">
              {new Date(success.estimatedDelivery).toLocaleTimeString("en-IN", {
                hour: "2-digit", minute: "2-digit",
              })}
            </span>
          </p>

          <div className="bg-gray-50 rounded-2xl p-5 text-left mb-6 space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span><span>₹{success.subtotal}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Delivery</span>
              <span>{success.deliveryFee === 0 ? "Free" : `₹${success.deliveryFee}`}</span>
            </div>
            {success.discount > 0 && (
              <div className="flex justify-between text-sm text-green-500">
                <span>Discount</span><span>−₹{success.discount}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-gray-800 border-t border-gray-200 pt-2">
              <span>Total Paid</span><span>₹{success.totalAmount}</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate("/orders")}
              className="w-full bg-[rgb(252,90,9)] text-white py-3 rounded-2xl font-bold hover:bg-orange-600 transition"
            >
              Track Order
            </button>
            <button
              onClick={() => navigate("/menu")}
              className="w-full border border-gray-200 text-gray-600 py-3 rounded-2xl font-bold hover:bg-gray-50 transition"
            >
              Order More Food
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Checkout Form ───────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[rgb(252,90,9)]">
      <CheckoutHeader />
      {error && (
        <div className="max-w-6xl mx-auto px-4 pt-4">
          <div className="bg-white border-l-4 border-red-500 text-red-600 px-5 py-3 rounded-xl text-sm font-medium">
            ⚠️ {error}
          </div>
        </div>
      )}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 p-4 sm:p-6 md:p-10">
        <CheckoutForm
          address={address}
          onChange={handleAddressChange}
          promoCode={promoCode}
          onPromoChange={setPromoCode}
          promoApplied={promoApplied}
          onApplyPromo={handleApplyPromo}
        />
        <CheckoutOrder
          cartItems={cartItems}
          setCartItems={setCartItems}
          discount={discount}
          onPlaceOrder={handlePlaceOrder}
          loading={loading}
        />
      </div>
    </div>
  );
}

export default Checkout;