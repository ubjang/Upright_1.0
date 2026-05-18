import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * 관리자 전용 Supabase 클라이언트.
 * Service Role Key를 사용하여 RLS를 우회합니다.
 * 서버 사이드(API Route)에서만 사용하세요.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    return null;
  }
  return createSupabaseClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
