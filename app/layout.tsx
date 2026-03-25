import './globals.css'
import type { Metadata } from 'next'
import ConvexClientProvider from './providers/ConvexClientProvider'
import { CartProvider } from './context/CartContext'
import CartSidebar from './components/CartSidebar'

export const metadata: Metadata = {
  title: 'POSSESSD - Premium Urban Outerwear',
  description: 'Discover the POSSESSD collection. Urban elegance meets innovation. Premium outerwear for the modern explorer.',
  keywords: 'POSSESSD, fashion, luxury, clothing, outerwear, urban, premium',
  authors: [{ name: 'POSSESSD' }],
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
    <ConvexClientProvider>
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
          <CartProvider>
            {children}
            <CartSidebar />
          </CartProvider>
        </body>
      </html>
    </ConvexClientProvider>
  )
}
