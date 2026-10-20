import React from 'react';
import { Smartphone, Laptop, Headphones, Watch, Gamepad2, Cpu, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface CategoriesSectionProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  selectedCategory,
  onSelectCategory
}) => {
  const { products } = useStore();

  const categories = [
    {
      name: 'Smartphones',
      desc: 'Latest flagships & 5G devices',
      icon: Smartphone,
      count: products.filter((p) => p.category === 'Smartphones').length
    },
    {
      name: 'Laptops',
      desc: 'MacBooks & powerhouse ultrabooks',
      icon: Laptop,
      count: products.filter((p) => p.category === 'Laptops').length
    },
    {
      name: 'Audio',
      desc: 'ANC headphones & wireless earbuds',
      icon: Headphones,
      count: products.filter((p) => p.category === 'Audio').length
    },
    {
      name: 'Wearables',
      desc: 'Smartwatches & fitness trackers',
      icon: Watch,
      count: products.filter((p) => p.category === 'Wearables').length
    }
  ];

  return (
    <section id="categories" className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-50/60">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
              Browse Categories
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              Top Electronics Categories
            </h2>
          </div>

          {selectedCategory !== 'All' && (
            <button
              onClick={() => onSelectCategory('All')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              Show All Products
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.name;

            return (
              <div
                key={cat.name}
                onClick={() => onSelectCategory(isSelected ? 'All' : cat.name)}
                className={`p-3.5 sm:p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between group ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-500/25 -translate-y-1'
                    : 'bg-white text-slate-800 border-slate-100 hover:border-blue-200 hover:shadow-lg hover:-translate-y-1'
                }`}
              >
                <div className="flex items-center justify-between mb-3 sm:mb-6">
                  <div
                    className={`w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4 sm:w-6 sm:h-6" />
                  </div>
                  <span
                    className={`text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {cat.count} items
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-sm sm:text-base tracking-tight truncate">{cat.name}</h3>
                  <p
                    className={`text-[10px] sm:text-xs mt-0.5 line-clamp-1 ${
                      isSelected ? 'text-blue-100' : 'text-slate-500'
                    }`}
                  >
                    {cat.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
