import { RestaurantInfo } from '../types';

export const restaurantInfo: RestaurantInfo = {
  name: 'MĀRA',
  tagline: 'Modern Indian Dining',
  shortDescription: 'Contemporary Indian dining shaped by seasonal ingredients, thoughtful technique and the warmth of the table.',
  address: {
    line1: '42 Race Course Road',
    line2: 'Near Thomas Park',
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    pincode: '641018',
    mapQueryUrl: 'https://maps.google.com/?q=Race+Course+Road+Coimbatore+Tamil+Nadu',
  },
  phone: '+914222224589',
  displayPhone: '+91 422 222 4589',
  whatsappNumber: '919488212040',
  displayWhatsapp: '+91 94882 12040',
  email: 'reservations@mara-dining.com',
  hours: {
    lunch: '12:00 PM – 3:30 PM',
    dinner: '7:00 PM – 11:00 PM',
    displayToday: '12:00 PM – 11:00 PM',
  },
  cuisine: 'Modern Indian',
  priceRange: '₹₹₹ (₹800–₹1,400 for two)',
  socials: {
    instagram: 'https://instagram.com/mara.coimbatore',
  },
};
