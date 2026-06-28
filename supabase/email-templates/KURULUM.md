# Supabase e-posta şablonları — Kuralı Ne?

Bu klasördeki HTML dosyalarını Supabase Dashboard'a yapıştırarak auth maillerinin tasarımını güncellersin.

## Adımlar

1. [Supabase Dashboard](https://supabase.com/dashboard) → projen → **Authentication** → **Email Templates**
2. Her şablon için **Subject** ve **Body** alanlarını güncelle
3. Body alanına ilgili `.html` dosyasının **tüm içeriğini** kopyala-yapıştır
4. **Save** → test için yeni kayıt ol veya "Doğrulama e-postasını tekrar gönder"

## Konu satırları (Subject)

| Şablon | Önerilen konu |
|--------|----------------|
| Confirm signup | `Kuralı Ne? — E-postanı doğrula` |
| Reset password | `Kuralı Ne? — Şifre sıfırlama` |
| Magic Link | `Kuralı Ne? — Giriş bağlantın` |

## Dosyalar

| Supabase şablonu | Dosya |
|------------------|--------|
| Confirm signup | `confirm-signup.html` |
| Reset password | `reset-password.html` |
| Magic Link | `magic-link.html` |

## Önemli

- `{{ .ConfirmationURL }}` ve `{{ .Email }}` gibi değişkenleri **silme** — Supabase bunları doldurur
- Kayıtta isim varsa `{{ .Data.full_name }}` confirm mailinde kullanılır
- **Site URL:** `https://kuraline.xyz`
- **Redirect URLs:** `https://kuraline.xyz/**`

## İsteğe bağlı: kendi SMTP

Gönderen adresi `noreply@kuraline.xyz` gibi olsun istersen: **Project Settings → Authentication → SMTP Settings** (Resend, SendGrid vb.)
