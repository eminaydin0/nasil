import { createClient } from '@supabase/supabase-js';
import { games } from './src/data/games.js';

const supabaseUrl = 'https://yjnipjcevnxrzlgfmeci.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqbmlwamNldm54cnpsZ2ZtZWNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5NDMyMjUsImV4cCI6MjA4MjUxOTIyNX0.tuUrVzxDlZssFm3pwhB-fSsiL8DQUErHmGeqngvQohc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateGames() {
  console.log('🚀 Migration başlatılıyor...');
  console.log(`📦 ${games.length} oyun bulundu\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const game of games) {
    try {
      // Önce aynı slug var mı kontrol et
      const { data: existing } = await supabase
        .from('games')
        .select('id')
        .eq('slug', game.slug)
        .single();

      if (existing) {
        console.log(`⚠️  ${game.name} zaten var, atlanıyor...`);
        continue;
      }

      // Oyunu ekle
      const { error } = await supabase
        .from('games')
        .insert([{
          slug: game.slug,
          name: game.name,
          category: game.category,
          players: game.players,
          difficulty: game.difficulty,
          image: game.image,
          short_description: game.shortDescription,
          description: game.description,
          rules: game.rules,
          tips: game.tips
        }]);

      if (error) throw error;

      successCount++;
      console.log(`✅ ${game.name} eklendi`);

    } catch (error) {
      errorCount++;
      console.error(`❌ ${game.name} eklenemedi:`, error.message);
    }
  }

  console.log('\n🎉 Migration tamamlandı!');
  console.log(`✅ Başarılı: ${successCount}`);
  if (errorCount > 0) {
    console.log(`❌ Hatalı: ${errorCount}`);
  }
}

migrateGames();
