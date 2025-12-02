import { useState } from "react";
import Header from "../components/Header";
import InputField from "../components/InputField";
import "./PredictionPage.css";

function mockValidate(temp, humidity, pressure, windSpeed) {
  const score = Math.max(0, Math.min(100, 
    (temp >= 15 && temp <= 35 ? 25 : 10) +
    (humidity >= 30 && humidity <= 80 ? 25 : 10) +
    (pressure >= 1000 && pressure <= 1030 ? 25 : 10) +
    (windSpeed >= 0 && windSpeed <= 20 ? 25 : 10)
  ));

  const isGood = score >= 75;
  const quality = isGood ? "Baik" : score >= 50 ? "Sedang" : "Kurang";
  
  return {
    score,
    quality,
    icon: isGood ? "✅" : score >= 50 ? "⚠️" : "❌",
    feedback: [
      temp >= 15 && temp <= 35 ? "✓ Suhu dalam range normal" : "✗ Suhu di luar range normal (15-35°C)",
      humidity >= 30 && humidity <= 80 ? "✓ Kelembapan ideal" : "✗ Kelembapan tidak ideal (30-80%)",
      pressure >= 1000 && pressure <= 1030 ? "✓ Tekanan udara normal" : "✗ Tekanan udara abnormal (1000-1030 mb)",
      windSpeed >= 0 && windSpeed <= 20 ? "✓ Kecepatan angin wajar" : "✗ Kecepatan angin ekstrem (>20 m/s)",
    ],
  };
}

