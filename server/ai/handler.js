import { GoogleGenerativeAI } from '@google/generative-ai';
import { buildAdminPrompt, buildChatSystemInstruction } from '../../src/lib/ai/prompts.js';

const ALLOWED_TASKS = new Set(['game_content', 'game_seo', 'news_excerpt']);

const FALLBACK_MODELS = ['gemini-flash-latest', 'gemini-2.0-flash', 'gemini-2.5-flash'];

export function getDefaultModelName() {
  return process.env.GEMINI_MODEL?.trim() || 'gemini-flash-latest';
}

function getModelCandidates() {
  const primary = getDefaultModelName();
  const seen = new Set();
  const models = [];

  for (const model of [primary, ...FALLBACK_MODELS]) {
    if (model && !seen.has(model)) {
      seen.add(model);
      models.push(model);
    }
  }

  return models;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getErrorText(err) {
  return String(err?.message || err || '').toLowerCase();
}

function isRetryableAiError(err) {
  const msg = getErrorText(err);
  const status = err?.status || err?.statusCode;

  return (
    status === 429 ||
    status === 503 ||
    status === 500 ||
    msg.includes('503') ||
    msg.includes('429') ||
    msg.includes('high demand') ||
    msg.includes('overloaded') ||
    msg.includes('service unavailable') ||
    msg.includes('resource exhausted') ||
    msg.includes('temporarily unavailable') ||
    msg.includes('try again later')
  );
}

function isModelNotFoundError(err) {
  const msg = getErrorText(err);
  const status = err?.status || err?.statusCode;
  return status === 404 || msg.includes('not found') || msg.includes('404');
}

function shouldTryNextModel(err) {
  return isRetryableAiError(err) || isModelNotFoundError(err);
}

function formatAiError(err) {
  if (isRetryableAiError(err)) {
    return 'AI servisi şu an yoğun. Birkaç saniye bekleyip tekrar dene.';
  }

  if (isModelNotFoundError(err)) {
    return 'AI modeli şu an kullanılamıyor. Lütfen biraz sonra tekrar dene.';
  }

  const msg = getErrorText(err);
  if (msg.includes('api key') || msg.includes('permission') || msg.includes('401') || msg.includes('403')) {
    return 'AI yapılandırması hatalı. Site yöneticisine bildir.';
  }

  return 'Şu an yanıt veremiyorum. Lütfen tekrar dene.';
}

async function withAiRetry(fn, { retries = 2, baseDelayMs = 700 } = {}) {
  let lastErr;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (attempt >= retries || !isRetryableAiError(err)) {
        throw err;
      }
      await sleep(baseDelayMs * 2 ** attempt);
    }
  }

  throw lastErr;
}

async function runGeminiChat(apiKey, { modelName, systemInstruction, history, lastUser }) {
  return withAiRetry(async () => {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: modelName,
      systemInstruction,
    });
    const chat = model.startChat({ history });
    const result = await chat.sendMessage(lastUser);
    const reply = result.response.text()?.trim() || 'Üzgünüm, şu an cevap oluşturamadım.';
    return { text: reply, model: modelName };
  });
}

async function runGeminiGenerate(apiKey, { modelName, prompt }) {
  return withAiRetry(async () => {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent(prompt);
    return { text: result.response.text(), model: modelName };
  });
}

async function runWithModelFallback(apiKey, runner) {
  const models = getModelCandidates();
  let lastErr;

  for (const modelName of models) {
    try {
      return await runner(modelName);
    } catch (err) {
      lastErr = err;
      console.warn(`[AI] ${modelName} başarısız:`, err.message || err);
      if (!shouldTryNextModel(err)) {
        break;
      }
    }
  }

  throw lastErr;
}

function missingGeminiKeyMessage() {
  if (process.env.VERCEL) {
    return 'GEMINI_API_KEY Vercel\'de tanımlı değil. Project → Settings → Environment Variables → GEMINI_API_KEY ekleyip Production için Redeploy yapın.';
  }
  return 'GEMINI_API_KEY yapılandırılmamış. .env dosyasını kontrol edin ve dev server\'ı yeniden başlatın.';
}

function checkAdminSecret(headerValue) {
  const expected = process.env.ADMIN_AI_SECRET?.trim();
  if (!expected) return true;
  return headerValue === expected;
}

function buildPrompt(task, payload) {
  return buildAdminPrompt(task, payload);
}

function extractJson(text) {
  if (!text) return null;
  try {
    return JSON.parse(text.trim());
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
}

export function getAiHealthStatus() {
  return {
    configured: Boolean(process.env.GEMINI_API_KEY?.trim()),
    model: getDefaultModelName(),
    secretRequired: Boolean(process.env.ADMIN_AI_SECRET?.trim()),
    chatEnabled: Boolean(process.env.GEMINI_API_KEY?.trim()),
  };
}

/** @returns {{ status: number, body: object }} */
export async function runAiGenerate({ task, payload = {}, adminSecretHeader }) {
  if (!checkAdminSecret(adminSecretHeader)) {
    return { status: 401, body: { error: 'Yetkisiz AI isteği' } };
  }

  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    return {
      status: 503,
      body: {
        error: missingGeminiKeyMessage(),
      },
    };
  }

  if (!ALLOWED_TASKS.has(task)) {
    return { status: 400, body: { error: 'Geçersiz task' } };
  }

  try {
    const prompt = buildPrompt(task, payload);
    const { text, model: modelName } = await runWithModelFallback(apiKey, (model) =>
      runGeminiGenerate(apiKey, { modelName: model, prompt })
    );
    const parsed = extractJson(text);

    return {
      status: 200,
      body: {
        task,
        text,
        data: parsed,
        model: modelName,
      },
    };
  } catch (err) {
    console.error('[AI generate]', err);
    return {
      status: 500,
      body: { error: formatAiError(err) },
    };
  }
}

const MAX_CHAT_MESSAGES = 20;
const MAX_CHAT_CHARS = 900;

function sanitizeChatMessages(messages) {
  if (!Array.isArray(messages)) return [];
  return messages
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .map((m) => ({
      role: m.role,
      content: m.content.trim().slice(0, MAX_CHAT_CHARS),
    }))
    .filter((m) => m.content.length > 0)
    .slice(-MAX_CHAT_MESSAGES);
}

/** Kullanıcı chat asistanı @returns {{ status: number, body: object }} */
export async function runAiChat({ messages = [], pageContext = {} }) {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    return {
      status: 503,
      body: { error: missingGeminiKeyMessage() },
    };
  }

  let sanitized = sanitizeChatMessages(Array.isArray(messages) ? messages : []);
  while (sanitized.length > 0 && sanitized[0].role === 'assistant') {
    sanitized.shift();
  }
  if (sanitized.length === 0 || sanitized[sanitized.length - 1]?.role !== 'user') {
    return { status: 400, body: { error: 'Geçerli bir kullanıcı mesajı gerekli' } };
  }

  const systemInstruction = buildChatSystemInstruction(pageContext);

  try {
    const history = sanitized.slice(0, -1).map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const lastUser = sanitized[sanitized.length - 1].content;
    const { text: reply, model: modelName } = await runWithModelFallback(apiKey, (model) =>
      runGeminiChat(apiKey, {
        modelName: model,
        systemInstruction,
        history,
        lastUser,
      })
    );

    return {
      status: 200,
      body: {
        reply,
        model: modelName,
      },
    };
  } catch (err) {
    console.error('[AI chat]', err);
    return {
      status: 500,
      body: { error: formatAiError(err) },
    };
  }
}
