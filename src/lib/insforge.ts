import { createClient, createAdminClient, InsForgeClient } from '@insforge/sdk';

const defaultUrl = process.env.NEXT_PUBLIC_INSFORGE_URL || 'https://2ce9ed76-033c-471a-b864-5af7d9f54b68.insforge.app';
const defaultAnonKey = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY || 'anon-placeholder-key';

// Client-side singleton for browser components and standard operations
export const insforge: InsForgeClient = createClient({
  baseUrl: defaultUrl,
  anonKey: defaultAnonKey,
});

// Server-side admin client for privileged backend workflows (seeding, server routes)
export function getAdminClient(): InsForgeClient {
  const apiKey = process.env.INSFORGE_API_KEY;
  if (!apiKey) {
    console.warn('INSFORGE_API_KEY is not set. Falling back to standard client.');
    return insforge;
  }
  return createAdminClient({
    baseUrl: defaultUrl,
    apiKey,
  });
}
