import Link from "next/link";
import { SITE_CONFIG, ALL_SERIES } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold">{SITE_CONFIG.name}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {SITE_CONFIG.description}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Instagram:{" "}
              <a
                href="https://instagram.com/creatorhood.mag"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:underline"
              >
                {SITE_CONFIG.instagram}
              </a>
            </p>
          </div>

          {/* Series */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Series
            </h4>
            <nav className="flex flex-col gap-1.5">
              {ALL_SERIES.map((series) => (
                <Link
                  key={series.slug}
                  href={`/series/${series.slug}`}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {series.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Links
            </h4>
            <nav className="flex flex-col gap-1.5">
              <Link
                href="/about"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                About
              </Link>
              <a
                href="https://instagram.com/creatorhood.mag"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Instagram
              </a>
              <a
                href="https://youtube.com/@creatorhood"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                YouTube
              </a>
            </nav>
          </div>
        </div>

        <div className="mt-8 border-t pt-6 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} {SITE_CONFIG.fullName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
