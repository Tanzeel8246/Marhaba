export default function Slide08Database() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#0d0d0d" }}>
      <div className="absolute top-0 left-0 w-full" style={{ height: "0.5vh", background: "linear-gradient(90deg, #8B4513, #D4843E, #8B4513)" }} />
      <div className="absolute top-0 right-0" style={{ width: "25vw", height: "25vw", borderRadius: "50%", background: "radial-gradient(circle, rgba(139,69,19,0.12) 0%, transparent 70%)", transform: "translate(15%, -15%)" }} />

      <div className="absolute inset-0 flex flex-col" style={{ padding: "5vh 8vw" }}>
        <div style={{ marginBottom: "3.5vh" }}>
          <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.4vw", color: "#D4843E", marginBottom: "1vh" }}>ڈیٹا محفوظ کرنے کا نظام</p>
          <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "4vw", fontWeight: 900, color: "#FFF8F0", letterSpacing: "-0.02em" }}>
            PostgreSQL اور Drizzle ORM
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3vw", flex: 1 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "2vh" }}>
            <div style={{ padding: "3vh 2.5vw", background: "rgba(139,69,19,0.15)", borderRadius: "1vw", border: "0.1vw solid rgba(139,69,19,0.3)", flex: 1 }}>
              <p style={{ fontFamily: "Playfair Display, serif", fontSize: "2vw", fontWeight: 700, color: "#D4843E", marginBottom: "1.5vh" }}>PostgreSQL کیا ہے؟</p>
              <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.6vw", color: "rgba(255,248,240,0.85)", lineHeight: 1.8, marginBottom: "1.5vh" }}>
                دنیا کا سب سے قابل اعتماد open-source ڈیٹا بیس — ٹیبلوں میں ڈیٹا محفوظ کرتا ہے
              </p>
              <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.5vw", color: "rgba(255,248,240,0.6)", lineHeight: 1.7 }}>
                ہمارے app میں products، orders، users، coupons سب کچھ PostgreSQL میں ہے
              </p>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "2vh" }}>
            <div style={{ padding: "3vh 2.5vw", background: "rgba(212,132,62,0.1)", borderRadius: "1vw", border: "0.1vw solid rgba(212,132,62,0.3)" }}>
              <p style={{ fontFamily: "Playfair Display, serif", fontSize: "2vw", fontWeight: 700, color: "#D4843E", marginBottom: "1.5vh" }}>Drizzle ORM</p>
              <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.6vw", color: "rgba(255,248,240,0.85)", lineHeight: 1.8 }}>
                TypeScript میں SQL لکھنے کا آسان طریقہ — ڈیٹا بیس سے بات کرنے کا ترجمان
              </p>
            </div>
            <div style={{ padding: "2vh 2.5vw", background: "rgba(139,69,19,0.1)", borderRadius: "0.8vw" }}>
              <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.5vw", fontWeight: 600, color: "#D4843E", marginBottom: "0.8vh" }}>Tables کی تعداد</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.8vw" }}>
                <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "1.2vw", color: "rgba(255,248,240,0.7)", background: "rgba(139,69,19,0.2)", padding: "0.3vh 0.8vw", borderRadius: "0.3vw" }}>products</span>
                <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "1.2vw", color: "rgba(255,248,240,0.7)", background: "rgba(139,69,19,0.2)", padding: "0.3vh 0.8vw", borderRadius: "0.3vw" }}>orders</span>
                <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "1.2vw", color: "rgba(255,248,240,0.7)", background: "rgba(139,69,19,0.2)", padding: "0.3vh 0.8vw", borderRadius: "0.3vw" }}>categories</span>
                <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "1.2vw", color: "rgba(255,248,240,0.7)", background: "rgba(139,69,19,0.2)", padding: "0.3vh 0.8vw", borderRadius: "0.3vw" }}>coupons</span>
                <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "1.2vw", color: "rgba(255,248,240,0.7)", background: "rgba(139,69,19,0.2)", padding: "0.3vh 0.8vw", borderRadius: "0.3vw" }}>banners</span>
                <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "1.2vw", color: "rgba(255,248,240,0.7)", background: "rgba(139,69,19,0.2)", padding: "0.3vh 0.8vw", borderRadius: "0.3vw" }}>settings</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
