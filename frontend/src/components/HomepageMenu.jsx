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
        <div className="bg-[rgb(252,90,9)] p-8 text-white">
            <p className="text-center text-3xl font-bold">Explore our Menu</p>

            <p className="text-2xl font-semibold m-6">Bestsellers</p>

            <div className="mmt-6 flex gap-6 overflow-x-auto scrollbar-hide px-2 justify-items-center">
                {items.map((item)=>(
                    <HomeMenuCard key={item.id || item._id} item={item} addToCart={addToCart}/>
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