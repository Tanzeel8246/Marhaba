export default function Slide02Overview() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "linear-gradient(160deg, #0f0a07 0%, #1a0f08 100%)" }}>
      <div className="absolute top-0 left-0 w-full" style={{ height: "0.5vh", background: "linear-gradient(90deg, #8B4513, #D4843E, #8B4513)" }} />

      <div className="absolute inset-0 flex flex-col" style={{ padding: "6vh 8vw" }}>
        <div style={{ marginBottom: "5vh" }}>
          <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.4vw", color: "#D4843E", marginBottom: "1vh" }}>پروجیکٹ کا تعارف</p>
          <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "4.5vw", fontWeight: 900, color: "#FFF8F0", letterSpacing: "-0.02em" }}>
            Bake Delight Pro کیا ہے؟
          </h2>
        </div>

        <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3vw", alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "2.5vh" }}>
            <div style={{ padding: "3vh 2.5vw", background: "rgba(139,69,19,0.15)", borderRadius: "1vw", borderLeft: "0.3vw solid #8B4513" }}>
              <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.8vw", fontWeight: 700, color: "#D4843E", marginBottom: "1vh" }}>مقصد</p>
              <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.6vw", color: "rgba(255,248,240,0.85)", lineHeight: 1.8 }}>
                پاکستانی بیکری کے لیے مکمل آن لائن آرڈرنگ سسٹم جو WhatsApp کے ذریعے آرڈر بھیجتا ہے
              </p>
            </div>
            <div style={{ padding: "3vh 2.5vw", background: "rgba(139,69,19,0.15)", borderRadius: "1vw", borderLeft: "0.3vw solid #8B4513" }}>
              <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.8vw", fontWeight: 700, color: "#D4843E", marginBottom: "1vh" }}>صارف</p>
              <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.6vw", color: "rgba(255,248,240,0.85)", lineHeight: 1.8 }}>
                گاہک آن لائن آرڈر کریں، ایڈمن پینل سے آرڈرز مینیج کریں
              </p>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "2vh" }}>
            <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.8vw", fontWeight: 700, color: "#FFF8F0" }}>اہم خصوصیات</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5vh" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1.5vw" }}>
                <div style={{ width: "0.5vw", height: "0.5vw", borderRadius: "50%", background: "#D4843E", flexShrink: 0 }} />
                <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.6vw", color: "rgba(255,248,240,0.85)" }}>مکمل اردو یوزر انٹرفیس</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "1.5vw" }}>
                <div style={{ width: "0.5vw", height: "0.5vw", borderRadius: "50%", background: "#D4843E", flexShrink: 0 }} />
                <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.6vw", color: "rgba(255,248,240,0.85)" }}>PKR کرنسی میں قیمتیں</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "1.5vw" }}>
                <div style={{ width: "0.5vw", height: "0.5vw", borderRadius: "50%", background: "#D4843E", flexShrink: 0 }} />
                <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.6vw", color: "rgba(255,248,240,0.85)" }}>3 مرحلہ checkout</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "1.5vw" }}>
                <div style={{ width: "0.5vw", height: "0.5vw", borderRadius: "50%", background: "#D4843E", flexShrink: 0 }} />
                <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.6vw", color: "rgba(255,248,240,0.85)" }}>ایڈمن ڈیش بورڈ — 30 سیکنڈ auto-refresh</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "1.5vw" }}>
                <div style={{ width: "0.5vw", height: "0.5vw", borderRadius: "50%", background: "#D4843E", flexShrink: 0 }} />
                <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.6vw", color: "rgba(255,248,240,0.85)" }}>کوپن کوڈ اور بلیک آؤٹ تاریخیں</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "1.5vw" }}>
                <div style={{ width: "0.5vw", height: "0.5vw", borderRadius: "50%", background: "#D4843E", flexShrink: 0 }} />
                <p style={{ fontFamily: "Noto Nastaliq Urdu, serif", fontSize: "1.6vw", color: "rgba(255,248,240,0.85)" }}>Replit پر publish شدہ</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
