import { Id } from "../../convex/_generated/dataModel";

export interface Product {
  _id: Id<"products">;
  title: string;
  color: string;
  price: number;
  priceFormatted: string;
  background: string;
  imageStorageId?: Id<"_storage">;
  imageUrl?: string;
  thumbBackground: string;
  slug: string;
  description?: string;
  category: "men" | "women" | "unisex";
  featured: boolean;
  inStock: boolean;
  sizes?: { size: string; inStock: boolean; quantity?: number }[];
  tags?: string[];
  sortOrder?: number;
  images?: { storageId?: string; url?: string; alt?: string; sortOrder: number }[];
}

export interface NavigationItem {
  href: string;
  label: string;
  icon?: string;
  isActive?: boolean;
  marginLeft?: boolean;
  onClick?: () => void;
}

export interface SocialLink {
  href: string;
  label: string;
}

export interface CartItem {
  productId: Id<"products">;
  quantity: number;
  size?: string;
  product: Product | null;
}

export interface Address {
  label: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
}
