import { Link } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import logo from "../assets/zat-telecom-logo.png";

export default function Footer() {
  const { settings } = useStore();
  return (
    <footer style={{ background: "#151515", color: "#FFFFFF" }} className="pb-16 lg:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 pb-12 border-b" style={{ borderColor: "#2A2A2A" }}>
          {/* Column 1 */}
          <div>
            <div className="relative w-40 h-12 overflow-hidden mb-4" aria-label="ZAT Telecom">
              <img
                src={logo}
                alt="ZAT Telecom"
                className="absolute left-1/2 top-1/2 w-[190px] max-w-none -translate-x-1/2 -translate-y-1/2"
              />
            </div>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "#999999", fontFamily: "var(--font-body)" }}>
              Phones, gadgets, accessories and genuine phone replacement parts. Your trusted technology partner in Nigeria.
            </p>
            <div className="mb-5">
              <p className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: "#666666", fontFamily: "var(--font-display)" }}>Find Us</p>
              <p className="text-sm" style={{ color: "#BBBBBB" }}>123 Computer Village Road,<br/>Ikeja, Lagos State, Nigeria.</p>
              <p className="text-sm mt-1" style={{ color: "#BBBBBB" }}>+234 801 234 5678</p>
              <p className="text-xs mt-1" style={{ color: "#666666" }}>Mon–Sat: 8:00am – 7:00pm</p>
            </div>
            <div className="flex items-center gap-3">
              {["facebook", "instagram", "twitter", "tiktok"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:opacity-80"
                  style={{ background: "#2A2A2A", color: "#BBBBBB" }}
                  aria-label={social}
                >
                  <span className="text-xs font-bold uppercase">{social[0]}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Column 2 */}
          <div>
            <h4 className="font-semibold text-sm mb-4" style={{ fontFamily: "var(--font-display)", color: "#FFFFFF" }}>Shop</h4>
            <ul className="space-y-2.5">
              {[
                { label: "All Phones", to: "/shop?category=phones" },
                { label: "Accessories", to: "/shop?category=accessories" },
                { label: "Spare Parts", to: "/shop?category=spare-parts" },
                { label: "Audio & Earbuds", to: "/shop?category=audio" },
                { label: "Power & Charging", to: "/shop?category=power" },
                { label: "Smart Watches", to: "/shop?category=smartwatches" },
                { label: "Deals & Offers", to: "/shop?deals=true" },
                { label: "New Arrivals", to: "/shop?new=true" },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm transition-colors hover:text-white" style={{ color: "#999999", fontFamily: "var(--font-body)" }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h4 className="font-semibold text-sm mb-4" style={{ fontFamily: "var(--font-display)", color: "#FFFFFF" }}>Customer Service</h4>
            <ul className="space-y-2.5">
              {[
                { label: "Contact Us", to: "/contact" },
                { label: "Chat on WhatsApp", href: `https://wa.me/${settings.whatsappNumber}` },
                { label: "Delivery Information", to: "/delivery" },
                { label: "Returns & Refunds", to: "/returns" },
                { label: "Warranty Policy", to: "/warranty" },
                { label: "Find a Part", to: "/find-a-part" },
                { label: "FAQ", to: "/faq" },
              ].map((l) => (
                <li key={l.label}>
                  {l.href ? (
                    <a href={l.href} target="_blank" rel="noopener noreferrer" className="text-sm transition-colors hover:text-white flex items-center gap-1.5" style={{ color: "#25D366", fontFamily: "var(--font-body)" }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      {l.label}
                    </a>
                  ) : (
                    <Link to={l.to!} className="text-sm transition-colors hover:text-white" style={{ color: "#999999", fontFamily: "var(--font-body)" }}>
                      {l.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h4 className="font-semibold text-sm mb-4" style={{ fontFamily: "var(--font-display)", color: "#FFFFFF" }}>Company</h4>
            <ul className="space-y-2.5 mb-8">
              {[
                { label: "About ZAT", to: "/about" },
                { label: "Our Store", to: "/store" },
                { label: "Privacy Policy", to: "/privacy" },
                { label: "Terms of Service", to: "/terms" },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm transition-colors hover:text-white" style={{ color: "#999999", fontFamily: "var(--font-body)" }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="rounded-xl p-4" style={{ background: "#1E1E1E" }}>
              <p className="text-xs font-semibold mb-2" style={{ fontFamily: "var(--font-display)", color: "#CCCCCC" }}>Payment Methods</p>
              <div className="flex flex-wrap gap-2">
                {["Bank Transfer", "POS", "Cash", "Opay", "Palmpay"].map((p) => (
                  <span key={p} className="text-[10px] px-2 py-1 rounded-md font-medium" style={{ background: "#2A2A2A", color: "#AAAAAA", fontFamily: "var(--font-display)" }}>
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm" style={{ color: "#555555", fontFamily: "var(--font-body)" }}>
            © 2026 ZAT Telecom. All rights reserved.
          </p>
          <p className="text-xs" style={{ color: "#444444", fontFamily: "var(--font-body)" }}>
            Quality Technology Products. <br></br> Sapele, Nigeria
          </p>
        </div>
      </div>
    </footer>
  );
}
