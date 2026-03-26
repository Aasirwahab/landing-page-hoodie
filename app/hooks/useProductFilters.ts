'use client'

import { useState, useMemo } from 'react'
import { Product } from '../types'

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'newest'

interface FilterState {
  priceMin: string
  priceMax: string
  colors: string[]
  sizes: string[]
  inStockOnly: boolean
  sortBy: SortOption
}

export function useProductFilters(products: Product[] | undefined) {
  const [filters, setFilters] = useState<FilterState>({
    priceMin: '',
    priceMax: '',
    colors: [],
    sizes: [],
    inStockOnly: false,
    sortBy: 'featured',
  })

  const availableColors = useMemo(() => {
    if (!products) return []
    return Array.from(new Set(products.map((p) => p.color))).sort()
  }, [products])

  const availableSizes = useMemo(() => {
    if (!products) return []
    const allSizes = products.flatMap((p) => p.sizes?.map((s) => s.size) ?? [])
    return Array.from(new Set(allSizes)).sort()
  }, [products])

  const filteredProducts = useMemo(() => {
    if (!products) return []

    let result = [...products]

    // Price filter
    if (filters.priceMin) {
      const min = parseFloat(filters.priceMin) * 100
      result = result.filter((p) => p.price >= min)
    }
    if (filters.priceMax) {
      const max = parseFloat(filters.priceMax) * 100
      result = result.filter((p) => p.price <= max)
    }

    // Color filter
    if (filters.colors.length > 0) {
      result = result.filter((p) => filters.colors.includes(p.color))
    }

    // Size filter
    if (filters.sizes.length > 0) {
      result = result.filter((p) =>
        p.sizes?.some((s) => filters.sizes.includes(s.size) && s.inStock)
      )
    }

    // In stock filter
    if (filters.inStockOnly) {
      result = result.filter((p) => p.inStock)
    }

    // Sort
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-asc': return a.price - b.price
        case 'price-desc': return b.price - a.price
        case 'newest': return (b as any)._creationTime - (a as any)._creationTime
        default: return (a.sortOrder ?? 0) - (b.sortOrder ?? 0)
      }
    })

    return result
  }, [products, filters])

  const activeFilterCount = [
    filters.priceMin || filters.priceMax ? 1 : 0,
    filters.colors.length > 0 ? 1 : 0,
    filters.sizes.length > 0 ? 1 : 0,
    filters.inStockOnly ? 1 : 0,
  ].reduce((a, b) => a + b, 0)

  const clearFilters = () => {
    setFilters({
      priceMin: '',
      priceMax: '',
      colors: [],
      sizes: [],
      inStockOnly: false,
      sortBy: filters.sortBy,
    })
  }

  const toggleColor = (color: string) => {
    setFilters((f) => ({
      ...f,
      colors: f.colors.includes(color)
        ? f.colors.filter((c) => c !== color)
        : [...f.colors, color],
    }))
  }

  const toggleSize = (size: string) => {
    setFilters((f) => ({
      ...f,
      sizes: f.sizes.includes(size)
        ? f.sizes.filter((s) => s !== size)
        : [...f.sizes, size],
    }))
  }

  return {
    filters,
    setFilters,
    filteredProducts,
    availableColors,
    availableSizes,
    activeFilterCount,
    clearFilters,
    toggleColor,
    toggleSize,
  }
}
