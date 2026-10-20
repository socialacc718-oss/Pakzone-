import React from 'react';
import { Logo } from './Logo';
import { ShieldCheck, Mail, Phone, MapPin, Truck, MessageCircle, ExternalLink } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface FooterProps {
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  const { settings, setIsTrackingOpen } = useStore();
  const mapsUrl = settings.mapsUrl || 'https://maps.app.goo.gl/bqe1TWH33FZaQeZz8';
  const ownerWhatsapp = settings.contactPhone || '0314 4933602';

  return (
    <footer className="bg-white border-t border-slate-100 text-slate-600 text-xs pt-10 sm:pt-16 pb-8 sm:pb-12 w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-100">
          {/* Brand Info with 3D Logo */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="lg" />

            <p className="text-slate-500 leading-relaxed max-w-sm pt-1">
              Your premier destination for verified authentic smartphones, flagship laptops, and intelligent modern electronics with full official warranty and express fulfillment across Pakistan.
            </p>

            {/* Shop location Google Maps Callout Card */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-50 to-emerald-50/60 border border-blue-100 flex items-center justify-between gap-3 max-w-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-extrabold text-slate-900 text-[11px]">Physical Store Location</p>
                  <p className="text-[10px] text-slate-500">Visit our outlet directly</p>
                </div>
              </div>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] flex items-center gap-1 shadow-xs transition-colors shrink-0"
              >
                <span>View Map</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Social media presence */}
            <div className="flex items-center gap-3 pt-1">
              {['Facebook', 'Instagram', 'YouTube', 'TikTok', 'X'].map((social) => (
                <span
                  key={social}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-600 flex items-center justify-center text-slate-500 font-bold text-[10px] cursor-pointer transition-colors"
                >
                  {social.substring(0, 2)}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-extrabold text-slate-900 text-sm mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#" className="hover:text-blue-600 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#products" className="hover:text-blue-600 transition-colors">
                  Shop All Tech
                </a>
              </li>
              <li>
                <a href="#deals" className="hover:text-blue-600 transition-colors">
                  Best Deals (-30%)
                </a>
              </li>
              <li>
                <button
                  onClick={() => setIsTrackingOpen(true)}
                  className="hover:text-blue-600 transition-colors cursor-pointer text-left"
                >
                  Track Order
                </button>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-extrabold text-slate-900 text-sm mb-4">Categories</h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#products" className="hover:text-blue-600 transition-colors">
                  Smartphones
                </a>
              </li>
              <li>
                <a href="#products" className="hover:text-blue-600 transition-colors">
                  Laptops & MacBooks
                </a>
              </li>
              <li>
                <a href="#products" className="hover:text-blue-600 transition-colors">
                  Audio & Headphones
                </a>
              </li>
              <li>
                <a href="#products" className="hover:text-blue-600 transition-colors">
                  Smartwatches
                </a>
              </li>
              <li>
                <a href="#products" className="hover:text-blue-600 transition-colors">
                  Accessories & Chargers
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Support with Owner WhatsApp & Google Maps */}
          <div className="space-y-4">
            <h4 className="font-extrabold text-slate-900 text-sm">Direct Contact</h4>
            <ul className="space-y-2.5 text-slate-600">
              {/* WhatsApp direct to owner */}
              <li>
                <a
                  href="https://wa.me/923144933602?text=Assalam-o-Alaikum%20PAK%20ZON%20Electronics!%20I%20have%20an%20inquiry."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 rounded-xl bg-emerald-50 border border-emerald-200/80 hover:bg-emerald-100 transition-colors text-emerald-800 font-bold"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600 fill-emerald-600 shrink-0" />
                  <div className="text-left">
                    <span className="text-[10px] text-emerald-600 block uppercase font-extrabold">
                      Owner WhatsApp
                    </span>
                    <span>{ownerWhatsapp}</span>
                  </div>
                </a>
              </li>

              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="truncate">{settings.contactEmail}</span>
              </li>

              {/* Physical Shop Location Link */}
              <li>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 hover:text-blue-600 transition-colors group"
                >
                  <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <div>
                    <span className="font-semibold block text-slate-800 group-hover:text-blue-600">
                      Store Location (Google Maps)
                    </span>
                    <span className="text-[10px] text-slate-400 underline">Click to open directions in Google Maps</span>
                  </div>
                </a>
              </li>
            </ul>

            <div className="pt-2">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Payment Methods
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                {['Cash on Delivery', 'JazzCash', 'EasyPaisa', 'VISA', 'Bank Transfer'].map((method) => (
                  <span
                    key={method}
                    className="px-2 py-1 bg-slate-100 text-slate-700 font-bold rounded text-[10px] border border-slate-200"
                  >
                    {method}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p>© {new Date().getFullYear()} PAK ZON ELECTRONICS. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 font-semibold text-rose-500 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>Google Maps Location</span>
            </a>
            <a href="https://wa.me/923144933602" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-600 font-semibold text-emerald-600 flex items-center gap-1">
              <MessageCircle className="w-3 h-3 fill-emerald-600" />
              <span>WhatsApp: 0314 4933602</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
