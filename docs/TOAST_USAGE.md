# Toast Notification Kullanım Kılavuzu

Bu projede **react-hot-toast** kütüphanesi kullanılarak modern ve kullanıcı dostu bildirimler sistemi kurulmuştur.

## Kurulum

Kütüphane zaten yüklenmiş durumda:
```bash
npm install react-hot-toast
```

## Temel Kullanım

### 1. Doğrudan Import

```javascript
import toast from 'react-hot-toast';

// Başarı bildirimi
toast.success('İşlem başarılı!');

// Hata bildirimi
toast.error('Bir hata oluştu!');

// Bilgi bildirimi
toast('Bilgilendirme mesajı');

// Özel ikon ile
toast.success('Beğendiniz!', {
  icon: '👍',
  duration: 2000,
});
```

### 2. Utility Fonksiyonları ile

```javascript
import { showSuccess, showError, showInfo, showLoading } from '@/utils/toast';

// Başarı
showSuccess('Yorumunuz kaydedildi!');

// Hata
showError('Form eksik doldurulmuş!');

// Bilgi
showInfo('Lütfen tüm alanları doldurun');

// Yükleniyor
const toastId = showLoading('Veriler yükleniyor...');
// İşlem bitince kapat
dismissToast(toastId);
```

### 3. Promise ile Otomatik Yönetim

```javascript
import { showPromise } from '@/utils/toast';

const saveData = async () => {
  // API çağrısı
  return await supabase.from('games').insert(data);
};

showPromise(saveData(), {
  loading: 'Kaydediliyor...',
  success: 'Oyun başarıyla kaydedildi!',
  error: 'Kaydetme başarısız!',
});
```

## Özelleştirme Seçenekleri

### Duration (Süre)
```javascript
toast.success('Mesaj', {
  duration: 5000, // 5 saniye
});
```

### Pozisyon
```javascript
toast.success('Mesaj', {
  position: 'top-center', // top-left, top-right, bottom-left, bottom-right, bottom-center
});
```

### Özel Stil
```javascript
toast.success('Mesaj', {
  style: {
    background: '#333',
    color: '#fff',
  },
});
```

### Özel İkon
```javascript
toast.success('Kaydedildi!', {
  icon: '💾',
});

toast.error('Silindi!', {
  icon: '🗑️',
});
```

## Kullanım Örnekleri

### Form Gönderimi
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Doğrulama
  if (!name || !email) {
    toast.error('Lütfen tüm alanları doldurun!');
    return;
  }
  
  // API çağrısı
  try {
    await api.submit(data);
    toast.success('Form başarıyla gönderildi!', {
      icon: '✅',
    });
  } catch (error) {
    toast.error(`Hata: ${error.message}`);
  }
};
```

### Silme İşlemi
```javascript
const handleDelete = async (id) => {
  if (!confirm('Silmek istediğinize emin misiniz?')) return;
  
  try {
    await api.delete(id);
    toast.success('Başarıyla silindi!', {
      icon: '🗑️',
    });
  } catch (error) {
    toast.error('Silme işlemi başarısız!');
  }
};
```

### Beğeni/Like
```javascript
const handleLike = async (id) => {
  await api.like(id);
  toast.success('Beğendiniz!', {
    icon: '👍',
    duration: 2000,
  });
};
```

### Kopyalama
```javascript
const handleCopy = async () => {
  await navigator.clipboard.writeText(text);
  toast.success('Kopyalandı!', {
    icon: '📋',
    duration: 2000,
  });
};
```

### Yükleme İşlemi
```javascript
const loadData = async () => {
  const loadingToast = toast.loading('Veriler yükleniyor...');
  
  try {
    const data = await api.fetchData();
    toast.dismiss(loadingToast);
    toast.success('Veriler yüklendi!');
  } catch (error) {
    toast.dismiss(loadingToast);
    toast.error('Yükleme başarısız!');
  }
};
```

## Projede Kullanılan Yerler

### 1. CommentSection
- ✅ Yorum ekleme
- ✅ Yorum beğenme
- ✅ Yanıt gönderme
- ✅ Form doğrulama

### 2. AdminPanel
- ✅ Oyun ekleme/güncelleme
- ✅ Oyun silme
- ✅ Toplu silme
- ✅ Veri dışa aktarma

### 3. SocialShare
- ✅ Link kopyalama
- ✅ Paylaşım bildirimleri

## Global Ayarlar

Toast ayarları `App.jsx` dosyasında yapılandırılmıştır:

```javascript
<Toaster 
  position="top-right"
  toastOptions={{
    duration: 3000,
    style: {
      background: '#fff',
      color: '#363636',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      borderRadius: '12px',
      padding: '16px',
      fontSize: '14px',
    },
    success: {
      iconTheme: {
        primary: '#10b981',
        secondary: '#fff',
      },
    },
    error: {
      iconTheme: {
        primary: '#ef4444',
        secondary: '#fff',
      },
    },
  }}
/>
```

## İpuçları

1. **Kısa ve öz mesajlar**: Kullanıcılar hızlıca okuyabilsin
2. **Uygun ikonlar**: Emoji ile mesajı destekleyin
3. **Doğru süre**: Önemli mesajlar için 4-5 saniye, basit bilgiler için 2-3 saniye
4. **Doğru pozisyon**: Genellikle top-right veya top-center en iyisidir
5. **Tutarlılık**: Başarı için yeşil, hata için kırmızı renk temaları

## Daha Fazla Bilgi

React Hot Toast dokümantasyonu: https://react-hot-toast.com/
