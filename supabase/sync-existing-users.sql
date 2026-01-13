-- BU SORGURUYU CALISTIRARAK MEVCUT KULLANICILARI TABLOYA AKTARIN

-- 1. Mevcut kullanıcıları profiles tablosuna kopyala
insert into public.profiles (id, email, full_name, birth_year, gender, created_at)
select 
  id, 
  email, 
  -- Metadata yoksa veya boşsa null yerine boş string gelmemesi için kontrol edilebilir ama düz kullanım genelde yeterlidir.
  raw_user_meta_data->>'full_name', 
  raw_user_meta_data->>'birth_year', 
  raw_user_meta_data->>'gender',
  created_at
from auth.users
on conflict (id) do nothing; -- Zaten varsa hata verme, atla

-- 2. Eğer RLS (Güvenlik) hatası alıyorsan ve admin panelinde göremiyorsan, 
-- geçici olarak RLS'i devre dışı bırakıp deneyebilirsin (önerilmez ama test için):
-- alter table public.profiles disable row level security;
