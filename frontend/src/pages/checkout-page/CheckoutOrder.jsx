import { ShoppingBag, ArrowRight } from "lucide-react";
import {useEffect,useState} from "react";
function CheckoutOrder({ cartItems, setCartItems }){

  const increaseQty=(index)=>{
    const updated=[...cartItems];
    updated[index].quantity=(updated[index].quantity||1)+1;
    setCartItems(updated);
    sessionStorage.setItem("cart",JSON.stringify(updated));
  };

  const decreaseQty=(index)=>{
    const updated=[...cartItems];

    if((updated[index].quantity||1)>1){
      updated[index].quantity-=1;
    }else{
      updated.splice(index,1);
    }

    setCartItems(updated);
    sessionStorage.setItem("cart",JSON.stringify(updated));
  };

  const totalPrice=cartItems.reduce(
    (sum,item)=>sum+item.price*(item.quantity||1),
    0
  );
  const tax=totalPrice*0.08;
  const deliveryFee = cartItems.length > 0 ? 50 : 0;
  const grandTotal = totalPrice + deliveryFee + tax;

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 h-fit sticky top-24">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-[rgb(252,90,9)]" />
          Your Order
        </h2>
        <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2.5 py-1 rounded-full">
          {cartItems.length} Items
        </span>
      </div>

      <div className="flex flex-col gap-4 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        {cartItems.length===0?(
          <p className="text-sm text-gray-400 text-center">
            Your cart is empty
          </p>
        ):(
          cartItems.map((item,index)=>(
            <div key={index} className="flex items-center justify-between gap-4">

              {/* LEFT */}
              <div className="flex items-center gap-3">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-14 h-14 object-cover rounded-xl"
                />

                <div className="flex flex-col">
                  <span className="font-semibold text-gray-800">
                    {item.name}
                  </span>
                  <span className="text-xs text-gray-400 font-medium">
                    {item.category}
                  </span>

                  <div className="flex items-center gap-2 mt-1">
                    <button onClick={()=>decreaseQty(index)} className="bg-gray-200 px-2 rounded-md">-</button>
                    <span className="text-sm font-semibold">{item.quantity||1}</span>
                    <button onClick={()=>increaseQty(index)} className="bg-gray-200 px-2 rounded-md">+</button>
                  </div>
                </div>
              </div>

              {/* RIGHT */}
              <span className="font-medium text-gray-700">
                ₹{(item.price*(item.quantity||1)).toFixed(2)}
              </span>

            </div>
          ))
        )}
      </div>

      <div className="space-y-3 border-t border-dashed border-gray-200 pt-6">
        <div className="flex justify-between text-gray-500 text-sm">
          <span>Subtotal</span>
          <span className="font-medium text-gray-800">₹{totalPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-500 text-sm">
          <span>Delivery Fee</span>
          <span className="font-medium text-emerald-600">
            {deliveryFee === 0 ? "Free" : `₹${deliveryFee}`}
          </span>
        </div>
        <div className="flex justify-between text-gray-500 text-sm">
          <span>Estimated Tax</span>
          <span className="font-medium text-gray-800">₹{tax.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between items-center pt-4 mt-2 border-t border-gray-100">
          <span className="text-lg font-bold text-gray-900">Total</span>
          <span className="text-2xl font-black text-[rgb(252,90,9)]">
            ₹{grandTotal.toFixed(2)}
          </span>
        </div>
      </div>

      <button className="group mt-8 w-full bg-[rgb(252,90,9)] text-white py-4 rounded-2xl text-lg font-bold hover:bg-[rgb(230,80,5)] shadow-[0_10px_20px_-10px_rgba(252,90,9,0.4)] transition-all active:scale-[0.98] flex items-center justify-center gap-3">
        Place Order
        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
      </button>

      <p className="text-center text-[10px] text-gray-400 mt-4 leading-relaxed uppercase tracking-widest font-bold">
        By clicking, you agree to our Terms
      </p>
    </div>
  );
}
export default CheckoutOrder;