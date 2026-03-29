import getPrice from "./getPrice";
async function getBestSellers(){
    const res = await fetch("https://food-delish-api.onrender.com/menu");
    const result = await res.json();

    const BESTSELLERS = [
        "Malai Chaap",
        "Paneer Steam Momos",
        "Special Paneer Dosa",
        "Paneer Tikka Roll",
        "Paneer Maharaja Burger",
        "Sweet Corn Fried Rice"
    ];

    const items = result.data.flatMap(cat =>
        cat.items
            .filter(item => BESTSELLERS.includes(item.name))
            .map(item => ({
                name: item.name,
                price: getPrice(item.prices),
                image: item.image,
                category: cat.name
            }))
    );

    return items;
}
export default getBestSellers;