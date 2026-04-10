import { useState } from "react";

function MenuItemCard({ item, addToCart }) {
  const variantKeys = Object.keys(item.prices || {});
  const [selectedVariant, setSelectedVariant] = useState(variantKeys[0] || "");

  const currentPrice = item.prices ? item.prices[selectedVariant] : 0;

  const handleAdd = () => {
    addToCart({
      ...item,
      variant: selectedVariant,
      price: currentPrice
    });
  };

  return (
    <div className="group relative flex flex-col bg-white rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-50">
      {/* Image Section */}
      <div className="relative overflow-hidden h-52">
        <img 
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>
        {item.spiceLevel === "high" && (
          <div className="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter">
            Spicy 🔥
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-800 leading-tight mb-1">
          {item.name}
        </h3>
        <p className="text-xs text-gray-500 line-clamp-2 mb-4 h-8">
          {item.description || item.ingredients?.join(", ")}
        </p>
        
        {/* Variety Selector */}
        {variantKeys.length > 1 && (
          <div className="flex gap-2 mb-4 bg-gray-50 p-1 rounded-xl">
            {variantKeys.map((v) => (
              <button
                key={v}
                onClick={() => setSelectedVariant(v)}
                className={`flex-1 text-[10px] font-bold py-1.5 rounded-lg transition-all ${
                  selectedVariant === v 
                    ? "bg-white text-gray-900 shadow-sm ring-1 ring-gray-200" 
                    : "text-gray-400 hover:text-gray-600"
                } uppercase tracking-wider`}
              >
                {v}
              </button>
            ))}
          </div>
        )}

        <div className="mt-auto pt-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400 uppercase tracking-widest block">Price</span>
            <span className="text-xl font-black text-gray-900">
              ₹{currentPrice}
            </span>
          </div>

          <button 
            className="flex items-center justify-center w-12 h-12 bg-gray-900 text-white rounded-2xl transition-all duration-300 hover:bg-[rgb(252,90,9)] hover:rounded-xl active:scale-95 shadow-lg shadow-gray-200"
            onClick={handleAdd}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default MenuItemCard;
