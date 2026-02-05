import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, User, ArrowRight, Loader, Calendar, Info, AlertTriangle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import SEO from '../../components/common/SEO';
import toast from 'react-hot-toast';

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [gender, setGender] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
          if (error.message.includes("Email not confirmed")) {
             toast.error("E-posta adresiniz henüz doğrulanmamış.", {
               icon: <AlertTriangle className="text-orange-500" />,
               duration: 5000
             });
             setShowVerificationInfo(true);
             throw new Error("Lütfen gelen kutunuzu kontrol edin ve üyeliğinizi doğrulayın.");
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
          gender: gender
        };

        const { error } = await signUp(email, password, metadata);
        if (error) throw error;
        
        toast.success('Kayıt başarılı!', {
          icon: <CheckCircle className="text-green-500" />
        });
        
        // Show verification required message
        setIsLogin(true);
        setShowVerificationInfo(true);
        // Clear form
        setFullName('');
        setBirthYear('');
        setGender('');
        // Keep email to help them login
      }
    } catch (error) {
      if (!error.message.includes("Lütfen gelen kutunuzu")) { // Avoid double toast if we manually threw
         toast.error(error.message === "Invalid login credentials" ? "E-posta veya şifre hatalı." : error.message);
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
      setResendCooldown(60); // 60 seconds cooldown
      
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
        title={isLogin ? "Giriş Yap - Nasıl Oynanır" : "Kayıt Ol - Nasıl Oynanır"}
        description={isLogin ? "Hesabınıza giriş yapın" : "Yeni hesap oluşturun"}
      />
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 tracking-tight">
              {isLogin ? 'Hoş Geldiniz' : 'Hesap Oluşturun'}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {isLogin ? (
                <>
                  Hesabınız yok mu?{' '}
                  <button
                    onClick={() => {
                        setIsLogin(false);
                        setShowVerificationInfo(false);
                    }}
                    className="font-medium text-orange-600 hover:text-orange-500 transition-colors"
                  >
                    Hemen kaydolun
                  </button>
                </>
              ) : (
                <>
                  Zaten hesabınız var mı?{' '}
                  <button
                    onClick={() => {
                        setIsLogin(true);
                        setShowVerificationInfo(false);
                    }}
                    className="font-medium text-orange-600 hover:text-orange-500 transition-colors"
                  >
                    Giriş yapın
                  </button>
                </>
              )}
            </p>
          </div>
          
          {showVerificationInfo && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <div className="bg-white p-2 rounded-full shadow-xs shrink-0">
                  <Info className="h-6 w-6 text-orange-500" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-orange-900">E-posta Doğrulaması Gerekiyor</h4>
                  <p className="text-xs text-orange-700 mt-1">
                    Güvenliğiniz için <span className="font-semibold">{email}</span> adresine bir doğrulama bağlantısı gönderdik. Lütfen gelen kutunuzu (veya spam klasörünü) kontrol edip bağlantıya tıklayın.
                  </p>
                </div>
              </div>
              <button
                onClick={handleResendVerification}
                disabled={resendCooldown > 0}
                className="ml-auto text-xs font-semibold text-orange-600 hover:text-orange-800 underline disabled:opacity-50 disabled:no-underline disabled:cursor-not-allowed"
              >
                {resendCooldown > 0 
                  ? `${resendCooldown} saniye sonra tekrar gönderebilirsiniz` 
                  : 'Doğrulama E-postasını Tekrar Gönder'}
              </button>
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleAuth}>
            <div className="space-y-4">
              {!isLogin && (
                <>
                  <div>
                    <label htmlFor="full-name" className="sr-only">Ad Soyad</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="full-name"
                        name="fullName"
                        type="text"
                        autoComplete="name"
                        required={!isLogin}
                        className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                        placeholder="Ad Soyad"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="birth-year" className="sr-only">Doğum Yılı</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <select
                        id="birth-year"
                        name="birthYear"
                        required={!isLogin}
                        className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm bg-white"
                        value={birthYear}
                        onChange={(e) => setBirthYear(e.target.value)}
                      >
                        <option value="">Doğum Yılı Seçiniz</option>
                        {years.map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="gender" className="sr-only">Cinsiyet</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <select
                        id="gender"
                        name="gender"
                        required={!isLogin}
                        className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm bg-white"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                      >
                        <option value="">Cinsiyet Seçiniz</option>
                        <option value="male">Erkek</option>
                        <option value="female">Kadın</option>
                        <option value="other">Diğer</option>
                      </select>
                    </div>
                  </div>
                </>
              )}
              <div>
                <label htmlFor="email-address" className="sr-only">E-posta adresi</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                  </div>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                    placeholder="ornek@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Şifre</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete={isLogin ? 'current-password' : 'new-password'}
                    required
                    minLength={isLogin ? undefined : 6}
                    className="appearance-none relative block w-full pl-10 pr-11 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                    placeholder={isLogin ? 'Şifre' : 'En az 6 karakter'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowPassword((prev) => !prev);
                    }}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center justify-center z-10 text-gray-400 hover:text-orange-500 active:text-orange-600 transition-colors cursor-pointer min-w-[44px]"
                    tabIndex={-1}
                    title={showPassword ? 'Şifreyi gizle' : 'Şifreyi göster'}
                    aria-label={showPassword ? 'Şifreyi gizle' : 'Şifreyi göster'}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5 shrink-0 pointer-events-none" /> : <Eye className="h-5 w-5 shrink-0 pointer-events-none" />}
                  </button>
                </div>
                {!isLogin && (
                  <p className="mt-1.5 text-xs text-gray-500">En az 6 karakter kullanın</p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-linear-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader className="animate-spin h-5 w-5" />
                ) : (
                  <>
                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                      {isLogin ? <ArrowRight className="h-5 w-5 text-orange-200 group-hover:text-orange-100" /> : <User className="h-5 w-5 text-orange-200 group-hover:text-orange-100" />}
                    </span>
                    {isLogin ? 'Giriş Yap' : (
                         showVerificationInfo ? 'Doğrulama E-postası Gönderildi' : 'Hesap Oluştur'
                    )}
                  </>
                )}
              </button>
            </div>
            
            <div className="text-center">
              <p className="text-xs text-gray-500">
                Kayıt olarak <Link to="/kullanim-kosullari" className="underline hover:text-gray-900">Kullanım Koşulları</Link>'nı kabul etmiş sayılırsınız.
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default AuthPage;
