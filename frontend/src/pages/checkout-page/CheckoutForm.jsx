import { User, Phone, MapPin, Mail, Home } from "lucide-react";

function CheckoutForm() {
  return (
    <div className="bg-white p-5 sm:p-8 rounded-3xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
      <div className="flex items-center gap-3 mb-6 sm:mb-8">
        <div className="p-2 bg-[rgb(252,90,9)]/10 rounded-lg">
          <User className="w-5 h-5 text-[rgb(252,90,9)]" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Delivery Details</h2>
      </div>

      <form className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Tu Yung"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[rgb(252,90,9)]/20 focus:border-[rgb(252,90,9)] outline-none transition-all"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="email" 
              placeholder="xyz@gmail.com"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[rgb(252,90,9)]/20 focus:border-[rgb(252,90,9)] outline-none transition-all"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Phone Number</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="tel" 
              placeholder="+91 (000) 000-0000"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[rgb(252,90,9)]/20 focus:border-[rgb(252,90,9)] outline-none transition-all"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Street Address</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="R-Block Dholakpur"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[rgb(252,90,9)]/20 focus:border-[rgb(252,90,9)] outline-none transition-all"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">House No.(Optional)</label>
          <div className="relative">
            <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder=""
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[rgb(252,90,9)]/20 focus:border-[rgb(252,90,9)] outline-none transition-all"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Pin Code</label>
          <input 
            type="text" 
            placeholder="110001"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[rgb(252,90,9)]/20 focus:border-[rgb(252,90,9)] outline-none transition-all"
          />
        </div>

      </form>
    </div>
  );
}
export default CheckoutForm;