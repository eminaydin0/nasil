import { Component } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

/**
 * Global Error Boundary
 * Tüm uygulama hatalarını yakalar ve kullanıcı dostu mesaj gösterir
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Hata logunu console'a yaz (production'da Sentry'ye gönderilebilir)
    console.error('Error Boundary caught:', error, errorInfo);

    // TODO: Sentry'ye gönder
    // Sentry.captureException(error, { extra: errorInfo });
  }

  handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
    window.location.reload();
  };

  handleGoHome = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="max-w-md w-full">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
              {/* Icon */}
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={32} className="text-red-500" />
              </div>

              {/* Title */}
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Bir Şeyler Ters Gitti
              </h1>

              {/* Description */}
              <p className="text-gray-600 mb-6">
                Üzgünüz, beklenmeyen bir hata oluştu. Ekibimiz otomatik olarak bilgilendirildi.
              </p>

              {/* Error Details (only in development) */}
              {import.meta.env.DEV && this.state.error && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg text-left">
                  <p className="text-xs font-mono text-red-600 mb-2">
                    {this.state.error.toString()}
                  </p>
                  <details className="text-xs text-gray-600">
                    <summary className="cursor-pointer font-semibold">
                      Stack Trace
                    </summary>
                    <pre className="mt-2 overflow-auto max-h-40 text-[10px]">
                      {this.state.errorInfo?.componentStack}
                    </pre>
                  </details>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={this.handleReset}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 transition-colors"
                >
                  <RefreshCw size={18} />
                  Sayfayı Yenile
                </button>
                <button
                  onClick={this.handleGoHome}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  <Home size={18} />
                  Ana Sayfa
                </button>
              </div>

              {/* Support link */}
              <p className="text-sm text-gray-500 mt-6">
                Sorun devam ederse{' '}
                <a href="/iletisim" className="text-orange-600 hover:text-orange-700 underline">
                  bize bildirin
                </a>
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
