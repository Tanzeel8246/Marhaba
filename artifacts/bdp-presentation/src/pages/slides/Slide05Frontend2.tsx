export default function Slide05Frontend2() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "linear-gradient(160deg, #0f0a07 0%, #1a0f08 100%)" }}>
      <div className="absolute top-0 left-0 w-full" style={{ height: "0.5vh", background: "linear-gradient(90deg, #8B4513, #D4843E, #8B4513)" }} />

      <div className="absolute inset-0 flex flex-col" style={{ padding: "5vh 8vw" }}>
        <div style={{ marginBottom: "4vh" }}>
          <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.4vw", color: "#D4843E", marginBottom: "1vh" }}>فرنٹ اینڈ — حصہ دوم</p>
          <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "4vw", fontWeight: 900, color: "#FFF8F0", letterSpacing: "-0.02em" }}>
            اہم لائبریریاں
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.5vw", flex: 1 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "2vh" }}>
            <div style={{ padding: "2.5vh 2vw", background: "rgba(139,69,19,0.12)", borderRadius: "0.8vw", borderTop: "0.2vw solid rgba(212,132,62,0.4)" }}>
              <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "1.6vw", fontWeight: 600, color: "#D4843E", marginBottom: "0.8vh" }}>TanStack Query</p>
              <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.5vw", color: "rgba(255,248,240,0.75)", lineHeight: 1.7 }}>سرور سے ڈیٹا لانے اور cache کرنے کا ذہین نظام</p>
            </div>
            <div style={{ padding: "2.5vh 2vw", background: "rgba(139,69,19,0.12)", borderRadius: "0.8vw", borderTop: "0.2vw solid rgba(212,132,62,0.4)" }}>
              <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "1.6vw", fontWeight: 600, color: "#D4843E", marginBottom: "0.8vh" }}>Zustand</p>
              <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.5vw", color: "rgba(255,248,240,0.75)", lineHeight: 1.7 }}>Shopping cart کا ڈیٹا پورے app میں share کرتا ہے</p>
            </div>
            <div style={{ padding: "2.5vh 2vw", background: "rgba(139,69,19,0.12)", borderRadius: "0.8vw", borderTop: "0.2vw solid rgba(212,132,62,0.4)" }}>
              <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "1.6vw", fontWeight: 600, color: "#D4843E", marginBottom: "0.8vh" }}>Wouter</p>
              <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.5vw", color: "rgba(255,248,240,0.75)", lineHeight: 1.7 }}>ایک صفحے سے دوسرے صفحے پر جانے کا نظام (routing)</p>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "2vh" }}>
            <div style={{ padding: "2.5vh 2vw", background: "rgba(139,69,19,0.12)", borderRadius: "0.8vw", borderTop: "0.2vw solid rgba(212,132,62,0.4)" }}>
              <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "1.6vw", fontWeight: 600, color: "#D4843E", marginBottom: "0.8vh" }}>shadcn/ui</p>
              <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.5vw", color: "rgba(255,248,240,0.75)", lineHeight: 1.7 }}>خوبصورت بٹن، فارم، ڈائیلاگ وغیرہ کی ready-made کٹ</p>
            </div>
            <div style={{ padding: "2.5vh 2vw", background: "rgba(139,69,19,0.12)", borderRadius: "0.8vw", borderTop: "0.2vw solid rgba(212,132,62,0.4)" }}>
              <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "1.6vw", fontWeight: 600, color: "#D4843E", marginBottom: "0.8vh" }}>Tailwind CSS</p>
              <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.5vw", color: "rgba(255,248,240,0.75)", lineHeight: 1.7 }}>HTML کے ساتھ براہ راست styling — الگ CSS فائل کی ضرورت نہیں</p>
            </div>
            <div style={{ padding: "2.5vh 2vw", background: "rgba(139,69,19,0.12)", borderRadius: "0.8vw", borderTop: "0.2vw solid rgba(212,132,62,0.4)" }}>
              <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "1.6vw", fontWeight: 600, color: "#D4843E", marginBottom: "0.8vh" }}>Recharts</p>
              <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.5vw", color: "rgba(255,248,240,0.75)", lineHeight: 1.7 }}>ایڈمن ڈیش بورڈ میں گراف اور چارٹ بنانے کی لائبریری</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
