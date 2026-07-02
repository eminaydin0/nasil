/**
 * Kullanıcı chat asistanı — /api/ai/chat
 */

async function parseJsonResponse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || data.message || `Asistan yanıt veremedi (${res.status})`);
  }
  return data;
}

export async function sendChatMessage(messages, pageContext = {}) {
  const res = await fetch('/api/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, pageContext }),
  });
  return parseJsonResponse(res);
}

export async function fetchChatAvailability() {
  const res = await fetch('/api/ai/health', { method: 'GET' });
  const data = await parseJsonResponse(res);
  return Boolean(data.chatEnabled ?? data.configured);
}
