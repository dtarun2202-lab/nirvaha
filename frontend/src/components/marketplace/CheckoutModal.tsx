import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Minus,
  Plus,
  Truck,
  ShieldCheck,
  CreditCard,
  MapPin,
  CheckCircle2,
  ArrowRight,
  ChevronLeft,
  Loader2,
  QrCode,
  Smartphone,
  Lock
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: {
    name: string;
    price: string | number;
    image: string;
    type: 'product' | 'session' | 'retreat';
    id?: string;
  } | null;
  onConfirm: (details: any) => Promise<void>;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, item, onConfirm }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    fullName: '',
    street: '',
    city: '',
    zipCode: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('upi');

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setQuantity(1);
    }
  }, [isOpen]);

  if (!isOpen || !item) return null;

  const parsePrice = (price: string | number) => {
    if (typeof price === 'number') return price;
    return parseFloat(price.replace(/[^0-9.]/g, '')) || 0;
  };

  const unitPrice = parsePrice(item.price);
  const totalPrice = unitPrice * quantity;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm({
        ...address,
        paymentMethod,
        quantity,
        totalPrice
      });
      setStep(3);
    } catch (error) {
      console.error('Checkout failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#0a1f14]/15 backdrop-blur-xl"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 15 }}
          transition={{ type: "spring", damping: 30, stiffness: 450 }}
          className={`relative w-full ${step === 3 ? 'max-w-md' : 'max-w-3xl'} bg-white rounded-[32px] shadow-[0_30px_80px_-15px_rgba(0,40,20,0.18)] overflow-hidden border border-[#d1e0d9] transition-all duration-500`}
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          {/* Header */}
          <div className="px-8 py-5 flex justify-between items-center border-b border-[#d1e0d9] bg-[#f8faf9]/50">
            <div className="flex items-center gap-3">
              {step === 2 && (
                <button
                  onClick={() => setStep(1)}
                  className="p-2.5 hover:bg-emerald-50 rounded-full transition-all hover:scale-110 active:scale-90 bg-white shadow-sm border border-[#d1e0d9]"
                >
                  <ChevronLeft className="w-5 h-5 text-[#2d5a42]" />
                </button>
              )}
              <div>
                <h2 className="text-2xl font-extrabold text-[#0a2e1f] tracking-tight leading-tight">
                  {step === 1 ? 'Order Summary' : step === 2 ? 'Checkout Details' : 'Purchase Complete'}
                </h2>
                {step < 3 && <p className="text-[12px] text-[#7a9c8a] font-bold uppercase tracking-widest mt-0.5">Nirvaha Wellness</p>}
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-[#f5f8f6] text-[#4a7c65] text-sm font-bold hover:bg-[#eef3f1] transition-all hover:scale-110 active:scale-90 flex items-center justify-center border border-[#d1e0d9]/30"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-7">
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {/* Product Detail Card */}
                <div className="flex gap-7 bg-[#f8faf9] p-6 rounded-[28px] border border-[#d1e0d9] shadow-sm">
                  <div className="w-32 h-32 rounded-[22px] overflow-hidden shadow-md flex-shrink-0 border border-white/50">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <h3 className="text-[20px] font-extrabold text-[#0a2e1f] leading-tight">{item.name}</h3>
                      <div className="inline-flex mt-2 px-3 py-1 rounded-full bg-[#d6eee9] text-[#0a2e1f] text-[10px] font-extrabold uppercase tracking-wider border border-[#b8d8d1]">
                        {item.type}
                      </div>
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="text-[22px] font-black text-[#0a2e1f]">₹{unitPrice.toLocaleString()}</div>

                      {/* Quantity Selector */}
                      {item.type === 'product' && (
                        <div className="flex items-center gap-4 bg-white rounded-2xl p-1.5 border border-[#d1e0d9] shadow-sm">
                          <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-emerald-50 text-[#4a7c65] transition-all active:scale-90"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-6 text-center font-extrabold text-[#0a2e1f] text-[15px]">{quantity}</span>
                          <button
                            onClick={() => setQuantity(quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-emerald-50 text-[#4a7c65] transition-all active:scale-90"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3.5 p-5 bg-[#fcfdfd] rounded-[22px] border border-[#d1e0d9] shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                      <Truck className="w-5 h-5 text-emerald-600" />
                    </div>
                    <span className="text-[13px] font-bold text-[#2d5a42]">Free Express Delivery</span>
                  </div>
                  <div className="flex items-center gap-3.5 p-5 bg-[#fcfdfd] rounded-[22px] border border-[#d1e0d9] shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    </div>
                    <span className="text-[13px] font-bold text-[#2d5a42]">Authenticity Verified</span>
                  </div>
                </div>

                {/* Total */}
                <div className="pt-7 border-t border-[#d1e0d9] flex justify-between items-center">
                  <div>
                    <p className="text-[#7a9c8a] text-[12px] font-bold uppercase tracking-widest">Grand Total</p>
                    <p className="text-[32px] font-black text-[#0a2e1f]">₹{totalPrice.toLocaleString()}</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setStep(2)}
                    className="h-[64px] px-10 bg-[#0a2e1f] text-white rounded-full font-extrabold text-[16px] flex items-center gap-3 shadow-[0_12px_25px_-5px_rgba(10,46,31,0.25)] transition-all"
                  >
                    Continue to Shipping <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-[1fr_1.1fr] gap-10 items-start">
                  {/* Left Column: Shipping */}
                  <div className="space-y-5">
                    <h4 className="text-[12px] font-bold text-[#96b0a4] uppercase tracking-[0.2em] flex items-center gap-2 px-1">
                      <MapPin className="w-4 h-4 text-emerald-500" /> Shipping Details
                    </h4>
                    <div className="space-y-4">
                      <input
                        type="text"
                        placeholder="Full Name"
                        className="w-full px-6 py-4 rounded-2xl bg-[#f8faf9] border border-[#d1e0d9] focus:border-emerald-500 outline-none text-[15px] font-bold text-[#0a2e1f]"
                        value={address.fullName}
                        onChange={(e) => setAddress({...address, fullName: e.target.value})}
                      />
                      <input
                        type="text"
                        placeholder="Street Address & Area"
                        className="w-full px-6 py-4 rounded-2xl bg-[#f8faf9] border border-[#d1e0d9] focus:border-emerald-500 outline-none text-[15px] font-bold text-[#0a2e1f]"
                        value={address.street}
                        onChange={(e) => setAddress({...address, street: e.target.value})}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="City"
                          className="w-full px-6 py-4 rounded-2xl bg-[#f8faf9] border border-[#d1e0d9] focus:border-emerald-500 outline-none text-[15px] font-bold text-[#0a2e1f]"
                          value={address.city}
                          onChange={(e) => setAddress({...address, city: e.target.value})}
                        />
                        <input
                          type="text"
                          placeholder="Zip"
                          className="w-full px-6 py-4 rounded-2xl bg-[#f8faf9] border border-[#d1e0d9] focus:border-emerald-500 outline-none text-[15px] font-bold text-[#0a2e1f]"
                          value={address.zipCode}
                          onChange={(e) => setAddress({...address, zipCode: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Payment */}
                  <div className="space-y-5">
                    <h4 className="text-[12px] font-bold text-[#96b0a4] uppercase tracking-[0.2em] flex items-center gap-2 px-1">
                      <CreditCard className="w-4 h-4 text-emerald-500" /> Choose Payment
                    </h4>
                    <div className="flex gap-3">
                      {[
                        { id: 'upi', label: 'UPI / QR' },
                        { id: 'card', label: 'Credit Card' }
                      ].map((method) => (
                        <button
                          key={method.id}
                          onClick={() => setPaymentMethod(method.id)}
                          className={`flex-1 py-4 rounded-2xl border-2 transition-all text-center text-[13px] font-extrabold tracking-wider ${
                            paymentMethod === method.id
                              ? 'border-[#0a2e1f] bg-[#f0faf7] text-[#0a2e1f]'
                              : 'border-[#d1e0d9] bg-[#f8faf9]/50 text-[#96b0a4]'
                          }`}
                        >
                          {method.label}
                        </button>
                      ))}
                    </div>

                    <AnimatePresence mode="wait">
                      {paymentMethod === 'upi' ? (
                        <motion.div
                          key="upi-med"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-6 bg-[#fcfdfd] rounded-[24px] border border-[#d1e0d9] space-y-5 shadow-sm"
                        >
                          <div className="flex gap-6 items-center">
                            <div className="flex flex-col items-center">
                              <div className="w-28 h-28 bg-white rounded-2xl border-2 border-[#0a2e1f]/5 flex items-center justify-center p-2 flex-shrink-0 shadow-[0_8px_20px_-5px_rgba(0,40,20,0.08)] overflow-hidden">
                                 <img
                                   src="/upi_qr.png"
                                   onError={(e) => {
                                     e.currentTarget.style.display = 'none';
                                     const fallback = e.currentTarget.parentElement?.querySelector('.qr-fallback');
                                     if (fallback) (fallback as HTMLElement).style.display = 'flex';
                                   }}
                                   alt="UPI QR Code"
                                   className="w-full h-full object-contain"
                                 />
                                  <div className="qr-fallback hidden w-full h-full flex-col items-center justify-center bg-[#f0faf5] rounded-xl text-[#2d5a42] border border-[#c8e6d8]">
                                    <QrCode className="w-10 h-10 text-[#2d5a42]" />
                                    <span className="text-[8px] font-extrabold mt-1 tracking-wider uppercase text-[#1a5d3a]">Scan to Pay</span>
                                  </div>
                              </div>
                            </div>
                            <div className="flex-1 space-y-4">
                              <div className="relative">
                                <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                                <input
                                  type="text"
                                  placeholder="Enter UPI ID"
                                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#f8faf9] border border-[#d1e0d9] text-[14px] font-bold text-[#0a2e1f] outline-none"
                                />
                              </div>
                              <div className="flex gap-2">
                                {['GPay', 'PhonePe', 'Paytm'].map(a => (
                                  <div key={a} className="px-2.5 py-1 rounded-lg bg-[#d6eee9] border border-[#b8d8d1] text-[9px] font-extrabold text-[#0a2e1f] uppercase tracking-tighter">
                                    {a}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="card-med"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-6 bg-[#fcfdfd] rounded-[24px] border border-[#d1e0d9] space-y-4 shadow-sm"
                        >
                          <div className="space-y-3">
                            <div className="relative">
                               <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                               <input
                                type="text"
                                autoComplete="cc-name"
                                placeholder="Card Holder Name"
                                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#f8faf9] border border-[#d1e0d9] text-[14px] font-bold text-[#0a2e1f] outline-none"
                              />
                            </div>
                            <div className="relative">
                               <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                               <input
                                type="text"
                                autoComplete="cc-number"
                                placeholder="XXXX XXXX XXXX XXXX"
                                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#f8faf9] border border-[#d1e0d9] text-[14px] font-bold text-[#0a2e1f] outline-none tracking-[0.2em]"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <input
                                type="text"
                                autoComplete="cc-exp"
                                placeholder="MM / YY"
                                className="w-full px-5 py-3.5 rounded-xl bg-[#f8faf9] border border-[#d1e0d9] text-[14px] font-bold text-[#0a2e1f] outline-none text-center"
                              />
                              <input
                                type="password"
                                autoComplete="cc-csc"
                                placeholder="CVV"
                                className="w-full px-5 py-3.5 rounded-xl bg-[#f8faf9] border border-[#d1e0d9] text-[14px] font-bold text-[#0a2e1f] outline-none text-center"
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-8 border-t border-[#d1e0d9] flex items-center justify-between gap-10">
                  <div>
                    <p className="text-[11px] font-bold text-[#96b0a4] uppercase tracking-[0.25em]">Total Amount</p>
                    <p className="text-[32px] font-black text-[#0a2e1f]">₹{totalPrice.toLocaleString()}</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={loading || !address.fullName || !address.street}
                    onClick={handleConfirm}
                    className="flex-1 max-w-[320px] h-[72px] bg-[#0a2e1f] text-white rounded-full font-extrabold text-[18px] shadow-[0_15px_35px_-5px_rgba(10,46,31,0.25)] disabled:opacity-40 flex items-center justify-center gap-3"
                  >
                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Pay Secured</>}
                  </motion.button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative py-12 px-6 flex flex-col items-center text-center"
              >
                {/* Glowing Success Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                  transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
                  className="relative mb-10"
                >
                  <div className="absolute inset-0 bg-emerald-400 rounded-full blur-[40px] opacity-20 animate-pulse" />
                  <div className="relative w-28 h-28 bg-gradient-to-br from-emerald-500 to-[#0a2e1f] rounded-[40px] flex items-center justify-center text-white shadow-[0_20px_50px_-15px_rgba(16,185,129,0.4)] border-4 border-white">
                    <CheckCircle2 className="w-14 h-14" />
                  </div>
                </motion.div>

                {/* Text Content */}
                <div className="relative space-y-4 max-w-sm mx-auto">
                  <h3 className="text-[32px] font-black text-[#0a2e1f] tracking-tight">Pure Bliss!</h3>
                  <p className="text-[16px] text-[#4a7c65] font-medium leading-relaxed">
                    Your order for <span className="text-[#0a2e1f] font-bold underline decoration-emerald-200 underline-offset-4">{item.name}</span> has been harmoniously placed.
                  </p>
                </div>

                {/* Action Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="mt-12 px-14 h-[64px] bg-[#0a2e1f] text-white rounded-full font-extrabold text-[16px] shadow-xl transition-all"
                >
                  Continue Exploring
                </motion.button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CheckoutModal;
