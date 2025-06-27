'use client'

import { NavigationItem } from '../types'

const navigationItems: NavigationItem[] = [
  { href: '#', label: 'Men', isActive: true },
  { href: '#', label: 'Women' },
  { href: '#', label: 'Customise' },
  { href: '#', label: 'Search', icon: 'ri-search-line', marginLeft: true },
  { href: '#', label: 'My Account' },
  { href: '#', label: '', icon: 'ri-shopping-bag-fill' },
]

export default function Navigation() {
  return (
    <nav>
      {navigationItems.map((item, index) => (
        <a
          key={index}
          href={item.href}
          className={item.isActive ? 'active' : ''}
          style={item.marginLeft ? { marginLeft: 'auto' } : {}}
        >
          {item.icon && <i className={item.icon}></i>}
          {item.label && ` ${item.label}`}
        </a>
      ))}
    </nav>
  )
} 