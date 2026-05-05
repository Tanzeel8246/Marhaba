const base = import.meta.env.BASE_URL;

export default function Slide04Frontend1() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#0a0a0a" }}>
      <img
        src={`${base}frontend-tech.png`}
        crossOrigin="anonymous"
        className="absolute inset-0 w-full h-full object-cover"
        alt="Frontend"
        style={{ opacity: 0.3 }}
      />
      <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(10,10,10,0.98) 55%, rgba(10,10,10,0.5) 100%)" }} />
      <div className="absolute top-0 left-0 w-full" style={{ height: "0.5vh", background: "linear-gradient(90deg, #8B4513, #D4843E, #8B4513)" }} />

      <div className="absolute inset-0 flex flex-col justify-center" style={{ padding: "5vh 8vw", maxWidth: "60vw" }}>
        <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.4vw", color: "#D4843E", marginBottom: "1.5vh" }}>فرنٹ اینڈ — حصہ اول</p>
        <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "4.2vw", fontWeight: 900, color: "#FFF8F0", letterSpacing: "-0.02em", marginBottom: "4vh" }}>
          React اور Vite
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "2.5vh" }}>
          <div style={{ display: "flex", gap: "2vw", alignItems: "flex-start" }}>
            <div style={{ minWidth: "2.5vw", height: "2.5vw", borderRadius: "50%", background: "#8B4513", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "0.3vh" }}>
              <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "1.2vw", color: "#FFF8F0", fontWeight: 600 }}>1</span>
            </div>
            <div>
              <p style={{ fontFamily: "Playfair Display, serif", fontSize: "1.8vw", fontWeight: 700, color: "#D4843E", marginBottom: "0.5vh" }}>React 19</p>
              <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.6vw", color: "rgba(255,248,240,0.8)", lineHeight: 1.7 }}>فیس بک کی تیار کردہ لائبریری جو UI کے چھوٹے چھوٹے حصے (components) بناتی ہے</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: "2vw", alignItems: "flex-start" }}>
            <div style={{ minWidth: "2.5vw", height: "2.5vw", borderRadius: "50%", background: "#8B4513", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "0.3vh" }}>
              <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "1.2vw", color: "#FFF8F0", fontWeight: 600 }}>2</span>
            </div>
            <div>
              <p style={{ fontFamily: "Playfair Display, serif", fontSize: "1.8vw", fontWeight: 700, color: "#D4843E", marginBottom: "0.5vh" }}>Vite</p>
              <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.6vw", color: "rgba(255,248,240,0.8)", lineHeight: 1.7 }}>انتہائی تیز build tool جو ویب سائٹ کو فائلوں میں تبدیل کرتا ہے — milliseconds میں</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: "2vw", alignItems: "flex-start" }}>
            <div style={{ minWidth: "2.5vw", height: "2.5vw", borderRadius: "50%", background: "#8B4513", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "0.3vh" }}>
              <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "1.2vw", color: "#FFF8F0", fontWeight: 600 }}>3</span>
            </div>
            <div>
              <p style={{ fontFamily: "Playfair Display, serif", fontSize: "1.8vw", fontWeight: 700, color: "#D4843E", marginBottom: "0.5vh" }}>TypeScript</p>
              <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.6vw", color: "rgba(255,248,240,0.8)", lineHeight: 1.7 }}>JavaScript کا بہتر ورژن جو غلطیاں لکھتے وقت ہی پکڑ لیتا ہے</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
