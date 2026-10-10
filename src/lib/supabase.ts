/// <reference types="vite/client" />
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Retrieve credentials from environment variables or custom local storage override
const envSupabaseUrl = (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_SUPABASE_URL || '';
const envSupabaseAnonKey = (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_SUPABASE_ANON_KEY || '';

export const getStoredConfig = () => {
  try {
    const url = localStorage.getItem('mara_supabase_url') || envSupabaseUrl;
    const key = localStorage.getItem('mara_supabase_anon_key') || envSupabaseAnonKey;
    return { 
      url: url ? url.trim() : '', 
      key: key ? key.trim() : '' 
    };
  } catch {
    return { url: envSupabaseUrl, key: envSupabaseAnonKey };
  }
};

export const isSupabaseConfigured = (): boolean => {
  const { url, key } = getStoredConfig();
  return Boolean(
    url &&
    key &&
    url.startsWith('https://') &&
    url.includes('supabase.co') &&
    key.length > 20
  );
};

// Create or retrieve active client
let clientInstance: SupabaseClient | null = null;
let lastUrl = '';
let lastKey = '';

export const getSupabase = (): SupabaseClient => {
  const { url, key } = getStoredConfig();
  
  if (clientInstance && lastUrl === url && lastKey === key) {
    return clientInstance;
  }

  if (isSupabaseConfigured()) {
    lastUrl = url;
    lastKey = key;
    clientInstance = createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    });
  } else {
    lastUrl = 'https://placeholder.supabase.co';
    lastKey = 'placeholder-key-mara-modern-indian-dining';
    clientInstance = createClient(lastUrl, lastKey, {
      auth: {
        persistSession: false,
      },
    });
  }

  return clientInstance;
};

export const supabase = getSupabase();

export const saveSupabaseCredentials = (url: string, key: string) => {
  try {
    localStorage.setItem('mara_supabase_url', url.trim());
    localStorage.setItem('mara_supabase_anon_key', key.trim());
    clientInstance = null; // force re-instantiation
  } catch (err) {
    console.error('Failed to save Supabase credentials:', err);
  }
};

export const clearSupabaseCredentials = () => {
  try {
    localStorage.removeItem('mara_supabase_url');
    localStorage.removeItem('mara_supabase_anon_key');
    clientInstance = null; // force re-instantiation
  } catch (err) {
    console.error('Failed to clear Supabase credentials:', err);
  }
};

export const testSupabaseConnection = async (): Promise<{ success: boolean; message: string }> => {
  if (!isSupabaseConfigured()) {
    return { 
      success: false, 
      message: 'Supabase URL or Anon Key is missing or invalid. Please check your project settings.' 
    };
  }

  try {
    const client = getSupabase();
    const { error } = await client.from('orders').select('count', { count: 'exact', head: true });
    
    if (error) {
      return { 
        success: false, 
        message: `Connection test error: ${error.message} (Code: ${error.code || 'UNKNOWN'})` 
      };
    }
    return { 
      success: true, 
      message: 'Successfully connected to Supabase PostgreSQL database!' 
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return { 
      success: false, 
      message: `Network or configuration error: ${errorMsg}` 
    };
  }
};
