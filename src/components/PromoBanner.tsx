import React from 'react';
import { ArrowRight, Heart } from 'lucide-react';

interface PromoBannerProps {
  onExploreDeals?: () => void;
}

export const PromoBanner: React.FC<PromoBannerProps> = ({ onExploreDeals }) => {
  return (
    <section className="py-4 sm:py-8 px-3 sm:px-6 lg:px-8 w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto w-full">
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#071330] via-[#0c235c] to-[#08183a] text-white p-4 sm:p-10 md:p-12 shadow-2xl border border-blue-500/20">
          {/* Ambient decorative lighting safely clipped */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-1/3 w-48 h-48 sm:w-80 sm:h-80 bg-blue-500/25 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 right-4 w-48 h-48 sm:w-96 sm:h-96 bg-cyan-400/10 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-3 sm:space-y-4 text-left">
              <span className="inline-block text-[11px] sm:text-xs uppercase font-extrabold tracking-widest text-blue-300 bg-blue-900/60 px-3 py-1 rounded-full border border-blue-400/30">
                Limited Time Offer
              </span>

              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight break-words">
                Up to <span className="text-blue-400">30% Off</span> <br className="hidden sm:inline" />
                On Selected Flagships
              </h2>

              <p className="text-slate-300 text-xs sm:text-sm lg:text-base max-w-md font-medium leading-relaxed">
                Upgrade to the newest generation smartphones and premium electronics with official warranty and free nationwide shipping.
              </p>

              <div className="pt-1">
                <a
                  href="#deals"
                  onClick={onExploreDeals}
                  className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-white text-blue-950 font-extrabold text-xs sm:text-sm hover:bg-blue-50 hover:shadow-lg hover:shadow-white/20 transition-all cursor-pointer group"
                >
                  <span>Shop Deals</span>
                  <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>

            {/* Right 3D Lineup Showcase with Handwritten Accent */}
            <div className="lg:col-span-6 relative flex items-center justify-center w-full overflow-hidden pt-4 sm:pt-0">
              {/* Handwritten style accent tag */}
              <div className="absolute top-0 right-2 sm:right-6 z-20 flex flex-col items-end pointer-events-none text-sky-200">
                <span className="font-['Space_Grotesk'] text-base sm:text-xl font-bold tracking-wider italic text-sky-300 drop-shadow-md">
                  Better
                </span>
                <span className="font-['Space_Grotesk'] text-base sm:text-xl font-bold tracking-wider italic text-sky-200 drop-shadow-md">
                  Faster
                </span>
                <span className="font-['Space_Grotesk'] text-base sm:text-xl font-bold tracking-wider italic text-sky-100 flex items-center gap-1">
                  Smarter
                  <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400 inline" />
                </span>
              </div>

              {/* 3D Angled Devices Lineup bounded to card container */}
              <div className="relative w-full max-w-[280px] sm:max-w-[380px] h-48 sm:h-64 flex items-center justify-center mx-auto overflow-hidden">
                {/* Phone 1 (Left tilt - visible on larger mobile and up) */}
                <div
                  className="absolute left-1 sm:left-4 w-24 sm:w-36 h-36 sm:h-56 rounded-xl sm:rounded-2xl overflow-hidden shadow-xl border border-white/20 -rotate-12 transition-transform duration-300 hidden min-[400px]:block"
                  style={{ transformOrigin: 'bottom center' }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=400&auto=format&fit=crop"
                    alt="Pixel 9"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-blue-950/20" />
                </div>

                {/* Phone 2 (Center flagship) */}
                <div className="relative z-10 w-28 sm:w-40 h-44 sm:h-60 rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border-2 border-blue-400/60 hover:scale-105 transition-transform duration-300">
                  <img
                    src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=400&auto=format&fit=crop"
                    alt="iPhone 16 Pro"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 via-transparent to-transparent" />
                </div>

                {/* Phone 3 (Right tilt - visible on larger mobile and up) */}
                <div
                  className="absolute right-1 sm:right-4 w-24 sm:w-36 h-36 sm:h-56 rounded-xl sm:rounded-2xl overflow-hidden shadow-xl border border-white/20 rotate-12 transition-transform duration-300 hidden min-[400px]:block"
                  style={{ transformOrigin: 'bottom center' }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=400&auto=format&fit=crop"
                    alt="Galaxy S24"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-blue-950/20" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
