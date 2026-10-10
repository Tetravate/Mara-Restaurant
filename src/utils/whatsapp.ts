import { restaurantInfo } from '../data/restaurant';
import { ReservationFormData } from '../types';

/**
 * Creates a formatted WhatsApp deep link URL.
 * Supports both WhatsApp Web (desktop) and mobile app protocol.
 */
export function createWhatsAppUrl(message: string): string {
  const cleanNumber = restaurantInfo.whatsappNumber.replace(/[^0-9]/g, '');
  const encodedMessage = encodeURIComponent(message.trim());
  return `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
}

export function getGeneralWhatsAppLink(): string {
  return createWhatsAppUrl(`Hi ${restaurantInfo.name}, I would like to know more about the restaurant.`);
}

export function getDishEnquiryLink(dishName: string): string {
  return createWhatsAppUrl(`Hi ${restaurantInfo.name}, I would like to know more about the ${dishName}.`);
}

export function getPrivateDiningWhatsAppLink(guestCount?: number, date?: string): string {
  let msg = `Hi ${restaurantInfo.name}, I would like to enquire about booking the Private Dining room.`;
  if (guestCount) msg += `\nEstimated Guests: ${guestCount}`;
  if (date) msg += `\nPreferred Date: ${date}`;
  return createWhatsAppUrl(msg);
}

export function getReservationWhatsAppLink(data: ReservationFormData): string {
  const parts = [
    `Hi ${restaurantInfo.name}, I would like to request a table.`,
    ``,
    `Name: ${data.name.trim()}`,
    `Date: ${data.date}`,
    `Time: ${data.time}`,
    `Guests: ${data.guests} ${data.guests === 1 ? 'Guest' : 'Guests'}`,
  ];

  if (data.seatingPreference) {
    const preferenceLabel = data.seatingPreference.charAt(0).toUpperCase() + data.seatingPreference.slice(1);
    parts.push(`Seating: ${preferenceLabel}`);
  }

  if (data.specialRequest && data.specialRequest.trim()) {
    parts.push(`Special Request: ${data.specialRequest.trim()}`);
  }

  return createWhatsAppUrl(parts.join('\n'));
}
