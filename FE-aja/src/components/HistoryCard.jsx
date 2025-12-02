export default function HistoryCard({
  date = "2025-12-01",
  temp = "28",
  humidity = "65",
  pressure = "1013",
  windSpeed = "5",
  quality = "Baik",
  score = "82",
  icon = "✅",
}) {
  return (
    <article
      className="flex items-center gap-4 p-4 bg-white/90 backdrop-blur-sm rounded-2xl shadow-md border border-gray-100
                 hover:scale-[1.01] transition-transform duration-150"
      aria-label={`History: ${date} - ${quality}`}
    >
      <div
        className="w-14 h-14 flex items-center justify-center rounded-xl bg-gradient-to-br from-teal-50 to-teal-100
                   text-2xl shadow-sm"
        aria-hidden
      >
        <span>{icon}</span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-3">
          <div className="truncate">
            <p className="text-sm font-semibold text-slate-900">Validasi #{date}</p>
            <p className="text-xs text-slate-500 truncate">Status: {quality}</p>
          </div>

          <div className="text-right">
            <p className="text-lg font-bold text-teal-600">{score}%</p>
            <p className="text-xs text-slate-500">Score</p>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-4 gap-2 text-xs">
          <div className="bg-gray-50 rounded-lg p-2 text-center">
            <span className="text-slate-500 block">Suhu</span>
            <span className="font-semibold text-slate-900">{temp}°C</span>
          </div>
          <div className="bg-gray-50 rounded-lg p-2 text-center">
            <span className="text-slate-500 block">Kelembapan</span>
            <span className="font-semibold text-slate-900">{humidity}%</span>
          </div>
          <div className="bg-gray-50 rounded-lg p-2 text-center">
            <span className="text-slate-500 block">Tekanan</span>
            <span className="font-semibold text-slate-900">{pressure} mb</span>
          </div>
          <div className="bg-gray-50 rounded-lg p-2 text-center">
            <span className="text-slate-500 block">Angin</span>
            <span className="font-semibold text-slate-900">{windSpeed} m/s</span>
          </div>
        </div>
      </div>
    </article>
  );
}