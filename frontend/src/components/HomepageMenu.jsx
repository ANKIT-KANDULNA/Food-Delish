import { useEffect, useState } from "react";
import HomeMenuCard from "./HomeMenuCard.jsx";
import getBestSellers from "../utils/homeMenu.js";
import { useNavigate } from "react-router-dom";
function HomepageMenu({addToCart}){
    const [items, setItems] = useState([]);
    const navigate=useNavigate();
    useEffect(()=>{
        getBestSellers().then(setItems);
    },[]);

    return (
        <div className="bg-[rgb(252,90,9)] p-4 md:p-8 text-white">
            <p className="text-center text-2xl md:text-3xl font-bold">Explore our Menu</p>

            <p className="text-xl md:text-2xl font-semibold m-4 md:m-6">Bestsellers</p>

            <div className="mt-4 md:mt-6 flex gap-4 md:gap-6 overflow-x-auto snap-x scrollbar-hide px-2 items-center">
                {items.map((item)=>(
                    <div key={item.id || item._id} className="snap-center shrink-0">
                        <HomeMenuCard item={item} addToCart={addToCart}/>
                    </div>
                ))}
            </div>
            
            <div className="text-center mt-10">
                <button className="bg-black text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-800 transition-all duration-300 shadow-md" onClick={()=>navigate("/menu")}>
                    View Full Menu
                </button>
            </div>
        </div>
    );
}
export default HomepageMenu;