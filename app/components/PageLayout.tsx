'use client'

import { ReactNode } from 'react'
import Navigation from './Navigation'
import Footer from './Footer'
import SearchOverlay from './SearchOverlay'
import CartSidebar from './CartSidebar'

interface PageLayoutProps {
  children: ReactNode
}

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="page-layout">
      <Navigation />
      <SearchOverlay />
      <CartSidebar />
      <main className="page-layout-main">
        {children}
      </main>
      <Footer />
    </div>
  )
}
