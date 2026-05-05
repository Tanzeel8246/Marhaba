export default function Slide09Monorepo() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "linear-gradient(160deg, #0a0a0a 0%, #150d08 100%)" }}>
      <div className="absolute top-0 left-0 w-full" style={{ height: "0.5vh", background: "linear-gradient(90deg, #8B4513, #D4843E, #8B4513)" }} />

      <div className="absolute inset-0 flex flex-col" style={{ padding: "5vh 8vw" }}>
        <div style={{ marginBottom: "3.5vh" }}>
          <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.4vw", color: "#D4843E", marginBottom: "1vh" }}>پروجیکٹ کی ساخت</p>
          <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "4vw", fontWeight: 900, color: "#FFF8F0", letterSpacing: "-0.02em" }}>
            pnpm Monorepo
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4vw", flex: 1 }}>
          <div>
            <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.6vw", fontWeight: 600, color: "#FFF8F0", marginBottom: "2vh" }}>فولڈر کی ساخت</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.2vh", fontFamily: "JetBrains Mono, monospace", fontSize: "1.4vw" }}>
              <div style={{ color: "#D4843E" }}>workspace/</div>
              <div style={{ color: "rgba(255,248,240,0.6)", paddingRight: "2vw" }}>├── artifacts/</div>
              <div style={{ color: "#D4843E", paddingRight: "4vw" }}>│&nbsp;&nbsp;&nbsp;├── bake-delight-pro/</div>
              <div style={{ color: "rgba(255,248,240,0.5)", paddingRight: "6vw" }}>│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;└── (فرنٹ اینڈ)</div>
              <div style={{ color: "#D4843E", paddingRight: "4vw" }}>│&nbsp;&nbsp;&nbsp;└── api-server/</div>
              <div style={{ color: "rgba(255,248,240,0.5)", paddingRight: "6vw" }}>│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── (بیک اینڈ)</div>
              <div style={{ color: "rgba(255,248,240,0.6)", paddingRight: "2vw" }}>└── lib/</div>
              <div style={{ color: "#D4843E", paddingRight: "4vw" }}>&nbsp;&nbsp;&nbsp;&nbsp;├── db/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(schema)</div>
              <div style={{ color: "#D4843E", paddingRight: "4vw" }}>&nbsp;&nbsp;&nbsp;&nbsp;└── api-spec/ (OpenAPI)</div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "2vh" }}>
            <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.6vw", fontWeight: 600, color: "#FFF8F0", marginBottom: "0.5vh" }}>pnpm کیوں؟</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5vh" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "1.2vw" }}>
                <div style={{ width: "0.5vw", height: "0.5vw", borderRadius: "50%", background: "#D4843E", flexShrink: 0, marginTop: "0.8vh" }} />
                <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.5vw", color: "rgba(255,248,240,0.8)", lineHeight: 1.7 }}>ایک ہی جگہ سے فرنٹ اور بیک دونوں مینیج ہوتے ہیں</p>
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "1.2vw" }}>
                <div style={{ width: "0.5vw", height: "0.5vw", borderRadius: "50%", background: "#D4843E", flexShrink: 0, marginTop: "0.8vh" }} />
                <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.5vw", color: "rgba(255,248,240,0.8)", lineHeight: 1.7 }}>مشترک کوڈ lib فولڈر میں ہوتا ہے — دہرانا نہیں پڑتا</p>
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "1.2vw" }}>
                <div style={{ width: "0.5vw", height: "0.5vw", borderRadius: "50%", background: "#D4843E", flexShrink: 0, marginTop: "0.8vh" }} />
                <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.5vw", color: "rgba(255,248,240,0.8)", lineHeight: 1.7 }}>npm سے تیز اور disk پر کم جگہ لیتا ہے</p>
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "1.2vw" }}>
                <div style={{ width: "0.5vw", height: "0.5vw", borderRadius: "50%", background: "#D4843E", flexShrink: 0, marginTop: "0.8vh" }} />
                <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.5vw", color: "rgba(255,248,240,0.8)", lineHeight: 1.7 }}>Replit کا recommended package manager</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
