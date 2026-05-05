export default function Slide07Backend2() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "linear-gradient(160deg, #0f0a07 0%, #1a0f08 100%)" }}>
      <div className="absolute top-0 left-0 w-full" style={{ height: "0.5vh", background: "linear-gradient(90deg, #8B4513, #D4843E, #8B4513)" }} />

      <div className="absolute inset-0 flex flex-col" style={{ padding: "5vh 8vw" }}>
        <div style={{ marginBottom: "3.5vh" }}>
          <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.4vw", color: "#D4843E", marginBottom: "1vh" }}>بیک اینڈ — حصہ دوم</p>
          <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "4vw", fontWeight: 900, color: "#FFF8F0", letterSpacing: "-0.02em" }}>
            API کا نظام
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "4vw", flex: 1, alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.8vh" }}>
            <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.7vw", fontWeight: 600, color: "#FFF8F0", marginBottom: "0.5vh" }}>اہم API Endpoints</p>
            <div style={{ padding: "1.5vh 2vw", background: "rgba(0,0,0,0.4)", borderRadius: "0.5vw", fontFamily: "JetBrains Mono, monospace", fontSize: "1.4vw", color: "#D4843E", border: "0.05vw solid rgba(212,132,62,0.2)" }}>GET /api/products</div>
            <div style={{ padding: "1.5vh 2vw", background: "rgba(0,0,0,0.4)", borderRadius: "0.5vw", fontFamily: "JetBrains Mono, monospace", fontSize: "1.4vw", color: "#D4843E", border: "0.05vw solid rgba(212,132,62,0.2)" }}>POST /api/orders</div>
            <div style={{ padding: "1.5vh 2vw", background: "rgba(0,0,0,0.4)", borderRadius: "0.5vw", fontFamily: "JetBrains Mono, monospace", fontSize: "1.4vw", color: "#D4843E", border: "0.05vw solid rgba(212,132,62,0.2)" }}>GET /api/admin/orders</div>
            <div style={{ padding: "1.5vh 2vw", background: "rgba(0,0,0,0.4)", borderRadius: "0.5vw", fontFamily: "JetBrains Mono, monospace", fontSize: "1.4vw", color: "#D4843E", border: "0.05vw solid rgba(212,132,62,0.2)" }}>GET /api/settings/public</div>
            <div style={{ padding: "1.5vh 2vw", background: "rgba(0,0,0,0.4)", borderRadius: "0.5vw", fontFamily: "JetBrains Mono, monospace", fontSize: "1.4vw", color: "#D4843E", border: "0.05vw solid rgba(212,132,62,0.2)" }}>POST /api/admin/login</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "2vh" }}>
            <div style={{ padding: "2.5vh 2vw", background: "rgba(139,69,19,0.15)", borderRadius: "0.8vw", borderLeft: "0.3vw solid #8B4513" }}>
              <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.5vw", fontWeight: 700, color: "#D4843E", marginBottom: "0.7vh" }}>OpenAPI Spec</p>
              <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.4vw", color: "rgba(255,248,240,0.75)", lineHeight: 1.7 }}>تمام APIs کا معاہدہ — فرنٹ اور بیک ایک ہی کتاب پڑھتے ہیں</p>
            </div>
            <div style={{ padding: "2.5vh 2vw", background: "rgba(139,69,19,0.15)", borderRadius: "0.8vw", borderLeft: "0.3vw solid #8B4513" }}>
              <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.5vw", fontWeight: 700, color: "#D4843E", marginBottom: "0.7vh" }}>Pino Logging</p>
              <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.4vw", color: "rgba(255,248,240,0.75)", lineHeight: 1.7 }}>سرور کی تمام سرگرمیاں log ہوتی ہیں</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
