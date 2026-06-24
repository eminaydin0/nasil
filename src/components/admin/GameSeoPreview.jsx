import { useMemo } from 'react';
import { Search, AlertCircle, CheckCircle2, Sparkles, FileText, HelpCircle, Code2 } from 'lucide-react';
import { previewGameSeo } from '../../lib/seoEngine';
import { generateTitle, SITE_CONFIG } from '../../constants/seo';

function CharMeter({ label, value, idealMin, idealMax, max }) {
  const len = value?.length || 0;
  const ok = len >= idealMin && len <= idealMax;
  const warn = len > max;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-gray-600">{label}</span>
        <span className={`font-mono ${warn ? 'text-red-600' : ok ? 'text-green-600' : 'text-amber-600'}`}>
          {len}{max ? ` / ${max}` : ''}
        </span>
      </div>
      {value ? (
        <p className="text-sm text-gray-800 bg-white rounded-lg border border-gray-200 px-3 py-2 leading-snug">
          {value}
        </p>
      ) : (
        <p className="text-sm text-gray-400 italic">Henüz üretilemedi</p>
      )}
    </div>
  );
}

function ScoreBadge({ score, grade }) {
  const color =
    score >= 85 ? 'bg-green-100 text-green-800 border-green-200'
    : score >= 70 ? 'bg-blue-100 text-blue-800 border-blue-200'
    : score >= 50 ? 'bg-amber-100 text-amber-800 border-amber-200'
    : 'bg-red-100 text-red-800 border-red-200';

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-bold ${color}`}>
      <Sparkles size={14} />
      SEO: {score}/100 · {grade}
    </div>
  );
}

/**
 * Admin panel — form verisine göre canlı SEO önizlemesi
 */
export default function GameSeoPreview({ formData }) {
  const preview = useMemo(() => previewGameSeo(formData), [formData]);

  if (!formData?.name?.trim()) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center text-sm text-gray-500">
        Oyun adını girince SEO önizlemesi burada görünür.
      </div>
    );
  }

  const fullTitle = generateTitle(preview.meta?.title, true);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
          <Search size={16} className="text-orange-500" />
          Canlı SEO Önizleme
        </div>
        <ScoreBadge score={preview.score} grade={preview.grade} />
      </div>

      {/* Google snippet simülasyonu */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-1">
        <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">Google arama önizlemesi</p>
        <p className="text-[#1a0dab] text-lg font-medium leading-tight hover:underline cursor-default truncate">
          {fullTitle}
        </p>
        <p className="text-green-700 text-sm truncate">
          {SITE_CONFIG.url.replace('https://', '')} › oyun › {formData.slug || '…'}
        </p>
        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
          {preview.meta?.description}
        </p>
      </div>

      <CharMeter
        label="Sayfa başlığı (title tag)"
        value={preview.meta?.title}
        idealMin={20}
        idealMax={55}
        max={60}
      />

      <CharMeter
        label="Meta açıklama (description)"
        value={preview.meta?.description}
        idealMin={120}
        idealMax={160}
        max={160}
      />

      <div>
        <p className="text-xs font-medium text-gray-600 mb-1">Anahtar kelimeler (otomatik)</p>
        <p className="text-xs text-gray-500 bg-white rounded-lg border border-gray-200 px-3 py-2 line-clamp-3">
          {preview.meta?.keywords}
        </p>
      </div>

      {/* Schema & FAQ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-white rounded-lg border border-gray-200 p-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700 mb-2">
            <Code2 size={13} className="text-orange-500" />
            JSON-LD Schema ({preview.schemaTypes?.length || 0})
          </div>
          <div className="flex flex-wrap gap-1">
            {(preview.schemaTypes || []).map((type) => (
              <span key={type} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-100">
                {type}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700 mb-2">
            <HelpCircle size={13} className="text-orange-500" />
            FAQ ({preview.totalFaqCount} — admin + otomatik)
          </div>
          <p className="text-xs text-gray-500">
            {preview.totalFaqCount >= 3
              ? 'Featured snippet için yeterli SSS'
              : 'Daha fazla SSS ekleyin veya oyuncu/süre alanlarını doldurun'}
          </p>
        </div>
      </div>

      {(preview.faqs?.length > 0) && (
        <div className="space-y-2">
          <p className="text-xs font-bold text-gray-700 flex items-center gap-1">
            <FileText size={13} /> Örnek SSS (ilk {preview.faqs.length})
          </p>
          {preview.faqs.map((faq, i) => (
            <div key={i} className="text-xs bg-white rounded-lg border border-gray-100 px-3 py-2">
              <p className="font-semibold text-gray-800">{faq.question}</p>
              <p className="text-gray-500 mt-0.5 line-clamp-2">{faq.answer}</p>
              {faq.source === 'admin' && (
                <span className="inline-block mt-1 text-[10px] text-green-600 font-medium">Admin</span>
              )}
              {faq.source?.startsWith('auto') && (
                <span className="inline-block mt-1 text-[10px] text-blue-600 font-medium">Otomatik</span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Uyarılar & öneriler */}
      {(preview.issues?.length > 0 || preview.suggestions?.length > 0) && (
        <div className="space-y-2 pt-2 border-t border-orange-100">
          {preview.issues?.map((issue, i) => (
            <div key={`i-${i}`} className="flex items-start gap-2 text-xs text-red-700 bg-red-50 rounded-lg px-3 py-2">
              <AlertCircle size={14} className="shrink-0 mt-0.5" />
              {issue}
            </div>
          ))}
          {preview.suggestions?.map((s, i) => (
            <div key={`s-${i}`} className="flex items-start gap-2 text-xs text-amber-800 bg-amber-50 rounded-lg px-3 py-2">
              <CheckCircle2 size={14} className="shrink-0 mt-0.5" />
              {s}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
