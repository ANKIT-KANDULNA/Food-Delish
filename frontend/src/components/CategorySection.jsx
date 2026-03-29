function CategorySection({ category, addToCart }) {
  return (
    <div className="mb-16 px-4 scroll-mt-32">
      <div className="flex items-center gap-4 mb-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
          {category.name}
        </h2>
        <div className="h-[2px] flex-grow bg-gray-100 mt-2"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {category.items.map((item) => (
          <div 
            key={item.id}
            className="group relative flex flex-col bg-white rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-50"
          >
            <div className="relative overflow-hidden h-52">
              <img 
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>
            </div>

            <div className="p-5 flex flex-col flex-grow">
              <h3 className="text-lg font-bold text-gray-800 leading-tight mb-1">
                {item.name}
              </h3>
              
              <div className="mt-auto pt-4 flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-400 uppercase tracking-widest block">Price</span>
                  <span className="text-xl font-black text-gray-900">
                    ₹{Object.values(item.prices)[0]}
                  </span>
                </div>

                <button className="flex items-center justify-center w-12 h-12 bg-gray-900 text-white rounded-2xl transition-all duration-300 hover:bg-[rgb(252,90,9)] hover:rounded-xl active:scale-95 shadow-lg shadow-gray-200"
                onClick={()=>addToCart({...item, price: Object.values(item.prices)[0]})}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default CategorySection;