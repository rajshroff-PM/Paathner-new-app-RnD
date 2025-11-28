import React from 'react';
import { AvatarId } from '../types';
import { AVATAR_CONFIG } from '../constants';
import { X, Check } from 'lucide-react';

interface AvatarSelectorProps {
  selectedAvatar: AvatarId;
  onSelect: (id: AvatarId) => void;
  onClose: () => void;
}

const AvatarSelector: React.FC<AvatarSelectorProps> = ({ selectedAvatar, onSelect, onClose }) => {
  const avatarIds = Object.keys(AVATAR_CONFIG) as AvatarId[];

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in p-4">
      <div className="relative bg-gray-900 rounded-3xl border border-white/10 shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
        
        <div className="p-6 text-center border-b border-white/5 relative">
          <h2 className="text-2xl font-bold text-white">Choose Your Avatar</h2>
          <p className="text-gray-400 text-sm">How do you want to appear on the map?</p>
          <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="p-8 grid grid-cols-1 gap-4">
          {avatarIds.map((id) => {
            const config = AVATAR_CONFIG[id];
            const isSelected = selectedAvatar === id;
            const Icon = config.icon;

            return (
              <button
                key={id}
                onClick={() => onSelect(id)}
                className={`relative group flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 ${
                  isSelected 
                    ? 'bg-white/10 border-primary ring-1 ring-primary/50' 
                    : 'bg-gray-800/50 border-white/5 hover:bg-white/5 hover:border-white/20'
                }`}
              >
                <div 
                  className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${isSelected ? 'animate-bounce' : ''}`}
                  style={{ backgroundColor: config.color }}
                >
                  <Icon size={32} className="text-white" />
                </div>

                <div className="flex-1 text-left">
                  <h3 className="text-lg font-bold text-white">{config.name}</h3>
                  <p className="text-sm text-gray-400">{config.desc}</p>
                </div>

                {isSelected && (
                  <div className="bg-primary text-white p-2 rounded-full shadow-lg">
                    <Check size={16} />
                  </div>
                )}
                
                {/* Preview Trail Effect */}
                {isSelected && (
                   <div 
                     className="absolute -bottom-1 left-12 w-8 h-2 rounded-full blur-md opacity-50"
                     style={{ backgroundColor: config.color }}
                   ></div>
                )}
              </button>
            );
          })}
        </div>

        <div className="p-6 bg-gray-800/30 border-t border-white/5">
           <button 
             onClick={onClose}
             className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3 rounded-xl shadow-lg transition-transform active:scale-95"
           >
             Confirm Choice
           </button>
        </div>
      </div>
    </div>
  );
};

export default AvatarSelector;