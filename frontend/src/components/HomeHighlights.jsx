const HIGHLIGHTS = [
  {
    icon: "⚡",
    title: "Quick delivery",
    text: "Hot food routed from kitchen to your door with live order updates.",
  },
  {
    icon: "🌿",
    title: "Quality first",
    text: "Ingredients picked for taste and consistency—same great flavor every time.",
  },
  {
    icon: "🔒",
    title: "Secure checkout",
    text: "Save addresses and pay with confidence; your cart syncs while you browse.",
  },
  {
    icon: "🎉",
    title: "Deals & bestsellers",
    text: "Spotlight offers and crowd favorites so you never run out of ideas.",
  },
];

function HomeHighlights() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
      <div className="text-center max-w-2xl mx-auto mb-10 md:mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Why FoodDelish?</h2>
        <p className="mt-3 text-gray-600">
          Everything you need for a smooth ordering experience—built for busy weeknights and weekend treats alike.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {HIGHLIGHTS.map(({ icon, title, text }) => (
          <article
            key={title}
            className="rounded-2xl bg-white border border-orange-100 shadow-sm p-6 hover:shadow-md hover:border-orange-200/80 transition-shadow"
          >
            <div className="text-3xl mb-3" aria-hidden>
              {icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="mt-2 text-sm text-gray-600 leading-relaxed">{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default HomeHighlights;
