import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import HistoryCard from "../components/HistoryCard";
import InputField from "../components/InputField";

// API URL
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function HistoryPage() {
	const navigate = useNavigate();
	const [query, setQuery] = useState("");
	const [filterQuality, setFilterQuality] = useState("semua");
	const [historyData, setHistoryData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	// Cek login dan fetch history saat halaman dimuat
	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) {
			setIsLoggedIn(false);
			setLoading(false);
			return;
		}
		setIsLoggedIn(true);
		fetchHistory(token);
	}, []);

	const fetchHistory = async (token) => {
		try {
			setLoading(true);
			const response = await fetch(`${API_URL}/api/predictions`, {
				headers: {
					"Authorization": `Bearer ${token}`,
				},
			});

			if (response.status === 401) {
				// Token expired atau tidak valid
				localStorage.removeItem("token");
				localStorage.removeItem("user");
				setIsLoggedIn(false);
				setLoading(false);
				return;
			}

			if (!response.ok) {
				throw new Error("Gagal mengambil data riwayat");
			}

			const data = await response.json();
			
			// Transform data dari database ke format yang sesuai UI
			const transformed = data.predictions.map((item) => ({
				id: item.id,
				date: new Date(item.created_at).toLocaleDateString("id-ID", {
					year: "numeric",
					month: "short",
					day: "numeric",
				}),
				dateRaw: item.created_at,
				temp: item.suhu?.toString() || "0",
				humidity: item.kelembapan?.toString() || "0",
				pressure: item.tekanan?.toString() || "0",
				windSpeed: item.kecepatan_angin?.toString() || "0",
				quality: item.kualitas || "Unknown",
				score: item.score?.toString() || "0",
				confidence: item.confidence || 0,
				icon: item.kualitas === "Baik" ? "✅" : item.kualitas === "Sedang" ? "⚠️" : "❌",
			}));

			setHistoryData(transformed);
		} catch (err) {
			console.error("Fetch history error:", err);
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (id) => {
		const token = localStorage.getItem("token");
		if (!token) return;

		if (!confirm("Apakah Anda yakin ingin menghapus riwayat ini?")) return;

		try {
			const response = await fetch(`${API_URL}/api/predictions/${id}`, {
				method: "DELETE",
				headers: {
					"Authorization": `Bearer ${token}`,
				},
			});

			if (response.ok) {
				setHistoryData((prev) => prev.filter((item) => item.id !== id));
			} else {
				alert("Gagal menghapus riwayat");
			}
		} catch (err) {
			console.error("Delete error:", err);
			alert("Terjadi kesalahan saat menghapus");
		}
	};

	const list = useMemo(() => {
		const q = query.trim().toLowerCase();
		return historyData
			.filter((it) => {
				if (filterQuality !== "semua" && it.quality !== filterQuality) return false;
				if (!q) return true;
				return (
					it.date.toLowerCase().includes(q) ||
					it.quality.toLowerCase().includes(q) ||
					it.score.toLowerCase().includes(q) ||
					it.temp.toLowerCase().includes(q)
				);
			})
			.sort((a, b) => (a.dateRaw < b.dateRaw ? 1 : -1));
	}, [query, filterQuality, historyData]);

	const stats = useMemo(() => {
		if (list.length === 0) return { avg: 0, best: "-", total: 0 };
		const scores = list.map((h) => parseInt(h.score));
		const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
		const best = Math.max(...scores);
		return { avg, best, total: list.length };
	}, [list]);

	// Jika belum login, tampilkan pesan
	if (!isLoggedIn) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-teal-100">
				<Header />
				<main className="max-w-5xl mx-auto px-4 py-8">
					<div className="p-12 bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-2xl shadow-lg border-2 border-dashed border-gray-300 text-center">
						<div className="text-6xl mb-4">🔐</div>
						<h3 className="text-2xl font-black text-slate-900 mb-2">
							Login Diperlukan
						</h3>
						<p className="text-slate-600 font-medium max-w-sm mx-auto mb-6">
							Silakan login terlebih dahulu untuk melihat riwayat validasi prediksi Anda.
						</p>
						<button
							onClick={() => navigate("/login")}
							className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition transform hover:scale-105"
						>
							🔑 Login Sekarang
						</button>
					</div>
				</main>
			</div>
		);
	}

	// Loading state
	if (loading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-teal-100">
				<Header />
				<main className="max-w-5xl mx-auto px-4 py-8">
					<div className="p-12 bg-white rounded-2xl shadow-lg text-center">
						<div className="text-6xl mb-4 animate-spin">⏳</div>
						<h3 className="text-2xl font-black text-slate-900 mb-2">
							Memuat Riwayat...
						</h3>
						<p className="text-slate-600 font-medium">
							Mohon tunggu sebentar
						</p>
					</div>
				</main>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-teal-100">
			<Header />

			<main className="max-w-5xl mx-auto px-4 py-8">
				{/* Hero Section */}
				<div className="mb-10">
					<div className="flex items-center gap-4 mb-4">
						<div className="text-4xl">📊</div>
						<div>
							<h1 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-cyan-500 to-teal-700">
								Riwayat Validasi
							</h1>
							<p className="text-slate-600 mt-1 font-semibold">
								Pantau semua validasi prediksi cuaca Anda
							</p>
						</div>
					</div>
				</div>

				{/* Quick Stats */}
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
					<div className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl shadow-lg p-6 text-white overflow-hidden relative group hover:shadow-xl transition">
						<div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition" />
						<div className="relative z-10">
							<div className="text-sm font-bold opacity-90 mb-1">
								Total Validasi
							</div>
							<div className="text-4xl font-black">{stats.total}</div>
							<div className="text-xs opacity-75 mt-2">
								dalam sebulan terakhir
							</div>
						</div>
						<div className="absolute -right-8 -bottom-8 text-8xl opacity-10">
							📊
						</div>
					</div>

					<div className="bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl shadow-lg p-6 text-white overflow-hidden relative group hover:shadow-xl transition">
						<div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition" />
						<div className="relative z-10">
							<div className="text-sm font-bold opacity-90 mb-1">
								Rata-rata Score
							</div>
							<div className="text-4xl font-black">{stats.avg}%</div>
							<div className="text-xs opacity-75 mt-2">kualitas validasi</div>
						</div>
						<div className="absolute -right-8 -bottom-8 text-8xl opacity-10">
							📈
						</div>
					</div>

					<div className="bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl shadow-lg p-6 text-white overflow-hidden relative group hover:shadow-xl transition">
						<div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition" />
						<div className="relative z-10">
							<div className="text-sm font-bold opacity-90 mb-1">
								Score Tertinggi
							</div>
							<div className="text-4xl font-black">{stats.best}%</div>
							<div className="text-xs opacity-75 mt-2">prestasi terbaik Anda</div>
						</div>
						<div className="absolute -right-8 -bottom-8 text-8xl opacity-10">
							⭐
						</div>
					</div>
				</div>

				{/* Filter Section */}
				<div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
						<div>
							<InputField
								value={query}
								onChange={setQuery}
								placeholder="Cari tanggal, quality, score..."
								icon="🔍"
								label="🔎 Pencarian"
							/>
						</div>

						<div>
							<label className="text-xs font-black text-slate-700 mb-2 block uppercase tracking-wider">
								🏆 Filter Status
							</label>
							<select
								value={filterQuality}
								onChange={(e) => setFilterQuality(e.target.value)}
								className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl shadow-sm text-sm text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition cursor-pointer hover:border-teal-300"
							>
								<option value="semua">📋 Semua Status</option>
								<option value="Baik">✅ Baik (Kualitas Tinggi)</option>
								<option value="Sedang">⚠️ Sedang (Kualitas Menengah)</option>
								<option value="Buruk">❌ Buruk (Kualitas Rendah)</option>
							</select>
						</div>
					</div>

					{/* Quick Filter Pills */}
					<div className="flex flex-wrap gap-2">
						{["semua", "Baik", "Sedang", "Buruk"].map((status) => {
							const icons = { semua: "📋", Baik: "✅", Sedang: "⚠️", Buruk: "❌" };
							const labels = { semua: "Semua", Baik: "Baik", Sedang: "Sedang", Buruk: "Buruk" };
							const colors = {
								semua: "from-gray-500 to-gray-600",
								Baik: "from-green-500 to-emerald-600",
								Sedang: "from-yellow-500 to-orange-600",
								Buruk: "from-red-500 to-rose-600",
							};

							return (
								<button
									key={status}
									onClick={() => setFilterQuality(status)}
									className={`text-xs px-4 py-2 rounded-full font-bold transition transform ${
										filterQuality === status
											? `bg-gradient-to-r ${colors[status]} text-white shadow-lg scale-110`
											: "bg-white border-2 border-gray-200 text-slate-700 hover:border-teal-400 hover:scale-105"
									}`}
								>
									{icons[status]} {labels[status]}
								</button>
							);
						})}
					</div>

					<div className="mt-4 text-sm font-bold text-slate-600">
						✨ Ditemukan{" "}
						<span className="text-teal-600 text-lg">{list.length}</span> hasil
					</div>
				</div>

				{/* History List */}
				<section className="grid grid-cols-1 gap-4 mb-8">
					{list.length === 0 ? (
						<div className="p-12 bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-2xl shadow-lg border-2 border-dashed border-gray-300 text-center">
							<div className="text-6xl mb-4 animate-bounce">🔍</div>
							<h3 className="text-2xl font-black text-slate-900 mb-2">
								Tidak ada hasil
							</h3>
							<p className="text-slate-600 font-medium max-w-sm mx-auto mb-6">
								Tidak ada validasi yang cocok dengan filter Anda. Coba ubah
								pencarian atau lakukan validasi baru.
							</p>
							<a
								href="/predict"
								className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition transform hover:scale-105"
							>
								⚡ Mulai Validasi Baru
							</a>
						</div>
					) : (
						list.map((h, idx) => (
							<div
								key={h.id}
								style={{
									animation: `fadeInUp 0.5s ease-out ${idx * 0.1}s both`,
								}}
								className="relative group"
							>
								<HistoryCard
									date={h.date}
									temp={h.temp}
									humidity={h.humidity}
									pressure={h.pressure}
									windSpeed={h.windSpeed}
									quality={h.quality}
									score={h.score}
									icon={h.icon}
									confidence={h.confidence}
								/>
								{/* Tombol Hapus */}
								<button
									onClick={() => handleDelete(h.id)}
									className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg shadow-lg"
									title="Hapus riwayat"
								>
									🗑️
								</button>
							</div>
						))
					)}
				</section>

				{/* Performance Chart */}
				{list.length > 0 && (
					<div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
						<h3 className="text-2xl font-black text-slate-900 mb-6">
							📈 Grafik Performa
						</h3>

						<div className="space-y-4">
							{list.slice(0, 5).map((h) => {
								const scoreNum = parseInt(h.score);
								const colorMap = {
									Baik: "from-green-500 to-emerald-500",
									Sedang: "from-yellow-500 to-orange-500",
									Buruk: "from-red-500 to-rose-500",
								};

								return (
									<div key={h.id} className="flex items-center gap-4">
										<div className="w-24 text-sm font-bold text-slate-700 flex items-center gap-2">
											<span>{h.icon}</span>
											<span>{h.date}</span>
										</div>
										<div className="flex-1">
											<div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
												<div
													className={`h-full bg-gradient-to-r ${colorMap[h.quality]} rounded-full transition-all duration-500`}
													style={{ width: `${scoreNum}%` }}
												/>
											</div>
										</div>
										<div className="w-12 text-right">
											<span className="text-lg font-black text-teal-600">
												{h.score}%
											</span>
										</div>
									</div>
								);
							})}
						</div>
					</div>
				)}

				{/* CTA Section */}
				<div className="bg-gradient-to-r from-teal-600 via-cyan-500 to-teal-600 rounded-2xl shadow-xl p-8 text-white text-center relative overflow-hidden">
					<div className="absolute inset-0 opacity-10">
						<div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl" />
						<div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl" />
					</div>

					<div className="relative z-10">
						<h3 className="text-2xl font-black mb-2">
							Ingin Melakukan Validasi Baru?
						</h3>
						<p className="text-white/90 font-semibold mb-6">
							Validasi parameter cuaca Anda sekarang dan dapatkan score akurat
						</p>
						<a
							href="/predict"
							className="inline-flex items-center gap-2 px-8 py-4 bg-white text-teal-600 font-black rounded-xl shadow-lg hover:shadow-xl transition transform hover:scale-105"
						>
							⚡ Validasi Sekarang
						</a>
					</div>
				</div>
			</main>

			<style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .animate-bounce {
          animation: bounce 1s infinite;
        }
      `}</style>
		</div>
	);
}