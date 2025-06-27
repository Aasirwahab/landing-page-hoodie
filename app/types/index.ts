export interface Product {
  id: number
  title: string
  color: string
  price: string
  background: string
  image: string
  thumbBackground: string
}

export interface NavigationItem {
  href: string
  label: string
  icon?: string
  isActive?: boolean
  marginLeft?: boolean
}

export interface SocialLink {
  href: string
  label: string
} 