import { useState, useEffect, useMemo } from 'react';
import {
  Star,
  ThumbsUp,
  ArrowRight,
  Loader2,
  Clock,
  PieChart,
  Gamepad2,
  Mail,
  MessageCircle,
  Inbox,
  Newspaper,
  Eye,
  Smile,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import AdminStats from '../AdminStats';
import TopGames from '../TopGames';
import { Donut } from '../charts';
import { fetchNewsDashboardStats } from '../NewsEngagementManager';

const CATEGORY_PALETTE = [
  '#f97316', // orange
  '#3b82f6', // blue
  '#a855f7', // purple
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#ef4444', // red
];

function SectionCard({ icon: Icon, title, subtitle, action, children, className = '' }) {
  return (
    <section
      className={`rounded-2xl border border-warm-200/60 bg-white p-5 shadow-soft sm:p-6 ${className}`}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="flex items-center gap-2 text-base font-bold text-charcoal-900 sm:text-lg">
            {Icon && <Icon size={18} className="text-orange-600" />}
            {title}
          </h3>
          {subtitle && <p className="mt-0.5 text-xs text-warm-500">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function EmptyState({ icon: Icon, title, hint }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <div className="mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-warm-100 text-warm-400">
        <Icon size={22} />
      </div>
      <p className="text-sm font-semibold text-warm-700">{title}</p>
      {hint && <p className="mt-1 text-xs text-warm-500">{hint}</p>}
    </div>
  );
}

export default function AdminDashboardTab({ stats, sortedGames, games, onTabChange }) {
  const [recentComments, setRecentComments] = useState([]);
  const [topLikedComments, setTopLikedComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [contactMessages, setContactMessages] = useState([]);
  const [contactLoading, setContactLoading] = useState(true);
  const [unreadContactCount, setUnreadContactCount] = useState(0);
  const [newsStats, setNewsStats] = useState(null);
  const [newsLoading, setNewsLoading] = useState(true);

  // Kategori dagilim verisi (donut)
  const categoryData = useMemo(() => {
    const dist = (games || []).reduce((acc, g) => {
      const cat = g.category || 'Diğer';
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(dist)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([label, value], i) => ({
        label,
        value,
        color: CATEGORY_PALETTE[i % CATEGORY_PALETTE.length],
      }));
  }, [games]);

  useEffect(() => {
    const loadComments = async () => {
      setCommentsLoading(true);
      try {
        const { data, error } = await supabase
          .from('comments')
          .select('id, author_name, content, rating, likes, created_at, game_id')
          .order('created_at', { ascending: false });

        if (error) throw error;

        const gamesMap = (games || []).reduce((acc, g) => {
          acc[g.id] = g.name;
          return acc;
        }, {});

        const formatted = (data || []).map((c) => ({
          id: c.id,
          name: c.author_name,
          comment: c.content?.substring(0, 80) + (c.content?.length > 80 ? '...' : ''),
          rating: c.rating,
          likes: c.likes || 0,
          gameName: gamesMap[c.game_id] || 'Bilinmeyen',
          date: new Date(c.created_at).toLocaleDateString('tr-TR'),
        }));

        setRecentComments(formatted.slice(0, 5));
        setTopLikedComments([...formatted].sort((a, b) => b.likes - a.likes).slice(0, 5));
      } catch (err) {
        console.error('Error loading comments:', err);
      } finally {
        setCommentsLoading(false);
      }
    };
    loadComments();
  }, [games]);

  useEffect(() => {
    const loadContactMessages = async () => {
      setContactLoading(true);
      try {
        const [messagesRes, unreadRes] = await Promise.all([
          supabase
            .from('contact_messages')
            .select('id, name, email, message, is_read, created_at')
            .order('created_at', { ascending: false })
            .limit(5),
          supabase.from('contact_messages').select('id', { count: 'exact', head: true }).eq('is_read', false),
        ]);

        if (messagesRes.error) throw messagesRes.error;
        setContactMessages(
          (messagesRes.data || []).map((m) => ({
            id: m.id,
            name: m.name,
            email: m.email,
            message: m.message?.substring(0, 60) + (m.message?.length > 60 ? '...' : ''),
            isRead: m.is_read,
            date: new Date(m.created_at).toLocaleDateString('tr-TR'),
          }))
        );
        setUnreadContactCount(unreadRes.count || 0);
      } catch (err) {
        console.error('Error loading contact messages:', err);
      } finally {
        setContactLoading(false);
      }
    };
    loadContactMessages();
  }, []);

  useEffect(() => {
    const loadNews = async () => {
      setNewsLoading(true);
      const data = await fetchNewsDashboardStats();
      setNewsStats(data);
      setNewsLoading(false);
    };
    loadNews();
  }, []);

  const lastGames = useMemo(
    () => [...(sortedGames || [])].sort((a, b) => (b.id || 0) - (a.id || 0)).slice(0, 6),
    [sortedGames]
  );

  return (
    <div className="space-y-6 sm:space-y-7">
      {/* Welcome Banner */}
      <div className="rounded-2xl border border-warm-200/60 bg-white p-5 shadow-soft sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-charcoal-900 sm:text-2xl">
              Hoş geldin 👋
            </h2>
            <p className="mt-1 text-sm text-warm-500">
              Sitenin genel sağlığına ve son etkileşimlere hızlıca göz atabilirsin.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onTabChange?.('games')}
              className="inline-flex items-center gap-1.5 rounded-xl bg-charcoal-900 px-4 py-2.5 text-sm font-semibold text-cream-50 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:bg-charcoal-800"
            >
              <Gamepad2 size={16} />
              Oyunları Yönet
            </button>
            <button
              type="button"
              onClick={() => onTabChange?.('news')}
              className="inline-flex items-center gap-1.5 rounded-xl border border-warm-200 bg-cream-50 px-4 py-2.5 text-sm font-semibold text-warm-800 transition-all hover:bg-warm-100"
            >
              <Newspaper size={16} />
              Haberler
            </button>
            <button
              type="button"
              onClick={() => onTabChange?.('analytics')}
              className="inline-flex items-center gap-1.5 rounded-xl border border-warm-200 bg-cream-50 px-4 py-2.5 text-sm font-semibold text-warm-800 transition-all hover:bg-warm-100"
            >
              Analitiği Aç
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      <AdminStats stats={stats} />

      {/* Haberler özeti */}
      <SectionCard
        icon={Newspaper}
        title="Haberler"
        subtitle="İçerik ve etkileşim özeti"
        action={
          <button
            type="button"
            onClick={() => onTabChange?.('news')}
            className="text-xs font-semibold text-orange-600 hover:text-orange-700"
          >
            Yönet →
          </button>
        }
      >
        {newsLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 size={22} className="animate-spin text-orange-500" />
          </div>
        ) : !newsStats ? (
          <EmptyState icon={Newspaper} title="Haber verisi yüklenemedi" />
        ) : (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              {[
                { label: 'Toplam', value: newsStats.total },
                { label: 'Yayında', value: newsStats.published },
                { label: 'Taslak', value: newsStats.drafts },
                { label: 'Öne çıkan', value: newsStats.featured },
                { label: 'Yorum', value: newsStats.commentCount },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-warm-200/60 bg-cream-50 px-3 py-2.5 text-center"
                >
                  <p className="text-[10px] font-bold uppercase tracking-wide text-warm-500">
                    {item.label}
                  </p>
                  <p className="text-xl font-black text-charcoal-900">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 text-sm text-warm-600">
              <Eye size={16} className="text-orange-500" />
              <span>
                Toplam{' '}
                <strong className="text-charcoal-900">
                  {newsStats.totalViews.toLocaleString('tr-TR')}
                </strong>{' '}
                haber görüntülenmesi
              </span>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-warm-500">
                  En çok okunan
                </p>
                {newsStats.topPosts.length === 0 ? (
                  <p className="text-sm text-warm-500">Henüz yayınlanmış haber yok</p>
                ) : (
                  <ul className="space-y-2">
                    {newsStats.topPosts.map((post, i) => (
                      <li
                        key={post.id}
                        className="flex items-center gap-3 rounded-xl border border-warm-200/60 bg-cream-50 px-3 py-2"
                      >
                        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-orange-100 text-xs font-black text-orange-700">
                          {i + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold text-charcoal-900">
                            {post.title}
                          </p>
                          <p className="text-[11px] text-warm-500">
                            {(post.view_count || 0).toLocaleString('tr-TR')} görüntülenme
                          </p>
                        </div>
                        <Link
                          to={`/haberler/${post.slug}`}
                          target="_blank"
                          className="shrink-0 text-xs font-bold text-orange-600 hover:underline"
                        >
                          Aç
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wide text-warm-500">
                    Son haber yorumları
                  </p>
                  <button
                    type="button"
                    onClick={() => onTabChange?.('news-engagement')}
                    className="text-xs font-semibold text-orange-600 hover:text-orange-700"
                  >
                    Moderasyon →
                  </button>
                </div>
                {newsStats.recentComments.length === 0 ? (
                  <EmptyState icon={Smile} title="Henüz haber yorumu yok" hint="Yorumlar burada görünür" />
                ) : (
                  <div className="space-y-2">
                    {newsStats.recentComments.map((c) => (
                      <div
                        key={c.id}
                        className="rounded-xl border border-warm-200/60 bg-cream-50 p-3"
                      >
                        <div className="mb-1 flex items-start justify-between gap-2">
                          <span className="text-sm font-bold text-charcoal-900">{c.name}</span>
                          <span className="text-[11px] text-warm-500">{c.date}</span>
                        </div>
                        <p className="line-clamp-2 text-xs text-warm-600">{c.content}</p>
                        <span className="mt-2 inline-block rounded-md bg-orange-100 px-1.5 py-0.5 text-[11px] font-semibold text-orange-700">
                          {c.postTitle}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </SectionCard>

      {/* Top Oyunlar + Kategori Donut */}
      <div className="grid gap-5 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <TopGames sortedGames={sortedGames} onTabChange={onTabChange} />
        </div>

        <SectionCard
          icon={PieChart}
          title="Kategori Dağılımı"
          subtitle="İçerik portföyü"
          className="lg:col-span-4"
          action={
            games?.length > 0 && (
              <button
                type="button"
                onClick={() => onTabChange?.('categories')}
                className="text-xs font-semibold text-orange-600 hover:text-orange-700"
              >
                Yönet →
              </button>
            )
          }
        >
          {categoryData.length === 0 ? (
            <EmptyState icon={PieChart} title="Henüz kategori yok" hint="Önce oyun ekleyin." />
          ) : (
            <Donut
              data={categoryData}
              size={170}
              thickness={20}
              centerLabel="Oyun"
              centerValue={(games || []).length}
            />
          )}
        </SectionCard>
      </div>

      {/* Yorumlar + Mesajlar */}
      <div className="grid gap-5 lg:grid-cols-3">
        <SectionCard
          icon={Clock}
          title="Son Yorumlar"
          subtitle="En yeni 5 yorum"
          action={
            <button
              type="button"
              onClick={() => onTabChange?.('comments')}
              className="text-xs font-semibold text-orange-600 hover:text-orange-700"
            >
              Tümü →
            </button>
          }
        >
          {commentsLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 size={22} className="animate-spin text-orange-500" />
            </div>
          ) : recentComments.length === 0 ? (
            <EmptyState icon={MessageCircle} title="Henüz yorum yok" />
          ) : (
            <div className="space-y-2.5">
              {recentComments.map((c) => (
                <div
                  key={c.id}
                  className="rounded-xl border border-warm-200/60 bg-cream-50 p-3 transition-colors hover:border-orange-200 hover:bg-orange-50/40"
                >
                  <div className="mb-1 flex items-start justify-between gap-2">
                    <span className="truncate text-sm font-bold text-charcoal-900">
                      {c.name}
                    </span>
                    <span className="shrink-0 text-[11px] font-medium text-warm-500">
                      {c.date}
                    </span>
                  </div>
                  <p className="line-clamp-2 text-xs text-warm-600">{c.comment}</p>
                  <div className="mt-2 flex items-center gap-2 text-[11px]">
                    <span className="rounded-md bg-orange-100 px-1.5 py-0.5 font-semibold text-orange-700">
                      {c.gameName}
                    </span>
                    <span className="inline-flex items-center gap-0.5 font-semibold text-amber-600">
                      <Star size={11} className="fill-amber-500" />
                      {c.rating}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard
          icon={ThumbsUp}
          title="En Beğenilenler"
          subtitle="Topluluk favorileri"
          action={
            <button
              type="button"
              onClick={() => onTabChange?.('comments')}
              className="text-xs font-semibold text-orange-600 hover:text-orange-700"
            >
              Tümü →
            </button>
          }
        >
          {commentsLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 size={22} className="animate-spin text-orange-500" />
            </div>
          ) : topLikedComments.filter((c) => c.likes > 0).length === 0 ? (
            <EmptyState icon={ThumbsUp} title="Henüz beğeni yok" />
          ) : (
            <div className="space-y-2.5">
              {topLikedComments
                .filter((c) => c.likes > 0)
                .slice(0, 5)
                .map((c) => (
                  <div
                    key={c.id}
                    className="rounded-xl border border-warm-200/60 bg-cream-50 p-3 transition-colors hover:border-emerald-200 hover:bg-emerald-50/40"
                  >
                    <div className="mb-1 flex items-start justify-between gap-2">
                      <span className="truncate text-sm font-bold text-charcoal-900">
                        {c.name}
                      </span>
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-emerald-100 px-1.5 py-0.5 text-[11px] font-bold text-emerald-700">
                        <ThumbsUp size={11} />
                        {c.likes}
                      </span>
                    </div>
                    <p className="line-clamp-2 text-xs text-warm-600">{c.comment}</p>
                    <span className="mt-2 inline-block rounded-md bg-orange-100 px-1.5 py-0.5 text-[11px] font-semibold text-orange-700">
                      {c.gameName}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </SectionCard>

        <SectionCard
          icon={Mail}
          title="Gelen Mesajlar"
          subtitle={
            unreadContactCount > 0 ? `${unreadContactCount} okunmamış` : 'Tüm kutu okundu'
          }
          action={
            <button
              type="button"
              onClick={() => onTabChange?.('contact')}
              className="text-xs font-semibold text-orange-600 hover:text-orange-700"
            >
              Tümü →
            </button>
          }
        >
          {contactLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 size={22} className="animate-spin text-orange-500" />
            </div>
          ) : contactMessages.length === 0 ? (
            <EmptyState icon={Inbox} title="Henüz mesaj yok" />
          ) : (
            <div className="space-y-2.5">
              {contactMessages.map((m) => (
                <div
                  key={m.id}
                  className={`rounded-xl border p-3 transition-colors ${
                    m.isRead
                      ? 'border-warm-200/60 bg-cream-50 hover:border-warm-300'
                      : 'border-orange-200 bg-orange-50/60 hover:border-orange-300'
                  }`}
                >
                  <div className="mb-1 flex items-start justify-between gap-2">
                    <span className="truncate text-sm font-bold text-charcoal-900">
                      {m.name}
                    </span>
                    <span className="shrink-0 text-[11px] font-medium text-warm-500">
                      {m.date}
                    </span>
                  </div>
                  <p className="line-clamp-2 text-xs text-warm-600">{m.message}</p>
                  <a
                    href={`mailto:${m.email}`}
                    className="mt-2 block truncate text-[11px] font-semibold text-orange-600 hover:underline"
                  >
                    {m.email}
                  </a>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>

      {/* Son Eklenen Oyunlar */}
      {lastGames.length > 0 && (
        <SectionCard
          icon={Gamepad2}
          title="Son Eklenen Oyunlar"
          subtitle="Yeni içerikler"
          action={
            <button
              type="button"
              onClick={() => onTabChange?.('games')}
              className="text-xs font-semibold text-orange-600 hover:text-orange-700"
            >
              Tümü →
            </button>
          }
        >
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {lastGames.map((game) => (
              <button
                key={game.id}
                type="button"
                onClick={() => onTabChange?.('games')}
                className="group flex flex-col overflow-hidden rounded-xl border border-warm-200/60 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-soft-md"
              >
                <div className="aspect-[16/10] overflow-hidden bg-warm-100">
                  <img
                    src={game.image}
                    alt={game.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-2.5">
                  <div className="truncate text-sm font-bold text-charcoal-900">
                    {game.name}
                  </div>
                  <div className="mt-0.5 truncate text-[11px] font-medium text-warm-500">
                    {game.category}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </SectionCard>
      )}
    </div>
  );
}
