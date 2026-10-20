import React from 'react';
import { Star, Heart, Eye, ShoppingCart, Check } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    formatPrice,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setQuickViewProduct
  } = useStore();

  const [addedAnimation, setAddedAnimation] = React.useState(false);
  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  return (
    <div
      id={`product-${product.id}`}
      className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between relative group cursor-pointer"
      onClick={() => setQuickViewProduct(product)}
    >
      {/* Top Badges & Wishlist */}
      <div className="flex items-center justify-between mb-3 z-10">
        <div className="flex items-center gap-1.5 flex-wrap">
          {product.isBestSeller && (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-600 text-white shadow-xs">
              Best Seller
            </span>
          )}
          {product.discountPercent && product.discountPercent > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-500 text-white shadow-xs">
              -{product.discountPercent}%
            </span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
            isWishlisted
              ? 'bg-rose-50 text-rose-500'
              : 'bg-slate-50 text-slate-400 hover:text-rose-500 hover:bg-rose-50'
          }`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
        </button>
      </div>

      {/* Realistic 3D Product Image Showcase */}
      <div className="relative w-full h-48 mb-4 rounded-xl bg-gradient-to-b from-slate-50/60 to-slate-100/50 flex items-center justify-center overflow-hidden p-3">
        {/* Subtle Pedestal Shadow */}
        <div className="absolute bottom-2 w-28 h-4 bg-slate-300/40 rounded-full blur-md group-hover:scale-110 transition-transform duration-300" />

        <img
          src={product.imageUrl}
          alt={product.title}
          loading="lazy"
          className="max-h-40 max-w-full object-contain filter drop-shadow-md group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300"
        />

        {/* Quick View Hover Pill */}
        <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="bg-white/95 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-blue-600" />
            <span>Quick 3D View</span>
          </span>
        </div>
      </div>

      {/* Product Details */}
      <div className="space-y-1.5 flex-1">
        <h3 className="font-extrabold text-sm sm:text-base text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
          {product.title}
        </h3>

        <p className="text-xs text-slate-500 font-medium line-clamp-1">
          {product.specs || `${product.brand} Flagship Edition`}
        </p>

        {/* Star Ratings */}
        <div className="flex items-center gap-1.5 pt-0.5">
          <div className="flex items-center text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < Math.floor(product.rating) ? 'fill-amber-400' : 'text-slate-200 fill-slate-200'
                }`}
              />
            ))}
          </div>
          <span className="text-xs font-bold text-slate-700">{product.rating.toFixed(1)}</span>
          <span className="text-[11px] text-slate-400">({(product.reviewCount / 1000).toFixed(1)}k)</span>
        </div>

        {/* Pricing */}
        <div className="flex items-baseline gap-2 pt-2">
          <span className="text-base sm:text-lg font-black text-slate-900">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-xs text-slate-400 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </div>

      {/* Action Button: Add to Cart */}
      <div className="pt-4">
        <button
          onClick={handleAddToCart}
          className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${
            addedAnimation
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 active:scale-[0.98]'
          }`}
        >
          {addedAnimation ? (
            <>
              <Check className="w-4 h-4 animate-bounce" />
              <span>Added to Cart!</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" />
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
