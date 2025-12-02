import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WelcomePage from "./pages/WelcomePage";
import PredictionPage from "./pages/PredictionPage";
import HistoryPage from "./pages/HistoryPage";
import SuccessPage from "./pages/SuccessPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import BottomNav from "./components/BottomNav";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen pb-20 bg-gradient-to-b from-teal-100 to-teal-200">
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/predict" element={<PredictionPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>

        <BottomNav />
      </div>
    </Router>
  );
}
