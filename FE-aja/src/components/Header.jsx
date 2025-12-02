import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Header.css";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Cek user dari localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const go = (path) => {
    setOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setAvatarOpen(false);
    navigate("/");
    alert("Berhasil logout!");
  };

  const isActive = (path) => location.pathname === path;

  const initials = user ? user.name.split(" ").map(n => n[0]).join("").toUpperCase() : "SK";

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <div className="logo-icon" aria-hidden>
            <span className="sun">🌤️</span>
            <div className="cloud">☁️</div>
          </div>
          <div className="brand">
            <h1 style={{ cursor: "pointer" }} onClick={() => go("/")}>Skywise</h1>
            <p className="tagline">Smart forecasts, simple decisions</p>
          </div>
        </div>

        <button
          className="mobile-toggle"
          aria-label="Toggle menu"
          onClick={() => setOpen((s) => !s)}
        >
          <span className={`hamburger ${open ? "open" : ""}`} />
        </button>

        <nav className={`nav ${open ? "open" : ""}`}>
          <div className="nav-left">
            <button
              onClick={() => go("/")}
              className={`nav-btn ${isActive("/") ? "active" : ""}`}
            >
              Home
            </button>
            <button
              onClick={() => go("/predict")}
              className={`nav-btn ${isActive("/predict") ? "active" : ""}`}
            >
              Prediksi
            </button>
            <button
              onClick={() => go("/history")}
              className={`nav-btn ${isActive("/history") ? "active" : ""}`}
            >
              Riwayat
            </button>
          </div>

          <div className="nav-right">
            {user ? (
              <div style={{ position: "relative" }}>
                <button
                  className="avatar"
                  title={user.name}
                  onClick={() => setAvatarOpen((s) => !s)}
                  aria-expanded={avatarOpen}
                >
                  <span>{initials}</span>
                </button>

                {avatarOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-2 w-52 bg-white/95 border border-gray-100 rounded-lg shadow-md py-2"
                  >
                    <div className="px-3 py-2 border-b border-gray-100 text-xs">
                      <div className="font-bold text-slate-900">{user.name}</div>
                      <div className="text-slate-500 text-xs">{user.email}</div>
                    </div>
                    <button
                      className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50 text-slate-700 font-medium"
                      onClick={() => {
                        setAvatarOpen(false);
                        go("/profile");
                      }}
                    >
                      👤 Profile
                    </button>
                    <button
                      className="block w-full text-left px-3 py-2 text-sm hover:bg-red-50 text-red-600 font-bold"
                      onClick={handleLogout}
                    >
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => go("/login")}
                  className="px-3 py-2 text-sm font-bold text-white hover:bg-white/10 rounded-lg transition"
                >
                  Masuk
                </button>
                <button
                  onClick={() => go("/signup")}
                  className="px-3 py-2 text-sm font-bold bg-white text-teal-600 rounded-lg hover:bg-gray-100 transition"
                >
                  Daftar
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}