export type GalleryCategory = 'all' | 'spaces' | 'chambers' | 'alfresco' | 'kitchen';

export interface GalleryItem {
  id: string;
  title: string;
  category: 'spaces' | 'chambers' | 'alfresco' | 'kitchen';
  imageUrl: string;
  altText: string;
  aspectRatio: 'landscape' | 'portrait' | 'square';
  spanClass?: string;
  subtitle?: string;
}

export const galleryCategories: { id: GalleryCategory; label: string }[] = [
  { id: 'all', label: 'All Restaurant Spaces' },
  { id: 'spaces', label: 'Dining Halls & Lounges' },
  { id: 'chambers', label: 'Private Chambers' },
  { id: 'alfresco', label: 'Courtyard & Canopies' },
  { id: 'kitchen', label: 'Live Hearth Kitchen' },
];

export const atmosphereGallery: GalleryItem[] = [
  {
    id: 'atm-1',
    title: 'The Floral Grand Dining Hall',
    subtitle: 'Wisteria Canopy & Warm Filament Glow',
    category: 'spaces',
    imageUrl: '/images/atmosphere/floral-dining-hall.jpg',
    altText: 'Atmospheric dining hall with hanging pink wisteria floral vines, glowing Edison bulbs, and dark wood tables',
    aspectRatio: 'landscape',
  },
  {
    id: 'atm-2',
    title: 'The Bamboo Basket Canopy Chamber',
    subtitle: 'Artisanal Woven Cane & Amber Lighting',
    category: 'chambers',
    imageUrl: '/images/atmosphere/bamboo-canopy-chamber.jpg',
    altText: 'Illuminated archway and ceiling installation of handcrafted woven cane basket lanterns with warm glowing lights',
    aspectRatio: 'landscape',
  },
  {
    id: 'atm-3',
    title: 'The Umbrella Canopy Courtyard',
    subtitle: 'Vibrant Alfresco Evening Terrace',
    category: 'alfresco',
    imageUrl: '/images/atmosphere/umbrella-courtyard.jpg',
    altText: 'Magical outdoor courtyard terrace under glowing hanging colorful umbrellas and cascading curtain fairy lights',
    aspectRatio: 'landscape',
  },
  {
    id: 'atm-4',
    title: 'The Private Dining Chamber',
    subtitle: 'Intimate Teak Banquet & Floral Accents',
    category: 'chambers',
    imageUrl: '/images/atmosphere/private-dining-chamber.jpg',
    altText: 'Exclusive private dining chamber with dark acoustic wood panelling, long banquet table, and warm wisteria basket lighting',
    aspectRatio: 'landscape',
  },
  {
    id: 'atm-5',
    title: 'The Ember Kitchen & Open Hearth',
    subtitle: 'Live Fire, Copper & Tandoor Station',
    category: 'kitchen',
    imageUrl: '/images/atmosphere/ember-kitchen-hearth.jpg',
    altText: 'Open chef kitchen counter with live charcoal tandoor hearth, copper pans, and culinary brigade plating dishes',
    aspectRatio: 'landscape',
  },
  {
    id: 'atm-6',
    title: 'The Botanical Cocktail Lounge & Bar',
    subtitle: 'Lush Foliage & Amber Backlit Spirits',
    category: 'spaces',
    imageUrl: '/images/atmosphere/botanical-lounge-bar.jpg',
    altText: 'Artisanal cocktail bar with cascading floral wisteria vines, warm Edison lighting, and glowing spirit shelves',
    aspectRatio: 'landscape',
  },
  {
    id: 'atm-7',
    title: 'The Intimate Booth Alcove',
    subtitle: 'Terracotta Leather & Ambient Backlight',
    category: 'spaces',
    imageUrl: '/images/atmosphere/booth-dining-alcove.jpg',
    altText: 'Cozy curved leather dining booths with dark timber acoustic partitions and warm cane basket pendant fixtures',
    aspectRatio: 'landscape',
  },
  {
    id: 'atm-8',
    title: 'The Veranda Entrance Canopy',
    subtitle: 'Illuminated Parasols & Pathway Torches',
    category: 'alfresco',
    imageUrl: '/images/atmosphere/veranda-entrance-canopy.jpg',
    altText: 'Grand illuminated umbrella canopy and fairy light walkway guiding guests into MĀRA restaurant',
    aspectRatio: 'landscape',
  },
];

export const galleryItems: GalleryItem[] = atmosphereGallery;
