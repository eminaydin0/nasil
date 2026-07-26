import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Loader2,
  Mail,
  Phone,
  MapPin,
  Trash2,
  Check,
  MessageCircle,
  Eye,
  User,
  Calendar,
  Reply,
  ExternalLink,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import { useConfirm, TextField, Button, Modal, Avatar } from '../ui';
import { AdminToolbar, AdminFilterSelect, AdminSearchInput } from './adminUi';

const DEFAULT_CONTACT = {
  email: 'eminaydinyazilim@gmail.com',
  phone: '0553 882 76 46',
  address: 'İstanbul, Türkiye',
};

function ContactManager({ onUnreadChange }) {
  const confirm = useConfirm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState('messages');
  const [contactInfo, setContactInfo] = useState({ email: '', phone: '', address: '' });
  const [viewerMessageId, setViewerMessageId] = useState(null);
  const [search, setSearch] = useState('');

  /** Listede ve modalda her zaman güncel satır kullanılır */
  const viewerMessage = useMemo(
    () =>
      viewerMessageId == null ? null : messages.find((m) => m.id === viewerMessageId) ?? null,
    [messages, viewerMessageId]
  );

  /** Tam metni özetler — listede sığdırır */
  const previewMessage = (text, max = 140) => {
    const t = (text || '').trim();
    if (!t) return '—';
    return t.length > max ? `${t.slice(0, max)}…` : t;
  };

  const loadMessages = useCallback(async ({ quiet = false } = {}) => {
    if (!quiet) setMessagesLoading(true);
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      const list = data || [];
      setMessages(list);
      onUnreadChange?.(list.filter((m) => !m.is_read).length);
    } catch (error) {
      console.error('Error loading messages:', error);
      if (!quiet) toast.error('Mesajlar yüklenemedi');
      setMessages([]);
      onUnreadChange?.(0);
    } finally {
      setMessagesLoading(false);
    }
  }, [onUnreadChange]);

  const syncUnreadFromList = (list) => {
    onUnreadChange?.(list.filter((m) => !m.is_read).length);
  };

  const loadContent = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('content')
        .eq('section_key', 'contact_info')
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          setContactInfo(DEFAULT_CONTACT);
        } else {
          throw error;
        }
      } else {
        try {
          const parsed = JSON.parse(data.content);
          setContactInfo({
            email: parsed.email || '',
            phone: parsed.phone || '',
            address: parsed.address || '',
          });
        } catch (e) {
          console.error('Error parsing contact info:', e);
          setContactInfo({ email: '', phone: '', address: '' });
        }
      }
    } catch (error) {
      console.error('Error loading contact info:', error);
      toast.error('İletişim bilgileri yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadContent();
    loadMessages();

    const channel = supabase
      .channel('admin-contact-messages')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'contact_messages' },
        () => loadMessages({ quiet: true })
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadContent, loadMessages]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { error } = await supabase.from('site_content').upsert(
        {
          section_key: 'contact_info',
          title: 'İletişim Bilgileri',
          subtitle: 'Bize Ulaşın',
          content: JSON.stringify(contactInfo),
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'section_key' }
      );
      if (error) throw error;
      toast.success('İletişim bilgileri güncellendi');
    } catch (error) {
      console.error('Error saving contact info:', error);
      toast.error('Kaydedilirken hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  const markAsRead = async (id, isRead, silent = false) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ is_read: isRead })
        .eq('id', id);
      if (error) throw error;
      setMessages((prev) => {
        const next = prev.map((m) => (m.id === id ? { ...m, is_read: isRead } : m));
        syncUnreadFromList(next);
        return next;
      });
      if (!silent) {
        toast.success(isRead ? 'Okundu işaretlendi' : 'Okunmadı işaretlendi');
      }
    } catch (_err) {
      if (!silent) toast.error('Güncellenemedi');
    }
  };

  const openViewer = (msg) => {
    setViewerMessageId(msg?.id ?? null);
    if (msg && !msg.is_read) {
      markAsRead(msg.id, true, true);
    }
  };

  const deleteMessage = async (id) => {
    const ok = await confirm({
      type: 'danger',
      title: 'Mesajı sil',
      description: 'Bu mesaj kalıcı olarak silinecek. Bu işlem geri alınamaz.',
      confirmText: 'Evet, Sil',
      cancelText: 'Vazgeç',
    });
    if (!ok) return;
    try {
      const { error } = await supabase.from('contact_messages').delete().eq('id', id);
      if (error) throw error;
      setMessages((prev) => {
        const next = prev.filter((m) => m.id !== id);
        syncUnreadFromList(next);
        return next;
      });
      if (viewerMessageId === id) setViewerMessageId(null);
      toast.success('Mesaj silindi');
    } catch (_err) {
      toast.error('Silinemedi');
    }
  };

  /** Modal içinden sil */
  const deleteFromViewer = () => {
    if (viewerMessage) deleteMessage(viewerMessage.id);
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const replyMailHref = useMemo(() => {
    if (!viewerMessage) return '';
    return `mailto:${encodeURIComponent(viewerMessage.email)}?subject=${encodeURIComponent(
      `[Kuralı Ne?] Mesajınız — ${viewerMessage.name?.trim() || 'Ziyaretçi'}`
    )}&body=${encodeURIComponent(
      `\n\n--- Önceki ileti (${formatDate(viewerMessage.created_at)}) ---\n${viewerMessage.message || ''}`
    )}`;
  }, [viewerMessage]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-warm-200/60 bg-white shadow-soft">
        <Loader2 className="animate-spin text-orange-500" size={28} />
      </div>
    );
  }

  const unreadCount = messages.filter((m) => !m.is_read).length;
  const filteredMessages = messages.filter((m) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      m.name?.toLowerCase().includes(q) ||
      m.email?.toLowerCase().includes(q) ||
      m.subject?.toLowerCase().includes(q) ||
      m.message?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-5">
      <AdminToolbar
        search={
          activeSubTab === 'messages' ? (
            <AdminSearchInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="İsim, e-posta veya mesaj ile ara..."
            />
          ) : null
        }
        filters={
          <AdminFilterSelect
            value={activeSubTab}
            onChange={(e) => setActiveSubTab(e.target.value)}
            aria-label="İletişim sekmesi"
          >
            <option value="messages">
              Gelen Mesajlar{unreadCount > 0 ? ` (${unreadCount})` : ''}
            </option>
            <option value="info">Bilgileri Düzenle</option>
          </AdminFilterSelect>
        }
      />

      {/* Mesajlar */}
      {activeSubTab === 'messages' && (
        <div className="rounded-2xl border border-warm-200/60 bg-white p-5 shadow-soft sm:p-6">
          {messagesLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin text-orange-500" size={28} />
            </div>
          ) : messages.length === 0 ? (
            <div className="py-12 text-center">
              <MessageCircle size={32} className="mx-auto mb-2 text-warm-400" />
              <p className="text-sm font-semibold text-warm-700">Henüz mesaj bulunmuyor</p>
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="py-12 text-center">
              <MessageCircle size={32} className="mx-auto mb-2 text-warm-400" />
              <p className="text-sm font-semibold text-warm-700">Sonuç bulunamadı</p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-warm-400">
                Satıra veya görüntüle düğmesine tıklayın — tam metin yeni sekmeden yanıtlamayı da içerir.
              </p>
              {filteredMessages.map((msg) => (
                <div
                  key={msg.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => openViewer(msg)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      openViewer(msg);
                    }
                  }}
                  className={`cursor-pointer rounded-xl border p-4 text-left transition-colors ${
                    msg.is_read
                      ? 'border-warm-200/60 bg-cream-50 hover:border-orange-300/60 hover:bg-white'
                      : 'border-orange-200 bg-orange-50/60 hover:border-orange-400 hover:bg-orange-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <Avatar name={msg.name || '?'} size="sm" className="shrink-0" />
                        <span className="text-sm font-bold text-charcoal-900">{msg.name}</span>
                        <span className="truncate text-xs font-semibold text-warm-500">{msg.email}</span>
                        {!msg.is_read && (
                          <span className="rounded-md bg-orange-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                            Yeni
                          </span>
                        )}
                      </div>
                      <p className="line-clamp-2 text-sm leading-relaxed text-warm-700">
                        {previewMessage(msg.message)}
                      </p>
                      <p className="mt-2 flex items-center gap-1 text-[11px] font-medium text-warm-500">
                        <Calendar size={11} aria-hidden /> {formatDate(msg.created_at)}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col gap-1 sm:flex-row">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openViewer(msg);
                        }}
                        className="grid h-8 w-8 place-items-center rounded-lg bg-orange-500/15 text-orange-700 transition-colors hover:bg-orange-500/25"
                        title="Görüntüle"
                      >
                        <Eye size={16} aria-hidden />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(msg.id, !msg.is_read);
                        }}
                        className="grid h-8 w-8 place-items-center rounded-lg text-warm-600 transition-colors hover:bg-warm-100 hover:text-charcoal-900"
                        title={msg.is_read ? 'Okunmadı işaretle' : 'Okundu işaretle'}
                      >
                        <Check size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteMessage(msg.id);
                        }}
                        className="grid h-8 w-8 place-items-center rounded-lg text-rose-600 transition-colors hover:bg-rose-50"
                        title="Sil"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Bilgi düzenleme */}
      {activeSubTab === 'info' && (
        <div className="rounded-2xl border border-warm-200/60 bg-white p-5 shadow-soft sm:p-6">
          <h3 className="mb-5 font-display text-lg font-bold text-charcoal-900">
            Yayında görünen iletişim kutusu
          </h3>
          <form onSubmit={handleSave} className="space-y-5">
            <TextField
              label="E-posta"
              type="email"
              value={contactInfo.email}
              onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
              icon={Mail}
              tone="subtle"
              placeholder="iletisim@siteniz.com"
            />
            <TextField
              label="Telefon"
              type="text"
              value={contactInfo.phone}
              onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
              icon={Phone}
              tone="subtle"
              placeholder="05XX XXX XX XX"
            />
            <TextField
              as="textarea"
              label="Konum özeti"
              rows={3}
              value={contactInfo.address}
              onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
              icon={MapPin}
              tone="subtle"
              placeholder="İl, Türkiye"
              hint="/iletisim ve şema için tek satır yeter."
            />

            <div className="border-t border-warm-200/60 pt-4">
              <Button type="submit" size="md" loading={saving}>
                Kaydet ve canlı yayına al
              </Button>
            </div>
          </form>
        </div>
      )}

      <Modal
        open={Boolean(viewerMessage)}
        onClose={() => setViewerMessageId(null)}
        size="xl"
        icon={User}
        title={viewerMessage?.name || 'Ziyaretçi'}
        description={viewerMessage ? formatDate(viewerMessage.created_at) : ''}
        footer={
          viewerMessage ? (
            <>
              <Button variant="secondary" size="md" onClick={() => setViewerMessageId(null)}>
                Kapat
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={() => markAsRead(viewerMessage.id, !viewerMessage.is_read)}
              >
                {viewerMessage.is_read ? 'Okunmadı yap' : 'Okundu işaretle'}
              </Button>
              <Button size="md" href={replyMailHref} iconLeft={Reply}>
                Yanıtla
              </Button>
              <Button
                size="md"
                className="bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700"
                onClick={() => deleteFromViewer()}
              >
                Sil
              </Button>
            </>
          ) : null
        }
      >
        {viewerMessage && (
          <div className="space-y-5">
            <div className="flex flex-wrap gap-4 rounded-2xl border border-warm-200/70 bg-gradient-to-br from-orange-50/80 to-white p-4">
              <a
                href={`mailto:${viewerMessage.email}`}
                className="inline-flex flex-1 min-w-[12rem] items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-bold text-orange-700 shadow-soft ring-1 ring-warm-200 transition-colors hover:bg-orange-50"
              >
                <Mail size={16} className="shrink-0" aria-hidden /> {viewerMessage.email}
              </a>
              <a
                href={replyMailHref}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-orange-700 hover:text-orange-900"
              >
                <ExternalLink size={13} aria-hidden /> Posta kutusunda aç
              </a>
            </div>
            <div>
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-warm-500">
                Mesaj
              </p>
              <div className="max-h-[min(52vh,28rem)] overflow-y-auto whitespace-pre-wrap rounded-2xl border border-warm-200/70 bg-warm-50/60 p-5 text-[15px] leading-relaxed text-charcoal-900">
                {viewerMessage.message || '—'}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-warm-500">
              <span title="Kayıt benzersiz kodu">
                ID:{' '}
                <code className="rounded-md bg-warm-100 px-1.5 py-0.5 font-mono text-warm-800">
                  {String(viewerMessage.id).slice(0, 12)}
                  {(String(viewerMessage.id).length > 12 ? '…' : '')}
                </code>
              </span>
              <span>·</span>
              <span>{viewerMessage.is_read ? 'Okundu' : 'Okunmadı'} (otomatik güncellenir)</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default ContactManager;
