import type { Href } from "expo-router";
import type { NavIconName } from "@/constants/theme";

type NavItem = {
  href: Extract<Href, string>; // only routes that exist in the app
  label: string;
  icon: NavIconName;
};

export const navItems: NavItem[] = [
  { href: "/", label: "Hem", icon: "home" },
  { href: "/today", label: "Dagens", icon: "today" },
  { href: "/library", label: "Bibliotek", icon: "library" },
];

// A story is opened from the library, so the library stays active while reading
export function isNavItemActive(href: string, pathname: string) {
  return (
    pathname === href || (href === "/library" && pathname.startsWith("/story"))
  );
}

// Screens at least this wide get the top menu instead of the bottom bar
export const WIDE_SCREEN = 768; // tablet and up
export const DESKTOP_SCREEN = 1200; // desktop browser
