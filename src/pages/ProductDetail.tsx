import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { formatPrice, buildWhatsAppLink } from "../data/products";
import { useStore } from "../context/StoreContext";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ProductCard";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, settings } = useStore();
  const product = products.find((p) => p.id === id);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [added, setAdded] = useState(false);
  const { addItem, wishlist, toggleWishlist } = useCart();

  useEffect(() => {
    if (!product) return;
    const storageKey = "zat-recently-viewed";
    try {
      const savedIds = JSON.parse(localStorage.getItem(storageKey) || "[]") as string[];
      const nextIds = [product.id, ...savedIds.filter((savedId) => savedId !== product.id)].slice(0, 8);
      localStorage.setItem(storageKey, JSON.stringify(nextIds));
    } catch {
      localStorage.setItem(storageKey, JSON.stringify([product.id]));
    }
  }, [product]);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen pt-16" style={{ background: "#FFFCF4" }}>
        <p className="text-5xl mb-4">🔍</p>
        <h2 className="font-bold text-2xl mb-2" style={{ fontFamily: "var(--font-display)" }}>Product not found</h2>
        <Link to="/shop" className="mt-4 px-6 py-3 rounded-xl text-sm font-semibold text-white" style={{ background: "#FF6115", fontFamily: "var(--font-display)" }}>
          Back to Shop
        </Link>
      </div>
    );
  }

  const images = product.images || [product.image, product.image, product.image];
  const inWishlist = wishlist.includes(product.id);
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const stockColors: Record<string, string> = {
    in_stock: "#2D9E58",
    low_stock: "#F59E0B",
    out_of_stock: "#EF4444",
    coming_soon: "#6B7280",
  };
  const stockLabels: Record<string, string> = {
    in_stock: "In Stock",
    low_stock: "Low Stock — Order Soon",
    out_of_stock: "Out of Stock",
    coming_soon: "Coming Soon",
  };

  const handleAddToCart = () => {
    if (product.stock === "out_of_stock") return;
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div style={{ background: "#FFFCF4", minHeight: "100vh" }} className="pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs mb-8" style={{ color: "#AAAAAA", fontFamily: "var(--font-body)" }}>
          <Link to="/" className="hover:text-orange-500 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-orange-500 transition-colors">Shop</Link>
          <span>/</span>
          <Link to={`/shop?category=${product.category}`} className="hover:text-orange-500 transition-colors capitalize">
            {product.category.replace("-", " ")}
          </Link>
          <span>/</span>
          <span style={{ color: "#151515" }} className="line-clamp-1">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Left — Gallery */}
          <div>
            <div
              className="relative overflow-hidden rounded-2xl mb-4"
              style={{ aspectRatio: "1/1", background: "#F5F2EA" }}
            >
              <img
                src={images[activeImg]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.isNew && (
                <span className="absolute top-4 left-4 text-white text-xs font-bold px-2.5 py-1 rounded-lg" style={{ background: "#FF6115", fontFamily: "var(--font-display)" }}>NEW</span>
              )}
            </div>
            <div className="flex gap-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className="flex-1 overflow-hidden rounded-xl transition-all"
                  style={{
                    aspectRatio: "1/1",
                    background: "#F5F2EA",
                    border: activeImg === i ? "2px solid #FF6115" : "2px solid transparent",
                    opacity: activeImg === i ? 1 : 0.65,
                  }}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right — Info */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#FF6115", fontFamily: "var(--font-display)" }}>
              {product.brand}
            </p>
            <h1
              className="text-2xl md:text-3xl font-extrabold mb-3 leading-tight"
              style={{ fontFamily: "var(--font-display)", color: "#151515", letterSpacing: "-0.025em" }}
            >
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((s) => (
                  <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill={s <= Math.round(product.rating) ? "#F59E0B" : "#E5E7EB"}>
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                ))}
              </div>
              <span className="text-sm" style={{ color: "#777777" }}>{product.rating} ({product.reviewCount} reviews)</span>
              <span className="text-sm" style={{ color: "#CCCCCC" }}>|</span>
              <span className="text-xs" style={{ color: "#AAAAAA", fontFamily: "var(--font-body)" }}>SKU: {product.sku}</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-3xl font-extrabold" style={{ fontFamily: "var(--font-display)", color: "#151515" }}>
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-lg line-through" style={{ color: "#BBBBBB", fontFamily: "var(--font-body)" }}>
                    {formatPrice(product.originalPrice)}
                  </span>
                  <span className="text-sm font-bold px-2 py-0.5 rounded-md text-white" style={{ background: "#FF6115", fontFamily: "var(--font-display)" }}>
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2 mb-5">
              <span className="w-2 h-2 rounded-full" style={{ background: stockColors[product.stock] }} />
              <span className="text-sm font-semibold" style={{ color: stockColors[product.stock], fontFamily: "var(--font-display)" }}>
                {stockLabels[product.stock]}
              </span>
            </div>

            <p className="text-sm leading-relaxed mb-6" style={{ color: "#555555", fontFamily: "var(--font-body)" }}>
              {product.description}
            </p>

            {/* Compatibility (spare parts) */}
            {product.compatible && product.compatible.length > 0 && (
              <div className="mb-6 p-4 rounded-xl" style={{ background: "rgba(255,97,21,0.06)", border: "1px solid rgba(255,97,21,0.15)" }}>
                <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#FF6115", fontFamily: "var(--font-display)" }}>Compatibility</p>
                <p className="text-sm" style={{ color: "#333333", fontFamily: "var(--font-body)" }}>
                  {product.compatible.join(" · ")}
                </p>
                {product.condition && (
                  <p className="text-xs mt-1" style={{ color: "#777777" }}>
                    Part Quality: <strong>{product.condition}</strong>
                  </p>
                )}
                <p className="text-xs mt-2 text-orange-600 font-medium" style={{ fontFamily: "var(--font-display)" }}>
                  ⚠ Please confirm your exact phone model before ordering.
                </p>
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <label className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)", color: "#333333" }}>Quantity</label>
              <div className="flex items-center rounded-xl overflow-hidden" style={{ border: "1px solid #E8E5DE" }}>
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-black/5 transition-colors"
                  style={{ color: "#333333" }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </button>
                <span className="w-10 text-center font-semibold text-sm" style={{ fontFamily: "var(--font-display)" }}>{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-black/5 transition-colors"
                  style={{ color: "#333333" }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </button>
              </div>
              <button
                onClick={() => toggleWishlist(product.id)}
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
                style={{
                  border: "1px solid #E8E5DE",
                  background: inWishlist ? "rgba(255,97,21,0.08)" : "#FFFFFF",
                  color: inWishlist ? "#FF6115" : "#777777",
                }}
                aria-label="Wishlist"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill={inWishlist ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </button>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === "out_of_stock"}
                className="flex-1 h-13 px-6 py-3.5 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                style={{ background: added ? "#2D9E58" : "#FF6115", fontFamily: "var(--font-display)" }}
              >
                {added ? (
                  <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Added to Cart!</>
                ) : (
                  <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg> Add to Cart</>
                )}
              </button>
              <a
                href={buildWhatsAppLink(product, settings.whatsappNumber)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 h-13 px-6 py-3.5 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90 active:scale-95 flex items-center justify-center gap-2"
                style={{ background: "#25D366", fontFamily: "var(--font-display)" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Buy via WhatsApp
              </a>
            </div>

            {/* Info strips */}
            <div className="space-y-2.5">
              {[
                { icon: "🚚", text: "Delivery across Nigeria (1–5 days) · Free pickup at our Ikeja store" },
                { icon: "🔒", text: "Secure payment — Bank transfer, POS, Opay, Palmpay accepted" },
                { icon: "↩", text: "7-day returns for unopened/uninstalled items in original packaging" },
              ].map((info) => (
                <div key={info.text} className="flex items-start gap-3 text-sm" style={{ color: "#555555", fontFamily: "var(--font-body)" }}>
                  <span className="mt-0.5">{info.icon}</span>
                  <span>{info.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Specifications */}
        {product.specs && Object.keys(product.specs).length > 0 && (
          <div className="mb-16">
            <h2 className="text-xl font-extrabold mb-6" style={{ fontFamily: "var(--font-display)", color: "#151515" }}>Specifications</h2>
            <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #E8E5DE" }}>
              {Object.entries(product.specs).map(([key, value], i) => (
                <div
                  key={key}
                  className="flex items-start gap-4 px-6 py-3.5"
                  style={{ background: i % 2 === 0 ? "#FFFFFF" : "#FAFAF8", borderBottom: i < Object.keys(product.specs!).length - 1 ? "1px solid #F0EDE6" : "none" }}
                >
                  <span className="w-36 flex-shrink-0 text-sm font-semibold" style={{ color: "#777777", fontFamily: "var(--font-display)" }}>{key}</span>
                  <span className="text-sm" style={{ color: "#151515", fontFamily: "var(--font-body)" }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Products */}
        {related.length > 0 && (
          <div>
            <h2 className="text-xl font-extrabold mb-6" style={{ fontFamily: "var(--font-display)", color: "#151515" }}>You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