export default function PredictionPage() {
  const [temp, setTemp] = useState("");
  const [humidity, setHumidity] = useState("");
  const [pressure, setPressure] = useState("");
  const [windSpeed, setWindSpeed] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleValidate = async () => {
    if (!temp || !humidity || !pressure || !windSpeed) {
      setResult({ error: "⚠️ Harap isi semua field terlebih dahulu." });
      return;
    }

    const t = parseFloat(temp);
    const h = parseFloat(humidity);
    const p = parseFloat(pressure);
    const w = parseFloat(windSpeed);

    if (isNaN(t) || isNaN(h) || isNaN(p) || isNaN(w)) {
      setResult({ error: "❌ Semua input harus berupa angka." });
      return;
    }

    setLoading(true);
    setResult(null);
    await new Promise((r) => setTimeout(r, 600));
    const res = mockValidate(t, h, p, w);
    setResult(res);
    setLoading(false);
  };

  const handleReset = () => {
    setTemp("");
    setHumidity("");
    setPressure("");
    setWindSpeed("");
    setResult(null);
  };

  return (
    <div className="prediction-page min-h-screen">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="mb-12 text-center animate-fadeIn">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/80 backdrop-blur rounded-full border border-teal-200/50 mb-6 w-fit mx-auto">
            <span className="text-2xl">⚡</span>
            <span className="font-bold text-teal-600">Validasi Real-Time</span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-black mb-4">
            <span className="gradient-text">Validasi Prediksi</span> Cuaca
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">
            Masukkan 4 parameter cuaca dan dapatkan skor validasi akurat dalam hitungan detik
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="glass rounded-3xl p-8 shadow-xl border border-white/50">
              <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
                <span>📊</span> Parameter Cuaca
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                {[
                  { icon: "🌡️", label: "Suhu (°C)", value: temp, onChange: setTemp, placeholder: "28", range: "15-35°C" },
                  { icon: "💧", label: "Kelembapan (%)", value: humidity, onChange: setHumidity, placeholder: "65", range: "30-80%" },
                  { icon: "🔷", label: "Tekanan (mb)", value: pressure, onChange: setPressure, placeholder: "1013", range: "1000-1030 mb" },
                  { icon: "💨", label: "Angin (m/s)", value: windSpeed, onChange: setWindSpeed, placeholder: "5", range: "0-20 m/s" },
                ].map((field, idx) => (
                  <div key={idx}>
                    <InputField
                      type="number"
                      value={field.value}
                      onChange={field.onChange}
                      placeholder={field.placeholder}
                      icon={field.icon}
                      label={field.label}
                    />
                    <div className="mt-2 text-xs font-bold text-teal-600 bg-teal-50/80 rounded-lg p-2 text-center">
                      Ideal: {field.range}
                    </div>
                  </div>
                ))}
              </div>

              {result?.error && (
                <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 font-bold mb-6 animate-pulse">
                  {result.error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleValidate}
                  disabled={loading}
                  className="flex-1 py-4 bg-gradient-to-r from-teal-600 to-cyan-500 text-white font-black rounded-xl shadow-lg hover:shadow-xl transition transform hover:scale-105 disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin">⏳</span> Memproses...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">⚡ Validasi</span>
                  )}
                </button>

                <button
                  onClick={handleReset}
                  className="flex-1 py-4 bg-white border-2 border-gray-200 text-slate-700 font-black rounded-xl hover:bg-gray-50 transition"
                >
                  🔄 Reset
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tips */}
            <div className="glass rounded-2xl p-6 shadow-lg border border-white/50 bg-gradient-to-br from-blue-400/20 to-cyan-400/20">
              <h3 className="font-black text-lg mb-4">💡 Tips Validasi</h3>
              <ul className="space-y-3 text-sm font-semibold">
                {[
                  "🌡️ Suhu optimal 15-35°C",
                  "💧 Kelembapan ideal 30-80%",
                  "🔷 Tekanan normal 1000-1030",
                  "💨 Angin wajar 0-20 m/s"
                ].map((tip, i) => (
                  <li key={i} className="flex gap-2 text-slate-700">{tip}</li>
                ))}
              </ul>
            </div>

            {/* Score Guide */}
            <div className="glass rounded-2xl p-6 shadow-lg border border-white/50">
              <h3 className="font-black text-lg mb-4">🏆 Panduan Score</h3>
              <div className="space-y-3">
                {[
                  { icon: "✅", label: "Baik", range: "75-100%", color: "from-green-400 to-emerald-500" },
                  { icon: "⚠️", label: "Sedang", range: "50-74%", color: "from-yellow-400 to-orange-500" },
                  { icon: "❌", label: "Kurang", range: "0-49%", color: "from-red-400 to-rose-500" }
                ].map((score, i) => (
                  <div key={i} className={`p-3 bg-gradient-to-r ${score.color} rounded-lg text-white font-bold text-sm`}>
                    <div>{score.icon} {score.label}</div>
                    <div className="text-xs opacity-90">{score.range}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Result */}
        {result && !result.error && (
          <div className="mt-12 animate-fadeIn">
            <div className={`glass rounded-3xl p-12 mb-8 shadow-2xl border border-white/50 bg-gradient-to-br ${
              result.score >= 75 ? "from-green-400/20 to-emerald-500/20" :
              result.score >= 50 ? "from-yellow-400/20 to-orange-500/20" :
              "from-red-400/20 to-rose-500/20"
            }`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="text-center">
                  <div className="text-8xl mb-6 animate-bounce">{result.icon}</div>
                  <h2 className="text-4xl font-black mb-2">{result.quality}</h2>
                  <p className="text-lg text-slate-600 font-semibold">Status Validasi</p>
                </div>

                <div className="text-center">
                  <div className="text-7xl font-black gradient-text mb-6">{result.score}%</div>
                  <div className="w-full bg-white/50 rounded-full h-4 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-teal-600 to-cyan-500 rounded-full transition-all duration-1000"
                      style={{ width: `${result.score}%` }}
                    />
                  </div>
                  <p className="text-sm text-slate-600 font-semibold mt-4">Score Validasi</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Feedback */}
              <div className="glass rounded-2xl p-8 shadow-lg border border-white/50">
                <h3 className="text-xl font-black mb-6">📋 Validasi Detail</h3>
                <div className="space-y-3">
                  {result.feedback.map((fb, i) => (
                    <div key={i} className={`flex items-start gap-3 p-4 rounded-lg ${fb.startsWith("✓") ? "bg-green-50" : "bg-red-50"}`}>
                      <span className="text-2xl">{fb.startsWith("✓") ? "✅" : "❌"}</span>
                      <span className="font-semibold text-slate-700">{fb}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Parameters */}
              <div className="glass rounded-2xl p-8 shadow-lg border border-white/50">
                <h3 className="text-xl font-black mb-6">🎯 Parameter Input</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: "🌡️", label: "Suhu", value: temp, unit: "°C", color: "from-orange-400 to-orange-500" },
                    { icon: "💧", label: "Kelembapan", value: humidity, unit: "%", color: "from-blue-400 to-blue-500" },
                    { icon: "🔷", label: "Tekanan", value: pressure, unit: "mb", color: "from-purple-400 to-purple-500" },
                    { icon: "💨", label: "Angin", value: windSpeed, unit: "m/s", color: "from-green-400 to-green-500" }
                  ].map((param, i) => (
                    <div key={i} className={`bg-gradient-to-br ${param.color} rounded-lg p-4 text-white text-center`}>
                      <div className="text-3xl mb-2">{param.icon}</div>
                      <div className="text-xs font-bold opacity-90">{param.label}</div>
                      <div className="text-2xl font-black mt-1">{param.value}{param.unit}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => alert("✅ Validasi disimpan ke riwayat!") || handleReset()}
                className="flex-1 py-4 bg-gradient-to-r from-teal-600 to-cyan-500 text-white font-black rounded-xl shadow-lg hover:shadow-xl transition transform hover:scale-105"
              >
                💾 Simpan ke Riwayat
              </button>
              <button
                onClick={handleReset}
                className="flex-1 py-4 bg-white border-2 border-gray-200 text-slate-700 font-black rounded-xl hover:bg-gray-50"
              >
                🔄 Validasi Lagi
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}