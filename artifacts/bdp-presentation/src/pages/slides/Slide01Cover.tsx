const base = import.meta.env.BASE_URL;

export default function Slide01Cover() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#0a0a0a" }}>
      <img
        src={`${base}hero-bakery.png`}
        crossOrigin="anonymous"
        className="absolute inset-0 w-full h-full object-cover"
        alt="Bakery"
        style={{ opacity: 0.45 }}
      />
      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(139,69,19,0.7) 0%, rgba(10,10,10,0.85) 60%)" }} />

      <div className="absolute inset-0 flex flex-col justify-center" style={{ padding: "0 8vw" }}>
        <div style={{ width: "3vw", height: "0.4vh", background: "#D4843E", marginBottom: "3vh" }} />
        <h1 style={{
          fontFamily: "Playfair Display, serif",
          fontSize: "7vw",
          fontWeight: 900,
          color: "#FFF8F0",
          letterSpacing: "-0.02em",
          lineHeight: 1.05,
          textWrap: "balance",
          marginBottom: "2vh"
        }}>
          مرحبا سویٹس اینڈ بیکرز
        </h1>
        <p style={{
          fontFamily: "Noto Nastaliq Urdu, serif",
          fontSize: "2.8vw",
          color: "#D4843E",
          fontWeight: 600,
          marginBottom: "1.5vh"
        }}>
          تکنیکی پریزینٹیشن
        </p>
        <p style={{
          fontFamily: "Noto Nastaliq Urdu, serif",
          fontSize: "1.8vw",
          color: "rgba(255,248,240,0.65)",
          fontWeight: 400
        }}>
          پاکستانی بیکری ای-کامرس پلیٹ فارم
        </p>
        <div style={{ marginTop: "5vh", display: "flex", gap: "2vw", alignItems: "center" }}>
          <span style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.5vw", color: "rgba(255,248,240,0.5)" }}>فرنٹ اینڈ</span>
          <div style={{ width: "0.3vw", height: "0.3vw", borderRadius: "50%", background: "#D4843E" }} />
          <span style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.5vw", color: "rgba(255,248,240,0.5)" }}>بیک اینڈ</span>
          <div style={{ width: "0.3vw", height: "0.3vw", borderRadius: "50%", background: "#D4843E" }} />
          <span style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.5vw", color: "rgba(255,248,240,0.5)" }}>ڈیٹا بیس</span>
          <div style={{ width: "0.3vw", height: "0.3vw", borderRadius: "50%", background: "#D4843E" }} />
          <span style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.5vw", color: "rgba(255,248,240,0.5)" }}>ڈپلائمنٹ</span>
        </div>
      </div>

      <div className="absolute bottom-0 right-0" style={{ width: "35vw", height: "35vw", borderRadius: "50%", background: "radial-gradient(circle, rgba(212,132,62,0.12) 0%, transparent 70%)", transform: "translate(30%, 30%)" }} />
    </div>
  );
}
