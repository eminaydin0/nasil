import { useState, useEffect, useCallback } from 'react';
import { Save, Loader2, Mail, Phone, MapPin, Inbox, Trash2, Check, MessageCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

function ContactManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState('messages'); // 'messages' | 'info'
  const [contactInfo, setContactInfo] = useState({
    email: '',
    phone: '',
    address: ''
  });

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

  useEffect(() => {
    loadContent();
  }, []);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const loadContent = async () => {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('content')
        .eq('section_key', 'contact_info')
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No data found, use defaults
          setContactInfo({
            email: 'eminaydinyazilim@gmail.com',
            phone: '0553 882 76 46',
            address: 'İstanbul, Türkiye'
          });
        } else {
          throw error;
        }
      } else {
        // Parse JSON content
        try {
          const parsedContent = JSON.parse(data.content);
          setContactInfo({
            email: parsedContent.email || '',
            phone: parsedContent.phone || '',
            address: parsedContent.address || ''
          });
        } catch (e) {
          console.error('Error parsing contact info:', e);
          // Fallback if content is not valid JSON
          setContactInfo({
            email: '',
            phone: '',
            address: ''
          });
        }
      }
    } catch (error) {
      console.error('Error loading contact info:', error);
      toast.error('İletişim bilgileri yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase
        .from('site_content')
        .upsert({
          section_key: 'contact_info',
          title: 'İletişim Bilgileri',
          subtitle: 'Bize Ulaşın',
          content: JSON.stringify(contactInfo),
          updated_at: new Date().toISOString()
        }, { onConflict: 'section_key' });

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
      setMessages(prev => prev.map(m => m.id === id ? { ...m, is_read: isRead } : m));
      toast.success(isRead ? 'Okundu işaretlendi' : 'Okunmadı işaretlendi');
    } catch (error) {
      toast.error('Güncellenemedi');
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm('Bu mesajı silmek istediğinize emin misiniz?')) return;
    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setMessages(prev => prev.filter(m => m.id !== id));
      toast.success('Mesaj silindi');
    } catch (error) {
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
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-orange-600" size={32} />
      </div>
    );
  }

  const unreadCount = messages.filter((m) => !m.is_read).length;

  return (
    <div className="space-y-6">
      {/* Alt Tablar */}
      <nav className="flex gap-1 border-b border-gray-200">
        <button
          type="button"
          onClick={() => setActiveSubTab('messages')}
          className={`pb-3 px-4 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${
            activeSubTab === 'messages'
              ? 'border-orange-500 text-orange-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <Inbox size={18} />
          Gelen Mesajlar
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 bg-orange-500 text-white text-xs font-bold rounded-full">
              {unreadCount}
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('info')}
          className={`pb-3 px-4 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${
            activeSubTab === 'info'
              ? 'border-orange-500 text-orange-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <Mail size={18} />
          İletişim Bilgileri
        </button>
      </nav>

      {/* Gelen Mesajlar Tab */}
      {activeSubTab === 'messages' && (
      <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Inbox size={22} className="text-orange-600" />
          Gelen Mesajlar ({messages.length})
          {messages.filter(m => !m.is_read).length > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-orange-500 text-white text-xs font-bold rounded-full">
              {messages.filter(m => !m.is_read).length} okunmamış
            </span>
          )}
        </h2>

        {messagesLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-orange-600" size={32} />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <MessageCircle size={48} className="mx-auto mb-3 opacity-50" />
            <p>Henüz mesaj bulunmuyor</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-4 rounded-xl border transition-colors ${
                  msg.is_read ? 'bg-gray-50 border-gray-200' : 'bg-orange-50/50 border-orange-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-gray-900">{msg.name}</span>
                      <a href={`mailto:${msg.email}`} className="text-sm text-orange-600 hover:underline truncate">
                        {msg.email}
                      </a>
                      {!msg.is_read && (
                        <span className="px-2 py-0.5 bg-orange-500 text-white text-xs rounded-full">Yeni</span>
                      )}
                    </div>
                    <p className="text-gray-700 text-sm whitespace-pre-wrap">{msg.message}</p>
                    <p className="text-xs text-gray-400 mt-2">{formatDate(msg.created_at)}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => markAsRead(msg.id, !msg.is_read)}
                      className="p-2 rounded-lg hover:bg-gray-200 text-gray-600"
                      title={msg.is_read ? 'Okunmadı işaretle' : 'Okundu işaretle'}
                    >
                      <Check size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteMessage(msg.id)}
                      className="p-2 rounded-lg hover:bg-red-100 text-red-600"
                      title="Sil"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      )}

      {/* İletişim Bilgileri Tab */}
      {activeSubTab === 'info' && (
      <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">İletişim Bilgilerini Düzenle</h2>
      
      <form onSubmit={handleSave} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Mail size={16} className="text-orange-600" />
            E-posta Adresi
          </label>
          <input
            type="email"
            value={contactInfo.email}
            onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
            placeholder="ornek@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Phone size={16} className="text-orange-600" />
            Telefon Numarası
          </label>
          <input
            type="text"
            value={contactInfo.phone}
            onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
            placeholder="05XX XXX XX XX"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <MapPin size={16} className="text-orange-600" />
            Adres / Konum
          </label>
          <textarea
            value={contactInfo.address}
            onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all resize-none"
            placeholder="Adres bilgisi..."
          />
        </div>

        <div className="pt-4 border-t border-gray-100">
          <button
            type="submit"
            disabled={saving}
            className="w-full flex items-center justify-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {saving ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Kaydediliyor...</span>
              </>
            ) : (
              <>
                <Save size={20} />
                <span>Değişiklikleri Kaydet</span>
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
