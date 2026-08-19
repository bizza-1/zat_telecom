import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { products, categories, brands, formatPrice } from "../data/products";

const featured = products.filter((p) => p.isFeatured);
const newArrivals = products.filter((p) => p.isNew);
const spareParts = products.filter((p) => p.category === "spare-parts");

const tabs = ["Best Sellers", "New Arrivals", "Popular", "Deals"];
const promoSlideCount = 2;

const categoryIconSources: Record<string, string> = {
  phones: "https://img.icons8.com/ios/50/iphone13.png",
  accessories: "https://img.icons8.com/pulsar-line/48/mobile-charger.png",
  "spare-parts": "https://img.icons8.com/fluency-systems-regular/48/wrench.png",
  audio: "https://img.icons8.com/fluency-systems-regular/48/headphones.png",
  power: "https://img.icons8.com/external-glyphons-amoghdesign/32/external-charge-camping-adventure-and-outdoors-glyphons-amoghdesign.png",
  smartwatches: "https://img.icons8.com/ios-filled/50/apple-watch-apps.png",
  gadgets: "https://img.icons8.com/ios-filled/50/laptop.png",
  gaming: "https://img.icons8.com/fluency-systems-filled/48/controller.png",
};

function CategoryIcon({ id, name, fallback, className, decorative = false }: { id: string; name: string; fallback: string; className: string; decorative?: boolean }) {
  const src = categoryIconSources[id];
  return src ? <img src={src} alt={decorative ? "" : name} className={className} /> : <>{fallback}</>;
}

const heroSlides = [
  {
    eyebrow: "Fresh tech, better prices",
    title: "Upgrade your everyday.",
    description: "Discover dependable smartphones, must-have accessories, and more all in one trusted store.",
    cta: "Shop new arrivals",
    to: "/shop?new=true",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1600&h=900&fit=crop&auto=format",
    tint: "linear-gradient(90deg, rgba(18,22,25,0.94) 0%, rgba(18,22,25,0.68) 46%, rgba(18,22,25,0.08) 100%)",
  },
  {
    eyebrow: "Genuine replacement parts",
    title: "The right part. Right when you need it.",
    description: "Find compatible screens, batteries, charging ports, and quality repair essentials for your device.",
    cta: "Find a part",
    to: "/find-a-part",
    image: "https://images.unsplash.com/photo-1611396000732-f8c9a933424f?w=1600&h=900&fit=crop&auto=format",
    tint: "linear-gradient(90deg, rgba(19,30,29,0.96) 0%, rgba(19,30,29,0.73) 48%, rgba(19,30,29,0.08) 100%)",
  },
  {
    eyebrow: "Power up for less",
    title: "Keep every device moving.",
    description: "From fast chargers to long-lasting power banks, get the accessories that keep up with your day.",
    cta: "Shop accessories",
    to: "/shop?category=accessories",
    image: "https://images.unsplash.com/photo-1585995603413-eb35b5f4a50b?w=1600&h=900&fit=crop&auto=format",
    tint: "linear-gradient(90deg, rgba(27,22,18,0.94) 0%, rgba(27,22,18,0.68) 48%, rgba(27,22,18,0.08) 100%)",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} width="13" height="13" viewBox="0 0 24 24" fill={s <= Math.round(rating) ? "#F59E0B" : "#E5E7EB"}>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </div>
  );
}

const testimonials = [
  { name: "Chidera Okafor", rating: 5, text: "Found the exact Samsung A15 screen I needed in minutes. Ordering was smooth and delivery was fast. ZAT Telecom is now my go-to for spare parts.", verified: true, location: "Lagos" },
  { name: "Amaka Nwosu", rating: 5, text: "Got my Oraimo earbuds at a great price. The quality is excellent and they feel premium. Will definitely buy from ZAT again!", verified: true, location: "Abuja" },
  { name: "Emeka Eze", rating: 4, text: "I repair phones for a living and ZAT Telecom has the best selection of spare parts in Lagos. Prices are fair and parts are genuinely OEM.", verified: true, location: "Port Harcourt" },
];

