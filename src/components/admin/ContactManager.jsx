import { useState, useEffect, useCallback } from 'react';
import {
  Save,
  Loader2,
  Mail,
  Phone,
  MapPin,
  Inbox,
  Trash2,
  Check,
  MessageCircle,
  Settings,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import { useConfirm } from '../ui';

const DEFAULT_CONTACT = {
  email: 'eminaydinyazilim@gmail.com',
  phone: '0553 882 76 46',
  address: 'İstanbul, Türkiye',
};

function ContactManager() {
  const confirm = useConfirm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState('messages');
  const [contactInfo, setContactInfo] = useState({ email: '', phone: '', address: '' });

  const loadMessages = useCallback(async () => {
    setMessagesLoading(true);
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error('Mesajlar yüklenemedi');
      setMessages([]);
    } finally {
      setMessagesLoading(false);
    }
  }, []);

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

  const markAsRead = async (id, isRead) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ is_read: isRead })
        .eq('id', id);
      if (error) throw error;
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, is_read: isRead } : m)));
      toast.success(isRead ? 'Okundu işaretlendi' : 'Okunmadı işaretlendi');
    } catch (_err) {
      toast.error('Güncellenemedi');
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
      setMessages((prev) => prev.filter((m) => m.id !== id));
      toast.success('Mesaj silindi');
    } catch (_err) {
      toast.error('Silinemedi');
    }
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

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-warm-200/60 bg-white shadow-soft">
        <Loader2 className="animate-spin text-orange-500" size={28} />
      </div>
    );
  }

  const unreadCount = messages.filter((m) => !m.is_read).length;

  return (
    <div className="space-y-5">
      {/* Üst bar */}
      <div className="rounded-2xl border border-warm-200/60 bg-white p-5 shadow-soft sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight text-charcoal-900">
              <Mail size={20} className="text-orange-600" />
              İletişim
            </h2>
            <p className="mt-0.5 text-sm text-warm-500">
              {messages.length} mesaj · {unreadCount} okunmamış
            </p>
          </div>
        </div>

        <div className="mt-5 inline-flex rounded-xl border border-warm-200 bg-cream-50 p-1">
          <button
            type="button"
            onClick={() => setActiveSubTab('messages')}
            className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3.5 py-2 text-sm font-semibold transition-all ${
              activeSubTab === 'messages'
                ? 'bg-white text-charcoal-900 shadow-soft'
                : 'text-warm-500 hover:text-charcoal-900'
            }`}
          >
            <Inbox size={15} />
            Gelen Mesajlar
            {unreadCount > 0 && (
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-orange-500 px-1.5 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('info')}
            className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3.5 py-2 text-sm font-semibold transition-all ${
              activeSubTab === 'info'
                ? 'bg-white text-charcoal-900 shadow-soft'
                : 'text-warm-500 hover:text-charcoal-900'
            }`}
          >
            <Settings size={15} />
            Bilgileri Düzenle
          </button>
        </div>
      </div>

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
          ) : (
            <div className="space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`rounded-xl border p-4 transition-colors ${
                    msg.is_read
                      ? 'border-warm-200/60 bg-cream-50 hover:border-warm-300'
                      : 'border-orange-200 bg-orange-50/60 hover:border-orange-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="text-sm font-bold text-charcoal-900">{msg.name}</span>
                        <a
                          href={`mailto:${msg.email}`}
                          className="truncate text-xs font-semibold text-orange-600 hover:underline"
                        >
                          {msg.email}
                        </a>
                        {!msg.is_read && (
                          <span className="rounded-md bg-orange-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                            Yeni
                          </span>
                        )}
                      </div>
                      <p className="whitespace-pre-wrap text-sm leading-relaxed text-warm-700">
                        {msg.message}
                      </p>
                      <p className="mt-2 text-[11px] font-medium text-warm-500">
                        {formatDate(msg.created_at)}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        type="button"
                        onClick={() => markAsRead(msg.id, !msg.is_read)}
                        className="grid h-8 w-8 place-items-center rounded-lg text-warm-600 transition-colors hover:bg-warm-100 hover:text-charcoal-900"
                        title={msg.is_read ? 'Okunmadı işaretle' : 'Okundu işaretle'}
                      >
                        <Check size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteMessage(msg.id)}
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
          <h3 className="mb-5 text-base font-bold text-charcoal-900">İletişim Bilgilerini Düzenle</h3>
          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label className="mb-1.5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-warm-600">
                <Mail size={13} className="text-orange-500" />
                E-posta Adresi
              </label>
              <input
                type="email"
                value={contactInfo.email}
                onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                className="w-full rounded-xl border-2 border-warm-200 bg-cream-50 px-3.5 py-2.5 text-sm text-charcoal-900 placeholder-warm-400 transition-all focus:border-orange-400 focus:bg-white focus:outline-none"
                placeholder="ornek@email.com"
              />
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-warm-600">
                <Phone size={13} className="text-orange-500" />
                Telefon
              </label>
              <input
                type="text"
                value={contactInfo.phone}
                onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                className="w-full rounded-xl border-2 border-warm-200 bg-cream-50 px-3.5 py-2.5 text-sm text-charcoal-900 placeholder-warm-400 transition-all focus:border-orange-400 focus:bg-white focus:outline-none"
                placeholder="05XX XXX XX XX"
              />
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-warm-600">
                <MapPin size={13} className="text-orange-500" />
                Adres
              </label>
              <textarea
                value={contactInfo.address}
                onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
                rows={3}
                className="w-full resize-none rounded-xl border-2 border-warm-200 bg-cream-50 px-3.5 py-2.5 text-sm text-charcoal-900 placeholder-warm-400 transition-all focus:border-orange-400 focus:bg-white focus:outline-none"
                placeholder="Adres bilgisi..."
              />
            </div>

            <div className="border-t border-warm-200/60 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 px-5 py-2.5 text-sm font-bold text-white shadow-warm-glow transition-all hover:-translate-y-0.5 hover:shadow-warm-glow-lg disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    Kaydediliyor...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Değişiklikleri Kaydet
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default ContactManager;
