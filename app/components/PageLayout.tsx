'use client'

import { ReactNode } from 'react'
import Navigation from './Navigation'
import Footer from './Footer'
import SearchOverlay from './SearchOverlay'

interface PageLayoutProps {
  children: ReactNode
}

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 50%, #16213e 100%)',
      color: 'white',
    }}>
      <Navigation />
      <SearchOverlay />
      <main style={{
        paddingTop: '80px',
        minHeight: 'calc(100vh - 200px)',
      }}>
        {children}
      </main>
      <Footer />
    </div>
  )
}
