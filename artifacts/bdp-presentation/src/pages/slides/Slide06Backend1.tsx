const base = import.meta.env.BASE_URL;

export default function Slide06Backend1() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#0a0a0a" }}>
      <img
        src={`${base}backend-tech.png`}
        crossOrigin="anonymous"
        className="absolute inset-0 w-full h-full object-cover"
        alt="Backend"
        style={{ opacity: 0.25 }}
      />
      <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(10,10,10,0.98) 50%, rgba(10,10,10,0.6) 100%)" }} />
      <div className="absolute top-0 left-0 w-full" style={{ height: "0.5vh", background: "linear-gradient(90deg, #8B4513, #D4843E, #8B4513)" }} />

      <div className="absolute inset-0 flex flex-col justify-center" style={{ padding: "5vh 8vw", maxWidth: "58vw" }}>
        <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.4vw", color: "#D4843E", marginBottom: "1.5vh" }}>بیک اینڈ — حصہ اول</p>
        <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "4.2vw", fontWeight: 900, color: "#FFF8F0", letterSpacing: "-0.02em", marginBottom: "4vh" }}>
          Express.js اور Node.js
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "2.5vh" }}>
          <div style={{ padding: "2.5vh 2.5vw", background: "rgba(212,132,62,0.1)", borderRadius: "0.8vw", borderRight: "0.3vw solid #D4843E" }}>
            <p style={{ fontFamily: "Playfair Display, serif", fontSize: "1.8vw", fontWeight: 700, color: "#D4843E", marginBottom: "0.7vh" }}>Node.js کیا ہے؟</p>
            <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.6vw", color: "rgba(255,248,240,0.85)", lineHeight: 1.7 }}>JavaScript کو سرور پر چلانے کی ٹیکنالوجی — براؤزر کے بغیر JavaScript</p>
          </div>
          <div style={{ padding: "2.5vh 2.5vw", background: "rgba(139,69,19,0.1)", borderRadius: "0.8vw", borderRight: "0.3vw solid #8B4513" }}>
            <p style={{ fontFamily: "Playfair Display, serif", fontSize: "1.8vw", fontWeight: 700, color: "#D4843E", marginBottom: "0.7vh" }}>Express 5 کیا ہے؟</p>
            <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.6vw", color: "rgba(255,248,240,0.85)", lineHeight: 1.7 }}>Node.js پر چلنے والا framework جو API routes بناتا ہے — مثلاً /api/products</p>
          </div>
          <div style={{ padding: "2.5vh 2.5vw", background: "rgba(212,132,62,0.1)", borderRadius: "0.8vw", borderRight: "0.3vw solid #D4843E" }}>
            <p style={{ fontFamily: "Playfair Display, serif", fontSize: "1.8vw", fontWeight: 700, color: "#D4843E", marginBottom: "0.7vh" }}>Zod</p>
            <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.6vw", color: "rgba(255,248,240,0.85)", lineHeight: 1.7 }}>آنے والے ڈیٹا کی تصدیق کرتا ہے کہ صحیح format میں ہے</p>
          </div>
        </div>
      </div>
    </div>
  );
}
