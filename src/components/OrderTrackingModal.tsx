import React, { useState, useEffect } from 'react';
import {
  X,
  Truck,
  Package,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  Search,
  Navigation
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Order } from '../types';

export const OrderTrackingModal: React.FC = () => {
  const {
    isTrackingOpen,
    setIsTrackingOpen,
    trackingOrderId,
    setTrackingOrderId,
    fetchOrderById,
    formatPrice,
    orders
  } = useStore();

  const [inputOrderNumber, setInputOrderNumber] = useState(trackingOrderId || '');
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [searching, setSearching] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (trackingOrderId) {
      setInputOrderNumber(trackingOrderId);
      loadOrder(trackingOrderId);
    } else if (orders.length > 0 && !currentOrder) {
      // Default to latest order if available
      setCurrentOrder(orders[0]);
      setInputOrderNumber(orders[0].orderNumber);
    }
  }, [trackingOrderId, orders]);

  const loadOrder = async (num: string) => {
    if (!num.trim()) return;
    setSearching(true);
    setNotFound(false);
    const result = await fetchOrderById(num);
    if (result) {
      setCurrentOrder(result);
      setNotFound(false);
    } else {
      setNotFound(true);
    }
    setSearching(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadOrder(inputOrderNumber);
  };

  if (!isTrackingOpen) return null;

  const steps = [
    { key: 'placed', label: 'Order Placed', time: 'Confirmed instantly' },
    { key: 'processing', label: 'Processing', time: 'Inspected & packaged' },
    { key: 'shipped', label: 'Shipped', time: 'Dispatched via Express Courier' },
    { key: 'out_for_delivery', label: 'Out for Delivery', time: 'Courier in transit' },
    { key: 'delivered', label: 'Delivered', time: 'Package handed over' }
  ];

  const getStepStatus = (stepKey: string) => {
    if (!currentOrder) return 'upcoming';
    const statusOrder = ['placed', 'processing', 'shipped', 'out_for_delivery', 'delivered'];
    const currentIndex = statusOrder.indexOf(currentOrder.status);
    const stepIndex = statusOrder.indexOf(stepKey);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-100 p-6 sm:p-7 relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Track Your Order</h2>
          </div>
          <button
            onClick={() => setIsTrackingOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Order Number bar */}
        <form onSubmit={handleSearch} className="mt-4 flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Enter Order ID (e.g. PZ-764512)"
              value={inputOrderNumber}
              onChange={(e) => setInputOrderNumber(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 focus:bg-white focus:border-blue-500 outline-hidden"
            />
          </div>
          <button
            type="submit"
            disabled={searching}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            {searching ? 'Locating...' : 'Track'}
          </button>
        </form>

        {notFound && (
          <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs text-center">
            No order found with ID <span className="font-bold">{inputOrderNumber}</span>. Please verify your order number.
          </div>
        )}

        {currentOrder ? (
          <div className="mt-6 space-y-6">
            <div className="flex items-center justify-between bg-blue-50/60 p-3.5 rounded-2xl border border-blue-100">
              <div>
                <p className="text-[11px] font-bold text-blue-600 uppercase">Live Tracking</p>
                <p className="text-sm font-black text-slate-900">Order #{currentOrder.orderNumber}</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-600 text-white capitalize shadow-xs">
                {currentOrder.status.replace(/_/g, ' ')}
              </span>
            </div>

            {/* Tracking Stepper Timeline */}
            <div className="space-y-4 pl-2">
              {steps.map((st, idx) => {
                const status = getStepStatus(st.key);
                return (
                  <div key={st.key} className="flex items-start gap-4 relative">
                    {/* Connecting line */}
                    {idx < steps.length - 1 && (
                      <div
                        className={`absolute left-4 top-8 w-0.5 h-10 ${
                          status === 'completed' ? 'bg-blue-600' : 'bg-slate-200'
                        }`}
                      />
                    )}

                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${
                        status === 'completed'
                          ? 'bg-blue-600 text-white'
                          : status === 'current'
                          ? 'bg-blue-600 text-white ring-4 ring-blue-100 animate-pulse'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {status === 'completed' ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : status === 'current' ? (
                        <Clock className="w-4 h-4" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-slate-300" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p
                          className={`text-xs font-bold ${
                            status === 'upcoming' ? 'text-slate-400' : 'text-slate-900'
                          }`}
                        >
                          {st.label}
                        </p>
                        <span className="text-[10px] text-slate-400">{st.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        {status === 'current'
                          ? 'Current status - Express courier updating location'
                          : status === 'completed'
                          ? 'Step completed successfully'
                          : 'Pending previous stages'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Estimated Delivery & Address */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-3 text-xs">
              <div className="flex items-center gap-2.5 text-slate-700">
                <Calendar className="w-4 h-4 text-blue-600" />
                <div>
                  <span className="text-[11px] text-slate-400 block font-semibold">Estimated Delivery</span>
                  <span className="font-bold">Next 24-48 Hours Express</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-slate-700">
                <MapPin className="w-4 h-4 text-blue-600" />
                <div>
                  <span className="text-[11px] text-slate-400 block font-semibold">Delivery Address</span>
                  <span className="font-bold">
                    {currentOrder.shippingAddress}, {currentOrder.city}
                  </span>
                </div>
              </div>
            </div>

            {/* Delivery Map Route Preview matching reference image */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 h-36 flex items-center justify-center">
              <div className="absolute inset-0 bg-[radial-gradient(#93c5fd_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

              {/* Simulated Map Route Graphic */}
              <div className="relative z-10 w-full px-8 flex items-center justify-between">
                <div className="flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shadow-sm">
                    <Package className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-bold text-slate-500 mt-1">Warehouse</span>
                </div>

                <div className="flex-1 mx-3 border-t-2 border-dashed border-blue-400 relative flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/40 -mt-0.5 animate-bounce">
                    <Truck className="w-4 h-4" />
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-sm">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-bold text-slate-500 mt-1">Your Doorstep</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center text-slate-400 text-xs">
            <Package className="w-12 h-12 stroke-1 text-slate-300 mx-auto mb-2" />
            <p>Enter your order ID above to trace real-time status.</p>
          </div>
        )}
      </div>
    </div>
  );
};
