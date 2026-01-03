-- Insert initial data for Contact Info section
INSERT INTO site_content (section_key, title, subtitle, content)
VALUES (
  'contact_info',
  'İletişim Bilgileri',
  'Bize Ulaşın',
  '{"email": "eminaydinyazilim@gmail.com", "phone": "0553 882 76 46", "address": "İstanbul, Türkiye"}'
) ON CONFLICT (section_key) DO NOTHING;
