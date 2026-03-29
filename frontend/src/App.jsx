import {Routes,Route} from "react-router-dom";
import Homepage from "./pages/Homepage";
import Menu from "./pages/Menu";
import Checkout from "./pages/checkout-page/Checkout";
import { useState, useEffect } from "react";
import FloatingCart from "./components/FloatingCart";
import { useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";

function App(){
  const [cartItems, setCartItems] = useState(() => {
    const stored = sessionStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  });
  const location = useLocation();

  useEffect(() => {
    sessionStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item) => {
    const itemIdentifier = item.id || item._id || item.name;

    setCartItems((prev) => {
      const index = prev.findIndex(
        (i) => (i.id || i._id || i.name) === itemIdentifier
      );

      let updated = [...prev];

      if (index !== -1) {
        updated[index] = {
          ...updated[index],
          quantity: (updated[index].quantity || 1) + 1,
        };
      } else {
        updated.push({ ...item, quantity: 1 });
      }

      return updated;
    });
  };

  return(
    <div>

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={<ProtectedRoute><Homepage addToCart={addToCart}/></ProtectedRoute>} />
        <Route path="/menu" element={<ProtectedRoute><Menu addToCart={addToCart}/></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout cartItems={cartItems} setCartItems={setCartItems}/></ProtectedRoute>} />
      </Routes>
      
      {location.pathname !== "/checkout" && (
        <FloatingCart cartItems={cartItems} />
      )}
    </div>
  );
}
export default App;