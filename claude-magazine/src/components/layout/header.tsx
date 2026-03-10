"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu, X } from "lucide-react";
import { useState } from "react";
import { ALL_SERIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Top bar: Logo + Actions */}
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight">CH MAG</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/search"
            className="rounded-md p-2 hover:bg-accent transition-colors"
          >
            <Search className="h-5 w-5" />
          </Link>
          <button
            className="rounded-md p-2 hover:bg-accent transition-colors lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Desktop series nav — scrollable */}
      <nav className="hidden lg:block border-t">
        <div className="mx-auto max-w-7xl overflow-x-auto px-4 md:px-6">
          <div className="flex items-center gap-0.5 py-1">
            <NavLink href="/" active={pathname === "/"}>
              전체
            </NavLink>
            {ALL_SERIES.map((series) => (
              <NavLink
                key={series.slug}
                href={`/series/${series.slug}`}
                active={pathname === `/series/${series.slug}`}
                color={series.color}
              >
                {series.name}
              </NavLink>
            ))}
            <NavLink href="/about" active={pathname === "/about"}>
              About
            </NavLink>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-t lg:hidden">
          <nav className="mx-auto max-w-7xl flex flex-col px-4 py-3">
            <MobileNavLink
              href="/"
              onClick={() => setMobileMenuOpen(false)}
            >
              전체
            </MobileNavLink>
            {ALL_SERIES.map((series) => (
              <MobileNavLink
                key={series.slug}
                href={`/series/${series.slug}`}
                onClick={() => setMobileMenuOpen(false)}
                color={series.color}
              >
                {series.name}
              </MobileNavLink>
            ))}
            <MobileNavLink
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </MobileNavLink>
          </nav>
        </div>
      )}
    </header>
  );
}

function NavLink({
  href,
  active,
  children,
  color,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "relative shrink-0 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap",
        active
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
      )}
    >
      {active && color && (
        <span
          className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-4 rounded-full"
          style={{ backgroundColor: color }}
        />
      )}
      {children}
    </Link>
  );
}

function MobileNavLink({
  href,
  onClick,
  children,
  color,
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-accent transition-colors"
    >
      {color && (
        <span
          className="h-2 w-2 rounded-full shrink-0"
          style={{ backgroundColor: color }}
        />
      )}
      {children}
    </Link>
  );
}
