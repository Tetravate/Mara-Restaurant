export type DietaryTag = 
  | 'VEG' 
  | 'NON-VEG' 
  | 'VEGAN' 
  | 'GLUTEN-FREE' 
  | 'CONTAINS-NUTS' 
  | 'DAIRY-FREE';

export type MoodTag = 
  | 'Vegetarian' 
  | 'Spicy' 
  | 'Light' 
  | 'Comfort' 
  | 'Sweet' 
  | 'Under ₹400';

export type SpiceLevel = 0 | 1 | 2 | 3;

export type MenuCategoryId = 
  | 'starters' 
  | 'soups' 
  | 'mains' 
  | 'breads' 
  | 'rice' 
  | 'desserts' 
  | 'drinks';

export interface MenuItem {
  id: string;
  name: string;
  subtitle?: string;
  description: string;
  price: number;
  category: MenuCategoryId;
  dietary: DietaryTag[];
  spiceLevel: SpiceLevel;
  moods: MoodTag[];
  image?: string;
  isSignature?: boolean;
  pairingNote?: string;
}

export interface ReservationFormData {
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  specialRequest?: string;
  seatingPreference?: 'indoor' | 'courtyard' | 'private';
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'atmosphere' | 'food' | 'kitchen' | 'details';
  imageUrl: string;
  altText: string;
  aspectRatio: 'square' | 'portrait' | 'landscape';
}

export interface RestaurantInfo {
  name: string;
  tagline: string;
  shortDescription: string;
  address: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    pincode: string;
    mapQueryUrl: string;
  };
  phone: string;
  displayPhone: string;
  whatsappNumber: string;
  displayWhatsapp: string;
  email: string;
  hours: {
    lunch: string;
    dinner: string;
    displayToday: string;
  };
  cuisine: string;
  priceRange: string;
  socials: {
    instagram: string;
  };
}
