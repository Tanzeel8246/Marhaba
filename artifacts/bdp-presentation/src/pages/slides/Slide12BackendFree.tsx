export default function Slide12BackendFree() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#0d0d0d" }}>
      <div className="absolute top-0 left-0 w-full" style={{ height: "0.5vh", background: "linear-gradient(90deg, #8B4513, #D4843E, #8B4513)" }} />
      <div className="absolute bottom-0 left-0" style={{ width: "20vw", height: "20vw", borderRadius: "50%", background: "radial-gradient(circle, rgba(212,132,62,0.08) 0%, transparent 70%)", transform: "translate(-30%, 30%)" }} />

      <div className="absolute inset-0 flex flex-col" style={{ padding: "5vh 8vw" }}>
        <div style={{ marginBottom: "3.5vh" }}>
          <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.4vw", color: "#D4843E", marginBottom: "1vh" }}>دوسرے آپشن</p>
          <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "4vw", fontWeight: 900, color: "#FFF8F0", letterSpacing: "-0.02em" }}>
            بیک اینڈ کے لیے مفت پلیٹ فارم
          </h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "2.2vh", flex: 1, justifyContent: "center" }}>
          <div style={{ display: "grid", gridTemplateColumns: "0.5fr 1.2fr 1fr", gap: "2vw", alignItems: "center", padding: "2.2vh 2vw", background: "rgba(139,69,19,0.15)", borderRadius: "0.8vw", border: "0.1vw solid rgba(139,69,19,0.25)" }}>
            <p style={{ fontFamily: "Playfair Display, serif", fontSize: "1.8vw", fontWeight: 700, color: "#D4843E" }}>Render</p>
            <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.5vw", color: "rgba(255,248,240,0.85)" }}>Node.js apps کے لیے سب سے آسان</p>
            <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.4vw", color: "rgba(255,248,240,0.55)" }}>مفت tier دستیاب، GitHub سے connect</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "0.5fr 1.2fr 1fr", gap: "2vw", alignItems: "center", padding: "2.2vh 2vw", background: "rgba(212,132,62,0.1)", borderRadius: "0.8vw", border: "0.1vw solid rgba(212,132,62,0.2)" }}>
            <p style={{ fontFamily: "Playfair Display, serif", fontSize: "1.8vw", fontWeight: 700, color: "#D4843E" }}>Railway</p>
            <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.5vw", color: "rgba(255,248,240,0.85)" }}>ایک کلک deploy، DB بھی ساتھ</p>
            <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.4vw", color: "rgba(255,248,240,0.55)" }}>$5 credit مفت ہر ماہ</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "0.5fr 1.2fr 1fr", gap: "2vw", alignItems: "center", padding: "2.2vh 2vw", background: "rgba(139,69,19,0.15)", borderRadius: "0.8vw", border: "0.1vw solid rgba(139,69,19,0.25)" }}>
            <p style={{ fontFamily: "Playfair Display, serif", fontSize: "1.8vw", fontWeight: 700, color: "#D4843E" }}>Fly.io</p>
            <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.5vw", color: "rgba(255,248,240,0.85)" }}>Docker containers، global deploy</p>
            <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.4vw", color: "rgba(255,248,240,0.55)" }}>مفت tier، قریبی server</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "0.5fr 1.2fr 1fr", gap: "2vw", alignItems: "center", padding: "2.2vh 2vw", background: "rgba(212,132,62,0.1)", borderRadius: "0.8vw", border: "0.1vw solid rgba(212,132,62,0.2)" }}>
            <p style={{ fontFamily: "Playfair Display, serif", fontSize: "1.8vw", fontWeight: 700, color: "#D4843E" }}>Koyeb</p>
            <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.5vw", color: "rgba(255,248,240,0.85)" }}>serverless Node.js</p>
            <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.4vw", color: "rgba(255,248,240,0.55)" }}>generous مفت tier</p>
          </div>
        </div>
      </div>
    </div>
  );
}
