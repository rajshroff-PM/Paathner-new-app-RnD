
import React, { useState, useMemo } from 'react';
import { Store, Coupon } from '../types';
import { AVAILABLE_COUPONS } from '../constants';
import { ArrowLeft, Star, Clock, ShoppingBag, Plus, Minus, CreditCard, CheckCircle, X, IndianRupee, ChefHat, Package, ChevronRight, Ticket, ArrowRight, Store as StoreIcon } from 'lucide-react';

interface RestaurantOrderingProps {
  store: Store;
  onBack: () => void;
}

const RestaurantOrdering: React.FC<RestaurantOrderingProps> = ({ store, onBack }) => {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [viewState, setViewState] = useState<'menu' | 'cart' | 'payment' | 'status' | 'coupons'>('menu');
  const [orderStatus, setOrderStatus] = useState(0); 
  const [customizingItem, setCustomizingItem] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{code: string, discount: number} | null>(null);

  const menuItems = store.menu || [];

  const getItemCount = (id: string) => cart[id] || 0;

  const updateCart = (id: string, delta: number) => {
    // Check customization only when adding for the first time
    const item = menuItems.find(i => i.id === id);
    if (delta > 0 && item?.customizable && getItemCount(id) === 0 && !customizingItem) {
        setCustomizingItem(id);
        return;
    }

    setCart(prev => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: next };
    });
  };

  const confirmCustomization = () => {
      if(customizingItem) {
          setCart(prev => ({ ...prev, [customizingItem]: 1 }));
          setCustomizingItem(null);
      }
  }

  // --- Calculations ---
  const cartItemsList = useMemo(() => {
      return Object.entries(cart).map(([id, qty]) => {
          const item = menuItems.find(i => i.id === id);
          return item ? { ...item, qty } : null;
      }).filter(Boolean) as Array<{ id: string, name: string, price: number, image: string, qty: number }>;
  }, [cart, menuItems]);

  const itemTotal = cartItemsList.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const tax = Math.floor(itemTotal * 0.05);
  const deliveryFee = 0; // Takeaway
  const platformFee = 10;
  const discount = appliedCoupon ? Math.min(itemTotal * appliedCoupon.discount, 150) : 0;
  const grandTotal = itemTotal + tax + platformFee + deliveryFee - discount;

  const totalItemsCount = cartItemsList.reduce((sum, item) => sum + item.qty, 0);

  // --- Handlers ---

  const applyCoupon = () => {
      // Mock validation
      if (couponCode.toLowerCase() === 'welcome50') {
          setAppliedCoupon({ code: 'WELCOME50', discount: 0.5 });
      } else if (couponCode.toLowerCase() === 'trynew') {
          setAppliedCoupon({ code: 'TRYNEW', discount: 0.2 });
      } else {
          alert('Invalid coupon code');
          setAppliedCoupon(null);
      }
  };

  const handleSelectCoupon = (coupon: Coupon) => {
      setAppliedCoupon({ code: coupon.code, discount: coupon.discount });
      setViewState('cart');
  };

  const handleProceedToPay = () => {
      setViewState('payment');
      // Auto-simulate payment for demo
      setTimeout(() => {
          setViewState('status');
          simulateOrderStatus();
      }, 2000);
  };

  const simulateOrderStatus = () => {
      let step = 0;
      const interval = setInterval(() => {
          step++;
          setOrderStatus(step);
          if (step >= 2) clearInterval(interval);
      }, 3000);
  };

  const handleCloseOrdering = () => {
      setViewState('menu');
      setOrderStatus(0);
      setCart({});
      onBack();
  };

  // --- VIEWS ---

  if (viewState === 'status') {
      const steps = [
          { title: 'Order Confirmed', sub: 'Your order has been placed.', icon: CheckCircle },
          { title: 'Cooking', sub: 'Chef is preparing your meal.', icon: ChefHat },
          { title: 'Ready to takeaway', sub: 'Please collect from counter.', icon: Package },
          { title: 'Order Completed', sub: 'Enjoy your meal!', icon: Star }
      ];

      return (
          <div className="fixed inset-0 z-[70] bg-gray-900 flex flex-col p-6 animate-fade-in">
              <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold text-white">Order Status</h2>
                  <button onClick={handleCloseOrdering} className="text-white bg-white/10 p-2 rounded-full hover:bg-white/20 transition">
                      <X size={24} />
                  </button>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 mb-8 shadow-xl">
                  <div className="flex justify-between mb-4 border-b border-gray-100 dark:border-white/10 pb-4">
                      <div>
                          <div className="text-xs text-gray-500">ORDER ID</div>
                          <div className="font-mono font-bold text-primary text-lg">#ORD-8829</div>
                      </div>
                      <div className="text-right">
                          <div className="text-xs text-gray-500">OTP</div>
                          <div className="font-mono font-bold text-yellow-500 tracking-widest text-xl">4592</div>
                      </div>
                  </div>
                  <div className="flex justify-between font-bold text-white text-xl">
                      <span>Total Paid</span>
                      <span>₹{grandTotal}</span>
                  </div>
              </div>

              <div className="space-y-8 pl-4 relative">
                  <div className="absolute left-[27px] top-2 bottom-10 w-0.5 bg-gray-700"></div>
                  {steps.map((step, idx) => {
                      const isActive = idx <= orderStatus;
                      const isCurrent = idx === orderStatus;
                      return (
                          <div key={idx} className={`flex gap-4 relative ${isActive ? 'opacity-100' : 'opacity-40 transition-opacity'}`}>
                              <div className={`w-6 h-6 rounded-full border-2 shrink-0 z-10 bg-gray-900 flex items-center justify-center transition-colors duration-500 ${isActive ? 'border-green-500 bg-green-500 text-white' : 'border-gray-500'}`}>
                                  {isActive && <step.icon size={14} />}
                              </div>
                              <div>
                                  <h4 className={`font-bold ${isCurrent ? 'text-green-400' : 'text-white'}`}>{step.title}</h4>
                                  <p className="text-xs text-gray-400">{step.sub}</p>
                              </div>
                          </div>
                      )
                  })}
              </div>
          </div>
      );
  }

  if (viewState === 'payment') {
      return (
         <div className="fixed inset-0 z-[60] bg-gray-900 flex items-center justify-center">
             <div className="text-center">
                 <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                 <h3 className="text-white font-bold text-xl">Processing Payment...</h3>
                 <p className="text-gray-400 text-sm mt-2">Please do not close this screen.</p>
             </div>
         </div>
      )
  }

  if (viewState === 'coupons') {
      return (
          <div className="fixed inset-0 z-[70] bg-gray-50 dark:bg-gray-900 flex flex-col animate-slide-in-right">
              <div className="flex items-center gap-4 p-4 pt-safe-area border-b border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 sticky top-0 z-10">
                  <button onClick={() => setViewState('cart')} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-900 dark:text-white transition">
                      <ArrowLeft size={24} />
                  </button>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Apply Coupon</h2>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {AVAILABLE_COUPONS.map(coupon => (
                      <div key={coupon.code} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/10 rounded-2xl p-4 shadow-sm relative overflow-hidden group">
                          <div className="absolute top-0 right-0 px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs font-bold rounded-bl-xl uppercase tracking-wider">
                              {coupon.code}
                          </div>
                          <div className="flex items-start gap-4">
                              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-primary shrink-0">
                                  <Ticket size={24} />
                              </div>
                              <div className="flex-1">
                                  <h3 className="font-bold text-gray-900 dark:text-white mb-1">Save {coupon.discount * 100}%</h3>
                                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{coupon.description}</p>
                                  <button 
                                    onClick={() => handleSelectCoupon(coupon)}
                                    className="text-primary text-sm font-bold uppercase tracking-wide hover:underline"
                                  >
                                      Apply Now
                                  </button>
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      )
  }

  if (viewState === 'cart') {
      return (
          <div className="fixed inset-0 z-[60] bg-gray-50 dark:bg-gray-900 flex flex-col animate-slide-in-right">
              {/* Cart Header */}
              <div className="bg-white dark:bg-gray-900 p-4 pt-safe-area border-b border-gray-200 dark:border-white/10 sticky top-0 z-10">
                  <div className="flex items-center gap-4">
                      <button onClick={() => setViewState('menu')} className="text-gray-900 dark:text-white p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition">
                          <ArrowLeft size={24} />
                      </button>
                      <div className="flex-1">
                          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Cart</h2>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{store.name}</p>
                      </div>
                  </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 pb-32">
                  {/* Items List */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm mb-4 border border-gray-200 dark:border-white/5">
                      {cartItemsList.map(item => {
                          const originalPrice = Math.floor(item.price * 1.2);
                          return (
                          <div key={item.id} className="flex justify-between items-start mb-4 last:mb-0 border-b border-gray-100 dark:border-white/5 pb-4 last:border-0 last:pb-0">
                              <div className="flex items-start gap-3">
                                  <div className="w-4 h-4 border-2 border-green-600 flex items-center justify-center rounded-[2px] shrink-0 mt-1">
                                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                                  </div>
                                  <div>
                                      <div className="font-medium text-gray-900 dark:text-white text-sm mb-0.5">{item.name}</div>
                                      <div className="text-[10px] text-gray-500 mb-1 flex items-center gap-1">
                                          <StoreIcon size={10} /> Sold by {store.name}
                                      </div>
                                      <div className="flex items-center gap-2">
                                          <span className="text-xs font-bold text-gray-900 dark:text-white">₹{item.price}</span>
                                          <span className="text-xs text-gray-400 line-through">₹{originalPrice}</span>
                                      </div>
                                  </div>
                              </div>
                              <div className="flex items-center bg-gray-100 dark:bg-black/30 rounded-lg border border-gray-200 dark:border-white/10 h-8">
                                  <button onClick={() => updateCart(item.id, -1)} className="px-2 h-full text-gray-500 hover:text-gray-900 dark:hover:text-white"><Minus size={12} /></button>
                                  <span className="px-2 text-gray-900 dark:text-white text-xs font-bold">{item.qty}</span>
                                  <button onClick={() => updateCart(item.id, 1)} className="px-2 h-full text-green-600"><Plus size={12} /></button>
                              </div>
                          </div>
                      )})}
                      
                      <button 
                        onClick={() => setViewState('menu')}
                        className="w-full mt-2 py-3 flex items-center justify-center gap-2 text-primary text-sm font-bold hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-colors"
                      >
                          <Plus size={16} /> Add more items
                      </button>
                  </div>

                  {/* Coupon Section */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm mb-4 border border-gray-200 dark:border-white/5">
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                          <Ticket size={16} className="text-blue-500" /> Offers & Benefits
                      </h3>
                      {appliedCoupon ? (
                          <div className="flex justify-between items-center bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-3 rounded-xl">
                              <div className="text-green-700 dark:text-green-400 text-sm font-bold">
                                  '{appliedCoupon.code}' applied
                              </div>
                              <button onClick={() => setAppliedCoupon(null)} className="text-xs text-red-500 font-bold">Remove</button>
                          </div>
                      ) : (
                          <div className="flex flex-col gap-3">
                              <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    placeholder="Enter Coupon Code" 
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                    className="flex-1 bg-gray-100 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary"
                                />
                                <button onClick={applyCoupon} className="text-primary font-bold text-sm px-4 hover:bg-primary/10 rounded-xl transition-colors">Apply</button>
                              </div>
                              <button 
                                onClick={() => setViewState('coupons')}
                                className="w-full flex justify-between items-center text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-primary transition-colors border-t border-gray-100 dark:border-white/5 pt-2"
                              >
                                  View all coupons <ChevronRight size={16} />
                              </button>
                          </div>
                      )}
                  </div>

                  {/* Bill Details */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm mb-4 border border-gray-200 dark:border-white/5">
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Bill Details</h3>
                      <div className="space-y-2 text-sm">
                          <div className="flex justify-between text-gray-600 dark:text-gray-400">
                              <span>Item Total</span>
                              <span>₹{itemTotal}</span>
                          </div>
                          <div className="flex justify-between text-gray-600 dark:text-gray-400">
                              <span>Taxes & Charges</span>
                              <span>₹{tax + platformFee}</span>
                          </div>
                          {discount > 0 && (
                              <div className="flex justify-between text-green-600 font-bold">
                                  <span>Coupon Discount</span>
                                  <span>- ₹{discount}</span>
                              </div>
                          )}
                          <div className="border-t border-gray-200 dark:border-white/10 pt-2 mt-2 flex justify-between font-bold text-gray-900 dark:text-white text-lg">
                              <span>To Pay</span>
                              <span>₹{grandTotal}</span>
                          </div>
                      </div>
                  </div>
                  
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-800/30 p-3 rounded-xl flex items-center gap-3">
                      <Clock size={18} className="text-yellow-600 dark:text-yellow-500" />
                      <div className="text-xs text-yellow-800 dark:text-yellow-200">
                          Estimated preparation time: <b>20-25 mins</b>
                      </div>
                  </div>
              </div>

              {/* Sticky Footer */}
              <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-white/10 shadow-2xl">
                  <button 
                      onClick={handleProceedToPay}
                      className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-600/20 flex items-center justify-between px-6 group transition-all active:scale-95"
                  >
                      <div className="flex flex-col text-left leading-none">
                          <span className="text-xs font-normal opacity-80">TOTAL</span>
                          <span className="text-xl">₹{grandTotal}</span>
                      </div>
                      <div className="flex items-center gap-2">
                          Proceed to Pay <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                  </button>
              </div>
          </div>
      );
  }

  // --- MENU VIEW (Default) ---
  return (
    <div className="fixed inset-0 z-[60] bg-gray-50 dark:bg-gray-900 flex flex-col overflow-hidden animate-fade-in transition-colors duration-300">
      
      {/* Hero Section */}
      <div className="relative h-64 md:h-80 shrink-0">
         <img src={store.image} alt={store.name} className="w-full h-full object-cover" />
         <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
         <button onClick={onBack} className="absolute top-6 left-6 bg-black/40 backdrop-blur text-white p-3 rounded-full hover:bg-white/20 transition-colors">
           <ArrowLeft size={24} />
         </button>
         <div className="absolute bottom-6 left-6 right-6">
           <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">{store.name}</h1>
           <div className="flex items-center gap-4 text-sm text-gray-300">
              <span>{store.category}</span>
              <span>•</span>
              <span>{store.floor}</span>
           </div>
         </div>
      </div>

      {/* Menu Content */}
      <div className="flex-1 overflow-y-auto p-6 pb-32 bg-gray-50 dark:bg-gray-900">
        <div className="space-y-6">
           {menuItems.map((item) => {
             const originalPrice = Math.floor(item.price * 1.2);
             return (
             <div key={item.id} className="flex gap-4 bg-white dark:bg-gray-800/40 border border-gray-200 dark:border-white/5 p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors shadow-sm">
                <div className="flex-1">
                   <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1">{item.name}</h3>
                   <div className="flex items-center gap-2 mb-2">
                      <span className="text-gray-900 dark:text-white font-mono font-bold">₹{item.price}</span>
                      <span className="text-gray-400 text-xs line-through">₹{originalPrice}</span>
                   </div>
                   <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2">{item.description}</p>
                   {item.customizable && <span className="text-[10px] text-yellow-600 dark:text-yellow-500 uppercase border border-yellow-500/30 bg-yellow-50 dark:bg-yellow-900/20 px-1.5 rounded mt-2 inline-block font-bold">Customizable</span>}
                </div>
                {/* Fixed the relative positioning and button placement */}
                <div className="flex flex-col items-center gap-2 relative shrink-0">
                   <div className="w-28 h-28 rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-700 mb-3 shadow-inner">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                   </div>
                   
                   {getItemCount(item.id) === 0 ? (
                       <button 
                         onClick={() => updateCart(item.id, 1)} 
                         className="absolute -bottom-2 bg-white dark:bg-gray-800 text-primary font-bold px-6 py-2 rounded-lg shadow-lg border border-gray-100 dark:border-white/10 text-sm hover:bg-gray-50 uppercase"
                       >
                         ADD
                       </button>
                   ) : (
                       <div className="absolute -bottom-2 bg-white dark:bg-gray-800 text-black dark:text-white font-bold rounded-lg shadow-lg flex items-center overflow-hidden border border-gray-200 dark:border-white/10 h-9">
                          <button onClick={() => updateCart(item.id, -1)} className="px-3 h-full hover:bg-gray-100 dark:hover:bg-white/5 text-primary"><Minus size={14} /></button>
                          <span className="px-2 text-sm">{getItemCount(item.id)}</span>
                          <button onClick={() => updateCart(item.id, 1)} className="px-3 h-full hover:bg-gray-100 dark:hover:bg-white/5 text-primary"><Plus size={14} /></button>
                       </div>
                   )}
                </div>
             </div>
           )})}
        </div>
      </div>

      {/* Customization Modal (Simple) */}
      {customizingItem && (
          <div className="absolute inset-0 z-[70] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white dark:bg-gray-800 w-full max-w-sm rounded-3xl p-6 border border-gray-200 dark:border-white/10 shadow-2xl">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Customize Item</h3>
                  <div className="space-y-4 mb-6">
                      <div>
                          <label className="text-xs text-gray-500 uppercase font-bold">Crust</label>
                          <div className="space-y-2 mt-2">
                              <div className="flex items-center justify-between text-gray-900 dark:text-white text-sm p-3 bg-gray-100 dark:bg-white/5 rounded-xl border border-primary/50">
                                  <span>New Hand Tossed</span>
                                  <div className="w-4 h-4 rounded-full border-4 border-primary bg-white"></div>
                              </div>
                              <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 text-sm p-3 bg-gray-50 dark:bg-white/5 rounded-xl">
                                  <span>Cheese Burst</span>
                                  <div className="w-4 h-4 rounded-full border border-gray-400"></div>
                              </div>
                          </div>
                      </div>
                  </div>
                  <div className="flex gap-3">
                      <button onClick={() => setCustomizingItem(null)} className="flex-1 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl font-bold">Cancel</button>
                      <button onClick={confirmCustomization} className="flex-1 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20">Add Item</button>
                  </div>
              </div>
          </div>
      )}

      {/* Floating Cart Footer */}
      {totalItemsCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white dark:from-gray-900 via-white/90 dark:via-gray-900/90 to-transparent pointer-events-none z-40">
           <div className="pointer-events-auto max-w-3xl mx-auto bg-primary text-white rounded-2xl p-4 shadow-2xl shadow-primary/30 flex items-center justify-between cursor-pointer hover:bg-primary-hover transition-all active:scale-95"
                onClick={() => setViewState('cart')}>
              <div className="flex flex-col">
                 <span className="text-xs uppercase font-bold opacity-80">{totalItemsCount} ITEMS</span>
                 <span className="text-xl font-bold">₹{itemTotal} <span className="text-xs font-normal opacity-70">+ taxes</span></span>
              </div>
              <div className="flex items-center gap-2 font-bold text-sm uppercase tracking-wider">
                 View Cart <ShoppingBag size={18} />
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantOrdering;
