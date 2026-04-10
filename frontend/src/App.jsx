import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import Homepage  from "./pages/Homepage";
import Menu      from "./pages/Menu";
import Checkout  from "./pages/checkout-page/Checkout";
import Login     from "./pages/Login";
import Register  from "./pages/Register";
import Orders    from "./pages/Orders";
import AdminPanel from "./pages/admin/AdminPanel";
import Profile   from "./pages/Profile";
import StaticPage from "./pages/StaticPage";

import FloatingCart    from "./components/FloatingCart";
import ProtectedRoute  from "./components/ProtectedRoute";

function App() {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = sessionStorage.getItem("cart");
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });
  const location = useLocation();

  useEffect(() => {
    sessionStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item) => {
    const id = item.id || item._id || item.name;
    setCartItems(prev => {
      const idx = prev.findIndex(i => 
        (i.id || i._id || i.name) === id && i.variant === item.variant
      );
      if (idx !== -1) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], quantity: (updated[idx].quantity || 1) + 1 };
        return updated;
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const hideCart = ["/checkout", "/login", "/register", "/orders", "/admin", "/profile", "/about", "/careers", "/birthday", "/terms", "/privacy"].some(p =>
    location.pathname.startsWith(p)
  );

  return (
    <div>
      <Routes>
        {/* Public */}
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected — regular user */}
        <Route path="/"        element={<ProtectedRoute><Homepage addToCart={addToCart} /></ProtectedRoute>} />
        <Route path="/menu"    element={<ProtectedRoute><Menu addToCart={addToCart} /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout cartItems={cartItems} setCartItems={setCartItems} /></ProtectedRoute>} />
        <Route path="/orders"  element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        {/* Static Content */}
        <Route path="/about"    element={<StaticPage />} />
        <Route path="/careers"  element={<StaticPage />} />
        <Route path="/birthday" element={<StaticPage />} />
        <Route path="/terms"    element={<StaticPage />} />
        <Route path="/privacy"  element={<StaticPage />} />

        {/* Admin */}
        <Route path="/admin"   element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
      </Routes>

      {!hideCart && <FloatingCart cartItems={cartItems} />}
    </div>
  );
}

export default App;