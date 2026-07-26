import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  Calendar,
  Info,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import SEO from '../../components/common/SEO';
import toast from 'react-hot-toast';
import { TextField, Button } from '../../components/ui';

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [gender, setGender] = useState('');
  const [loading, setLoading] = useState(false);
  const [showVerificationInfo, setShowVerificationInfo] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const { signIn, signUp, resendVerification } = useAuth();
  const navigate = useNavigate();

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  const switchMode = (login) => {
    setIsLogin(login);
    setShowVerificationInfo(false);
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setShowVerificationInfo(false);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);

        if (error) {
          if (error.message.includes('Email not confirmed')) {
            toast.error('E-posta adresiniz henüz doğrulanmamış.', {
              icon: <AlertTriangle className="text-orange-500" />,
              duration: 5000,
            });
            setShowVerificationInfo(true);
            throw new Error(
              'Lütfen gelen kutunuzu kontrol edin ve üyeliğinizi doğrulayın.'
            );
          }
          throw error;
        }

        toast.success('Giriş başarılı!');
        navigate('/');
      } else {
        if (!fullName || !birthYear || !gender) {
          toast.error('Lütfen tüm alanları doldurunuz.');
          setLoading(false);
          return;
        }

        const metadata = {
          full_name: fullName,
          birth_year: birthYear,
          gender,
        };

        const { error } = await signUp(email, password, metadata);
        if (error) throw error;

        toast.success('Kayıt başarılı!', {
          icon: <CheckCircle className="text-emerald-500" />,
        });

        setIsLogin(true);
        setShowVerificationInfo(true);
        setFullName('');
        setBirthYear('');
        setGender('');
      }
    } catch (error) {
      if (!error.message.includes('Lütfen gelen kutunuzu')) {
        toast.error(
          error.message === 'Invalid login credentials'
            ? 'E-posta veya şifre hatalı.'
            : error.message
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (resendCooldown > 0) return;

    try {
      const { error } = await resendVerification(email);
      if (error) throw error;

      toast.success('Doğrulama bağlantısı tekrar gönderildi.');
      setResendCooldown(60);

      const interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      toast.error('E-posta gönderilemedi: ' + error.message);
    }
  };

  return (
    <>
      <SEO
        title={isLogin ? 'Giriş Yap - Kuralı Ne?' : 'Kayıt Ol - Kuralı Ne?'}
        description={isLogin ? 'Hesabınıza giriş yapın' : 'Yeni hesap oluşturun'}
        url="/auth"
        noindex
      />

      <div className="auth-screen relative isolate flex h-dvh overflow-hidden font-sans">
        <aside className="auth-brand relative hidden w-[58%] shrink-0 overflow-hidden lg:flex lg:flex-col lg:justify-between">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/auth-hero.png')" }}
            aria-hidden="true"
          />
          {/* Foto görünsün, metin okunaklı kalsın */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-charcoal-950/85 via-charcoal-950/25 to-charcoal-950/40"
            aria-hidden="true"
          />

          <div className="relative z-10 flex h-full flex-col justify-between px-10 py-12 xl:px-14 xl:py-14">
            <Link to="/" className="inline-flex w-fit items-center gap-3 transition-opacity hover:opacity-90">
              <img
                src="/logo.png"
                alt="Kuralı Ne?"
                className="h-14 w-auto drop-shadow-[0_8px_24px_rgba(0,0,0,0.55)] animate-float"
              />
            </Link>

            <div className="max-w-md">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.22em] text-orange-300/90">
                Oyun Rehberi &amp; Keşif
              </p>
              <h1 className="text-[2.35rem] font-extrabold leading-[1.12] tracking-tight text-cream-50 drop-shadow-md xl:text-5xl">
                Kuralı Ne?
              </h1>
              <p className="mt-4 max-w-sm text-base leading-relaxed text-cream-100/80">
                Geleneksel ve dijital oyunların kurallarını keşfet, favorile, yorumla.
              </p>
            </div>

            <p className="relative z-10 text-xs text-cream-100/40">kuraline.xyz</p>
          </div>
        </aside>

        <section className="relative flex h-full flex-1 flex-col items-center justify-center overflow-hidden bg-[#f7f3ec] px-5 py-6 sm:px-8 lg:px-12 xl:px-16">
          <div
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              backgroundImage:
                'radial-gradient(ellipse 80% 50% at 100% 0%, rgba(249,115,22,0.12), transparent 55%), radial-gradient(ellipse 60% 40% at 0% 100%, rgba(245,158,11,0.1), transparent 50%)',
            }}
            aria-hidden="true"
          />

          <div className="relative w-full max-w-[400px]">
            <div className="mb-5 flex items-center justify-center gap-3 lg:hidden">
              <Link to="/" className="shrink-0">
                <img
                  src="/logo.png"
                  alt="Kuralı Ne?"
                  className="h-11 w-auto rounded-xl bg-charcoal-950 p-1.5 shadow-soft"
                />
              </Link>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-orange-600">
                Kuralı Ne?
              </p>
            </div>

            <div className="auth-copy mb-5" key={isLogin ? 'login-copy' : 'register-copy'}>
              <h2 className="text-xl font-extrabold tracking-tight text-charcoal-900 sm:text-2xl">
                {isLogin ? 'Tekrar hoş geldin' : 'Aramıza katıl'}
              </h2>
              <p className="mt-1 text-sm text-warm-600">
                {isLogin
                  ? 'Yorum yapmak ve favorilere eklemek için giriş yap.'
                  : 'Hesap oluştur, oyun deneyimini kişiselleştir.'}
              </p>
            </div>

            <div
              className="mb-5 grid grid-cols-2 gap-1 rounded-2xl bg-charcoal-900/5 p-1"
              role="tablist"
              aria-label="Giriş veya kayıt"
            >
              <button
                type="button"
                role="tab"
                aria-selected={isLogin}
                onClick={() => switchMode(true)}
                className={`rounded-xl px-4 py-2.5 text-sm font-bold transition-colors duration-200 ${
                  isLogin
                    ? 'bg-charcoal-900 text-cream-50 shadow-soft-md'
                    : 'text-warm-600 hover:text-charcoal-900'
                }`}
              >
                Giriş Yap
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={!isLogin}
                onClick={() => switchMode(false)}
                className={`rounded-xl px-4 py-2.5 text-sm font-bold transition-colors duration-200 ${
                  !isLogin
                    ? 'bg-charcoal-900 text-cream-50 shadow-soft-md'
                    : 'text-warm-600 hover:text-charcoal-900'
                }`}
              >
                Kayıt Ol
              </button>
            </div>

            {showVerificationInfo && (
              <div className="absolute inset-x-0 top-0 z-20 rounded-2xl border border-orange-200/80 bg-orange-50 p-4 shadow-soft-xl">
                <div className="flex items-start gap-3">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white shadow-soft">
                    <Info className="h-5 w-5 text-orange-500" aria-hidden />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-orange-950">
                      E-posta doğrulaması gerekiyor
                    </h4>
                    <p className="mt-1 text-xs leading-relaxed text-orange-900/75">
                      <span className="font-bold">{email}</span> adresine bağlantı
                      gönderdik. Gelen kutunu veya spam&apos;i kontrol et.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowVerificationInfo(false)}
                    className="text-xs font-bold text-orange-700/70 hover:text-orange-900"
                    aria-label="Kapat"
                  >
                    ✕
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleResendVerification}
                  disabled={resendCooldown > 0}
                  className="mt-3 w-full rounded-xl border border-orange-200 bg-white px-3 py-2.5 text-xs font-bold text-orange-700 transition-colors hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {resendCooldown > 0
                    ? `${resendCooldown} sn sonra tekrar gönder`
                    : 'Doğrulama e-postasını tekrar gönder'}
                </button>
              </div>
            )}

            <form onSubmit={handleAuth} className="space-y-3">
              <div
                className={`auth-extra-fields ${isLogin ? '' : 'auth-extra-fields--open'}`}
                aria-hidden={isLogin}
              >
                <div className="auth-extra-fields-inner">
                  <div className="space-y-3 pb-3">
                    <TextField
                      label="Ad Soyad"
                      icon={User}
                      type="text"
                      autoComplete="name"
                      required={!isLogin}
                      disabled={isLogin}
                      tabIndex={isLogin ? -1 : undefined}
                      placeholder="Adınız ve soyadınız"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      tone="subtle"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <TextField
                        as="select"
                        label="Doğum Yılı"
                        icon={Calendar}
                        required={!isLogin}
                        disabled={isLogin}
                        tabIndex={isLogin ? -1 : undefined}
                        value={birthYear}
                        onChange={(e) => setBirthYear(e.target.value)}
                        tone="subtle"
                      >
                        <option value="">Seçiniz</option>
                        {years.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </TextField>
                      <TextField
                        as="select"
                        label="Cinsiyet"
                        icon={User}
                        required={!isLogin}
                        disabled={isLogin}
                        tabIndex={isLogin ? -1 : undefined}
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        tone="subtle"
                      >
                        <option value="">Seçiniz</option>
                        <option value="male">Erkek</option>
                        <option value="female">Kadın</option>
                        <option value="other">Diğer</option>
                      </TextField>
                    </div>
                  </div>
                </div>
              </div>

              <TextField
                label="E-posta"
                icon={Mail}
                type="email"
                autoComplete="email"
                required
                placeholder="ornek@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                tone="subtle"
              />

              <TextField
                label="Şifre"
                icon={Lock}
                type="password"
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                required
                minLength={isLogin ? undefined : 6}
                placeholder={isLogin ? 'Şifreniz' : 'En az 6 karakter'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                tone="subtle"
              />

              <Button
                type="submit"
                fullWidth
                loading={loading}
                size="lg"
                iconRight={!loading ? ArrowRight : undefined}
                className="!mt-4 !rounded-2xl"
              >
                {isLogin ? 'Giriş Yap' : 'Hesap Oluştur'}
              </Button>
            </form>

            <p className="mt-5 text-center text-sm text-warm-600">
              {isLogin ? 'Hesabın yok mu? ' : 'Zaten hesabın var mı? '}
              <button
                type="button"
                onClick={() => switchMode(!isLogin)}
                className="font-bold text-orange-600 underline-offset-2 transition-colors hover:text-orange-700 hover:underline"
              >
                {isLogin ? 'Hemen kaydol' : 'Giriş yap'}
              </button>
            </p>

            <div className={`auth-terms ${isLogin ? '' : 'auth-terms--open'}`} aria-hidden={isLogin}>
              <div className="auth-terms-inner">
                <p className="pt-2 text-center text-[11px] leading-relaxed text-warm-500">
                  Kayıt olarak{' '}
                  <Link
                    to="/kullanim-kosullari"
                    tabIndex={isLogin ? -1 : undefined}
                    className="font-semibold text-warm-700 underline-offset-2 hover:underline"
                  >
                    Kullanım Koşulları
                  </Link>
                  &apos;nı kabul etmiş sayılırsınız.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default AuthPage;
