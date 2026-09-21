import Link from "next/link";
import { Leaf, Settings, Sprout, Tag, Users } from "lucide-react";
import LogoutButton from "@/app/admin/LogoutButton";

const navItems = [
  { href: "/admin", label: "Overview", icon: Sprout },
  { href: "/admin/plants", label: "Plants", icon: Leaf },
  { href: "/admin/categories", label: "Categories", icon: Tag },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <div className="container-shell flex min-h-screen gap-6 py-8">
        <aside className="hidden w-72 shrink-0 rounded-[22px] border border-stone-200 bg-white p-5 shadow-sm lg:block">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2F5D3A] text-white">
              <Leaf className="h-5 w-5" />
            </div>
            <div>
              <p className="text-base font-semibold text-stone-900">Farm Admin</p>
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Dashboard</p>
            </div>
          </div>

          <nav className="space-y-2">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-[#f2f5f0] hover:text-stone-900"
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>

          <div className="mt-10 rounded-2xl border border-stone-200 bg-[#edf3ed] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2F5D3A] text-white">
                <Users className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-stone-900">Admin access</p>
                <p className="text-xs text-stone-600">Protected by Supabase RLS</p>
              </div>
            </div>
          </div>

          <LogoutButton />
        </aside>

        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
