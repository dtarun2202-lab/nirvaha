import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

export interface CartItem {
  id: string;
  name: string;
  price: string | number;
  image: string;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, newQty: number) => void;
  onRemoveItem: (id: string) => void;
  onContinueCheckout: () => void;
  onStartShopping?: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onContinueCheckout,
  onStartShopping,
}) => {
  const parsePrice = (price: string | number) => {
    if (typeof price === 'number') return price;
    return parseFloat(price.replace(/[^0-9.]/g, '')) || 0;
  };

  const subtotal = cartItems.reduce((acc, item) => {
    return acc + parsePrice(item.price) * item.quantity;
  }, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[250] overflow-hidden">
          {/* Glassmorphism Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#0a1f14]/15 backdrop-blur-md"
          />

          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            {/* Drawer Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-screen max-w-md bg-white/95 backdrop-blur-xl border-l border-[#d1e0d9] shadow-2xl flex flex-col"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              {/* Header */}
              <div className="p-6 border-b border-[#e2ece7] flex items-center justify-between bg-gradient-to-r from-[#f4faf7] to-white">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-100">
                    <ShoppingBag className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-teal-900">My Cart</h3>
                    <p className="text-xs text-teal-600 font-medium">
                      {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 bg-emerald-50/50 hover:bg-emerald-100/50 text-teal-800 rounded-full flex items-center justify-center border border-emerald-100/30 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Cart List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin">
                {cartItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12">
                    <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-4 border border-emerald-100/60">
                      <ShoppingBag className="w-10 h-10 text-emerald-600/40" />
                    </div>
                    <h4 className="text-teal-950 font-bold text-lg mb-1">Your cart is empty</h4>
                    <p className="text-teal-700 text-sm max-w-xs leading-relaxed">
                      Explore our wellness products and add items to start your mindful journey.
                    </p>
                    <button
                      onClick={onStartShopping ? onStartShopping : onClose}
                      className="mt-6 px-6 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white rounded-full text-sm font-semibold transition-all shadow-md"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  cartItems.map((item) => {
                    const priceNum = parsePrice(item.price);
                    return (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="p-4 bg-gradient-to-br from-[#f8fcfb] to-white rounded-2xl border border-[#e2ece7] shadow-sm flex gap-4 hover:border-emerald-200 hover:shadow-md transition-all relative overflow-hidden group"
                      >
                        {/* Image */}
                        <div className="w-20 h-20 bg-emerald-50/30 rounded-xl border border-emerald-100/50 overflow-hidden flex-shrink-0 flex items-center justify-center">
                          <img
                            src={item.image || "/placeholder.jpg"}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <h4 className="font-bold text-teal-950 text-sm line-clamp-1 leading-snug">
                              {item.name}
                            </h4>
                            <p className="text-xs text-teal-600/80 font-bold mt-0.5">
                              ${priceNum.toFixed(2)}
                            </p>
                          </div>

                          {/* Qty & Remove Row */}
                          <div className="flex items-center justify-between mt-2">
                            {/* Qty Controls */}
                            <div className="flex items-center bg-emerald-50/60 border border-emerald-100/50 rounded-xl px-2.5 py-1 gap-3">
                              <button
                                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                className="w-5 h-5 flex items-center justify-center text-teal-800 hover:text-emerald-600 transition-colors"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="text-xs font-extrabold text-teal-950 tabular-nums">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                className="w-5 h-5 flex items-center justify-center text-teal-800 hover:text-emerald-600 transition-colors"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Remove button */}
                            <button
                              onClick={() => onRemoveItem(item.id)}
                              className="text-[#6b7280] hover:text-red-500 hover:bg-red-50 p-2 rounded-xl transition-all"
                              title="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>

              {/* Footer / Summary */}
              {cartItems.length > 0 && (
                <div className="p-6 border-t border-[#e2ece7] bg-gradient-to-b from-white to-[#f4faf7]">
                  <div className="space-y-2.5 mb-6">
                    <div className="flex justify-between text-sm text-teal-700 font-medium">
                      <span>Subtotal</span>
                      <span className="font-semibold text-teal-950">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-teal-700 font-medium">
                      <span>Delivery</span>
                      <span className="text-[#16a34a] font-semibold uppercase tracking-wider text-xs">Free</span>
                    </div>
                    <div className="h-px bg-[#e2ece7] my-1" />
                    <div className="flex justify-between items-center text-teal-950">
                      <span className="text-base font-bold">Total Amount</span>
                      <span className="text-xl font-extrabold text-emerald-800">${subtotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(16,185,129,0.25)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onContinueCheckout}
                    className="w-full py-4 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg hover:from-teal-700 hover:to-emerald-700 transition-all text-base"
                  >
                    Continue Checkout
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
