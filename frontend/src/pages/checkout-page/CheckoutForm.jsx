import { useState } from "react";
import { User, Phone, MapPin, Home, Tag } from "lucide-react";

const FIELDS = [
  { name: "fullName",    label: "Full Name",      icon: User,   col: 1, type: "text",  placeholder: "Raj Sharma" },
  { name: "phone",       label: "Phone Number",   icon: Phone,  col: 2, type: "tel",   placeholder: "+91 98765 43210" },
  { name: "addressLine", label: "Street Address", icon: MapPin, col: 2, type: "text",  placeholder: "B-12, MG Road" },
  { name: "city",        label: "City",           icon: Home,   col: 1, type: "text",  placeholder: "Mumbai" },
  { name: "pincode",     label: "Pin Code",       icon: null,   col: 1, type: "text",  placeholder: "400001" },
];

function CheckoutForm({ address, onChange, promoCode, onPromoChange, promoApplied, onApplyPromo }) {
  return (
    <div className="bg-white p-5 sm:p-8 rounded-3xl shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-[rgb(252,90,9)]/10 rounded-lg">
          <User className="w-5 h-5 text-[rgb(252,90,9)]" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Delivery Details</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {FIELDS.map(({ name, label, icon: Icon, col, type, placeholder }) => (
          <div key={name} className={`flex flex-col gap-1.5 ${col === 2 ? "md:col-span-2" : ""}`}>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
              {label}
            </label>
            <div className="relative">
              {Icon && (
                <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              )}
              <input
                type={type}
                placeholder={placeholder}
                value={address[name] || ""}
                onChange={e => onChange(name, e.target.value)}
                className={`w-full ${Icon ? "pl-10" : "pl-4"} pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl 
                  focus:bg-white focus:ring-2 focus:ring-[rgb(252,90,9)]/20 focus:border-[rgb(252,90,9)] 
                  outline-none transition-all`}
                required
              />
            </div>
          </div>
        ))}
      </div>

      {/* Promo Code */}
      <div className="mt-6">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1 block mb-1.5">
          Promo Code
        </label>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="e.g. FIRST50"
              value={promoCode}
              onChange={e => onPromoChange(e.target.value.toUpperCase())}
              disabled={promoApplied}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none 
                focus:bg-white focus:ring-2 focus:ring-[rgb(252,90,9)]/20 focus:border-[rgb(252,90,9)] 
                transition-all disabled:opacity-60"
            />
          </div>
          <button
            onClick={onApplyPromo}
            disabled={!promoCode || promoApplied}
            className="px-5 py-3 bg-[rgb(252,90,9)] text-white rounded-xl font-bold text-sm
              disabled:opacity-40 hover:bg-orange-600 transition"
          >
            {promoApplied ? "✓ Applied" : "Apply"}
          </button>
        </div>
        {promoApplied && (
          <p className="text-green-500 text-xs font-semibold mt-2">
            🎉 Promo code applied! ₹50 off your order.
          </p>
        )}
        <p className="text-gray-400 text-xs mt-1">Try: FIRST50 for ₹50 off</p>
      </div>
    </div>
  );
}

export default CheckoutForm;