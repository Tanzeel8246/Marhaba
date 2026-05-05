const base = import.meta.env.BASE_URL;

export default function Slide17Closing() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#0a0a0a" }}>
      <img
        src={`${base}hero-bakery.png`}
        crossOrigin="anonymous"
        className="absolute inset-0 w-full h-full object-cover"
        alt="Bakery"
        style={{ opacity: 0.35 }}
      />
      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(10,10,10,0.9) 0%, rgba(139,69,19,0.5) 100%)" }} />

      <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ padding: "5vh 10vw", textAlign: "center" }}>
        <div style={{ width: "5vw", height: "0.4vh", background: "#D4843E", marginBottom: "4vh" }} />
        <h2 style={{
          fontFamily: "Playfair Display, serif",
          fontSize: "6vw",
          fontWeight: 900,
          color: "#FFF8F0",
          letterSpacing: "-0.02em",
          lineHeight: 1.1,
          textWrap: "balance",
          marginBottom: "3vh"
        }}>
          مرحبا سویٹس اینڈ بیکرز
        </h2>
        <p style={{
          fontFamily: "Noto Nastaliq Urdu, serif",
          fontSize: "2.5vw",
          color: "#D4843E",
          fontWeight: 600,
          marginBottom: "2vh"
        }}>
          مکمل، محفوظ، اور مستقبل کے لیے تیار
        </p>
        <p style={{
          fontFamily: "Noto Nastaliq Urdu, serif",
          fontSize: "1.8vw",
          color: "rgba(255,248,240,0.65)",
          maxWidth: "55vw",
          lineHeight: 1.8,
          marginBottom: "5vh"
        }}>
          React + Express + PostgreSQL — تین طاقتور ٹیکنالوجیاں مل کر ایک مکمل بیکری پلیٹ فارم
        </p>
        <div style={{ display: "flex", gap: "3vw", alignItems: "center" }}>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontFamily: "Playfair Display, serif", fontSize: "1.6vw", fontWeight: 700, color: "#D4843E" }}>فرنٹ اینڈ</p>
            <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "1.3vw", color: "rgba(255,248,240,0.5)" }}>React + Vite</p>
          </div>
          <div style={{ width: "0.4vh", height: "5vh", background: "rgba(212,132,62,0.4)" }} />
          <div style={{ textAlign: "center" }}>
            <p style={{ fontFamily: "Playfair Display, serif", fontSize: "1.6vw", fontWeight: 700, color: "#D4843E" }}>بیک اینڈ</p>
            <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "1.3vw", color: "rgba(255,248,240,0.5)" }}>Express + Node.js</p>
          </div>
          <div style={{ width: "0.4vh", height: "5vh", background: "rgba(212,132,62,0.4)" }} />
          <div style={{ textAlign: "center" }}>
            <p style={{ fontFamily: "Playfair Display, serif", fontSize: "1.6vw", fontWeight: 700, color: "#D4843E" }}>ڈیٹا بیس</p>
            <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "1.3vw", color: "rgba(255,248,240,0.5)" }}>PostgreSQL</p>
          </div>
        </div>
        <div style={{ width: "5vw", height: "0.4vh", background: "#D4843E", marginTop: "4vh" }} />
      </div>
    </div>
  );
}
