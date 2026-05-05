export default function Slide03TechStack() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#0d0d0d" }}>
      <div className="absolute top-0 left-0 w-full" style={{ height: "0.5vh", background: "linear-gradient(90deg, #8B4513, #D4843E, #8B4513)" }} />
      <div className="absolute bottom-0 right-0" style={{ width: "30vw", height: "30vw", borderRadius: "50%", background: "radial-gradient(circle, rgba(212,132,62,0.08) 0%, transparent 70%)", transform: "translate(20%, 20%)" }} />

      <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ padding: "5vh 8vw" }}>
        <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.5vw", color: "#D4843E", marginBottom: "1.5vh" }}>مکمل ٹیکنالوجی اسٹیک</p>
        <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "4.5vw", fontWeight: 900, color: "#FFF8F0", letterSpacing: "-0.02em", marginBottom: "5vh", textAlign: "center" }}>
          تین پرتوں کا Architecture
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "3vw", width: "100%" }}>
          <div style={{ textAlign: "center", padding: "3vh 2vw", background: "linear-gradient(135deg, rgba(139,69,19,0.2), rgba(139,69,19,0.05))", borderRadius: "1.2vw", border: "0.1vw solid rgba(139,69,19,0.4)" }}>
            <div style={{ fontSize: "4vw", marginBottom: "1.5vh" }}>🖥️</div>
            <p style={{ fontFamily: "Playfair Display, serif", fontSize: "2vw", fontWeight: 700, color: "#D4843E", marginBottom: "1vh" }}>فرنٹ اینڈ</p>
            <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.5vw", color: "rgba(255,248,240,0.7)", lineHeight: 1.8 }}>React + Vite + TypeScript</p>
            <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.4vw", color: "rgba(255,248,240,0.5)", marginTop: "0.8vh" }}>جو براؤزر میں چلتا ہے</p>
          </div>
          <div style={{ textAlign: "center", padding: "3vh 2vw", background: "linear-gradient(135deg, rgba(212,132,62,0.2), rgba(212,132,62,0.05))", borderRadius: "1.2vw", border: "0.1vw solid rgba(212,132,62,0.4)" }}>
            <div style={{ fontSize: "4vw", marginBottom: "1.5vh" }}>⚙️</div>
            <p style={{ fontFamily: "Playfair Display, serif", fontSize: "2vw", fontWeight: 700, color: "#D4843E", marginBottom: "1vh" }}>بیک اینڈ</p>
            <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.5vw", color: "rgba(255,248,240,0.7)", lineHeight: 1.8 }}>Express.js + Node.js</p>
            <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.4vw", color: "rgba(255,248,240,0.5)", marginTop: "0.8vh" }}>سرور پر چلنے والا انجن</p>
          </div>
          <div style={{ textAlign: "center", padding: "3vh 2vw", background: "linear-gradient(135deg, rgba(139,69,19,0.2), rgba(139,69,19,0.05))", borderRadius: "1.2vw", border: "0.1vw solid rgba(139,69,19,0.4)" }}>
            <div style={{ fontSize: "4vw", marginBottom: "1.5vh" }}>🗄️</div>
            <p style={{ fontFamily: "Playfair Display, serif", fontSize: "2vw", fontWeight: 700, color: "#D4843E", marginBottom: "1vh" }}>ڈیٹا بیس</p>
            <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.5vw", color: "rgba(255,248,240,0.7)", lineHeight: 1.8 }}>PostgreSQL + Drizzle ORM</p>
            <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.4vw", color: "rgba(255,248,240,0.5)", marginTop: "0.8vh" }}>ڈیٹا محفوظ کرنے کا نظام</p>
          </div>
        </div>
      </div>
    </div>
  );
}
