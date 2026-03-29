export async function getMenu(){
    const res = await fetch("https://food-delish-api.onrender.com/menu");
    const result = await res.json();
    return result.data;
}