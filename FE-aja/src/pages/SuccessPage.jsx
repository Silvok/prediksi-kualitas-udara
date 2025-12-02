import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";

export default function SuccessPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const summary = state?.summary ?? null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-teal-100">
      <Header />

      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white/95 rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
          <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-teal-600 to-teal-400 flex items-center justify-center text-white text-4xl shadow-md">
            ✅
          </div>

          <h1 className="mt-6 text-2xl font-bold text-slate-900">
            Berhasil Disimpan
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Hasil prediksi telah disimpan ke riwayat Anda.
          </p>

          {summary && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-slate-700">
              {summary}
            </div>
          )}

          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate("/history")}
              className="px-4 py-2 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-500 transition"
            >
              Lihat Riwayat
            </button>

            <button
              onClick={() => navigate("/predict")}
              className="px-4 py-2 rounded-xl bg-white border border-gray-100 text-slate-700 hover:bg-gray-50 transition"
            >
              Prediksi Baru
            </button>

            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 rounded-xl bg-white border border-gray-100 text-slate-700 hover:bg-gray-50 transition"
            >
              Beranda
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}