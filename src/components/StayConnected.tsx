import React, { useState } from 'react';
import { ArrowRight, Check, Heart, Mail } from 'lucide-react';

export const StayConnected: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
      setSubscribed(false);
    }, 4000);
  };

  return (
    <section className="py-6 sm:py-12 px-3 sm:px-6 lg:px-8 w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto w-full">
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#040919] via-[#081533] to-[#040b1f] text-white p-4 sm:p-10 md:p-12 shadow-2xl border border-blue-900/40">
          {/* Subtle Ambient lights safely clipped */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-1/4 w-48 h-48 sm:w-72 sm:h-72 bg-blue-600/20 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-3 sm:space-y-4 text-left">
              <h2 className="text-xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight break-words">
                Stay Connected
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm max-w-lg font-normal leading-relaxed">
                Get the latest tech updates, secret VIP discount codes, and new arrival notifications directly in your inbox.
              </p>

              {/* Email Form */}
              <form onSubmit={handleSubmit} className="pt-1 max-w-md w-full">
                <div className="relative flex items-center w-full">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="email"
                    required
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-900/90 text-white placeholder-slate-400 text-xs sm:text-sm rounded-full pl-10 pr-12 py-3 border border-slate-700/80 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-hidden transition-all shadow-inner"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center transition-all cursor-pointer shadow-md shadow-blue-500/30"
                  >
                    {subscribed ? <Check className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  </button>
                </div>

                {subscribed && (
                  <p className="text-xs font-bold text-emerald-400 mt-2 animate-in fade-in">
                    ✓ Welcome to the PAK ZON family! Check your inbox for your 10% voucher.
                  </p>
                )}
              </form>
            </div>

            {/* Right Artistic Phone Graphic with Calligraphy Text */}
            <div className="lg:col-span-5 relative flex items-center justify-center sm:justify-end pt-2 sm:pt-0">
              <div className="flex items-center gap-3 sm:gap-4">
                {/* Visual phone angled */}
                <div className="w-20 sm:w-32 h-36 sm:h-52 rounded-xl sm:rounded-2xl overflow-hidden border border-white/20 shadow-2xl rotate-6 shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=400&auto=format&fit=crop"
                    alt="Phone Angle"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Calligraphy Tag matching Reference */}
                <div className="text-sky-200">
                  <p className="font-['Space_Grotesk'] text-base sm:text-xl font-bold tracking-wider italic text-sky-300 drop-shadow-md">
                    Your Next Phone
                  </p>
                  <p className="font-['Space_Grotesk'] text-lg sm:text-2xl font-bold tracking-wider italic text-sky-100 flex items-center gap-1 drop-shadow-md">
                    Awaits
                    <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400 inline" />
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
