import { useLocation, Link } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { formatPrice } from "../data/products";

export default function OrderConfirmation() {
  const location = useLocation();
  const { settings } = useStore();
  const { form, total, items } = (location.state || {}) as any;

  const orderNum = `ZAT-${Date.now().toString().slice(-6)}`;

  if (!form) {
    return (
      <div className="pt-16 min-h-screen flex flex-col items-center justify-center text-center px-4" style={{ background: "#FFFCF4" }}>
        <h2 className="font-bold text-xl mb-4" style={{ fontFamily: "var(--font-display)" }}>No order found</h2>
        <Link to="/shop" className="px-6 py-3 rounded-xl text-sm font-semibold text-white" style={{ background: "#FF6115", fontFamily: "var(--font-display)" }}>Shop Now</Link>
      </div>
    );
  }

  return (
    <div style={{ background: "#FFFCF4", minHeight: "100vh" }} className="pt-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-3xl mx-auto mb-6"
          style={{ background: "rgba(45,158,88,0.1)" }}
        >
          ✅
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-3" style={{ fontFamily: "var(--font-display)", color: "#151515", letterSpacing: "-0.025em" }}>
          Order Confirmed!
        </h1>
        <p className="text-base mb-1" style={{ color: "#555555", fontFamily: "var(--font-body)" }}>
          Thank you, <strong>{form.name}</strong>. Your order has been received.
        </p>
        <p className="text-sm mb-8" style={{ color: "#777777", fontFamily: "var(--font-body)" }}>
          Our team will contact you on <strong>{form.phone}</strong> within 30 minutes to confirm.
        </p>

        {/* Order details card */}
        <div
          className="rounded-2xl p-6 mb-6 text-left"
          style={{ background: "#FFFFFF", border: "1px solid #E8E5DE" }}
        >
          <div className="grid sm:grid-cols-3 gap-4 mb-6 pb-6 border-b" style={{ borderColor: "#F0EDE6" }}>
            <div>
              <p className="text-xs font-semibold uppercase mb-1" style={{ color: "#AAAAAA", fontFamily: "var(--font-display)" }}>Order Number</p>
              <p className="font-bold text-sm" style={{ fontFamily: "var(--font-display)", color: "#151515" }}>{orderNum}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase mb-1" style={{ color: "#AAAAAA", fontFamily: "var(--font-display)" }}>Payment</p>
              <p className="font-bold text-sm capitalize" style={{ fontFamily: "var(--font-display)", color: "#151515" }}>{form.payment === "bank" ? "Bank Transfer" : form.payment === "pos" ? "POS / Card" : form.payment}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase mb-1" style={{ color: "#AAAAAA", fontFamily: "var(--font-display)" }}>Delivery</p>
              <p className="font-bold text-sm" style={{ fontFamily: "var(--font-display)", color: "#151515" }}>{form.delivery === "pickup" ? "Store Pickup" : "Home Delivery"}</p>
            </div>
          </div>

          {items?.map((item: any) => (
            <div key={item.product.id} className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0" style={{ background: "#F5F2EA" }}>
                <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm line-clamp-1" style={{ fontFamily: "var(--font-display)", color: "#151515" }}>{item.product.name}</p>
                <p className="text-xs" style={{ color: "#AAAAAA" }}>× {item.quantity}</p>
              </div>
              <span className="font-semibold text-sm" style={{ fontFamily: "var(--font-display)" }}>{formatPrice(item.product.price * item.quantity)}</span>
            </div>
          ))}

          <div className="pt-4 border-t flex justify-between items-center" style={{ borderColor: "#F0EDE6" }}>
            <span className="font-bold" style={{ fontFamily: "var(--font-display)", color: "#151515" }}>Total Paid</span>
            <span className="text-xl font-extrabold" style={{ fontFamily: "var(--font-display)", color: "#FF6115" }}>{formatPrice(total)}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={`https://wa.me/${settings.whatsappNumber}?text=Hello%20ZAT%20Telecom%2C%20I%20just%20placed%20order%20${orderNum}.%20Please%20confirm.`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white"
            style={{ background: "#25D366", fontFamily: "var(--font-display)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Chat on WhatsApp
          </a>
          <Link
            to="/shop"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
            style={{ border: "1.5px solid #E8E5DE", color: "#151515", fontFamily: "var(--font-display)", background: "#FFFFFF" }}
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
