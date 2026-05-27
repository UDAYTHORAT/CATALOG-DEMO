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

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  // Fetch all funnels
  const { data: funnels, error } = await supabase
    .from('funnels')
    .select('*');

  if (error) {
    console.error('Error fetching funnels:', error);
    process.exit(1);
  }

  console.log('Funnels:', JSON.stringify(funnels, null, 2));

  // Fetch all stores
  const { data: stores, error: storesError } = await supabase
    .from('stores')
    .select('*');

  if (storesError) {
    console.error('Error fetching stores:', storesError);
    process.exit(1);
  }

  console.log('Stores:', JSON.stringify(stores, null, 2));
}

run();
