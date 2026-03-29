import { useEffect, useState, useRef } from "react";
import MenuHeader from "../components/MenuHeader";
import CategoryList from "../components/CategoryList";
import { getMenu } from "../utils/getMenu";
import CategorySection from "../components/CategorySection";
import getPrice from "../utils/getPrice";

function Menu({addToCart}){
    const [menuData,setMenuData]=useState([]);
    const [searchQuery,setSearchQuery]=useState("");
    const categoryRefs=useRef({});

    useEffect(()=>{
        getMenu().then(data=>{
            setMenuData(data||[]);
        });
    },[]);

    const scrollToCategory=(categoryName)=>{ 
        const el=categoryRefs.current[categoryName];

        if(el){
            el.scrollIntoView({
                behavior:"smooth",
                block:"start"
            });
        }
    };

    return (
        <div className="bg-[#fff8f3]">
            <div className="max-w-6xl mx-auto px-4">
                <MenuHeader 
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    menuData={menuData}
                />
            </div>

            {!searchQuery && (
                <div className="p-6 backdrop-blur-md">
                    <CategoryList 
                        categories={menuData||[]} 
                        onCategoryClick={scrollToCategory}
                    />
                </div>
            )}

            <div className="p-4 space-y-10">
                {menuData.map((category)=>{
                    let filteredItems=category.items.filter(item=>
                        item.name.toLowerCase().includes(searchQuery.toLowerCase())
                    );

                    if(filteredItems.length===0) return null;

                    return (
                        <div
                            key={category.id}
                            ref={(el)=>categoryRefs.current[category.name]=el}
                        >
                            <CategorySection 
                                category={{...category,items:filteredItems}}
                                addToCart={addToCart} 
                            />
                        </div>
                    );
                })}
            </div>

        </div>
    );
}
export default Menu;