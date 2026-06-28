import { analyzeNewsSeo } from '../../lib/newsAlgorithm';

function NewsSeoPreview({ post }) {
  const analysis = analyzeNewsSeo(post);
  const title = post.seo_title || post.seoTitle || post.title || '';
  const description = post.seo_description || post.seoDescription || post.excerpt || '';
  const scoreColor =
    analysis.score >= 80 ? 'text-emerald-600 bg-emerald-50' : analysis.score >= 60 ? 'text-amber-600 bg-amber-50' : 'text-red-600 bg-red-50';

  return (
    <div className="rounded-xl border border-warm-200 bg-cream-50/80 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h4 className="text-sm font-bold text-warm-900">SEO Önizleme</h4>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-black ${scoreColor}`}>
          {analysis.score}/100
        </span>
      </div>

      <div className="rounded-lg border border-warm-200 bg-white p-3 shadow-sm">
        <p className="truncate text-[#1a0dab] text-base font-medium">{title || 'Başlık...'}</p>
        <p className="mt-0.5 text-xs text-[#006621]">kuraline.xyz › haberler › ...</p>
        <p className="mt-1 line-clamp-2 text-sm text-warm-600">
          {description || 'Meta açıklama burada görünür...'}
        </p>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-warm-600">
        <span>Başlık: {analysis.titleLength}/60</span>
        <span>Açıklama: {analysis.descriptionLength}/160</span>
      </div>

      {analysis.issues.length > 0 && (
        <ul className="mt-3 space-y-1 text-xs text-red-600">
          {analysis.issues.map((issue) => (
            <li key={issue}>• {issue}</li>
          ))}
        </ul>
      )}
      {analysis.suggestions.length > 0 && (
        <ul className="mt-2 space-y-1 text-xs text-amber-700">
          {analysis.suggestions.map((s) => (
            <li key={s}>• {s}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default NewsSeoPreview;
