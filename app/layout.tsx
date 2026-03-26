import './globals.css'
import type { Metadata } from 'next'
import ConvexClientProvider from './providers/ConvexClientProvider'
import { CartProvider } from './context/CartContext'
import CartSidebar from './components/CartSidebar'

export const metadata: Metadata = {
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
    siteName: 'POSSESSD',
    title: 'POSSESSD - Premium Urban Outerwear',
    description: 'Urban elegance meets innovation. Premium outerwear for the modern explorer.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'POSSESSD - Premium Urban Outerwear',
    description: 'Urban elegance meets innovation. Premium outerwear for the modern explorer.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/remixicon/4.2.0/remixicon.min.css"
          integrity="sha512-MqL4+Io386IOPMKKyplKII0pVW5e+kb+PI/I3N87G3fHIfrgNNsRpzIXEi+0MQC0sR9xZNqZqCYVcC61fL5+Vg=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body suppressHydrationWarning>
        <ConvexClientProvider>
          <CartProvider>
            {children}
            <CartSidebar />
          </CartProvider>
        </ConvexClientProvider>
      </body>
    </html>
  )
}
