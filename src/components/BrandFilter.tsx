import React from 'react';
import { ChevronRight } from 'lucide-react';

interface BrandFilterProps {
  selectedBrand: string;
  onSelectBrand: (brand: string) => void;
}

export const BrandFilter: React.FC<BrandFilterProps> = ({ selectedBrand, onSelectBrand }) => {
  const brands = [
    { name: 'All Brands', label: 'All' },
    { name: 'Apple', label: 'Apple' },
    { name: 'Samsung', label: 'Samsung' },
    { name: 'Google', label: 'Google' },
    { name: 'OnePlus', label: 'OnePlus' },
    { name: 'Sony', label: 'Sony' }
  ];

  return (
    <section className="py-4 sm:py-6 px-4 sm:px-6 lg:px-8 w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">Shop by Brand</h3>
            <p className="text-[11px] sm:text-xs text-slate-500">Official authentic electronics from trusted global makers</p>
          </div>
          {selectedBrand !== 'All Brands' && (
            <button
              onClick={() => onSelectBrand('All Brands')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              Reset Filter
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-none w-full">
          {brands.map((brand) => {
            const isSelected = selectedBrand === brand.name;
            return (
              <button
                key={brand.name}
                onClick={() => onSelectBrand(brand.name)}
                className={`flex items-center justify-center shrink-0 min-w-[85px] sm:min-w-[120px] px-3.5 py-2 sm:px-5 sm:py-3 rounded-xl sm:rounded-2xl font-bold text-xs transition-all duration-200 border cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20 scale-105'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                }`}
              >
                <span>{brand.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