const faqItems = [
  { q: "Do you sell original phone screens?", a: "Yes. We stock Original, OEM, and quality Aftermarket screens clearly labelled so you can choose the right fit for your needs and budget." },
  { q: "How do I find the correct part for my phone?", a: "Use our 'Find a Part' tool  select your brand, phone model, and the part type. You'll instantly see compatible options." },
  { q: "Can I order through WhatsApp?", a: "Absolutely. All products include a 'Chat on WhatsApp' button. Just tap it and we'll help you complete your order via WhatsApp." },
  { q: "Do you deliver?", a: "Yes, we deliver across Nigeria. Delivery timelines and costs depend on your location. Lagos orders typically arrive within 24–48 hours." },
  { q: "Can I pick up my order?", a: "Yes. Our store is located at 123 Computer Village Road, Ikeja, Lagos. You can pick up your order Monday–Saturday, 8am–7pm." },
  { q: "Do you sell wholesale?", a: "Yes, we support bulk orders for phone repair technicians and electronics retailers. Contact us on WhatsApp for wholesale pricing." },
  { q: "What payment methods do you accept?", a: "We accept bank transfer, POS (card payment in-store), cash, Opay, and Palmpay." },
  { q: "Can I return a product?", a: "Yes. We offer returns within 7 days for products in original condition. Spare parts are returnable if uninstalled and in original packaging." },
];

