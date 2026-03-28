'use client'

import { Product } from '../types'

interface ProductJsonLdProps {
  product: Product
  averageRating?: number
  reviewCount?: number
}

export default function ProductJsonLd({ product, averageRating, reviewCount }: ProductJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${product.title} - ${product.color}`,
    description: product.description || `${product.title} ${product.color} - Premium urban outerwear by POSSESSD`,
    image: product.imageUrl || '/images/1.webp',
    brand: {
      '@type': 'Brand',
      name: 'POSSESSD',
    },
    color: product.color,
    category: product.category,
    offers: {
      '@type': 'Offer',
      price: (product.price / 100).toFixed(2),
      priceCurrency: 'USD',
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    },
    ...(averageRating && reviewCount && reviewCount > 0
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: averageRating,
            reviewCount: reviewCount,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
