import Link from "next/link";
import { ActiveDayBadge } from "./ActiveDayBadge";
import { NavLink } from "./NavLink";

type AppShellProps = {
  children: React.ReactNode;
  currentPath?: string;
};

export function AppShell({ children, currentPath = "/" }: AppShellProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="sticky top-0 z-10 border-b border-white/40 bg-white/60 backdrop-blur-md">
        <div className="mx-auto flex max-w-2xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="text-lg font-semibold text-emerald-900">
            청렴 바이브
          </Link>
          <nav className="flex flex-wrap items-center gap-2">
            <NavLink href="/" active={currentPath === "/"}>
              홈
            </NavLink>
            <NavLink href="/check" active={currentPath === "/check"}>
              체크
            </NavLink>
            <NavLink href="/quiz" active={currentPath === "/quiz"}>
              퀴즈
            </NavLink>
            <span className="mx-1 text-slate-300">|</span>
            <NavLink href="/admin" active={currentPath.startsWith("/admin")}>
              관리
            </NavLink>
          </nav>
        </div>
        <div className="mx-auto max-w-2xl px-4 pb-3">
          <ActiveDayBadge />
        </div>
      </header>
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">{children}</main>
      <footer className="mt-auto border-t border-white/40 bg-white/40 py-4 text-center text-xs text-slate-500">
        내부 직원용 청렴 인식 · 청렴도 평가 관점의 가벼운 참여
      </footer>
    </div>
  );
}
