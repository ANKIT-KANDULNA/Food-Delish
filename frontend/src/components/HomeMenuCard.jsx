function HomeMenuCard({item, addToCart}){
    return (
        <div className="bg-white text-black rounded-3xl overflow-hidden w-64 flex flex-col justify-between">
            <div className="p-4">
                <img src={item.image} alt={item.name} className="w-full h-48 object-cover rounded-2xl"/>
            </div>

            <div className="px-4">
                <p className="text-sm opacity-80">{item.category}</p>
                <h3 className="font-bold text-lg leading-tight mt-1">{item.name}</h3>
                <p className="font-bold text-xl mt-2">₹{item.price}</p>
            </div>

            <div className="flex justify-center p-4">
                <button className="bg-[rgb(252,90,9)] text-white px-6 py-2 rounded-full font-semibold hover:bg-[rgb(207,72,9)] hover:text-white transition" onClick={()=>{
                    console.log("ITEM:", item);
                    addToCart(item);
                }}>
                    Add to cart
                </button>
            </div>

        </div>
    );
}

export default HomeMenuCard;