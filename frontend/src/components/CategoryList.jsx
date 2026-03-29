function CategoryList({ categories, onCategoryClick}) {
  return (
    <div className="py-8 px-4">
      <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-6 font-semibold text-center">
        Explore Categories
      </p>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-x-4 gap-y-10 justify-items-center">
        {categories.map((cat) => (
          <div
            key={cat.id}
            onClick={()=>onCategoryClick(cat.name)}
            className="group flex flex-col items-center cursor-pointer transition-all duration-300"
          >
            <div className="relative">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-[3px] border-white shadow-xl transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-2 group-hover:shadow-2xl z-10 relative">
                <img
                  src={cat.items[0]?.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125"
                />
              </div>
              
              <div className="absolute inset-0 rounded-full bg-gray-100 scale-90 group-hover:scale-110 group-hover:bg-orange-50 transition-all duration-500 -z-0"></div>
            </div>

            <p className="text-xs md:text-sm mt-4 font-bold text-gray-700 transition-colors duration-300 group-hover:text-black text-center max-w-[100px] leading-tight">
              {cat.name}
            </p>
            
            <div className="w-1 h-1 bg-[rgb(252,90,9)] rounded-full mt-1 opacity-0 transition-opacity group-hover:opacity-100"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default CategoryList;