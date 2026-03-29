import {useState,useEffect} from "react";
import FloatingCart from "../components/FloatingCart";
import Deal from "../components/Deal";
import Header from "../components/Header";
import HomepageMenu from "../components/HomepageMenu";
import Footer from "../components/Footer";
function Homepage({addToCart}){
  return (
    <div className="bg-[#fff8f3]">
      <Header />
      <Deal addToCart={addToCart} />
      <HomepageMenu addToCart={addToCart} />
      <Footer />
    </div>
  );
}
export default Homepage;