
import React, { useRef, useState, useMemo, useEffect } from 'react';
import { MALL_STORES, PAST_ORDERS, ICON_MAP } from '../constants';
import { Store, Order } from '../types';
import { ArrowLeft, Search, Star, Clock, ChevronRight, History, ShoppingBag, CheckCircle, XCircle, X, Sparkles, Pizza, Utensils, Coffee, IceCream } from 'lucide-react';

interface FoodTakeawayProps {
  onBack: () => void;
  onSelectMerchant: (store: Store) => void;
}

// Updated Categories for Pill UI
const CATEGORIES = [
  { id: 'All', label: 'All', icon: Sparkles },
  { id: 'Pizza', label: 'Pizza', icon: Pizza },
  { id: 'Burger', label: 'Burger', icon: Utensils },
  { id: 'Sandwich', label: 'Sandwich', icon: Utensils },
  { id: 'Beverages', label: 'Drinks', icon: Coffee },
  { id: 'Dessert', label: 'Dessert', icon: IceCream },
];

const PROMO_BANNERS = [
    { id: 1, title: "Flat 50% OFF", subtitle: "On your first order", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80", color: "from-red-600 to-orange-600" },
    { id: 2, title: "Free Beverage", subtitle: "With any Burger King meal", image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80", color: "from-orange-500 to-yellow-500" },
    { id: 3, title: "Starbucks Rewards", subtitle: "Double stars today", image: "https://images.unsplash.com/photo-1543573852-1a71a6ce19bc?auto=format&fit=crop&w=800&q=80", color: "from-green-600 to-emerald-600" },
    { id: 4, title: "Sweet Cravings?", subtitle: "Desserts starting at ₹99", image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=800&q=80", color: "from-pink-500 to-rose-500" }
];

const FoodTakeaway: React.FC<FoodTakeawayProps> = ({ onBack, onSelectMerchant }) => {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [showHistory, setShowHistory] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showPickupPopup, setShowPickupPopup] = useState(false);
  const [pickupOrder, setPickupOrder] = useState<Order | null>(null);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  
  // Carousel State
  const [currentBanner, setCurrentBanner] = useState(0);

  const touchStart = useRef<number | null>(null);
  
  // Carousel Auto-slide
  useEffect(() => {
      const timer = setInterval(() => {
          setCurrentBanner(prev => (prev + 1) % PROMO_BANNERS.length);
      }, 4000);
      return () => clearInterval(timer);
  }, []);

  // Check for recent ready order to show popup
  useEffect(() => {
      const readyOrder = PAST_ORDERS.find(o => o.status === 'Ready to takeaway');
      if (readyOrder && showHistory) {
          setPickupOrder(readyOrder);
          setShowPickupPopup(true);
      }
  }, [showHistory]);

  // Filter merchants based on category and query
  const merchants = useMemo(() => {
    return MALL_STORES.filter(s => {
      const isFood = ['Food', 'Restaurant', 'Cafe'].includes(s.category);
      if (!isFood) return false;

      const matchesQuery = s.name.toLowerCase().includes(query.toLowerCase());
      
      let matchesCategory = true;
      if (activeCategory !== 'All') {
         matchesCategory = s.name.toLowerCase().includes(activeCategory.toLowerCase()) || 
                           (s.menu && s.menu.some(m => m.category.includes(activeCategory))) || 
                           false;
         
         if (activeCategory === 'Burger' && s.name.includes('Burger')) matchesCategory = true;
         if (activeCategory === 'Pizza' && (s.name.includes('Pizza') || s.name.includes('Nonna'))) matchesCategory = true;
         if (activeCategory === 'Beverages' && s.name.includes('Starbucks')) matchesCategory = true;
      }

      return matchesQuery && matchesCategory;
    });
  }, [query, activeCategory]);

  const onTouchStart = (e: React.TouchEvent) => { touchStart.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const diff = e.changedTouches[0].clientX - touchStart.current;
    if (Math.abs(diff) > 50 && !showHistory) onBack(); 
    touchStart.current = null;
  };

  const handleOrderClick = (order: Order) => {
      setSelectedOrder(order);
  };

  const handleCancelOrder = () => {
      if (selectedOrder) {
          // In a real app, this would be an API call
          setSelectedOrder({ ...selectedOrder, status: 'Cancelled' });
          setShowCancelPopup(false);
      }
  };

  // Order Detail View
  if (selectedOrder) {
      // Determine active step index
      let stepIndex = 0;
      if (selectedOrder.status === 'Just ordered') stepIndex = 0;
      else if (selectedOrder.status === 'Preparing') stepIndex = 1;
      else if (selectedOrder.status === 'Ready to takeaway') stepIndex = 2;
      else if (selectedOrder.status === 'Completed') stepIndex = 3;
      else if (selectedOrder.status === 'Cancelled') stepIndex = -1;

      return (
          <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900 animate-slide-in-right relative">
              <div className="flex items-center gap-4 p-4 pt-safe-area border-b border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 sticky top-0 z-10">
                  <button onClick={() => setSelectedOrder(null)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-900 dark:text-white transition">
                      <ArrowLeft size={24} />
                  </button>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Order Details</h2>
              </div>

              <div className="flex-1 overflow-y-auto p-4 pb-32 space-y-6">
                  {/* Order ID & Status Header */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-200 dark:border-white/5">
                      <div className="flex justify-between items-start">
                          <div>
                              <div className="text-sm font-bold text-primary mb-1">#{selectedOrder.id.toUpperCase()}</div>
                              <div className="text-xs text-gray-500 mb-4">{selectedOrder.date}</div>
                          </div>
                          <div className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                              selectedOrder.status === 'Cancelled' ? 'bg-red-100 text-red-600' :
                              selectedOrder.status === 'Completed' ? 'bg-green-100 text-green-600' :
                              'bg-yellow-100 text-yellow-700'
                          }`}>
                              {selectedOrder.status}
                          </div>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                          {selectedOrder.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between text-sm text-gray-800 dark:text-gray-200">
                                  <span>{item}</span>
                                  <span className="font-medium">₹{Math.floor(selectedOrder.total / selectedOrder.items.length)}</span>
                              </div>
                          ))}
                      </div>
                      
                      <div className="pt-3 border-t border-dashed border-gray-300 dark:border-white/10 flex justify-between items-center">
                          <span className="font-bold text-gray-900 dark:text-white">Total Bill</span>
                          <span className="font-bold text-lg text-gray-900 dark:text-white">₹{selectedOrder.total}</span>
                      </div>
                  </div>

                  {/* Order Status Timeline */}
                  {selectedOrder.status !== 'Cancelled' && (
                      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-200 dark:border-white/5">
                          <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-xs uppercase tracking-wider">Order Status</h3>
                          <div className="relative pl-2 space-y-6">
                              {/* Vertical Line */}
                              <div className="absolute left-[15px] top-2 bottom-4 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
                              
                              <div className="flex gap-4 relative">
                                  <div className={`w-7 h-7 rounded-full flex items-center justify-center z-10 shrink-0 border-2 border-white dark:border-gray-800 ${stepIndex >= 0 ? 'bg-primary text-white' : 'bg-gray-300 dark:bg-gray-700'}`}>
                                      <CheckCircle size={14} />
                                  </div>
                                  <div>
                                      <div className={`font-bold text-sm ${stepIndex >= 0 ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>Order Confirmed</div>
                                      <div className="text-xs text-gray-500">Restaurant has accepted your order</div>
                                  </div>
                              </div>

                              <div className="flex gap-4 relative">
                                  <div className={`w-7 h-7 rounded-full flex items-center justify-center z-10 shrink-0 border-2 border-white dark:border-gray-800 ${stepIndex >= 1 ? 'bg-primary text-white' : 'bg-gray-300 dark:bg-gray-700'}`}>
                                      <Clock size={14} />
                                  </div>
                                  <div>
                                      <div className={`font-bold text-sm ${stepIndex >= 1 ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>Cooking</div>
                                      <div className="text-xs text-gray-500">Chef is preparing your food</div>
                                  </div>
                              </div>

                              <div className="flex gap-4 relative">
                                  <div className={`w-7 h-7 rounded-full flex items-center justify-center z-10 shrink-0 border-2 border-white dark:border-gray-800 ${stepIndex >= 2 ? 'bg-primary text-white' : 'bg-gray-300 dark:bg-gray-700'}`}>
                                      <ShoppingBag size={14} />
                                  </div>
                                  <div>
                                      <div className={`font-bold text-sm ${stepIndex >= 2 ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>Ready to takeaway</div>
                                      {selectedOrder.status === 'Ready to takeaway' && (
                                          <div className="mt-2 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 px-3 py-2 rounded-lg text-xs font-bold border border-yellow-200 dark:border-yellow-800">
                                              Pickup Code: {selectedOrder.pickupCode || '8829'}
                                          </div>
                                      )}
                                  </div>
                              </div>
                          </div>
                      </div>
                  )}

                  {/* Conditional Action Button */}
                  {selectedOrder.status === 'Just ordered' ? (
                      <button 
                        onClick={() => setShowCancelPopup(true)}
                        className="w-full py-3 border border-red-200 dark:border-red-900/50 text-red-500 dark:text-red-400 font-bold rounded-xl text-sm hover:bg-red-50 dark:hover:bg-red-900/10"
                      >
                          Cancel Order
                      </button>
                  ) : selectedOrder.status === 'Cancelled' ? (
                      <button className="w-full py-3 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-bold rounded-xl text-sm border border-red-200 dark:border-red-800 cursor-default">
                          Order Cancelled
                      </button>
                  ) : selectedOrder.status === 'Completed' ? (
                      <button className="w-full py-3 bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 font-bold rounded-xl text-sm cursor-default">
                          Order Completed
                      </button>
                  ) : null}
              </div>

              {/* Confirmation Popup */}
              {showCancelPopup && (
                  <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
                      <div className="bg-white dark:bg-gray-900 w-full max-w-xs rounded-3xl p-6 shadow-2xl border border-white/20 text-center">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Cancel Order?</h3>
                          <p className="text-sm text-gray-500 mb-6">Are you sure you want to cancel? This action cannot be undone.</p>
                          <div className="flex gap-3">
                              <button 
                                onClick={() => setShowCancelPopup(false)}
                                className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold rounded-xl text-sm"
                              >
                                  No
                              </button>
                              <button 
                                onClick={handleCancelOrder}
                                className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-red-500/30"
                              >
                                  Yes, Cancel
                              </button>
                          </div>
                      </div>
                  </div>
              )}
          </div>
      )
  }

  // Order History View
  if (showHistory) {
      return (
          <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900 animate-slide-in-right">
              <div className="flex items-center gap-4 p-4 pt-safe-area border-b border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 sticky top-0 z-10">
                  <button onClick={() => setShowHistory(false)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-900 dark:text-white transition">
                      <ArrowLeft size={24} />
                  </button>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Orders</h2>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {PAST_ORDERS.map(order => (
                      <div 
                        key={order.id} 
                        onClick={() => handleOrderClick(order)}
                        className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-white/5 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      >
                          <div className="flex justify-between items-start mb-3">
                              <div>
                                  <div className="font-bold text-primary text-sm mb-1">#{order.id.toUpperCase()}</div>
                                  <div className="text-xs text-gray-500">{order.date}</div>
                              </div>
                              {order.status === 'Ready to takeaway' && (
                                  <div className="bg-yellow-400 text-black px-2 py-1 rounded text-xs font-bold shadow-sm">
                                      OTP: {order.pickupCode || '123456'}
                                  </div>
                              )}
                          </div>
                          
                          <div className="space-y-1 mb-4">
                              {order.items.map((item, idx) => (
                                  <div key={idx} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                      <div className={`w-2 h-2 rounded-full border border-green-500 flex items-center justify-center p-[1px]`}>
                                          <div className="w-full h-full bg-green-500 rounded-full"></div>
                                      </div>
                                      {item}
                                  </div>
                              ))}
                          </div>

                          <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-white/5">
                              <div className="font-bold text-gray-900 dark:text-white text-lg">₹{order.total}</div>
                              <div className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase ${
                                  order.status === 'Completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
                                  order.status === 'Cancelled' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                                  'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                              }`}>
                                  {order.status}
                              </div>
                          </div>
                      </div>
                  ))}
              </div>

              {/* Pickup Code Popup Modal */}
              {showPickupPopup && pickupOrder && (
                  <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in">
                      <div className="bg-white dark:bg-gray-900 w-full max-w-xs rounded-3xl p-6 shadow-2xl border border-white/20 relative overflow-hidden">
                          <div className="absolute top-0 left-0 w-full h-2 bg-yellow-400"></div>
                          <button onClick={() => setShowPickupPopup(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={20} /></button>
                          
                          <div className="text-center mb-6 mt-2">
                              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{pickupOrder.storeName}</h3>
                              <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Order Ready</p>
                          </div>

                          <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 text-center mb-6 border border-dashed border-gray-300 dark:border-gray-600">
                              <div className="text-xs text-gray-500 mb-1">PICKUP CODE</div>
                              <div className="text-4xl font-black text-gray-900 dark:text-white tracking-widest">{pickupOrder.pickupCode || '4592'}</div>
                          </div>

                          <button onClick={() => setShowPickupPopup(false)} className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 rounded-xl shadow-lg transition-colors">
                              I've Picked It Up
                          </button>
                      </div>
                  </div>
              )}
          </div>
      );
  }

  return (
    <div 
      className="h-full flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-safe-area border-b border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 sticky top-0 z-10">
         <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-900 dark:text-white transition">
                <ArrowLeft size={24} />
            </button>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Food Takeaway</h2>
         </div>
         <button 
            onClick={() => setShowHistory(true)}
            className="p-2 bg-gray-100 dark:bg-white/10 rounded-full text-gray-600 dark:text-gray-300 hover:text-primary transition"
         >
            <History size={20} />
         </button>
      </div>

      {/* Main Scroll Content */}
      <div className="flex-1 overflow-y-auto pb-32">
          
          {/* Search */}
          <div className="px-4 pt-4">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search restaurants..." 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/10 rounded-2xl pl-10 pr-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-primary transition-colors shadow-sm"
                />
             </div>
          </div>

          {/* Clean Pill Categories */}
          <div className="py-2 mt-4">
            <div className="flex gap-3 px-4 overflow-x-auto no-scrollbar">
                {CATEGORIES.map(cat => {
                    const isActive = activeCategory === cat.id;
                    const Icon = cat.icon;
                    return (
                       <button 
                           key={cat.id} 
                           onClick={() => setActiveCategory(cat.id)}
                           className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap border transition-all duration-300 ${isActive ? 'bg-primary border-primary text-white shadow-lg shadow-primary/25' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                       >
                           <Icon size={16} />
                           {cat.label}
                       </button>
                    )
                })}
            </div>
          </div>

          {/* Promotional Carousel */}
          <div className="pt-2 px-4 pb-6">
             <div className="relative w-full aspect-[2/1] rounded-2xl overflow-hidden shadow-lg group bg-gray-200 dark:bg-gray-800">
                {PROMO_BANNERS.map((banner, index) => (
                   <div 
                     key={banner.id}
                     className={`absolute inset-0 transition-opacity duration-700 ${index === currentBanner ? 'opacity-100' : 'opacity-0'}`}
                   >
                      <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                      <div className={`absolute inset-0 bg-gradient-to-r ${banner.color} mix-blend-multiply opacity-80`}></div>
                      <div className="absolute inset-0 flex flex-col justify-center px-6">
                         <h3 className="text-3xl font-black text-white mb-1 drop-shadow-lg">{banner.title}</h3>
                         <p className="text-white/90 font-medium text-lg drop-shadow-md">{banner.subtitle}</p>
                         <button className="mt-4 bg-white text-black font-bold px-4 py-2 rounded-lg self-start text-sm hover:bg-gray-100 transition-colors">
                            Order Now
                         </button>
                      </div>
                   </div>
                ))}
                
                {/* Dots */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                   {PROMO_BANNERS.map((_, idx) => (
                      <div 
                        key={idx} 
                        className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentBanner ? 'bg-white w-4' : 'bg-white/50'}`}
                      />
                   ))}
                </div>
             </div>
          </div>

          {/* Merchant List */}
          <div className="px-4">
             <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-lg flex items-center gap-2">
                 Popular in Food Court <span className="animate-bounce">😋</span>
             </h3>
             <div className="flex flex-col gap-4">
                {merchants.map(store => {
                   const IconComponent = ICON_MAP[store.iconName] || ShoppingBag;
                   return (
                   <div 
                     key={store.id} 
                     onClick={() => onSelectMerchant(store)}
                     className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-200 dark:border-white/5 hover:border-primary/50 transition-all cursor-pointer group"
                   >
                      <div className="h-40 relative overflow-hidden">
                         <img src={store.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={store.name} />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                         
                         {store.rating && (
                            <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 dark:bg-black/60 backdrop-blur-md px-2 py-1 rounded text-xs font-bold border border-white/20 text-gray-900 dark:text-white shadow-lg">
                                <Star size={12} className="fill-yellow-400 text-yellow-400" /> {store.rating}
                            </div>
                         )}
                         
                         <div className="absolute bottom-3 right-3 text-white text-xs font-medium bg-black/60 px-3 py-1 rounded backdrop-blur-sm border border-white/10">
                            30-40 min
                         </div>
                      </div>
                      
                      <div className="relative px-4 pt-8 pb-4">
                         {/* Circular Brand Logo Overlapping Bottom Left */}
                         <div className="absolute -top-6 left-4">
                            <div className="w-14 h-14 rounded-full bg-white dark:bg-gray-800 border-4 border-white dark:border-gray-800 flex items-center justify-center overflow-hidden shadow-lg relative z-10">
                                <IconComponent size={28} className="text-gray-900 dark:text-white" />
                            </div>
                         </div>

                         <div className="flex justify-between items-start">
                            <div className="pt-1">
                                <h4 className="font-bold text-lg text-gray-900 dark:text-white truncate">{store.name}</h4>
                                <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-1 mt-0.5">{store.description}</p>
                            </div>
                            <div className="mt-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide shrink-0">Open</div>
                         </div>
                         
                         <div className="border-t border-gray-100 dark:border-white/5 pt-3 mt-3 flex items-center text-primary text-xs font-bold uppercase tracking-wide group-hover:translate-x-1 transition-transform">
                            View Menu <ChevronRight size={14} />
                         </div>
                      </div>
                   </div>
                )})}
                {merchants.length === 0 && (
                    <div className="text-center py-10 text-gray-500">No restaurants found for this category.</div>
                )}
             </div>
          </div>
      </div>
    </div>
  );
};

export default FoodTakeaway;
