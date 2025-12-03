import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Backend API URL
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      setError("Semua field harus diisi.");
      return;
    }

    if (!email.includes("@")) {
      setError("Email tidak valid.");
      return;
    }

    if (password.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Password tidak cocok.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message || "Pendaftaran berhasil! Silakan login.");
        // Redirect ke halaman login setelah 2 detik
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError(data.message || "Pendaftaran gagal. Silakan coba lagi.");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError("Gagal terhubung ke server. Pastikan backend berjalan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-teal-100">
      <Header />

      <main className="max-w-md mx-auto px-4 py-12">
        <div className="bg-white/95 rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-teal-800">
              Daftar
            </h1>
            <p className="text-sm text-slate-600 mt-2">Buat akun Skywise baru</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 mb-2 block uppercase tracking-wide">
                👤 Nama Lengkap
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama Anda"
                className="w-full px-4 py-3 bg-white/95 border-2 border-gray-200 rounded-xl shadow-sm text-sm text-slate-800 placeholder:text-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition"
              />
            </div>

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
              <div className="text-xs text-slate-500 mt-1">Minimal 6 karakter</div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-2 block uppercase tracking-wide">
                🔒 Konfirmasi Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-white/95 border-2 border-gray-200 rounded-xl shadow-sm text-sm text-slate-800 placeholder:text-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 font-medium">
                {error}
              </div>
            )}

            {success && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 font-medium">
                {success}
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
              {loading ? "Memproses..." : "Daftar"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              Sudah punya akun?{" "}
              <a href="/login" className="font-bold text-teal-600 hover:text-teal-500">
                Masuk di sini
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}