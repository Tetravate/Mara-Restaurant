import React, { useState } from 'react';
import { Calendar, Clock, Users, MessageCircle, Phone, CheckCircle2, AlertCircle, Sparkles, ChevronRight } from 'lucide-react';
import { ReservationFormData } from '../../types';
import { validateReservationForm, getTodayDateString, FormErrors } from '../../utils/validation';
import { getReservationWhatsAppLink } from '../../utils/whatsapp';
import { restaurantInfo } from '../../data/restaurant';
import { useRestaurantData } from '../../context/RestaurantDataContext';
import { RestaurantTable } from '../../data/tables';
import { InteractiveFloorMap } from '../../components/reservations/InteractiveFloorMap';

const TIME_SLOTS = [
  '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
  '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM', '10:00 PM',
];

export const ReservationsPage: React.FC = () => {
  const { addCustomerReservation, reservations } = useRestaurantData();

  const [formData, setFormData] = useState<ReservationFormData>({
    name: '',
    phone: '',
    date: getTodayDateString(),
    time: '7:30 PM',
    guests: 2,
    seatingPreference: 'indoor',
    specialRequest: '',
  });

  const [selectedTable, setSelectedTable] = useState<RestaurantTable | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submittedData, setSubmittedData] = useState<(ReservationFormData & { table?: RestaurantTable | null }) | null>(null);

  // Handle selecting a table from the visual floor map
  const handleSelectTable = (table: RestaurantTable) => {
    setSelectedTable(table);
    // Update seating preference based on zone
    let pref: 'indoor' | 'courtyard' | 'private' = 'indoor';
    if (table.zone === 'courtyard') pref = 'courtyard';
    if (table.zone === 'private') pref = 'private';
    setFormData((prev) => ({
      ...prev,
      seatingPreference: pref,
      // Adjust guest count if table requires higher min guests
      guests: prev.guests < table.minGuests ? table.minGuests : prev.guests,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateReservationForm(formData);
    if (!result.isValid) {
      setErrors(result.errors);
      // Scroll to error
      window.scrollTo({ top: 300, behavior: 'smooth' });
      return;
    }

    setErrors({});
    addCustomerReservation({
      name: formData.name,
      phone: formData.phone,
      date: formData.date,
      time: formData.time,
      guests: formData.guests,
      seatingPreference: (formData.seatingPreference || 'indoor') as 'indoor' | 'courtyard' | 'private',
      tableId: selectedTable?.id,
      tableName: selectedTable?.name,
      tableZone: selectedTable?.zoneName,
      specialRequest: formData.specialRequest,
    });

    setSubmittedData({ ...formData, table: selectedTable });
    setIsSubmitted(true);
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setSubmittedData(null);
    setSelectedTable(null);
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
    <div className="py-12 sm:py-20 bg-dark-950 text-ivory-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        {/* 1. Page Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-dark-900 border border-dark-750 text-amber-400 text-xs font-bold uppercase tracking-wider shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            <span>Interactive Table Booking · Coimbatore</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-ivory-100 leading-[1.12]">
            Reserve Your Table
          </h1>

          <p className="text-sm sm:text-base text-stone-300 max-w-xl mx-auto leading-relaxed">
            Select your preferred dining date, party size, and table position on our interactive floor plan.
          </p>
        </div>

        {!isSubmitted ? (
          <div className="space-y-10">
            {/* 2. Step 1: Slot & Party Size Bar */}
            <div className="bg-dark-900/90 border border-dark-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md max-w-5xl mx-auto">
              <div className="flex items-center gap-2 mb-6 border-b border-dark-800 pb-4">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-dark-950 font-mono text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-ivory-100">
                  Select Date, Time & Party Size
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* Date */}
                <div>
                  <label htmlFor="res-date" className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-2">
                    Dining Date <span className="text-amber-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500 pointer-events-none" />
                    <input
                      id="res-date"
                      type="date"
                      min={getTodayDateString()}
                      value={formData.date}
                      onChange={(e) => {
                        setFormData({ ...formData, date: e.target.value });
                        if (errors.date) setErrors({ ...errors, date: undefined });
                      }}
                      className="w-full pl-10 pr-3 py-3 rounded-xl bg-dark-950 border border-dark-700 text-sm text-ivory-100 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  {errors.date && <p className="text-xs text-red-400 mt-1">{errors.date}</p>}
                </div>

                {/* Time */}
                <div>
                  <label htmlFor="res-time" className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-2">
                    Time Slot <span className="text-amber-500">*</span>
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500 pointer-events-none" />
                    <select
                      id="res-time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-dark-950 border border-dark-700 text-sm text-ivory-100 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    >
                      {TIME_SLOTS.map((slot) => (
                        <option key={slot} value={slot} className="bg-dark-950 text-ivory-100">
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Guests */}
                <div>
                  <label htmlFor="res-guests" className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-2">
                    Party Size <span className="text-amber-500">*</span>
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500 pointer-events-none" />
                    <select
                      id="res-guests"
                      value={formData.guests}
                      onChange={(e) => setFormData({ ...formData, guests: Number(e.target.value) })}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-dark-950 border border-dark-700 text-sm text-ivory-100 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 16].map((num) => (
                        <option key={num} value={num} className="bg-dark-950 text-ivory-100">
                          {num} {num === 1 ? 'Guest' : 'Guests'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Step 2: Interactive Table Floor Plan & Position Map */}
            <div className="space-y-4 max-w-6xl mx-auto">
              <div className="flex items-center gap-2 px-2">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-dark-950 font-mono text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-ivory-100">
                    Choose Table Position on Floor Map
                  </h2>
                  <p className="text-xs text-stone-400">
                    Click any available green table to assign your seating. Red tables are already booked for this slot.
                  </p>
                </div>
              </div>

              <InteractiveFloorMap
                selectedDate={formData.date}
                selectedTime={formData.time}
                selectedGuests={formData.guests}
                selectedTableId={selectedTable?.id || null}
                onSelectTable={handleSelectTable}
                existingReservations={reservations}
              />
            </div>

            {/* 4. Step 3: Guest Contact & Final Confirmation Form */}
            <div className="bg-dark-900/90 border border-dark-700/80 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md max-w-4xl mx-auto space-y-6">
              <div className="flex items-center gap-2 border-b border-dark-800 pb-4">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-dark-950 font-mono text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-ivory-100">
                    Guest Information & Confirm Request
                  </h2>
                  <p className="text-xs text-stone-400">
                    Enter your contact details to complete your reservation.
                  </p>
                </div>
              </div>

              {/* Selected Table Callout */}
              {selectedTable ? (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/60 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500 text-dark-950 font-bold flex items-center justify-center font-mono text-xs shrink-0">
                      {selectedTable.code}
                    </div>
                    <div>
                      <strong className="text-sm font-serif text-ivory-100 block">
                        Assigned: {selectedTable.name}
                      </strong>
                      <span className="text-xs text-amber-400">
                        {selectedTable.zoneName} · {selectedTable.type} (Capacity {selectedTable.capacity}p)
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedTable(null)}
                    className="text-xs text-stone-400 hover:text-ivory-100 underline"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-dark-950/80 border border-dashed border-dark-700 text-xs text-stone-400 flex items-center justify-between">
                  <span>* No specific table chosen yet. Host will auto-assign optimal seating, or pick a table above.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Name */}
                  <div>
                    <label htmlFor="form-res-name" className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1.5">
                      Full Name <span className="text-amber-500">*</span>
                    </label>
                    <input
                      id="form-res-name"
                      type="text"
                      placeholder="e.g. Arun Sundaram"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (errors.name) setErrors({ ...errors, name: undefined });
                      }}
                      className={`w-full px-4 py-3 rounded-xl bg-dark-950 border text-sm text-ivory-100 placeholder-stone-600 focus:outline-none transition-all ${
                        errors.name
                          ? 'border-red-500 focus:ring-1 focus:ring-red-500'
                          : 'border-dark-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500'
                      }`}
                      aria-invalid={!!errors.name}
                    />
                    {errors.name && (
                      <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{errors.name}</span>
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="form-res-phone" className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1.5">
                      Mobile Number <span className="text-amber-500">*</span>
                    </label>
                    <input
                      id="form-res-phone"
                      type="tel"
                      placeholder="e.g. 98765 43210"
                      value={formData.phone}
                      onChange={(e) => {
                        setFormData({ ...formData, phone: e.target.value });
                        if (errors.phone) setErrors({ ...errors, phone: undefined });
                      }}
                      className={`w-full px-4 py-3 rounded-xl bg-dark-950 border text-sm text-ivory-100 placeholder-stone-600 focus:outline-none transition-all ${
                        errors.phone
                          ? 'border-red-500 focus:ring-1 focus:ring-red-500'
                          : 'border-dark-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500'
                      }`}
                      aria-invalid={!!errors.phone}
                    />
                    {errors.phone && (
                      <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{errors.phone}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Special Request */}
                <div>
                  <label htmlFor="form-res-special" className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1.5">
                    Special Occasion or Dining Preferences (Optional)
                  </label>
                  <input
                    id="form-res-special"
                    type="text"
                    placeholder="e.g. Anniversary celebration, quiet corner, dietary requests..."
                    value={formData.specialRequest}
                    onChange={(e) => setFormData({ ...formData, specialRequest: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-dark-950 border border-dark-700 text-xs text-ivory-100 placeholder-stone-600 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-dark-950 font-bold rounded-xl shadow-glow-amber transition-all duration-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 mt-4 flex items-center justify-center gap-2"
                >
                  <span>Confirm Table Reservation Request</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* 5. Reservation Receipt & Confirmed Status */
          <div className="max-w-2xl mx-auto bg-dark-900/90 border border-dark-700/80 rounded-3xl p-8 sm:p-12 shadow-2xl text-center space-y-8">
            <div className="w-20 h-20 bg-amber-500/10 border-2 border-amber-500/40 text-amber-400 rounded-full flex items-center justify-center mx-auto shadow-glow-amber">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold block mb-1">
                Booking Registered & Table Reserved
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ivory-100">
                Reservation Confirmed
              </h2>
              <p className="text-xs text-stone-400 mt-1">
                MĀRA · 42 Race Course Road, Coimbatore
              </p>
            </div>

            {/* Confirmed Ticket Summary */}
            <div className="bg-dark-950 rounded-2xl p-6 border border-dark-750 text-left text-xs space-y-3.5">
              <div className="flex justify-between border-b border-dark-800 pb-2.5">
                <span className="text-stone-400">Guest Name</span>
                <span className="font-bold text-ivory-100">{submittedData?.name}</span>
              </div>

              <div className="flex justify-between border-b border-dark-800 pb-2.5">
                <span className="text-stone-400">Date and Time</span>
                <span className="font-bold text-ivory-100">{submittedData?.date} at {submittedData?.time}</span>
              </div>

              <div className="flex justify-between border-b border-dark-800 pb-2.5">
                <span className="text-stone-400">Party Size</span>
                <span className="font-bold text-ivory-100">{submittedData?.guests} {submittedData?.guests === 1 ? 'Guest' : 'Guests'}</span>
              </div>

              {submittedData?.table ? (
                <div className="flex justify-between border-b border-dark-800 pb-2.5 bg-amber-500/5 p-2 rounded-lg">
                  <span className="text-amber-400 font-semibold">Designated Table</span>
                  <span className="font-bold text-amber-300">
                    {submittedData.table.code} · {submittedData.table.name} ({submittedData.table.zoneName})
                  </span>
                </div>
              ) : (
                <div className="flex justify-between border-b border-dark-800 pb-2.5">
                  <span className="text-stone-400">Seating Area</span>
                  <span className="font-bold text-amber-400 capitalize">{submittedData?.seatingPreference}</span>
                </div>
              )}

              {submittedData?.specialRequest && (
                <div className="flex justify-between pt-0.5">
                  <span className="text-stone-400">Special Note</span>
                  <span className="font-medium text-stone-300 text-right max-w-[60%] truncate">{submittedData?.specialRequest}</span>
                </div>
              )}
            </div>

            <div className="bg-dark-950/60 border border-dark-800 rounded-xl p-4 text-xs text-stone-300 text-left">
              <strong className="text-amber-400 block mb-1">Live Floor Update:</strong>
              Your table has been marked as reserved on our live dining floor map for this time slot.
            </div>

            <div className="space-y-3 pt-2">
              {submittedData && (
                <a
                  href={getReservationWhatsAppLink(submittedData)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-ivory-100 rounded-xl font-bold text-xs shadow-lg transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send WhatsApp Confirmation to Host Desk</span>
                </a>
              )}

              <div className="flex items-center justify-center gap-4 text-xs pt-2">
                <a
                  href={`tel:${restaurantInfo.phone}`}
                  className="inline-flex items-center gap-1 text-stone-400 hover:text-amber-400 font-medium transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call {restaurantInfo.displayPhone}</span>
                </a>
                <span className="text-dark-700">|</span>
                <button
                  onClick={handleReset}
                  className="text-stone-400 hover:text-ivory-100 font-medium transition-colors"
                >
                  Reserve another table
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
