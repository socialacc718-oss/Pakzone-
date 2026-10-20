import React, { useState, useRef } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Shield, Cpu, Zap } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const HeroBanner: React.FC = () => {
  const { banners } = useStore();
  const [currentSlide, setCurrentSlide] = useState(0);

  // 3D perspective mouse tracking (applied gently, only on desktop)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const activeBanners = banners.filter((b) => b.isActive);
  const currentBanner = activeBanners[currentSlide] || activeBanners[0];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || window.innerWidth < 1024) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % activeBanners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
  };

  return (
    <section className="relative overflow-hidden bg-[#070e24] text-white py-6 sm:py-16 px-3 sm:px-6 lg:px-8 w-full max-w-full">
      {/* Background ambient lighting glows strictly contained to prevent mobile overflow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 sm:right-1/4 w-48 h-48 sm:w-96 sm:h-96 bg-blue-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 left-0 w-48 h-48 sm:w-80 sm:h-80 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(#1e3a8a_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center min-h-[340px] sm:min-h-[440px]"
        >
          {/* Left Text Content */}
          <div className="lg:col-span-7 z-10 space-y-3 sm:space-y-6 text-left">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-blue-900/70 border border-blue-500/30 text-blue-300 text-[10px] sm:text-xs font-bold tracking-wide uppercase shadow-inner">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-blue-400 animate-ping" />
              <span>{currentBanner?.badge || 'NEW ARRIVAL'}</span>
            </div>

            {/* Title & Subtitle - Responsive Sizing */}
            <div className="space-y-1 sm:space-y-2">
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight break-words">
                {currentBanner?.title || 'iPhone 16 Pro'}
              </h1>
              <p className="text-sm sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-300 via-sky-200 to-white bg-clip-text text-transparent break-words">
                {currentBanner?.subtitle || 'More Power. More Possibilities.'}
              </p>
            </div>

            {/* Description */}
            <p className="text-slate-300 text-xs sm:text-sm lg:text-base leading-relaxed max-w-xl font-normal">
              {currentBanner?.description ||
                'Discover the latest iPhone with advanced titanium design, revolutionary A18 Pro silicon, longer battery life and a stunning cinematic camera system.'}
            </p>

            {/* Feature Pills (Wrapping cleanly on small screens) */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-3 text-[10px] sm:text-xs font-semibold text-slate-300 pt-0.5">
              <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-2 sm:px-2.5 py-1 rounded-lg">
                <Cpu className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-400 shrink-0" />
                <span>A18 Pro Silicon</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-2 sm:px-2.5 py-1 rounded-lg">
                <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-yellow-400 shrink-0" />
                <span>Titanium Finish</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-2 sm:px-2.5 py-1 rounded-lg">
                <Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400 shrink-0" />
                <span>Ceramic Shield</span>
              </div>
            </div>

            {/* CTA Button and Navigation Controls */}
            <div className="flex items-center gap-3 sm:gap-6 pt-1 flex-wrap">
              <a
                href="#products"
                className="inline-flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-600/40 hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer group"
              >
                <span>{currentBanner?.buttonText || 'Shop Now'}</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
              </a>

              {/* Slide Dots */}
              <div className="flex items-center gap-1.5">
                {activeBanners.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    aria-label={`Slide ${idx + 1}`}
                    className={`h-1.5 sm:h-2 transition-all rounded-full cursor-pointer ${
                      currentSlide === idx ? 'w-5 sm:w-8 bg-blue-500' : 'w-1.5 sm:w-2 bg-slate-600 hover:bg-slate-400'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Realistic 3D Showcase (Properly bounded for mobile) */}
          <div className="lg:col-span-5 relative flex items-center justify-center w-full overflow-hidden py-2 sm:py-0">
            {/* Perspective Card bounded to container */}
            <div
              className="relative w-full max-w-[240px] sm:max-w-sm h-[230px] sm:h-[350px] transition-transform duration-200 ease-out flex items-center justify-center mx-auto"
              style={{
                perspective: '1000px',
                transform: `rotateY(${mousePos.x * 8}deg) rotateX(${-mousePos.y * 8}deg)`
              }}
            >
              {/* Back Soft Device Shadow */}
              <div className="absolute bottom-2 sm:bottom-4 w-40 sm:w-64 h-6 sm:h-12 bg-blue-500/25 blur-xl rounded-full pointer-events-none" />

              {/* Device container */}
              <div className="relative z-10 w-full h-full flex items-center justify-center">
                {/* Secondary angled phone in background (hidden on small mobile to prevent overflow) */}
                <div
                  className="absolute right-1 sm:right-6 top-3 w-36 sm:w-52 h-[190px] sm:h-[300px] rounded-[24px] sm:rounded-[36px] bg-gradient-to-tr from-slate-900 via-blue-950 to-slate-800 p-1.5 border border-blue-400/30 shadow-xl opacity-80 hidden min-[480px]:block"
                  style={{
                    transform: `rotate(-8deg)`
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=600&auto=format&fit=crop"
                    alt="Phone Angle"
                    className="w-full h-full object-cover rounded-[20px] sm:rounded-[28px]"
                  />
                </div>

                {/* Primary floating phone */}
                <div
                  className="relative w-44 sm:w-60 h-[210px] sm:h-[310px] rounded-[28px] sm:rounded-[40px] bg-gradient-to-b from-blue-900/90 to-slate-950 p-2 sm:p-2.5 border-2 border-blue-400/40 shadow-2xl transition-all duration-300"
                  style={{
                    transform: `rotate(2deg)`
                  }}
                >
                  {/* Dynamic Island Pill */}
                  <div className="absolute top-2.5 sm:top-3.5 left-1/2 -translate-x-1/2 w-12 sm:w-18 h-3 sm:h-3.5 bg-black rounded-full z-30 flex items-center justify-end px-1 sm:px-1.5">
                    <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-blue-500/60" />
                  </div>

                  {/* Screen Content */}
                  <div className="relative w-full h-full rounded-[22px] sm:rounded-[32px] overflow-hidden bg-slate-950">
                    <img
                      src={currentBanner?.imageUrl || 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=900&auto=format&fit=crop'}
                      alt={currentBanner?.title || 'Featured Phone'}
                      className="w-full h-full object-cover"
                    />

                    {/* Gloss reflection overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />

                    {/* Bottom floating tag */}
                    <div className="absolute bottom-2 left-2 right-2 sm:bottom-2.5 sm:left-2.5 sm:right-2.5 bg-slate-900/90 backdrop-blur-md rounded-xl p-1.5 sm:p-2.5 border border-white/10 flex items-center justify-between">
                      <div className="min-w-0 pr-1">
                        <p className="text-[8px] sm:text-[9px] text-slate-400 uppercase font-semibold">Flagship Edition</p>
                        <p className="text-[10px] sm:text-xs font-bold text-white truncate">{currentBanner?.title}</p>
                      </div>
                      <span className="text-[10px] sm:text-xs font-extrabold text-blue-400 shrink-0">$1,199</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Prev / Next Slider Arrows - Positioned safely inside */}
              <button
                onClick={prevSlide}
                title="Previous Slide"
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-slate-800/90 hover:bg-blue-600 text-white backdrop-blur-md flex items-center justify-center border border-white/10 shadow-lg transition-all cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={nextSlide}
                title="Next Slide"
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-slate-800/90 hover:bg-blue-600 text-white backdrop-blur-md flex items-center justify-center border border-white/10 shadow-lg transition-all cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
