import React, { useState } from 'react';
import { X, Star, Heart, Check, ShieldCheck, Truck, RotateCcw, Cpu, Wifi, Smartphone, HardDrive } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';

interface QuickViewModalProps {
  product: Product;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose }) => {
  const { formatPrice, addToCart, toggleWishlist, isInWishlist } = useStore();

  const [selectedImage, setSelectedImage] = useState(product.imageUrl);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]?.name || 'Default');
  const [selectedStorage, setSelectedStorage] = useState(product.storageOptions?.[0] || '256GB');
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const isWishlisted = isInWishlist(product.id);
  const images = product.additionalImages && product.additionalImages.length > 0
    ? product.additionalImages
    : [product.imageUrl];

  const handleAdd = () => {
    addToCart(product, {
      color: selectedColor,
      storage: selectedStorage,
      quantity
    });
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-100 p-6 sm:p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left: Images Column */}
          <div className="md:col-span-6 space-y-4">
            <div className="relative w-full h-80 rounded-2xl bg-gradient-to-b from-slate-50 to-slate-100/70 p-6 flex items-center justify-center overflow-hidden border border-slate-100">
              <img
                src={selectedImage}
                alt={product.title}
                className="max-h-64 max-w-full object-contain filter drop-shadow-xl transition-all duration-300"
              />
              <button
                onClick={() => toggleWishlist(product.id)}
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs shadow-md flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
            </div>

            {/* Thumbnail Row */}
            {images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-16 h-16 rounded-xl border-2 p-1 bg-slate-50 overflow-hidden transition-all ${
                      selectedImage === img
                        ? 'border-blue-600 scale-105 shadow-sm'
                        : 'border-transparent hover:border-slate-300'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}

            {/* Specs quick grid */}
            <div className="grid grid-cols-4 gap-2 pt-2">
              <div className="bg-slate-50 rounded-xl p-2.5 text-center border border-slate-100">
                <Smartphone className="w-4 h-4 mx-auto text-blue-600 mb-1" />
                <p className="text-[10px] text-slate-400 font-bold uppercase">Display</p>
                <p className="text-xs font-bold text-slate-800">6.7" OLED</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-2.5 text-center border border-slate-100">
                <HardDrive className="w-4 h-4 mx-auto text-blue-600 mb-1" />
                <p className="text-[10px] text-slate-400 font-bold uppercase">Storage</p>
                <p className="text-xs font-bold text-slate-800">{selectedStorage}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-2.5 text-center border border-slate-100">
                <Cpu className="w-4 h-4 mx-auto text-blue-600 mb-1" />
                <p className="text-[10px] text-slate-400 font-bold uppercase">Chip</p>
                <p className="text-xs font-bold text-slate-800">Flagship</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-2.5 text-center border border-slate-100">
                <Wifi className="w-4 h-4 mx-auto text-blue-600 mb-1" />
                <p className="text-[10px] text-slate-400 font-bold uppercase">Network</p>
                <p className="text-xs font-bold text-slate-800">5G Ready</p>
              </div>
            </div>
          </div>

          {/* Right: Info & Selectors Column */}
          <div className="md:col-span-6 space-y-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                {product.brand}
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-2">{product.title}</h2>
              <p className="text-xs text-slate-500 mt-1">{product.specs}</p>

              {/* Star ratings */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating) ? 'fill-amber-400' : 'text-slate-200 fill-slate-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-700">{product.rating.toFixed(1)}</span>
                <span className="text-xs text-slate-400">({product.reviewCount} reviews)</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-black text-slate-900">{formatPrice(product.price)}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-slate-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              {product.description ||
                'Engineered with premium aerospace-grade chassis, leading-edge mobile silicon, cinematic photography capabilities and ultra-long endurance battery life.'}
            </p>

            {/* Color Selectors */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <p className="text-xs font-bold text-slate-700 mb-2">
                  Color: <span className="font-normal text-slate-500">{selectedColor}</span>
                </p>
                <div className="flex items-center gap-2.5">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      title={c.name}
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                        selectedColor === c.name
                          ? 'ring-2 ring-blue-600 ring-offset-2 scale-110'
                          : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: c.hex }}
                    >
                      {selectedColor === c.name && (
                        <Check
                          className={`w-3.5 h-3.5 ${
                            c.hex.toLowerCase() === '#ffffff' ? 'text-slate-900' : 'text-white'
                          }`}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Storage Selectors */}
            {product.storageOptions && product.storageOptions.length > 0 && (
              <div>
                <p className="text-xs font-bold text-slate-700 mb-2">Storage Capacity:</p>
                <div className="flex flex-wrap gap-2">
                  {product.storageOptions.map((storage) => (
                    <button
                      key={storage}
                      onClick={() => setSelectedStorage(storage)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        selectedStorage === storage
                          ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {storage}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Stepper & Add to Cart Button */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-9 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-200 font-bold transition-colors"
                  >
                    -
                  </button>
                  <span className="w-10 text-center text-xs font-bold text-slate-800">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-9 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-200 font-bold transition-colors"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAdd}
                  className={`flex-1 py-3 px-6 rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer ${
                    addedAnimation
                      ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/30 active:scale-95'
                  }`}
                >
                  {addedAnimation ? 'Added to Cart!' : 'Add to Cart'}
                </button>
              </div>

              {/* Direct WhatsApp with Owner for this product */}
              <a
                href={`https://wa.me/923144933602?text=${encodeURIComponent(
                  `Assalam-o-Alaikum! I want to inquire about ${product.title} (${selectedStorage || 'Standard'}, ${selectedColor || 'Default'}) priced at $${product.price} at PAK ZON Electronics.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300/80 flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Inquire on WhatsApp with Owner (0314 4933602)</span>
              </a>
            </div>

            {/* Assurances */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-blue-500" /> Free Delivery
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-500" /> 1-Year Official Warranty
              </span>
              <span className="flex items-center gap-1">
                <RotateCcw className="w-3.5 h-3.5 text-blue-500" /> 30-Day Return
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
