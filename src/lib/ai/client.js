/**
 * Admin AI istemcisi — /api/ai/* uç noktalarına istek atar.
 * Gemini API key tarayıcıya GİTMEZ.
 */

const AI_SECRET = import.meta.env.VITE_ADMIN_AI_SECRET?.trim() || '';

function aiHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  if (AI_SECRET) headers['X-Admin-AI-Secret'] = AI_SECRET;
  return headers;
}

async function parseJsonResponse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || data.message || `AI isteği başarısız (${res.status})`);
  }
  return data;
}

/** Sunucuda Gemini yapılandırılmış mı? */
export async function fetchAiStatus() {
  const res = await fetch('/api/ai/health', { method: 'GET' });
  return parseJsonResponse(res);
}

/** Metin veya JSON üret */
export async function generateAiContent(task, payload = {}) {
  const res = await fetch('/api/ai/generate', {
    method: 'POST',
    headers: aiHeaders(),
    body: JSON.stringify({ task, payload }),
  });
  return parseJsonResponse(res);
}

export function isAdminAiSecretConfigured() {
  return Boolean(AI_SECRET);
}
