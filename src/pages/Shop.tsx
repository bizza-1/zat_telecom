import { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useStore } from "../context/StoreContext";
import { formatPrice } from "../data/products";

const priceRanges = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under ₦10,000", min: 0, max: 10000 },
  { label: "₦10,000 – ₦50,000", min: 10000, max: 50000 },
  { label: "₦50,000 – ₦150,000", min: 50000, max: 150000 },
  { label: "₦150,000+", min: 150000, max: Infinity },
];
const sortOptions = ["Relevance", "Price: Low to High", "Price: High to Low", "Newest", "Best Rated", "Most Popular"];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [desktopFiltersOpen, setDesktopFiltersOpen] = useState(true);
  const [selectedPriceRange, setSelectedPriceRange] = useState(0);
  const [selectedSort, setSelectedSort] = useState("Relevance");
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get("brand") || "");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { products, categories, brands, settings } = useStore();

  const allCategories = useMemo(
    () => [{ id: "", name: "All Products" }, ...categories.map((c) => ({ id: c.id, name: c.name }))],
    [categories]
  );

  const q = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const isNew = searchParams.get("new") === "true";
  const isDeals = searchParams.get("deals") === "true";

  const activeCategory = category;

  const filtered = useMemo(() => {
    let list = [...products];

    if (q) {
      const lower = q.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(lower) ||
          p.brand.toLowerCase().includes(lower) ||
          p.category.toLowerCase().includes(lower) ||
          p.subcategory?.toLowerCase().includes(lower) ||
          p.sku.toLowerCase().includes(lower) ||
          p.compatible?.some((c) => c.toLowerCase().includes(lower)) ||
          p.tags?.some((t) => t.toLowerCase().includes(lower))
      );
    }

    if (category) list = list.filter((p) => p.category === category);
    if (selectedBrand) list = list.filter((p) => p.brand.toLowerCase() === selectedBrand.toLowerCase());
    if (isNew) list = list.filter((p) => p.isNew);
    if (isDeals) list = list.filter((p) => p.originalPrice);

    const range = priceRanges[selectedPriceRange];
    list = list.filter((p) => p.price >= range.min && p.price <= range.max);

    switch (selectedSort) {
      case "Price: Low to High": list.sort((a, b) => a.price - b.price); break;
      case "Price: High to Low": list.sort((a, b) => b.price - a.price); break;
      case "Best Rated": list.sort((a, b) => b.rating - a.rating); break;
      case "Most Popular": list.sort((a, b) => b.reviewCount - a.reviewCount); break;
    }

    return list;
  }, [q, category, selectedBrand, isNew, isDeals, selectedPriceRange, selectedSort, products]);

  const handleCategoryChange = (catId: string) => {
    const params: Record<string, string> = {};
    if (catId) params.category = catId;
    if (q) params.q = q;
    setSearchParams(params);
  };

  const title = q
    ? `Search: "${q}"`
    : category
    ? categories.find((c) => c.id === category)?.name || "Products"
    : isNew
    ? "New Arrivals"
    : isDeals
    ? "Deals & Offers"
    : "All Products";

  const Filters = () => (
    <div className="space-y-6">
      {/* Category */}
      <div>
        <h4 className="font-semibold text-xs uppercase tracking-wider mb-3" style={{ fontFamily: "var(--font-display)", color: "#777777" }}>Category</h4>
        <div className="space-y-1">
          {allCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors text-left"
              style={{
                background: activeCategory === cat.id ? "rgba(255,97,21,0.08)" : "transparent",
                color: activeCategory === cat.id ? "#FF6115" : "#333333",
                fontFamily: "var(--font-display)",
                fontWeight: activeCategory === cat.id ? 600 : 400,
              }}
            >
              {cat.name}
              <span className="text-xs" style={{ color: "#AAAAAA" }}>
                {products.filter((p) => cat.id === "" || p.category === cat.id).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Brand */}
      <div>
        <h4 className="font-semibold text-xs uppercase tracking-wider mb-3" style={{ fontFamily: "var(--font-display)", color: "#777777" }}>Brand</h4>
        <div className="space-y-1">
          <button
            onClick={() => setSelectedBrand("")}
            className="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors"
            style={{ background: !selectedBrand ? "rgba(255,97,21,0.08)" : "transparent", color: !selectedBrand ? "#FF6115" : "#333333", fontFamily: "var(--font-display)", fontWeight: !selectedBrand ? 600 : 400 }}
          >
            All Brands
          </button>
          {brands.map((b) => (
            <button
              key={b.id}
              onClick={() => setSelectedBrand(selectedBrand === b.name ? "" : b.name)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors text-left"
              style={{ background: selectedBrand === b.name ? "rgba(255,97,21,0.08)" : "transparent", color: selectedBrand === b.name ? "#FF6115" : "#333333", fontFamily: "var(--font-display)", fontWeight: selectedBrand === b.name ? 600 : 400 }}
            >
              <span>{b.logo}</span> {b.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h4 className="font-semibold text-xs uppercase tracking-wider mb-3" style={{ fontFamily: "var(--font-display)", color: "#777777" }}>Price Range</h4>
        <div className="space-y-1">
          {priceRanges.map((range, i) => (
            <button
              key={range.label}
              onClick={() => setSelectedPriceRange(i)}
              className="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors"
              style={{
                background: selectedPriceRange === i ? "rgba(255,97,21,0.08)" : "transparent",
                color: selectedPriceRange === i ? "#FF6115" : "#333333",
                fontFamily: "var(--font-display)",
                fontWeight: selectedPriceRange === i ? 600 : 400,
              }}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div>
        <h4 className="font-semibold text-xs uppercase tracking-wider mb-3" style={{ fontFamily: "var(--font-display)", color: "#777777" }}>Availability</h4>
        <div className="space-y-2">
          {["In Stock", "New Arrivals", "Deals Only"].map((opt) => (
            <label key={opt} className="flex items-center gap-2.5 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 rounded" style={{ accentColor: "#FF6115" }} />
              <span className="text-sm" style={{ color: "#444444", fontFamily: "var(--font-body)" }}>{opt}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ background: "#FFFCF4", minHeight: "100vh" }} className="pt-16">
      {/* Header */}
      <div style={{ background: "#F5F2EA", borderBottom: "1px solid #E8E5DE" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <nav className="flex items-center gap-2 text-xs mb-4" style={{ color: "#AAAAAA", fontFamily: "var(--font-body)" }}>
            <Link to="/" className="hover:text-orange-500 transition-colors">Home</Link>
            <span>/</span>
            <span style={{ color: "#151515" }}>{title}</span>
          </nav>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold" style={{ fontFamily: "var(--font-display)", color: "#151515", letterSpacing: "-0.025em" }}>
                {title}
              </h1>
              <p className="text-sm mt-1" style={{ color: "#777777" }}>{filtered.length} products found</p>
            </div>
            {/* Search */}
            <div className="relative max-w-sm w-full">
              <input
                type="text"
                defaultValue={q}
                placeholder="Search products, parts..."
                className="w-full h-10 pl-4 pr-10 rounded-xl text-sm outline-none"
                style={{ border: "1.5px solid #E8E5DE", background: "#FFFFFF", fontFamily: "var(--font-body)" }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const val = (e.target as HTMLInputElement).value.trim();
                    if (val) setSearchParams({ q: val });
                  }
                }}
              />
              <svg className="absolute right-3 top-1/2 -translate-y-1/2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#AAAAAA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-8">
        <div className="flex gap-6">
          {/* Sidebar — desktop */}
          {desktopFiltersOpen && (
            <aside className="hidden lg:block w-56 flex-shrink-0">
              <div className="sticky top-24">
                <Filters />
              </div>
            </aside>
          )}

          {/* Main */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between mb-5 gap-2 sm:mb-6 sm:gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors"
                style={{ background: "#FFFFFF", border: "1px solid #E8E5DE", color: "#333333", fontFamily: "var(--font-display)" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="20" y2="12"/><line x1="12" y1="18" x2="20" y2="18"/>
                </svg>
                Filters
              </button>
              <button
                onClick={() => setDesktopFiltersOpen((open) => !open)}
                className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors"
                style={{ background: desktopFiltersOpen ? "#FFFFFF" : "#FFF0E8", border: "1px solid #E8E5DE", color: desktopFiltersOpen ? "#333333" : "#FF6115", fontFamily: "var(--font-display)" }}
                aria-expanded={desktopFiltersOpen}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="20" y2="12"/><line x1="12" y1="18" x2="20" y2="18"/>
                </svg>
                {desktopFiltersOpen ? "Hide filters" : "Show filters"}
              </button>
              <div className="flex items-center gap-2 ml-auto">
                <select
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value)}
                  className="h-9 max-w-[145px] px-2 rounded-lg text-sm outline-none cursor-pointer"
                  style={{ border: "1px solid #E8E5DE", background: "#FFFFFF", color: "#333333", fontFamily: "var(--font-display)" }}
                >
                  {sortOptions.map((opt) => <option key={opt}>{opt}</option>)}
                </select>
                <div className="flex gap-1">
                  {(["grid", "list"] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setViewMode(mode)}
                      className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
                      style={{ background: viewMode === mode ? "#FF6115" : "#FFFFFF", border: "1px solid #E8E5DE", color: viewMode === mode ? "#FFFFFF" : "#777777" }}
                    >
                      {mode === "grid" ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
                        </svg>
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="font-bold text-xl mb-2" style={{ fontFamily: "var(--font-display)", color: "#151515" }}>No products found</h3>
                <p className="text-sm mb-6" style={{ color: "#777777" }}>
                  {q ? `No results for "${q}". Try different keywords.` : "No products match your current filters."}
                </p>
                <a
                  href={`https://wa.me/${settings.whatsappNumber}?text=Hello%20ZAT%20Telecom%2C%20I'm%20looking%20for%20${encodeURIComponent(q || "a product")}%20but%20couldn't%20find%20it%20on%20the%20website.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white"
                  style={{ background: "#25D366", fontFamily: "var(--font-display)" }}
                >
                  Ask on WhatsApp
                </a>
              </div>
            ) : (
              <div className={viewMode === "grid" ? `grid grid-cols-2 md:grid-cols-4 gap-3 ${desktopFiltersOpen ? "xl:grid-cols-6" : "lg:grid-cols-6 xl:grid-cols-7"}` : "flex flex-col gap-4"}>
                {filtered.map((product) =>
                  viewMode === "grid" ? (
                    <ProductCard key={product.id} product={product} />
                  ) : (
                    <Link
                      key={product.id}
                      to={`/product/${product.id}`}
                      className="flex gap-4 rounded-2xl overflow-hidden transition-all hover:shadow-md"
                      style={{ background: "#FFFFFF", border: "1px solid #E8E5DE" }}
                    >
                      <div className="w-24 h-24 flex-shrink-0" style={{ background: "#F5F2EA" }}>
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col justify-center py-3 pr-4">
                        <p className="text-[11px] font-semibold uppercase" style={{ color: "#FF6115", fontFamily: "var(--font-display)" }}>{product.brand}</p>
                        <h3 className="font-semibold text-sm mt-0.5 mb-1 line-clamp-2" style={{ fontFamily: "var(--font-display)", color: "#151515" }}>{product.name}</h3>
                        <p className="font-bold text-base" style={{ fontFamily: "var(--font-display)", color: "#151515" }}>{formatPrice(product.price)}</p>
                      </div>
                    </Link>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <div
            className="absolute right-0 top-0 bottom-0 w-[calc(100%-2rem)] max-w-[22rem] overflow-y-auto p-5 sm:p-6"
            style={{ background: "#FFFCF4" }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg" style={{ fontFamily: "var(--font-display)" }}>Filters</h3>
              <button onClick={() => setSidebarOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-black/5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <Filters />
          </div>
        </div>
      )}
    </div>
  );
}
