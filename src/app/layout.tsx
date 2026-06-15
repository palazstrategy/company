import localFont from 'next/font/local';
import '@/style.css';
import { Metadata } from 'next';
import { SmoothScrolling } from '@/components/SmoothScrolling';

export const metadata: Metadata = {
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

const ttNormsPro = localFont({
  src: [
    { path: '../fonts/TTNormsPro-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/TTNormsPro-Medium.woff2', weight: '500', style: 'normal' },
    { path: '../fonts/TTNormsPro-DemiBold.woff2', weight: '600', style: 'normal' },
    { path: '../fonts/TTNormsPro-Bold.woff2', weight: '700', style: 'normal' },
  ],
  display: 'swap',
  variable: '--font-tt-norms',
});

const ttRamillas = localFont({
  src: [
    { path: '../fonts/TTRamillas-VariableItalic.woff2', style: 'italic' },
  ],
  display: 'swap',
  variable: '--font-tt-ramillas',
});



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className={`${ttNormsPro.variable} ${ttRamillas.variable} antialiased`}>
      <body className="font-sans w-full min-h-screen cursor-none md:cursor-none bg-black text-white">
        <SmoothScrolling>
          {children}
        </SmoothScrolling>
      </body>
    </html>
  );
}
