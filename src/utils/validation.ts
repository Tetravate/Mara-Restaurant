import { ReservationFormData } from '../types';

export interface FormErrors {
  name?: string;
  phone?: string;
  date?: string;
  time?: string;
  guests?: string;
}

export function getTodayDateString(): string {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function validateReservationForm(data: ReservationFormData): { isValid: boolean; errors: FormErrors } {
  const errors: FormErrors = {};

  if (!data.name || data.name.trim().length < 2) {
    errors.name = 'Please provide your full name.';
  }

  // Allow standard Indian 10-digit number or international with +/spaces
  const cleanPhone = data.phone.replace(/[\s\-()]/g, '');
  if (!cleanPhone) {
    errors.phone = 'Please provide a contact phone number.';
  } else if (!/^\+?[0-9]{8,15}$/.test(cleanPhone)) {
    errors.phone = 'Please provide a valid mobile number.';
  }

  const todayStr = getTodayDateString();
  if (!data.date) {
    errors.date = 'Please select a date for your visit.';
  } else if (data.date < todayStr) {
    errors.date = 'Reservation date cannot be in the past.';
  }

  if (!data.time) {
    errors.time = 'Please select a preferred seating time.';
  }

  if (!data.guests || data.guests < 1) {
    errors.guests = 'Please select at least 1 guest.';
  } else if (data.guests > 20) {
    errors.guests = 'For parties larger than 20, please enquire for private dining.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
