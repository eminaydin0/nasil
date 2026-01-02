import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yjnipjcevnxrzlgfmeci.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqbmlwamNldm54cnpsZ2ZtZWNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5NDMyMjUsImV4cCI6MjA4MjUxOTIyNX0.tuUrVzxDlZssFm3pwhB-fSsiL8DQUErHmGeqngvQohc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCategories() {
  const { data, error } = await supabase
    .from('games')
    .select('category');

  if (error) {
    console.error(error);
    return;
  }

  const categories = [...new Set(data.map(g => g.category))];
  console.log('Existing Categories:', categories);
}

checkCategories();
