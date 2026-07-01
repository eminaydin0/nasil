import { useState } from 'react';
import { Lock, User, Eye, EyeOff, Shield, AlertCircle, ArrowRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { adminLogin } from '../../utils/adminAuth';
import toast from 'react-hot-toast';

const LOGO_URL = '/favicon.png';

function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await adminLogin(supabase, username, password);

      if (result.success) {
        const adminData = {
          ...result.admin,
          loginTime: new Date().toISOString(),
        };

        if (rememberMe) {
          localStorage.setItem('adminData', JSON.stringify(adminData));
        } else {
          sessionStorage.setItem('adminData', JSON.stringify(adminData));
        }

        toast.success(`Hoş geldiniz, ${result.admin.fullName || result.admin.username}!`, {
          icon: '👋',
          duration: 3000,
        });

        onLogin();
      } else {
        setError(result.error);
        toast.error(result.error, { duration: 5000 });
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
      toast.error('Giriş yapılırken bir hata oluştu!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-cream-100 font-sans">
      {/* Sıcak arkaplan dekoru */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-orange-300/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-[28rem] w-[28rem] rounded-full bg-amber-300/20 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(124, 45, 18, 0.6) 1px, transparent 0)",
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      <div className="relative z-10 grid min-h-screen lg:grid-cols-2">
        {/* Sol: Brand paneli (sadece desktop) */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-charcoal-900 px-12 py-14 text-cream-50 lg:flex">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-gradient-to-br from-orange-500/40 to-red-500/30 blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-gradient-to-br from-amber-400/30 to-orange-500/20 blur-3xl" />

          <div className="relative">
            <div className="flex items-center gap-3">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 shadow-warm-glow">
                <img src={LOGO_URL} alt="" className="h-9 w-9 object-contain" />
              </span>
              <div className="leading-tight">
                <div className="text-lg font-bold">Kuralı Ne?</div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cream-50/60">
                  Yönetim Paneli
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <h2 className="text-3xl font-bold leading-tight tracking-tight md:text-4xl">
              Oyunları, kullanıcıları ve içerikleri{' '}
              <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
                tek panelden yönet
              </span>
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-cream-50/70">
              Premium dashboard, gerçek zamanlı analitik ve sezgisel kontroller ile sitenizi
              dakikalar içinde güncelleyin.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-3 text-center">
              {[
                { v: '10+', l: 'Modül' },
                { v: '24/7', l: 'Erişim' },
                { v: 'SSL', l: 'Güvenlik' },
              ].map((s) => (
                <div
                  key={s.l}
                  className="rounded-xl border border-cream-50/10 bg-white/[0.04] px-3 py-3 backdrop-blur-sm"
                >
                  <div className="text-lg font-bold text-orange-400">{s.v}</div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-cream-50/60">
                    {s.l}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative text-xs text-cream-50/40">
            © {new Date().getFullYear()} Kuralı Ne? — Yönetici erişimi
          </div>
        </div>

        {/* Sağ: Form */}
        <div className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-12">
          <div className="w-full max-w-md">
            {/* Mobil brand */}
            <div className="mb-8 flex items-center justify-center gap-2.5 lg:hidden">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-orange-500 to-red-500 shadow-warm-glow">
                <img src={LOGO_URL} alt="" className="h-8 w-8 object-contain" />
              </span>
              <div className="text-left leading-tight">
                <div className="text-base font-bold text-charcoal-900">Kuralı Ne?</div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-warm-500">
                  Yönetim Paneli
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-warm-200/70 bg-white/95 p-7 shadow-soft-xl backdrop-blur-md sm:p-9">
              <div className="mb-7">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/10 to-red-500/10 text-orange-600">
                  <Shield className="h-6 w-6" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-charcoal-900">
                  Tekrar hoş geldin
                </h1>
                <p className="mt-1 text-sm text-warm-500">
                  Yönetim paneline erişmek için giriş yapın.
                </p>
              </div>

              {error && (
                <div className="mb-5 flex items-start gap-2 rounded-xl border border-red-100 bg-red-50/80 px-4 py-3">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                  <p className="text-xs font-semibold text-red-800">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block pl-1 text-xs font-semibold text-warm-700">
                    Kullanıcı Adı
                  </label>
                  <div className="group relative">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                      <User className="h-4 w-4 text-warm-400 transition-colors group-focus-within:text-orange-500" />
                    </span>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full rounded-xl border-2 border-warm-200 bg-cream-50 py-3 pl-10 pr-3 text-sm text-charcoal-900 placeholder-warm-400 transition-all focus:border-orange-500 focus:bg-white focus:outline-none"
                      placeholder="admin"
                      required
                      disabled={loading}
                      autoComplete="username"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block pl-1 text-xs font-semibold text-warm-700">
                    Şifre
                  </label>
                  <div className="group relative">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                      <Lock className="h-4 w-4 text-warm-400 transition-colors group-focus-within:text-orange-500" />
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl border-2 border-warm-200 bg-cream-50 py-3 pl-10 pr-10 text-sm text-charcoal-900 placeholder-warm-400 transition-all focus:border-orange-500 focus:bg-white focus:outline-none"
                      placeholder="••••••••"
                      required
                      disabled={loading}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-warm-400 transition-colors hover:text-orange-500"
                      disabled={loading}
                      tabIndex={-1}
                      aria-label="Şifreyi göster/gizle"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <label className="flex cursor-pointer items-center gap-2 pt-1 select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 cursor-pointer rounded border-warm-300 text-orange-500 focus:ring-2 focus:ring-orange-500/30"
                    disabled={loading}
                  />
                  <span className="text-xs font-medium text-warm-700">
                    Beni 30 gün hatırla
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="group mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 px-5 py-3.5 text-sm font-bold text-white shadow-warm-glow transition-all duration-300 ease-spring hover:-translate-y-0.5 hover:shadow-warm-glow-lg disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Giriş yapılıyor…</span>
                    </>
                  ) : (
                    <>
                      <span>Giriş Yap</span>
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 border-t border-warm-200/70 pt-4 text-center">
                <p className="text-[11px] font-medium text-warm-500">
                  🔒 Yetkili personel erişimi · Tüm bağlantılar şifrelidir
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
