"use client";

import { useRouter } from "next/navigation";
import { createClient, hasSupabaseBrowserConfig } from "@/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();

  if (!hasSupabaseBrowserConfig()) return null;

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="rounded-full px-3 py-1 text-xs font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
    >
      로그아웃
    </button>
  );
}
