import getPrice from "./getPrice";
function getSeededRandom(seed){
    let x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

function shuffleWithSeed(array, seed){
    const arr = [...array];
    for(let i = arr.length - 1; i > 0; i--){
        const j = Math.floor(getSeededRandom(seed + i) * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

async function getDeals(){
    try{
        const res = await fetch("https://food-delish-api.onrender.com/menu");
        const result = await res.json();

        const items = result.data.flatMap(cat =>
            cat.items.map(item => ({
                name: item.name, 
                price: getPrice(item.prices),
                image: item.image,
                category: cat.name
            }))
        );

        const today = new Date();
        const seed = today.getFullYear()*1000 + today.getMonth()*100 + today.getDate();

        const shuffled = shuffleWithSeed(items, seed);
        return shuffled.slice(0,6);
    }
    catch(err){
        console.log(err);
        return [];
    }
}
export default getDeals;