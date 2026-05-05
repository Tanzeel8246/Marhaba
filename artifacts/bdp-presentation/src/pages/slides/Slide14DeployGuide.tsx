export default function Slide14DeployGuide() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#0d0d0d" }}>
      <div className="absolute top-0 left-0 w-full" style={{ height: "0.5vh", background: "linear-gradient(90deg, #8B4513, #D4843E, #8B4513)" }} />
      <div className="absolute top-0 right-0" style={{ width: "20vw", height: "20vw", borderRadius: "50%", background: "radial-gradient(circle, rgba(139,69,19,0.1) 0%, transparent 70%)", transform: "translate(10%, -10%)" }} />

      <div className="absolute inset-0 flex flex-col" style={{ padding: "5vh 8vw" }}>
        <div style={{ marginBottom: "3.5vh" }}>
          <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.4vw", color: "#D4843E", marginBottom: "1vh" }}>step-by-step گائیڈ</p>
          <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "4vw", fontWeight: 900, color: "#FFF8F0", letterSpacing: "-0.02em" }}>
            اپنے سرور پر کیسے Deploy کریں؟
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3vw", flex: 1 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "2vh" }}>
            <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.7vw", fontWeight: 600, color: "#FFF8F0" }}>بیک اینڈ + DB (Render)</p>
            <div style={{ display: "flex", gap: "1.5vw", alignItems: "flex-start" }}>
              <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "1.4vw", color: "#D4843E", fontWeight: 700, minWidth: "1.5vw" }}>1</span>
              <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.5vw", color: "rgba(255,248,240,0.8)", lineHeight: 1.7 }}>render.com پر مفت account بنائیں</p>
            </div>
            <div style={{ display: "flex", gap: "1.5vw", alignItems: "flex-start" }}>
              <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "1.4vw", color: "#D4843E", fontWeight: 700, minWidth: "1.5vw" }}>2</span>
              <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.5vw", color: "rgba(255,248,240,0.8)", lineHeight: 1.7 }}>GitHub سے code connect کریں</p>
            </div>
            <div style={{ display: "flex", gap: "1.5vw", alignItems: "flex-start" }}>
              <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "1.4vw", color: "#D4843E", fontWeight: 700, minWidth: "1.5vw" }}>3</span>
              <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.5vw", color: "rgba(255,248,240,0.8)", lineHeight: 1.7 }}>DATABASE_URL environment variable ڈالیں</p>
            </div>
            <div style={{ display: "flex", gap: "1.5vw", alignItems: "flex-start" }}>
              <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "1.4vw", color: "#D4843E", fontWeight: 700, minWidth: "1.5vw" }}>4</span>
              <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.5vw", color: "rgba(255,248,240,0.8)", lineHeight: 1.7 }}>Build command: pnpm run build</p>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "2vh" }}>
            <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.7vw", fontWeight: 600, color: "#FFF8F0" }}>فرنٹ اینڈ (Vercel)</p>
            <div style={{ display: "flex", gap: "1.5vw", alignItems: "flex-start" }}>
              <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "1.4vw", color: "#D4843E", fontWeight: 700, minWidth: "1.5vw" }}>1</span>
              <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.5vw", color: "rgba(255,248,240,0.8)", lineHeight: 1.7 }}>vercel.com پر GitHub login کریں</p>
            </div>
            <div style={{ display: "flex", gap: "1.5vw", alignItems: "flex-start" }}>
              <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "1.4vw", color: "#D4843E", fontWeight: 700, minWidth: "1.5vw" }}>2</span>
              <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.5vw", color: "rgba(255,248,240,0.8)", lineHeight: 1.7 }}>bake-delight-pro فولڈر import کریں</p>
            </div>
            <div style={{ display: "flex", gap: "1.5vw", alignItems: "flex-start" }}>
              <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "1.4vw", color: "#D4843E", fontWeight: 700, minWidth: "1.5vw" }}>3</span>
              <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.5vw", color: "rgba(255,248,240,0.8)", lineHeight: 1.7 }}>API URL environment variable ڈالیں</p>
            </div>
            <div style={{ display: "flex", gap: "1.5vw", alignItems: "flex-start" }}>
              <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "1.4vw", color: "#D4843E", fontWeight: 700, minWidth: "1.5vw" }}>4</span>
              <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.5vw", color: "rgba(255,248,240,0.8)", lineHeight: 1.7 }}>Deploy کریں — .vercel.app domain ملے گا</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
