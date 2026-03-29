function DealCard({item, addToCart}){
    return (
        <div className="bg-[rgb(252,90,9)] text-white rounded-3xl overflow-hidden w-64 flex-shrink-0 flex flex-col justify-between">
            <div>
                <div className="p-4">
                    <img src={item.image} alt={item.name} className="w-full h-48 object-cover rounded-2xl"/>
                </div>

                <div className="px-4 pb-5">
                    <p className="text-sm opacity-80">{item.category}</p>
                    <h3 className="font-bold text-lg leading-tight mt-1">{item.name}</h3>
                    <p className="font-bold text-xl mt-2"> ₹{item.price}</p>
                </div>
            </div>

            <div className="flex justify-center pb-4">
                <button className="bg-white text-[rgb(252,90,9)] px-6 py-3 rounded-3xl font-semibold transition-all duration-300 hover:bg-[rgb(207,72,9)] hover:text-white" onClick={()=>addToCart(item)}>
                    Add to cart
                </button>
            </div>
        </div>
    );

}
export default DealCard;