function getPrice(prices){
    if(!prices) return 0;
    return Math.min(...Object.values(prices));
}
export default getPrice;