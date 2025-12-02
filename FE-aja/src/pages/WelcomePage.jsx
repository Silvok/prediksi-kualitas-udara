import { useEffect, useState } from "react";
import Header from "../components/Header";
import "./WelcomePage.css";

export default function WelcomePage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="welcome-page">
      <Header />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Content */}
            <div className="space-y-8 animate-fadeIn">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur rounded-full border border-teal-200/50 w-fit">
                  <span className="text-xl">⚡</span>
                  <span className="text-sm font-bold text-teal-600">Fitur AI-Powered</span>
                </div>

                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight">
                  <span className="gradient-text">Validasi Cuaca</span>
                  <br />
                  Dengan <span className="text-teal-600">Akurat</span>
                </h1>

                <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl font-medium">
                  Masukkan parameter cuaca dan dapatkan skor validasi real-time dengan teknologi
                  machine learning ensemble terdepan.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <a
                  href="/predict"
                  className="group relative px-8 py-4 bg-gradient-to-r from-teal-600 to-cyan-500 text-white font-black rounded-xl shadow-xl hover:shadow-2xl transition transform hover:scale-105 overflow-hidden text-center"
                >
                  <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition" />
                  <span className="relative flex items-center justify-center gap-2">
                    <span>⚡</span> Mulai Validasi
                  </span>
                </a>

                <a
                  href="/history"
                  className="group px-8 py-4 bg-white border-2 border-teal-600 text-teal-600 font-black rounded-xl shadow-lg hover:shadow-xl hover:bg-teal-50 transition transform hover:scale-105 text-center"
                >
                  <span className="flex items-center justify-center gap-2">
                    <span>📊</span> Lihat Riwayat
                  </span>
                </a>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-200/50">
                <div className="space-y-1">
                  <div className="text-3xl font-black gradient-text">98%</div>
                  <div className="text-sm font-semibold text-slate-600">Akurasi Model</div>
                </div>
                <div className="space-y-1">
                  <div className="text-3xl font-black gradient-text">1K+</div>
                  <div className="text-sm font-semibold text-slate-600">Validasi</div>
                </div>
                <div className="space-y-1">
                  <div className="text-3xl font-black gradient-text">0.5s</div>
                  <div className="text-sm font-semibold text-slate-600">Processing</div>
                </div>
              </div>
            </div>

            {/* Right Illustration */}
            <div className="relative h-96 lg:h-[500px] flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-3xl blur-2xl opacity-40" />

              <div
                className="relative w-80 h-80 lg:w-96 lg:h-96 rounded-3xl bg-white/80 backdrop-blur overflow-hidden border border-teal-200/50 shadow-2xl animate-float"
                style={{ transform: `translateY(${scrollY * 0.3}px)` }}
              >
                <img
                  src="/assets/contoh.jpg"
                  alt="Weather validation"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              {/* Floating Cards */}
              <div className="absolute bottom-8 left-4 animate-bounce bg-white/90 backdrop-blur px-4 py-3 rounded-xl shadow-lg border border-white/50">
                <div className="text-xs font-bold text-teal-600 mb-1">🌡️ Suhu Optimal</div>
                <div className="text-2xl font-black text-slate-900">28°C</div>
              </div>

              <div
                className="absolute top-12 right-4 animate-bounce bg-white/90 backdrop-blur px-4 py-3 rounded-xl shadow-lg border border-white/50"
                style={{ animationDelay: "0.3s" }}
              >
                <div className="text-xs font-bold text-teal-600 mb-1">✅ Status</div>
                <div className="text-lg font-black text-green-600">Baik</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent to-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black mb-4">
              Mengapa Memilih <span className="gradient-text">Skywise?</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">
              Platform validasi prediksi cuaca terpercaya dengan teknologi terdepan
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🎯",
                title: "Akurat",
                desc: "Validasi berbasis parameter meteorologi internasional",
              },
              {
                icon: "⚡",
                title: "Cepat",
                desc: "Hasil validasi real-time kurang dari 1 detik",
              },
              {
                icon: "📊",
                title: "Informatif",
                desc: "Detail feedback dan riwayat validasi lengkap",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="group p-8 bg-white/80 backdrop-blur rounded-2xl border border-teal-200/50 shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition transform">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-black mb-3 text-slate-900">{feature.title}</h3>
                <p className="text-slate-600 font-medium leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-teal-600 via-cyan-500 to-teal-600 rounded-3xl shadow-2xl p-12 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 space-y-6">
            <h2 className="text-4xl sm:text-5xl font-black">Siap Memulai?</h2>
            <p className="text-xl text-white/90 font-semibold max-w-2xl mx-auto">
              Validasi parameter cuaca Anda sekarang dan dapatkan insights akurat
            </p>
            <a
              href="/predict"
              className="inline-flex items-center gap-2 px-10 py-4 bg-white text-teal-600 font-black rounded-xl hover:shadow-xl transition transform hover:scale-105"
            >
              <span>⚡</span> Mulai Sekarang
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
