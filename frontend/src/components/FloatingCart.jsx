import {useNavigate} from "react-router-dom";
function FloatingCart({cartItems}){
    const navigate=useNavigate();

    if(!cartItems || cartItems.length===0) return null;

    const totalQuantity = cartItems.reduce((sum, i) => sum + (i.quantity || 1), 0);

    return(
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 
                        bg-black text-white 
                        w-[90%] max-w-md 
                        px-6 py-4 
                        rounded-2xl shadow-xl 
                        flex items-center justify-between z-50">

            <span className="text-lg font-semibold">
                {totalQuantity} {totalQuantity === 1 ? "item" : "items"}
            </span>

            <button 
                className="bg-white text-black px-5 py-2 rounded-xl font-medium"
                onClick={()=>navigate("/checkout")}
            >
                View Cart
            </button>

        </div>
    );
}
export default FloatingCart;