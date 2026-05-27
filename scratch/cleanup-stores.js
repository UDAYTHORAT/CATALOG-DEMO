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
  // Fetch all stores
  const { data: stores, error: storesError } = await supabase
    .from('stores')
    .select('*')
    .order('created_at', { ascending: true });

  if (storesError) {
    console.error('Error fetching stores:', storesError);
    process.exit(1);
  }

  // Group stores by user_id
  const storesByUser = {};
  stores.forEach(store => {
    if (!storesByUser[store.user_id]) {
      storesByUser[store.user_id] = [];
    }
    storesByUser[store.user_id].push(store);
  });

  for (const userId of Object.keys(storesByUser)) {
    const userStores = storesByUser[userId];
    if (userStores.length <= 1) {
      console.log(`User ${userId} has only 1 store. No cleanup needed.`);
      continue;
    }

    const primaryStore = userStores[0];
    const duplicateStores = userStores.slice(1);

    console.log(`User ${userId} has ${userStores.length} stores.`);
    console.log(`Primary store ID: ${primaryStore.id} (${primaryStore.name}, ${primaryStore.slug})`);

    for (const dup of duplicateStores) {
      console.log(`Migrating duplicate store ID: ${dup.id} (${dup.name}, ${dup.slug})`);

      // 1. Move funnels
      const { data: funnels, error: fErr } = await supabase
        .from('funnels')
        .update({ store_id: primaryStore.id })
        .eq('store_id', dup.id)
        .select();
      
      if (fErr) console.error(`Error migrating funnels for store ${dup.id}:`, fErr);
      else console.log(`Migrated ${funnels?.length || 0} funnels.`);

      // 2. Move products
      const { data: products, error: pErr } = await supabase
        .from('products')
        .update({ store_id: primaryStore.id })
        .eq('store_id', dup.id)
        .select();

      if (pErr) console.error(`Error migrating products for store ${dup.id}:`, pErr);
      else console.log(`Migrated ${products?.length || 0} products.`);

      // 3. Move leads
      const { data: leads, error: lErr } = await supabase
        .from('leads')
        .update({ store_id: primaryStore.id })
        .eq('store_id', dup.id)
        .select();

      if (lErr) console.error(`Error migrating leads for store ${dup.id}:`, lErr);
      else console.log(`Migrated ${leads?.length || 0} leads.`);

      // 4. Delete duplicate store
      const { error: delErr } = await supabase
        .from('stores')
        .delete()
        .eq('id', dup.id);

      if (delErr) console.error(`Error deleting duplicate store ${dup.id}:`, delErr);
      else console.log(`Deleted duplicate store ${dup.id}.`);
    }
  }

  console.log('Cleanup complete!');
}

run();
