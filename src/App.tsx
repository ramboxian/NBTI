import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Home from './pages/Home';
import ModeSelection from './pages/ModeSelection';
import Quiz from './pages/Quiz';
import Result from './pages/Result';
import AllResults from './pages/AllResults';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/mode" element={<ModeSelection />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/result" element={<Result />} />
        <Route path="/all" element={<AllResults />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-[100dvh] max-w-md mx-auto relative overflow-hidden bg-canvas text-ink shadow-2xl">
        <AnimatedRoutes />
      </div>
    </Router>
  );
}

export default App;