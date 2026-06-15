import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import dynamic from 'next/dynamic';
const Footer = dynamic(() => import('@/components/layout/Footer').then(mod => ({ default: mod.Footer })), { ssr: true });
import { LazyCustomCursor } from '@/components/ui/LazyCustomCursor';

import { JsonLd } from '@/components/seo/JsonLd';
import { GoogleAnalytics } from '@next/third-parties/google';
import { FramerProvider } from '@/components/providers/FramerProvider';



export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
    icons: {
      icon: '/favicon.svg',
      apple: '/favicon.svg',
    },
    openGraph: {
      title: t('og_title'),
      description: t('og_description'),
      type: 'website',
      images: [
        {
          url: '/imagem-compartilhamento.png',
          width: 1200,
          height: 630,
          alt: 'Palaz | Strategy & Design',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('og_title'),
      description: t('og_description'),
      images: ['/imagem-compartilhamento.png'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    metadataBase: new URL('https://palaz.com.br'),
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "pt" | "en")) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <>
      <JsonLd />
      {process.env.NEXT_PUBLIC_GA_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      )}
      <NextIntlClientProvider messages={messages}>
        <FramerProvider>
            <LazyCustomCursor />
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Footer />
        </FramerProvider>
      </NextIntlClientProvider>
    </>
  );
}
