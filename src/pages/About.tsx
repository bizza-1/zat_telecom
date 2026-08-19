import { Link } from "react-router-dom";

export default function About() {
  return (
    <main className="pt-16 min-h-screen" style={{ background: "#FFFCF4" }}>
      <section className="px-4 sm:px-6 py-16 sm:py-24" style={{ background: "#151515" }}>
        <div className="max-w-4xl mx-auto">
          <p className="text-xs uppercase tracking-[.18em] font-bold mb-4" style={{ color: "#FF8B51" }}>About ZAT Telecom</p>
          <h1 className="text-4xl sm:text-6xl leading-tight font-extrabold text-white max-w-3xl" style={{ fontFamily: "var(--font-display)" }}>Reliable devices, accessories and parts for everyday life.</h1>
          <p className="text-base leading-relaxed mt-6 max-w-2xl" style={{ color: "#CCCCCC" }}>We make it easier to find the mobile technology you need — from smartphones and accessories to quality replacement parts.</p>
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
        <div className="grid md:grid-cols-3 gap-5">
          {[
            ["Quality first", "We carefully select products and parts customers can depend on."],
            ["Helpful service", "Need help choosing? Our team is ready to guide you on WhatsApp."],
            ["Built for you", "From a quick accessory to a hard-to-find repair part, we keep shopping simple."],
          ].map(([title, copy]) => (
            <article key={title} className="rounded-2xl p-6" style={{ background: "#FFFFFF", border: "1px solid #E8E5DE" }}>
              <span className="block w-9 h-9 rounded-lg mb-5" style={{ background: "#FFF0E8" }} />
              <h2 className="text-lg font-extrabold" style={{ fontFamily: "var(--font-display)" }}>{title}</h2>
              <p className="text-sm leading-relaxed mt-2" style={{ color: "#777777" }}>{copy}</p>
            </article>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap gap-3">
          <Link to="/shop" className="rounded-xl px-6 py-3 text-sm font-bold text-white" style={{ background: "#FF6115", fontFamily: "var(--font-display)" }}>Browse products</Link>
          <Link to="/find-a-part" className="rounded-xl px-6 py-3 text-sm font-bold" style={{ background: "#F5F2EA", color: "#151515", fontFamily: "var(--font-display)" }}>Find a part</Link>
        </div>
      </section>
    </main>
  );
}
