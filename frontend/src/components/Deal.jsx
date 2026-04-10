import { useEffect, useState } from "react";
import getDeals from "../utils/dealGet.js";
import DealCard from "./DealCard";

function Deal({addToCart}) {
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [current, setCurrent] = useState(0);
    const [pause,setPause]=useState(false);

    useEffect(() => {
        getDeals().then(data => {
            setDeals(data);
            setLoading(false);
        });
    }, []);

    useEffect(()=>{
        if(pause || deals.length===0) return;

        const interval=setInterval(()=>{
            setCurrent(c=>(c>=deals.length-3?0:c+1));
        },3000);

        return()=>clearInterval(interval);
    },[pause,deals]);

    const prevSlide=()=>{
        if(deals.length<=3) return;
        setCurrent(c=>(c===0?deals.length-3:c-1));
    };
    const nextSlide=()=>{
        if(deals.length<=3) return;
        setCurrent(c=>(c>=deals.length-3?0:c+1));
    };

    const totalSlides = deals.length <= 3 ? 0 : deals.length - 2;
    
    if (loading) return <p className="text-center p-8 text-gray-400">Loading deals...</p>;

    return (
        <div className="p-4 sm:p-8 md:p-16">
            <h2 className="text-2xl md:text-3xl font-serif text-center pb-6 md:pb-8">Deals of the day</h2>

            <div className="relative flex items-center justify-center">
                <button onClick={prevSlide} className="hidden md:flex flex-shrink-0 w-12 h-12 lg:w-20 lg:h-20 items-center justify-center bg-[rgb(252,90,9)] text-white border rounded-full mr-4 z-10 hover:bg-[rgb(207,72,9)] transition">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 lg:w-8 lg:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                {/* Mobile version: Native scroll */}
                <div className="md:hidden flex gap-4 overflow-x-auto snap-x scrollbar-hide w-full pb-4 px-4 items-center">
                     {deals.map((item)=>(
                         <div key={item.id || item._id} className="snap-center shrink-0">
                             <DealCard item={item} addToCart={addToCart}/>
                         </div>
                     ))}
                </div>

                {/* Desktop Version: Carousel */}
                <div 
                    className="hidden md:block overflow-hidden lg:w-[810px] w-[540px]" 
                    onMouseEnter={()=>setPause(true)}
                    onMouseLeave={()=>setPause(false)}
                >
                    <div 
                        className="flex gap-4 transition-transform duration-500 ease-in-out"
                        style={{ transform:`translateX(-${current * 272}px)` }}
                    >
                        {deals.map((item)=>(
                            <DealCard key={item.id || item._id} item={item} addToCart={addToCart}/>
                        ))}
                    </div>
                </div>

                <button onClick={nextSlide} className="hidden md:flex flex-shrink-0 w-12 h-12 lg:w-20 lg:h-20 items-center justify-center bg-[rgb(252,90,9)] text-white border rounded-full ml-4 z-10 hover:bg-[rgb(207,72,9)] transition">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 lg:w-8 lg:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
            
            <div className="hidden md:flex justify-center mt-6 gap-2">
                {Array.from({ length: deals.length - 2 }).map((_, index) => (
                    <div
                        key={index}
                        onClick={()=>setCurrent(index)}
                        className={`h-3 w-3 rounded-full cursor-pointer transition-all duration-300 
                            ${current===index ? "bg-[rgb(252,90,9)] w-6" : "bg-gray-300"}
                        `}
                    ></div>
                ))}
            </div>
        </div>
    );
}

export default Deal;