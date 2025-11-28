
import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, Edit2, Moon, Sun, Bell, User, HelpCircle, 
  MessageSquare, MessageCircle, Info, LogOut, 
  ChevronRight, Star, CheckCircle, Camera, 
  ChevronDown, ChevronUp, Send, Trash2, ExternalLink, Copy, Search, Gift, Heart, X, QrCode, Shield, Lock, Smartphone, Mail, MapPin, Facebook, Instagram, Globe
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

// Mock Data for States and Cities
const LOCATION_DATA: Record<string, string[]> = {
    'Maharashtra': ['Pune', 'Mumbai', 'Nagpur', 'Nashik'],
    'Delhi': ['New Delhi', 'North Delhi', 'South Delhi'],
    'Karnataka': ['Bangalore', 'Mysore', 'Hubli'],
    'Telangana': ['Hyderabad', 'Warangal'],
    'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai'],
    'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara']
};

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

  // --- VIEW: Edit Profile ---
  const EditProfileView = () => {
    const [formData, setFormData] = useState({ ...userInfo });
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [otp, setOtp] = useState(['', '', '', '']);
    const [isVerifying, setIsVerifying] = useState(false);
    const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

    const availableCities = LOCATION_DATA[formData.state] || [];

    const handleSaveClick = () => {
        // Check if sensitive data changed
        const isSensitiveChanged = formData.email !== userInfo.email || formData.phone !== userInfo.phone;
        
        if (isSensitiveChanged) {
            setShowOtpModal(true);
        } else {
            setUserInfo(formData);
            setIsEditing(false);
        }
    };

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        
        // Auto focus next
        if (value && index < 3) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    const handleVerifyOtp = () => {
        setIsVerifying(true);
        setTimeout(() => {
            setIsVerifying(false);
            setUserInfo(formData);
            setShowOtpModal(false);
            setIsEditing(false);
        }, 1500);
    };

    return (
      <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 animate-slide-in-right relative">
        <div className="flex items-center gap-4 p-4 pt-safe-area bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-white/5 shrink-0 sticky top-0 z-10">
            <button onClick={() => setIsEditing(false)} className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 p-2 rounded-full">
                <ArrowLeft size={24} />
            </button>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Edit Profile</h1>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
            {/* Avatar Edit */}
            <div className="flex justify-center mb-8">
                <div className="relative group cursor-pointer">
                    <img src={formData.image} className="w-28 h-28 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-xl" alt="Profile" />
                    <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera size={24} className="text-white" />
                    </div>
                    <button className="absolute bottom-0 right-0 bg-primary text-white p-2.5 rounded-full border-4 border-white dark:border-gray-900 shadow-md transform translate-x-1 translate-y-1">
                        <Camera size={16} />
                    </button>
                </div>
            </div>

            <div className="space-y-5">
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1.5 block">Full Name</label>
                    <div className="relative">
                        <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text" 
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-gray-900 dark:text-white focus:outline-none focus:border-primary transition-colors"
                        />
                    </div>
                </div>
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1.5 block">Email Address</label>
                    <div className="relative">
                        <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="email" 
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-gray-900 dark:text-white focus:outline-none focus:border-primary transition-colors"
                        />
                    </div>
                </div>
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1.5 block">Phone Number</label>
                    <div className="relative">
                        <Smartphone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="tel" 
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-gray-900 dark:text-white focus:outline-none focus:border-primary transition-colors"
                        />
                    </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1.5 block">State</label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                <MapPin size={18} className="text-gray-400" />
                            </div>
                            <select 
                                value={formData.state}
                                onChange={(e) => setFormData({...formData, state: e.target.value, city: LOCATION_DATA[e.target.value][0]})}
                                className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/10 rounded-xl pl-11 pr-8 py-3.5 text-gray-900 dark:text-white focus:outline-none focus:border-primary transition-colors appearance-none"
                            >
                                {Object.keys(LOCATION_DATA).map(state => (
                                    <option key={state} value={state}>{state}</option>
                                ))}
                            </select>
                            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1.5 block">City</label>
                        <div className="relative">
                            <select 
                                value={formData.city}
                                onChange={(e) => setFormData({...formData, city: e.target.value})}
                                className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-gray-900 dark:text-white focus:outline-none focus:border-primary transition-colors appearance-none"
                            >
                                {availableCities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-white/5 pb-safe-area">
            <button onClick={handleSaveClick} className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 active:scale-95 transition-transform hover:bg-primary-hover">
                Save Changes
            </button>
        </div>

        {/* OTP Modal */}
        {showOtpModal && (
            <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white dark:bg-gray-900 w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-gray-200 dark:border-white/10">
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                            <Shield size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Verify Changes</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            For security, please enter the OTP sent to your previous contact method.
                        </p>
                    </div>

                    <div className="flex justify-center gap-3 mb-8">
                        {otp.map((digit, i) => (
                            <input
                                key={i}
                                ref={el => otpRefs.current[i] = el}
                                type="text"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleOtpChange(i, e.target.value)}
                                className="w-12 h-14 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-white/10 rounded-xl text-center text-2xl font-bold text-gray-900 dark:text-white focus:border-primary focus:outline-none transition-colors"
                            />
                        ))}
                    </div>

                    <div className="flex gap-3">
                        <button 
                            onClick={() => setShowOtpModal(false)}
                            className="flex-1 py-3 rounded-xl font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleVerifyOtp}
                            disabled={isVerifying || otp.join('').length < 4}
                            className="flex-1 py-3 rounded-xl font-bold bg-primary text-white hover:bg-primary-hover shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                        >
                            {isVerifying ? 'Verifying...' : 'Verify'}
                        </button>
                    </div>
                </div>
            </div>
        )}
      </div>
    );
  };

  // --- VIEW: Favorites ---
  const FavoritesView = () => {
    return (
      <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 animate-slide-in-right transition-colors duration-300">
        <SubHeader title="My Favorites" />
        <div className="p-4 space-y-4 flex-1 overflow-y-auto">
           {favorites.length > 0 ? (
             favorites.map(store => (
               <div key={store.id} className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm flex items-center gap-4 border border-gray-100 dark:border-white/5 transition-all hover:shadow-md">
                  <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-gray-100 dark:bg-gray-700">
                    <img src={store.image} className="w-full h-full object-cover" alt={store.name} />
                  </div>
                  <div className="flex-1 min-w-0">
                     <h3 className="font-bold text-gray-900 dark:text-white truncate">{store.name}</h3>
                     <p className="text-xs text-gray-500 mb-1">{store.category} • {store.floor}</p>
                     {store.rating && (
                        <div className="flex items-center gap-1 text-[10px] font-bold bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-1.5 py-0.5 rounded w-fit">
                            <Star size={10} className="fill-current" /> {store.rating}
                        </div>
                     )}
                  </div>
                  <button 
                    onClick={() => setItemToRemove(store)}
                    className="p-2.5 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-colors text-red-500"
                  >
                    <Heart size={20} className="fill-current" />
                  </button>
               </div>
             ))
           ) : (
             <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <Heart size={48} className="mb-4 opacity-20" />
                <p>No favorites added yet.</p>
             </div>
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
        <SubHeader title="Notification Settings" />
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

  // --- VIEW: FAQs ---
  const FAQView = () => {
      const faqs = [
          { q: "How do I earn points?", a: "You earn points by visiting stores, scanning QR codes at checkout, and participating in events. Look for the 'Scan' button on the map!" },
          { q: "Can I book parking in advance?", a: "Currently, you can only check live availability. Reservation features are coming in the next update." },
          { q: "Is the mall open on holidays?", a: "Yes, Amanora Mall is open 365 days a year from 10 AM to 11 PM. Cinema and Food Court timings may vary." },
          { q: "Where is the lost and found?", a: "The Lost & Found desk is located at the Ground Floor information center near the North Exit." },
          { q: "Is there free Wi-Fi?", a: "Yes, free Wi-Fi is available mall-wide. Select 'Amanora_Guest' and log in with your mobile number." },
      ];
      const [openIndex, setOpenIndex] = useState<number | null>(null);

      return (
          <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 animate-slide-in-right">
              <SubHeader title="FAQs" />
              <div className="p-4 space-y-3 flex-1 overflow-y-auto">
                  {faqs.map((faq, idx) => (
                      <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-white/5 overflow-hidden shadow-sm">
                          <button 
                            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                            className="w-full flex justify-between items-center p-4 text-left font-bold text-gray-900 dark:text-white text-sm"
                          >
                              {faq.q}
                              {openIndex === idx ? <ChevronUp size={16} className="text-primary" /> : <ChevronDown size={16} className="text-gray-400" />}
                          </button>
                          {openIndex === idx && (
                              <div className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-white/10 pt-3 bg-gray-50 dark:bg-white/5">
                                  {faq.a}
                              </div>
                          )}
                      </div>
                  ))}
              </div>
          </div>
      );
  };

  // --- VIEW: Chat Support ---
  const ChatView = () => {
      const [msg, setMsg] = useState('');
      const [history, setHistory] = useState([
          { role: 'agent', text: 'Hi Raj! How can we help you today?' }
      ]);

      const handleSend = () => {
          if (!msg.trim()) return;
          setHistory(prev => [...prev, { role: 'user', text: msg }]);
          setMsg('');
          setTimeout(() => {
              setHistory(prev => [...prev, { role: 'agent', text: 'Thanks for reaching out. An agent will connect with you shortly.' }]);
          }, 1000);
      }

      return (
          <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 animate-slide-in-right">
              <SubHeader title="Support Chat" />
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {history.map((h, i) => (
                      <div key={i} className={`flex ${h.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${h.role === 'user' ? 'bg-primary text-white rounded-tr-sm' : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-sm shadow-sm'}`}>
                              {h.text}
                          </div>
                      </div>
                  ))}
              </div>
              <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-white/10 flex gap-2">
                  <input 
                    className="flex-1 bg-gray-100 dark:bg-gray-800 border border-transparent focus:border-primary rounded-xl px-4 py-2 outline-none text-gray-900 dark:text-white"
                    placeholder="Type a message..."
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  />
                  <button onClick={handleSend} className="bg-primary text-white p-2 rounded-xl">
                      <Send size={20} />
                  </button>
              </div>
          </div>
      );
  };

  // --- VIEW: Feedback ---
  const FeedbackView = () => {
      const [rating, setRating] = useState(0);
      const [comment, setComment] = useState('');
      const [submitted, setSubmitted] = useState(false);

      if (submitted) {
          return (
              <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 animate-slide-in-right items-center justify-center p-8 text-center">
                  <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-6">
                      <CheckCircle size={40} className="text-green-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Thank You!</h2>
                  <p className="text-gray-500 dark:text-gray-400 mb-8">Your feedback helps us improve the Paathner experience.</p>
                  <button onClick={() => setCurrentView('main')} className="bg-primary text-white px-8 py-3 rounded-xl font-bold shadow-lg">Back to Profile</button>
              </div>
          )
      }

      return (
          <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 animate-slide-in-right">
              <SubHeader title="Share Feedback" />
              <div className="p-6">
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 text-center">
                      How was your experience with the app?
                  </p>
                  
                  <div className="flex justify-center gap-2 mb-8">
                      {[1, 2, 3, 4, 5].map((star) => (
                          <button key={star} onClick={() => setRating(star)} className="transition-transform hover:scale-110">
                              <Star 
                                size={40} 
                                className={`${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-700'}`} 
                              />
                          </button>
                      ))}
                  </div>

                  <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase ml-1">Comments</label>
                      <textarea 
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Tell us what you liked or what we can improve..."
                          className="w-full h-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/10 rounded-xl p-4 text-gray-900 dark:text-white focus:outline-none focus:border-primary resize-none"
                      ></textarea>
                  </div>

                  <button 
                    onClick={() => setSubmitted(true)}
                    disabled={rating === 0}
                    className="w-full bg-primary disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg mt-8 transition-transform active:scale-95"
                  >
                      Submit Feedback
                  </button>
              </div>
          </div>
      );
  };

  // --- VIEW: Account Settings ---
  const AccountSettingsView = () => {
      return (
          <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 animate-slide-in-right">
              <SubHeader title="Account Settings" />
              <div className="p-4 space-y-4">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-white/5 overflow-hidden">
                      <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-100 dark:border-white/5">
                          <div className="flex items-center gap-3">
                              <Lock size={20} className="text-gray-400" />
                              <span className="font-medium text-gray-900 dark:text-white">Change Password</span>
                          </div>
                          <ChevronRight size={18} className="text-gray-400" />
                      </button>
                      <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                          <div className="flex items-center gap-3">
                              <Shield size={20} className="text-gray-400" />
                              <span className="font-medium text-gray-900 dark:text-white">Privacy & Security</span>
                          </div>
                          <ChevronRight size={18} className="text-gray-400" />
                      </button>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-white/5 overflow-hidden">
                      <button className="w-full flex items-center justify-between p-4 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors group">
                          <div className="flex items-center gap-3">
                              <Trash2 size={20} className="text-red-500" />
                              <span className="font-medium text-red-500">Delete Account</span>
                          </div>
                          <ChevronRight size={18} className="text-red-500 opacity-50 group-hover:opacity-100" />
                      </button>
                  </div>
                  
                  <p className="text-xs text-center text-gray-400 mt-4">
                      Deleting your account will remove all your points and history permanently.
                  </p>
              </div>
          </div>
      );
  };

  // --- VIEW: Share App ---
  const ShareAppView = () => {
      const [copied, setCopied] = useState(false);
      const link = "https://paathner.app/invite/raj52";

      const handleCopy = () => {
          navigator.clipboard.writeText(link);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
      }

      const handleSocialShare = (platform: string) => {
          const text = encodeURIComponent("Check out Paathner, the ultimate mall companion app! Use my invite link:");
          const url = encodeURIComponent(link);
          let deepLink = '';

          switch(platform) {
              case 'whatsapp':
                  deepLink = `https://wa.me/?text=${text} ${url}`;
                  break;
              case 'facebook':
                  deepLink = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                  break;
              case 'twitter': // X (formerly Twitter)
                  deepLink = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
                  break;
              case 'sms':
                  deepLink = `sms:?body=${text} ${url}`;
                  break;
              default:
                  return;
          }
          window.open(deepLink, '_blank');
      };

      return (
          <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 animate-slide-in-right">
              <SubHeader title="Invite Friends" />
              <div className="flex-1 flex flex-col items-center p-8 text-center overflow-y-auto">
                  <div className="bg-white p-4 rounded-3xl shadow-xl mb-8">
                      <QrCode size={200} className="text-black" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Scan to Download</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 max-w-xs">
                      Share the Paathner experience with your friends and earn 50 points for every referral!
                  </p>

                  {/* Copy Link Section */}
                  <div className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-xl p-2 flex items-center border border-gray-200 dark:border-white/10 shadow-sm mb-8">
                      <span className="flex-1 text-sm text-gray-600 dark:text-gray-300 truncate px-2 font-mono bg-transparent outline-none">
                          {link}
                      </span>
                      <button 
                        onClick={handleCopy}
                        className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${copied ? 'bg-green-500 text-white' : 'bg-primary text-white hover:bg-primary-hover'}`}
                      >
                          {copied ? 'Copied!' : 'Copy'}
                      </button>
                  </div>

                  {/* Social Share Icons */}
                  <div className="w-full max-w-sm">
                      <p className="text-xs font-bold text-gray-400 uppercase mb-4 tracking-wider">Share via</p>
                      <div className="flex justify-center gap-6">
                          <button onClick={() => handleSocialShare('whatsapp')} className="flex flex-col items-center gap-2 group">
                              <div className="w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center text-white shadow-lg shadow-[#25D366]/30 group-hover:scale-110 transition-transform">
                                  <MessageCircle size={28} className="fill-current" />
                              </div>
                              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">WhatsApp</span>
                          </button>
                          
                          <button onClick={() => handleSocialShare('instagram')} className="flex flex-col items-center gap-2 group">
                              <div className="w-14 h-14 bg-gradient-to-tr from-[#FFDC80] via-[#FD1D1D] to-[#833AB4] rounded-full flex items-center justify-center text-white shadow-lg shadow-[#FD1D1D]/30 group-hover:scale-110 transition-transform">
                                  <Instagram size={28} />
                              </div>
                              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Instagram</span>
                          </button>

                          <button onClick={() => handleSocialShare('facebook')} className="flex flex-col items-center gap-2 group">
                              <div className="w-14 h-14 bg-[#1877F2] rounded-full flex items-center justify-center text-white shadow-lg shadow-[#1877F2]/30 group-hover:scale-110 transition-transform">
                                  <Facebook size={28} className="fill-current" />
                              </div>
                              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Facebook</span>
                          </button>

                          <button onClick={() => handleSocialShare('sms')} className="flex flex-col items-center gap-2 group">
                              <div className="w-14 h-14 bg-gray-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-gray-500/30 group-hover:scale-110 transition-transform">
                                  <MessageSquare size={28} className="fill-current" />
                              </div>
                              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">SMS</span>
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      );
  };

  // --- VIEW: About Us ---
  const AboutUsView = () => {
      return (
          <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 animate-slide-in-right">
              <SubHeader title="About Paathner" />
              <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center">
                  
                  {/* Splash-style Logo Animation */}
                  <div className="relative group cursor-pointer mt-8 mb-6">
                     {/* Ripple/Echo Effect */}
                     <div className="absolute inset-0 bg-primary/30 rounded-full blur-xl animate-ping opacity-20"></div>
                     {/* Main Logo */}
                     <div className="w-32 h-32 relative z-10 transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3 animate-pulse-slow">
                        <Logo className="w-full h-full text-white drop-shadow-[0_0_25px_rgba(6,108,228,0.5)]" noBackground={false} />
                     </div>
                  </div>

                  <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-1">Paathner</h2>
                  <p className="text-gray-500 font-mono text-sm mb-8">Version 2.4.0 (Build 522)</p>

                  <div className="w-full max-w-sm space-y-3">
                      <button className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-white/5 hover:border-primary/50 transition-colors">
                          <span className="font-medium text-gray-900 dark:text-white">Terms of Service</span>
                          <ExternalLink size={16} className="text-gray-400" />
                      </button>
                      <button className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-white/5 hover:border-primary/50 transition-colors">
                          <span className="font-medium text-gray-900 dark:text-white">Privacy Policy</span>
                          <ExternalLink size={16} className="text-gray-400" />
                      </button>
                      <button 
                        onClick={() => window.open('https://www.paathner.com', '_blank')}
                        className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-white/5 hover:border-primary/50 transition-colors"
                      >
                          <span className="font-medium text-gray-900 dark:text-white">Open Website</span>
                          <Globe size={16} className="text-gray-400" />
                      </button>
                  </div>

                  <div className="mt-auto pt-8 text-center">
                      <p className="text-xs text-gray-400">
                          © 2025 Paathner Inc. <br/> Designed with ❤️ in Pune.
                      </p>
                  </div>
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
             <button onClick={() => setCurrentView('share')} className="w-full flex items-center justify-between p-4 border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center gap-3">
                   <QrCode size={20} className="text-gray-400" />
                   <span className="font-medium text-gray-900 dark:text-white">Invite Friends</span>
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
