import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useStore } from "../context/StoreContext";
import type { Product } from "../data/products";
import { formatPrice, buildWhatsAppLink } from "../data/products";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const [hovered, setHovered] = useState(false);
  const [added, setAdded] = useState(false);
  const { addItem, wishlist, toggleWishlist } = useCart();
  const { settings } = useStore();

  const inWishlist = wishlist.includes(product.id);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.stock === "out_of_stock") return;
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="block group overflow-hidden transition-all duration-200"
      style={{
        background: "transparent",
        transform: hovered ? "translateY(-1px)" : "translateY(0)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div className="relative overflow-hidden rounded-md" style={{ aspectRatio: "1/1", background: "#F5F2EA" }}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300"
          style={{ transform: hovered ? "scale(1.05)" : "scale(1)" }}
        />
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isNew && (
            <span className="text-white text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ background: "#FF6115", fontFamily: "var(--font-display)" }}>
              NEW
            </span>
          )}
          {discount > 0 && (
            <span className="text-white text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ background: "#151515", fontFamily: "var(--font-display)" }}>
              -{discount}%
            </span>
          )}
          {product.condition && (
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.9)", color: "#777777", fontFamily: "var(--font-display)" }}>
              {product.condition}
            </span>
          )}
        </div>
        {/* Wishlist */}
        <button
          onClick={(e) => { e.preventDefault(); toggleWishlist(product.id); }}
          className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-150"
          style={{
            background: "rgba(255,255,255,0.92)",
            color: inWishlist ? "#FF6115" : "#777777",
            boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
          }}
          aria-label="Toggle wishlist"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill={inWishlist ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
        {/* Quick actions on hover */}
        <div
          className="absolute bottom-0 left-0 right-0 p-2 flex gap-1.5 transition-all duration-200"
          style={{
            opacity: hovered ? 1 : 0,
            transform: hovered ? "translateY(0)" : "translateY(8px)",
          }}
        >
          <button
            onClick={handleAdd}
            disabled={product.stock === "out_of_stock"}
            className="flex-1 h-8 rounded-lg text-white text-[11px] font-semibold transition-all duration-150 flex items-center justify-center gap-1.5 disabled:opacity-50"
            style={{
              background: added ? "#2D9E58" : "#FF6115",
              fontFamily: "var(--font-display)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
          >
            {added ? (
              <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Added</>
            ) : (
              <>Add to Cart</>
            )}
          </button>
          <a
            href={buildWhatsAppLink(product, settings.whatsappNumber)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white transition-all"
            style={{ background: "#25D366", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}
            aria-label="WhatsApp"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </a>
        </div>
      </div>

      {/* Info */}
      <div className="px-1 pt-2 pb-1">
        <h3
          className="text-[13px] font-medium leading-snug mb-1 truncate"
          style={{ fontFamily: "var(--font-display)", color: "#151515" }}
        >
          {product.name}
        </h3>
        {/* Price */}
        <div className="flex items-baseline gap-1.5">
          <span className="text-sm font-bold" style={{ fontFamily: "var(--font-display)", color: "#151515" }}>
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-xs line-through" style={{ color: "#BBBBBB", fontFamily: "var(--font-body)" }}>
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
