function HomeMenuCard({ item, addToCart }) {
    return (
        <div className="bg-white text-black rounded-3xl overflow-hidden w-64 h-full flex flex-col shadow-sm">
            <div className="p-4 shrink-0">
                <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-48 object-cover rounded-2xl"
                />
            </div>

            <div className="px-4 flex flex-col flex-1 min-h-0">
                <p className="text-sm opacity-80 shrink-0">{item.category}</p>
                <h3 className="font-bold text-lg leading-snug mt-1 line-clamp-2 min-h-[3.25rem]">
                    {item.name}
                </h3>
                <p className="font-bold text-xl mt-2 shrink-0">₹{item.price}</p>

                <div className="mt-auto flex justify-center pt-4 pb-4">
                    <button
                        type="button"
                        className="bg-[rgb(252,90,9)] text-white px-6 py-2 rounded-full font-semibold hover:bg-[rgb(207,72,9)] hover:text-white transition"
                        onClick={() => addToCart(item)}
                    >
                        Add to cart
                    </button>
                </div>
            </div>
        </div>
    );
}

export default HomeMenuCard;