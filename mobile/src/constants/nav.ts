export const navItems = [
  { href: "/", label: "Hem", icon: "🏠" },
  { href: "/today", label: "Dagens", icon: "📘" },
  { href: "/library", label: "Bibliotek", icon: "📜" },
] as const;

// A story is opened from the library, so the library stays active while reading
export function isNavItemActive(href: string, pathname: string) {
  return (
    pathname === href || (href === "/library" && pathname.startsWith("/story"))
  );
}

// Screens at least this wide get the top menu instead of the bottom bar
export const WIDE_SCREEN = 768;
