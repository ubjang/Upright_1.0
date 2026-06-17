"use client";

import { usePathname } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";

export function ClientShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "/";

  // 관리자·로그인 페이지는 자체 레이아웃 사용
  if (pathname.startsWith("/admin") || pathname === "/login") {
    return <>{children}</>;
  }

  return <AppShell currentPath={pathname}>{children}</AppShell>;
}
