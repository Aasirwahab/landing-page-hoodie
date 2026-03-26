import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Women's Collection",
  description: "Premium urban outerwear crafted for the modern woman. Elegant, powerful, distinctive.",
  openGraph: {
    title: "Women's Collection | POSSESSD",
    description: "Premium urban outerwear crafted for the modern woman. Elegant, powerful, distinctive.",
  },
}

export default function WomenLayout({ children }: { children: React.ReactNode }) {
  return children
}
