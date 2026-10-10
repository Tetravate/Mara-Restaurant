export type DiningZoneId = 'all' | 'hall' | 'bamboo' | 'courtyard' | 'private';

export interface RestaurantTable {
  id: string;
  name: string;
  code: string;
  zone: 'hall' | 'bamboo' | 'courtyard' | 'private';
  zoneName: string;
  capacity: number;
  minGuests: number;
  type: 'Window View' | 'Center Table' | 'Leather Booth' | 'Garden Terrace' | 'Bamboo Arch' | 'Private Suite';
  shape: 'round' | 'rect' | 'booth' | 'long';
  description: string;
  image: string;
  position: {
    gridCol: string;
    gridRow: string;
    areaName: string;
  };
}

export const diningZones: { id: DiningZoneId; name: string; subtitle: string; icon: string }[] = [
  { id: 'all', name: 'Full Restaurant Plan', subtitle: '14 Curated Dining Tables', icon: 'LayoutGrid' },
  { id: 'hall', name: 'Floral Grand Hall', subtitle: 'Wisteria Canopy & Window Seats', icon: 'Sparkles' },
  { id: 'bamboo', name: 'Bamboo Basket Chamber', subtitle: 'Woven Cane Arches & Warm Glow', icon: 'Flame' },
  { id: 'courtyard', name: 'Umbrella Courtyard', subtitle: 'Alfresco Dining Under Parasols', icon: 'Sun' },
  { id: 'private', name: 'Private Chamber', subtitle: 'Exclusive Teak Banquet Suites', icon: 'Crown' },
];

