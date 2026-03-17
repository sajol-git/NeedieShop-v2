import { motion, AnimatePresence } from 'motion/react';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { useStore } from '@/store/useStore';
import Link from 'next/link';
import Image from 'next/image';
import { CartIcon } from './icons';

export function CartDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { cart, removeFromCart, updateCartQuantity } = useStore();

  const subtotal = cart.reduce((acc, item) => {
    const variantPrice = item.product.variants.find(v => v.id === item.variantId)?.price || item.product.price;
    return acc + variantPrice * item.quantity;
  }, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-white/90 backdrop-blur-xl shadow-2xl z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
              <h2 className="text-xl font-semibold text-gray-900">Your Cart</h2>
              <div className="flex items-center gap-2">
                {cart.length > 0 && (
                  <Link 
                    href="/checkout" 
                    onClick={onClose}
                    className="bg-[#8B183A] text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-[#6d122d] transition-colors"
                  >
                    Checkout
                  </Link>
                )}
                <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100/50">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <div className="w-16 h-16 mb-4 flex items-center justify-center">
                  <CartIcon className="w-16 h-16 scale-110 text-gray-300" />
                </div>
                  <p>Your cart is empty.</p>
                </div>
              ) : (
                cart.map((item) => {
                  const variant = item.product.variants.find(v => v.id === item.variantId);
                  const price = variant?.price || item.product.price;
                  
                  return (
                    <div key={`${item.product.id}-${item.variantId}`} className="flex gap-4 bg-white/50 p-3 rounded-2xl border border-gray-100 shadow-sm">
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                        <Image src={item.product.featureImage} alt={item.product.name} fill className="object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900 line-clamp-1">{item.product.name}</h3>
                          {variant && <p className="text-sm text-gray-500">{variant.name}</p>}
                          <p className="font-semibold text-indigo-600 mt-1">৳{price.toLocaleString()}</p>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-3 bg-gray-100/50 rounded-full px-2 py-1">
                            <button 
                              onClick={() => updateCartQuantity(item.product.id, item.variantId, item.quantity - 1)}
                              className="p-1 text-gray-600 hover:text-indigo-600"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateCartQuantity(item.product.id, item.variantId, item.quantity + 1)}
                              className="p-1 text-gray-600 hover:text-indigo-600"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <button 
                            onClick={() => removeFromCart(item.product.id, item.variantId)}
                            className="p-2 text-red-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 bg-white/80 backdrop-blur-md border-t border-gray-200/50">
                <div className="flex justify-between mb-4 text-lg font-semibold">
                  <span>Subtotal</span>
                  <span className="text-indigo-600">৳{subtotal.toLocaleString()}</span>
                </div>
                <p className="text-sm text-gray-500 mb-6">Shipping and taxes calculated at checkout.</p>
                <Link 
                  href="/checkout" 
                  onClick={onClose}
                  className="w-full bg-[#8B183A] text-white py-4 rounded-full font-bold text-center block hover:bg-[#6d122d] transition-colors shadow-lg shadow-red-100"
                >
                  Proceed to Checkout
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
