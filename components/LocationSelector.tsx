
import React, { useState, useRef } from 'react';
import { MapPin, Check, Building2, Plane, Stethoscope, Globe, Search, Star, Tent } from 'lucide-react';
import { VENUES } from '../constants';
import { Venue } from '../types';

interface LocationSelectorProps {
  currentVenue: Venue;
  onSelectVenue: (venue: Venue) => void;
  onClose: () => void;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({ currentVenue, onSelectVenue, onClose }) => {
  const [activeCategory, setActiveCategory] = useState<'All' | 'Mall' | 'Airport' | 'Hospital' | 'Expo'>('All');
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const cities = ['All', ...Array.from(new Set(VENUES.map(v => v.city)))];
  const categories = [
      { id: 'All', label: 'All', icon: Globe },
      { id: 'Mall', label: 'Malls', icon: Building2 },
      { id: 'Airport', label: 'Airports', icon: Plane },
      { id: 'Hospital', label: 'Health', icon: Stethoscope },
      { id: 'Expo', label: 'Expos', icon: Tent },
  ];

  const filteredVenues = VENUES.filter(venue => {
    const matchesCategory = activeCategory === 'All' || venue.type === activeCategory;
    const matchesCity = selectedCity === 'All' || venue.city === selectedCity;
    const matchesSearch = venue.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          venue.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesCity && matchesSearch;
  });

  return (
    <div 
      className="fixed inset-0 z-[110] bg-gray-50 dark:bg-gray-900 flex flex-col animate-fade-in transition-colors duration-300"
    >
       {/* Header */}
       <div className="bg-white dark:bg-gray-900 p-4 border-b border-gray-200 dark:border-white/10 pt-safe-area safe-area-top transition-colors">
          <div className="flex items-center gap-4 mb-4">
             <button onClick={onClose} className="text-gray-900 dark:text-white p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors">
                 Cancel
             </button>
             <h3 className="text-xl font-bold text-gray-900 dark:text-white flex-1 text-center mr-8">
                Select Location
             </h3>
          </div>

          {/* Search */}
          <div className="relative">
             <Search className="absolute left-3 top-3 text-gray-400 dark:text-gray-500" size={18} />
             <input 
               type="text" 
               placeholder="Search malls, airports, cities..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 focus:border-primary outline-none transition-colors"
             />
          </div>
       </div>

       {/* Filters */}
       <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-white/10 pb-2 transition-colors">
          {/* Category Tabs */}
          <div className="flex px-4 py-2 overflow-x-auto no-scrollbar gap-4">
             {categories.map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id as any)}
                  className={`flex flex-col items-center gap-1 min-w-[60px] transition-colors ${activeCategory === cat.id ? 'text-primary' : 'text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'}`}
                >
                   <div className={`p-3 rounded-full mb-1 transition-colors ${activeCategory === cat.id ? 'bg-primary/10 text-primary' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'}`}>
                      <cat.icon size={20} />
                   </div>
                   <span className="text-xs font-medium">{cat.label}</span>
                </button>
             ))}
          </div>

          {/* City Chips */}
          <div className="flex px-4 py-2 overflow-x-auto no-scrollbar gap-2">
             {cities.map(city => (
                <button 
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border transition-all ${
                     selectedCity === city 
                     ? 'bg-gray-900 dark:bg-white text-white dark:text-black border-gray-900 dark:border-white' 
                     : 'bg-transparent text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                >
                   {city}
                </button>
             ))}
          </div>
       </div>

       {/* List */}
       <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-black transition-colors">
          <div className="grid grid-cols-1 gap-6">
             {filteredVenues.map(venue => (
                <button
                  key={venue.id}
                  onClick={() => { onSelectVenue(venue); onClose(); }}
                  className={`w-full text-left relative overflow-hidden rounded-2xl border transition-all group shadow-lg hover:shadow-xl dark:shadow-none h-48 ${
                     currentVenue.id === venue.id 
                     ? 'border-primary ring-2 ring-primary' 
                     : 'border-gray-200 dark:border-white/10'
                  }`}
                >
                   {/* Background Image */}
                   <img 
                     src={venue.image} 
                     className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                     alt={venue.name} 
                   />
                   
                   {/* Gradient Overlay */}
                   <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

                   {/* Badges */}
                   <div className="absolute top-4 left-4 flex gap-2">
                      <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full border border-white/20 uppercase tracking-wide">
                         {venue.type}
                      </span>
                      {venue.isPremium && (
                         <span className="bg-yellow-500 text-black text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
                            <Star size={10} className="fill-black" /> PREMIUM
                         </span>
                      )}
                   </div>

                   {/* Selection Check */}
                   {currentVenue.id === venue.id && (
                      <div className="absolute top-4 right-4 bg-primary text-white p-1.5 rounded-full shadow-lg">
                         <Check size={16} />
                      </div>
                   )}

                   {/* Details */}
                   <div className="absolute bottom-0 left-0 right-0 p-5">
                      <h4 className="text-2xl font-bold text-white mb-1">{venue.name}</h4>
                      <div className="flex items-center gap-2 text-sm text-gray-300 font-medium">
                         <MapPin size={16} className="text-primary" /> {venue.city}, {venue.state}
                      </div>
                   </div>
                </button>
             ))}

             {filteredVenues.length === 0 && (
                <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                   No locations found.
                </div>
             )}
          </div>
       </div>
    </div>
  );
};

export default LocationSelector;
