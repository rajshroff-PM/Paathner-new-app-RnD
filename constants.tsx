
import React from 'react';
import { Store, GeoJSON, Event, BlogPost, Reward, LoyaltyCard, Friend, AvatarId, ParkingZone, LostItem, Venue, Amenity, Order, Coupon } from './types';
import { 
  Smartphone, 
  Shirt, 
  Pizza, 
  UtensilsCrossed, 
  Apple, 
  Store as StoreIcon,
  Coffee,
  ShoppingBag,
  Watch,
  Glasses,
  Gamepad2,
  Gift,
  Zap,
  Cat,
  Bot,
  Car,
  Bike,
  Zap as Lightning,
  DoorOpen,
  LogOut,
  Film,
  Banknote,
  Cigarette,
  ArrowUpCircle,
  Stethoscope,
  CarTaxiFront,
  Bath,
  Info,
  Droplets,
  Circle
} from 'lucide-react';

// Icon mapping
export const ICON_MAP: Record<string, React.ElementType> = {
  'apple': Apple,
  'shirt': Shirt,
  'pizza': Pizza,
  'utensils': UtensilsCrossed,
  'smartphone': Smartphone,
  'coffee': Coffee,
  'bag': ShoppingBag,
  'watch': Watch,
  'glasses': Glasses,
  'game': Gamepad2,
  'gift': Gift,
  'car': Car,
  'bike': Bike,
  'ev': Lightning,
  'entry': DoorOpen,
  'exit': LogOut,
  'film': Film,
  'restroom': Bath,
  'atm': Banknote,
  'stairs': ArrowUpCircle,
  'elevator': ArrowUpCircle, 
  'aid': Stethoscope,
  'smoking': Cigarette,
  'taxi': CarTaxiFront,
  'water': Droplets,
  'kiosk': Info,
  'default': StoreIcon,
};

export const FLOORS = ["P2", "P1", "Ground", "1st Floor", "2nd Floor", "Food Court"];

