import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yjnipjcevnxrzlgfmeci.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqbmlwamNldm54cnpsZ2ZtZWNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5NDMyMjUsImV4cCI6MjA4MjUxOTIyNX0.tuUrVzxDlZssFm3pwhB-fSsiL8DQUErHmGeqngvQohc';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log('🔍 Testing Supabase connection...');
  
  // 1. Test connection
  const { data: testData, error: testError } = await supabase
    .from('games')
    .select('count')
    .limit(1);
  
  if (testError) {
    console.error('❌ Connection failed:', testError);
    return;
  }
  console.log('✅ Connection OK');
  
  // 2. Check comments table
  console.log('\n📊 Checking comments table...');
  const { data: comments, error: commentsError } = await supabase
    .from('comments')
    .select('*');
  
  if (commentsError) {
    console.error('❌ Error reading comments:', commentsError);
  } else {
    console.log(`✅ Found ${comments.length} comments`);
    console.log(comments);
  }
  
  // 3. Try to insert a test comment
  console.log('\n💾 Trying to insert test comment...');
  const testComment = {
    game_id: 91, // Saklambaç
    author_name: 'Test User',
    content: 'Test comment - ' + new Date().toISOString(),
    rating: 5,
    likes: 0,
    replies: [],
    is_testimonial: false
  };
  
  console.log('Data to insert:', testComment);
  
  const { data: insertData, error: insertError } = await supabase
    .from('comments')
    .insert([testComment])
    .select();
  
  if (insertError) {
    console.error('❌ Insert failed:', insertError);
    console.error('Error details:', JSON.stringify(insertError, null, 2));
  } else {
    console.log('✅ Insert successful!');
    console.log('Inserted data:', insertData);
  }
  
  // 4. Check comments again
  console.log('\n📊 Checking comments after insert...');
  const { data: commentsAfter, error: commentsAfterError } = await supabase
    .from('comments')
    .select('*');
  
  if (commentsAfterError) {
    console.error('❌ Error reading comments:', commentsAfterError);
  } else {
    console.log(`✅ Found ${commentsAfter.length} comments`);
  }
}

testConnection().then(() => {
  console.log('\n✅ Test completed');
  process.exit(0);
}).catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
