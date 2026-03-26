import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shop All',
  description: 'Browse the complete POSSESSD collection. Premium urban outerwear for men and women.',
  openGraph: {
    title: 'Shop All | POSSESSD',
    description: 'Browse the complete POSSESSD collection. Premium urban outerwear for men and women.',
  },
}

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return children
}
