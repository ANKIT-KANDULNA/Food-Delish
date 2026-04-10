import { useLocation, Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const CONTENT_MAP = {
  about: {
    title: "About FoodDelish",
    subtitle: "Delicious food, delivered with love and speed.",
    text: `Founded in 2026, FoodDelish started with a simple mission: to bring the best local restaurants directly to your doorstep. We believe that good food shouldn't just be about the taste—it's about the experience, the convenience, and the joy of sharing a meal with loved ones. Our team works tirelessly to ensure that every order is handled with care, from the moment it's prepared by our partner chefs to the moment it arrives at your door.`,
    stats: [
      { label: "Restaurants", value: "500+" },
      { label: "Daily Orders", value: "10,000+" },
      { label: "Cities", value: "50+" },
    ]
  },
  careers: {
    title: "Join the Team",
    subtitle: "Build the future of food delivery with us.",
    text: `We are always looking for passionate individuals to join our growing family. Whether you are a tech wizard, a marketing guru, or a delivery champion, there's a place for you at FoodDelish. We offer a fast-paced environment, competitive benefits, and the chance to make a real impact on how people eat every day. Check out our open roles in Engineering, Operations, and Creative.`,
    stats: [
      { label: "Employees", value: "200+" },
      { label: "Delivery Partners", value: "5,000+" },
      { label: "Happiness Rate", value: "99%" },
    ]
  },
  birthday: {
    title: "Birthday & Parties",
    subtitle: "Make your special day even more delicious.",
    text: `Planning a celebration? Let FoodDelish handle the menu! We offer bulk ordering, special party platters, and dedicated delivery slots to ensure your party food is fresh, hot, and arrives exactly when you need it. From office lunches to house-warming parties and big birthday bashes, we have catering options for groups of all sizes. Contact our events team for custom packages and exclusive discounts.`,
    stats: [
      { label: "Parties Served", value: "1,200+" },
      { label: "Custom Menus", value: "Available" },
      { label: "Bulk Discounts", value: "Up to 20%" },
    ]
  },
  terms: {
    title: "Terms of Service",
    subtitle: "The legal stuff you should know.",
    text: `By using the FoodDelish platform, you agree to our terms and conditions. We strive to provide accurate delivery estimates, maintain the highest quality of food safety, and protect your data. These terms outline our responsibilities to you as a customer and your responsibilities as a user of our service. Please read them carefully to understand our policies regarding cancellations, refunds, and user accounts.`,
  },
  privacy: {
    title: "Privacy Policy",
    subtitle: "How we protect and use your data.",
    text: `Your privacy is our priority. We only collect the data necessary to provide you with the best delivery experience—such as your address, contact info, and order history. We never sell your personal information to third parties. Our systems use industry-standard encryption to keep your payment details secure. You have full control over your data and can request to view or delete it at any time through your profile settings.`,
  }
};

function StaticPage() {
  const location = useLocation();
  const path = location.pathname.split("/").pop();
  const content = CONTENT_MAP[path] || CONTENT_MAP.about;

  return (
    <div className="min-h-screen bg-[#fff8f3] py-16 px-6">
      <div className="max-w-3xl mx-auto">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-gray-400 hover:text-[rgb(252,90,9)] transition-colors mb-10 font-medium"
        >
          <ChevronLeft className="w-5 h-5" /> Back to Home
        </Link>

        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
          {content.title}
        </h1>
        <p className="text-xl text-[rgb(252,90,9)] font-bold mb-10 italic">
          "{content.subtitle}"
        </p>

        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 mb-12">
          <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">
            {content.text}
          </p>
        </div>

        {content.stats && (
          <div className="grid grid-cols-3 gap-4">
            {content.stats.map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 text-center">
                <p className="text-2xl font-black text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-16 pt-10 border-t border-gray-200 text-center">
          <p className="text-gray-400 text-sm mb-6">Want to explore our menu?</p>
          <Link 
            to="/menu"
            className="inline-block bg-[rgb(252,90,9)] text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-orange-600 transition shadow-lg shadow-orange-200"
          >
            Order Now
          </Link>
        </div>
      </div>
    </div>
  );
}

export default StaticPage;
