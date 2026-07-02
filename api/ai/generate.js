import { getAiHealthStatus, runAiGenerate } from '../../server/ai/handler.js';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST gerekli' });
  }

  const { task, payload = {} } = req.body || {};
  const { status, body } = await runAiGenerate({
    task,
    payload,
    adminSecretHeader: req.headers['x-admin-ai-secret'],
  });

  return res.status(status).json(body);
}
