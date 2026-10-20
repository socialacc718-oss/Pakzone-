import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Package,
  ShoppingCart,
  Image as ImageIcon,
  Settings,
  Plus,
  Trash2,
  Edit3,
  Eye,
  EyeOff,
  LogOut,
  ArrowLeft,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Database,
  ExternalLink,
  Search,
  Sparkles
} from 'lucide-react';
import { useAuth, MASTER_ADMIN_EMAIL } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { Product, Order, StoreBanner, StoreSettings } from '../types';
import { Logo } from '../components/Logo';

interface AdminDashboardProps {
  onBackToStore: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToStore }) => {
  const { user, isAdmin, loading: authLoading, signInWithGoogle, signOutUser } = useAuth();
  const {
    products,
    orders,
    banners,
    settings,
    formatPrice,
    addProduct,
    updateProduct,
    deleteProduct,
    togglePublishProduct,
    updateOrderStatus,
    updateSettings,
    seedInitialDataToFirestore,
    isSyncing
  } = useStore();

  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'banners' | 'settings'>('products');
  const [productSearch, setProductSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState<Omit<Product, 'id' | 'createdAt'>>({
    title: '',
    brand: 'Apple',
    category: 'Smartphones',
    price: 999,
    originalPrice: 1199,
    discountPercent: 16,
    rating: 4.8,
    reviewCount: 1500,
    specs: '256GB • Titanium',
    inStock: true,
    stockCount: 30,
    isFeatured: true,
    isBestSeller: true,
    isDeal: false,
    imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=900&auto=format&fit=crop',
    isPublished: true,
    description: 'Ultra-durable titanium construction with next-generation mobile processor.'
  });

  // Delete Confirmation Modal
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);

  // Settings Form State
  const [settingsForm, setSettingsForm] = useState<StoreSettings>(settings);
  const [settingsSavedMessage, setSettingsSavedMessage] = useState(false);
  const [seedingLoading, setSeedingLoading] = useState(false);

  // --- Auth Gate ---
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="text-center text-white space-y-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-bold">Verifying Administrator Credentials...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center text-white shadow-2xl space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-xl font-black tracking-tight">Protected Admin Portal</h2>
            <p className="text-xs text-slate-400 mt-2">
              Access to this dashboard is strictly restricted by Firebase Authentication & Firestore Security Rules.
            </p>
          </div>

          <div className="bg-slate-800/80 rounded-2xl p-4 text-xs text-left border border-slate-700/60 space-y-2">
            <p className="text-slate-300 font-bold">Authorized Administrator:</p>
            <p className="text-blue-400 font-mono text-[11px] truncate">{MASTER_ADMIN_EMAIL}</p>
            {user && (
              <p className="text-rose-400 text-[11px] pt-1 border-t border-slate-700">
                Current account: <span className="font-semibold">{user.email}</span> (Not Authorized)
              </p>
            )}
          </div>

          <div className="space-y-3 pt-2">
            {!user ? (
              <button
                onClick={signInWithGoogle}
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
              >
                Sign In with Google (Admin)
              </button>
            ) : (
              <button
                onClick={signOutUser}
                className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 transition-all cursor-pointer"
              >
                Sign Out & Switch Account
              </button>
            )}

            <button
              onClick={onBackToStore}
              className="w-full py-2.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Return to Public Store
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- Handlers ---
  const handleOpenAddProduct = () => {
    setEditingProductId(null);
    setProductForm({
      title: '',
      brand: 'Apple',
      category: 'Smartphones',
      price: 999,
      originalPrice: 1199,
      discountPercent: 16,
      rating: 4.8,
      reviewCount: 1200,
      specs: '256GB • Titanium Blue',
      inStock: true,
      stockCount: 25,
      isFeatured: true,
      isBestSeller: false,
      isDeal: false,
      imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=900&auto=format&fit=crop',
      isPublished: true,
      description: 'Aerospace-grade titanium design with revolutionary performance.'
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProductId(prod.id);
    setProductForm({
      title: prod.title,
      brand: prod.brand,
      category: prod.category,
      price: prod.price,
      originalPrice: prod.originalPrice || prod.price,
      discountPercent: prod.discountPercent || 0,
      rating: prod.rating,
      reviewCount: prod.reviewCount,
      specs: prod.specs,
      inStock: prod.inStock,
      stockCount: prod.stockCount,
      isFeatured: !!prod.isFeatured,
      isBestSeller: !!prod.isBestSeller,
      isDeal: !!prod.isDeal,
      imageUrl: prod.imageUrl,
      isPublished: prod.isPublished,
      description: prod.description || ''
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProductId) {
      await updateProduct(editingProductId, productForm);
    } else {
      await addProduct(productForm);
    }
    setIsProductModalOpen(false);
  };

  const confirmDeleteProduct = async () => {
    if (deletingProductId) {
      await deleteProduct(deletingProductId);
      setDeletingProductId(null);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings(settingsForm);
    setSettingsSavedMessage(true);
    setTimeout(() => setSettingsSavedMessage(false), 3000);
  };

  const handleSeedCatalog = async () => {
    if (window.confirm('Do you want to seed the default 12+ flagships catalog to Firestore?')) {
      setSeedingLoading(true);
      await seedInitialDataToFirestore();
      setSeedingLoading(false);
    }
  };

  // KPI Computations
  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.total : 0), 0);
  const lowStockCount = products.filter((p) => p.stockCount <= 20).length;
  const publishedCount = products.filter((p) => p.isPublished).length;

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.brand.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCat = categoryFilter === 'All' || p.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Admin Header */}
      <header className="bg-slate-950 border-b border-slate-800 px-4 sm:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBackToStore}
            className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 px-3 py-2 rounded-xl transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Storefront</span>
          </button>
          <div className="flex items-center gap-3">
            <Logo size="sm" showText={false} />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-white">
                  PAK ZON Control Center
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-bold border border-blue-500/30">
                  Firestore Connected
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Authenticated Admin: <span className="text-slate-200 font-mono">{user.email}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSeedCatalog}
            disabled={seedingLoading}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-cyan-300 border border-cyan-500/30 transition-all cursor-pointer"
          >
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span>{seedingLoading ? 'Seeding...' : 'Seed Catalog'}</span>
          </button>

          <button
            onClick={signOutUser}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-bold border border-rose-500/30 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Admin Workspace */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1 space-y-8">
        {/* KPI Analytics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
              <span>Total Revenue</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-black text-white">{formatPrice(totalRevenue)}</p>
            <p className="text-[11px] text-emerald-400 font-semibold">Real-time orders computed</p>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
              <span>Total Orders</span>
              <ShoppingCart className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-2xl font-black text-white">{orders.length}</p>
            <p className="text-[11px] text-blue-400 font-semibold">
              {orders.filter((o) => o.status === 'placed').length} awaiting fulfillment
            </p>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
              <span>Products Catalog</span>
              <Package className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-2xl font-black text-white">{products.length}</p>
            <p className="text-[11px] text-purple-400 font-semibold">
              {publishedCount} live in store
            </p>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
              <span>Inventory Alert</span>
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl font-black text-white">{lowStockCount}</p>
            <p className="text-[11px] text-amber-400 font-semibold">Items under 20 stock</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
          {[
            { id: 'products', label: 'Products Management', icon: Package },
            { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingCart },
            { id: 'banners', label: 'Hero Banners', icon: ImageIcon },
            { id: 'settings', label: 'Store Settings', icon: Settings }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* --- TAB 1: PRODUCTS MANAGEMENT --- */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1 max-w-md">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="Search catalog by title or brand..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-blue-500 outline-hidden"
                  />
                </div>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white outline-hidden cursor-pointer"
                >
                  <option value="All">All Categories</option>
                  <option value="Smartphones">Smartphones</option>
                  <option value="Laptops">Laptops</option>
                  <option value="Audio">Audio</option>
                  <option value="Wearables">Wearables</option>
                </select>
              </div>

              <button
                onClick={handleOpenAddProduct}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900/80 text-slate-400 uppercase font-bold border-b border-slate-800">
                    <tr>
                      <th className="px-5 py-3.5">Product</th>
                      <th className="px-4 py-3.5">Category</th>
                      <th className="px-4 py-3.5">Price</th>
                      <th className="px-4 py-3.5">Stock</th>
                      <th className="px-4 py-3.5">Status</th>
                      <th className="px-4 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredProducts.map((prod) => (
                      <tr key={prod.id} className="hover:bg-slate-900/40 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <img
                              src={prod.imageUrl}
                              alt={prod.title}
                              className="w-10 h-10 rounded-lg object-contain bg-slate-900 p-1 border border-slate-800 shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="font-bold text-white truncate max-w-xs">{prod.title}</p>
                              <p className="text-[11px] text-slate-400">{prod.specs}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-semibold text-[11px]">
                            {prod.category}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 font-bold text-white">
                          {formatPrice(prod.price)}
                          {prod.originalPrice && prod.originalPrice > prod.price && (
                            <span className="text-[10px] text-slate-500 line-through block">
                              {formatPrice(prod.originalPrice)}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3.5">
                          <span
                            className={`px-2 py-0.5 rounded-md font-bold text-[11px] ${
                              prod.stockCount <= 10
                                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                : prod.stockCount <= 25
                                ? 'bg-amber-500/20 text-amber-400'
                                : 'bg-emerald-500/20 text-emerald-400'
                            }`}
                          >
                            {prod.stockCount} units
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <button
                            onClick={() => togglePublishProduct(prod.id, prod.isPublished)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                              prod.isPublished
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {prod.isPublished ? (
                              <>
                                <Eye className="w-3 h-3" /> Live
                              </>
                            ) : (
                              <>
                                <EyeOff className="w-3 h-3" /> Draft
                              </>
                            )}
                          </button>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEditProduct(prod)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white transition-colors cursor-pointer"
                              title="Edit"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeletingProductId(prod.id)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white transition-colors cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 2: ORDERS MANAGEMENT --- */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-white">Orders Fulfillment</h3>
                <p className="text-xs text-slate-400">
                  Update order tracking stages to inform customers in real-time
                </p>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 text-xs">
                <ShoppingCart className="w-12 h-12 stroke-1 text-slate-600 mx-auto mb-2" />
                <p>No customer orders placed yet. Orders will appear here upon checkout.</p>
              </div>
            ) : (
              <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-900/80 text-slate-400 uppercase font-bold border-b border-slate-800">
                      <tr>
                        <th className="px-5 py-3.5">Order ID</th>
                        <th className="px-4 py-3.5">Customer</th>
                        <th className="px-4 py-3.5">Items</th>
                        <th className="px-4 py-3.5">Total</th>
                        <th className="px-4 py-3.5">Payment</th>
                        <th className="px-4 py-3.5">Status Tracking</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {orders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-slate-900/40 transition-colors">
                          <td className="px-5 py-3.5 font-bold font-mono text-blue-400">
                            #{ord.orderNumber}
                          </td>
                          <td className="px-4 py-3.5">
                            <p className="font-bold text-white">{ord.customerName}</p>
                            <p className="text-[11px] text-slate-400">{ord.city}</p>
                            <p className="text-[11px] text-slate-500 font-mono">{ord.customerPhone}</p>
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="space-y-1">
                              {ord.items.map((it, idx) => (
                                <p key={idx} className="text-[11px] text-slate-300">
                                  {it.quantity}x {it.title}
                                </p>
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-3.5 font-black text-white">
                            {formatPrice(ord.total)}
                          </td>
                          <td className="px-4 py-3.5 uppercase font-bold text-[10px] text-slate-400">
                            {ord.paymentMethod}
                          </td>
                          <td className="px-4 py-3.5">
                            <select
                              value={ord.status}
                              onChange={(e) =>
                                updateOrderStatus(ord.id, e.target.value as Order['status'])
                              }
                              className="bg-slate-900 border border-slate-700 text-xs font-bold rounded-lg px-2.5 py-1 text-slate-200 outline-hidden cursor-pointer"
                            >
                              <option value="placed">Placed</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="out_for_delivery">Out for Delivery</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- TAB 3: BANNERS --- */}
        {activeTab === 'banners' && (
          <div className="space-y-6">
            <h3 className="text-lg font-black text-white">Homepage Hero Banners</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {banners.map((banner) => (
                <div
                  key={banner.id}
                  className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4"
                >
                  <img
                    src={banner.imageUrl}
                    alt={banner.title}
                    className="w-full h-36 object-cover rounded-xl"
                  />
                  <div>
                    <span className="text-[10px] font-bold uppercase text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
                      {banner.badge}
                    </span>
                    <h4 className="font-extrabold text-white text-base mt-1">{banner.title}</h4>
                    <p className="text-xs text-slate-400">{banner.subtitle}</p>
                  </div>
                  <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
                    <span>Slide Order #{banner.order}</span>
                    <span className="text-emerald-400 font-bold">Active Slide</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- TAB 4: STORE SETTINGS --- */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-lg font-black text-white">Store Settings & Customer Policies</h3>
              <p className="text-xs text-slate-400">
                Update global branding and contact information in Firestore
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Store Name</label>
                <input
                  type="text"
                  required
                  value={settingsForm.storeName}
                  onChange={(e) => setSettingsForm({ ...settingsForm, storeName: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Announcement Top Bar Text</label>
                <input
                  type="text"
                  required
                  value={settingsForm.announcementText}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, announcementText: e.target.value })
                  }
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Support Email</label>
                  <input
                    type="email"
                    required
                    value={settingsForm.contactEmail}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, contactEmail: e.target.value })
                    }
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Support Phone</label>
                  <input
                    type="text"
                    required
                    value={settingsForm.contactPhone}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, contactPhone: e.target.value })
                    }
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Owner WhatsApp Helpline</label>
                  <input
                    type="text"
                    value={settingsForm.contactPhone || '0314 4933602'}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, contactPhone: e.target.value, whatsappNumber: e.target.value.replace(/\s+/g, '') })
                    }
                    placeholder="0314 4933602"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Google Maps Shop URL</label>
                  <input
                    type="url"
                    value={settingsForm.mapsUrl || 'https://maps.app.goo.gl/bqe1TWH33FZaQeZz8'}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, mapsUrl: e.target.value })
                    }
                    placeholder="https://maps.app.goo.gl/..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Free Shipping Minimum Threshold ($)
                </label>
                <input
                  type="number"
                  required
                  value={settingsForm.freeShippingThreshold}
                  onChange={(e) =>
                    setSettingsForm({
                      ...settingsForm,
                      freeShippingThreshold: Number(e.target.value)
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white"
                />
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-md cursor-pointer transition-all"
                >
                  Save Store Settings
                </button>
                {settingsSavedMessage && (
                  <span className="text-emerald-400 font-bold text-xs flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" /> Settings updated in Firestore!
                  </span>
                )}
              </div>
            </form>
          </div>
        )}
      </div>

      {/* --- ADD / EDIT PRODUCT MODAL --- */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 space-y-5 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-black text-white">
                {editingProductId ? 'Edit Product' : 'Add New Electronics Product'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={productForm.title}
                  onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                  placeholder="e.g. iPhone 16 Pro Max"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Brand</label>
                  <select
                    value={productForm.brand}
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white cursor-pointer"
                  >
                    <option value="Apple">Apple</option>
                    <option value="Samsung">Samsung</option>
                    <option value="Google">Google</option>
                    <option value="OnePlus">OnePlus</option>
                    <option value="Sony">Sony</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white cursor-pointer"
                  >
                    <option value="Smartphones">Smartphones</option>
                    <option value="Laptops">Laptops</option>
                    <option value="Audio">Audio</option>
                    <option value="Wearables">Wearables</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Price ($)</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) =>
                      setProductForm({ ...productForm, price: Number(e.target.value) })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Original Price ($)</label>
                  <input
                    type="number"
                    value={productForm.originalPrice || ''}
                    onChange={(e) =>
                      setProductForm({ ...productForm, originalPrice: Number(e.target.value) })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Stock Count</label>
                  <input
                    type="number"
                    required
                    value={productForm.stockCount}
                    onChange={(e) =>
                      setProductForm({ ...productForm, stockCount: Number(e.target.value) })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Specs & Subtitle</label>
                <input
                  type="text"
                  required
                  value={productForm.specs}
                  onChange={(e) => setProductForm({ ...productForm, specs: e.target.value })}
                  placeholder="e.g. 256GB • Titanium Blue"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Image URL</label>
                <input
                  type="url"
                  required
                  value={productForm.imageUrl}
                  onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.isPublished}
                    onChange={(e) =>
                      setProductForm({ ...productForm, isPublished: e.target.checked })
                    }
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Publish to Storefront</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.isBestSeller}
                    onChange={(e) =>
                      setProductForm({ ...productForm, isBestSeller: e.target.checked })
                    }
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Best Seller Badge</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.isDeal}
                    onChange={(e) => setProductForm({ ...productForm, isDeal: e.target.checked })}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Include in Best Deals</span>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-md cursor-pointer"
                >
                  {editingProductId ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- DELETION CONFIRMATION MODAL --- */}
      {deletingProductId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-black text-white">Delete Product?</h4>
              <p className="text-xs text-slate-400 mt-1">
                Are you sure you want to permanently delete this product from Firestore? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeletingProductId(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteProduct}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-md shadow-rose-600/30"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
