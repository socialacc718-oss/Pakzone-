export interface Product {
  id: string;
  title: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  rating: number;
  reviewCount: number;
  specs: string;
  inStock: boolean;
  stockCount: number;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isDeal?: boolean;
  imageUrl: string;
  additionalImages?: string[];
  colors?: { name: string; hex: string }[];
  storageOptions?: string[];
  description?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CartItem {
  id: string; // unique item id (productId + color + storage)
  productId: string;
  product: Product;
  selectedColor?: string;
  selectedStorage?: string;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  color?: string;
  storage?: string;
  imageUrl: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  postalCode: string;
  paymentMethod: 'card' | 'paypal' | 'apple_pay' | 'cod';
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  discountAmount?: number;
  total: number;
  status: 'placed' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt?: string;
}

export interface StoreBanner {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  imageUrl: string;
  accentColor?: string;
  isActive: boolean;
  order: number;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  announcementText: string;
  contactEmail: string;
  contactPhone: string;
  whatsappNumber?: string;
  address: string;
  mapsUrl?: string;
  freeShippingThreshold: number;
  currencySymbol: string;
}
