import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  getDoc
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestoreErrors';
import { Product, CartItem, Order, StoreBanner, StoreSettings } from '../types';
import { INITIAL_PRODUCTS, INITIAL_BANNERS, INITIAL_SETTINGS } from '../data/initialData';

interface StoreContextType {
  products: Product[];
  banners: StoreBanner[];
  settings: StoreSettings;
  orders: Order[];
  cart: CartItem[];
  wishlist: string[];
  currency: 'USD' | 'PKR';
  currencyRate: number;
  formatPrice: (amountInUSD: number) => string;
  setCurrency: (c: 'USD' | 'PKR') => void;
  // Modals & Drawers
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (p: Product | null) => void;
  isTrackingOpen: boolean;
  setIsTrackingOpen: (open: boolean) => void;
  trackingOrderId: string;
  setTrackingOrderId: (id: string) => void;
  lastPlacedOrder: Order | null;
  setLastPlacedOrder: (o: Order | null) => void;
  // Cart Actions
  addToCart: (product: Product, options?: { color?: string; storage?: string; quantity?: number }) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartCount: number;
  // Wishlist Actions
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  // Admin Operations
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Promise<string>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  togglePublishProduct: (id: string, currentStatus: boolean) => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  updateSettings: (newSettings: Partial<StoreSettings>) => Promise<void>;
  seedInitialDataToFirestore: () => Promise<void>;
  placeOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status'>) => Promise<Order>;
  fetchOrderById: (orderNumber: string) => Promise<Order | null>;
  isSyncing: boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const USD_TO_PKR_RATE = 278;

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [banners, setBanners] = useState<StoreBanner[]>(INITIAL_BANNERS);
  const [settings, setSettings] = useState<StoreSettings>(INITIAL_SETTINGS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isSyncing, setIsSyncing] = useState<boolean>(true);
  const [currency, setCurrency] = useState<'USD' | 'PKR'>('USD');

