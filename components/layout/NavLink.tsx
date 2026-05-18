import Link from "next/link";

type NavLinkProps = {
  href: string;
  children: React.ReactNode;
  active?: boolean;
};

export function NavLink({ href, children, active }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
        active
          ? "bg-emerald-600 text-white shadow-sm"
          : "bg-white/70 text-slate-700 hover:bg-white"
      }`}
    >
      {children}
    </Link>
  );
}
