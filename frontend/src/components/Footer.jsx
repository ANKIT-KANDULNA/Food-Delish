import { Link } from "react-router-dom";

function Footer(){
    return (
        <div className="bg-[#1f1f1f] text-gray-300 px-6 md:px-16 py-8 md:py-12">
            <h2 className="text-2xl font-bold text-orange-500 mb-8 md:mb-10 text-center md:text-left">
                FOOD DELiSH
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-10 text-center sm:text-left">
                <div>
                    <h3 className="text-white font-semibold mb-4">Company</h3>
                    <nav className="flex flex-col gap-2 text-sm">
                    <Link to="/about" className="hover:text-orange-400 transition">About</Link>
                    <Link to="/careers" className="hover:text-orange-400 transition">Careers</Link>
                    <Link to="/about" className="hover:text-orange-400 transition">Blog</Link>
                    <Link to="/terms" className="hover:text-orange-400 transition">Terms</Link>
                    </nav>
                </div>

                <div>
                    <h3 className="font-semibold text-white mb-3">Support</h3>
                    <nav className="flex flex-col gap-2 text-sm">
                    <Link to="/privacy" className="hover:text-orange-400 transition">Help Center</Link>
                    <Link to="/about" className="hover:text-orange-400 transition">Contact Us</Link>
                    <Link to="/about" className="hover:text-orange-400 transition">FAQs</Link>
                    <Link to="/privacy" className="hover:text-orange-400 transition">Customer Care</Link>
                    </nav>
                </div>

                <div>
                    <h3 className="font-semibold text-white mb-3">Explore</h3>
                    <nav className="flex flex-col gap-2 text-sm">
                    <Link to="/menu" className="hover:text-orange-400 transition">Menu</Link>
                    <Link to="/menu" className="hover:text-orange-400 transition">Offers</Link>
                    <Link to="/" className="hover:text-orange-400 transition">Restaurants</Link>
                    <Link to="/orders" className="hover:text-orange-400 transition">Track Order</Link>
                    </nav>
                </div>

                <div>
                    <h3 className="font-semibold text-white mb-3">Follow Us</h3>
                    <nav className="flex flex-col gap-2 text-sm">
                    <a href="#" className="hover:text-orange-400 transition">Instagram</a>
                    <a href="#" className="hover:text-orange-400 transition">Twitter</a>
                    <a href="#" className="hover:text-orange-400 transition">LinkedIn</a>
                    </nav>
                </div>
            </div>

            <div className="mt-10 text-center border-t border-gray-700 pt-6 space-y-2">
                <p>
                    Made with <span className="text-red-500 animate-pulse">❤️</span> using MERN
                    | Designed & Developed by{" "}
                    <span className="text-red-500 font-semibold hover:underline cursor-pointer">
                    Ankit Kandulna
                    </span>
                </p>
                <p className="text-gray-400 text-xs mt-1">
                    © 2026{" "}
                    <span className="font-bold text-gray-600">FoodDelish</span>
                    . All rights reserved.
                </p>
                <p className="italic text-gray-400 text-xs mt-1">
                    Delicious food, delivered with love.
                </p>
                </div>
        </div>
    );
}
export default Footer;