import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import HomePage from './pages/HomePage';
import GameDetail from './pages/GameDetail';
import AdminPanel from './pages/AdminPanel';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import { initSession } from './utils/analytics';

function App() {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Initialize session tracking on app load
    initSession();
  }, []);

  return (
    <Router>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#363636',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            borderRadius: '12px',
            padding: '16px',
            fontSize: '14px',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
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
