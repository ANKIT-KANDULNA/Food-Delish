import Deal from "../components/Deal";
import Header from "../components/Header";
import HomepageMenu from "../components/HomepageMenu";
import Footer from "../components/Footer";
import HomeHero from "../components/HomeHero";
import HomeHighlights from "../components/HomeHighlights";
import HomeSteps from "../components/HomeSteps";

function Homepage({ addToCart }) {
  return (
    <div className="bg-[#fff8f3] min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HomeHero />
        <Deal addToCart={addToCart} />
        <HomeHighlights />
        <HomepageMenu addToCart={addToCart} />
        <HomeSteps />
      </main>
      <Footer />
    </div>
  );
}

export default Homepage;
