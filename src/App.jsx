import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import HomePage from './pages/HomePage';
import GameDetail from './pages/GameDetail';
import CategoryPage from './pages/Categories';
import AllGames from './pages/AllGames';
import ToolsPage from './pages/Tools/ToolsPage';
import OkeyPage from './pages/Tools/OkeyPage';
import Okey101Page from './pages/Tools/Okey101Page';
import BatakPage from './pages/Tools/BatakPage';
import TeamGeneratorPage from './pages/Tools/TeamGeneratorPage';
import DicePage from './pages/Tools/DicePage';
import ScoreBoardPage from './pages/Tools/ScoreBoardPage';
import AdminPanel from './pages/AdminPanel';
import About from './pages/About';
import Contact from './pages/Contact';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import { initSession } from './utils/analytics';

function App() {
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
            <Header />
            <main className="grow page-transition">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/oyunlar" element={<AllGames />} />
                <Route path="/araclar" element={<ToolsPage />} />
                <Route path="/araclar/okey-sayaci" element={<OkeyPage />} />
                <Route path="/araclar/101-yazboz" element={<Okey101Page />} />
                <Route path="/araclar/batak-yazboz" element={<BatakPage />} />
                <Route path="/araclar/takim-olusturucu" element={<TeamGeneratorPage />} />
                <Route path="/araclar/zar-at" element={<DicePage />} />
                <Route path="/araclar/skor-tablosu" element={<ScoreBoardPage />} />
                <Route path="/kategori/:categoryName" element={<CategoryPage />} />
                <Route path="/oyun/:slug" element={<GameDetail />} />
                <Route path="/hakkimizda" element={<About />} />
                <Route path="/iletisim" element={<Contact />} />
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
