export default function Slide10ReplitDeploy() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#0d0d0d" }}>
      <div className="absolute top-0 left-0 w-full" style={{ height: "0.5vh", background: "linear-gradient(90deg, #8B4513, #D4843E, #8B4513)" }} />
      <div className="absolute inset-0 flex items-center justify-center" style={{ padding: "5vh 8vw" }}>
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "4vh" }}>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.4vw", color: "#D4843E", marginBottom: "1.5vh" }}>ڈپلائمنٹ — Replit</p>
            <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "5vw", fontWeight: 900, color: "#FFF8F0", letterSpacing: "-0.02em" }}>
              ابھی Live ہے!
            </h2>
            <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "2vw", color: "#D4843E", marginTop: "1vh" }}>یہ پروجیکٹ Replit پر publish ہو چکا ہے</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "2.5vw" }}>
            <div style={{ padding: "3vh 2vw", textAlign: "center", background: "rgba(139,69,19,0.15)", borderRadius: "1vw", border: "0.1vw solid rgba(139,69,19,0.3)" }}>
              <p style={{ fontFamily: "Playfair Display, serif", fontSize: "1.8vw", fontWeight: 700, color: "#D4843E", marginBottom: "1vh" }}>فرنٹ اینڈ</p>
              <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "1.3vw", color: "rgba(255,248,240,0.7)", marginBottom: "1vh" }}>Static Files</p>
              <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.4vw", color: "rgba(255,248,240,0.6)", lineHeight: 1.7 }}>Vite build سے بنی فائلیں API Server serve کرتا ہے</p>
            </div>
            <div style={{ padding: "3vh 2vw", textAlign: "center", background: "rgba(212,132,62,0.12)", borderRadius: "1vw", border: "0.1vw solid rgba(212,132,62,0.3)" }}>
              <p style={{ fontFamily: "Playfair Display, serif", fontSize: "1.8vw", fontWeight: 700, color: "#D4843E", marginBottom: "1vh" }}>بیک اینڈ</p>
              <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "1.3vw", color: "rgba(255,248,240,0.7)", marginBottom: "1vh" }}>Node.js Server</p>
              <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.4vw", color: "rgba(255,248,240,0.6)", lineHeight: 1.7 }}>Express server ہمیشہ چلتا رہتا ہے</p>
            </div>
            <div style={{ padding: "3vh 2vw", textAlign: "center", background: "rgba(139,69,19,0.15)", borderRadius: "1vw", border: "0.1vw solid rgba(139,69,19,0.3)" }}>
              <p style={{ fontFamily: "Playfair Display, serif", fontSize: "1.8vw", fontWeight: 700, color: "#D4843E", marginBottom: "1vh" }}>ڈیٹا بیس</p>
              <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "1.3vw", color: "rgba(255,248,240,0.7)", marginBottom: "1vh" }}>Replit PostgreSQL</p>
              <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.4vw", color: "rgba(255,248,240,0.6)", lineHeight: 1.7 }}>Replit کا built-in ڈیٹا بیس</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
