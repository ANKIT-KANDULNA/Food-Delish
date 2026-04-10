import CheckoutHeader from "./CheckoutHeader";
import CheckoutForm from "./CheckoutForm";
import CheckoutOrder from "./CheckoutOrder";
function Checkout({ cartItems, setCartItems }){
    return (
        <div className="min-h-screen bg-[rgb(252,90,9)]">
            <CheckoutHeader />

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 p-4 sm:p-6 md:p-10">
                <CheckoutForm />

                <CheckoutOrder cartItems={cartItems} setCartItems={setCartItems} />
            </div>
        </div>
    );
}
export default Checkout;