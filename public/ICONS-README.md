# PWA İkonları Hakkında

## 📱 Gerekli İkonlar

PWA (Progressive Web App) için aşağıdaki boyutlarda PNG ikonlarına ihtiyacınız var:

### Ana İkonlar
- `icon-192.png` - 192x192 piksel
- `icon-512.png` - 512x512 piksel

### Apple Touch Icon (isteğe bağlı)
- `apple-touch-icon.png` - 180x180 piksel

### Favicon (isteğe bağlı)
- `favicon.ico` - 32x32 piksel

## 🎨 İkon Oluşturma

1. **Online Araçlar:**
   - [RealFaviconGenerator](https://realfavicongenerator.net/)
   - [Favicon.io](https://favicon.io/)
   - [PWA Builder](https://www.pwabuilder.com/)

2. **Tasarım Özellikleri:**
   - Basit ve tanınabilir logo
   - Yüksek kontrast renkler
   - Turuncu/kırmızı gradient (mevcut tema ile uyumlu)
   - Şeffaf arka plan (PNG)

3. **Önerilen Tasarım:**
   - Logo: "NO" harfleri veya oyun teması
   - Renk: Turuncu (#f97316) - Kırmızı (#dc2626) gradient
   - Stil: Modern, minimal, düz tasarım

## 📁 Dosya Yerleşimi

Tüm ikon dosyaları `public/` klasörüne yerleştirilmelidir:

```
public/
  ├── icon-192.png
  ├── icon-512.png
  ├── apple-touch-icon.png
  ├── favicon.ico
  └── manifest.json
```

## ✅ Test Etme

1. Chrome DevTools → Application → Manifest sekmesi
2. Lighthouse PWA audit'i çalıştır
3. Mobil cihazda "Ana Ekrana Ekle" dene

## 🔄 Güncelleme

İkonları değiştirdikten sonra:
1. Service Worker'ı temizle
2. Tarayıcı cache'ini temizle
3. Sayfayı yeniden yükle (Ctrl+Shift+R)

---

**Not:** Şu anda placeholder SVG dosyaları kullanılıyor. Production'a geçmeden önce gerçek PNG ikonlarla değiştirin.
