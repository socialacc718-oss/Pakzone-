import React from 'react';
import { Truck, ShieldCheck, Headphones, RotateCcw } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const ValueProps: React.FC = () => {
  const { settings, formatPrice } = useStore();

  const perks = [
    {
      icon: <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />,
      title: 'Free Shipping',
      desc: `On orders over ${formatPrice(settings.freeShippingThreshold || 50)}`
    },
    {
      icon: <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />,
      title: 'Secure Payment',
      desc: '100% encrypted & verified'
    },
    {
      icon: <Headphones className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />,
      title: '24/7 Support',
      desc: "We're here to help anytime"
    },
    {
      icon: <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />,
      title: 'Easy Returns',
      desc: '30-day hassle-free policy'
    }
  ];

  return (
    <section className="bg-white border-y border-slate-100 py-4 sm:py-6 px-4 sm:px-6 lg:px-8 w-full max-w-full">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:divide-x lg:divide-slate-100">
          {perks.map((perk, index) => (
            <div
              key={index}
              className={`flex items-center gap-2.5 sm:gap-3.5 ${
                index > 0 ? 'lg:pl-6' : ''
              } group transition-transform duration-200`}
            >
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-blue-50 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center shrink-0 transition-colors duration-300">
                {React.cloneElement(perk.icon, {
                  className: 'w-4 h-4 sm:w-5 sm:h-5 transition-colors group-hover:text-white'
                })}
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                  {perk.title}
                </h4>
                <p className="text-[10px] sm:text-xs text-slate-500 font-medium truncate">{perk.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
