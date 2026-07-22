import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from './components/common/ErrorBoundary';
import CookieConsent from './components/common/CookieConsent';
import AddToHomeScreen from './components/common/AddToHomeScreen';
import ScrollToTop from './components/common/ScrollToTop';
import AnalyticsRouteTracker from './components/common/AnalyticsRouteTracker';
import LoadingSpinner from './components/common/LoadingSpinner';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import GameAssistant from './components/assistant/GameAssistant';
import KeyboardInsetProvider from './components/common/KeyboardInsetProvider';
import { AuthProvider } from './context/AuthContext';
import { ConfirmProvider } from './components/ui';

/** Ana sayfa eager — LCP / ilk boyama */
import HomePage from './pages/HomePage';

const GameDetail = lazy(() => import('./pages/GameDetail'));
const CategoryPage = lazy(() => import('./pages/Categories'));
const AllGames = lazy(() => import('./pages/AllGames'));
const ToolsPage = lazy(() => import('./pages/Tools/ToolsPage'));
const OkeyPage = lazy(() => import('./pages/Tools/OkeyPage'));
const Okey101Page = lazy(() => import('./pages/Tools/Okey101Page'));
const BatakPage = lazy(() => import('./pages/Tools/BatakPage'));
const TeamGeneratorPage = lazy(() => import('./pages/Tools/TeamGeneratorPage'));
const DicePage = lazy(() => import('./pages/Tools/DicePage'));
const ScoreBoardPage = lazy(() => import('./pages/Tools/ScoreBoardPage'));
const HalisahaPage = lazy(() => import('./pages/Tools/HalisahaPage'));
const DecisionWheelPage = lazy(() => import('./pages/Tools/DecisionWheelPage'));
const KuraCekPage = lazy(() => import('./pages/Tools/KuraCekPage'));
const Okey101ScorePage = lazy(() => import('./pages/GameDetail/Okey101ScorePage'));
const NewsPage = lazy(() => import('./pages/News'));
const NewsDetailPage = lazy(() => import('./pages/NewsDetail'));
const FreeGamesPage = lazy(() => import('./pages/FreeGames'));
const DealsPage = lazy(() => import('./pages/Deals'));
const ComparePage = lazy(() => import('./pages/Compare'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const TermsOfUse = lazy(() => import('./pages/TermsOfUse'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const CookiePolicy = lazy(() => import('./pages/CookiePolicy'));
const ReklamVerin = lazy(() => import('./pages/ReklamVerin'));
const ErrorPage = lazy(() => import('./pages/ErrorPage'));
const AuthPage = lazy(() => import('./pages/Auth/AuthPage'));
const ProfilePage = lazy(() => import('./pages/Profile/ProfilePage'));

function RouteFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center" role="status" aria-live="polite">
      <LoadingSpinner size="md" />
      <span className="sr-only">Sayfa yükleniyor</span>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ConfirmProvider>
          <Router>
            <KeyboardInsetProvider />
            <CookieConsent />
            <AddToHomeScreen />
            <Toaster
              position="top-right"
              gutter={10}
              containerStyle={{
                top: 'calc(var(--app-header-offset) + 0.5rem)',
                right: 'calc(0.75rem + var(--safe-right))',
                left: 'calc(0.75rem + var(--safe-left))',
              }}
              toastOptions={{
                duration: 3000,
                className: 'font-sans !max-w-none sm:!max-w-[420px]',
                style: {
                  background: '#ffffff',
                  color: '#1c1917',
                  fontFamily:
                    "Manrope, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                  fontSize: '14px',
                  fontWeight: 600,
                  padding: '12px 16px',
                  borderRadius: '14px',
                  border: '1px solid rgba(231, 229, 228, 0.7)',
                  boxShadow:
                    '0 10px 25px -5px rgba(28, 25, 23, 0.1), 0 8px 10px -6px rgba(28, 25, 23, 0.05)',
                  maxWidth: '100%',
                },
                success: {
                  iconTheme: { primary: '#10b981', secondary: '#ecfdf5' },
                  style: {
                    borderLeft: '4px solid #10b981',
                  },
                },
                error: {
                  iconTheme: { primary: '#f43f5e', secondary: '#fff1f2' },
                  style: {
                    borderLeft: '4px solid #f43f5e',
                  },
                },
                loading: {
                  iconTheme: { primary: '#f97316', secondary: '#fff7ed' },
                  style: {
                    borderLeft: '4px solid #f97316',
                  },
                },
              }}
            />
            <Suspense fallback={<RouteFallback />}>
              <Routes>
                <Route path="/admin" element={<Navigate to="/admin-panel" replace />} />
                <Route path="/admin-panel" element={<AdminPanel />} />
                <Route path="/admin-panel/*" element={<AdminPanel />} />

                <Route
                  path="/*"
                  element={
                    <div className="flex min-h-screen min-w-0 flex-col overflow-x-clip bg-white">
                      <Header />
                      <AnalyticsRouteTracker />
                      <ScrollToTop />
                      <main className="page-main min-w-0 grow overflow-x-clip page-transition">
                        <Suspense fallback={<RouteFallback />}>
                          <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/oyunlar" element={<AllGames />} />
                            <Route path="/haberler" element={<NewsPage />} />
                            <Route path="/haberler/:slug" element={<NewsDetailPage />} />
                            <Route path="/ucretsiz-oyunlar" element={<FreeGamesPage />} />
                            <Route path="/indirimler" element={<DealsPage />} />
                            <Route path="/araclar" element={<ToolsPage />} />
                            <Route path="/araclar/okey-sayaci" element={<OkeyPage />} />
                            <Route path="/araclar/101-yazboz" element={<Okey101Page />} />
                            <Route path="/araclar/batak-yazboz" element={<BatakPage />} />
                            <Route path="/araclar/takim-olusturucu" element={<TeamGeneratorPage />} />
                            <Route
                              path="/araclar/halisaha-takim-olusturucu"
                              element={<HalisahaPage />}
                            />
                            <Route path="/araclar/karar-carki" element={<DecisionWheelPage />} />
                            <Route path="/araclar/kura-cek" element={<KuraCekPage />} />
                            <Route path="/araclar/zar-at" element={<DicePage />} />
                            <Route path="/araclar/skor-tablosu" element={<ScoreBoardPage />} />
                            <Route path="/kategori/:categoryName" element={<CategoryPage />} />
                            <Route path="/oyun/:slug" element={<GameDetail />} />
                            <Route
                              path="/oyun/:slug/101-skor-tablosu"
                              element={<Okey101ScorePage />}
                            />
                            <Route path="/karsilastir/:comparison" element={<ComparePage />} />
                            <Route path="/hakkimizda" element={<About />} />
                            <Route path="/iletisim" element={<Contact />} />
                            <Route path="/kullanim-kosullari" element={<TermsOfUse />} />
                            <Route path="/gizlilik" element={<PrivacyPolicy />} />
                            <Route path="/cerez-politikasi" element={<CookiePolicy />} />
                            <Route path="/reklam-verin" element={<ReklamVerin />} />
                            <Route path="/auth" element={<AuthPage />} />
                            <Route path="/profil" element={<ProfilePage />} />
                            <Route path="*" element={<ErrorPage status={404} />} />
                          </Routes>
                        </Suspense>
                      </main>
                      <Footer />
                      <GameAssistant />
                    </div>
                  }
                />
              </Routes>
            </Suspense>
          </Router>
        </ConfirmProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