export const VENUES: Venue[] = [
  { id: 'amanora', name: 'Amanora Mall', city: 'Pune', state: 'Maharashtra', type: 'Mall', image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=800&q=80' },
  { id: 'aero', name: 'Aero Mall', city: 'Pune', state: 'Maharashtra', type: 'Mall', image: 'https://images.unsplash.com/photo-1555617778-02518510b9fa?auto=format&fit=crop&w=800&q=80' },
  { id: 'vatika1', name: 'Vatika Town Square', city: 'Gurgaon', state: 'Haryana', type: 'Mall', image: 'https://images.unsplash.com/photo-1519567241046-7f570eee3c9e?auto=format&fit=crop&w=800&q=80' },
  { id: 'dlf', name: 'DLF CyberHub', city: 'Gurgaon', state: 'Haryana', type: 'Mall', image: 'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?auto=format&fit=crop&w=800&q=80' },
  { id: 'phoenix', name: 'Phoenix Marketcity', city: 'Mumbai', state: 'Maharashtra', type: 'Mall', image: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=800&q=80' },
  { id: 'elante', name: 'Elante Mall', city: 'Chandigarh', state: 'Punjab', type: 'Mall', image: 'https://images.unsplash.com/photo-1519817914152-22d216bb9170?auto=format&fit=crop&w=800&q=80' },
  { id: 'delhi-t3', name: 'Indira Gandhi Int. Airport T3', city: 'New Delhi', state: 'Delhi', type: 'Airport', isPremium: true, image: 'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?auto=format&fit=crop&w=800&q=80' },
  { id: 'expo-mart', name: 'India Expo Mart', city: 'Greater Noida', state: 'Uttar Pradesh', type: 'Expo', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80' },
];

export const AVATAR_CONFIG: Record<AvatarId, { name: string, icon: React.ElementType, color: string, desc: string, trailColor: string }> = {
  'glider': {
    name: 'Neon Glider',
    icon: Zap,
    color: '#066CE4', // Blue
    trailColor: 'rgba(6, 108, 228, 0.5)',
    desc: 'Swift and silent.'
  },
  'cat': {
    name: 'Turbo Cat',
    icon: Cat,
    color: '#E546A4', // Pink
    trailColor: 'rgba(229, 70, 164, 0.5)',
    desc: 'Agile explorer.'
  },
  'bot': {
    name: 'Cosmic Bot',
    icon: Bot,
    color: '#8b5cf6', // Violet
    trailColor: 'rgba(139, 92, 246, 0.5)',
    desc: 'Precise navigation.'
  }
};

export const PARKING_ZONES: ParkingZone[] = [
  {
    id: 'p1-a',
    name: 'Zone A (Premium)',
    level: 'P1',
    capacity: 50,
    occupied: 42,
    type: '4-Wheeler',
    position: { x: 300, y: 300 },
    bounds: { x: 150, y: 150, width: 300, height: 300 },
    color: '#066CE4'
  },
  {
    id: 'p1-b',
    name: 'Zone B (EV Charging)',
    level: 'P1',
    capacity: 20,
    occupied: 5,
    type: 'EV Charging',
    position: { x: 700, y: 300 },
    bounds: { x: 550, y: 150, width: 300, height: 300 },
    color: '#10B981'
  },
  {
    id: 'p2-a',
    name: 'Zone C (Standard)',
    level: 'P2',
    capacity: 120,
    occupied: 80,
    type: '4-Wheeler',
    position: { x: 300, y: 400 },
    bounds: { x: 100, y: 200, width: 400, height: 400 },
    color: '#E546A4'
  },
  {
    id: 'p2-b',
    name: 'Zone D (2-Wheelers)',
    level: 'P2',
    capacity: 200,
    occupied: 150,
    type: '2-Wheeler',
    position: { x: 750, y: 400 },
    bounds: { x: 600, y: 200, width: 300, height: 400 },
    color: '#8B5CF6'
  }
];

export const MALL_STORES: Store[] = [
  // ENTRIES & EXITS
  {
    id: 'e1',
    name: "Main Entrance",
    category: "Entry/Exit",
    iconName: "entry",
    color: "#066CE4",
    position: { x: 500, y: 780 },
    floor: "Ground",
    hours: "08:00 AM - 11:00 PM",
    description: "Main entry point with valet parking.",
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 'e2',
    name: "North Exit",
    category: "Entry/Exit",
    iconName: "exit",
    color: "#E546A4",
    position: { x: 500, y: 120 },
    floor: "Ground",
    hours: "08:00 AM - 11:00 PM",
    description: "Exit towards North parking.",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1519567241046-7f570eee3c9e?auto=format&fit=crop&w=800&q=80"
  },

  // Ground Floor
  {
    id: '1',
    name: "Apple Store",
    category: "Electronics",
    iconName: "apple",
    color: "#1A1A1A",
    position: { x: 300, y: 200 },
    floor: "Ground",
    hours: "10:00 AM - 10:00 PM",
    description: "The latest iPhone, iPad, Mac, and more.",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1556656793-02715d8dd660?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: '5',
    name: "Mi Store",
    category: "Electronics",
    iconName: "smartphone",
    color: "#F97316",
    position: { x: 150, y: 150 },
    floor: "Ground",
    hours: "10:00 AM - 09:00 PM",
    description: "Innovative technology for everyone.",
    rating: 4.2,
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: '6',
    name: "Starbucks",
    category: "Cafe",
    iconName: "coffee",
    color: "#15803d",
    position: { x: 600, y: 600 },
    floor: "Ground",
    hours: "08:00 AM - 11:00 PM",
    description: "Premium coffee and snacks.",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80",
    menu: [
        { id: 's1', name: 'Caffe Latte', description: 'Rich espresso with steamed milk.', price: 250, category: 'Coffee', image: 'https://images.unsplash.com/photo-1561882468-489833f19b84?auto=format&fit=crop&w=300&q=80', rating: 4.8, customizable: true },
        { id: 's2', name: 'Cappuccino', description: 'Espresso under a smoothed layer of foam.', price: 270, category: 'Coffee', image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=300&q=80', rating: 4.7, customizable: true },
        { id: 's3', name: 'Croissant', description: 'Buttery, flaky pastry.', price: 180, category: 'Bakery', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=300&q=80', rating: 4.5 },
        { id: 's4', name: 'Iced Americano', description: 'Espresso shots topped with water and ice.', price: 220, category: 'Cold Coffee', image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=300&q=80', rating: 4.4 }
    ]
  },
  {
    id: '7',
    name: "Zara",
    category: "Fashion",
    iconName: "bag",
    color: "#CA8A04",
    position: { x: 450, y: 300 },
    floor: "Ground",
    hours: "10:00 AM - 10:00 PM",
    description: "Latest trends in clothing for men and women.",
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=800&q=80"
  },

  // 1st Floor
  {
    id: '8',
    name: "H&M",
    category: "Fashion",
    iconName: "shirt",
    color: "#DC2626",
    position: { x: 300, y: 200 }, // Same coords as Apple, but different floor
    floor: "1st Floor",
    hours: "10:00 AM - 10:00 PM",
    description: "Fashion and quality at the best price.",
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80",
    offer: "End of Season Sale: Flat 50% Off"
  },
  {
    id: '9',
    name: "LensKart",
    category: "Accessories",
    iconName: "glasses",
    color: "#0D9488",
    position: { x: 500, y: 400 },
    floor: "1st Floor",
    hours: "11:00 AM - 09:00 PM",
    description: "Eyewear, sunglasses, and contact lenses.",
    rating: 4.1,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80"
  },
  
  // 2nd Floor
  {
    id: '2',
    name: "Nike",
    category: "Fashion",
    iconName: "shirt",
    color: "#000000",
    position: { x: 450, y: 400 },
    floor: "2nd Floor",
    hours: "10:00 AM - 09:00 PM",
    description: "Just Do It. Athletic footwear and apparel.",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80",
    offer: "20% Off on New Arrivals"
  },
  {
    id: '10',
    name: "Titan World",
    category: "Accessories",
    iconName: "watch",
    color: "#B45309",
    position: { x: 200, y: 300 },
    floor: "2nd Floor",
    hours: "10:00 AM - 09:00 PM",
    description: "Timeless watches for every occasion.",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: '13',
    name: "PVR Cinemas",
    category: "Entertainment",
    iconName: "film",
    color: "#EAB308",
    position: { x: 700, y: 200 },
    floor: "2nd Floor",
    hours: "09:00 AM - 02:00 AM",
    description: "Experience movies like never before in IMAX and 4DX.",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80",
    offer: "Buy 2 Tickets Get Popcorn Free"
  },
  {
    id: '15',
    name: "Timezone",
    category: "Entertainment",
    iconName: "game",
    color: "#DC2626",
    position: { x: 600, y: 400 },
    floor: "2nd Floor",
    hours: "11:00 AM - 10:00 PM",
    description: "Next gen arcade games, bowling and VR.",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=800&q=80",
    offer: "Double Value on Card Recharge"
  },

  // Food Court
  {
    id: '3',
    name: "Pizza Hut",
    category: "Food",
    iconName: "pizza",
    color: "#EF4444",
    position: { x: 600, y: 300 },
    floor: "Food Court",
    hours: "11:00 AM - 11:00 PM",
    description: "Flavor of Now. Pizza, wings, pasta.",
    rating: 4.2,
    image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80",
    offer: "Buy 1 Get 1 Free on Medium Pizzas",
    menu: [
        { id: 'p1', name: 'Pepperoni Feast', description: 'Loaded with pepperoni and cheese.', price: 450, category: 'Pizza', image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=300&q=80', rating: 4.6, customizable: true },
        { id: 'p2', name: 'Veggie Supreme', description: 'Onions, olives, peppers, and mushrooms.', price: 390, category: 'Pizza', image: 'https://images.unsplash.com/photo-1571066811602-71d8399def8e?auto=format&fit=crop&w=300&q=80', rating: 4.3, customizable: true },
        { id: 'p3', name: 'Garlic Bread', description: 'Toasted french bread with garlic butter.', price: 120, category: 'Sides', image: 'https://images.unsplash.com/photo-1573140247632-f84660f67627?auto=format&fit=crop&w=300&q=80', rating: 4.7 }
    ]
  },
  {
    id: '4',
    name: "Chili's",
    category: "Restaurant",
    iconName: "utensils",
    color: "#C2410C",
    position: { x: 200, y: 500 },
    floor: "Food Court",
    hours: "12:00 PM - 11:00 PM",
    description: "Tex-Mex style cuisine and margaritas.",
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
    menu: [
        { id: 'c1', name: 'Classic Burger', description: 'Grilled beef patty with lettuce and tomato.', price: 350, category: 'Burgers', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80', rating: 4.5, customizable: true },
        { id: 'c2', name: 'Spicy Tacos', description: 'Three soft shell tacos with spicy chicken.', price: 290, category: 'Mexican', image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=300&q=80', rating: 4.6 }
    ]
  },
  {
    id: '11',
    name: "Burger King",
    category: "Food",
    iconName: "utensils",
    color: "#F59E0B",
    position: { x: 400, y: 200 },
    floor: "Food Court",
    hours: "11:00 AM - 11:00 PM",
    description: "Home of the Whopper.",
    rating: 4.1,
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=800&q=80",
    menu: [
        { id: 'b1', name: 'Whopper', description: 'Flame-grilled beef patty.', price: 220, category: 'Burgers', image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=300&q=80', rating: 4.5, customizable: true },
        { id: 'b2', name: 'Chicken Royale', description: 'Crispy chicken breast with mayo.', price: 190, category: 'Burgers', image: 'https://images.unsplash.com/photo-1615297928064-24977384d0f9?auto=format&fit=crop&w=300&q=80', rating: 4.3, customizable: true },
        { id: 'b3', name: 'Fries (M)', description: 'Classic salted french fries.', price: 90, category: 'Sides', image: 'https://images.unsplash.com/photo-1573080496987-fad77537160c?auto=format&fit=crop&w=300&q=80', rating: 4.2 }
    ]
  },
  {
    id: '12',
    name: "Gaming Zone",
    category: "Entertainment",
    iconName: "game",
    color: "#7C3AED",
    position: { x: 800, y: 400 },
    floor: "Food Court",
    hours: "11:00 AM - 10:00 PM",
    description: "Arcade games and bowling.",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1511882150382-421056c89033?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: '14',
    name: "Si Nonna's",
    category: "Restaurant",
    iconName: "pizza",
    color: "#D97706",
    position: { x: 300, y: 400 },
    floor: "Food Court",
    hours: "11:00 AM - 11:00 PM",
    description: "Authentic Italian Sourdough Pizzas.",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1595854341625-f33ee10dbf94?auto=format&fit=crop&w=800&q=80",
    menu: [
       { id: 'sn1', name: 'Margherita', description: 'Classic tomato and mozzarella.', price: 495, category: 'Pizza', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=300&q=80', rating: 4.8, customizable: true },
       { id: 'sn2', name: 'Pepperoni Sourdough', description: 'Spicy pepperoni on sourdough base.', price: 625, category: 'Pizza', image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=300&q=80', rating: 4.7, customizable: true }
    ]
  }
];

export const INITIAL_USER_LOCATION = { x: 400, y: 650 };

export const PAST_ORDERS: Order[] = [
  { id: 'ord-1001', storeName: "McDonald's", items: ['McSpicy Paneer Meal'], total: 340, date: 'Just now', status: 'Just ordered' },
  { id: 'ord-1002', storeName: "Domino's", items: ['Farmhouse Pizza'], total: 450, date: '10 mins ago', status: 'Preparing' },
  { id: 'ord-9923', storeName: "Si Nonna's", items: ['Pepperoni Sourdough'], total: 625, date: 'Today, 11:30 AM', status: 'Ready to takeaway', pickupCode: '123456' },
  { id: 'ord-8812', storeName: 'Pizza Hut', items: ['Pepperoni Feast', 'Garlic Bread'], total: 672, date: 'Yesterday, 8:30 PM', status: 'Completed', rating: 5 },
  { id: 'ord-7721', storeName: 'Starbucks', items: ['Caffe Latte', 'Croissant'], total: 430, date: 'Oct 12, 10:00 AM', status: 'Completed', rating: 4 },
  { id: 'ord-6632', storeName: 'Burger King', items: ['Whopper'], total: 220, date: 'Oct 05, 1:15 PM', status: 'Cancelled' },
];

export const AVAILABLE_COUPONS: Coupon[] = [
  { code: 'WELCOME50', description: 'Get 50% off on your first order up to ₹150.', discount: 0.5, maxDiscount: 150, color: '#10B981' },
  { code: 'TRYNEW', description: 'Flat 20% off on selected restaurants.', discount: 0.2, color: '#3B82F6' },
  { code: 'PIZZAPARTY', description: 'Free Garlic Bread on orders above ₹500.', discount: 0, minOrderValue: 500, color: '#EF4444' }, // logic for free item can be added later
  { code: 'FREESHIP', description: 'Free delivery on all orders today.', discount: 0, color: '#F59E0B' },
];

// GeoJSON Data for Mall Layout and Units
export const MALL_GEOJSON: GeoJSON = {
  type: "FeatureCollection",
  features: [
    // Outer Boundary of the Mall
    {
      type: "Feature",
      properties: { type: "boundary" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [100, 100], [900, 100], [900, 500], 
            [700, 500], [700, 800], [300, 800], 
            [300, 600], [100, 600], [100, 100]
          ]
        ]
      }
    },
    // Generic Unit footprints - We will map these to stores based on coordinates dynamically in Map.tsx
    // Unit A (Top Left)
    {
      type: "Feature",
      properties: { type: "unit", name: "Unit A" },
      geometry: { type: "Polygon", coordinates: [[[110, 110], [190, 110], [190, 190], [110, 190], [110, 110]]] }
    },
    // Unit B (Top Mid-Left)
    {
      type: "Feature",
      properties: { type: "unit", name: "Unit B" },
      geometry: { type: "Polygon", coordinates: [[[260, 160], [340, 160], [340, 240], [260, 240], [260, 160]]] }
    },
    // Unit C (Top Mid)
    {
      type: "Feature",
      properties: { type: "unit", name: "Unit C" },
      geometry: { type: "Polygon", coordinates: [[[400, 180], [480, 180], [480, 260], [400, 260], [400, 180]]] }
    },
    // Unit D (Top Right)
    {
      type: "Feature",
      properties: { type: "unit", name: "Unit D" },
      geometry: { type: "Polygon", coordinates: [[[560, 260], [640, 260], [640, 340], [560, 340], [560, 260]]] }
    },
    // Unit E (Center)
    {
      type: "Feature",
      properties: { type: "unit", name: "Unit E" },
      geometry: { type: "Polygon", coordinates: [[[410, 360], [490, 360], [490, 440], [410, 440], [410, 360]]] }
    },
    // Unit F (Bottom Left)
    {
      type: "Feature",
      properties: { type: "unit", name: "Unit F" },
      geometry: { type: "Polygon", coordinates: [[[160, 460], [240, 460], [240, 540], [160, 540], [160, 460]]] }
    },
    // Unit G (Center Right)
    {
      type: "Feature",
      properties: { type: "unit", name: "Unit G" },
      geometry: { type: "Polygon", coordinates: [[[600, 500], [680, 500], [680, 580], [600, 580], [600, 500]]] }
    }
  ]
};

export const REWARDS_DATA: Reward[] = [
  {
    id: 'r1',
    title: 'Free Cappuccino',
    cost: 500,
    description: 'Redeem for a regular Cappuccino at Starbucks.',
    brand: 'Starbucks',
    iconName: 'coffee',
    color: '#15803d'
  },
  {
    id: 'r2',
    title: '20% Off Footwear',
    cost: 1000,
    description: 'Get 20% discount on any non-sale item.',
    brand: 'Nike',
    iconName: 'shirt',
    color: '#000000'
  },
  {
    id: 'r3',
    title: 'Free Game Token',
    cost: 200,
    description: 'One free VR experience play.',
    brand: 'Gaming Zone',
    iconName: 'game',
    color: '#7C3AED'
  },
  {
    id: 'r4',
    title: 'Mystery Gift Box',
    cost: 2500,
    description: 'Contains assorted vouchers worth $50.',
    brand: 'Amanora',
    iconName: 'gift',
    color: '#CA8A04'
  }
];

export const INITIAL_LOYALTY_CARDS: LoyaltyCard[] = [
  {
    id: 'c1',
    storeId: '6', // Starbucks
    storeName: 'Starbucks',
    points: 1250,
    color: '#15803d', // Green
    iconName: 'coffee',
    memberSince: '2023',
    tier: 'Gold',
    customImage: 'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?auto=format&fit=crop&w=300&q=80', // Starbucks-like vibe
    transactions: [
        { id: 't1', date: 'Oct 12, 2025', amount: 150, type: 'earn', description: 'Coffee Order' },
        { id: 't2', date: 'Oct 10, 2025', amount: 50, type: 'earn', description: 'Bagel Purchase' },
        { id: 't3', date: 'Oct 05, 2025', amount: -500, type: 'redeem', description: 'Free Drink Reward' }
    ]
  },
  {
    id: 'c2',
    storeId: '2', // Nike
    storeName: 'Nike',
    points: 850,
    color: '#000000', // Black
    iconName: 'shirt',
    memberSince: '2024',
    tier: 'Member',
    customImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80', // Shoe
    transactions: [
        { id: 't4', date: 'Sep 28, 2025', amount: 850, type: 'earn', description: 'Air Max Purchase' }
    ]
  },
  {
    id: 'c3',
    storeId: '3', // Pizza Hut
    storeName: 'Pizza Hut',
    points: 400,
    color: '#EF4444', // Red
    iconName: 'pizza',
    memberSince: '2024',
    tier: 'Member',
    customImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=300&q=80', // Pizza
    transactions: [
        { id: 't5', date: 'Oct 14, 2025', amount: 200, type: 'earn', description: 'Family Meal Deal' },
        { id: 't6', date: 'Oct 01, 2025', amount: 200, type: 'earn', description: 'Pepperoni Pizza' }
    ]
  },
  {
    id: 'c4',
    storeId: '1', // Apple
    storeName: 'Apple Store',
    points: 2100,
    color: '#1A1A1A', // Dark Gray
    iconName: 'apple',
    memberSince: '2022',
    tier: 'Platinum',
    customImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=300&q=80', // Tech
    transactions: [
        { id: 't7', date: 'Aug 15, 2025', amount: 2100, type: 'earn', description: 'iPad Air Purchase' }
    ]
  },
  {
    id: 'c5',
    storeId: '12', // Gaming Zone
    storeName: 'Gaming Zone',
    points: 320,
    color: '#7C3AED', // Purple
    iconName: 'game',
    memberSince: '2025',
    tier: 'Member',
    customImage: 'https://images.unsplash.com/photo-1511882150382-421056c89033?auto=format&fit=crop&w=300&q=80', // Arcade
    transactions: [
        { id: 't8', date: 'Oct 15, 2025', amount: 100, type: 'earn', description: 'Bowling Hour' },
        { id: 't9', date: 'Oct 15, 2025', amount: 220, type: 'earn', description: 'Arcade Tokens' }
    ]
  }
];

export const MALL_EVENTS: Event[] = [
  {
    id: '1',
    title: "Summer Sale 2025",
    date: "Oct 15 - Oct 20",
    time: "10:00 AM - 10:00 PM",
    location: "Main Atrium",
    description: "Get up to 50% off on top brands including Nike, Zara, and H&M. Exclusive early access for members.",
    image: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&w=800&q=80",
    images: [
        "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1472851294608-4155f2118c03?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80"
    ],
    interestedCount: 1240
  },
  {
    id: '2',
    title: "Live Music: The Band",
    date: "Oct 18",
    time: "07:00 PM - 09:00 PM",
    location: "Food Court",
    description: "Enjoy a delightful evening with live jazz and acoustic performances while you dine.",
    image: "https://images.unsplash.com/photo-1459749411177-287ce35e8b4f?auto=format&fit=crop&w=800&q=80",
    images: [
        "https://images.unsplash.com/photo-1459749411177-287ce35e8b4f?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1501612780327-45045538702b?auto=format&fit=crop&w=800&q=80"
    ],
    interestedCount: 450
  },
  {
    id: '3',
    title: "Tech Expo",
    date: "Oct 22",
    time: "11:00 AM - 06:00 PM",
    location: "East Wing",
    description: "Experience the latest gadgets from Apple, Samsung, and Sony. VR demos available.",
    image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=800&q=80",
    interestedCount: 890
  }
];

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: '101',
    author: 'Sarah J.',
    content: 'Just bought the new sneakers from Nike! The staff was super helpful in finding my size. 👟🔥',
    timestamp: '2 hours ago',
    likes: 24,
    liked: false,
    comments: [
      { id: 'c1', author: 'Mike T.', content: 'Those look great!', timestamp: '1 hour ago' }
    ],
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: '102',
    author: 'Mike T.',
    content: 'The pizza at Pizza Hut was absolutely loaded today. Highly recommend the new spicy pepperoni. 🍕',
    timestamp: '5 hours ago',
    likes: 12,
    liked: true,
    comments: [],
    image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80"
  }
];

export const INITIAL_FRIENDS: Friend[] = [
  {
    id: 'f1',
    name: 'Rahul',
    avatar: 'R',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    color: '#066CE4', // Blue
    position: { x: 250, y: 250 },
    floor: 'Ground',
    isSharing: true,
    lastUpdate: 'Live'
  },
  {
    id: 'f2',
    name: 'Priya',
    avatar: 'P',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    color: '#E546A4', // Pink
    position: { x: 650, y: 350 },
    floor: '1st Floor',
    isSharing: true,
    lastUpdate: 'Live'
  },
  {
    id: 'f3',
    name: 'Amit',
    avatar: 'A',
    image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&q=80',
    color: '#10B981', // Emerald
    position: { x: 400, y: 600 },
    floor: 'Ground',
    isSharing: false,
    lastUpdate: '10m ago'
  }
];

export const INITIAL_LOST_ITEMS: LostItem[] = [
  {
    id: 'l1',
    type: 'lost',
    title: 'House Keys',
    description: 'Set of 3 keys with a red keychain. Lost near the food court.',
    category: 'Personal',
    location: 'Food Court',
    date: 'Today, 2:00 PM',
    image: 'https://images.unsplash.com/photo-1618397251488-3c846a4e649b?auto=format&fit=crop&w=400&q=80',
    contactName: 'John Doe',
    status: 'open'
  },
  {
    id: 'l2',
    type: 'found',
    title: 'Teddy Bear',
    description: 'Brown teddy bear found on a bench in the main atrium.',
    category: 'Toys',
    location: 'Main Atrium',
    date: 'Yesterday',
    image: 'https://images.unsplash.com/photo-1559454403-b8fb87521bc3?auto=format&fit=crop&w=400&q=80',
    contactName: 'Mall Security',
    status: 'open'
  }
];

export const AMENITIES_DATA: Amenity[] = [
  { id: '1', name: 'Restrooms', iconName: 'restroom', floor: 'All Floors', description: 'Clean and accessible restrooms available on every floor.', image: 'https://images.unsplash.com/photo-1595515106967-1b0728c0b5c0?auto=format&fit=crop&w=800&q=80' },
  { id: '2', name: 'ATMs', iconName: 'atm', floor: 'Ground & 2nd', description: '24/7 ATMs from major banks located near the North Exit and Food Court.', image: 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?auto=format&fit=crop&w=800&q=80' },
  { id: '3', name: 'Drop & Shop', iconName: 'bag', floor: 'Ground Floor', description: 'Secure luggage and bag storage while you shop.', image: 'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?auto=format&fit=crop&w=800&q=80' },
  { id: '4', name: 'Escalators', iconName: 'stairs', floor: 'All Floors', description: 'Convenient escalators connecting all levels.', image: 'https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?auto=format&fit=crop&w=800&q=80' },
  { id: '5', name: 'Elevators', iconName: 'elevator', floor: 'All Floors', description: 'High-speed elevators with priority access for seniors and strollers.', image: 'https://images.unsplash.com/photo-1542736667-06924666327d?auto=format&fit=crop&w=800&q=80' },
  { id: '6', name: 'Help Desks', iconName: 'kiosk', floor: 'Ground Floor', description: 'Information desk for mall directory, lost & found, and general queries.', image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80' },
  { id: '7', name: 'First Aid', iconName: 'aid', floor: 'Ground Floor', description: 'Emergency medical assistance room.', image: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=800&q=80' },
  { id: '8', name: 'Free Wifi', iconName: 'wifi', floor: 'Mall Wide', description: 'High-speed free Wi-Fi available throughout the mall.', image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7f8?auto=format&fit=crop&w=800&q=80' },
  { id: '9', name: 'Parking', iconName: 'parking', floor: 'B1 & B2', description: 'Ample parking space for 2-wheelers and 4-wheelers.', image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80' },
  { id: '10', name: 'Smoking Area', iconName: 'smoking', floor: '2nd Floor Terrace', description: 'Designated smoking zone with ventilation.', image: 'https://images.unsplash.com/photo-1524312672322-a7229b476f4b?auto=format&fit=crop&w=800&q=80' },
  { id: '11', name: 'Emergency Exit', iconName: 'alert', floor: 'All Floors', description: 'Marked emergency exits for safety.', image: 'https://images.unsplash.com/photo-1626125345510-4603468ee69e?auto=format&fit=crop&w=800&q=80' },
  { id: '12', name: 'Taxi', iconName: 'taxi', floor: 'Ground - North Exit', description: 'Taxi stand and ride-share pickup point.', image: 'https://images.unsplash.com/photo-1485740112326-641682e37922?auto=format&fit=crop&w=800&q=80' },
  { id: '13', name: 'Drinking Water', iconName: 'water', floor: 'All Floors', description: 'Filtered drinking water stations.', image: 'https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&w=800&q=80' },
  { id: '14', name: 'Cafeteria', iconName: 'cafe', floor: 'Food Court', description: 'Wide variety of cuisines at the Food Court.', image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80' },
  { id: '15', name: 'Digital KIOSK', iconName: 'kiosk', floor: 'All Floors', description: 'Interactive digital directories to find stores.', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80' }
];
