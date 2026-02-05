-- Kullanım Koşulları içeriğini site_content tablosuna ekle
-- Supabase SQL Editor'da çalıştırın

INSERT INTO site_content (section_key, title, subtitle, content)
VALUES (
  'kullanim_kosullari',
  'Kullanım Koşulları',
  'Son güncelleme: Ocak 2026',
  'Bu web sitesini ("Nasıl Oynanır") kullanarak aşağıdaki koşulları kabul etmiş sayılırsınız.

1. GENEL BİLGİLER
Nasıl Oynanır, geleneksel Türk oyunları ve popüler kutu oyunları hakkında bilgi sunan bir platformdur. Sitemizi ziyaret etmekle bu kullanım koşullarını okuduğunuzu ve kabul ettiğinizi beyan etmiş olursunuz.

2. HİZMET KAPSAMI
Sitemiz üzerinden sunulan tüm içerikler (oyun kuralları, ipuçları, açıklamalar) bilgilendirme amaçlıdır. İçeriklerin doğruluğunu sağlamak için çaba gösterilse de, eksiklik veya hatalardan dolayı sorumluluk kabul edilmez.

3. FİKRİ MÜLKİYET
Sitedeki tüm metin, görsel ve diğer içerikler Nasıl Oynanır''a aittir. İzinsiz kopyalama, dağıtma veya ticari amaçla kullanım yasaktır. Alıntı yapılacaksa kaynak gösterilmesi gerekmektedir.

4. KULLANICI HESAPLARI
Kayıt olan kullanıcılar, verdiği bilgilerin doğruluğundan sorumludur. Hesap güvenliğini sağlamak kullanıcının sorumluluğundadır. Yetkisiz erişim durumunda site yönetimine bilgi verilmesi önerilir.

5. YORUM VE İÇERİK KURALLARI
Kullanıcıların yaptığı yorumlar; hakaret, küfür, spam veya yasalara aykırı içerik barındıramaz. Uygunsuz içerik tespit edildiğinde silinebilir ve ilgili hesap askıya alınabilir.

6. GİZLİLİK
Kişisel verileriniz Gizlilik Politikamız kapsamında işlenmektedir. Sitemizi kullanarak bu politikayı da kabul etmiş sayılırsınız.

7. DEĞİŞİKLİKLER
Bu koşullar önceden haber vermeksizin güncellenebilir. Güncel versiyon her zaman bu sayfada yayınlanacaktır. Değişiklikler yayınlandığı anda yürürlüğe girer.

8. İLETİŞİM
Sorularınız için iletişim sayfamızı kullanabilirsiniz.'
) ON CONFLICT (section_key) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  content = EXCLUDED.content,
  updated_at = timezone('utc'::text, now());
