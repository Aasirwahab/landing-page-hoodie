import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Men's Collection",
  description: "Premium urban outerwear designed for the modern man. Bold, technical, uncompromising.",
  openGraph: {
    title: "Men's Collection | POSSESSD",
    description: "Premium urban outerwear designed for the modern man. Bold, technical, uncompromising.",
  },
}

export default function MenLayout({ children }: { children: React.ReactNode }) {
  return children
}