  // UI Drawer & Modal states
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isTrackingOpen, setIsTrackingOpen] = useState<boolean>(false);
  const [trackingOrderId, setTrackingOrderId] = useState<string>('');
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);

  // Cart & Wishlist persisted in localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('pakzon_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('pakzon_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('pakzon_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('pakzon_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Real-time Firestore sync
  useEffect(() => {
    setIsSyncing(true);

    // Sync Products
    const productsRef = collection(db, 'products');
    const unsubProducts = onSnapshot(
      productsRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const loadedProducts = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data()
          })) as Product[];
          setProducts(loadedProducts);
        } else {
          // If Firestore is empty, use initial products
          setProducts(INITIAL_PRODUCTS);
        }
        setIsSyncing(false);
      },
      (error) => {
        console.warn('Firestore Products onSnapshot fallback:', error.message);
        setProducts(INITIAL_PRODUCTS);
        setIsSyncing(false);
      }
    );

    // Sync Banners
    const bannersRef = collection(db, 'banners');
    const unsubBanners = onSnapshot(
      bannersRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const loadedBanners = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data()
          })) as StoreBanner[];
          loadedBanners.sort((a, b) => a.order - b.order);
          setBanners(loadedBanners);
        }
      },
      (error) => {
        console.warn('Firestore Banners fallback:', error.message);
      }
    );

    // Sync Settings
    const settingsDocRef = doc(db, 'settings', 'general');
    const unsubSettings = onSnapshot(
      settingsDocRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setSettings(snapshot.data() as StoreSettings);
        }
      },
      (error) => {
        console.warn('Firestore Settings fallback:', error.message);
      }
    );

    // Sync Orders for Admin / Dashboard
    const ordersRef = collection(db, 'orders');
    const unsubOrders = onSnapshot(
      ordersRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const loadedOrders = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data()
          })) as Order[];
          // Sort by creation date descending
          loadedOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setOrders(loadedOrders);
        }
      },
      (error) => {
        console.warn('Firestore Orders listener note (may require admin auth):', error.message);
      }
    );

    return () => {
      unsubProducts();
      unsubBanners();
      unsubSettings();
      unsubOrders();
    };
  }, []);

  // Price formatting with multi-currency support (USD / PKR)
  const formatPrice = (amountInUSD: number) => {
    if (currency === 'PKR') {
      const pkrAmount = Math.round(amountInUSD * USD_TO_PKR_RATE);
      return `Rs ${pkrAmount.toLocaleString()}`;
    }
    return `$${amountInUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Cart operations
  const addToCart = (product: Product, options?: { color?: string; storage?: string; quantity?: number }) => {
    const selectedColor = options?.color || product.colors?.[0]?.name || '';
    const selectedStorage = options?.storage || product.storageOptions?.[0] || '';
    const quantity = options?.quantity || 1;
    const itemId = `${product.id}_${selectedColor}_${selectedStorage}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === itemId);
      if (existing) {
        return prev.map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        {
          id: itemId,
          productId: product.id,
          product,
          selectedColor,
          selectedStorage,
          quantity
        }
      ];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === itemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const clearCart = () => setCart([]);

  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Wishlist operations
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Firestore Seed Helper for Admin
  const seedInitialDataToFirestore = async () => {
    try {
      // Seed Products
      for (const prod of INITIAL_PRODUCTS) {
        await setDoc(doc(db, 'products', prod.id), prod);
      }
      // Seed Banners
      for (const banner of INITIAL_BANNERS) {
        await setDoc(doc(db, 'banners', banner.id), banner);
      }
      // Seed Settings
      await setDoc(doc(db, 'settings', 'general'), INITIAL_SETTINGS);
      console.log('Successfully seeded catalog to Firestore');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'products');
    }
  };

  // Admin Product Actions
  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt'>): Promise<string> => {
    const id = `pz-prod-${Date.now()}`;
    const newProduct: Product = {
      ...productData,
      id,
      createdAt: new Date().toISOString()
    };
    try {
      await setDoc(doc(db, 'products', id), newProduct);
      setProducts((prev) => [newProduct, ...prev]);
      return id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `products/${id}`);
    }
  };

  const updateProduct = async (id: string, productData: Partial<Product>) => {
    try {
      const productRef = doc(db, 'products', id);
      const payload = {
        ...productData,
        updatedAt: new Date().toISOString()
      };
      await updateDoc(productRef, payload);
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...payload } : p)));
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `products/${id}`);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'products', id));
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `products/${id}`);
    }
  };

  const togglePublishProduct = async (id: string, currentStatus: boolean) => {
    await updateProduct(id, { isPublished: !currentStatus });
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status,
        updatedAt: new Date().toISOString()
      });
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${orderId}`);
    }
  };

  const updateSettings = async (newSettings: Partial<StoreSettings>) => {
    try {
      const ref = doc(db, 'settings', 'general');
      const updated = { ...settings, ...newSettings };
      await setDoc(ref, updated, { merge: true });
      setSettings(updated);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'settings/general');
    }
  };

  // Customer Place Order
  const placeOrder = async (
    orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status'>
  ): Promise<Order> => {
    const orderNumber = `PZ-${Math.floor(100000 + Math.random() * 900000)}`;
    const orderId = `ord-${Date.now()}`;
    const newOrder: Order = {
      ...orderData,
      id: orderId,
      orderNumber,
      status: 'placed',
      createdAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'orders', orderId), newOrder);
      setLastPlacedOrder(newOrder);
      setOrders((prev) => [newOrder, ...prev]);
      clearCart();
      return newOrder;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `orders/${orderId}`);
    }
  };

  // Order Tracking Lookup
  const fetchOrderById = async (orderNumber: string): Promise<Order | null> => {
    const cleanNumber = orderNumber.trim().toUpperCase();
    // First check local orders
    const foundLocal = orders.find(
      (o) => o.orderNumber.toUpperCase() === cleanNumber || o.id === orderNumber
    );
    if (foundLocal) return foundLocal;

    try {
      const ordersRef = collection(db, 'orders');
      const snap = await getDocs(ordersRef);
      for (const d of snap.docs) {
        const orderData = d.data() as Order;
        if (orderData.orderNumber?.toUpperCase() === cleanNumber || d.id === orderNumber) {
          return { ...orderData, id: d.id };
        }
      }
      return null;
    } catch (error) {
      console.warn('fetchOrderById error:', error);
      return null;
    }
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        banners,
        settings,
        orders,
        cart,
        wishlist,
        currency,
        currencyRate: USD_TO_PKR_RATE,
        formatPrice,
        setCurrency,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        quickViewProduct,
        setQuickViewProduct,
        isTrackingOpen,
        setIsTrackingOpen,
        trackingOrderId,
        setTrackingOrderId,
        lastPlacedOrder,
        setLastPlacedOrder,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartSubtotal,
        cartCount,
        toggleWishlist,
        isInWishlist,
        addProduct,
        updateProduct,
        deleteProduct,
        togglePublishProduct,
        updateOrderStatus,
        updateSettings,
        seedInitialDataToFirestore,
        placeOrder,
        fetchOrderById,
        isSyncing
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
