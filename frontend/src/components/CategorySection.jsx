import MenuItemCard from "./MenuItemCard";

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
          <MenuItemCard 
            key={item.id} 
            item={item} 
            addToCart={addToCart} 
          />
        ))}
      </div>
    </div>
  );
}
export default CategorySection;