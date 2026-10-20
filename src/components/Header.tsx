import React, { useState } from 'react';
import { Logo } from './Logo';
import {
  Search,
  Heart,
  ShoppingBag,
  User as UserIcon,
  Menu,
  X,
  ShieldCheck,
  Truck,
  Sparkles,
  ChevronDown,
  LogOut,
  SlidersHorizontal,
  ExternalLink,
  MapPin,
  MessageCircle
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useAuth, MASTER_ADMIN_EMAIL } from '../context/AuthContext';

interface HeaderProps {
  currentView: 'store' | 'admin';
  setCurrentView: (view: 'store' | 'admin') => void;
  onCategorySelect?: (cat: string) => void;
  onBrandSelect?: (brand: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  setCurrentView,
  onCategorySelect,
  onBrandSelect
}) => {
  const {
    settings,
    cartCount,
    wishlist,
    setIsCartOpen,
    setIsTrackingOpen,
    currency,
    setCurrency,
    products
  } = useStore();

  const { user, isAdmin, signInWithGoogle, signOutUser } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const filteredSearchResults = searchQuery.trim()
    ? products.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const mapsUrl = settings.mapsUrl || 'https://maps.app.goo.gl/bqe1TWH33FZaQeZz8';
  const ownerWhatsapp = settings.contactPhone || '0314 4933602';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs transition-all w-full max-w-full overflow-hidden">
      {/* Top Utility Bar */}
      <div className="bg-[#0b132b] text-white text-[11px] sm:text-xs py-1.5 sm:py-2 px-3 sm:px-8 flex justify-between items-center transition-colors w-full">
        <div className="flex items-center gap-2 overflow-hidden mx-auto sm:mx-0">
          <span className="flex h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-blue-400 animate-pulse shrink-0" />
          <p className="truncate font-medium text-slate-300 text-center sm:text-left">
            {settings.announcementText || '⚡ OFFICIAL PAK ZON ELECTRONICS • WHATSAPP: 0314 4933602 • 100% GENUINE WARRANTY'}
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-4 shrink-0 text-xs text-slate-300">
          {/* Shop Location on Google Maps */}
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Open Shop Location on Google Maps"
            className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors text-slate-300"
          >
            <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span className="font-semibold">Shop Location</span>
          </a>

          <button
            onClick={() => setIsTrackingOpen(true)}
            className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
          >
            <Truck className="w-3.5 h-3.5 text-blue-400" />
            <span>Track Order</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4 w-full">
        {/* Brand 3D Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              setCurrentView('store');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="cursor-pointer"
          >
            <Logo size="md" />
          </button>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-600">
          <button
            onClick={() => {
              setCurrentView('store');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`transition-colors cursor-pointer ${
              currentView === 'store' ? 'text-blue-600 font-bold' : 'hover:text-blue-600'
            }`}
          >
            Home
          </button>
          <a
            href="#products"
            onClick={() => setCurrentView('store')}
            className="hover:text-blue-600 transition-colors cursor-pointer"
          >
            Smartphones
          </a>
          <a
            href="#categories"
            onClick={() => setCurrentView('store')}
            className="hover:text-blue-600 transition-colors cursor-pointer"
          >
            Categories
          </a>
          <a
            href="#deals"
            onClick={() => setCurrentView('store')}
            className="flex items-center gap-1 text-red-600 hover:text-red-700 transition-colors cursor-pointer"
          >
            <span>Hot Deals</span>
            <span className="bg-red-100 text-red-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              -30%
            </span>
          </a>
          <button
            onClick={() => setIsTrackingOpen(true)}
            className="hover:text-blue-600 transition-colors cursor-pointer"
          >
            Track Order
          </button>
        </nav>

        {/* Search Bar */}
        <div className="hidden lg:block relative w-72 xl:w-80">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search iPhone, Galaxy, laptops..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-slate-800 text-xs rounded-full pl-10 pr-4 py-2.5 border border-transparent focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:outline-hidden transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {filteredSearchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-in fade-in slide-in-from-top-2">
              <p className="text-[11px] font-bold text-slate-400 px-3 py-1 uppercase tracking-wider">
                Products Found
              </p>
              {filteredSearchResults.map((prod) => (
                <a
                  key={prod.id}
                  href={`#product-${prod.id}`}
                  onClick={() => setSearchQuery('')}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <img
                    src={prod.imageUrl}
                    alt={prod.title}
                    className="w-9 h-9 rounded-lg object-cover bg-slate-100"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">{prod.title}</p>
                    <p className="text-[11px] text-slate-400">{prod.specs}</p>
                  </div>
                  <span className="text-xs font-bold text-blue-600">${prod.price}</span>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Mobile Search Toggle */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            title="Search Products"
            className="lg:hidden p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-full transition-colors cursor-pointer"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Wishlist Icon (Desktop/Tablet) */}
          <button
            onClick={() => {
              const el = document.getElementById('products');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            title="Wishlist"
            className="hidden sm:flex relative p-2.5 text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-full transition-colors cursor-pointer"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-scale-in">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart Icon with Counter */}
          <button
            onClick={() => setIsCartOpen(true)}
            title="View Cart"
            className="relative p-2 sm:p-2.5 text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-full transition-colors cursor-pointer group"
          >
            <ShoppingBag className="w-5 h-5 group-hover:scale-105 transition-transform" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] sm:text-[11px] font-extrabold min-w-4.5 sm:min-w-5 h-4.5 sm:h-5 px-1 rounded-full flex items-center justify-center shadow-xs shadow-blue-500/40">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Account / Admin Avatar (Desktop/Tablet) */}
          <div className="hidden sm:block relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-100 transition-colors border border-slate-200 cursor-pointer"
            >
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/30"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                  <UserIcon className="w-4 h-4" />
                </div>
              )}
            </button>

            {/* User Dropdown Menu */}
            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 p-3 z-50 animate-in fade-in slide-in-from-top-2">
                {user ? (
                  <div>
                    <div className="pb-3 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {user.displayName || 'Authorized User'}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      {isAdmin ? (
                        <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                          👑 Verified Admin
                        </span>
                      ) : (
                        <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-medium">
                          Customer Account
                        </span>
                      )}
                    </div>

                    <div className="py-2 space-y-1">
                      <button
                        onClick={() => {
                          setCurrentView('admin');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors text-left"
                      >
                        <ShieldCheck className="w-4 h-4 text-blue-600" />
                        <span>Admin Dashboard</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsTrackingOpen(true);
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors text-left"
                      >
                        <Truck className="w-4 h-4 text-slate-500" />
                        <span>Track My Order</span>
                      </button>
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <button
                        onClick={async () => {
                          await signOutUser();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-2 text-center">
                    <p className="text-xs font-bold text-slate-900 mb-1">Welcome to PAK ZON</p>
                    <p className="text-[11px] text-slate-500 mb-3">
                      Sign in with Google for orders and admin access.
                    </p>
                    <button
                      onClick={async () => {
                        try {
                          await signInWithGoogle();
                          setUserDropdownOpen(false);
                        } catch (e) {
                          console.error(e);
                        }
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                    >
                      Sign In with Google
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2">
          {/* Mobile Search */}
          <div className="relative mb-3">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search iPhone, Galaxy, laptops..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 text-slate-800 text-xs rounded-xl pl-10 pr-4 py-2.5 border border-slate-200 outline-hidden"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Autocomplete Dropdown Mobile */}
          {filteredSearchResults.length > 0 && (
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-2 space-y-1 mb-2">
              <p className="text-[10px] font-bold text-slate-400 px-2 py-0.5 uppercase tracking-wider">
                Matching Items:
              </p>
              {filteredSearchResults.map((prod) => (
                <a
                  key={prod.id}
                  href={`#product-${prod.id}`}
                  onClick={() => {
                    setSearchQuery('');
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2.5 p-1.5 rounded-xl bg-white hover:bg-blue-50 transition-colors"
                >
                  <img
                    src={prod.imageUrl}
                    alt={prod.title}
                    className="w-8 h-8 rounded-lg object-cover bg-slate-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">{prod.title}</p>
                    <p className="text-[10px] text-slate-400">{prod.specs}</p>
                  </div>
                  <span className="text-xs font-bold text-blue-600">${prod.price}</span>
                </a>
              ))}
            </div>
          )}

          {/* Navigation Links */}
          <div className="space-y-1 font-semibold text-sm text-slate-700">
            <button
              onClick={() => {
                setCurrentView('store');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 rounded-lg hover:bg-slate-50 text-blue-600 font-bold"
            >
              Home
            </button>
            <a
              href="#products"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-3 rounded-lg hover:bg-slate-50"
            >
              Smartphones
            </a>
            <a
              href="#categories"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-3 rounded-lg hover:bg-slate-50"
            >
              Categories
            </a>
            <a
              href="#deals"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-2 px-3 rounded-lg text-rose-600 hover:bg-rose-50"
            >
              <span>Best Deals</span>
              <span className="text-[10px] font-extrabold bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full">-30%</span>
            </a>
            <button
              onClick={() => {
                const el = document.getElementById('products');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between py-2 px-3 rounded-lg hover:bg-slate-50 text-left"
            >
              <span className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-500" />
                <span>My Wishlist</span>
              </span>
              <span className="text-xs font-bold bg-slate-100 px-2 py-0.5 rounded-full">{wishlist.length}</span>
            </button>
            <button
              onClick={() => {
                setIsTrackingOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 rounded-lg hover:bg-slate-50 flex items-center gap-2"
            >
              <Truck className="w-4 h-4 text-blue-600" />
              <span>Track Order</span>
            </button>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-slate-50 text-slate-700"
            >
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-500" />
                <span>Shop Location (Google Maps)</span>
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
            <a
              href="https://wa.me/923144933602?text=Assalam-o-Alaikum%20PAK%20ZON%20Electronics!%20I%20have%20an%20inquiry."
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-2 px-3 rounded-lg bg-emerald-50 text-emerald-700 font-bold"
            >
              <span className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                <span>WhatsApp Owner (0314 4933602)</span>
              </span>
            </a>
          </div>

          {/* User Sign In / Profile */}
          <div className="pt-2 border-t border-slate-100">
            {user ? (
              <div className="p-2 bg-slate-50 rounded-xl space-y-2">
                <div className="flex items-center gap-2.5">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || 'User'} className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600">
                      <UserIcon className="w-4 h-4" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-900 truncate">{user.displayName || 'Account'}</p>
                    <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                  </div>
                  {isAdmin && (
                    <span className="text-[9px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">Admin</span>
                  )}
                </div>
                <div className="flex items-center gap-2 pt-1">
                  {isAdmin && (
                    <button
                      onClick={() => {
                        setCurrentView('admin');
                        setMobileMenuOpen(false);
                      }}
                      className="flex-1 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold"
                    >
                      Admin
                    </button>
                  )}
                  <button
                    onClick={async () => {
                      await signOutUser();
                      setMobileMenuOpen(false);
                    }}
                    className="flex-1 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={async () => {
                  try {
                    await signInWithGoogle();
                    setMobileMenuOpen(false);
                  } catch (e) {
                    console.error(e);
                  }
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs"
              >
                Sign In with Google
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