const blogPosts = [
  {
    title: "How to Know If Your Phone Screen Needs Replacement",
    excerpt: "Dead pixels, touch issues, and cracks are obvious signs  but there are subtler symptoms that mean your display needs attention.",
    category: "Phone Repair",
    date: "Aug 12, 2026",
    image: "https://images.unsplash.com/photo-1550041473-d296a3a8a18a?w=500&h=300&fit=crop&auto=format",
  },
  {
    title: "5 Things to Check Before Buying a Power Bank",
    excerpt: "Capacity, charging speed, number of ports, and safety certifications  here's what to look for when choosing a power bank.",
    category: "Buying Guide",
    date: "Aug 8, 2026",
    image: "https://images.unsplash.com/photo-1566554738544-d962991c3fee?w=500&h=300&fit=crop&auto=format",
  },
  {
    title: "Original vs Aftermarket Phone Screens: What's the Difference?",
    excerpt: "We break down the key differences between original OEM, aftermarket, and copy screens so you can make an informed repair decision.",
    category: "Tech Tips",
    date: "Aug 3, 2026",
    image: "https://images.unsplash.com/photo-1611396000732-f8c9a933424f?w=500&h=300&fit=crop&auto=format",
  },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState("Best Sellers");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [activePromoSlide, setActivePromoSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 5500);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActivePromoSlide((current) => (current + 1) % promoSlideCount);
    }, 4500);
    return () => window.clearInterval(interval);
  }, []);

  const tabProducts = (() => {
    if (activeTab === "New Arrivals") return newArrivals;
    if (activeTab === "Deals") return products.filter((p) => p.originalPrice);
    if (activeTab === "Popular") return [...products].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 8);
    return featured;
  })();

  return (
    <main style={{ background: "#FFFCF4" }}>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="pt-[4.5rem] pb-5 sm:pt-24 sm:pb-7" style={{ background: "#F5F2EA" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid gap-4 lg:grid-cols-[208px_minmax(0,1fr)_210px]">
            <aside className="hidden lg:block rounded-xl bg-white p-3" style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
              {categories.map((category) => (
                <Link key={category.id} to={`/shop?category=${category.id}`} className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors hover:bg-[#FFF3ED]" style={{ color: "#333333", fontFamily: "var(--font-display)" }}>
                  <span className="flex h-5 w-5 items-center justify-center text-center">
                    <CategoryIcon id={category.id} name={category.name} fallback={category.icon} className="h-5 w-5" decorative />
                  </span>{category.name}
                </Link>
              ))}
            </aside>

            <div className="relative min-h-[350px] overflow-hidden rounded-xl sm:min-h-[430px]" style={{ background: "#151515" }}>
              {heroSlides.map((slide, index) => (
                <div key={slide.title} className={`absolute inset-0 transition-opacity duration-700 ${index === activeSlide ? "opacity-100" : "pointer-events-none opacity-0"}`}>
                  <img src={slide.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
                  <div className="absolute inset-0" style={{ background: slide.tint }} />
                  <div className="relative flex h-full max-w-xl flex-col justify-center px-5 py-9 sm:px-12 sm:py-12">
                    <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em]" style={{ color: "#FF8B51", fontFamily: "var(--font-display)" }}>{slide.eyebrow}</p>
                    <h1 className="max-w-md text-3xl font-extrabold leading-[1.08] text-white sm:text-5xl" style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.035em" }}>{slide.title}</h1>
                    <p className="mt-5 max-w-md text-sm leading-relaxed text-white/80 sm:text-base">{slide.description}</p>
                    <Link to={slide.to} className="mt-7 inline-flex w-fit items-center gap-2 rounded-lg px-5 py-3 text-sm font-bold text-white transition-transform hover:-translate-y-0.5" style={{ background: "#FF6115", fontFamily: "var(--font-display)" }}>
                      {slide.cta}<span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </div>
              ))}
              <button onClick={() => setActiveSlide((activeSlide - 1 + heroSlides.length) % heroSlides.length)} aria-label="Previous slide" className="absolute left-3 top-1/2 hidden h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-lg text-[#151515] transition hover:bg-white sm:grid">‹</button>
              <button onClick={() => setActiveSlide((activeSlide + 1) % heroSlides.length)} aria-label="Next slide" className="absolute right-3 top-1/2 hidden h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-lg text-[#151515] transition hover:bg-white sm:grid">›</button>
              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                {heroSlides.map((slide, index) => <button key={slide.title} onClick={() => setActiveSlide(index)} aria-label={`Show slide ${index + 1}`} className="h-2 rounded-full transition-all" style={{ width: activeSlide === index ? 22 : 7, background: activeSlide === index ? "#FF6115" : "rgba(255,255,255,0.65)" }} />)}
              </div>
            </div>

            <aside className="relative hidden min-h-[430px] overflow-hidden rounded-xl lg:block">
              <Link to="/product/acc-001" className={`group absolute inset-0 overflow-hidden rounded-xl bg-white p-6 transition-opacity duration-500 ${activePromoSlide === 0 ? "opacity-100" : "pointer-events-none opacity-0"}`} style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
                <img src="https://images.unsplash.com/photo-1606741965326-cb990ae01bb2?w=500&h=500&fit=crop&auto=format" alt="Oraimo FreePods 4 earbuds" className="absolute right-0 top-0 h-52 w-52 rounded-bl-[4rem] object-cover transition-transform duration-300 group-hover:scale-105" />
                <p className="relative text-xs font-bold uppercase tracking-[0.16em]" style={{ color: "#FF6115", fontFamily: "var(--font-display)" }}>Earbuds deal</p>
                <div className="absolute bottom-10 left-6 right-6">
                  <p className="text-3xl font-extrabold leading-none" style={{ color: "#151515", fontFamily: "var(--font-display)" }}>FreePods 4</p>
                  <p className="mt-2 text-sm font-semibold" style={{ color: "#777777" }}>Premium sound, now for less.</p>
                  <p className="mt-5 text-lg font-extrabold" style={{ color: "#FF6115" }}>₦14,500 <span className="text-sm font-normal line-through" style={{ color: "#999999" }}>₦18,000</span></p>
                </div>
              </Link>
              <Link to="/product/ph-001" className={`group absolute inset-0 overflow-hidden rounded-xl p-6 text-white transition-opacity duration-500 ${activePromoSlide === 1 ? "opacity-100" : "pointer-events-none opacity-0"}`} style={{ background: "#FF6115" }}>
                <img src="https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&h=500&fit=crop&auto=format" alt="Samsung Galaxy A15 5G" className="absolute right-0 top-0 h-52 w-52 rounded-bl-[4rem] object-cover transition-transform duration-300 group-hover:scale-105" />
                <p className="relative text-xs font-bold uppercase tracking-[0.16em] text-white/75" style={{ fontFamily: "var(--font-display)" }}>Phone deal</p>
                <div className="absolute bottom-10 left-6 right-6"><p className="text-3xl font-extrabold leading-none" style={{ fontFamily: "var(--font-display)" }}>Galaxy A15 5G</p><p className="mt-3 text-sm font-semibold text-white/85">Fast, reliable, and now on offer.</p><p className="mt-5 text-lg font-extrabold">₦198,000 <span className="text-sm font-normal text-white/70 line-through">₦220,000</span></p></div>
              </Link>
              <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
                {[0, 1].map((index) => <button key={index} onClick={() => setActivePromoSlide(index)} aria-label={`Show deal ${index + 1}`} className="h-2 rounded-full transition-all" style={{ width: activePromoSlide === index ? 18 : 7, background: activePromoSlide === index ? (activePromoSlide === 1 ? "#FFFFFF" : "#FF6115") : activePromoSlide === 1 ? "rgba(255,255,255,0.55)" : "#D7D3CA" }} />)}
              </div>
            </aside>
          </div>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1 lg:hidden">
            {categories.map((category) => (
              <Link key={category.id} to={`/shop?category=${category.id}`} className="flex shrink-0 items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-xs font-semibold" style={{ color: "#333333", fontFamily: "var(--font-display)", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                <span className="flex h-4 w-4 items-center justify-center">
                  <CategoryIcon id={category.id} name={category.name} fallback={category.icon} className="h-4 w-4" decorative />
                </span>{category.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── BENEFITS STRIP ───────────────────────────────────────────────── */}
      <div style={{ background: "#151515" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { icon: "✓", text: "Quality Products" },
              { icon: "₦", text: "Competitive Prices" },
              { icon: "⚡", text: "Fast Processing" },
              { icon: "💬", text: "WhatsApp Support" },
              { icon: "📍", text: "Pickup Available" },
            ].map((b) => (
              <div key={b.text} className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: "rgba(255,97,21,0.15)", color: "#FF6115" }}>
                  {b.icon}
                </span>
                <span className="text-xs font-medium" style={{ fontFamily: "var(--font-display)", color: "#CCCCCC" }}>{b.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SHOP BY CATEGORY ─────────────────────────────────────────────── */}
      <section className="py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#FF6115", fontFamily: "var(--font-display)" }}>Browse</p>
              <h2 className="text-3xl md:text-4xl font-extrabold" style={{ fontFamily: "var(--font-display)", color: "#151515", letterSpacing: "-0.025em" }}>
                Shop by Category
              </h2>
              <p className="text-base mt-2" style={{ color: "#777777", fontFamily: "var(--font-body)" }}>Everything you need for your phone, gadgets and everyday technology.</p>
            </div>
            <Link to="/shop" className="flex-shrink-0 text-sm font-semibold flex items-center gap-1.5 transition-opacity hover:opacity-70" style={{ color: "#FF6115", fontFamily: "var(--font-display)" }}>
              View All <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/shop?category=${cat.id}`}
                className="group relative overflow-hidden rounded-2xl transition-all duration-200 hover:-translate-y-1"
                style={{ aspectRatio: "1/1", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)",
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="font-bold text-sm text-white" style={{ fontFamily: "var(--font-display)" }}>{cat.name}</p>
                  <p className="text-[11px] text-white/70 mt-0.5" style={{ fontFamily: "var(--font-body)" }}>{cat.count} products</p>
                </div>
                <div className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center text-xl">
                  <CategoryIcon id={cat.id} name={cat.name} fallback={cat.icon} className="h-6 w-6" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── SHOP BY BRAND ────────────────────────────────────────────────── */}
      <section className="py-12 sm:py-16" style={{ background: "#F5F2EA" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#FF6115", fontFamily: "var(--font-display)" }}>Spare Parts</p>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-3" style={{ fontFamily: "var(--font-display)", color: "#151515", letterSpacing: "-0.025em" }}>
              Find Parts for Your Phone
            </h2>
            <p className="text-base max-w-xl mx-auto" style={{ color: "#777777", fontFamily: "var(--font-body)" }}>
              Select your device brand to find compatible screens, batteries, charging ports and other replacement parts.
            </p>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-10 gap-3">
            {brands.map((brand) => (
              <Link
                key={brand.id}
                to={`/shop?category=spare-parts&brand=${brand.id}`}
                className="group flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-150 hover:-translate-y-0.5"
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #E8E5DE",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                }}
              >
                <span className="text-2xl">{brand.logo}</span>
                <span className="text-[11px] font-semibold text-center" style={{ fontFamily: "var(--font-display)", color: "#151515" }}>{brand.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FIND A PART ──────────────────────────────────────────────────── */}
      <section className="py-12 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div
            className="rounded-3xl p-8 md:p-12"
            style={{ background: "#151515" }}
          >
            <div className="text-center mb-10">
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#FF6115", fontFamily: "var(--font-display)" }}>Parts Finder</p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3" style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.025em" }}>
                Find the Right Part
              </h2>
              <p className="text-base" style={{ color: "#999999", fontFamily: "var(--font-body)" }}>
                Select your phone brand, model, and the part you need  we'll show compatible options instantly.
              </p>
            </div>
            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              {[
                { label: "1. Select Brand", placeholder: "e.g. Samsung", name: "brand", options: brands.map((b) => b.name) },
                { label: "2. Select Model", placeholder: "e.g. Galaxy A15", name: "model", options: ["Galaxy A15", "Galaxy A15 5G", "Galaxy S23", "iPhone 11", "iPhone 12 Pro", "Camon 20", "Note 30 Pro", "Redmi Note 13"] },
                { label: "3. What do you need?", placeholder: "Select part type", name: "part", options: ["Screen", "Battery", "Charging Port", "Camera", "Speaker", "Microphone", "Flex Cable", "Housing", "Other"] },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-xs font-semibold mb-2" style={{ color: "#AAAAAA", fontFamily: "var(--font-display)" }}>{field.label}</label>
                  <select
                    className="w-full h-12 px-4 rounded-xl text-sm outline-none transition-all cursor-pointer"
                    style={{
                      background: "#1E1E1E",
                      border: "1px solid #2A2A2A",
                      color: "#FFFFFF",
                      fontFamily: "var(--font-body)",
                    }}
                    defaultValue=""
                  >
                    <option value="" disabled>{field.placeholder}</option>
                    {field.options.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/find-a-part"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm transition-all duration-150 hover:opacity-90 active:scale-95"
                style={{ background: "#FF6115", color: "#FFFFFF", fontFamily: "var(--font-display)" }}
              >
                Find Compatible Parts
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
              <a
                href="https://wa.me/2348012345678?text=Hello%20ZAT%20Telecom%2C%20I%20need%20help%20finding%20a%20spare%20part."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm transition-all duration-150 hover:opacity-80"
                style={{ background: "#25D366", color: "#FFFFFF", fontFamily: "var(--font-display)" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Ask on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── TODAY'S TOP PICKS ─────────────────────────────────────────────── */}
      <section className="py-12 sm:py-16" style={{ background: "#F5F2EA" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between gap-3 mb-5 sm:mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#FF6115", fontFamily: "var(--font-display)" }}>Products</p>
              <h2 className="text-2xl md:text-4xl font-extrabold" style={{ fontFamily: "var(--font-display)", color: "#151515", letterSpacing: "-0.025em" }}>
                Today's Top Picks
              </h2>
            </div>
            <Link to="/shop" className="flex-shrink-0 text-sm font-semibold flex items-center gap-1.5 transition-opacity hover:opacity-70" style={{ color: "#FF6115", fontFamily: "var(--font-display)" }}>
              View All <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
          {/* Tabs */}
          <div className="flex gap-1 mb-8 overflow-x-auto pb-1">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="flex-shrink-0 px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-150"
                style={{
                  fontFamily: "var(--font-display)",
                  background: activeTab === tab ? "#FF6115" : "#FFFFFF",
                  color: activeTab === tab ? "#FFFFFF" : "#555555",
                  border: `1px solid ${activeTab === tab ? "#FF6115" : "#E8E5DE"}`,
                }}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:px-0 lg:grid-cols-6">
            {tabProducts.slice(0, 8).map((product) => (
              <div key={product.id} className="w-[44%] shrink-0 sm:w-auto">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SPARE PARTS BANNER ───────────────────────────────────────────── */}
      <section className="py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-6 items-center">
            {/* Left — content */}
            <div
              className="rounded-3xl p-10 flex flex-col justify-center"
              style={{ background: "#DCEDE6", minHeight: 380 }}
            >
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#2D7A52", fontFamily: "var(--font-display)" }}>Repair & Restore</p>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4" style={{ fontFamily: "var(--font-display)", color: "#151515", letterSpacing: "-0.025em" }}>
                Phone Parts &<br />Repair Components
              </h2>
              <p className="text-base mb-6" style={{ color: "#555555", fontFamily: "var(--font-body)" }}>
                Find quality replacement parts for popular phone models. Screens, batteries, charging ports, cameras and more.
              </p>
              <div className="flex flex-wrap gap-2 mb-8">
                {["Screens", "Batteries", "Charging Ports", "Camera Parts", "Flex Cables", "Speakers", "Housing"].map((p) => (
                  <span key={p} className="text-xs font-semibold px-3 py-1.5 rounded-lg" style={{ background: "rgba(0,0,0,0.08)", color: "#333333", fontFamily: "var(--font-display)" }}>
                    {p}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/shop?category=spare-parts"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90"
                  style={{ background: "#151515", fontFamily: "var(--font-display)" }}
                >
                  Shop Phone Parts
                </Link>
                <Link
                  to="/find-a-part"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-80"
                  style={{ background: "rgba(0,0,0,0.1)", color: "#151515", fontFamily: "var(--font-display)" }}
                >
                  Find a Part
                </Link>
              </div>
            </div>
            {/* Right — parts grid */}
            <div className="grid grid-cols-2 gap-4">
              {spareParts.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PROMOTIONAL BANNER ──────────────────────────────────────────── */}
      <section className="py-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div
            className="relative overflow-hidden rounded-3xl flex items-center"
            style={{ background: "#FF6115", minHeight: 240 }}
          >
            <div className="relative z-10 px-10 py-12 max-w-lg">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3" style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.025em" }}>
                Upgrade Your Setup
              </h2>
              <p className="text-base text-white/85 mb-6" style={{ fontFamily: "var(--font-body)" }}>
                Discover better accessories, smarter gadgets and essential tech at ZAT Telecom.
              </p>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:bg-white/90 active:scale-95"
                style={{ background: "#FFFFFF", color: "#FF6115", fontFamily: "var(--font-display)" }}
              >
                Shop Collection
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            </div>
            {/* Decorative */}
            <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden md:flex items-center justify-center overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1778577528570-2963c48fd5ac?w=700&h=500&fit=crop&auto=format"
                alt="Tech accessories"
                className="w-full h-full object-cover opacity-40 mix-blend-luminosity"
              />
            </div>
            {/* Circles */}
            <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full" style={{ background: "rgba(255,255,255,0.07)" }} />
            <div className="absolute -right-4 -bottom-8 w-32 h-32 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }} />
          </div>
        </div>
      </section>

      {/* ── NEW ARRIVALS ─────────────────────────────────────────────────── */}
      <section className="py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between gap-3 mb-5 sm:mb-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#FF6115", fontFamily: "var(--font-display)" }}>Fresh In</p>
              <h2 className="text-2xl md:text-4xl font-extrabold" style={{ fontFamily: "var(--font-display)", color: "#151515", letterSpacing: "-0.025em" }}>New at ZAT</h2>
            </div>
            <Link to="/shop?new=true" className="flex-shrink-0 text-sm font-semibold flex items-center gap-1.5 transition-opacity hover:opacity-70" style={{ color: "#FF6115", fontFamily: "var(--font-display)" }}>
              View All New <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
          <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:px-0 lg:grid-cols-6">
            {newArrivals.map((product) => (
              <div key={product.id} className="w-[44%] shrink-0 sm:w-auto">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY ZAT ──────────────────────────────────────────────────────── */}
      <section className="py-12 sm:py-20" style={{ background: "#F5F2EA" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#FF6115", fontFamily: "var(--font-display)" }}>Trust</p>
            <h2 className="text-3xl md:text-4xl font-extrabold" style={{ fontFamily: "var(--font-display)", color: "#151515", letterSpacing: "-0.025em" }}>Why Shop With ZAT?</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {[
              { icon: "🏆", title: "Genuine Products", desc: "Quality products sourced from trusted suppliers and verified distributors." },
              { icon: "💰", title: "Competitive Prices", desc: "Fair pricing across phones, gadgets and parts. No hidden charges." },
              { icon: "🧑‍🔧", title: "Expert Support", desc: "Get help finding the right product or replacement part for your device." },
              { icon: "📲", title: "Easy Ordering", desc: "Shop online or order directly through WhatsApp  quick and convenient." },
              { icon: "🚚", title: "Pickup & Delivery", desc: "Convenient store pickup at Ikeja, Lagos or delivery across Nigeria." },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl p-6 transition-all duration-150 hover:-translate-y-0.5"
                style={{ background: "#FFFFFF", border: "1px solid #E8E5DE" }}
              >
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="font-bold text-base mb-2" style={{ fontFamily: "var(--font-display)", color: "#151515" }}>{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#777777", fontFamily: "var(--font-body)" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────── */}
      <section className="py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#FF6115", fontFamily: "var(--font-display)" }}>Reviews</p>
            <h2 className="text-3xl md:text-4xl font-extrabold" style={{ fontFamily: "var(--font-display)", color: "#151515", letterSpacing: "-0.025em" }}>What Our Customers Say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="rounded-2xl p-7"
                style={{ background: "#FFFFFF", border: "1px solid #E8E5DE" }}
              >
                <StarRating rating={t.rating} />
                <p className="text-base leading-relaxed mt-4 mb-5" style={{ color: "#333333", fontFamily: "var(--font-body)" }}>
                  "{t.text}"
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm" style={{ fontFamily: "var(--font-display)", color: "#151515" }}>{t.name}</p>
                    <p className="text-xs" style={{ color: "#777777" }}>{t.location}</p>
                  </div>
                  {t.verified && (
                    <span className="text-[10px] font-semibold px-2 py-1 rounded-lg flex items-center gap-1" style={{ background: "rgba(45,158,88,0.1)", color: "#2D9E58", fontFamily: "var(--font-display)" }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"/></svg>
                      Verified
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BLOG ─────────────────────────────────────────────────────────── */}
      <section className="py-12 sm:py-20" style={{ background: "#F5F2EA" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#FF6115", fontFamily: "var(--font-display)" }}>Updates</p>
              <h2 className="text-3xl md:text-4xl font-extrabold" style={{ fontFamily: "var(--font-display)", color: "#151515", letterSpacing: "-0.025em" }}>Tech & Updates</h2>
            </div>
            <Link to="/blog" className="flex-shrink-0 text-sm font-semibold flex items-center gap-1.5 transition-opacity hover:opacity-70" style={{ color: "#FF6115", fontFamily: "var(--font-display)" }}>
              View All <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <article
                key={post.title}
                className="group rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-1 cursor-pointer"
                style={{ background: "#FFFFFF", border: "1px solid #E8E5DE", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
              >
                <div className="overflow-hidden" style={{ aspectRatio: "16/9", background: "#F5F2EA" }}>
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-md" style={{ background: "rgba(255,97,21,0.1)", color: "#FF6115", fontFamily: "var(--font-display)" }}>
                      {post.category}
                    </span>
                    <span className="text-[11px]" style={{ color: "#AAAAAA", fontFamily: "var(--font-body)" }}>{post.date}</span>
                  </div>
                  <h3 className="font-bold text-base leading-snug mb-2 line-clamp-2" style={{ fontFamily: "var(--font-display)", color: "#151515" }}>{post.title}</h3>
                  <p className="text-sm leading-relaxed line-clamp-2" style={{ color: "#777777", fontFamily: "var(--font-body)" }}>{post.excerpt}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#FF6115", fontFamily: "var(--font-display)" }}>Help</p>
            <h2 className="text-3xl md:text-4xl font-extrabold" style={{ fontFamily: "var(--font-display)", color: "#151515", letterSpacing: "-0.025em" }}>Frequently Asked Questions</h2>
          </div>
          <div className="space-y-0">
            {faqItems.map((item, i) => (
              <div key={i} className="border-b" style={{ borderColor: "#E8E5DE" }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between py-5 text-left gap-4 transition-colors hover:opacity-80"
                >
                  <span className="font-semibold text-base" style={{ fontFamily: "var(--font-display)", color: "#151515" }}>{item.q}</span>
                  <span
                    className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200"
                    style={{
                      background: openFaq === i ? "#FF6115" : "#F5F2EA",
                      color: openFaq === i ? "#FFFFFF" : "#777777",
                      transform: openFaq === i ? "rotate(45deg)" : "rotate(0deg)",
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                  </span>
                </button>
                {openFaq === i && (
                  <p className="pb-5 text-sm leading-relaxed" style={{ color: "#555555", fontFamily: "var(--font-body)" }}>
                    {item.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHATSAPP CTA ─────────────────────────────────────────────────── */}
      <section className="py-8 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div
            className="rounded-3xl p-10 text-center"
            style={{ background: "#25D366" }}
          >
            <div className="text-5xl mb-4">💬</div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3" style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.025em" }}>
              Have Questions? Chat With Us
            </h2>
            <p className="text-base text-white/85 mb-6 max-w-xl mx-auto" style={{ fontFamily: "var(--font-body)" }}>
              Our team is available on WhatsApp. Ask about a product, get help finding a spare part, or place your order directly through WhatsApp.
            </p>
            <a
              href="https://wa.me/2348012345678"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm transition-all hover:bg-white/90 active:scale-95"
              style={{ background: "#FFFFFF", color: "#25D366", fontFamily: "var(--font-display)" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Chat on WhatsApp Now
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
