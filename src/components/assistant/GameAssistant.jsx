import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Bot, X, Send, Loader2, Sparkles, Trash2 } from 'lucide-react';
import { fetchChatAvailability, sendChatMessage } from '../../lib/ai/chatClient';

const STORAGE_KEY = 'kural_asistan_messages_v2';

const QUICK_PROMPTS = [
  'Okey nasıl oynanır?',
  '4 kişilik ev oyunu öner',
  'Pişti ile batak farkı ne?',
  '101 okey ceza puanları',
];

const WELCOME = {
  role: 'assistant',
  content:
    'Selam! Ben **Kural Asistanı**.\n\nKural, strateji, "ne oynayalım?" veya site araçları — ne sorarsan adım adım anlatırım. Aşağıdaki hızlı sorulardan birine de basabilirsin.',
};

const TOOL_PAGES = {
  '/araclar/okey-sayaci': 'Okey sayacı',
  '/araclar/101-yazboz': '101 okey yazboz',
  '/araclar/batak-yazboz': 'Batak yazboz',
  '/araclar/takim-olusturucu': 'Takım oluşturucu',
  '/araclar/halisaha-takim-olusturucu': 'Halı saha takım oluşturucu',
  '/araclar/karar-carki': 'Karar çarkı',
  '/araclar/kura-cek': 'Kura çekme',
  '/araclar/zar-at': 'Zar at',
  '/araclar/skor-tablosu': 'Skor tablosu',
};

function normalizeMessage(raw) {
  if (!raw || typeof raw.content !== 'string') return null;
  const content = raw.content.trim();
  if (!content) return null;
  return {
    role: raw.role === 'user' ? 'user' : 'assistant',
    content,
  };
}

function normalizeMessages(list) {
  if (!Array.isArray(list)) return [WELCOME];
  const normalized = list.map(normalizeMessage).filter(Boolean);
  return normalized.length ? normalized : [WELCOME];
}

function loadStoredMessages() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [WELCOME];
    return normalizeMessages(JSON.parse(raw));
  } catch {
    return [WELCOME];
  }
}

function renderMessageText(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-bold text-warm-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part.split('\n').map((line, j, arr) => (
      <span key={`${i}-${j}`}>
        {line}
        {j < arr.length - 1 ? <br /> : null}
      </span>
    ));
  });
}

function buildPageContext(pathname) {
  const ctx = { pathname };

  const gameMatch = pathname.match(/^\/oyun\/([^/]+)/);
  if (gameMatch) {
    ctx.gameSlug = decodeURIComponent(gameMatch[1]);
    const h1 = document.querySelector('main h1');
    if (h1?.textContent?.trim()) {
      ctx.gameName = h1.textContent.trim();
    }
  }

  const catMatch = pathname.match(/^\/kategori\/([^/]+)/);
  if (catMatch) ctx.category = decodeURIComponent(catMatch[1]);

  const toolName = TOOL_PAGES[pathname];
  if (toolName) ctx.toolName = toolName;

  return ctx;
}

function GameAssistant() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [available, setAvailable] = useState(false);
  const [messages, setMessages] = useState(loadStoredMessages);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const listRef = useRef(null);
  const inputRef = useRef(null);
  const messagesRef = useRef(messages);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    fetchChatAvailability()
      .then(setAvailable)
      .catch(() => setAvailable(false));
  }, []);

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-30)));
  }, [messages]);

  useEffect(() => {
    if (open && listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, open, loading]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const sendMessage = useCallback(
    async (text) => {
      const trimmed = String(text ?? '').trim();
      if (!trimmed || loading) return;

      const userMsg = { role: 'user', content: trimmed };
      const nextMessages = [...messagesRef.current, userMsg];
      const apiMessages = nextMessages.filter(
        (m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string'
      );

      messagesRef.current = nextMessages;
      setMessages(nextMessages);
      setInput('');
      setLoading(true);

      try {
        const { reply } = await sendChatMessage(apiMessages, buildPageContext(location.pathname));
        const withReply = [...nextMessages, { role: 'assistant', content: reply }];
        messagesRef.current = withReply;
        setMessages(withReply);
      } catch (err) {
        const withError = [
          ...nextMessages,
          {
            role: 'assistant',
            content: err.message || 'Şu an yanıt veremiyorum. Biraz sonra tekrar dene.',
          },
        ];
        messagesRef.current = withError;
        setMessages(withError);
      } finally {
        setLoading(false);
      }
    },
    [loading, location.pathname]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = inputRef.current?.value ?? input;
    sendMessage(text);
  };

  const clearChat = () => {
    messagesRef.current = [WELCOME];
    setMessages([WELCOME]);
    sessionStorage.removeItem(STORAGE_KEY);
  };

  if (!available) return null;

  return (
    <div className="game-assistant" aria-live="polite">
      {open && (
        <div
          className="game-assistant-panel"
          role="dialog"
          aria-label="Kural Asistanı sohbet"
        >
          <header className="game-assistant-header">
            <div className="flex items-center gap-2.5">
              <span className="game-assistant-avatar">
                <Bot size={20} aria-hidden />
              </span>
              <div>
                <p className="text-sm font-bold text-white">Kural Asistanı</p>
                <p className="text-[11px] text-orange-100/90">Oyun kuralları rehberin</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={clearChat}
                className="game-assistant-icon-btn"
                aria-label="Sohbeti temizle"
                title="Temizle"
              >
                <Trash2 size={16} />
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="game-assistant-icon-btn"
                aria-label="Asistanı kapat"
              >
                <X size={18} />
              </button>
            </div>
          </header>

          <div ref={listRef} className="game-assistant-messages">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`game-assistant-bubble ${
                  msg.role === 'user' ? 'game-assistant-bubble--user' : 'game-assistant-bubble--bot'
                }`}
              >
                {renderMessageText(msg.content)}
              </div>
            ))}
            {loading && (
              <div className="game-assistant-bubble game-assistant-bubble--bot game-assistant-typing">
                <Loader2 size={16} className="animate-spin" aria-hidden />
                <span>Düşünüyorum…</span>
              </div>
            )}
          </div>

          {messages.length <= 2 && (
            <div className="game-assistant-chips">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  className="game-assistant-chip"
                  onClick={() => sendMessage(prompt)}
                  disabled={loading}
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="game-assistant-form">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Oyun kuralı sor…"
              className="game-assistant-input"
              maxLength={900}
              disabled={loading}
              aria-label="Mesajınız"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="game-assistant-send"
              aria-label="Gönder"
            >
              <Send size={18} aria-hidden />
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`game-assistant-fab ${open ? 'game-assistant-fab--open' : ''}`}
        aria-expanded={open}
        aria-label={open ? 'Asistanı kapat' : 'Kural Asistanını aç'}
      >
        {open ? <X size={22} aria-hidden /> : <Sparkles size={22} aria-hidden />}
        {!open && <span className="game-assistant-fab-label">Sor</span>}
      </button>
    </div>
  );
}

export default GameAssistant;
