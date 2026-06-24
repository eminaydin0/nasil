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
  Sparkles,
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
      <div className="relative min-h-[80vh] overflow-hidden bg-cream-100 px-4 py-12 sm:px-6 lg:px-8 font-sans">
        {/* Sicak arkaplan */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-orange-300/20 blur-3xl" />
          <div className="absolute -bottom-40 -right-32 h-[28rem] w-[28rem] rounded-full bg-amber-300/20 blur-3xl" />
        </div>

        <div className="relative mx-auto flex max-w-md flex-col items-center">
          {/* Tab toggle */}
          <div className="mb-6 inline-flex rounded-2xl border border-warm-200 bg-white p-1 shadow-soft">
            <button
              type="button"
              onClick={() => {
                setIsLogin(true);
                setShowVerificationInfo(false);
              }}
              className={`rounded-xl px-5 py-2 text-sm font-bold transition-all ${
                isLogin
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-warm-glow'
                  : 'text-warm-600 hover:text-charcoal-900'
              }`}
            >
              Giriş Yap
            </button>
            <button
              type="button"
              onClick={() => {
                setIsLogin(false);
                setShowVerificationInfo(false);
              }}
              className={`rounded-xl px-5 py-2 text-sm font-bold transition-all ${
                !isLogin
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-warm-glow'
                  : 'text-warm-600 hover:text-charcoal-900'
              }`}
            >
              Kayıt Ol
            </button>
          </div>

          <div className="w-full overflow-hidden rounded-3xl border border-warm-200/70 bg-white/95 p-7 shadow-soft-xl backdrop-blur-md sm:p-9">
            <div className="mb-6 text-center">
              <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/10 to-red-500/10 text-orange-600">
                <Sparkles className="h-6 w-6" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-charcoal-900">
                {isLogin ? 'Tekrar hoş geldin' : 'Aramıza katıl'}
              </h1>
              <p className="mt-1 text-sm text-warm-500">
                {isLogin
                  ? 'Yorum yapmak ve favorilere eklemek için giriş yap'
                  : 'Hesap oluştur, oyun deneyimini kişiselleştir'}
              </p>
            </div>

            {showVerificationInfo && (
              <div className="mb-5 rounded-2xl border border-orange-200/70 bg-gradient-to-br from-orange-50 to-amber-50 p-4">
                <div className="flex items-start gap-3">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white shadow-soft">
                    <Info className="h-5 w-5 text-orange-500" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-orange-900">
                      E-posta Doğrulaması Gerekiyor
                    </h4>
                    <p className="mt-1 text-xs leading-relaxed text-orange-800/80">
                      <span className="font-bold">{email}</span> adresine bir doğrulama
                      bağlantısı gönderdik. Lütfen gelen kutunuzu (veya spam klasörünü)
                      kontrol edip bağlantıya tıklayın.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleResendVerification}
                  disabled={resendCooldown > 0}
                  className="mt-3 w-full rounded-lg border border-orange-200 bg-white px-3 py-2 text-xs font-bold text-orange-700 transition-colors hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {resendCooldown > 0
                    ? `${resendCooldown} saniye sonra tekrar gönder`
                    : 'Doğrulama E-postasını Tekrar Gönder'}
                </button>
              </div>
            )}

            <form onSubmit={handleAuth} className="space-y-4">
              {!isLogin && (
                <>
                  <TextField
                    label="Ad Soyad"
                    icon={User}
                    type="text"
                    autoComplete="name"
                    required
                    placeholder="Adınız ve soyadınız"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <TextField
                      as="select"
                      label="Doğum Yılı"
                      icon={Calendar}
                      required
                      value={birthYear}
                      onChange={(e) => setBirthYear(e.target.value)}
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
                      required
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                    >
                      <option value="">Seçiniz</option>
                      <option value="male">Erkek</option>
                      <option value="female">Kadın</option>
                      <option value="other">Diğer</option>
                    </TextField>
                  </div>
                </>
              )}

              <TextField
                label="E-posta Adresi"
                icon={Mail}
                type="email"
                autoComplete="email"
                required
                placeholder="ornek@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <TextField
                label="Şifre"
                icon={Lock}
                type="password"
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                required
                minLength={isLogin ? undefined : 6}
                placeholder={isLogin ? 'Şifreniz' : 'En az 6 karakter'}
                hint={!isLogin ? 'En az 6 karakter kullanın' : undefined}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Button
                type="submit"
                fullWidth
                loading={loading}
                size="lg"
                iconRight={!loading ? ArrowRight : undefined}
                className="mt-2"
              >
                {isLogin ? 'Giriş Yap' : 'Hesap Oluştur'}
              </Button>

              <p className="pt-2 text-center text-[11px] leading-relaxed text-warm-500">
                {isLogin ? 'Hesabın yok mu? ' : 'Zaten hesabın var mı? '}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setShowVerificationInfo(false);
                  }}
                  className="font-bold text-orange-600 underline-offset-2 hover:text-orange-700 hover:underline"
                >
                  {isLogin ? 'Hemen kaydol' : 'Giriş yap'}
                </button>
              </p>

              {!isLogin && (
                <p className="text-center text-[11px] text-warm-500">
                  Kayıt olarak{' '}
                  <Link
                    to="/kullanim-kosullari"
                    className="font-semibold text-warm-700 underline-offset-2 hover:underline"
                  >
                    Kullanım Koşulları
                  </Link>
                  'nı kabul etmiş sayılırsınız.
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default AuthPage;
