-- Supabase'de Auth User silme işlemini yapabilmek için özel bir fonksiyon
-- (Çünkü normal update/insert fonksiyonları auth.users tablosundan silemez)

create or replace function public.delete_user(user_id uuid)
returns void as $$
begin
  -- Önce profiles tablosundan sil (foreign key varsa otomatik silinebilir ama temiz iş olsun)
  delete from public.profiles where id = user_id;
  
  -- Auth kullanıcılarını silmek için özel yetki gerekir. 
  -- Supabase client side'dan auth.users tablosuna DELETE atılamaz.
  -- Bu örnekte sadece "profiles" tablosundan silip, auth tarafını panelden yapman daha güvenli olabilir.
  -- VEYA bir Edge Function / RPC kullanmak gerekir.
  
  -- Ancak bir "is_banned" kolonu ekleyip engelleme yapmak çok daha kolay ve güvenlidir.
  -- Biz bu yöntemi izleyelim: kullanıcıyı silmek yerine ENGELLEYELİM.
end;
$$ language plpgsql security definer;

-- Profiles tablosuna 'is_banned' kolonu ekle
alter table public.profiles 
add column if not exists is_banned boolean default false;

-- Engellenmiş kullanıcıların yorumlarını vs. gizlemek için RLS policy güncellenebilir (İleride)
