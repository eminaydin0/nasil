-- 1. Comments tablosuna yorumu yazan kullanıcının auth id'si (bildirim için)
ALTER TABLE public.comments
  ADD COLUMN IF NOT EXISTS author_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_comments_author_user_id ON public.comments(author_user_id);

COMMENT ON COLUMN public.comments.author_user_id IS 'Giriş yapmış kullanıcı yorum yazdıysa auth.users id; bildirim göndermek için kullanılır.';

-- 2. Giriş yapmış kullanıcılar başkalarına bildirim ekleyebilsin (yanıt/beğeni bildirimi)
DROP POLICY IF EXISTS "Authenticated users can insert notifications" ON public.notifications;
CREATE POLICY "Authenticated users can insert notifications"
  ON public.notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 3. Realtime: Bildirimler anlık gelsin (Supabase Dashboard > Replication'da da açılabilir)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'notifications'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
  END IF;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Realtime publication hatası (görmezden gelinebilir): %', SQLERRM;
END $$;