export const restaurantTables: RestaurantTable[] = [
  // 1. FLORAL GRAND DINING HALL (5 Tables)
  {
    id: 'T1',
    code: 'T-01',
    name: 'Wisteria Window Table 01',
    zone: 'hall',
    zoneName: 'Floral Grand Hall',
    capacity: 2,
    minGuests: 1,
    type: 'Window View',
    shape: 'round',
    description: 'Intimate table facing Race Course Road under hanging wisteria and filament glow.',
    image: '/images/atmosphere/table-window-duo.jpg',
    position: { gridCol: 'col-span-1', gridRow: 'row-span-1', areaName: 'North-West Window' },
  },
  {
    id: 'T2',
    code: 'T-02',
    name: 'Floral Center Table 02',
    zone: 'hall',
    zoneName: 'Floral Grand Hall',
    capacity: 4,
    minGuests: 2,
    type: 'Center Table',
    shape: 'rect',
    description: 'Spacious 4-seat teakwood table beneath cascading floral canopy and Edison lighting.',
    image: '/images/atmosphere/floral-dining-hall.jpg',
    position: { gridCol: 'col-span-1', gridRow: 'row-span-1', areaName: 'Hall Center' },
  },
  {
    id: 'T3',
    code: 'T-03',
    name: 'Wisteria Window Table 03',
    zone: 'hall',
    zoneName: 'Floral Grand Hall',
    capacity: 4,
    minGuests: 2,
    type: 'Window View',
    shape: 'rect',
    description: 'Prime window seating with natural dusk lighting and comfortable linen armchairs.',
    image: '/images/atmosphere/main-dining-room.jpg',
    position: { gridCol: 'col-span-1', gridRow: 'row-span-1', areaName: 'North Window' },
  },
  {
    id: 'T4',
    code: 'T-04',
    name: 'Terracotta Leather Booth 04',
    zone: 'hall',
    zoneName: 'Floral Grand Hall',
    capacity: 6,
    minGuests: 3,
    type: 'Leather Booth',
    shape: 'booth',
    description: 'Curved leather banquette alcove with ambient backlit wood panelling.',
    image: '/images/atmosphere/booth-dining-alcove.jpg',
    position: { gridCol: 'col-span-1', gridRow: 'row-span-1', areaName: 'East Alcove' },
  },
  {
    id: 'T5',
    code: 'T-05',
    name: 'Hearthside Family Table 05',
    zone: 'hall',
    zoneName: 'Floral Grand Hall',
    capacity: 6,
    minGuests: 4,
    type: 'Center Table',
    shape: 'rect',
    description: 'Generous dining table near the hearth with brass tableware and centerpiece floral.',
    image: '/images/atmosphere/ember-kitchen-hearth.jpg',
    position: { gridCol: 'col-span-1', gridRow: 'row-span-1', areaName: 'South Hall Hearth' },
  },

  // 2. BAMBOO BASKET CANOPY CHAMBER (3 Tables)
  {
    id: 'T6',
    code: 'T-06',
    name: 'Bamboo Arch Table 06',
    zone: 'bamboo',
    zoneName: 'Bamboo Chamber',
    capacity: 2,
    minGuests: 1,
    type: 'Bamboo Arch',
    shape: 'round',
    description: 'Intimate 2-top framed beneath the glowing archway of illuminated cane baskets.',
    image: '/images/atmosphere/table-bamboo-intimate.jpg',
    position: { gridCol: 'col-span-1', gridRow: 'row-span-1', areaName: 'Archway Left' },
  },
  {
    id: 'T7',
    code: 'T-07',
    name: 'Golden Basket Chamber Table 07',
    zone: 'bamboo',
    zoneName: 'Bamboo Chamber',
    capacity: 4,
    minGuests: 2,
    type: 'Center Table',
    shape: 'rect',
    description: 'Central amber-lit dining table immersed in handcrafted cane basket illumination.',
    image: '/images/atmosphere/bamboo-canopy-chamber.jpg',
    position: { gridCol: 'col-span-1', gridRow: 'row-span-1', areaName: 'Chamber Center' },
  },
  {
    id: 'T8',
    code: 'T-08',
    name: 'Amber Glow Lounge Table 08',
    zone: 'bamboo',
    zoneName: 'Bamboo Chamber',
    capacity: 4,
    minGuests: 2,
    type: 'Leather Booth',
    shape: 'booth',
    description: 'Cozy acoustic booth set against dark granite and warm illuminated basket lanterns.',
    image: '/images/atmosphere/botanical-lounge-bar.jpg',
    position: { gridCol: 'col-span-1', gridRow: 'row-span-1', areaName: 'Chamber Lounge' },
  },

  // 3. UMBRELLA COURTYARD VERANDA (4 Tables)
  {
    id: 'T9',
    code: 'T-09',
    name: 'Parasol Garden Table 09',
    zone: 'courtyard',
    zoneName: 'Umbrella Courtyard',
    capacity: 2,
    minGuests: 1,
    type: 'Garden Terrace',
    shape: 'round',
    description: 'Alfresco dining directly beneath glowing parasols and cascading fairy light curtain.',
    image: '/images/atmosphere/table-parasol-alfresco.jpg',
    position: { gridCol: 'col-span-1', gridRow: 'row-span-1', areaName: 'Courtyard Front' },
  },
  {
    id: 'T10',
    code: 'T-10',
    name: 'Courtyard Veranda Table 10',
    zone: 'courtyard',
    zoneName: 'Umbrella Courtyard',
    capacity: 4,
    minGuests: 2,
    type: 'Garden Terrace',
    shape: 'rect',
    description: 'Surrounded by lush potted tropical palms and gentle night breeze with candle lanterns.',
    image: '/images/atmosphere/umbrella-courtyard.jpg',
    position: { gridCol: 'col-span-1', gridRow: 'row-span-1', areaName: 'Courtyard Center' },
  },
  {
    id: 'T11',
    code: 'T-11',
    name: 'Festive Umbrella Table 11',
    zone: 'courtyard',
    zoneName: 'Umbrella Courtyard',
    capacity: 4,
    minGuests: 2,
    type: 'Garden Terrace',
    shape: 'rect',
    description: 'Prime outdoor terrace position with full view of the illuminated parasol walkway.',
    image: '/images/atmosphere/veranda-entrance-canopy.jpg',
    position: { gridCol: 'col-span-1', gridRow: 'row-span-1', areaName: 'Courtyard North' },
  },
  {
    id: 'T12',
    code: 'T-12',
    name: 'Garden Pergola Table 12',
    zone: 'courtyard',
    zoneName: 'Umbrella Courtyard',
    capacity: 6,
    minGuests: 3,
    type: 'Garden Terrace',
    shape: 'rect',
    description: 'Spacious outdoor gathering table surrounded by stone planters and evening lanterns.',
    image: '/images/atmosphere/courtyard-veranda.jpg',
    position: { gridCol: 'col-span-1', gridRow: 'row-span-1', areaName: 'Courtyard Corner' },
  },

  // 4. THE PRIVATE DINING CHAMBER (2 Exclusive Suites)
  {
    id: 'T13',
    code: 'T-13',
    name: 'Executive Teak Suite 13',
    zone: 'private',
    zoneName: 'Private Chamber',
    capacity: 10,
    minGuests: 6,
    type: 'Private Suite',
    shape: 'long',
    description: 'Exclusive acoustic wood-panelled dining suite with dedicated sommelier service.',
    image: '/images/atmosphere/private-dining-chamber.jpg',
    position: { gridCol: 'col-span-1', gridRow: 'row-span-1', areaName: 'Private Salon A' },
  },
  {
    id: 'T14',
    code: 'T-14',
    name: 'Royal Heritage Banquet Suite 14',
    zone: 'private',
    zoneName: 'Private Chamber',
    capacity: 16,
    minGuests: 8,
    type: 'Private Suite',
    shape: 'long',
    description: 'Grand private dining chamber with long teak banquet table and ambient cellar wall.',
    image: '/images/atmosphere/private-dining-salon.jpg',
    position: { gridCol: 'col-span-1', gridRow: 'row-span-1', areaName: 'Private Salon B' },
  },
];
