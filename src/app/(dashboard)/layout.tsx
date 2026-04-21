"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/", icon: "dashboard" },
    { name: "Inventory", href: "/inventory", icon: "inventory_2" },
    { name: "Marketplace", href: "/marketplace", icon: "shopping_cart" },
    { name: "Vault", href: "/vault", icon: "description" },
    { name: "Profile", href: "/profile", icon: "person" },
  ];

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-surface dark:bg-on-background flex items-center justify-between px-6 py-4 h-16 shadow-none">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary-container dark:text-primary-fixed" data-icon="potted_plant">potted_plant</span>
          <h1 className="text-lg font-bold text-primary-container dark:text-primary-fixed tracking-tighter">Precision Ledger</h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="hover:bg-surface-container-highest transition-colors p-2 rounded-full active:scale-95 duration-150">
            <span className="material-symbols-outlined text-on-surface-variant" data-icon="notifications">notifications</span>
          </button>
        </div>
      </header>

      <main className="flex-1 pt-16 pb-24">
        {children}
      </main>

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 w-full z-50 rounded-t-xl bg-surface dark:bg-on-background flex justify-around items-center px-2 pb-6 pt-2 shadow-[0px_-4px_16px_rgba(11,28,48,0.04)]">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center px-5 py-2 rounded-xl transition-all active:scale-90 ${
                isActive
                  ? "bg-surface-container-highest dark:bg-primary-container text-primary dark:text-primary-fixed"
                  : "text-on-surface-variant hover:bg-surface-container-low"
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="font-['Inter'] text-[11px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
