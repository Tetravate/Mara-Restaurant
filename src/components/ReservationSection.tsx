import React, { useState } from 'react';
import { Calendar, Clock, Users, MessageCircle, CheckCircle2, AlertCircle } from 'lucide-react';
import { ReservationFormData } from '../types';
import { validateReservationForm, getTodayDateString, FormErrors } from '../utils/validation';
import { getReservationWhatsAppLink } from '../utils/whatsapp';
import { restaurantInfo } from '../data/restaurantInfo';

const TIME_SLOTS = [
  '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
  '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM', '10:00 PM',
];

export const ReservationSection: React.FC = () => {
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
  };

  return (
    <section id="reservations" className="py-20 sm:py-28 bg-sand-100 border-t border-sand-200" aria-labelledby="reservation-section-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-elevated border border-sand-200 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-12">
            {/* Left Column: Context & Guidelines */}
            <div className="md:col-span-5 bg-charcoal-900 text-sand-50 p-8 sm:p-10 flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase tracking-[0.2em] text-saffron-300 font-semibold mb-2 block">
                  Table Reservations
                </span>
                <h2 id="reservation-section-heading" className="font-serif text-3xl font-medium text-sand-50 mb-4">
                  Join Us at the Table
                </h2>
                <p className="text-sand-300 text-xs sm:text-sm leading-relaxed mb-6">
                  We welcome reservations up to 30 days in advance. For same-day tables within the hour, please phone our host desk directly.
                </p>

                <div className="space-y-4 pt-6 border-t border-charcoal-800 text-xs text-sand-300">
                  <div>
                    <strong className="text-sand-100 block mb-0.5">Dining Timings</strong>
                    <span>Lunch: 12:00 PM – 3:30 PM</span><br />
                    <span>Dinner: 7:00 PM – 11:00 PM</span>
                  </div>

                  <div>
                    <strong className="text-sand-100 block mb-0.5">Host Desk Contact</strong>
                    <a href={`tel:${restaurantInfo.phone}`} className="text-saffron-300 hover:underline">
                      {restaurantInfo.displayPhone}
                    </a>
                  </div>

                  <div>
                    <strong className="text-sand-100 block mb-0.5">Location</strong>
                    <span>42 Race Course Road, Coimbatore</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-charcoal-800/80 text-[11px] text-sand-400">
                <p>Valet parking is complimentary for all dining guests.</p>
              </div>
            </div>

            {/* Right Column: Interactive Form */}
            <div className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-center">
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  <h3 className="font-serif text-xl font-semibold text-charcoal-900 mb-2">
                    Request a Reservation
                  </h3>

                  {/* Name */}
                  <div>
                    <label htmlFor="sec-name" className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1">
                      Full Name <span className="text-terracotta-600">*</span>
                    </label>
                    <input
                      id="sec-name"
                      type="text"
                      placeholder="e.g. Arun Sundaram"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (errors.name) setErrors({ ...errors, name: undefined });
                      }}
                      className={`w-full px-3.5 py-2 rounded-lg border text-sm text-charcoal-900 focus:outline-none focus:ring-2 ${
                        errors.name ? 'border-red-500 focus:ring-red-300' : 'border-sand-300 focus:ring-terracotta-500'
                      }`}
                      aria-invalid={!!errors.name}
                    />
                    {errors.name && (
                      <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.name}</span>
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="sec-phone" className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1">
                      Mobile Number <span className="text-terracotta-600">*</span>
                    </label>
                    <input
                      id="sec-phone"
                      type="tel"
                      placeholder="e.g. 98765 43210"
                      value={formData.phone}
                      onChange={(e) => {
                        setFormData({ ...formData, phone: e.target.value });
                        if (errors.phone) setErrors({ ...errors, phone: undefined });
                      }}
                      className={`w-full px-3.5 py-2 rounded-lg border text-sm text-charcoal-900 focus:outline-none focus:ring-2 ${
                        errors.phone ? 'border-red-500 focus:ring-red-300' : 'border-sand-300 focus:ring-terracotta-500'
                      }`}
                      aria-invalid={!!errors.phone}
                    />
                    {errors.phone && (
                      <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.phone}</span>
                      </p>
                    )}
                  </div>

                  {/* Date & Guests */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="sec-date" className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1">
                        Date <span className="text-terracotta-600">*</span>
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400 pointer-events-none" />
                        <input
                          id="sec-date"
                          type="date"
                          min={getTodayDateString()}
                          value={formData.date}
                          onChange={(e) => {
                            setFormData({ ...formData, date: e.target.value });
                            if (errors.date) setErrors({ ...errors, date: undefined });
                          }}
                          className="w-full pl-9 pr-3 py-2 rounded-lg border border-sand-300 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                        />
                      </div>
                      {errors.date && <p className="text-xs text-red-600 mt-1">{errors.date}</p>}
                    </div>

                    <div>
                      <label htmlFor="sec-guests" className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1">
                        Guests <span className="text-terracotta-600">*</span>
                      </label>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400 pointer-events-none" />
                        <select
                          id="sec-guests"
                          value={formData.guests}
                          onChange={(e) => setFormData({ ...formData, guests: Number(e.target.value) })}
                          className="w-full pl-9 pr-3 py-2 rounded-lg border border-sand-300 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500 bg-white"
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

                  {/* Time */}
                  <div>
                    <label htmlFor="sec-time" className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1">
                      Preferred Time <span className="text-terracotta-600">*</span>
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400 pointer-events-none" />
                      <select
                        id="sec-time"
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 rounded-lg border border-sand-300 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500 bg-white"
                      >
                        {TIME_SLOTS.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Seating preference */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1">
                      Seating Preference
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'indoor', label: 'Main Hall' },
                        { id: 'courtyard', label: 'Courtyard' },
                        { id: 'private', label: 'Private Room' },
                      ].map((area) => (
                        <button
                          key={area.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, seatingPreference: area.id as any })}
                          className={`py-1.5 px-2 text-xs rounded-md border font-medium transition-colors ${
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

                  {/* Special Note */}
                  <div>
                    <label htmlFor="sec-special" className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1">
                      Special Request (Optional)
                    </label>
                    <input
                      id="sec-special"
                      type="text"
                      placeholder="e.g. Birthday dinner, window seat, high chair..."
                      value={formData.specialRequest}
                      onChange={(e) => setFormData({ ...formData, specialRequest: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-sand-300 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-terracotta-500 hover:bg-terracotta-600 text-white font-semibold rounded-lg shadow-md transition-all text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-400 mt-2"
                  >
                    Request Reservation
                  </button>
                </form>
              ) : (
                /* Success State */
                <div className="space-y-5 text-center">
                  <div className="w-12 h-12 bg-sage-100 text-sage-700 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>

                  <div>
                    <h3 className="font-serif text-2xl font-bold text-charcoal-900 mb-1">
                      Request Received, {submittedData?.name}
                    </h3>
                    <p className="text-xs text-charcoal-600">
                      Our host desk will review availability and confirm your reservation shortly.
                    </p>
                  </div>

                  <div className="bg-sand-50 rounded-xl p-4 border border-sand-200 text-left text-xs space-y-2">
                    <div className="flex justify-between border-b border-sand-200 pb-1.5">
                      <span className="text-charcoal-500">Date & Time</span>
                      <span className="font-bold text-charcoal-900">{submittedData?.date} at {submittedData?.time}</span>
                    </div>
                    <div className="flex justify-between border-b border-sand-200 pb-1.5">
                      <span className="text-charcoal-500">Party Size</span>
                      <span className="font-bold text-charcoal-900">{submittedData?.guests} Guests</span>
                    </div>
                    <div className="flex justify-between border-b border-sand-200 pb-1.5">
                      <span className="text-charcoal-500">Seating</span>
                      <span className="font-bold text-charcoal-900 capitalize">{submittedData?.seatingPreference}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {submittedData && (
                      <a
                        href={getReservationWhatsAppLink(submittedData)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-sage-600 hover:bg-sage-700 text-white rounded-lg font-semibold text-xs shadow transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Send Details on WhatsApp</span>
                      </a>
                    )}

                    <button
                      onClick={handleReset}
                      className="text-xs text-charcoal-600 hover:text-charcoal-900 underline block mx-auto pt-2"
                    >
                      Make another request
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
