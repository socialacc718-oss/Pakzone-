import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  CreditCard,
  CheckCircle,
  Truck,
  ArrowRight,
  ShieldCheck,
  ChevronLeft,
  Lock,
  Package
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { Order } from '../types';

export const CheckoutModal: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    formatPrice,
    isCheckoutOpen,
    setIsCheckoutOpen,
    placeOrder,
    setIsTrackingOpen,
    setTrackingOrderId
  } = useStore();

  const { user } = useAuth();

  const [step, setStep] = useState<'shipping' | 'payment' | 'confirmation'>('shipping');
  const [loading, setLoading] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: user?.displayName || 'Sarah Ahmed',
    email: user?.email || 'sarah.ahmed@example.com',
    address: 'Suit 402, Blue Area Commercial Ave',
    city: 'Islamabad',
    postalCode: '44000',
    phone: '+92 300 1234567',
    paymentMethod: 'card' as 'card' | 'paypal' | 'apple_pay' | 'cod',
    cardNumber: '4532 •••• •••• 8912',
    cardExpiry: '08/28',
    cardCvc: '419'
  });

  if (!isCheckoutOpen) return null;

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderItems = cart.map((item) => ({
        productId: item.product.id,
        title: item.product.title,
        price: item.product.price,
        quantity: item.quantity,
        color: item.selectedColor,
        storage: item.selectedStorage,
        imageUrl: item.product.imageUrl
      }));

      const newOrder = await placeOrder({
        customerName: formData.fullName,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        shippingAddress: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        paymentMethod: formData.paymentMethod,
        items: orderItems,
        subtotal: cartSubtotal,
        shippingCost: 0,
        total: cartSubtotal
      });

      setCreatedOrder(newOrder);
      setStep('confirmation');

      // Trigger realistic celebratory confetti
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error('Order placement error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTrackLive = () => {
    if (createdOrder) {
      setTrackingOrderId(createdOrder.orderNumber);
      setIsCheckoutOpen(false);
      setIsTrackingOpen(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[94vh] overflow-y-auto shadow-2xl border border-slate-100 p-6 sm:p-8 relative">
        {/* Close Button */}
        {step !== 'confirmation' && (
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Stepper Header */}
        {step !== 'confirmation' && (
          <div className="mb-6">
            <div className="flex items-center justify-center gap-3 text-xs font-bold text-slate-500">
              <span
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${
                  step === 'shipping' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                1 Shipping
              </span>
              <span className="text-slate-300">→</span>
              <span
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${
                  step === 'payment' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                2 Payment
              </span>
              <span className="text-slate-300">→</span>
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-400">
                3 Confirmation
              </span>
            </div>
          </div>
        )}

        {/* Step 1: Shipping Address Form */}
        {step === 'shipping' && (
          <form onSubmit={handleShippingSubmit} className="space-y-5">
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Shipping Address</h2>
              <p className="text-xs text-slate-500">Please provide your destination delivery details</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-hidden"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Postal Code</label>
                <input
                  type="text"
                  required
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-hidden"
                />
              </div>
            </div>

            {/* Order Summary box */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-xs space-y-2">
              <div className="flex justify-between font-bold text-slate-700">
                <span>Items ({cart.length})</span>
                <span>{formatPrice(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Express Shipping</span>
                <span className="font-bold text-emerald-600">Free</span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between font-black text-sm text-slate-900">
                <span>Total Amount</span>
                <span className="text-blue-600">{formatPrice(cartSubtotal)}</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
            >
              <span>Continue to Payment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Step 2: Payment Method */}
        {step === 'payment' && (
          <form onSubmit={handlePaymentSubmit} className="space-y-5">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setStep('shipping')}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Payment Method</h2>
                <p className="text-xs text-slate-500">Select your preferred secure payment method</p>
              </div>
            </div>

            {/* Methods options */}
            <div className="space-y-2.5">
              {[
                { id: 'card', name: 'Credit / Debit Card', badge: 'Visa, Mastercard' },
                { id: 'paypal', name: 'PayPal', badge: 'Express Checkout' },
                { id: 'apple_pay', name: 'Apple Pay / Google Pay', badge: 'Instant 1-Tap' },
                { id: 'cod', name: 'Cash on Delivery (COD)', badge: 'Pay upon arrival' }
              ].map((opt) => (
                <label
                  key={opt.id}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    formData.paymentMethod === opt.id
                      ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={formData.paymentMethod === opt.id}
                      onChange={() =>
                        setFormData({ ...formData, paymentMethod: opt.id as any })
                      }
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900">{opt.name}</p>
                      <p className="text-[11px] text-slate-400">{opt.badge}</p>
                    </div>
                  </div>
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                </label>
              ))}
            </div>

            {/* Card Inputs if card selected */}
            {formData.paymentMethod === 'card' && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Card Number</label>
                  <input
                    type="text"
                    required
                    value={formData.cardNumber}
                    onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Expiry Date</label>
                    <input
                      type="text"
                      required
                      value={formData.cardExpiry}
                      onChange={(e) => setFormData({ ...formData, cardExpiry: e.target.value })}
                      placeholder="MM/YY"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">CVV</label>
                    <input
                      type="text"
                      required
                      value={formData.cardCvc}
                      onChange={(e) => setFormData({ ...formData, cardCvc: e.target.value })}
                      placeholder="123"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
            >
              {loading ? (
                <span>Securing Order...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Confirm Payment ({formatPrice(cartSubtotal)})</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Your payment information is 256-bit secure and encrypted</span>
            </div>
          </form>
        )}

        {/* Step 3: Order Confirmation */}
        {step === 'confirmation' && createdOrder && (
          <div className="text-center py-6 space-y-6 animate-in zoom-in-95 duration-300">
            {/* Animated Blue Checkmark Icon */}
            <div className="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto shadow-xl shadow-blue-500/30">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Order Placed Successfully!
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Thank you for your order with PAK ZON ELECTRONICS.
              </p>
              <div className="inline-block mt-3 px-4 py-2 bg-blue-50 border border-blue-200 rounded-xl text-blue-700 font-extrabold text-sm">
                Order ID: {createdOrder.orderNumber}
              </div>
            </div>

            {/* Stylized Box & Phone Visual Mockup matching Reference */}
            <div className="relative max-w-sm mx-auto p-4 rounded-2xl bg-gradient-to-b from-blue-50/70 to-slate-100/60 border border-blue-100 flex items-center justify-center gap-4">
              <div className="w-20 h-24 bg-white rounded-xl shadow-md p-2 flex items-center justify-center">
                <Package className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-800">
                  {createdOrder.items[0]?.title || 'Flagship Smartphone'}
                </p>
                <p className="text-[11px] text-slate-500">
                  {createdOrder.items.length} item(s) • Total: {formatPrice(createdOrder.total)}
                </p>
                <p className="text-xs font-bold text-blue-600 italic mt-1 font-['Space_Grotesk']">
                  Enjoy your new tech! ♡
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 max-w-sm mx-auto">
              <button
                onClick={handleTrackLive}
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/25 transition-all cursor-pointer"
              >
                View Order Tracking
              </button>
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="w-full py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition-all cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
