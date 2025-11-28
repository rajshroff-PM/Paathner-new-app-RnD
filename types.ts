
import { LucideIcon } from 'lucide-react';

export interface Coordinate {
  x: number;
  y: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating?: number;
  customizable?: boolean;
}

export interface Store {
  id: string;
  name: string;
  category: string;
  iconName: string; // Mapped to Lucide icon in constants
  color: string; // Hex code
  position: Coordinate;
  floor: string; // "Ground", "1st Floor", "2nd Floor", "Food Court"
  hours: string;
  description: string;
  rating?: number;
  image?: string; // Hero image for the store/restaurant
  menu?: MenuItem[]; // Only for restaurants
  offer?: string; // New: Active offer text for proximity alerts
}

export interface ChatSource {
  title: string;
  uri: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isLoading?: boolean;
  sources?: ChatSource[]; // Grounding sources for web search results
  relatedStore?: Store; // Store details for navigation/offers
}

export interface GeoJSONFeature {
  type: 'Feature';
  properties: {
    type: 'boundary' | 'unit';
    storeId?: string;
    name?: string;
  };
  geometry: {
    type: 'Polygon';
    coordinates: number[][][];
  };
}

export interface GeoJSON {
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image?: string;
  images?: string[]; // Multiple images for carousel
  interestedCount?: number;
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
}

export interface BlogPost {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  likes: number;
  liked?: boolean;
  image?: string;
  comments: Comment[];
}

export interface Reward {
  id: string;
  title: string;
  cost: number;
  description: string;
  brand: string;
  iconName: string;
  color: string;
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: 'earn' | 'redeem';
  description: string;
}

export interface LoyaltyCard {
  id: string;
  storeId: string;
  storeName: string;
  points: number;
  color: string;
  iconName: string;
  memberSince: string;
  tier: string;
  transactions: Transaction[];
  customImage?: string;
  cardNumber?: string;
}

export interface Friend {
  id: string;
  name: string;
  avatar: string; // Initial
  image: string; // Full Image URL
  color: string;
  position: Coordinate;
  floor: string;
  isSharing: boolean;
  lastUpdate: string;
}

export type AvatarId = 'glider' | 'cat' | 'bot';

export interface ParkingZone {
  id: string;
  name: string;
  level: string; // P1, P2
  capacity: number;
  occupied: number;
  type: '4-Wheeler' | '2-Wheeler' | 'EV Charging';
  position: Coordinate; // Center of the zone for navigation
  bounds: { x: number, y: number, width: number, height: number }; // For rendering on map
  color: string;
}

export interface SavedVehicle {
  zoneId: string;
  slotNumber: string;
  level: string;
  timestamp: number;
  photo?: string;
  position: Coordinate;
}

export interface LostItem {
  id: string;
  type: 'lost' | 'found';
  title: string;
  description: string;
  category: string; // Electronics, Personal, Toys, etc.
  location: string; // Where it was lost/found
  date: string;
  image?: string;
  contactName: string;
  status: 'open' | 'resolved';
}

export interface Venue {
  id: string;
  name: string;
  city: string;
  state: string;
  type: 'Mall' | 'Airport' | 'Hospital' | 'Expo';
  isPremium?: boolean;
  image?: string;
}

export interface Amenity {
  id: string;
  name: string;
  iconName: string; 
  description?: string;
  image?: string;
  floor?: string;
  location?: Coordinate;
}

export interface Order {
  id: string;
  storeName: string;
  items: string[]; // List of item names
  total: number;
  date: string;
  status: 'Completed' | 'Cancelled' | 'In Progress' | 'Ready to takeaway' | 'Just ordered' | 'Preparing';
  rating?: number;
  pickupCode?: string;
}

export interface Coupon {
  code: string;
  description: string;
  discount: number; // multiplier e.g. 0.5 for 50%
  maxDiscount?: number;
  minOrderValue?: number;
  color: string;
}
