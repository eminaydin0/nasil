import dotenv from 'dotenv';

dotenv.config();

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
    });
    req.on('end', () => {
      if (!raw) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error('Geçersiz JSON gövdesi'));
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

/** Vite dev — /api/ai/* uç noktalarını yerelde sunar (vercel dev gerekmez) */
export function localApiPlugin() {
  return {
    name: 'kuraline-local-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split('?')[0];

        if (url === '/api/ai/health' && req.method === 'GET') {
          try {
            const { getAiHealthStatus } = await import('./server/ai/handler.js');
            sendJson(res, 200, getAiHealthStatus());
          } catch (err) {
            sendJson(res, 500, { error: err.message || 'Health check failed' });
          }
          return;
        }

        if (url === '/api/ai/generate' && req.method === 'POST') {
          try {
            const { runAiGenerate } = await import('./server/ai/handler.js');
            const body = await readJsonBody(req);
            const { status, body: payload } = await runAiGenerate({
              task: body.task,
              payload: body.payload,
              adminSecretHeader: req.headers['x-admin-ai-secret'],
            });
            sendJson(res, status, payload);
          } catch (err) {
            sendJson(res, 500, { error: err.message || 'AI isteği başarısız' });
          }
          return;
        }

        if (url === '/api/ai/chat' && req.method === 'POST') {
          try {
            const { runAiChat } = await import('./server/ai/handler.js');
            const body = await readJsonBody(req);
            const { status, body: payload } = await runAiChat({
              messages: body.messages,
              pageContext: body.pageContext,
            });
            sendJson(res, status, payload);
          } catch (err) {
            sendJson(res, 500, { error: err.message || 'Chat isteği başarısız' });
          }
          return;
        }

        next();
      });
    },
  };
}
