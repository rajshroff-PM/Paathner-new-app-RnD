
import React, { useState, useRef } from 'react';
import { 
  ArrowLeft, Edit2, Moon, Sun, Bell, User, HelpCircle, 
  MessageSquare, MessageCircle, Info, LogOut, 
  ChevronRight, Star, CheckCircle, Camera, 
  ChevronDown, ChevronUp, Send, Trash2, ExternalLink, Copy, Search, Gift, Heart, X
} from 'lucide-react';
import Logo from './Logo';
import { MALL_STORES } from '../constants';
import { Store } from '../types';

interface UserProfileProps {
  onClose: () => void;
  userPoints: number;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onLogout: () => void;
}

type ProfileView = 'main' | 'faqs' | 'chat' | 'feedback' | 'notifications' | 'account' | 'share' | 'about' | 'favorites';

const UserProfile: React.FC<UserProfileProps> = ({ onClose, isDarkMode, onToggleTheme, onLogout }) => {
  const [currentView, setCurrentView] = useState<ProfileView>('main');
  const [isEditing, setIsEditing] = useState(false);
  
  const [userInfo, setUserInfo] = useState({
    name: 'Raj Shroff',
    email: 'rajshroff52@gmail.com',
    phone: '+91 7987819652',
    image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
    state: 'Maharashtra',
    city: 'Pune'
  });

  // Local state for Favorites to demonstrate removal
  const [favorites, setFavorites] = useState<Store[]>(MALL_STORES.slice(0, 3));
  const [itemToRemove, setItemToRemove] = useState<Store | null>(null);

  const [notifSettings, setNotifSettings] = useState({
    all: true,
    push: true,
    email: false,
    promo: true,
  });

  const handleRemoveFavorite = () => {
    if (itemToRemove) {
      setFavorites(prev => prev.filter(s => s.id !== itemToRemove.id));
      setItemToRemove(null);
    }
  };

  const SubHeader = ({ title }: { title: string }) => (
    <div className="flex items-center gap-4 p-4 pt-safe-area bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-white/5 shrink-0 sticky top-0 z-10 transition-colors duration-300">
      <button 
        onClick={() => setCurrentView('main')} 
        className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 p-2 rounded-full transition-colors"
      >
        <ArrowLeft size={24} />
      </button>
      <h1 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h1>
    </div>
  );

  // --- VIEW: Favorites ---
  const FavoritesView = () => {
    return (
      <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 animate-slide-in-right transition-colors duration-300">
        <SubHeader title="My Favorites" />
        <div className="p-4 space-y-4 flex-1 overflow-y-auto">
           {favorites.length > 0 ? (
             favorites.map(store => (
               <div key={store.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm flex items-center gap-4 border border-gray-100 dark:border-white/5">
                  <img src={store.image} className="w-16 h-16 rounded-lg object-cover" alt={store.name} />
                  <div className="flex-1">
                     <h3 className="font-bold text-gray-900 dark:text-white">{store.name}</h3>
                     <p className="text-xs text-gray-500">{store.category} • {store.floor}</p>
                  </div>
                  <button 
                    onClick={() => setItemToRemove(store)}
                    className="text-red-500 p-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-colors"
                  >
                    <Heart size={20} className="fill-current" />
                  </button>
               </div>
             ))
           ) : (
             <div className="text-center text-gray-500 mt-10">No favorites added yet.</div>
           )}
        </div>

        {/* Confirmation Modal */}
        {itemToRemove && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white dark:bg-gray-900 w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-gray-200 dark:border-white/10 transform scale-100">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Remove Favorite?</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
                Do you want to remove <span className="font-bold text-gray-900 dark:text-white">{itemToRemove.name}</span> from your favorites list?
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setItemToRemove(null)}
                  className="flex-1 py-3 rounded-xl font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleRemoveFavorite}
                  className="flex-1 py-3 rounded-xl font-bold bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20 transition-colors"
                >
                  Yes, Remove
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  };

  // --- VIEW: Notifications ---
  const NotificationSettingsView = () => {
    const Toggle = ({ label, checked, onChange }: { label: string, checked: boolean, onChange: () => void }) => (
      <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-white/5 transition-colors">
         <span className="font-medium text-gray-900 dark:text-white">{label}</span>
         <button 
           onClick={onChange}
           className={`w-12 h-7 rounded-full p-1 transition-colors duration-300 ${checked ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}
         >
            <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
         </button>
      </div>
    );

    const handleAllToggle = () => {
       const newState = !notifSettings.all;
       setNotifSettings({
          all: newState,
          push: newState,
          email: newState,
          promo: newState
       });
    };

    return (
      <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 animate-slide-in-right transition-colors duration-300">
        <SubHeader title="Notification settings" />
        <div className="p-6 space-y-4">
           <div className="mb-6">
              <Toggle label="All Notifications" checked={notifSettings.all} onChange={handleAllToggle} />
           </div>
           <h3 className="text-xs font-bold text-gray-500 uppercase ml-2">Preferences</h3>
           <Toggle label="Push Notifications" checked={notifSettings.push} onChange={() => setNotifSettings(s => ({...s, push: !s.push}))} />
           <Toggle label="Email Notifications" checked={notifSettings.email} onChange={() => setNotifSettings(s => ({...s, email: !s.email}))} />
           <Toggle label="Promotional Offers" checked={notifSettings.promo} onChange={() => setNotifSettings(s => ({...s, promo: !s.promo}))} />
        </div>
      </div>
    );
  };

  // Main Profile View
  const MainView = () => (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white animate-fade-in transition-colors duration-300">
       <div className="flex items-center gap-4 p-4 pt-safe-area bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-white/5 shrink-0 transition-colors">
          <button onClick={onClose} className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-full transition-colors">
             <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">Profile</h1>
       </div>

       <div className="flex-1 overflow-y-auto px-4 pb-8">
          <div className="flex items-center justify-between mb-8 py-4">
             <div className="flex items-center gap-4">
                <div className="relative">
                   <img src={userInfo.image} className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700" alt="User" />
                </div>
                <div>
                   <h2 className="text-xl font-bold text-gray-900 dark:text-white">{userInfo.name}</h2>
                   <p className="text-gray-500 dark:text-gray-400 text-sm">{userInfo.phone}</p>
                </div>
             </div>
             <button onClick={() => setIsEditing(true)} className="text-gray-400 hover:text-primary transition-colors p-2 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-white/10 shadow-sm">
                <Edit2 size={20} />
             </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden mb-8 border border-gray-200 dark:border-white/5 shadow-sm transition-colors">
             <div className="w-full flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-300">
                      <Sun size={18} />
                   </div>
                   <span className="font-medium text-gray-900 dark:text-white">Appearance</span>
                </div>
                <div className="flex items-center gap-3">
                   <button 
                     onClick={onToggleTheme}
                     className={`relative w-14 h-8 rounded-full transition-colors duration-500 flex items-center px-1 ${isDarkMode ? 'bg-gray-700' : 'bg-blue-100'}`}
                   >
                      <div className={`w-6 h-6 rounded-full shadow-md transform transition-transform duration-500 flex items-center justify-center ${isDarkMode ? 'translate-x-6 bg-gray-900' : 'translate-x-0 bg-white'}`}>
                         {isDarkMode ? <Moon size={12} className="text-white" /> : <Sun size={14} className="text-yellow-500" />}
                      </div>
                   </button>
                </div>
             </div>
          </div>

          {/* Favorites Section Link */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden mb-8 border border-gray-200 dark:border-white/5 shadow-sm transition-colors">
             <button onClick={() => setCurrentView('favorites')} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center gap-3">
                   <Heart size={20} className="text-pink-500" />
                   <span className="font-medium text-gray-900 dark:text-white">Favorites</span>
                </div>
                <ChevronRight size={18} className="text-gray-400" />
             </button>
          </div>

          <h3 className="text-gray-500 dark:text-gray-400 font-bold text-sm uppercase tracking-wider mb-3 px-1">Support & More</h3>
          <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden mb-8 border border-gray-200 dark:border-white/5 shadow-sm transition-colors">
             <button onClick={() => setCurrentView('faqs')} className="w-full flex items-center justify-between p-4 border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center gap-3">
                   <HelpCircle size={20} className="text-gray-400" />
                   <span className="font-medium text-gray-900 dark:text-white">FAQs</span>
                </div>
                <ChevronRight size={18} className="text-gray-400" />
             </button>
             <button onClick={() => setCurrentView('chat')} className="w-full flex items-center justify-between p-4 border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center gap-3">
                   <MessageSquare size={20} className="text-gray-400" />
                   <span className="font-medium text-gray-900 dark:text-white">Chat with us</span>
                </div>
                <ChevronRight size={18} className="text-gray-400" />
             </button>
             <button onClick={() => setCurrentView('feedback')} className="w-full flex items-center justify-between p-4 border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center gap-3">
                   <MessageCircle size={20} className="text-gray-400" />
                   <span className="font-medium text-gray-900 dark:text-white">Share feedback</span>
                </div>
                <ChevronRight size={18} className="text-gray-400" />
             </button>
             <button onClick={() => setCurrentView('notifications')} className="w-full flex items-center justify-between p-4 border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center gap-3">
                   <Bell size={20} className="text-gray-400" />
                   <span className="font-medium text-gray-900 dark:text-white">Notification settings</span>
                </div>
                <ChevronRight size={18} className="text-gray-400" />
             </button>
             <button onClick={() => setCurrentView('account')} className="w-full flex items-center justify-between p-4 border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center gap-3">
                   <User size={20} className="text-gray-400" />
                   <span className="font-medium text-gray-900 dark:text-white">Account settings</span>
                </div>
                <ChevronRight size={18} className="text-gray-400" />
             </button>
             <button onClick={() => setCurrentView('about')} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center gap-3">
                   <Info size={20} className="text-gray-400" />
                   <span className="font-medium text-gray-900 dark:text-white">About us</span>
                </div>
                <ChevronRight size={18} className="text-gray-400" />
             </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden mb-8 border border-gray-200 dark:border-white/5 shadow-sm transition-colors">
             <button onClick={onLogout} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
                <div className="flex items-center gap-3">
                   <LogOut size={20} className="text-gray-400 group-hover:text-red-500 transition-colors" />
                   <span className="font-medium text-gray-900 dark:text-white group-hover:text-red-500 transition-colors">Logout</span>
                </div>
                <ChevronRight size={18} className="text-gray-400 group-hover:text-red-500 transition-colors" />
             </button>
          </div>
       </div>
    </div>
  );

  // Stub Views for completeness (simplified for this file size limit)
  const FAQView = () => <div className="p-4"><SubHeader title="FAQs"/></div>;
  const ChatView = () => <div className="p-4"><SubHeader title="Chat"/></div>;
  const FeedbackView = () => <div className="p-4"><SubHeader title="Feedback"/></div>;
  const AccountSettingsView = () => <div className="p-4"><SubHeader title="Account"/></div>;
  const ShareAppView = () => <div className="p-4"><SubHeader title="Share"/></div>;
  const AboutUsView = () => <div className="p-4"><SubHeader title="About"/></div>;
  const EditProfileView = () => <div className="p-4">Edit View Stub</div>;

  const renderView = () => {
    if (isEditing) return <EditProfileView />;
    switch(currentView) {
      case 'notifications': return <NotificationSettingsView />;
      case 'favorites': return <FavoritesView />;
      case 'faqs': return <FAQView />;
      case 'chat': return <ChatView />;
      case 'feedback': return <FeedbackView />;
      case 'account': return <AccountSettingsView />;
      case 'share': return <ShareAppView />;
      case 'about': return <AboutUsView />;
      default: return <MainView />;
    }
  };

  return (
    <div className="fixed inset-0 z-[90] bg-gray-50 dark:bg-gray-900 flex flex-col animate-fade-in overflow-hidden transition-colors duration-300">
       {renderView()}
    </div>
  );
};

export default React.memo(UserProfile);
