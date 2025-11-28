
import React, { useState, useRef } from 'react';
import { LostItem } from '../types';
import { INITIAL_LOST_ITEMS } from '../constants';
import { Search, Plus, MapPin, Calendar, Phone, Camera, X, CheckCircle, HelpCircle, ArrowLeft } from 'lucide-react';

interface LostAndFoundProps {
  onBack: () => void;
}

const LostAndFound: React.FC<LostAndFoundProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'lost' | 'found'>('lost');
  const [items, setItems] = useState<LostItem[]>(INITIAL_LOST_ITEMS);
  const [showReportForm, setShowReportForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form State
  const [newItemImage, setNewItemImage] = useState<string | null>(null);
  const [formState, setFormState] = useState({
    title: '',
    description: '',
    location: '',
    contactName: '',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Swipe to back logic
  const touchStart = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => { touchStart.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const diff = e.changedTouches[0].clientX - touchStart.current;
    if (Math.abs(diff) > 50 && !showReportForm) onBack(); 
    touchStart.current = null;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setNewItemImage(ev.target.result as string);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: LostItem = {
      id: `li-${Date.now()}`,
      type: activeTab,
      ...formState,
      category: 'General', // Simplified for demo
      date: 'Just Now',
      image: newItemImage || undefined,
      status: 'open'
    };

    setItems([newItem, ...items]);
    setShowReportForm(false);
    setNewItemImage(null);
    setFormState({ title: '', description: '', location: '', contactName: '' });
  };

  const handleResolve = (e: React.MouseEvent, itemId: string) => {
    e.stopPropagation();
    setItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, status: 'resolved' } : item
    ));
  };

  const filteredItems = items.filter(item => 
    item.type === activeTab && 
    (item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
     item.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div 
      className="h-full flex flex-col bg-gray-50 dark:bg-gray-900 relative overflow-hidden transition-colors duration-300"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Header */}
      <div className="flex items-center gap-4 p-4 pt-safe-area border-b border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 sticky top-0 z-10 transition-colors">
         <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-900 dark:text-white transition">
            <ArrowLeft size={24} />
         </button>
         <h2 className="text-xl font-bold text-gray-900 dark:text-white">Lost & Found</h2>
      </div>

      <div className="p-6 pb-4 border-b border-gray-200 dark:border-white/5 bg-white dark:bg-gray-900/50 transition-colors">
        <div className="flex justify-between items-center mb-4">
          <div className="text-gray-500 dark:text-gray-400 text-sm">Report or find missing items</div>
          <button 
            onClick={() => setShowReportForm(true)}
            className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-primary/20"
          >
            <Plus size={16} /> Report Item
          </button>
        </div>

        <div className="flex gap-4 mb-4">
          <button 
            onClick={() => setActiveTab('lost')}
            className={`flex-1 py-3 rounded-xl font-bold transition-all border ${activeTab === 'lost' ? 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/50' : 'bg-gray-100 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-white/5'}`}
          >
            Lost Items
          </button>
          <button 
            onClick={() => setActiveTab('found')}
            className={`flex-1 py-3 rounded-xl font-bold transition-all border ${activeTab === 'found' ? 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-500/50' : 'bg-gray-100 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-white/5'}`}
          >
            Found Items
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-500 dark:text-gray-500" size={18} />
          <input 
            type="text" 
            placeholder={`Search ${activeTab} items...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-100 dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
      </div>

      {/* Items Grid */}
      <div className="flex-1 overflow-y-auto p-6 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div key={item.id} className={`border rounded-2xl overflow-hidden transition-colors group ${item.status === 'resolved' ? 'bg-gray-100 dark:bg-gray-900 border-gray-200 dark:border-white/5 opacity-70' : 'bg-white dark:bg-gray-800/40 border-gray-200 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-gray-800/60'}`}>
                <div className="flex h-36">
                   <div className="w-36 bg-gray-200 dark:bg-gray-700 shrink-0 relative overflow-hidden">
                     {item.image ? (
                       <img src={item.image} alt={item.title} className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${item.status === 'resolved' ? 'grayscale' : ''}`} />
                     ) : (
                       <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                         <HelpCircle size={32} />
                       </div>
                     )}
                     <div className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded text-white uppercase ${item.status === 'resolved' ? 'bg-gray-500' : (item.type === 'lost' ? 'bg-red-500' : 'bg-green-500')}`}>
                       {item.status === 'resolved' ? 'Resolved' : item.type}
                     </div>
                   </div>
                   <div className="p-3 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className={`font-bold leading-tight mb-1 ${item.status === 'resolved' ? 'text-gray-500 dark:text-gray-400 line-through' : 'text-gray-900 dark:text-white'}`}>{item.title}</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-xs line-clamp-2">{item.description}</p>
                      </div>
                      <div className="flex flex-col gap-2 mt-2">
                         <div className="space-y-1">
                            <div className="flex items-center gap-1 text-[10px] text-gray-500">
                               <MapPin size={10} /> {item.location}
                            </div>
                            <div className="flex items-center gap-1 text-[10px] text-gray-500">
                               <Calendar size={10} /> {item.date}
                            </div>
                         </div>
                         
                         <div className="flex items-center gap-2 mt-auto">
                           {item.status === 'open' ? (
                             <button 
                               onClick={(e) => handleResolve(e, item.id)}
                               className="px-3 py-1.5 bg-green-100 dark:bg-green-500/10 hover:bg-green-200 dark:hover:bg-green-500/20 text-green-600 dark:text-green-400 text-[10px] font-bold rounded-lg border border-green-200 dark:border-green-500/30 transition-colors flex items-center gap-1 flex-1 justify-center"
                             >
                                <CheckCircle size={12} /> Mark Resolved
                             </button>
                           ) : (
                             <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-green-600 dark:text-green-500/70 text-[10px] font-bold rounded-lg border border-gray-200 dark:border-white/5 flex items-center gap-1 w-full justify-center">
                                <CheckCircle size={12} /> Done
                             </span>
                           )}

                           {item.status === 'open' && (
                             <button className="p-1.5 bg-gray-100 dark:bg-white/5 hover:bg-primary hover:text-white text-primary rounded-lg transition-colors">
                                <Phone size={14} />
                             </button>
                           )}
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-10 text-gray-500">
              <HelpCircle size={48} className="mb-4 opacity-20" />
              <p>No {activeTab} items found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Report Modal */}
      {showReportForm && (
        <div className="fixed inset-0 z-[70] bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-3xl border border-gray-200 dark:border-white/10 shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-200 dark:border-white/10 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Report {activeTab === 'lost' ? 'Lost' : 'Found'} Item</h3>
              <button onClick={() => setShowReportForm(false)} className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
              {/* Image Upload */}
              <div className="relative h-40 bg-gray-100 dark:bg-black/30 border-2 border-dashed border-gray-300 dark:border-white/10 rounded-xl flex items-center justify-center overflow-hidden group cursor-pointer hover:bg-gray-200 dark:hover:bg-black/50 transition-colors" onClick={() => fileInputRef.current?.click()}>
                 {newItemImage ? (
                   <img src={newItemImage} alt="Preview" className="w-full h-full object-cover" />
                 ) : (
                   <div className="text-center text-gray-500 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                     <Camera size={32} className="mx-auto mb-2" />
                     <span className="text-sm">Tap to add photo</span>
                   </div>
                 )}
                 <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
              </div>

              <div className="space-y-3">
                 <input 
                   type="text" 
                   placeholder="Item Name (e.g. Blue Wallet)"
                   required
                   value={formState.title}
                   onChange={(e) => setFormState({...formState, title: e.target.value})}
                   className="w-full bg-gray-100 dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:border-primary outline-none transition-colors"
                 />
                 <textarea 
                   placeholder="Description (Color, brand, distinct features...)"
                   required
                   value={formState.description}
                   onChange={(e) => setFormState({...formState, description: e.target.value})}
                   className="w-full bg-gray-100 dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:border-primary outline-none resize-none h-24 transition-colors"
                 />
                 <input 
                   type="text" 
                   placeholder={`Location ${activeTab === 'lost' ? 'Lost' : 'Found'}`}
                   required
                   value={formState.location}
                   onChange={(e) => setFormState({...formState, location: e.target.value})}
                   className="w-full bg-gray-100 dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:border-primary outline-none transition-colors"
                 />
                 <input 
                   type="text" 
                   placeholder="Your Name / Contact Info"
                   required
                   value={formState.contactName}
                   onChange={(e) => setFormState({...formState, contactName: e.target.value})}
                   className="w-full bg-gray-100 dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:border-primary outline-none transition-colors"
                 />
              </div>

              <button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3 rounded-xl shadow-lg shadow-primary/20 mt-4"
              >
                Submit Report
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LostAndFound;
