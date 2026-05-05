export default function Slide11FreeHosting() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "linear-gradient(160deg, #0f0a07 0%, #1a0f08 100%)" }}>
      <div className="absolute top-0 left-0 w-full" style={{ height: "0.5vh", background: "linear-gradient(90deg, #8B4513, #D4843E, #8B4513)" }} />

      <div className="absolute inset-0 flex flex-col" style={{ padding: "5vh 8vw" }}>
        <div style={{ marginBottom: "3.5vh" }}>
          <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.4vw", color: "#D4843E", marginBottom: "1vh" }}>دوسرے آپشن</p>
          <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "4vw", fontWeight: 900, color: "#FFF8F0", letterSpacing: "-0.02em" }}>
            فرنٹ اینڈ کے لیے مفت پلیٹ فارم
          </h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "2.2vh", flex: 1, justifyContent: "center" }}>
          <div style={{ display: "grid", gridTemplateColumns: "0.5fr 1fr 1fr", gap: "2vw", alignItems: "center", padding: "2.2vh 2vw", background: "rgba(139,69,19,0.15)", borderRadius: "0.8vw", border: "0.1vw solid rgba(139,69,19,0.25)" }}>
            <p style={{ fontFamily: "Playfair Display, serif", fontSize: "1.8vw", fontWeight: 700, color: "#D4843E" }}>Vercel</p>
            <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.5vw", color: "rgba(255,248,240,0.85)" }}>React apps کے لیے بہترین</p>
            <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.4vw", color: "rgba(255,248,240,0.55)" }}>مفت میں custom domain، auto HTTPS</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "0.5fr 1fr 1fr", gap: "2vw", alignItems: "center", padding: "2.2vh 2vw", background: "rgba(212,132,62,0.1)", borderRadius: "0.8vw", border: "0.1vw solid rgba(212,132,62,0.2)" }}>
            <p style={{ fontFamily: "Playfair Display, serif", fontSize: "1.8vw", fontWeight: 700, color: "#D4843E" }}>Netlify</p>
            <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.5vw", color: "rgba(255,248,240,0.85)" }}>drag-and-drop سے deploy</p>
            <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.4vw", color: "rgba(255,248,240,0.55)" }}>100GB bandwidth مفت، form handling</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "0.5fr 1fr 1fr", gap: "2vw", alignItems: "center", padding: "2.2vh 2vw", background: "rgba(139,69,19,0.15)", borderRadius: "0.8vw", border: "0.1vw solid rgba(139,69,19,0.25)" }}>
            <p style={{ fontFamily: "Playfair Display, serif", fontSize: "1.8vw", fontWeight: 700, color: "#D4843E" }}>GitHub Pages</p>
            <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.5vw", color: "rgba(255,248,240,0.85)" }}>GitHub سے براہ راست publish</p>
            <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.4vw", color: "rgba(255,248,240,0.55)" }}>مکمل مفت مگر صرف static sites</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "0.5fr 1fr 1fr", gap: "2vw", alignItems: "center", padding: "2.2vh 2vw", background: "rgba(212,132,62,0.1)", borderRadius: "0.8vw", border: "0.1vw solid rgba(212,132,62,0.2)" }}>
            <p style={{ fontFamily: "Playfair Display, serif", fontSize: "1.8vw", fontWeight: 700, color: "#D4843E" }}>Cloudflare Pages</p>
            <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.5vw", color: "rgba(255,248,240,0.85)" }}>انتہائی تیز CDN</p>
            <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.4vw", color: "rgba(255,248,240,0.55)" }}>مفت unlimited bandwidth</p>
          </div>
        </div>
      </div>
    </div>
  );
}
