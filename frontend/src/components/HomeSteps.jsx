import { Link } from "react-router-dom";

const STEPS = [
  { n: "1", title: "Browse the menu", text: "Search categories or jump to bestsellers and daily deals." },
  { n: "2", title: "Add to cart", text: "Pick variants, review your bag, and apply promos at checkout." },
  { n: "3", title: "Relax & enjoy", text: "Track status from confirmed to delivered—then order again anytime." },
];

function HomeSteps() {
  return (
    <section className="bg-white/80 border-y border-orange-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900">How ordering works</h2>
        <p className="text-center text-gray-600 mt-2 max-w-xl mx-auto">
          Three simple steps from hungry to happy.
        </p>
        <ol className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
          {STEPS.map(({ n, title, text }) => (
            <li key={n} className="relative flex gap-4 md:flex-col md:text-center md:items-center">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[rgb(252,90,9)] text-white text-lg font-bold shadow-md md:mx-auto">
                {n}
              </span>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">{text}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="text-center mt-10">
          <Link
            to="/menu"
            className="inline-flex text-[rgb(252,90,9)] font-semibold hover:underline"
          >
            Start browsing the full menu →
          </Link>
        </p>
      </div>
    </section>
  );
}

export default HomeSteps;
