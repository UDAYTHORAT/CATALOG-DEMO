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

  const storeMap = new Map();
  stores.forEach(s => storeMap.set(s.id, s));

  console.log('Orphan / Mismatched Funnels:');
  for (const f of funnels) {
    const s = storeMap.get(f.store_id);
    if (!s) {
      console.log(`- Funnel ${f.id} (${f.name}) points to store ${f.store_id} which DOES NOT EXIST!`);
    } else {
      console.log(`- Funnel ${f.id} (${f.name}) points to store ${f.store_id} (owned by user ${s.user_id})`);
    }
  }
}

run();
