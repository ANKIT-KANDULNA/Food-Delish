import { Link } from "react-router-dom";

function HomeHero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[rgb(252,90,9)] via-[#e85a0c] to-[#c94a08]" />
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_20%,white_0%,transparent_50%)]" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20 text-white text-center md:text-left">
        <div className="md:flex md:items-center md:justify-between md:gap-10">
          <div className="max-w-xl mx-auto md:mx-0">
            <p className="text-sm sm:text-base font-medium text-white/90 tracking-wide uppercase mb-3">
              Fresh · Fast · Flavorful
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight drop-shadow-sm">
              Craving something delicious tonight?
            </h2>
            <p className="mt-4 text-base sm:text-lg text-white/90 leading-relaxed">
              Browse bestsellers, grab today&apos;s deals, and checkout in minutes. Your next favorite meal is a few taps away.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start">
              <Link
                to="/menu"
                className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3.5 text-lg font-semibold text-[rgb(252,90,9)] shadow-lg hover:scale-[1.02] active:scale-[0.98] transition"
              >
                Order now
              </Link>
              <Link
                to="/orders"
                className="inline-flex items-center justify-center rounded-full border-2 border-white/80 px-8 py-3.5 text-lg font-semibold text-white hover:bg-white/10 transition"
              >
                Track my order
              </Link>
            </div>
          </div>
          <div className="hidden md:block shrink-0 w-72 h-72 rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20 p-6 text-left shadow-xl">
            <p className="text-sm font-semibold text-white/80">Tonight&apos;s picks</p>
            <ul className="mt-4 space-y-3 text-white/95">
              <li className="flex items-center gap-2">
                <span className="text-xl">🍕</span>
                <span>Wood-fired pizzas &amp; sides</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-xl">🥗</span>
                <span>Fresh bowls &amp; salads</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-xl">🍰</span>
                <span>Desserts &amp; treats</span>
              </li>
            </ul>
            <p className="mt-6 text-xs text-white/70 leading-relaxed">
              Use the deals carousel below for limited-time offers on popular items.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomeHero;
