import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useStore } from "../context/StoreContext";
import { formatPrice } from "../data/products";
import ProductCard from "../components/ProductCard";

export default function Cart() {
  const { items, removeItem, updateQuantity, totalItems, totalPrice } = useCart();
  const { settings, products } = useStore();
  const navigate = useNavigate();
  const [recentIds, setRecentIds] = useState<string[]>([]);

  const deliveryFee = totalItems > 0 ? settings.deliveryFee : 0;
  const total = totalPrice + deliveryFee;
  const recentProducts = recentIds
    .map((id) => products.find((product) => product.id === id))
    .filter((product): product is (typeof products)[number] => Boolean(product))
    .filter((product) => !items.some((item) => item.product.id === product.id))
    .slice(0, 4);

  useEffect(() => {
    try {
      setRecentIds(JSON.parse(localStorage.getItem("zat-recently-viewed") || "[]"));
    } catch {
      setRecentIds([]);
    }
  }, []);

  const whatsappOrder = () => {
    const lines = items
      .map((i) => `- ${i.product.name} (SKU: ${i.product.sku}) × ${i.quantity} = ${formatPrice(i.product.price * i.quantity)}`)
      .join("\n");
    const msg = encodeURIComponent(
      `Hello ZAT Telecom, I'd like to place an order:\n\n${lines}\n\nSubtotal: ${formatPrice(totalPrice)}\nDelivery: ${formatPrice(deliveryFee)}\nTotal: ${formatPrice(total)}\n\nPlease confirm availability and delivery details.`
    );
    window.open(`https://wa.me/${settings.whatsappNumber}?text=${msg}`, "_blank");
  };

  if (items.length === 0) {
    return (
      <div className="pt-16 flex flex-col items-center justify-center min-h-screen text-center px-4" style={{ background: "#FFFCF4" }}>
        <div className="text-6xl mb-6">🛒</div>
        <h2 className="font-extrabold text-2xl mb-2" style={{ fontFamily: "var(--font-display)", color: "#151515" }}>Your cart is empty</h2>
        <p className="text-sm mb-8" style={{ color: "#777777" }}>Browse our products and add items to get started.</p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: "#FF6115", fontFamily: "var(--font-display)" }}
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div style={{ background: "#FFFCF4", minHeight: "100vh" }} className="pt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: "#AAAAAA", fontFamily: "var(--font-body)" }}>
          <Link to="/" className="hover:text-orange-500 transition-colors">Home</Link>
          <span>/</span>
          <span style={{ color: "#151515" }}>Cart</span>
        </nav>

        <h1 className="text-2xl md:text-3xl font-extrabold mb-8" style={{ fontFamily: "var(--font-display)", color: "#151515", letterSpacing: "-0.025em" }}>
          Shopping Cart <span className="text-base font-normal" style={{ color: "#777777" }}>({totalItems} item{totalItems !== 1 ? "s" : ""})</span>
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-3">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-4 rounded-2xl p-4 transition-all"
                style={{ background: "#FFFFFF", border: "1px solid #E8E5DE" }}
              >
                <Link to={`/product/${item.product.id}`} className="flex-shrink-0 w-20 h-20 overflow-hidden rounded-xl" style={{ background: "#F5F2EA" }}>
                  <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-[11px] font-semibold uppercase" style={{ color: "#FF6115", fontFamily: "var(--font-display)" }}>{item.product.brand}</p>
                      <Link to={`/product/${item.product.id}`} className="font-semibold text-sm leading-snug line-clamp-2 hover:text-orange-500 transition-colors" style={{ fontFamily: "var(--font-display)", color: "#151515" }}>
                        {item.product.name}
                      </Link>
                      {item.product.condition && (
                        <p className="text-[11px] mt-0.5" style={{ color: "#777777" }}>Condition: {item.product.condition}</p>
                      )}
                    </div>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors"
                      style={{ color: "#BBBBBB" }}
                      aria-label="Remove"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                      </svg>
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center rounded-lg overflow-hidden" style={{ border: "1px solid #E8E5DE" }}>
                      <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-black/5 transition-colors text-sm font-bold" style={{ color: "#333333" }}>−</button>
                      <span className="w-8 text-center text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-black/5 transition-colors text-sm font-bold" style={{ color: "#333333" }}>+</button>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-base" style={{ fontFamily: "var(--font-display)", color: "#151515" }}>{formatPrice(item.product.price * item.quantity)}</p>
                      {item.quantity > 1 && (
                        <p className="text-[11px]" style={{ color: "#AAAAAA" }}>{formatPrice(item.product.price)} each</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div>
            <div
              className="rounded-2xl p-6 sticky top-24"
              style={{ background: "#FFFFFF", border: "1px solid #E8E5DE" }}
            >
              <h3 className="font-extrabold text-lg mb-5" style={{ fontFamily: "var(--font-display)", color: "#151515" }}>Order Summary</h3>
              <div className="space-y-3 mb-5 pb-5 border-b" style={{ borderColor: "#F0EDE6" }}>
                <div className="flex justify-between text-sm" style={{ fontFamily: "var(--font-body)", color: "#555555" }}>
                  <span>Subtotal ({totalItems} items)</span>
                  <span className="font-medium">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm" style={{ fontFamily: "var(--font-body)", color: "#555555" }}>
                  <span>Delivery</span>
                  <span className="font-medium">{formatPrice(deliveryFee)}</span>
                </div>
              </div>
              <div className="flex justify-between items-baseline mb-6">
                <span className="font-bold" style={{ fontFamily: "var(--font-display)", color: "#151515" }}>Total</span>
                <span className="text-xl font-extrabold" style={{ fontFamily: "var(--font-display)", color: "#151515" }}>{formatPrice(total)}</span>
              </div>
              <button
                onClick={() => navigate("/checkout")}
                className="w-full h-12 rounded-xl font-semibold text-sm text-white mb-3 transition-all hover:opacity-90 active:scale-95"
                style={{ background: "#FF6115", fontFamily: "var(--font-display)" }}
              >
                Proceed to Checkout
              </button>
              <button
                onClick={whatsappOrder}
                className="w-full h-12 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90 flex items-center justify-center gap-2"
                style={{ background: "#25D366", fontFamily: "var(--font-display)" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Order via WhatsApp
              </button>
              <p className="text-center text-xs mt-4" style={{ color: "#AAAAAA", fontFamily: "var(--font-body)" }}>
                Free pickup available at our Ikeja store
              </p>
            </div>
          </div>
        </div>

        {recentProducts.length > 0 && (
          <section className="mt-14 border-t pt-10" style={{ borderColor: "#E8E5DE" }}>
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#FF6115", fontFamily: "var(--font-display)" }}>Keep browsing</p>
                <h2 className="mt-2 text-2xl font-extrabold" style={{ color: "#151515", fontFamily: "var(--font-display)" }}>Recently Viewed Products</h2>
              </div>
              <Link to="/shop" className="text-sm font-semibold hover:opacity-75" style={{ color: "#FF6115", fontFamily: "var(--font-display)" }}>View all</Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {recentProducts.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
