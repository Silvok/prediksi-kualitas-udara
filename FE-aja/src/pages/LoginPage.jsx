import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError("Email dan password harus diisi.");
      return;
    }

    if (!email.includes("@")) {
      setError("Email tidak valid.");
      return;
    }

    setLoading(true);
    setError("");

    // Simulasi request login
    await new Promise((r) => setTimeout(r, 800));

    // Simpan ke localStorage (demo)
    localStorage.setItem("user", JSON.stringify({
      email,
      name: email.split("@")[0],
      loginTime: new Date().toISOString(),
    }));

    setLoading(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-teal-100">
      <Header />

      <main className="max-w-md mx-auto px-4 py-12">
        <div className="bg-white/95 rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-teal-800">
              Masuk
            </h1>
            <p className="text-sm text-slate-600 mt-2">Masuk ke akun Skywise Anda</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 mb-2 block uppercase tracking-wide">
                📧 Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full px-4 py-3 bg-white/95 border-2 border-gray-200 rounded-xl shadow-sm text-sm text-slate-800 placeholder:text-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-2 block uppercase tracking-wide">
                🔒 Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-white/95 border-2 border-gray-200 rounded-xl shadow-sm text-sm text-slate-800 placeholder:text-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl font-bold text-white shadow-md transition transform ${
                loading
                  ? "bg-teal-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-teal-600 to-teal-500 hover:shadow-lg hover:scale-[1.02]"
              }`}
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              Belum punya akun?{" "}
              <a href="/signup" className="font-bold text-teal-600 hover:text-teal-500">
                Daftar di sini
              </a>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-xs text-slate-500 text-center">
              Demo: Gunakan email apa saja untuk login (tidak ada validasi backend)
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}