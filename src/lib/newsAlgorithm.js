/**
 * Haber sıralama ve öneri algoritması
 *
 * Trend skoru (0–100):
 * - Öne çıkan: +25
 * - Güncellik: son 7 gün lineer azalır (max +35)
 * - Görüntülenme: log ölçek (max +25)
 * - Etiket/kategori yoğunluğu: +0–15 (içerik zenginliği)
 */

const MS_DAY = 86400000;

function daysSince(dateStr) {
  if (!dateStr) return 999;
  const diff = Date.now() - new Date(dateStr).getTime();
  return Math.max(0, diff / MS_DAY);
}

function recencyScore(publishedAt) {
  const days = daysSince(publishedAt);
  if (days <= 1) return 35;
  if (days <= 3) return 28;
  if (days <= 7) return 20;
  if (days <= 14) return 12;
  if (days <= 30) return 6;
  return 2;
}

function viewScore(viewCount = 0) {
  if (viewCount <= 0) return 0;
  return Math.min(25, Math.log10(viewCount + 1) * 10);
}

function richnessScore(post) {
  let score = 0;
  if (post.excerpt?.length > 80) score += 4;
  if (post.coverImage || post.cover_image) score += 5;
  if ((post.tags || []).length >= 2) score += 3;
  if ((post.readTimeMinutes || post.read_time_minutes || 0) >= 3) score += 3;
  return Math.min(15, score);
}

export function computeTrendScore(post) {
  const publishedAt = post.publishedAt || post.published_at || post.createdAt || post.created_at;
  let score = recencyScore(publishedAt) + viewScore(post.viewCount ?? post.view_count ?? 0);
  score += richnessScore(post);
  if (post.isFeatured || post.is_featured) score += 25;
  return Math.round(Math.min(100, score));
}

export function rankNewsPosts(posts, { sort = 'trending' } = {}) {
  const list = [...(posts || [])];

  if (sort === 'latest') {
    return list.sort(
      (a, b) =>
        new Date(b.publishedAt || b.createdAt).getTime() -
        new Date(a.publishedAt || a.createdAt).getTime()
    );
  }

  if (sort === 'popular') {
    return list.sort(
      (a, b) =>
        (b.viewCount ?? 0) - (a.viewCount ?? 0) ||
        new Date(b.publishedAt || b.createdAt).getTime() -
          new Date(a.publishedAt || a.createdAt).getTime()
    );
  }

  // trending (default)
  return list
    .map((p) => ({ ...p, trendScore: computeTrendScore(p) }))
    .sort(
      (a, b) =>
        b.trendScore - a.trendScore ||
        new Date(b.publishedAt || b.createdAt).getTime() -
          new Date(a.publishedAt || a.createdAt).getTime()
    );
}

export function getRelatedNewsPosts(current, allPosts, limit = 4) {
  if (!current || !allPosts?.length) return [];

  const currentTags = new Set(current.tags || []);
  const scored = allPosts
    .filter((p) => p.slug !== current.slug && p.id !== current.id)
    .map((post) => {
      let score = 0;
      if (post.category === current.category) score += 8;
      (post.tags || []).forEach((t) => {
        if (currentTags.has(t)) score += 4;
      });
      if (
        post.relatedGameId &&
        current.relatedGameId &&
        post.relatedGameId === current.relatedGameId
      ) {
        score += 10;
      }
      score += recencyScore(post.publishedAt || post.createdAt) / 5;
      score += viewScore(post.viewCount ?? 0) / 5;
      return { post, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);

  if (scored.length >= limit) return scored.slice(0, limit).map(({ post }) => post);

  const fallback = allPosts
    .filter((p) => p.slug !== current.slug)
    .sort(
      (a, b) =>
        new Date(b.publishedAt || b.createdAt).getTime() -
        new Date(a.publishedAt || a.createdAt).getTime()
    );

  const merged = [...scored.map(({ post }) => post)];
  fallback.forEach((p) => {
    if (merged.length >= limit) return;
    if (!merged.find((m) => m.id === p.id)) merged.push(p);
  });
  return merged.slice(0, limit);
}

export function pickFeaturedPost(posts) {
  const ranked = rankNewsPosts(posts, { sort: 'trending' });
  const featured = ranked.find((p) => p.isFeatured);
  return featured || ranked[0] || null;
}

export function analyzeNewsSeo(post) {
  const title = post.seoTitle || post.seo_title || post.title || '';
  const description =
    post.seoDescription || post.seo_description || post.excerpt || '';
  const issues = [];
  const suggestions = [];
  let score = 100;

  if (!title.trim()) {
    issues.push('Başlık eksik');
    score -= 30;
  } else if (title.length > 60) {
    suggestions.push('SEO başlığı 60 karakterden kısa olmalı');
    score -= 8;
  } else if (title.length < 30) {
    suggestions.push('SEO başlığını biraz uzatın (30–60 karakter ideal)');
    score -= 5;
  }

  if (!description.trim()) {
    issues.push('Meta açıklama eksik');
    score -= 25;
  } else if (description.length > 160) {
    suggestions.push('Meta açıklama 160 karakteri aşıyor');
    score -= 10;
  } else if (description.length < 70) {
    suggestions.push('Meta açıklamayı 70–160 karakter aralığına getirin');
    score -= 5;
  }

  if (!post.coverImage && !post.cover_image) {
    suggestions.push('Kapak görseli ekleyin (sosyal paylaşım için önemli)');
    score -= 10;
  }

  if (!(post.tags || []).length) {
    suggestions.push('En az 2–3 etiket ekleyin');
    score -= 5;
  }

  return {
    score: Math.max(0, score),
    issues,
    suggestions,
    titleLength: title.length,
    descriptionLength: description.length,
  };
}
