import React, { useState } from 'react';
import { X, Calendar, Clock, Users, MessageCircle, Phone, CheckCircle2, AlertCircle } from 'lucide-react';
import { ReservationFormData } from '../types';
import { validateReservationForm, getTodayDateString, FormErrors } from '../utils/validation';
import { getReservationWhatsAppLink } from '../utils/whatsapp';
import { restaurantInfo } from '../data/restaurantInfo';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TIME_SLOTS = [
  // Lunch slots
  '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
  // Dinner slots
  '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM', '10:00 PM',
];

export const ReservationModal: React.FC<ReservationModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<ReservationFormData>({
    name: '',
    phone: '',
    date: getTodayDateString(),
    time: '7:30 PM',
    guests: 2,
    seatingPreference: 'indoor',
    specialRequest: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submittedData, setSubmittedData] = useState<ReservationFormData | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateReservationForm(formData);
    if (!result.isValid) {
      setErrors(result.errors);
      return;
    }

    setErrors({});
    setSubmittedData({ ...formData });
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setSubmittedData(null);
    setFormData({
      name: '',
      phone: '',
      date: getTodayDateString(),
      time: '7:30 PM',
      guests: 2,
      seatingPreference: 'indoor',
      specialRequest: '',
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/70 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-reservation-title"
    >
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-sand-200 overflow-hidden my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-sand-200 bg-sand-50">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-terracotta-600 block mb-0.5">
              MĀRA · Coimbatore
            </span>
            <h2 id="modal-reservation-title" className="font-serif text-2xl font-bold text-charcoal-900">
              {isSubmitted ? 'Reservation Request Received' : 'Request a Table'}
            </h2>
          </div>
          <button
            onClick={handleReset}
            className="p-2 text-charcoal-500 hover:text-charcoal-900 rounded-full hover:bg-sand-200 focus:outline-none focus:ring-2 focus:ring-terracotta-500"
            aria-label="Close reservation modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <p className="text-xs text-charcoal-600 mb-2 leading-relaxed">
                Please share your details. As seating is intimate, our reservation team will review availability and confirm your table promptly.
              </p>

              {/* Name Field */}
              <div>
                <label htmlFor="res-name" className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1">
                  Full Name <span className="text-terracotta-600">*</span>
                </label>
                <input
                  id="res-name"
                  type="text"
                  placeholder="e.g. Arun Sundaram"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: undefined });
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-charcoal-900 focus:outline-none focus:ring-2 ${
                    errors.name ? 'border-red-500 focus:ring-red-300' : 'border-sand-300 focus:ring-terracotta-500'
                  }`}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'res-name-error' : undefined}
                />
                {errors.name && (
                  <p id="res-name-error" className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.name}</span>
                  </p>
                )}
              </div>

              {/* Phone Field */}
              <div>
                <label htmlFor="res-phone" className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1">
                  Mobile Number <span className="text-terracotta-600">*</span>
                </label>
                <input
                  id="res-phone"
                  type="tel"
                  placeholder="e.g. 98765 43210"
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData({ ...formData, phone: e.target.value });
                    if (errors.phone) setErrors({ ...errors, phone: undefined });
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-charcoal-900 focus:outline-none focus:ring-2 ${
                    errors.phone ? 'border-red-500 focus:ring-red-300' : 'border-sand-300 focus:ring-terracotta-500'
                  }`}
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? 'res-phone-error' : undefined}
                />
                {errors.phone && (
                  <p id="res-phone-error" className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.phone}</span>
                  </p>
                )}
              </div>

              {/* Date & Guests Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Date */}
                <div>
                  <label htmlFor="res-date" className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1">
                    Date <span className="text-terracotta-600">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400 pointer-events-none" />
                    <input
                      id="res-date"
                      type="date"
                      min={getTodayDateString()}
                      value={formData.date}
                      onChange={(e) => {
                        setFormData({ ...formData, date: e.target.value });
                        if (errors.date) setErrors({ ...errors, date: undefined });
                      }}
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-sand-300 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                    />
                  </div>
                  {errors.date && (
                    <p className="text-xs text-red-600 mt-1">{errors.date}</p>
                  )}
                </div>

                {/* Guests */}
                <div>
                  <label htmlFor="res-guests" className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1">
                    Guests <span className="text-terracotta-600">*</span>
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400 pointer-events-none" />
                    <select
                      id="res-guests"
                      value={formData.guests}
                      onChange={(e) => setFormData({ ...formData, guests: Number(e.target.value) })}
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-sand-300 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500 bg-white"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 16].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? 'Guest' : 'Guests'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Seating Time */}
              <div>
                <label htmlFor="res-time" className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1">
                  Preferred Time <span className="text-terracotta-600">*</span>
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400 pointer-events-none" />
                  <select
                    id="res-time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-sand-300 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500 bg-white"
                  >
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot} {slot.startsWith('12') || slot.startsWith('1:') || slot.startsWith('2:') ? '(Lunch)' : '(Dinner)'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Seating Preference */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1.5">
                  Seating Area Preference
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'indoor', label: 'Main Dining' },
                    { id: 'courtyard', label: 'Courtyard' },
                    { id: 'private', label: 'Private Room' },
                  ].map((area) => (
                    <button
                      key={area.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, seatingPreference: area.id as any })}
                      className={`py-2 px-2 text-xs rounded-md border font-medium transition-colors text-center ${
                        formData.seatingPreference === area.id
                          ? 'bg-charcoal-900 text-sand-50 border-charcoal-900'
                          : 'bg-sand-50 text-charcoal-700 border-sand-300 hover:bg-sand-100'
                      }`}
                    >
                      {area.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Special Request */}
              <div>
                <label htmlFor="res-requests" className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1">
                  Special Occasion or Dietary Note (Optional)
                </label>
                <textarea
                  id="res-requests"
                  rows={2}
                  placeholder="e.g. Birthday celebration, anniversary, high chair required, nut allergy..."
                  value={formData.specialRequest}
                  onChange={(e) => setFormData({ ...formData, specialRequest: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-sand-300 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 bg-terracotta-500 hover:bg-terracotta-600 text-white font-semibold rounded-lg shadow-md transition-all text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-400 mt-2"
              >
                Request Reservation
              </button>
            </form>
          ) : (
            /* Success / Next Steps Confirmation Screen */
            <div className="space-y-6 text-center">
              <div className="w-12 h-12 bg-sage-100 text-sage-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <div>
                <h3 className="font-serif text-xl font-bold text-charcoal-900 mb-1">
                  Thank You, {submittedData?.name}
                </h3>
                <p className="text-xs text-charcoal-600">
                  We have received your reservation request for MĀRA.
                </p>
              </div>

              {/* Request Summary Card */}
              <div className="bg-sand-50 rounded-xl p-4 border border-sand-200 text-left text-xs space-y-2">
                <div className="flex justify-between border-b border-sand-200 pb-1.5">
                  <span className="text-charcoal-500">Date & Time</span>
                  <span className="font-bold text-charcoal-900">{submittedData?.date} at {submittedData?.time}</span>
                </div>
                <div className="flex justify-between border-b border-sand-200 pb-1.5">
                  <span className="text-charcoal-500">Party Size</span>
                  <span className="font-bold text-charcoal-900">{submittedData?.guests} {submittedData?.guests === 1 ? 'Guest' : 'Guests'}</span>
                </div>
                <div className="flex justify-between border-b border-sand-200 pb-1.5">
                  <span className="text-charcoal-500">Seating</span>
                  <span className="font-bold text-charcoal-900 capitalize">{submittedData?.seatingPreference}</span>
                </div>
                {submittedData?.specialRequest && (
                  <div className="flex justify-between pt-0.5">
                    <span className="text-charcoal-500">Note</span>
                    <span className="font-medium text-charcoal-800 text-right max-w-[60%] truncate">{submittedData?.specialRequest}</span>
                  </div>
                )}
              </div>

              <div className="bg-saffron-50 border border-saffron-200 rounded-lg p-3.5 text-xs text-saffron-900 text-left">
                <strong>Next Step:</strong> We will reach out shortly via WhatsApp or SMS to confirm table availability for your requested slot.
              </div>

              {/* Actions */}
              <div className="space-y-2.5">
                {submittedData && (
                  <a
                    href={getReservationWhatsAppLink(submittedData)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-sage-600 hover:bg-sage-700 text-white rounded-lg font-semibold text-xs shadow transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Send Request on WhatsApp</span>
                  </a>
                )}

                <div className="flex items-center justify-center gap-4 text-xs pt-1">
                  <a
                    href={`tel:${restaurantInfo.phone}`}
                    className="inline-flex items-center gap-1 text-charcoal-700 hover:text-terracotta-600 font-medium underline"
                  >
                    <Phone className="w-3 h-3" />
                    <span>Call Host Desk</span>
                  </a>
                  <span className="text-sand-300">|</span>
                  <button
                    onClick={handleReset}
                    className="text-charcoal-600 hover:text-charcoal-900 font-medium underline"
                  >
                    Back to Restaurant
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
