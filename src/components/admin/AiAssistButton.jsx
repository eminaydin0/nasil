import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { generateAiContent } from '../../lib/ai';

/**
 * Admin panel — Gemini ile içerik üret butonu
 */
function AiAssistButton({ task, payload, label = 'AI ile doldur', onResult, disabled = false, className = '' }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (disabled || loading) return;
    setLoading(true);
    try {
      const result = await generateAiContent(task, payload);
      if (result.data) {
        onResult(result.data);
        toast.success('AI içerik uygulandı — kontrol edip kaydedin.');
      } else {
        toast.error('AI yanıtı işlenemedi. Tekrar deneyin.');
      }
    } catch (err) {
      toast.error(err.message || 'AI isteği başarısız');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || loading}
      className={`inline-flex items-center gap-1.5 rounded-lg border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-bold text-violet-700 transition-colors hover:bg-violet-100 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {loading ? <Loader2 size={14} className="animate-spin" aria-hidden /> : <Sparkles size={14} aria-hidden />}
      {loading ? 'Üretiliyor…' : label}
    </button>
  );
}

export default AiAssistButton;
