import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useStore } from "../context/StoreContext";
import { formatPrice } from "../data/products";

const nigerianStates = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe", "Imo", "Jigawa",
  "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger",
  "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara", "FCT"
];

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const { settings } = useStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "", city: "", state: "", delivery: "delivery", payment: "bank" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState(false);

  const deliveryFee = form.delivery === "delivery" ? settings.deliveryFee : 0;
  const total = totalPrice + deliveryFee;

  const update = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => { const n = { ...e }; delete n[field]; return n; });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    else if (!/^(\+?234|0)[789]\d{9}$/.test(form.phone.replace(/\s/g, ""))) e.phone = "Enter a valid Nigerian phone number";
    if (form.delivery === "delivery") {
      if (!form.address.trim()) e.address = "Delivery address is required";
      if (!form.city.trim()) e.city = "City is required";
      if (!form.state) e.state = "State is required";
    }
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 1800));
    clearCart();
    navigate("/order-confirmation", { state: { form, total, items: [...items] } });
  };

  if (items.length === 0) {
    return (
      <div className="pt-16 flex flex-col items-center justify-center min-h-screen text-center px-4" style={{ background: "#FFFCF4" }}>
        <div className="text-5xl mb-4">🛒</div>
        <h2 className="font-bold text-xl mb-4" style={{ fontFamily: "var(--font-display)" }}>Your cart is empty</h2>
        <Link to="/shop" className="px-6 py-3 rounded-xl text-sm font-semibold text-white" style={{ background: "#FF6115", fontFamily: "var(--font-display)" }}>Shop Now</Link>
      </div>
    );
  }

  return (
    <div style={{ background: "#FFFCF4", minHeight: "100vh" }} className="pt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: "#AAAAAA", fontFamily: "var(--font-body)" }}>
          <Link to="/" className="hover:text-orange-500">Home</Link><span>/</span>
          <Link to="/cart" className="hover:text-orange-500">Cart</Link><span>/</span>
          <span style={{ color: "#151515" }}>Checkout</span>
        </nav>

        <h1 className="text-2xl md:text-3xl font-extrabold mb-8" style={{ fontFamily: "var(--font-display)", color: "#151515", letterSpacing: "-0.025em" }}>Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact */}
              <div className="rounded-2xl p-6" style={{ background: "#FFFFFF", border: "1px solid #E8E5DE" }}>
                <h3 className="font-bold text-base mb-5" style={{ fontFamily: "var(--font-display)", color: "#151515" }}>Contact Information</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { id: "name", label: "Full Name", placeholder: "e.g. Chidera Okafor", type: "text" },
                    { id: "phone", label: "Phone Number", placeholder: "e.g. 08012345678", type: "tel" },
                    { id: "email", label: "Email (optional)", placeholder: "you@example.com", type: "email" },
                  ].map((f) => (
                    <div key={f.id} className={f.id === "name" ? "sm:col-span-2" : ""}>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: "#555555", fontFamily: "var(--font-display)" }}>{f.label}</label>
                      <input
                        type={f.type}
                        value={form[f.id as keyof typeof form]}
                        onChange={(e) => update(f.id, e.target.value)}
                        placeholder={f.placeholder}
                        className="w-full h-11 px-4 rounded-xl text-sm outline-none transition-all"
                        style={{
                          border: errors[f.id] ? "1.5px solid #EF4444" : "1.5px solid #E8E5DE",
                          background: "#FAFAF8",
                          fontFamily: "var(--font-body)",
                          color: "#151515",
                        }}
                        onFocus={(e) => { if (!errors[f.id]) e.target.style.borderColor = "#FF6115"; }}
                        onBlur={(e) => { if (!errors[f.id]) e.target.style.borderColor = "#E8E5DE"; }}
                      />
                      {errors[f.id] && <p className="text-xs mt-1 text-red-500">{errors[f.id]}</p>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery method */}
              <div className="rounded-2xl p-6" style={{ background: "#FFFFFF", border: "1px solid #E8E5DE" }}>
                <h3 className="font-bold text-base mb-5" style={{ fontFamily: "var(--font-display)", color: "#151515" }}>Delivery Method</h3>
                <div className="grid sm:grid-cols-2 gap-3 mb-6">
                  {[
                    { id: "delivery", icon: "🚚", label: "Home Delivery", sub: `+${formatPrice(settings.deliveryFee)}` },
                    { id: "pickup", icon: "📍", label: "Store Pickup — Free", sub: "Ikeja, Lagos · Mon–Sat 8am–7pm" },
                  ].map((opt) => (
                    <label
                      key={opt.id}
                      className="flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-all"
                      style={{
                        border: form.delivery === opt.id ? "2px solid #FF6115" : "1.5px solid #E8E5DE",
                        background: form.delivery === opt.id ? "rgba(255,97,21,0.04)" : "#FAFAF8",
                      }}
                    >
                      <input type="radio" name="delivery" value={opt.id} checked={form.delivery === opt.id} onChange={(e) => update("delivery", e.target.value)} className="mt-0.5" style={{ accentColor: "#FF6115" }} />
                      <div>
                        <span className="mr-1">{opt.icon}</span>
                        <span className="font-semibold text-sm" style={{ fontFamily: "var(--font-display)", color: "#151515" }}>{opt.label}</span>
                        <p className="text-xs mt-0.5" style={{ color: "#777777" }}>{opt.sub}</p>
                      </div>
                    </label>
                  ))}
                </div>

                {form.delivery === "delivery" && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      { id: "address", label: "Delivery Address", placeholder: "e.g. 14 Bode Thomas Street", colSpan: true },
                      { id: "city", label: "City", placeholder: "e.g. Surulere" },
                    ].map((f) => (
                      <div key={f.id} className={f.colSpan ? "sm:col-span-2" : ""}>
                        <label className="block text-xs font-semibold mb-1.5" style={{ color: "#555555", fontFamily: "var(--font-display)" }}>{f.label}</label>
                        <input
                          type="text"
                          value={form[f.id as keyof typeof form]}
                          onChange={(e) => update(f.id, e.target.value)}
                          placeholder={f.placeholder}
                          className="w-full h-11 px-4 rounded-xl text-sm outline-none transition-all"
                          style={{ border: errors[f.id] ? "1.5px solid #EF4444" : "1.5px solid #E8E5DE", background: "#FAFAF8", fontFamily: "var(--font-body)", color: "#151515" }}
                          onFocus={(e) => { if (!errors[f.id]) e.target.style.borderColor = "#FF6115"; }}
                          onBlur={(e) => { if (!errors[f.id]) e.target.style.borderColor = "#E8E5DE"; }}
                        />
                        {errors[f.id] && <p className="text-xs mt-1 text-red-500">{errors[f.id]}</p>}
                      </div>
                    ))}
                    <div>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: "#555555", fontFamily: "var(--font-display)" }}>State</label>
                      <select
                        value={form.state}
                        onChange={(e) => update("state", e.target.value)}
                        className="w-full h-11 px-4 rounded-xl text-sm outline-none cursor-pointer"
                        style={{ border: errors.state ? "1.5px solid #EF4444" : "1.5px solid #E8E5DE", background: "#FAFAF8", fontFamily: "var(--font-body)", color: form.state ? "#151515" : "#999999" }}
                      >
                        <option value="">Select State</option>
                        {nigerianStates.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                      {errors.state && <p className="text-xs mt-1 text-red-500">{errors.state}</p>}
                    </div>
                  </div>
                )}
              </div>

              {/* Payment */}
              <div className="rounded-2xl p-6" style={{ background: "#FFFFFF", border: "1px solid #E8E5DE" }}>
                <h3 className="font-bold text-base mb-5" style={{ fontFamily: "var(--font-display)", color: "#151515" }}>Payment Method</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { id: "bank", icon: "🏦", label: "Bank Transfer", sub: "Send to our GTBank account" },
                    { id: "pos", icon: "💳", label: "POS / Card", sub: "Pay in-store with card" },
                    { id: "opay", icon: "📱", label: "Opay", sub: "Pay via Opay wallet" },
                    { id: "palmpay", icon: "🌴", label: "Palmpay", sub: "Pay via Palmpay wallet" },
                  ].map((opt) => (
                    <label
                      key={opt.id}
                      className="flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-all"
                      style={{
                        border: form.payment === opt.id ? "2px solid #FF6115" : "1.5px solid #E8E5DE",
                        background: form.payment === opt.id ? "rgba(255,97,21,0.04)" : "#FAFAF8",
                      }}
                    >
                      <input type="radio" name="payment" value={opt.id} checked={form.payment === opt.id} onChange={(e) => update("payment", e.target.value)} className="mt-0.5" style={{ accentColor: "#FF6115" }} />
                      <div>
                        <span className="mr-1">{opt.icon}</span>
                        <span className="font-semibold text-sm" style={{ fontFamily: "var(--font-display)", color: "#151515" }}>{opt.label}</span>
                        <p className="text-xs mt-0.5" style={{ color: "#777777" }}>{opt.sub}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Summary */}
            <div>
              <div className="rounded-2xl p-6 sticky top-24" style={{ background: "#FFFFFF", border: "1px solid #E8E5DE" }}>
                <h3 className="font-bold text-base mb-5" style={{ fontFamily: "var(--font-display)", color: "#151515" }}>Order Summary</h3>
                <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0" style={{ background: "#F5F2EA" }}>
                        <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium line-clamp-1" style={{ fontFamily: "var(--font-display)", color: "#151515" }}>{item.product.name}</p>
                        <p className="text-[11px]" style={{ color: "#AAAAAA" }}>× {item.quantity}</p>
                      </div>
                      <span className="text-xs font-semibold flex-shrink-0" style={{ fontFamily: "var(--font-display)" }}>{formatPrice(item.product.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-2.5 pt-4 border-t mb-4" style={{ borderColor: "#F0EDE6" }}>
                  <div className="flex justify-between text-sm" style={{ color: "#555555" }}>
                    <span>Subtotal</span><span className="font-medium">{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm" style={{ color: "#555555" }}>
                    <span>Delivery</span>
                    <span className="font-medium">{form.delivery === "pickup" ? "Free" : formatPrice(deliveryFee)}</span>
                  </div>
                </div>
                <div className="flex justify-between items-baseline mb-6 pt-3 border-t" style={{ borderColor: "#F0EDE6" }}>
                  <span className="font-bold" style={{ fontFamily: "var(--font-display)", color: "#151515" }}>Total</span>
                  <span className="text-xl font-extrabold" style={{ fontFamily: "var(--font-display)", color: "#151515" }}>{formatPrice(total)}</span>
                </div>

                <button
                  type="submit"
                  disabled={processing}
                  className="w-full h-12 rounded-xl font-semibold text-sm text-white mb-3 transition-all hover:opacity-90 active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
                  style={{ background: "#FF6115", fontFamily: "var(--font-display)" }}
                >
                  {processing ? (
                    <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing...</>
                  ) : (
                    "Place Order"
                  )}
                </button>

                <p className="text-center text-[11px]" style={{ color: "#AAAAAA", fontFamily: "var(--font-body)" }}>
                  Our team will confirm your order via phone/WhatsApp within 30 minutes.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
