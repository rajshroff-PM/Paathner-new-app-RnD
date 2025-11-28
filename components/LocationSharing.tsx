
import React, { useState } from 'react';
import { Friend } from '../types';
import { Share2, MapPin, Users, Navigation, MessageCircle, UserCircle, ChevronUp, ChevronDown } from 'lucide-react';

interface LocationSharingProps {
  isSharing: boolean;
  onToggleSharing: () => void;
  friends: Friend[];
  onLocateFriend: (friend: Friend) => void;
  onNavigateToFriend: (friend: Friend) => void;
  currentFloor: string;
  onCustomizeAvatar: () => void;
}

const LocationSharing: React.FC<LocationSharingProps> = ({
  isSharing,
  onToggleSharing,
  friends,
  onLocateFriend,
  onNavigateToFriend,
  currentFloor,
  onCustomizeAvatar
}) => {
  const [isListOpen, setIsListOpen] = useState(true);
  const activeFriends = friends.filter(f => f.isSharing);

  const handleShareOnWhatsApp = () => {
    const text = encodeURIComponent("Hey! I'm shopping at Amanora Mall. Track my live location here: https://amanora.app/join?room=f1a2");
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleFriendClick = (friend: Friend) => {
    onLocateFriend(friend);
    // Requirement: active friends tabs should be closed
    setIsListOpen(false);
  };

  const handleNavigateClick = (e: React.MouseEvent, friend: Friend) => {
    e.stopPropagation();
    onNavigateToFriend(friend);
    // Requirement: active friends tabs should be closed
    setIsListOpen(false);
  };

  return (
    <div className="absolute top-4 left-4 z-40 flex flex-col gap-2">
      {/* Controls Row */}
      <div className="flex gap-2">
        {/* Main Toggle */}
        <button 
          onClick={onToggleSharing}
          className={`
            flex items-center gap-3 px-4 py-3 rounded-2xl backdrop-blur-xl border shadow-lg transition-all duration-300
            ${isSharing 
              ? 'bg-green-500/90 border-green-400 text-white shadow-green-500/30' 
              : 'bg-white/90 dark:bg-gray-800/80 border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
            }
          `}
        >
          {isSharing ? (
            <>
              <div className="relative">
                <Share2 size={20} className="animate-pulse" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full animate-ping" />
              </div>
              <div className="text-left leading-none">
                <div className="text-xs font-bold opacity-80 uppercase">Live Location</div>
                <div className="font-bold text-sm">Sharing On</div>
              </div>
            </>
          ) : (
            <>
               <Share2 size={20} />
               <span className="font-bold text-sm">Share Location</span>
            </>
          )}
        </button>
        
        {/* Avatar Customization Button */}
        <button 
          onClick={onCustomizeAvatar}
          className="bg-white/90 dark:bg-gray-800/80 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-white p-3 rounded-2xl shadow-lg flex items-center justify-center border border-gray-200 dark:border-white/10 transition-transform active:scale-95 backdrop-blur-xl"
          title="Customize Navigation Avatar"
        >
          <UserCircle size={24} className="text-primary" />
        </button>

        {/* WhatsApp Button */}
        {isSharing && (
          <button 
            onClick={handleShareOnWhatsApp}
            className="bg-[#25D366] hover:bg-[#20bd5a] text-white p-3 rounded-2xl shadow-lg flex items-center justify-center border border-white/10 transition-transform active:scale-95"
            title="Invite friends via WhatsApp"
          >
            <MessageCircle size={24} />
          </button>
        )}
      </div>

      {/* Active Friends List (Only show when active) */}
      {isSharing && (
        <div className="w-64 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden animate-fade-in shadow-2xl transition-all">
          <button 
             onClick={() => setIsListOpen(!isListOpen)}
             className="w-full p-3 border-b border-gray-200 dark:border-white/10 flex items-center justify-between bg-gray-50/50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <Users size={14} /> Active Friends ({activeFriends.length})
            </div>
            {isListOpen ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
          </button>

          {isListOpen && (
            <div className="max-h-64 overflow-y-auto">
              {activeFriends.length > 0 ? (
                activeFriends.map(friend => (
                  <button
                    key={friend.id}
                    onClick={() => handleFriendClick(friend)}
                    className="w-full p-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-b border-gray-200 dark:border-white/5 last:border-0 text-left group"
                  >
                    <div className="relative">
                      <img 
                        src={friend.image} 
                        alt={friend.name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700 group-hover:border-primary transition-colors"
                      />
                      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center">
                         <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="text-gray-900 dark:text-white font-bold text-sm truncate group-hover:text-primary transition-colors">{friend.name}</div>
                      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <MapPin size={10} /> 
                        <span className={friend.floor === currentFloor ? 'text-green-600 dark:text-green-400' : ''}>
                          {friend.floor === currentFloor ? 'Nearby' : friend.floor}
                        </span>
                      </div>
                    </div>

                    <div 
                        onClick={(e) => handleNavigateClick(e, friend)}
                        className="p-2 text-gray-400 dark:text-gray-500 hover:text-white hover:bg-primary rounded-lg transition-all"
                    >
                      <Navigation size={16} />
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500 dark:text-gray-500 text-xs">
                  No friends are sharing location currently.
                </div>
              )}
              
              {/* Offline Friends Summary */}
              {friends.filter(f => !f.isSharing).length > 0 && (
                 <div className="p-3 bg-gray-50 dark:bg-black/20 text-xs text-gray-500 dark:text-gray-500 text-center border-t border-gray-200 dark:border-white/5">
                   {friends.filter(f => !f.isSharing).length} friends offline
                 </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationSharing;
