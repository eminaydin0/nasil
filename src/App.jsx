import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import HomePage from './pages/HomePage';
import GameDetail from './pages/GameDetail';
import AdminPanel from './pages/AdminPanel';
import Header from './components/Header';
import Footer from './components/Footer';
import { initSession } from './utils/analytics';

function App() {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Initialize session tracking on app load
    initSession();
  }, []);

  return (
    <Router>
      <Routes>
        {/* Admin Panel Route - No Header/Footer */}
        <Route path="/admin-panel" element={<AdminPanel />} />
        
        {/* Main Site Routes - With Header/Footer */}
        <Route path="/*" element={
          <div className="min-h-screen flex flex-col bg-white">
            <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <main className="grow page-transition">
              <Routes>
                <Route path="/" element={<HomePage searchTerm={searchTerm} setSearchTerm={setSearchTerm} />} />
                <Route path="/oyun/:slug" element={<GameDetail />} />
              </Routes>
            </main>
            <Footer />
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
