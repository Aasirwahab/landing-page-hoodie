import './globals.css'
import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import ConvexClientProvider from './providers/ConvexClientProvider'
import SmoothScrollProvider from './providers/SmoothScrollProvider'
import { CartProvider } from './context/CartContext'
import CartSidebar from './components/CartSidebar'

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://landing-page-hoodie.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'POSSESSD - Premium Urban Outerwear',
    template: '%s | POSSESSD',
  },
  description: 'Discover the POSSESSD collection. Urban elegance meets innovation. Premium outerwear for the modern explorer.',
  keywords: ['POSSESSD', 'fashion', 'luxury', 'clothing', 'outerwear', 'urban', 'premium', 'jackets', 'streetwear'],
  authors: [{ name: 'POSSESSD' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'POSSESSD',
    title: 'POSSESSD - Premium Urban Outerwear',
    description: 'Urban elegance meets innovation. Premium outerwear for the modern explorer.',
    images: [
      {
        url: '/images/1.webp',
        width: 1200,
        height: 630,
        alt: 'POSSESSD - Premium Urban Outerwear',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'POSSESSD - Premium Urban Outerwear',
    description: 'Urban elegance meets innovation. Premium outerwear for the modern explorer.',
    images: ['/images/1.webp'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: siteUrl,
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0a0a0a',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <head>
        {/* Remixicon - loaded async to prevent render blocking */}
        <link
          rel="preload"
          href="https://cdnjs.cloudflare.com/ajax/libs/remixicon/4.2.0/remixicon.min.css"
          as="style"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/remixicon/4.2.0/remixicon.min.css"
          integrity="sha512-MqL4+Io386IOPMKKyplKII0pVW5e+kb+PI/I3N87G3fHIfrgNNsRpzIXEi+0MQC0sR9xZNqZqCYVcC61fL5+Vg=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body suppressHydrationWarning>
        {/* Skip to main content - accessibility */}
        <a
          href="#main-content"
          className="skip-to-content"
        >
          Skip to main content
        </a>

        <ConvexClientProvider>
          <SmoothScrollProvider>
            <CartProvider>
              <div id="main-content">
                {children}
              </div>
              <CartSidebar />
            </CartProvider>
          </SmoothScrollProvider>
        </ConvexClientProvider>
      </body>
    </html>
  )
}
