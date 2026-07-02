import { getAiHealthStatus } from '../../server/ai/handler.js';

export default function handler(_req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json(getAiHealthStatus());
}
