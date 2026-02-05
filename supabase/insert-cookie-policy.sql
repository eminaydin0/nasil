-- Çerez Politikası içeriğini site_content tablosuna ekle
-- Supabase SQL Editor'da çalıştırın

INSERT INTO site_content (section_key, title, subtitle, content)
VALUES (
  'cerez_politikasi',
  'Çerez Politikası',
  'Son güncelleme: Ocak 2026',
  'Bu Çerez Politikası, Nasıl Oynanır web sitesinde kullanılan çerezler ve benzeri teknolojiler hakkında sizi bilgilendirmek amacıyla hazırlanmıştır.

1. ÇEREZ NEDİR?
Çerezler (cookies), ziyaret ettiğiniz web siteleri tarafından tarayıcınıza yerleştirilen küçük metin dosyalarıdır. Cihazınızda saklanır ve siteye tekrar geldiğinizde tanınmanızı, tercihlerinizin hatırlanmasını sağlar.

2. KULLANDIĞIMIZ ÇEREZ TÜRLERİ
Zorunlu çerezler: Sitenin temel işlevlerini sağlamak için gereklidir. Oturum yönetimi, güvenlik ve form işlemleri için kullanılır. Bu çerezler olmadan site düzgün çalışmayabilir.

İşlevsel çerezler: Dil tercihi, tema seçimi gibi kullanıcı tercihlerini hatırlamak için kullanılır.

Analitik çerezler: Site trafiğini, sayfa görüntülemelerini ve kullanım istatistiklerini anlamak için kullanılır. Bu veriler anonim ve toplu olarak değerlendirilir.

3. ÇEREZ SÜRELERİ
Oturum çerezleri: Tarayıcıyı kapattığınızda silinir.
Kalıcı çerezler: Belirli bir süre cihazınızda kalır (ör. 30 gün, 1 yıl) veya siz silene kadar.

4. ÇEREZ TERCIHLERİNİZ
Tarayıcı ayarlarınızdan çerezleri kabul etmeyebilir, silebilir veya belirli çerez türlerini engelleyebilirsiniz. Ancak zorunlu çerezleri devre dışı bırakırsanız, giriş yapma ve bazı özellikler çalışmayabilir.

5. ÜÇÜNCÜ TARAF ÇEREZLERİ
Sitemizde analitik ve iyileştirme amaçlı üçüncü taraf hizmetleri (ör. Google Analytics) kullanılabilir. Bu hizmetlerin kendi çerez politikaları bulunmaktadır.

6. GÜNCELLEMELER
Bu politika gerektiğinde güncellenebilir. Değişiklikler bu sayfada yayınlanacaktır. Devam eden kullanımınız, güncel politikayı kabul ettiğiniz anlamına gelir.

7. İLETİŞİM
Çerezler hakkında sorularınız için iletişim sayfamızı kullanabilirsiniz.'
) ON CONFLICT (section_key) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  content = EXCLUDED.content,
  updated_at = timezone('utc'::text, now());
