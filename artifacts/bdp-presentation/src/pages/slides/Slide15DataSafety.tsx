export default function Slide15DataSafety() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "linear-gradient(160deg, #0a0a0a 0%, #150d08 100%)" }}>
      <div className="absolute top-0 left-0 w-full" style={{ height: "0.5vh", background: "linear-gradient(90deg, #8B4513, #D4843E, #8B4513)" }} />

      <div className="absolute inset-0 flex flex-col" style={{ padding: "5vh 8vw" }}>
        <div style={{ marginBottom: "3.5vh" }}>
          <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.4vw", color: "#D4843E", marginBottom: "1vh" }}>ڈیٹا کی حفاظت</p>
          <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "4vw", fontWeight: 900, color: "#FFF8F0", letterSpacing: "-0.02em" }}>
            ڈیٹا مستقل کیسے محفوظ رہے؟
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3vw", flex: 1 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "2.2vh" }}>
            <div style={{ padding: "2.5vh 2.5vw", background: "rgba(139,69,19,0.15)", borderRadius: "1vw", borderLeft: "0.3vw solid #8B4513" }}>
              <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.7vw", fontWeight: 700, color: "#D4843E", marginBottom: "0.7vh" }}>خودکار Backups</p>
              <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.5vw", color: "rgba(255,248,240,0.8)", lineHeight: 1.7 }}>Supabase اور Neon روزانہ backup لیتے ہیں — کوئی data ضائع نہیں ہوتا</p>
            </div>
            <div style={{ padding: "2.5vh 2.5vw", background: "rgba(139,69,19,0.15)", borderRadius: "1vw", borderLeft: "0.3vw solid #8B4513" }}>
              <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.7vw", fontWeight: 700, color: "#D4843E", marginBottom: "0.7vh" }}>Migrations</p>
              <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.5vw", color: "rgba(255,248,240,0.8)", lineHeight: 1.7 }}>Drizzle Kit سے schema تبدیل ہو تو data محفوظ رہتا ہے</p>
            </div>
            <div style={{ padding: "2.5vh 2.5vw", background: "rgba(139,69,19,0.15)", borderRadius: "1vw", borderLeft: "0.3vw solid #8B4513" }}>
              <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.7vw", fontWeight: 700, color: "#D4843E", marginBottom: "0.7vh" }}>Environment Variables</p>
              <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.5vw", color: "rgba(255,248,240,0.8)", lineHeight: 1.7 }}>DATABASE_URL اور secrets کبھی code میں نہ لکھیں</p>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "2.2vh" }}>
            <div style={{ padding: "2.5vh 2.5vw", background: "rgba(212,132,62,0.1)", borderRadius: "1vw", borderLeft: "0.3vw solid #D4843E" }}>
              <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.7vw", fontWeight: 700, color: "#D4843E", marginBottom: "0.7vh" }}>Manual Backup کیسے لیں؟</p>
              <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "1.3vw", color: "rgba(255,248,240,0.7)", background: "rgba(0,0,0,0.3)", padding: "1.5vh 1.5vw", borderRadius: "0.5vw", lineHeight: 2 }}>
                pg_dump DATABASE_URL
              </div>
            </div>
            <div style={{ padding: "2.5vh 2.5vw", background: "rgba(212,132,62,0.1)", borderRadius: "1vw", borderLeft: "0.3vw solid #D4843E" }}>
              <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.7vw", fontWeight: 700, color: "#D4843E", marginBottom: "0.7vh" }}>SSL اور Encryption</p>
              <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.5vw", color: "rgba(255,248,240,0.8)", lineHeight: 1.7 }}>سب managed platforms HTTPS اور SSL خودکار دیتے ہیں</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
