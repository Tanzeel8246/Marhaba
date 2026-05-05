export default function Slide13DBFree() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "linear-gradient(160deg, #0f0a07 0%, #1a0f08 100%)" }}>
      <div className="absolute top-0 left-0 w-full" style={{ height: "0.5vh", background: "linear-gradient(90deg, #8B4513, #D4843E, #8B4513)" }} />

      <div className="absolute inset-0 flex flex-col" style={{ padding: "5vh 8vw" }}>
        <div style={{ marginBottom: "3.5vh" }}>
          <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.4vw", color: "#D4843E", marginBottom: "1vh" }}>دوسرے آپشن</p>
          <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "4vw", fontWeight: 900, color: "#FFF8F0", letterSpacing: "-0.02em" }}>
            ڈیٹا بیس کے لیے مفت پلیٹ فارم
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3vw", flex: 1 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "2vh" }}>
            <div style={{ padding: "2.8vh 2.5vw", background: "rgba(139,69,19,0.15)", borderRadius: "1vw", border: "0.1vw solid rgba(139,69,19,0.3)" }}>
              <p style={{ fontFamily: "Playfair Display, serif", fontSize: "1.9vw", fontWeight: 700, color: "#D4843E", marginBottom: "0.8vh" }}>Supabase</p>
              <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.5vw", color: "rgba(255,248,240,0.85)", lineHeight: 1.7, marginBottom: "0.8vh" }}>مفت PostgreSQL کے ساتھ dashboard، auth، storage بھی</p>
              <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.4vw", color: "rgba(255,248,240,0.5)" }}>500MB مفت، 2 projects</p>
            </div>
            <div style={{ padding: "2.8vh 2.5vw", background: "rgba(212,132,62,0.1)", borderRadius: "1vw", border: "0.1vw solid rgba(212,132,62,0.25)" }}>
              <p style={{ fontFamily: "Playfair Display, serif", fontSize: "1.9vw", fontWeight: 700, color: "#D4843E", marginBottom: "0.8vh" }}>Neon</p>
              <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.5vw", color: "rgba(255,248,240,0.85)", lineHeight: 1.7, marginBottom: "0.8vh" }}>Serverless PostgreSQL — instant start</p>
              <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.4vw", color: "rgba(255,248,240,0.5)" }}>مفت tier ہمیشہ کے لیے</p>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "2vh" }}>
            <div style={{ padding: "2.8vh 2.5vw", background: "rgba(139,69,19,0.15)", borderRadius: "1vw", border: "0.1vw solid rgba(139,69,19,0.3)" }}>
              <p style={{ fontFamily: "Playfair Display, serif", fontSize: "1.9vw", fontWeight: 700, color: "#D4843E", marginBottom: "0.8vh" }}>Aiven</p>
              <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.5vw", color: "rgba(255,248,240,0.85)", lineHeight: 1.7, marginBottom: "0.8vh" }}>managed PostgreSQL، backups خودکار</p>
              <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.4vw", color: "rgba(255,248,240,0.5)" }}>$300 مفت trial</p>
            </div>
            <div style={{ padding: "2.8vh 2.5vw", background: "rgba(212,132,62,0.1)", borderRadius: "1vw", border: "0.1vw solid rgba(212,132,62,0.25)" }}>
              <p style={{ fontFamily: "Playfair Display, serif", fontSize: "1.9vw", fontWeight: 700, color: "#D4843E", marginBottom: "0.8vh" }}>ElephantSQL</p>
              <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.5vw", color: "rgba(255,248,240,0.85)", lineHeight: 1.7, marginBottom: "0.8vh" }}>سادہ مفت PostgreSQL hosting</p>
              <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.4vw", color: "rgba(255,248,240,0.5)" }}>20MB مفت — چھوٹے projects کے لیے</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
