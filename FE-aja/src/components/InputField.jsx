export default function InputField({
  id,
  name,
  value = "",
  onChange = () => {},
  placeholder = "Masukkan nilai...",
  icon = "📝",
  type = "text",
  label,
  onSearch,
  clearable = true,
  className = "",
  min,
  max,
  step,
}) {
  const handleKey = (e) => {
    if (e.key === "Enter" && typeof onSearch === "function") onSearch(value);
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={id || name} className="text-xs font-bold text-slate-700 mb-2 block uppercase tracking-wide">
          {label}
        </label>
      )}

      <div className="relative">
        <span
          aria-hidden
          className="absolute inset-y-0 left-0 pl-3 flex items-center text-lg pointer-events-none text-teal-500"
        >
          {icon}
        </span>

        <input
          id={id || name}
          name={name}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKey}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          className="block w-full pl-10 pr-12 py-3 bg-white/95 backdrop-blur-sm border-2 border-gray-200 rounded-xl shadow-sm
                     text-sm text-slate-800 placeholder:text-slate-400 font-medium
                     focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition"
          aria-label={placeholder}
        />

        <div className="absolute inset-y-0 right-0 pr-2 flex items-center gap-1">
          {clearable && value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-gray-100 transition"
              aria-label="Clear"
              title="Hapus"
            >
              ✖️
            </button>
          )}

          {onSearch && (
            <button
              type="button"
              onClick={() => typeof onSearch === "function" && onSearch(value)}
              className="bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white px-3 py-1.5 rounded-lg text-sm font-bold shadow-md hover:shadow-lg transition transform hover:scale-105"
              aria-label="Cari"
              title="Validasi"
            >
              🔍
            </button>
          )}
        </div>
      </div>
    </div>
  );
}