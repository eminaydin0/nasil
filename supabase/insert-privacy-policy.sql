-- Gizlilik Politikası içeriğini site_content tablosuna ekle
-- Supabase SQL Editor'da çalıştırın

INSERT INTO site_content (section_key, title, subtitle, content)
VALUES (
  'gizlilik_politikasi',
  'Gizlilik Politikası',
  'Son güncelleme: Ocak 2026',
  'Nasıl Oynanır olarak kişisel verilerinizin güvenliği ve gizliliği konusunda hassasiyet gösteriyoruz. Bu politika, verilerinizin nasıl toplandığını, kullanıldığını ve korunduğunu açıklamaktadır.

1. TOPLANAN VERİLER
Sitemizi kullanırken aşağıdaki veriler toplanabilir:
- E-posta adresi, ad soyad (kayıt olan kullanıcılar için)
- Yorumlarınız ve değerlendirmeleriniz
- Teknik veriler (IP adresi, tarayıcı türü, cihaz bilgisi) – analitik amaçlı
- Çerezler (cookie) ile oturum ve tercih bilgileri

2. VERİLERİN KULLANIM AMACI
Toplanan veriler şu amaçlarla kullanılır:
- Hizmetlerimizi sunmak ve geliştirmek
- Hesap oluşturma ve yönetimi
- Yorum ve etkileşim özelliklerini sağlamak
- Site kullanım istatistikleri ve analizi
- Teknik destek ve iletişim

3. VERİ SAKLANMA SÜRESİ
Kişisel verileriniz, hizmet sunumu için gerekli olduğu sürece veya yasal zorunluluklar gerektirdiği müddetçe saklanır. Hesabınızı sildiğinizde ilgili veriler silinir veya anonimleştirilir.

4. VERİ PAYLAŞIMI
Verileriniz üçüncü taraflarla satılmaz. Yalnızca hizmet sağlayıcılarımız (ör. sunucu ve analitik servisleri) teknik gereklilik kapsamında veriye erişebilir. Yasal zorunluluk durumunda yetkili makamlarla paylaşım yapılabilir.

5. ÇEREZLER (COOKIES)
Sitemiz, oturum yönetimi ve kullanıcı deneyimini iyileştirmek için çerezler kullanır. Tarayıcı ayarlarınızdan çerezleri devre dışı bırakabilirsiniz; ancak bu, bazı özelliklerin çalışmasını etkileyebilir.

6. HAKLARINIZ
KVKK ve GDPR kapsamında verilerinize erişim, düzeltme, silme talep etme ve itiraz hakkına sahipsiniz. Talepleriniz için iletişim sayfamızı kullanabilirsiniz.

7. GÜVENLİK
Verileriniz güvenli altyapı ve şifreleme yöntemleriyle korunmaktadır. Güvenlik ihlali durumunda gerekli önlemler alınır ve ilgililer bilgilendirilir.

8. İLETİŞİM
Gizlilik ile ilgili sorularınız için iletişim sayfamızdan bize ulaşabilirsiniz.'
) ON CONFLICT (section_key) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  content = EXCLUDED.content,
  updated_at = timezone('utc'::text, now());
