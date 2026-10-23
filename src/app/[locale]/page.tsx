import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getContent } from "@/content";
import { isLocale } from "@/lib/locales";
import { business } from "@/lib/business";
import { SiteHeader } from "@/components/ui/site-header";
import { StoreHours } from "@/components/ui/store-hours";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const content = getContent(locale);
  return {
    title: content.siteTitle,
    description: content.metadataDescription,
    openGraph: {
      title: content.siteTitle,
      description: content.metadataDescription,
    },
  };
}

function OccasionIcon({ index }: { index: number }) {
  const paths = [
    <path
      key="a"
      d="M12 3v3m0 12v3M3 12h3m12 0h3M5.6 5.6l2.1 2.1m8.6 8.6 2.1 2.1m0-12.8-2.1 2.1m-8.6 8.6-2.1 2.1"
    />,
    <path key="a" d="M12 3 14 9l6 3-6 2-2 7-2-7-6-2 6-3 2-6Z" />,
    <path
      key="a"
      d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z"
    />,
    <path
      key="a"
      d="M20.8 8.7c0 5.2-8.8 11.1-8.8 11.1S3.2 13.9 3.2 8.7A4.7 4.7 0 0 1 12 6.2a4.7 4.7 0 0 1 8.8 2.5Z"
    />,
    <path
      key="a"
      d="M16 20v-1.5a4.5 4.5 0 0 0-4.5-4.5h-3A4.5 4.5 0 0 0 4 18.5V20m6-9a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm6-6.8a3.5 3.5 0 0 1 0 6.6m2 3.7a4.5 4.5 0 0 1 2 3.8V20"
    />,
    <path
      key="a"
      d="M4 8h16v12H4zM2 4h20v4H2zm10 0v16m0-16c-5.5 0-5.5-5 0-3 5.5-2 5.5 3 0 3Z"
    />,
    <path
      key="a"
      d="M20.8 8.7c0 5.2-8.8 11.1-8.8 11.1S3.2 13.9 3.2 8.7A4.7 4.7 0 0 1 12 6.2a4.7 4.7 0 0 1 8.8 2.5Z"
    />,
    <path
      key="a"
      d="M12 3v18m-7-7c3.8 0 7 3.2 7 7m7-7c-3.8 0-7 3.2-7 7M5 7c3.8 0 7-1.8 7-4 0 2.2 3.2 4 7 4"
    />,
  ];

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="occasion-icon"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.35"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[index]}
    </svg>
  );
}

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = getContent(locale);
  const english = locale === "en";

  return (
    <>
      <a className="skip-link" href="#main-content">
        {content.skipToContent}
      </a>
      <SiteHeader locale={locale} />
      <main id="main-content">
        <section className="hero section-shell">
          <div className="hero-copy">
            <p className="eyebrow">{content.hero.eyebrow}</p>
            <h1>{content.hero.title}</h1>
            <p className="translated-title" lang={english ? "ko" : "en"}>
              {content.hero.secondaryTitle}
            </p>
            <p className="hero-intro">{content.hero.intro}</p>
            <p className="secondary-copy" lang={english ? "ko" : "en"}>
              {content.hero.secondaryIntro}
            </p>
            <div className="hero-actions">
              <a className="button" href={business.links.customOrder[locale]}>
                {content.hero.request}
              </a>
              <a className="text-link" href="#gallery">
                {content.hero.gallery}
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </section>

        <section className="intro-section section-shell">
          <p className="eyebrow">{content.introduction.eyebrow}</p>
          <div className="section-heading-row">
            <h2>{content.introduction.title}</h2>
            <p className="translated-title" lang={english ? "ko" : "en"}>
              {content.introduction.secondaryTitle}
            </p>
          </div>
          <div className="intro-copy">
            <p>{content.introduction.body}</p>
            <p lang={english ? "ko" : "en"}>
              {content.introduction.secondaryBody}
            </p>
          </div>
        </section>

        <section className="ordering-section" id="ordering">
          <div className="section-shell">
            <div className="section-heading-row">
              <div>
                <p className="eyebrow">{content.ordering.eyebrow}</p>
                <h2>{content.ordering.title}</h2>
                <p className="translated-title" lang={english ? "ko" : "en"}>
                  {content.ordering.secondaryTitle}
                </p>
              </div>
              <div className="heading-aside">
                <p>{content.ordering.intro}</p>
                <p lang={english ? "ko" : "en"}>
                  {content.ordering.secondaryIntro}
                </p>
              </div>
            </div>
            <ol className="steps-list">
              {content.ordering.steps.map((step, index) => (
                <li className="step-item" key={step.title}>
                  <span className="step-number">0{index + 1}</span>
                  <h3>{step.title}</h3>
                  <p
                    className="step-secondary-title"
                    lang={english ? "ko" : "en"}
                  >
                    {step.secondaryTitle}
                  </p>
                  <p>{step.body}</p>
                  <p className="secondary-copy" lang={english ? "ko" : "en"}>
                    {step.secondaryBody}
                  </p>
                </li>
              ))}
            </ol>
            <p className="order-notice">
              <span aria-hidden="true">i</span>
              <span>
                {content.ordering.notice}
                <br />
                <span lang={english ? "ko" : "en"}>
                  {content.ordering.secondaryNotice}
                </span>
              </span>
            </p>
          </div>
        </section>

        <section className="occasions-section section-shell">
          <div className="section-heading-row">
            <div>
              <p className="eyebrow">{content.occasions.eyebrow}</p>
              <h2>{content.occasions.title}</h2>
              <p className="translated-title" lang={english ? "ko" : "en"}>
                {content.occasions.secondaryTitle}
              </p>
            </div>
          </div>
          <ul className="occasion-list">
            {content.occasions.items.map((item, index) => (
              <li key={item.en}>
                <OccasionIcon index={index} />
                <span>{english ? item.en : item.ko}</span>
                <span
                  className="occasion-secondary"
                  lang={english ? "ko" : "en"}
                >
                  {english ? item.ko : item.en}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="store-section" id="store">
          <div className="section-shell">
            <div className="section-heading-row">
              <div>
                <p className="eyebrow">{content.store.eyebrow}</p>
                <h2>{content.store.title}</h2>
                <p className="translated-title" lang={english ? "ko" : "en"}>
                  {content.store.secondaryTitle}
                </p>
              </div>
              <Link
                className="text-link store-more"
                href={business.links.products[locale]}
              >
                {content.store.link}
                <span aria-hidden="true">↗</span>
                <span className="sr-only" lang={english ? "ko" : "en"}>
                  {content.store.secondaryLink}
                </span>
              </Link>
            </div>
            <div className="store-grid">
              <div className="store-address">
                <span className="store-kicker">
                  {english ? business.name.en : business.name.ko}
                </span>
                <address>
                  {business.address}
                  <br />
                  {business.mall}
                </address>
                <a
                  className="text-link map-link"
                  href={`https://maps.google.com/?q=${encodeURIComponent(`${business.address} ${business.mall}`)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {content.store.mapLink}
                  <span aria-hidden="true">↗</span>
                </a>
              </div>
              <div className="store-hours">
                <h3>{content.store.hoursTitle}</h3>
                <StoreHours locale={locale} />
              </div>
            </div>
            <p className="store-notice">
              {content.store.notice}
              <br />
              <span lang={english ? "ko" : "en"}>
                {content.store.secondaryNotice}
              </span>
            </p>
          </div>
        </section>

        <section className="gallery-section section-shell" id="gallery">
          <div className="section-heading-row">
            <div>
              <p className="eyebrow">{content.gallery.eyebrow}</p>
              <h2>{content.gallery.title}</h2>
              <p className="translated-title" lang={english ? "ko" : "en"}>
                {content.gallery.secondaryTitle}
              </p>
            </div>
            <Link className="text-link" href={business.links.gallery[locale]}>
              {content.gallery.link}
              <span aria-hidden="true">↗</span>
              <span className="sr-only" lang={english ? "ko" : "en"}>
                {content.gallery.secondaryLink}
              </span>
            </Link>
          </div>
          <div className="gallery-grid">
            {[1, 2, 3].map((number) => (
              <div
                className={`gallery-placeholder gallery-placeholder-${number}`}
                key={number}
                role="img"
                aria-label={`${content.gallery.imageLabel} ${number}. ${content.gallery.comingSoon}; ${content.gallery.secondaryComingSoon}`}
              >
                <span className="gallery-number">0{number}</span>
                <span className="gallery-label">
                  {content.gallery.imageLabel} {number}
                </span>
                <span className="gallery-coming">
                  {content.gallery.comingSoon}
                  <br />
                  <span lang={english ? "ko" : "en"}>
                    {content.gallery.secondaryComingSoon}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="invitation-section" id="final-invitation">
          <div className="invitation-inner">
            <p className="eyebrow">{content.invitation.eyebrow}</p>
            <h2>{content.invitation.title}</h2>
            <p className="translated-title" lang={english ? "ko" : "en"}>
              {content.invitation.secondaryTitle}
            </p>
            <a
              className="button button-light"
              href={business.links.customOrder[locale]}
            >
              {content.invitation.button}
              <span aria-hidden="true">↗</span>
            </a>
            <p className="secondary-copy" lang={english ? "ko" : "en"}>
              {content.invitation.secondaryButton}
            </p>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="section-shell footer-main">
          <div className="footer-brand">
            <span>{business.name.en}</span>
            <span lang="ko">{business.name.ko}</span>
          </div>
          <div className="footer-block">
            <h2>{content.footer.addressLabel}</h2>
            <address>
              {business.address}
              <br />
              {business.mall}
            </address>
          </div>
          <div className="footer-block">
            <h2>{content.footer.contactLabel}</h2>
            <p>{business.contact.phone}</p>
            <p>{business.contact.orderEmail}</p>
            <p>{business.contact.instagram}</p>
          </div>
          <nav
            className="footer-block footer-nav"
            aria-label={content.footer.navigation}
          >
            <h2>{content.footer.navigation}</h2>
            <a href={`/${locale}`}>{content.nav.home}</a>
            <a href={business.links.customOrder[locale]}>{content.nav.order}</a>
            <a href="#store">{content.nav.products}</a>
            <a href="#gallery">{content.nav.gallery}</a>
            <a href={business.links.privacy[locale]}>
              {content.footer.privacy}
            </a>
          </nav>
        </div>
        <div className="footer-bottom section-shell">
          <span>
            © {new Date().getFullYear()} {business.name.en} · {business.name.ko}
            . {content.footer.rights}
          </span>
          <Link href={`/${locale}`} aria-label={content.footer.backToTop}>
            ↑
          </Link>
        </div>
      </footer>
    </>
  );
}
