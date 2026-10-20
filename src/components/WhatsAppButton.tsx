import React, { useState } from 'react';
import { MessageCircle, X, Send, PhoneCall, Sparkles, CheckCheck } from 'lucide-react';
import { LOGO_ASSET_URL } from '../lib/assets';

export const WhatsAppButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');
  const ownerNumber = '03144933602';
  const ownerFormatted = '0314 4933602';
  const whatsappUrl = 'https://wa.me/923144933602';

  const handleSendMessage = (textToSend?: string) => {
    const message = textToSend || customMsg || 'Assalam-o-Alaikum! I want to inquire about products at PAK ZON Electronics.';
    const encoded = encodeURIComponent(message);
    window.open(`${whatsappUrl}?text=${encoded}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end select-none max-w-[calc(100vw-2rem)]">
      {/* Popover Mini Chat Box */}
      {isOpen && (
        <div className="mb-3 sm:mb-4 w-[calc(100vw-2rem)] max-w-sm sm:w-88 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center p-0.5 border border-white/30">
                  <img
                    src={LOGO_ASSET_URL}
                    alt="PAK ZON Owner"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-emerald-700" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold leading-tight">PAK ZON Support</h4>
                <p className="text-[11px] text-emerald-100 font-medium flex items-center gap-1">
                  <span>Owner: {ownerFormatted}</span>
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Body */}
          <div className="p-4 bg-slate-50/70 space-y-3 text-xs">
            {/* Owner automated greeting bubble */}
            <div className="bg-white p-3 rounded-2xl rounded-tl-xs shadow-xs border border-slate-100 max-w-[90%] space-y-1">
              <p className="font-bold text-slate-800 text-[11px]">PAK ZON Electronics</p>
              <p className="text-slate-600 leading-relaxed">
                Assalam-o-Alaikum! Welcome to PAK ZON Electronics. Direct owner WhatsApp helpline pe aapka swagat hai. Kese madad karein aapki?
              </p>
              <div className="flex items-center justify-end gap-1 text-[10px] text-slate-400 pt-1">
                <span>Just now</span>
                <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
              </div>
            </div>

            {/* Quick Question Chips */}
            <div className="space-y-1.5 pt-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Quick Inquiries:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Do you have iPhone 16 in stock?',
                  'What is the best price for Galaxy S24?',
                  'Can I pick up at the shop?',
                  'Warranty details?'
                ].map((chip) => (
                  <button
                    key={chip}
                    onClick={() => handleSendMessage(chip)}
                    className="text-[11px] font-semibold bg-white hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 px-2.5 py-1.5 rounded-xl border border-slate-200 transition-all text-left cursor-pointer"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Input & Direct Send */}
          <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
            <input
              type="text"
              placeholder="Type your message..."
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 bg-slate-100 text-slate-800 text-xs rounded-xl px-3 py-2.5 border border-transparent focus:border-emerald-500 focus:bg-white outline-hidden"
            />
            <button
              onClick={() => handleSendMessage()}
              className="w-10 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center transition-all shadow-md shadow-emerald-500/20 cursor-pointer shrink-0"
              title="Send to WhatsApp"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Main Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2.5 bg-gradient-to-tr from-emerald-600 to-teal-500 text-white px-4 py-3.5 rounded-full shadow-2xl shadow-emerald-600/40 hover:shadow-emerald-500/60 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
        aria-label="Contact Owner on WhatsApp"
      >
        {/* Animated Ripple ring */}
        <span className="absolute -inset-1 rounded-full bg-emerald-400 opacity-30 group-hover:opacity-60 animate-ping pointer-events-none" />

        {/* WhatsApp Icon */}
        <div className="w-6 h-6 flex items-center justify-center relative z-10">
          <MessageCircle className="w-6 h-6 fill-white text-emerald-600" />
        </div>

        {/* Text Label */}
        <div className="hidden sm:flex flex-col text-left relative z-10">
          <span className="text-[10px] font-bold text-emerald-100 uppercase tracking-wider leading-none">
            Chat with Owner
          </span>
          <span className="text-xs font-black tracking-tight">{ownerFormatted}</span>
        </div>
      </button>
    </div>
  );
};
