export default function Slide16RecommendedStack() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#0d0d0d" }}>
      <div className="absolute top-0 left-0 w-full" style={{ height: "0.5vh", background: "linear-gradient(90deg, #8B4513, #D4843E, #8B4513)" }} />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(139,69,19,0.08) 0%, transparent 70%)" }} />

      <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ padding: "5vh 10vw" }}>
        <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.4vw", color: "#D4843E", marginBottom: "1.5vh", textAlign: "center" }}>ہماری سفارش</p>
        <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "4vw", fontWeight: 900, color: "#FFF8F0", letterSpacing: "-0.02em", marginBottom: "5vh", textAlign: "center" }}>
          بہترین مفت Stack
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "2vw", width: "100%" }}>
          <div style={{ textAlign: "center", padding: "3vh 1.5vw", background: "linear-gradient(135deg, rgba(139,69,19,0.25), rgba(139,69,19,0.08))", borderRadius: "1.2vw", border: "0.15vw solid rgba(212,132,62,0.35)" }}>
            <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.3vw", color: "rgba(255,248,240,0.5)", marginBottom: "1vh" }}>فرنٹ اینڈ</p>
            <p style={{ fontFamily: "Playfair Display, serif", fontSize: "2.2vw", fontWeight: 900, color: "#D4843E", marginBottom: "0.8vh" }}>Vercel</p>
            <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.3vw", color: "rgba(255,248,240,0.65)" }}>مفت، تیز، GitHub سے connect</p>
          </div>
          <div style={{ textAlign: "center", padding: "3vh 1.5vw", background: "linear-gradient(135deg, rgba(212,132,62,0.25), rgba(212,132,62,0.08))", borderRadius: "1.2vw", border: "0.15vw solid rgba(212,132,62,0.45)" }}>
            <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.3vw", color: "rgba(255,248,240,0.5)", marginBottom: "1vh" }}>بیک اینڈ</p>
            <p style={{ fontFamily: "Playfair Display, serif", fontSize: "2.2vw", fontWeight: 900, color: "#D4843E", marginBottom: "0.8vh" }}>Render</p>
            <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.3vw", color: "rgba(255,248,240,0.65)" }}>Node.js کے لیے آسان ترین</p>
          </div>
          <div style={{ textAlign: "center", padding: "3vh 1.5vw", background: "linear-gradient(135deg, rgba(139,69,19,0.25), rgba(139,69,19,0.08))", borderRadius: "1.2vw", border: "0.15vw solid rgba(212,132,62,0.35)" }}>
            <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.3vw", color: "rgba(255,248,240,0.5)", marginBottom: "1vh" }}>ڈیٹا بیس</p>
            <p style={{ fontFamily: "Playfair Display, serif", fontSize: "2.2vw", fontWeight: 900, color: "#D4843E", marginBottom: "0.8vh" }}>Supabase</p>
            <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.3vw", color: "rgba(255,248,240,0.65)" }}>مفت PostgreSQL + backup</p>
          </div>
          <div style={{ textAlign: "center", padding: "3vh 1.5vw", background: "linear-gradient(135deg, rgba(212,132,62,0.25), rgba(212,132,62,0.08))", borderRadius: "1.2vw", border: "0.15vw solid rgba(212,132,62,0.45)" }}>
            <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.3vw", color: "rgba(255,248,240,0.5)", marginBottom: "1vh" }}>ابھی</p>
            <p style={{ fontFamily: "Playfair Display, serif", fontSize: "2.2vw", fontWeight: 900, color: "#D4843E", marginBottom: "0.8vh" }}>Replit</p>
            <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.3vw", color: "rgba(255,248,240,0.65)" }}>سب ایک جگہ، publish ہو چکا</p>
          </div>
        </div>

        <div style={{ marginTop: "4vh", padding: "2vh 4vw", background: "rgba(212,132,62,0.1)", borderRadius: "0.8vw", border: "0.1vw solid rgba(212,132,62,0.3)", textAlign: "center" }}>
          <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.6vw", color: "rgba(255,248,240,0.8)" }}>تینوں مل کر = مکمل مفت production-ready app</p>
        </div>
      </div>
    </div>
  );
}
