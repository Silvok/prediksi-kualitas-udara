import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import InputField from "../components/InputField";
import "./PredictionPage.css";

// API URL
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function PredictionPage() {
  const navigate = useNavigate();
  const [temp, setTemp] = useState("");
  const [humidity, setHumidity] = useState("");
  const [pressure, setPressure] = useState("");
  const [windSpeed, setWindSpeed] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [stats, setStats] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Fungsi untuk cek status login
  const checkLoginStatus = () => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    return !!token;
  };

  // Cek status login saat halaman dimuat dan setiap kali focus
  useEffect(() => {
    checkLoginStatus();
    fetchStats();

    // Listen untuk perubahan storage (logout di tab lain)
    const handleStorageChange = () => {
      checkLoginStatus();
    };

    // Listen untuk focus window (kembali ke tab)
    const handleFocus = () => {
      checkLoginStatus();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/api/predictions/stats`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.log("Stats not available:", error);
    }
  };

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

    try {
      const response = await fetch(`${API_URL}/api/predictions/validate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          suhu: t,
          kelembapan: h,
          tekanan: p,
          kecepatan_angin: w,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle validation errors dari API
        if (data.validation_errors && data.validation_errors.length > 0) {
          const errorMessages = data.validation_errors.map(err => err.message).join('\n');
          setResult({ 
            error: `❌ Input di luar range yang valid:\n\n${errorMessages}`,
            validRanges: data.valid_ranges
          });
        } else {
          setResult({ 
            error: data.message || data.error || "❌ Gagal melakukan prediksi. Pastikan ML API berjalan." 
          });
        }
        return;
      }

      // Transform response untuk format yang sesuai dengan UI
      setResult({
        score: data.prediction.score,
        quality: data.prediction.kualitas,
        icon: data.prediction.icon,
        confidence: data.prediction.confidence,
        probabilities: data.prediction.probabilities,
        feedback: data.feedback,
      });

    } catch (error) {
      console.error("Prediction error:", error);
      setResult({ 
        error: "❌ Tidak dapat terhubung ke server. Pastikan backend dan ML API berjalan." 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setTemp("");
    setHumidity("");
    setPressure("");
    setWindSpeed("");
    setResult(null);
  };

  const handleSaveToHistory = async () => {
    // Double check: cek ulang status login sebelum simpan
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoggedIn(false); // Update state
      alert("⚠️ Anda harus login terlebih dahulu untuk menyimpan riwayat.");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/predictions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          suhu: parseFloat(temp),
          kelembapan: parseFloat(humidity),
          tekanan: parseFloat(pressure),
          kecepatan_angin: parseFloat(windSpeed),
          kualitas: result.quality,
          score: result.score,
          confidence: result.confidence,
        }),
      });

      if (response.status === 401) {
        // Token expired atau tidak valid
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsLoggedIn(false);
        alert("⚠️ Sesi Anda telah berakhir. Silakan login kembali.");
        navigate("/login");
        return;
      }

      if (response.ok) {
        alert("✅ Validasi berhasil disimpan ke riwayat!");
        handleReset();
      } else {
        alert("❌ Gagal menyimpan ke riwayat.");
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("❌ Terjadi kesalahan saat menyimpan.");
    }
  };

  // Mendapatkan range dari stats atau default
  const getRange = (param) => {
    // Default ranges (sesuai validasi API)
    const defaults = {
      suhu: "-20 sampai 40 °C",
      kelembapan: "-40 sampai 30",
      tekanan: "990 sampai 1045 mb",
      kecepatan_angin: "0 sampai 15 m/s"
    };
    return defaults[param] || "";
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
                  { icon: "🌡️", label: "Suhu (°C)", value: temp, onChange: setTemp, placeholder: "25", param: "suhu" },
                  { icon: "💧", label: "Kelembapan (%)", value: humidity, onChange: setHumidity, placeholder: "-10", param: "kelembapan" },
                  { icon: "🔷", label: "Tekanan (mb)", value: pressure, onChange: setPressure, placeholder: "1015", param: "tekanan" },
                  { icon: "💨", label: "Kecepatan Angin (m/s)", value: windSpeed, onChange: setWindSpeed, placeholder: "3", param: "kecepatan_angin" },
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
                      Range: {getRange(field.param)}
                    </div>
                  </div>
                ))}
              </div>

              {result?.error && (
                <div className="p-5 bg-red-50 border-2 border-red-300 rounded-xl text-red-700 font-semibold mb-6 shadow-md">
                  <div className="whitespace-pre-line mb-3">{result.error}</div>
                  {result.validRanges && (
                    <div className="mt-4 p-3 bg-white/80 rounded-lg border border-red-200">
                      <p className="font-bold text-sm mb-2 text-slate-700">📋 Range yang Valid:</p>
                      <ul className="text-xs space-y-1 text-slate-600">
                        <li>🌡️ Suhu: <span className="font-bold">{result.validRanges.suhu}</span></li>
                        <li>💧 Kelembapan: <span className="font-bold">{result.validRanges.kelembapan}</span></li>
                        <li>🔷 Tekanan: <span className="font-bold">{result.validRanges.tekanan}</span></li>
                        <li>💨 Kec. Angin: <span className="font-bold">{result.validRanges.kecepatan_angin}</span></li>
                      </ul>
                    </div>
                  )}
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
            {/* Dataset Info */}
            {stats && (
              <div className="glass rounded-2xl p-6 shadow-lg border border-white/50 bg-gradient-to-br from-purple-400/20 to-indigo-400/20">
                <h3 className="font-black text-lg mb-4">📊 Info Dataset</h3>
                <div className="space-y-2 text-sm font-semibold text-slate-700">
                  <p>Total Data: <span className="text-purple-600">{stats.total_data?.toLocaleString()}</span></p>
                  <p>Baik: <span className="text-green-600">{stats.distribusi_kualitas?.Baik?.toLocaleString()}</span></p>
                  <p>Sedang: <span className="text-yellow-600">{stats.distribusi_kualitas?.Sedang?.toLocaleString()}</span></p>
                  <p>Buruk: <span className="text-red-600">{stats.distribusi_kualitas?.Buruk?.toLocaleString()}</span></p>
                </div>
              </div>
            )}

            {/* Tips */}
            <div className="glass rounded-2xl p-6 shadow-lg border border-white/50 bg-gradient-to-br from-blue-400/20 to-cyan-400/20">
              <h3 className="font-black text-lg mb-4">💡 Tips Validasi</h3>
              <ul className="space-y-3 text-sm font-semibold">
                {[
                  "🌡️ Suhu: -20°C sampai 40°C",
                  "💧 Kelembapan: -40 sampai 30",
                  "🔷 Tekanan: 990-1045 mb",
                  "💨 Kecepatan Angin: 0-15 m/s"
                ].map((tip, i) => (
                  <li key={i} className="flex gap-2 text-slate-700">{tip}</li>
                ))}
              </ul>
            </div>

            {/* Score Guide */}
            <div className="glass rounded-2xl p-6 shadow-lg border border-white/50">
              <h3 className="font-black text-lg mb-4">🏆 Klasifikasi Kualitas</h3>
              <div className="space-y-3">
                {[
                  { icon: "✅", label: "Baik", desc: "PM2.5 ≤ 35", color: "from-green-400 to-emerald-500" },
                  { icon: "⚠️", label: "Sedang", desc: "35 < PM2.5 ≤ 75", color: "from-yellow-400 to-orange-500" },
                  { icon: "❌", label: "Buruk", desc: "PM2.5 > 75", color: "from-red-400 to-rose-500" }
                ].map((score, i) => (
                  <div key={i} className={`p-3 bg-gradient-to-r ${score.color} rounded-lg text-white font-bold text-sm`}>
                    <div>{score.icon} {score.label}</div>
                    <div className="text-xs opacity-90">{score.desc}</div>
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
              result.quality === "Baik" ? "from-green-400/20 to-emerald-500/20" :
              result.quality === "Sedang" ? "from-yellow-400/20 to-orange-500/20" :
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
                    { icon: "💧", label: "Kelembapan", value: humidity, unit: "", color: "from-blue-400 to-blue-500" },
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

                {/* Probabilitas */}
                {result.probabilities && (
                  <div className="mt-6">
                    <h4 className="font-bold text-sm mb-3 text-slate-600">📊 Probabilitas Prediksi:</h4>
                    <div className="space-y-2">
                      {Object.entries(result.probabilities).map(([kelas, prob]) => (
                        <div key={kelas} className="flex items-center gap-2">
                          <span className="text-sm font-semibold w-16">{kelas}:</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                kelas === "Baik" ? "bg-green-500" : 
                                kelas === "Sedang" ? "bg-yellow-500" : "bg-red-500"
                              }`}
                              style={{ width: `${prob}%` }}
                            />
                          </div>
                          <span className="text-sm font-bold w-14 text-right">{prob}%</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-slate-500 mt-3">
                      Confidence: <span className="font-bold text-teal-600">{result.confidence}%</span>
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              {isLoggedIn ? (
                <button
                  onClick={handleSaveToHistory}
                  className="flex-1 py-4 bg-gradient-to-r from-teal-600 to-cyan-500 text-white font-black rounded-xl shadow-lg hover:shadow-xl transition transform hover:scale-105"
                >
                  💾 Simpan ke Riwayat
                </button>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="flex-1 py-4 bg-gradient-to-r from-slate-500 to-slate-600 text-white font-black rounded-xl shadow-lg hover:shadow-xl transition transform hover:scale-105"
                >
                  🔐 Login untuk Simpan Riwayat
                </button>
              )}
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