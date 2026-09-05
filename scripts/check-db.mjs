import fs from 'fs';
import { createAdminClient } from '@insforge/sdk';

const envContent = fs.readFileSync('.env.local', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const [k, ...v] = line.split('=');
  if (k && v.length) env[k.trim()] = v.join('=').trim().replace(/^["']|["']$/g, '');
});

const client = createAdminClient({
  baseUrl: env.NEXT_PUBLIC_INSFORGE_URL,
  apiKey: env.INSFORGE_API_KEY
});

async function main() {
  const t0 = await client.database.from('user_addresses').select('*').limit(1);
  console.log('user_addresses sample:', t0.data, 'error:', t0.error?.message);

  const t1 = await client.database.from('addresses').select('*').limit(1);
  console.log('addresses sample:', t1.data);

  const t3 = await client.database.from('orders').select('*').limit(1);
  console.log('orders sample:', t3.data);

  const t4 = await client.database.from('order_items').select('*').limit(1);
  console.log('order_items sample:', t4.data);
}

main().catch(console.error);
