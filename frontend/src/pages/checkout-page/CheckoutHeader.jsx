import { Link } from "react-router-dom";
import { ChevronLeft, Lock } from "lucide-react";

function CheckoutHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4 lg:px-10">
        <div className="flex-1">
          <Link 
            to="/menu" 
            className="group inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Menu
          </Link>
        </div>

        <h3 className="text-2xl font-extrabold tracking-wide text-[rgb(252,90,9)]">FOOD DELiSH</h3>

        <div className="flex-1 flex justify-end">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-100">
            <Lock className="w-3.5 h-3.5 text-green-600" />
            <span className="text-[11px] uppercase tracking-wider font-bold text-gray-500">
              Secure Checkout
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
export default CheckoutHeader;