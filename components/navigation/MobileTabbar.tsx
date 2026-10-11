"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, Heart, ShoppingBag, User } from "lucide-react";
import { useCartStore } from "@/lib/store/cartStore";
import { useWishlistStore } from "@/lib/store/wishlistStore";

/** Mobile-app bottom tab bar — Home / Shop / Wishlist / Bag / Account */
export const MobileTabbar: React.FC = () => {
  const pathname = usePathname();
  const cartCount = useCartStore((s) => s.items.reduce((a, i) => a + i.quantity, 0));
  const wishlistCount = useWishlistStore((s) => s.productIds.length);

  const tabs = [
    { href: "/dashboard", label: "Home", icon: Home },
    { href: "/watches", label: "Shop", icon: LayoutGrid },
    { href: "/wishlist", label: "Saved", icon: Heart, badge: wishlistCount },
    { href: "/checkout", label: "Bag", icon: ShoppingBag, badge: cartCount },
    { href: "/login", label: "Account", icon: User },
  ];

  return (
    <nav className="mobile-tabbar lg:hidden" aria-label="Mobile navigation">
      <div className="grid grid-cols-5 w-full max-w-md mx-auto">
        {tabs.map((t) => {
          const active = pathname === t.href || (t.href === "/dashboard" && pathname === "/home");
          const Icon = t.icon;
          return (
            <Link
              key={t.label}
              href={t.href}
              className={`relative flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-semibold ${
                active ? "text-[#0e3a5d]" : "text-slate-400"
              }`}
            >
              <span className="relative">
                <Icon className="w-5 h-5" />
                {!!t.badge && t.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#0e3a5d] text-white text-[9px] min-w-[16px] h-4 rounded-full flex items-center justify-center px-1">
                    {t.badge > 9 ? "9+" : t.badge}
                  </span>
                )}
              </span>
              {t.label}
              {active && <span className="absolute top-0 h-0.5 w-8 rounded-full bg-[#b9975b]" />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
