import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yjnipjcevnxrzlgfmeci.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqbmlwamNldm54cnpsZ2ZtZWNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5NDMyMjUsImV4cCI6MjA4MjUxOTIyNX0.tuUrVzxDlZssFm3pwhB-fSsiL8DQUErHmGeqngvQohc';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkSchema() {
  console.log('🔍 Checking comments table schema...\n');
  
  // Try to get one row to see column names
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .limit(1);
  
  if (error) {
    console.error('Error:', error);
  } else {
    if (data && data.length > 0) {
      console.log('Existing row:', data[0]);
      console.log('\nColumn names:', Object.keys(data[0]));
    } else {
      console.log('No rows found. Trying to insert with different column names...\n');
      
      // Try with original schema column names
      const testData = {
        game_id: 1,
        name: 'Schema Test',
        comment: 'Testing column names',
        rating: 5,
        date: '2025-12-29',
        likes: 0,
        is_testimonial: false,
        replies: []
      };
      
      console.log('Trying with "name" and "comment" columns:', testData);
      const { data: result, error: insertError } = await supabase
        .from('comments')
        .insert([testData])
        .select();
      
      if (insertError) {
        console.error('❌ Failed:', insertError.message);
        console.log('\nLet me check the actual schema in Supabase...');
        console.log('Please run this SQL in Supabase SQL Editor:');
        console.log('\nSELECT column_name, data_type FROM information_schema.columns WHERE table_name = \'comments\' ORDER BY ordinal_position;\n');
      } else {
        console.log('✅ Success! Columns are:', Object.keys(result[0]));
      }
    }
  }
}

checkSchema();
