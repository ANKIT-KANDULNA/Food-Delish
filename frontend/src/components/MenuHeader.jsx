import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
function MenuHeader({searchQuery,setSearchQuery,menuData}){

    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [showSuggestions,setShowSuggestions]=useState(false);

    const allItems=menuData.flatMap(category=>category.items||[]);

    const filteredItems=allItems
        .filter(item=>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0,5);

    return (
        <div className="flex flex-col gap-4 p-4 relative">
            <div className="flex justify-between items-center">
                <a className="text-3xl font-bold text-[rgb(252,90,9)] cursor-pointer" onClick={() => navigate("/")}>
                    FOOD DELiSH
                </a>

                {user && (
                    <div className="flex items-center gap-4">
                        <span className="font-medium text-gray-700">Hi, {user.name} 👋</span>
                        <button
                            onClick={() => { logout(); navigate("/login"); }}
                            className="px-4 py-1 rounded-full border border-[rgb(252,90,9)] text-[rgb(252,90,9)] hover:bg-[rgb(252,90,9)] hover:text-white transition">
                            Logout
                        </button>
                    </div>
                )}
            </div>

            <h1 className="text-3xl font-bold text-[rgb(252,90,9)] text-center">
                Our Menu
            </h1>

            <div className="relative">
                <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e)=>{
                        setSearchQuery(e.target.value);
                        setShowSuggestions(true);
                    }}
                    onFocus={()=>setShowSuggestions(true)}
                    onBlur={()=>setTimeout(()=>setShowSuggestions(false),200)}
                    placeholder="Search for dishes..."
                    className="w-full border p-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[rgb(252,90,9)]"
                />

                {showSuggestions && searchQuery && (
                    <div className="absolute w-full bg-white shadow-lg rounded-xl mt-2 z-50">

                        {filteredItems.length>0 ? (
                            filteredItems.map((item,index)=>(
                                <div 
                                    key={index}
                                    onMouseDown={()=>{
                                        setSearchQuery(item.name);
                                        setShowSuggestions(false);
                                    }}
                                    className="p-3 hover:bg-gray-100 cursor-pointer"
                                >
                                    {item.name}
                                </div>
                            ))
                        ):(
                            <div className="p-3 text-gray-500">
                                No items found
                            </div>
                        )}

                    </div>
                )}
            </div>
        </div>
    );
}
export default MenuHeader;