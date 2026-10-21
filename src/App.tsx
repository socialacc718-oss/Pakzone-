import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { ValueProps } from './components/ValueProps';
import { ProductCard } from './components/ProductCard';
import { PromoBanner } from './components/PromoBanner';
import { BrandFilter } from './components/BrandFilter';
import { CategoriesSection } from './components/CategoriesSection';
import { StayConnected } from './components/StayConnected';
import { Footer } from './components/Footer';
import { QuickViewModal } from './components/QuickViewModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { WhatsAppButton } from './components/WhatsAppButton';
import { AdminDashboard } from './pages/AdminDashboard';
import { ArrowRight, Flame, Sparkles } from 'lucide-react';
import { ScrollReveal, ScrollStaggerContainer, ScrollStaggerItem } from './components/ScrollReveal';

const StoreContent: React.FC = () => {
  const { products, quickViewProduct, setQuickViewProduct } = useStore();
  const [currentView, setCurrentView] = useState<'store' | 'admin'>('store');
  const [selectedBrand, setSelectedBrand] = useState('All Brands');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Filter products based on live criteria
  const publishedProducts = products.filter((p) => p.isPublished);

  const popularSmartphones = publishedProducts.filter((p) => {
    const isPhone = p.category === 'Smartphones';
    const matchesBrand = selectedBrand === 'All Brands' || p.brand === selectedBrand;
    return isPhone && matchesBrand;
  });

  const dealProducts = publishedProducts.filter((p) => p.isDeal || (p.discountPercent && p.discountPercent > 0));

  const allFilteredCatalog = publishedProducts.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesBrand = selectedBrand === 'All Brands' || p.brand === selectedBrand;
    return matchesCat && matchesBrand;
  });

  React.useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#admin') {
        setCurrentView('admin');
      } else if (window.location.hash === '' || window.location.hash === '#store') {
        setCurrentView('store');
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  if (currentView === 'admin') {
    return (
      <AdminDashboard
        onBackToStore={() => {
          window.location.hash = '';
          setCurrentView('store');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-['Plus_Jakarta_Sans',sans-serif] overflow-x-hidden">
      {/* Header */}
      <Header
        currentView={currentView}
        setCurrentView={setCurrentView}
        onCategorySelect={(cat) => setSelectedCategory(cat)}
        onBrandSelect={(brand) => setSelectedBrand(brand)}
      />

      {/* Main Storefront Body */}
      <main className="flex-1 w-full overflow-x-hidden">
        {/* 1. Hero Banner */}
        <ScrollReveal direction="up" duration={0.6} yOffset={20}>
          <HeroBanner />
        </ScrollReveal>

        {/* 2. Value Props Bar */}
        <ScrollReveal direction="up" duration={0.5} yOffset={25} delay={0.1}>
          <ValueProps />
        </ScrollReveal>

        {/* 3. Popular Smartphones Section */}
        <section id="products" className="py-8 sm:py-12 px-3 sm:px-6 lg:px-8 w-full max-w-full overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal direction="up" duration={0.5}>
              <div className="flex items-end justify-between mb-6 sm:mb-8">
                <div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
                    Popular Smartphones
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Discover the most loved devices by our customers.
                  </p>
                </div>

                <a
                  href="#all-products"
                  className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </ScrollReveal>

            {/* Product Grid with Staggered Upward Reveal */}
            <ScrollStaggerContainer
              staggerDelay={0.08}
              className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
            >
              {(popularSmartphones.length > 0 ? popularSmartphones.slice(0, 4) : publishedProducts.slice(0, 4)).map(
                (product) => (
                  <ScrollStaggerItem key={product.id} yOffset={30}>
                    <ProductCard product={product} />
                  </ScrollStaggerItem>
                )
              )}
            </ScrollStaggerContainer>
          </div>
        </section>

        {/* 4. Mid-Page Promotional Banner */}
        <ScrollReveal direction="up" duration={0.6} yOffset={35}>
          <PromoBanner onExploreDeals={() => {
            const el = document.getElementById('deals');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }} />
        </ScrollReveal>

        {/* 5. Shop by Brand */}
        <ScrollReveal direction="up" duration={0.5} yOffset={25}>
          <BrandFilter
            selectedBrand={selectedBrand}
            onSelectBrand={(brand) => setSelectedBrand(brand)}
          />
        </ScrollReveal>

        {/* 6. Best Deals Section */}
        <section id="deals" className="py-8 sm:py-12 px-3 sm:px-6 lg:px-8 w-full max-w-full overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal direction="up" duration={0.5}>
              <div className="flex items-end justify-between mb-6 sm:mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="flex items-center gap-1 text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                      <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-rose-500" />
                      Special Promotions
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
                    Best Deals
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Top offers, Limited time only.
                  </p>
                </div>

                <a
                  href="#all-products"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700"
                >
                  <span>View All Deals</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </ScrollReveal>

            <ScrollStaggerContainer
              staggerDelay={0.08}
              className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
            >
              {(dealProducts.length > 0 ? dealProducts.slice(0, 4) : publishedProducts.slice(4, 8)).map(
                (product) => (
                  <ScrollStaggerItem key={product.id} yOffset={30}>
                    <ProductCard product={product} />
                  </ScrollStaggerItem>
                )
              )}
            </ScrollStaggerContainer>
          </div>
        </section>

        {/* 7. Categories Section */}
        <ScrollReveal direction="up" duration={0.6} yOffset={30}>
          <CategoriesSection
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => setSelectedCategory(cat)}
          />
        </ScrollReveal>

        {/* 8. Full Electronics Catalog */}
        <section id="all-products" className="py-8 sm:py-12 px-3 sm:px-6 lg:px-8 w-full max-w-full overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal direction="up" duration={0.5}>
              <div className="flex items-end justify-between mb-6 sm:mb-8">
                <div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
                    Explore Full Catalog
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Showing {allFilteredCatalog.length} flagship devices and accessories
                  </p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollStaggerContainer
              staggerDelay={0.06}
              className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
            >
              {allFilteredCatalog.map((product) => (
                <ScrollStaggerItem key={product.id} yOffset={25}>
                  <ProductCard product={product} />
                </ScrollStaggerItem>
              ))}
            </ScrollStaggerContainer>
          </div>
        </section>

        {/* 9. Stay Connected (Newsletter) */}
        <ScrollReveal direction="up" duration={0.6} yOffset={30}>
          <StayConnected />
        </ScrollReveal>
      </main>

      {/* Footer */}
      <Footer onOpenAdmin={() => setCurrentView('admin')} />

      {/* Modals and Drawers */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}

      <CartDrawer />
      <CheckoutModal />
      <OrderTrackingModal />
      <WhatsAppButton />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <StoreContent />
      </StoreProvider>
    </AuthProvider>
  );
}
