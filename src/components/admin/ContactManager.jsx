import { useState, useEffect } from 'react';
import { Save, Loader2, Mail, Phone, MapPin } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

function ContactManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    loadContent();
  }, []);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-orange-600" size={32} />
      </div>
    );
  }

  return (
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
  );
}

export default ContactManager;
