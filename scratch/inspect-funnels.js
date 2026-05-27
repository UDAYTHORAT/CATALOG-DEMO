const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Parse .env.local
const envFile = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length > 0) {
    env[key.trim()] = valueParts.join('=').trim();
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: funnels } = await supabase.from('funnels').select('*');
  const { data: stores } = await supabase.from('stores').select('*');

  console.log('Stores in DB:');
  stores.forEach(s => {
    console.log(`- Store: id=${s.id}, user_id=${s.user_id}, name=${s.name}`);
  });

  console.log('\nFunnels in DB:');
  funnels.forEach(f => {
    console.log(`- Funnel: id=${f.id}, store_id=${f.store_id}, name=${f.name}`);
  });
}

run();
