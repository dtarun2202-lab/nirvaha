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
  ChevronLeft
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
  const [paymentMethod, setPaymentMethod] = useState('card');

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

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0 }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
          className="absolute inset-0 bg-teal-950/40 backdrop-blur-md"
        />

        {/* Modal */}
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="relative w-full max-w-2xl bg-white/80 backdrop-blur-2xl rounded-[40px] shadow-2xl border border-white/20 overflow-hidden"
        >
          {/* Header */}
          <div className="p-8 pb-4 flex justify-between items-center border-b border-teal-100/30">
            <div className="flex items-center gap-3">
              {step === 2 && (
                <button 
                  onClick={() => setStep(1)}
                  className="p-2 hover:bg-teal-50 rounded-full transition-colors"
                >
                  <ChevronLeft className="w-6 h-6 text-teal-800" />
                </button>
              )}
              <h2 className="text-2xl font-bold text-teal-950">
                {step === 1 ? 'Order Summary' : step === 2 ? 'Checkout Details' : 'Success!'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-teal-50 rounded-full transition-colors text-teal-800"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-8">
            {step === 1 && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                {/* Product Detail Card */}
                <div className="flex gap-6 bg-teal-50/50 p-6 rounded-3xl border border-teal-100/50">
                  <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-lg flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <h3 className="text-xl font-bold text-teal-900">{item.name}</h3>
                      <p className="text-teal-600 mt-1 capitalize">{item.type}</p>
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="text-2xl font-bold text-teal-900">₹{unitPrice.toLocaleString()}</div>
                      
                      {/* Quantity Selector */}
                      {item.type === 'product' && (
                        <div className="flex items-center gap-4 bg-white rounded-full p-1 border border-teal-100">
                          <button 
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-teal-50 text-teal-800 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-6 text-center font-bold text-teal-950">{quantity}</span>
                          <button 
                            onClick={() => setQuantity(quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-teal-50 text-teal-800 transition-colors"
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
                  <div className="flex items-center gap-3 p-4 bg-white/50 rounded-2xl border border-teal-100/30 text-teal-800">
                    <Truck className="w-5 h-5 text-teal-500" />
                    <span className="text-sm font-medium">Free Express Delivery</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-white/50 rounded-2xl border border-teal-100/30 text-teal-800">
                    <ShieldCheck className="w-5 h-5 text-teal-500" />
                    <span className="text-sm font-medium">Authenticity Guaranteed</span>
                  </div>
                </div>

                {/* Total */}
                <div className="pt-6 border-t border-teal-100/30 flex justify-between items-center">
                  <div>
                    <p className="text-teal-600 text-sm">Total Amount</p>
                    <p className="text-3xl font-bold text-teal-950">₹{totalPrice.toLocaleString()}</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setStep(2)}
                    className="px-8 py-4 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-teal-900/10"
                  >
                    Continue to Payment <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {/* Shipping Form */}
                <div className="space-y-4">
                  <h4 className="font-bold text-teal-900 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-teal-600" /> Shipping Address
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <input 
                      type="text" 
                      placeholder="Full Name" 
                      className="col-span-2 px-6 py-4 rounded-2xl bg-white/50 border border-teal-100 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                      value={address.fullName}
                      onChange={(e) => setAddress({...address, fullName: e.target.value})}
                    />
                    <input 
                      type="text" 
                      placeholder="Street Address" 
                      className="col-span-2 px-6 py-4 rounded-2xl bg-white/50 border border-teal-100 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                      value={address.street}
                      onChange={(e) => setAddress({...address, street: e.target.value})}
                    />
                    <input 
                      type="text" 
                      placeholder="City" 
                      className="px-6 py-4 rounded-2xl bg-white/50 border border-teal-100 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                      value={address.city}
                      onChange={(e) => setAddress({...address, city: e.target.value})}
                    />
                    <input 
                      type="text" 
                      placeholder="Zip Code" 
                      className="px-6 py-4 rounded-2xl bg-white/50 border border-teal-100 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                      value={address.zipCode}
                      onChange={(e) => setAddress({...address, zipCode: e.target.value})}
                    />
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="space-y-4">
                  <h4 className="font-bold text-teal-900 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-teal-600" /> Payment Method
                  </h4>
                  <div className="flex gap-4">
                    {['card', 'upi', 'cod'].map((method) => (
                      <button
                        key={method}
                        onClick={() => setPaymentMethod(method)}
                        className={`flex-1 py-4 rounded-2xl border-2 transition-all uppercase text-sm font-bold tracking-wider ${
                          paymentMethod === method 
                            ? 'border-teal-600 bg-teal-50 text-teal-800' 
                            : 'border-teal-100 bg-white/50 text-teal-400 hover:border-teal-200'
                        }`}
                      >
                        {method === 'card' ? 'Credit Card' : method}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Final Button */}
                <div className="pt-6 border-t border-teal-100/30">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={loading || !address.fullName || !address.street}
                    onClick={handleConfirm}
                    className="w-full py-5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-teal-900/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>Confirm & Pay ₹{totalPrice.toLocaleString()}</>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="relative py-10 px-6 flex flex-col items-center text-center"
              >
                {/* Decorative Background Glows */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-400/20 rounded-full blur-[80px] pointer-events-none" />
                
                {/* Glowing Success Icon */}
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                  transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
                  className="relative mb-8"
                >
                  <div className="absolute inset-0 bg-emerald-400 rounded-full blur-xl opacity-40 animate-pulse" />
                  <div className="relative w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white shadow-2xl shadow-emerald-500/40 border-4 border-white/30">
                    <CheckCircle2 className="w-14 h-14" />
                  </div>
                </motion.div>

                {/* Text Content */}
                <div className="relative space-y-4 max-w-sm mx-auto">
                  <motion.h3 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-4xl font-black text-teal-950 tracking-tight"
                  >
                    Pure Bliss!
                  </motion.h3>
                  <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-lg text-teal-800/80 font-medium leading-relaxed"
                  >
                    Your order for <span className="text-emerald-600 font-bold">{item.name}</span> has been harmoniously placed.
                  </motion.p>
                </div>

                {/* Compact Info Card */}
                <motion.div 
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   transition={{ delay: 0.6 }}
                   className="mt-8 p-4 bg-white/40 backdrop-blur-md rounded-3xl border border-white/50 shadow-lg flex items-center gap-4 w-full max-w-xs"
                >
                  <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-teal-900/50">Secure Order</p>
                    <p className="text-sm font-bold text-teal-900">ID: #{(Math.random() * 1000000).toFixed(0)}</p>
                  </div>
                </motion.div>

                {/* Action Button */}
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 40px -10px rgba(16, 185, 129, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="mt-10 px-12 py-4 bg-gradient-to-r from-teal-900 to-teal-800 text-white rounded-2xl font-bold text-lg shadow-xl transition-all border border-white/10"
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
