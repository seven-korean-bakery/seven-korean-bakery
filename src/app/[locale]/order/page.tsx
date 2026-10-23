import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getContent } from "@/content";
import { isLocale } from "@/lib/locales";
import { business } from "@/lib/business";
import { SiteHeader } from "@/components/ui/site-header";
import { OrderInquiryForm } from "@/components/sections/order-inquiry-form";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/order">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const copy = getContent(locale).orderInquiry;
  return {
    title: `${copy.title} | ${getContent(locale).siteTitle}`,
    description: copy.notice,
  };
}

export default async function OrderPage({
  params,
}: PageProps<"/[locale]/order">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = getContent(locale);
  const copy = content.orderInquiry;
  return (
    <>
      <a className="skip-link" href="#main-content">
        {content.skipToContent}
      </a>
      <SiteHeader locale={locale} />
      <main id="main-content" className="section-shell inquiry-page">
        <p className="eyebrow">{content.siteTitle}</p>
        <h1>{copy.title}</h1>
        <p className="hero-intro">{copy.intro}</p>
        <p className="inquiry-notice">{copy.notice}</p>
        <aside className="inquiry-unavailable" id="inquiry-unavailable">
          <p>{copy.unavailable}</p>
          <p>
            {copy.contact}: {business.contact.phone}
          </p>
        </aside>
        <OrderInquiryForm locale={locale} />
      </main>
    </>
  );
}
