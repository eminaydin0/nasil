import { runAiChat } from '../../server/ai/handler.js';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST gerekli' });
  }

  const { messages = [], pageContext = {} } = req.body || {};
  const { status, body } = await runAiChat({ messages, pageContext });
  return res.status(status).json(body);
}
