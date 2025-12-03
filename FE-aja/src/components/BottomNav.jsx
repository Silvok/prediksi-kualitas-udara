import { Link, useLocation } from "react-router-dom";

export default function BottomNav() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed bottom-5 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-white/30 backdrop-blur-xl border border-white/40 shadow-lg rounded-3xl px-4 py-3 z-50 flex justify-between items-center">
      {/* Home */}
      <Link
        to="/"
        className={`relative flex flex-col items-center gap-1 px-5 py-2 rounded-2xl transition-all duration-300 ${
          isActive("/")
            ? "text-teal-600 scale-110"
            : "text-gray-500 hover:text-teal-600"
        }`}
      >
        {isActive("/") && (
          <span className="absolute inset-0 bg-teal-100 rounded-2xl -z-10 shadow-inner transition-all"></span>
        )}

        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
          <path
            d="M3 11.5L12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-8.5z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="text-xs font-medium">Beranda</span>
      </Link>

      {/* Predict */}
      <Link
        to="/predict"
        className={`relative flex flex-col items-center gap-1 px-5 py-2 rounded-2xl transition-all duration-300 ${
          isActive("/predict")
            ? "text-teal-600 scale-110"
            : "text-gray-500 hover:text-teal-600"
        }`}
      >
        {isActive("/predict") && (
          <span className="absolute inset-0 bg-teal-100 rounded-2xl -z-10 shadow-inner transition-all"></span>
        )}

        {/* Thermometer Icon */}
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="4" width="4" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="12" cy="18" r="4" stroke="currentColor" strokeWidth="1.6" />
          <line x1="12" y1="8" x2="12" y2="15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <span className="text-xs font-medium">Prediksi</span>
      </Link>

      {/* History */}
      <Link
        to="/history"
        className={`relative flex flex-col items-center gap-1 px-5 py-2 rounded-2xl transition-all duration-300 ${
          isActive("/history")
            ? "text-teal-600 scale-110"
            : "text-gray-500 hover:text-teal-600"
        }`}
      >
        {isActive("/history") && (
          <span className="absolute inset-0 bg-teal-100 rounded-2xl -z-10 shadow-inner transition-all"></span>
        )}

        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
          <path
            d="M21 12a9 9 0 1 1-3-6.64"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 7v6l4 2"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="text-xs font-medium">Riwayat</span>
      </Link>
    </nav>
  );
}
