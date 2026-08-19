import { useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useStore } from "../context/StoreContext";

export default function FindAPart() {
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedPart, setSelectedPart] = useState("");
  const [searched, setSearched] = useState(false);

  const { products, brands, partTypes, settings } = useStore();

  const availableModels = selectedBrand
    ? (brands.find((b) => b.name === selectedBrand)?.models || [])
    : [];

  const results = searched
    ? products.filter((p) => {
        if (p.category !== "spare-parts") return false;
        const brandMatch = !selectedBrand || p.brand.toLowerCase() === selectedBrand.toLowerCase();
        const modelMatch = !selectedModel || p.compatible?.some((c) => c.toLowerCase().includes(selectedModel.toLowerCase()));
        const partMatch = !selectedPart || p.subcategory?.toLowerCase().includes(selectedPart.toLowerCase()) || p.name.toLowerCase().includes(selectedPart.toLowerCase());
        return brandMatch && modelMatch && partMatch;
      })
    : [];

  const handleSearch = () => setSearched(true);
  const handleReset = () => {
    setSelectedBrand(""); setSelectedModel(""); setSelectedPart(""); setSearched(false);
  };

  return (
    <div style={{ background: "#FFFCF4", minHeight: "100vh" }} className="pt-16">
      {/* Header */}
      <div
        className="py-16 px-4 sm:px-6"
        style={{ background: "#151515" }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#FF6115", fontFamily: "var(--font-display)" }}>Parts Finder</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4" style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.03em" }}>
            Find the Right Part
          </h1>
          <p className="text-base max-w-xl mx-auto" style={{ color: "#999999", fontFamily: "var(--font-body)" }}>
            Select your phone brand, model, and the part type. We'll show you all compatible replacement options in stock.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        {/* Finder card */}
        <div
          className="rounded-3xl p-8 mb-12"
          style={{ background: "#FFFFFF", border: "1px solid #E8E5DE", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}
        >
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            {/* Brand */}
            <div>
              <label className="block text-xs font-semibold mb-2" style={{ color: "#777777", fontFamily: "var(--font-display)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                1. Phone Brand
              </label>
              <select
                value={selectedBrand}
                onChange={(e) => { setSelectedBrand(e.target.value); setSelectedModel(""); setSearched(false); }}
                className="w-full h-12 px-4 rounded-xl text-sm outline-none cursor-pointer transition-all"
                style={{
                  border: selectedBrand ? "1.5px solid #FF6115" : "1.5px solid #E8E5DE",
                  background: "#FAFAF8",
                  color: selectedBrand ? "#151515" : "#999999",
                  fontFamily: "var(--font-body)",
                }}
              >
                <option value="">Select Brand</option>
                {brands.map((b) => <option key={b.id} value={b.name}>{b.name}</option>)}
              </select>
            </div>

            {/* Model */}
            <div>
              <label className="block text-xs font-semibold mb-2" style={{ color: "#777777", fontFamily: "var(--font-display)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                2. Phone Model
              </label>
              <select
                value={selectedModel}
                onChange={(e) => { setSelectedModel(e.target.value); setSearched(false); }}
                disabled={!selectedBrand}
                className="w-full h-12 px-4 rounded-xl text-sm outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                style={{
                  border: selectedModel ? "1.5px solid #FF6115" : "1.5px solid #E8E5DE",
                  background: "#FAFAF8",
                  color: selectedModel ? "#151515" : "#999999",
                  fontFamily: "var(--font-body)",
                }}
              >
                <option value="">Select Model</option>
                {availableModels.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            {/* Part type */}
            <div>
              <label className="block text-xs font-semibold mb-2" style={{ color: "#777777", fontFamily: "var(--font-display)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                3. Part Type
              </label>
              <select
                value={selectedPart}
                onChange={(e) => { setSelectedPart(e.target.value); setSearched(false); }}
                className="w-full h-12 px-4 rounded-xl text-sm outline-none cursor-pointer transition-all"
                style={{
                  border: selectedPart ? "1.5px solid #FF6115" : "1.5px solid #E8E5DE",
                  background: "#FAFAF8",
                  color: selectedPart ? "#151515" : "#999999",
                  fontFamily: "var(--font-body)",
                }}
              >
                <option value="">Select Part Type</option>
                {partTypes.map((pt) => <option key={pt.id} value={pt.id}>{pt.icon} {pt.name}</option>)}
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleSearch}
              className="flex-1 h-12 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90 active:scale-95 flex items-center justify-center gap-2"
              style={{ background: "#FF6115", fontFamily: "var(--font-display)" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              Find Compatible Parts
            </button>
            {searched && (
              <button
                onClick={handleReset}
                className="px-6 h-12 rounded-xl font-semibold text-sm transition-all hover:opacity-70"
                style={{ border: "1px solid #E8E5DE", color: "#777777", fontFamily: "var(--font-display)", background: "#FFFFFF" }}
              >
                Reset
              </button>
            )}
            <a
              href={`https://wa.me/${settings.whatsappNumber}?text=Hello%20ZAT%20Telecom%2C%20I%20need%20help%20finding%20a%20${selectedPart || "spare part"}%20for%20my%20${selectedBrand || "phone"}${selectedModel ? " " + selectedModel : ""}.`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 h-12 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90 flex items-center justify-center gap-2"
              style={{ background: "#25D366", fontFamily: "var(--font-display)" }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Ask on WhatsApp
            </a>
          </div>
        </div>

        {/* Results */}
        {searched && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-extrabold text-xl" style={{ fontFamily: "var(--font-display)", color: "#151515" }}>
                {results.length > 0
                  ? `${results.length} Compatible Part${results.length !== 1 ? "s" : ""} Found`
                  : "No Parts Found"}
                {(selectedBrand || selectedModel) && (
                  <span className="ml-2 text-base font-normal" style={{ color: "#777777" }}>
                    for {[selectedBrand, selectedModel].filter(Boolean).join(" ")}
                  </span>
                )}
              </h2>
            </div>

            {results.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {results.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            ) : (
              <div
                className="rounded-2xl p-10 text-center"
                style={{ background: "#FFFFFF", border: "1px solid #E8E5DE" }}
              >
                <p className="text-4xl mb-4">🔍</p>
                <h3 className="font-bold text-lg mb-2" style={{ fontFamily: "var(--font-display)", color: "#151515" }}>
                  No matching parts in stock
                </h3>
                <p className="text-sm mb-6" style={{ color: "#777777", fontFamily: "var(--font-body)" }}>
                  We may have it in the store. Contact us on WhatsApp and we'll help you find the exact part.
                </p>
                <a
                  href={`https://wa.me/${settings.whatsappNumber}?text=Hello%20ZAT%20Telecom%2C%20I'm%20looking%20for%20a%20${selectedPart || "spare part"}%20for%20my%20${selectedBrand || "phone"}${selectedModel ? " " + selectedModel : ""}.%20Do%20you%20have%20it%20in%20stock?`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white"
                  style={{ background: "#25D366", fontFamily: "var(--font-display)" }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  Ask ZAT Telecom on WhatsApp
                </a>
              </div>
            )}
          </div>
        )}

        {/* Browse by brand */}
        {!searched && (
          <>
            <div className="mb-6">
              <h2 className="font-extrabold text-xl mb-1" style={{ fontFamily: "var(--font-display)", color: "#151515" }}>Browse Parts by Brand</h2>
              <p className="text-sm" style={{ color: "#777777" }}>Click a brand to see all available replacement parts.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-12">
              {brands.map((brand) => (
                <button
                  key={brand.id}
                  onClick={() => { setSelectedBrand(brand.name); setSearched(true); }}
                  className="flex flex-col items-center gap-3 p-6 rounded-2xl transition-all hover:-translate-y-0.5 hover:shadow-md"
                  style={{ background: "#FFFFFF", border: "1px solid #E8E5DE" }}
                >
                  <span className="text-3xl">{brand.logo}</span>
                  <span className="font-semibold text-sm" style={{ fontFamily: "var(--font-display)", color: "#151515" }}>{brand.name}</span>
                </button>
              ))}
            </div>

            {/* Part type quick browse */}
            <div className="mb-6">
              <h2 className="font-extrabold text-xl mb-1" style={{ fontFamily: "var(--font-display)", color: "#151515" }}>Browse by Part Type</h2>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-9 gap-3">
              {partTypes.map((pt) => (
                <button
                  key={pt.id}
                  onClick={() => { setSelectedPart(pt.id); setSearched(true); }}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl transition-all hover:-translate-y-0.5"
                  style={{ background: "#FFFFFF", border: "1px solid #E8E5DE" }}
                >
                  <span className="text-2xl">{pt.icon}</span>
                  <span className="text-[11px] font-semibold text-center" style={{ fontFamily: "var(--font-display)", color: "#151515" }}>{pt.name}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
