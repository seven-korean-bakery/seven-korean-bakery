"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { Locale } from "@/lib/locales";
import { getContent } from "@/content";
import { business } from "@/lib/business";

export function SiteHeader({ locale }: { locale: Locale }) {
  const content = getContent(locale);
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const otherLocale = locale === "en" ? "ko" : "en";
  const navItems = [
    { href: `/${locale}`, label: content.nav.home },
    { href: business.links.customOrder[locale], label: content.nav.order },
    { href: `/${locale}#store`, label: content.nav.products },
    { href: `/${locale}#gallery`, label: content.nav.gallery },
  ];

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link
          className="brand-lockup"
          href={`/${locale}`}
          aria-label={content.siteTitle}
        >
          {business.logoPath && (
            <Image
              className="header-logo"
              src={business.logoPath}
              alt=""
              width={64}
              height={48}
            />
          )}
          <span className="brand-copy">
            <span
              className={
                locale === "en"
                  ? "brand-name brand-primary"
                  : "brand-name brand-secondary"
              }
            >
              {business.name.en}
            </span>
            <span
              className={
                locale === "ko"
                  ? "brand-name brand-primary"
                  : "brand-name brand-secondary"
              }
              lang="ko"
            >
              {business.name.ko}
            </span>
          </span>
        </Link>

        <nav className="desktop-nav" aria-label={content.footer.navigation}>
          {navItems.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <Link
            className="language-toggle"
            href={`/${otherLocale}${pathname.slice(locale.length + 1)}`}
            aria-label={`${content.nav.language}: ${otherLocale === "en" ? content.nav.englishLanguageName : content.nav.koreanLanguageName}`}
          >
            {locale === "en"
              ? content.nav.switchToKorean
              : content.nav.switchToEnglish}
          </Link>
          <a
            className="button button-small header-order"
            href={business.links.customOrder[locale]}
          >
            {content.nav.request}
          </a>
          <button
            className="menu-toggle"
            type="button"
            aria-label={menuOpen ? content.nav.closeMenu : content.nav.openMenu}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          className="mobile-nav"
          id="mobile-navigation"
          aria-label={content.footer.navigation}
        >
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <a
            href={business.links.customOrder[locale]}
            onClick={() => setMenuOpen(false)}
          >
            {content.nav.request}
          </a>
        </nav>
      )}
    </header>
  );
}
