import { useMemo, useState } from 'react';
import {
  Users,
  Monitor,
  Smartphone,
  Tablet,
  ExternalLink,
  Search,
  MessageCircle,
  Gamepad2,
  ChevronDown,
  ChevronUp,
  UserRound,
} from 'lucide-react';
import { resolvePageLabel } from '../../../utils/analytics';

const SOURCE_LABELS = {
  direct: 'Doğrudan',
  search: 'Arama',
  social: 'Sosyal',
  referral: 'Referral',
};

const DEVICE_ICON = {
  desktop: Monitor,
  mobile: Smartphone,
  tablet: Tablet,
};

function formatWhen(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('tr-TR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatDuration(sec) {
  const s = Number(sec) || 0;
  if (s < 60) return `${s}sn`;
  const m = Math.floor(s / 60);
  const r = s % 60;
  return r ? `${m}dk ${r}sn` : `${m}dk`;
}

function shortSessionId(id = '') {
  if (!id) return '—';
  if (id.length <= 14) return id;
  return `${id.slice(0, 8)}…${id.slice(-4)}`;
}

function hostFromReferrer(referrer) {
  if (!referrer || referrer === 'direct') return 'direct';
  try {
    return new URL(referrer).hostname.replace(/^www\./, '');
  } catch {
    return referrer;
  }
}

function SessionRow({ session, games, expanded, onToggle }) {
  const DeviceIcon = DEVICE_ICON[session.device] || Monitor;
  const who = session.userEmail || (session.userId ? `Üye ${session.userId.slice(0, 8)}` : 'Anonim ziyaretçi');
  const fromHost = hostFromReferrer(session.referrer);

  return (
    <div className="border-b border-warm-100 last:border-0">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start gap-3 px-3 py-3 text-left transition-colors hover:bg-cream-50 sm:px-4"
      >
        <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-warm-100 text-warm-700">
          {session.userId ? <UserRound size={16} /> : <Users size={16} />}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-bold text-charcoal-900">{who}</span>
            {session.bounced && (
              <span className="rounded-md bg-rose-50 px-1.5 py-0.5 text-[10px] font-bold uppercase text-rose-600">
                Bounce
              </span>
            )}
            <span className="rounded-md bg-cream-100 px-1.5 py-0.5 text-[10px] font-semibold text-warm-600">
              {SOURCE_LABELS[session.source] || session.source}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-warm-500">
            {formatWhen(session.startedAt)} · {shortSessionId(session.id)}
          </p>
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-warm-600">
            <span className="inline-flex items-center gap-1">
              <ExternalLink size={11} />
              {fromHost}
            </span>
            <span className="inline-flex items-center gap-1">
              <DeviceIcon size={11} />
              {session.device}
            </span>
            <span>
              Giriş: {resolvePageLabel(session.landingPage || '/', games)}
            </span>
            <span>{session.pageViews} sayfa</span>
            <span>{formatDuration(session.duration)}</span>
          </div>
        </div>

        <span className="mt-1 text-warm-400">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </button>

      {expanded && (
        <div className="space-y-3 bg-cream-50/70 px-4 pb-4 pt-1 sm:px-5">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <div className="rounded-xl border border-warm-200/60 bg-white p-3">
              <p className="text-[10px] font-bold uppercase text-warm-500">Sayfa</p>
              <p className="text-lg font-bold tabular-nums">{session.pageViews}</p>
            </div>
            <div className="rounded-xl border border-warm-200/60 bg-white p-3">
              <p className="text-[10px] font-bold uppercase text-warm-500 flex items-center gap-1">
                <Gamepad2 size={10} /> Oyun
              </p>
              <p className="text-lg font-bold tabular-nums">{session.gameViews}</p>
            </div>
            <div className="rounded-xl border border-warm-200/60 bg-white p-3">
              <p className="text-[10px] font-bold uppercase text-warm-500 flex items-center gap-1">
                <Search size={10} /> Arama
              </p>
              <p className="text-lg font-bold tabular-nums">{session.searches}</p>
            </div>
            <div className="rounded-xl border border-warm-200/60 bg-white p-3">
              <p className="text-[10px] font-bold uppercase text-warm-500 flex items-center gap-1">
                <MessageCircle size={10} /> Yorum
              </p>
              <p className="text-lg font-bold tabular-nums">{session.comments}</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-warm-200/60 bg-white p-3 text-xs">
              <p className="font-bold text-charcoal-900">Kaynak detayı</p>
              <p className="mt-1 text-warm-600">Referrer: {session.referrer || 'direct'}</p>
              {session.utmSource && (
                <p className="mt-0.5 text-warm-600">UTM: {session.utmSource}</p>
              )}
              <p className="mt-0.5 text-warm-600">
                Çıkış: {resolvePageLabel(session.exitPage || session.landingPage || '/', games)}
              </p>
              <p className="mt-0.5 text-warm-600">Son aktivite: {formatWhen(session.lastAt)}</p>
            </div>
            <div className="rounded-xl border border-warm-200/60 bg-white p-3 text-xs">
              <p className="font-bold text-charcoal-900">Gezilen sayfalar</p>
              {session.pages?.length ? (
                <ul className="mt-1 max-h-28 space-y-0.5 overflow-y-auto text-warm-600">
                  {session.pages.map((p) => (
                    <li key={p} className="truncate">
                      {resolvePageLabel(p, games)}
                      <span className="text-warm-400"> · {p}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-1 text-warm-500">Sayfa kaydı yok</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AnalyticsVisitorsSection({ sessions, games = [] }) {
  const [expandedId, setExpandedId] = useState(null);
  const [filter, setFilter] = useState('all');

  const filtered = useMemo(() => {
    const list = sessions || [];
    if (filter === 'members') return list.filter((s) => s.userId);
    if (filter === 'bounce') return list.filter((s) => s.bounced);
    if (filter === 'engaged') return list.filter((s) => !s.bounced && s.pageViews >= 2);
    return list;
  }, [sessions, filter]);

  const summary = useMemo(() => {
    const list = sessions || [];
    return {
      total: list.length,
      members: list.filter((s) => s.userId).length,
      bounce: list.filter((s) => s.bounced).length,
      fromSearch: list.filter((s) => s.source === 'search').length,
    };
  }, [sessions]);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-2xl border border-warm-200/60 bg-white p-4 shadow-soft">
          <p className="text-[10px] font-bold uppercase text-warm-500">Listelenen oturum</p>
          <p className="mt-1 text-2xl font-bold tabular-nums">{summary.total}</p>
        </div>
        <div className="rounded-2xl border border-warm-200/60 bg-white p-4 shadow-soft">
          <p className="text-[10px] font-bold uppercase text-warm-500">Üye girişi</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-blue-700">{summary.members}</p>
        </div>
        <div className="rounded-2xl border border-warm-200/60 bg-white p-4 shadow-soft">
          <p className="text-[10px] font-bold uppercase text-warm-500">Bounce</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-rose-600">{summary.bounce}</p>
        </div>
        <div className="rounded-2xl border border-warm-200/60 bg-white p-4 shadow-soft">
          <p className="text-[10px] font-bold uppercase text-warm-500">Aramadan</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-emerald-700">{summary.fromSearch}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-warm-200/60 bg-white shadow-soft">
        <div className="flex flex-col gap-3 border-b border-warm-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div>
            <h3 className="flex items-center gap-2 text-base font-bold text-charcoal-900">
              <Users size={18} className="text-orange-600" />
              Kim girdi?
            </h3>
            <p className="mt-0.5 text-xs text-warm-500">
              Oturum bazlı: nereden geldi, ne gezdi, ne kadar kaldı
            </p>
          </div>
          <div className="inline-flex flex-wrap gap-1 rounded-xl border border-warm-200 bg-cream-50 p-1">
            {[
              { id: 'all', label: 'Tümü' },
              { id: 'members', label: 'Üyeler' },
              { id: 'engaged', label: 'Etkileşimli' },
              { id: 'bounce', label: 'Bounce' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={`rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition-all ${
                  filter === f.id
                    ? 'bg-white text-charcoal-900 shadow-soft'
                    : 'text-warm-500 hover:text-charcoal-900'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {filtered.length ? (
          <div>
            {filtered.map((session) => (
              <SessionRow
                key={session.id}
                session={session}
                games={games}
                expanded={expandedId === session.id}
                onToggle={() => setExpandedId((id) => (id === session.id ? null : session.id))}
              />
            ))}
          </div>
        ) : (
          <p className="py-12 text-center text-sm text-warm-500">Bu filtrede oturum yok</p>
        )}
      </div>
    </div>
  );
}
