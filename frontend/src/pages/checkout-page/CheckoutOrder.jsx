import { ShoppingBag, ArrowRight, Loader2 } from "lucide-react";

function CheckoutOrder({ cartItems, setCartItems, discount, onPlaceOrder, loading }) {
  const increaseQty = (index) => {
    const updated = [...cartItems];
    updated[index] = { ...updated[index], quantity: (updated[index].quantity || 1) + 1 };
    setCartItems(updated);
    sessionStorage.setItem("cart", JSON.stringify(updated));
  };

  const decreaseQty = (index) => {
    const updated = [...cartItems];
    if ((updated[index].quantity || 1) > 1) {
      updated[index] = { ...updated[index], quantity: updated[index].quantity - 1 };
    } else {
      updated.splice(index, 1);
    }
    setCartItems(updated);
    sessionStorage.setItem("cart", JSON.stringify(updated));
  };

  const subtotal     = cartItems.reduce((s, i) => s + i.price * (i.quantity || 1), 0);
  const deliveryFee  = subtotal > 499 ? 0 : 40;
  const grandTotal   = Math.max(0, subtotal + deliveryFee - (discount || 0));

  return (
    <div className="bg-white p-5 sm:p-8 rounded-3xl shadow-sm border border-gray-100 h-fit lg:sticky lg:top-24">
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-[rgb(252,90,9)]" />
          Your Order
        </h2>
        <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2.5 py-1 rounded-full">
          {cartItems.length} item{cartItems.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="flex flex-col gap-4 mb-8 max-h-[300px] overflow-y-auto pr-2">
        {cartItems.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">Your cart is empty</p>
        ) : (
          cartItems.map((item, index) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 object-cover rounded-xl"
                  />
                )}
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-800 text-sm">{item.name}</span>
                  <span className="text-xs text-gray-400">
                    {item.category} {item.variant && `• ${item.variant}`}
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      onClick={() => decreaseQty(index)}
                      className="bg-gray-100 hover:bg-gray-200 w-6 h-6 rounded-md text-sm font-bold transition"
                    >
                      −
                    </button>
                    <span className="text-sm font-semibold w-4 text-center">{item.quantity || 1}</span>
                    <button
                      onClick={() => increaseQty(index)}
                      className="bg-gray-100 hover:bg-gray-200 w-6 h-6 rounded-md text-sm font-bold transition"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              <span className="font-medium text-gray-700 text-sm whitespace-nowrap">
                ₹{(item.price * (item.quantity || 1)).toFixed(0)}
              </span>
            </div>
          ))
        )}
      </div>

      <div className="space-y-3 border-t border-dashed border-gray-200 pt-6">
        <div className="flex justify-between text-gray-500 text-sm">
          <span>Subtotal</span>
          <span className="font-medium text-gray-800">₹{subtotal.toFixed(0)}</span>
        </div>
        <div className="flex justify-between text-gray-500 text-sm">
          <span>Delivery Fee</span>
          <span className={`font-medium ${deliveryFee === 0 ? "text-emerald-600" : "text-gray-800"}`}>
            {deliveryFee === 0 ? "Free 🎉" : `₹${deliveryFee}`}
          </span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-500 text-sm">
            <span>Promo Discount</span>
            <span className="font-medium">−₹{discount}</span>
          </div>
        )}
        {subtotal > 0 && subtotal <= 499 && (
          <p className="text-xs text-gray-400">
            Add ₹{(500 - subtotal).toFixed(0)} more for free delivery!
          </p>
        )}
        <div className="flex justify-between items-center pt-4 mt-2 border-t border-gray-100">
          <span className="text-lg font-bold text-gray-900">Total</span>
          <span className="text-2xl font-black text-[rgb(252,90,9)]">₹{grandTotal.toFixed(0)}</span>
        </div>
      </div>

      <button
        onClick={onPlaceOrder}
        disabled={loading || cartItems.length === 0}
        className="group mt-8 w-full bg-[rgb(252,90,9)] text-white py-4 rounded-2xl text-lg font-bold 
          hover:bg-[rgb(230,80,5)] shadow-[0_10px_20px_-10px_rgba(252,90,9,0.4)] transition-all 
          active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <><Loader2 className="w-5 h-5 animate-spin" /> Placing Order…</>
        ) : (
          <>Place Order <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
        )}
      </button>

      <p className="text-center text-[10px] text-gray-400 mt-4 leading-relaxed uppercase tracking-widest font-bold">
        Free delivery on orders over ₹499 · Pay on delivery
      </p>
    </div>
  );
}

export default CheckoutOrder;