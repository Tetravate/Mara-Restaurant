import React, { useState } from 'react';
import { Users, CheckCircle2, Lock, Sparkles, Flame, Sun, Crown, Eye, X } from 'lucide-react';
import { restaurantTables, RestaurantTable, DiningZoneId, diningZones } from '../../data/tables';
import { AdminReservation } from '../../context/RestaurantDataContext';

interface InteractiveFloorMapProps {
  selectedDate: string;
  selectedTime: string;
  selectedGuests: number;
  selectedTableId: string | null;
  onSelectTable: (table: RestaurantTable) => void;
  existingReservations: AdminReservation[];
}

export const InteractiveFloorMap: React.FC<InteractiveFloorMapProps> = ({
  selectedDate,
  selectedTime,
  selectedGuests,
  selectedTableId,
  onSelectTable,
  existingReservations,
}) => {
  const [activeZone, setActiveZone] = useState<DiningZoneId>('all');
  const [filterGuestSize, setFilterGuestSize] = useState<number | 'all'>('all');
  const [previewTable, setPreviewTable] = useState<RestaurantTable | null>(null);

  // Determine booked table IDs for the given date and time slot
  const bookedTableIds = new Set(
    existingReservations
      .filter(
        (r) =>
          r.date === selectedDate &&
          r.time === selectedTime &&
          r.status !== 'cancelled' &&
          r.tableId
      )
      .map((r) => r.tableId as string)
  );

  // Filter tables based on active zone and guest capacity
  const filteredTables = restaurantTables.filter((table) => {
    const matchesZone = activeZone === 'all' || table.zone === activeZone;
    const matchesCapacity =
      filterGuestSize === 'all'
        ? true
        : filterGuestSize === 6
        ? table.capacity >= 6
        : table.capacity >= filterGuestSize && table.minGuests <= filterGuestSize;
    return matchesZone && matchesCapacity;
  });

  const totalTablesCount = restaurantTables.length;
  const bookedCount = restaurantTables.filter((t) => bookedTableIds.has(t.id)).length;
  const availableCount = totalTablesCount - bookedCount;

  const getZoneIcon = (zone: string) => {
    switch (zone) {
      case 'hall':
        return <Sparkles className="w-3.5 h-3.5 text-amber-400" />;
      case 'bamboo':
        return <Flame className="w-3.5 h-3.5 text-amber-500" />;
      case 'courtyard':
        return <Sun className="w-3.5 h-3.5 text-orange-400" />;
      case 'private':
        return <Crown className="w-3.5 h-3.5 text-amber-300" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-amber-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Live Availability Status Bar */}
      <div className="bg-dark-900/90 border border-dark-750/90 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-dark-800 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
                Live Table Availability Map
              </span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-ivory-100">
              Select Your Table Position
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              Viewing table availability for <strong className="text-amber-400">{selectedDate}</strong> at{' '}
              <strong className="text-amber-400">{selectedTime}</strong>
            </p>
          </div>

          {/* Availability Badges */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <div className="px-3.5 py-1.5 rounded-full bg-dark-950 border border-dark-700 text-xs flex items-center gap-2 text-stone-300">
              <span className="font-mono font-bold text-ivory-100">{totalTablesCount}</span>
              <span>Total Tables</span>
            </div>

            <div className="px-3.5 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-xs flex items-center gap-2 text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="font-mono font-bold">{availableCount}</span>
              <span>Available</span>
            </div>

            <div className="px-3.5 py-1.5 rounded-full bg-red-950/50 border border-red-500/40 text-xs flex items-center gap-2 text-red-300">
              <Lock className="w-3 h-3 text-red-400" />
              <span className="font-mono font-bold">{bookedCount}</span>
              <span>Booked</span>
            </div>
          </div>
        </div>

        {/* 2. Filters Bar: Zones & Party Size */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-1">
          {/* Zone Selector Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {diningZones.map((zone) => (
              <button
                key={zone.id}
                type="button"
                onClick={() => setActiveZone(zone.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  activeZone === zone.id
                    ? 'bg-amber-500 text-dark-950 font-bold shadow-glow-amber'
                    : 'bg-dark-950/80 text-stone-400 hover:text-ivory-100 border border-dark-750'
                }`}
              >
                {zone.name}
              </button>
            ))}
          </div>

          {/* Party Size Quick Filter */}
          <div className="flex items-center gap-1.5 text-xs text-stone-400 shrink-0">
            <span className="hidden sm:inline">Capacity:</span>
            {[
              { label: 'All', value: 'all' },
              { label: '2 Guests', value: 2 },
              { label: '4 Guests', value: 4 },
              { label: '6+ Guests', value: 6 },
            ].map((f) => (
              <button
                key={f.label}
                type="button"
                onClick={() => setFilterGuestSize(f.value as any)}
                className={`px-2.5 py-1 rounded-lg text-xs transition-colors ${
                  filterGuestSize === f.value
                    ? 'bg-dark-750 text-ivory-100 border border-amber-500/60 font-semibold'
                    : 'bg-dark-950/60 text-stone-400 hover:text-ivory-100 border border-dark-800'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Visual Interactive Floor Layout Map */}
      <div className="bg-dark-950 border border-dark-750 rounded-3xl p-4 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Subtle Ambient Glow in background */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Map Legend */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-stone-400 mb-6 bg-dark-900/60 p-3.5 rounded-xl border border-dark-800">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-dark-800 border-2 border-emerald-500/80 inline-block" />
              <span>Available Table (Click to Select)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-amber-500 border border-amber-300 inline-block shadow-glow-amber" />
              <span className="text-amber-300 font-semibold">Your Selected Table</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-red-950/80 border border-red-500/60 inline-block" />
              <span className="text-red-400">Already Booked / Occupied</span>
            </div>
          </div>
          <span className="text-stone-500 italic">
            * Capacity recommendation: {selectedGuests} {selectedGuests === 1 ? 'Guest' : 'Guests'}
          </span>
        </div>

        {/* Floor Architecture Grid */}
        <div className="space-y-8">
          {/* Architectural Landmarks Top Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center text-xs">
            <div className="p-3 rounded-xl bg-dark-900/70 border border-dashed border-dark-700/80 text-stone-400 flex items-center justify-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="font-mono uppercase tracking-wider text-[11px]">Race Course Road Glass Facade & Window Line</span>
            </div>
            <div className="p-3 rounded-xl bg-dark-900/70 border border-dashed border-dark-700/80 text-stone-400 flex items-center justify-center gap-2">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span className="font-mono uppercase tracking-wider text-[11px]">Live Charcoal Hearth & Open Kitchen</span>
            </div>
            <div className="p-3 rounded-xl bg-dark-900/70 border border-dashed border-dark-700/80 text-stone-400 flex items-center justify-center gap-2">
              <Sun className="w-3.5 h-3.5 text-orange-400" />
              <span className="font-mono uppercase tracking-wider text-[11px]">Outdoor Parasol Courtyard Garden</span>
            </div>
          </div>

          {/* Interactive Tables Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {filteredTables.map((table) => {
              const isBooked = bookedTableIds.has(table.id);
              const isSelected = selectedTableId === table.id;

              return (
                <div
                  key={table.id}
                  className={`group relative rounded-2xl p-4 sm:p-5 border transition-all duration-300 flex flex-col justify-between ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-400 shadow-glow-amber ring-2 ring-amber-400/50'
                      : isBooked
                      ? 'bg-dark-900/40 border-red-900/40 opacity-70 cursor-not-allowed'
                      : 'bg-dark-900/90 hover:bg-dark-850 border-dark-750 hover:border-emerald-500/60 cursor-pointer shadow-lg hover:shadow-xl'
                  }`}
                  onClick={() => {
                    if (!isBooked) {
                      onSelectTable(table);
                    }
                  }}
                >
                  {/* Top Table Badge & Code */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-mono text-xs px-2.5 py-1 rounded-md font-bold uppercase tracking-wider ${
                          isSelected
                            ? 'bg-amber-500 text-dark-950'
                            : isBooked
                            ? 'bg-red-950 text-red-400 border border-red-800'
                            : 'bg-dark-950 text-emerald-400 border border-dark-700'
                        }`}
                      >
                        {table.code}
                      </span>
                      <span className="text-[10px] text-stone-400 font-medium truncate">
                        {table.position.areaName}
                      </span>
                    </div>

                    {/* Status Pill */}
                    {isBooked ? (
                      <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-red-950/90 text-red-400 border border-red-800/80 font-bold shrink-0">
                        <Lock className="w-2.5 h-2.5" />
                        <span>Booked</span>
                      </span>
                    ) : isSelected ? (
                      <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-amber-500 text-dark-950 font-bold shadow-sm shrink-0">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        <span>Selected</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 font-medium shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>Available</span>
                      </span>
                    )}
                  </div>

                  {/* Table Shape / Position Graphic Visual */}
                  <div className="my-3 py-3 px-4 rounded-xl bg-dark-950/80 border border-dark-800 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      {getZoneIcon(table.zone)}
                      <div>
                        <span className="font-serif text-sm font-bold text-ivory-100 block group-hover:text-amber-300 transition-colors">
                          {table.name}
                        </span>
                        <span className="text-[11px] text-stone-400">
                          {table.type} · {table.zoneName}
                        </span>
                      </div>
                    </div>

                    {/* Visual Seats representation */}
                    <div className="flex items-center gap-1 text-xs text-amber-400 bg-dark-900 px-2.5 py-1 rounded-lg border border-dark-750">
                      <Users className="w-3.5 h-3.5 text-stone-400" />
                      <span className="font-bold font-mono">{table.capacity}p</span>
                    </div>
                  </div>

                  {/* Description & Action */}
                  <div className="space-y-3 pt-1">
                    <p className="text-[11px] text-stone-400 line-clamp-2 leading-relaxed">
                      {table.description}
                    </p>

                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-dark-800">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewTable(table);
                        }}
                        className="text-[11px] text-stone-400 hover:text-amber-400 inline-flex items-center gap-1 transition-colors"
                      >
                        <Eye className="w-3 h-3" />
                        <span>View Ambience</span>
                      </button>

                      {isBooked ? (
                        <span className="text-[11px] text-red-400 font-mono">
                          Reserved for {selectedTime}
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onSelectTable(table)}
                          className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all ${
                            isSelected
                              ? 'bg-amber-400 text-dark-950 shadow-glow-amber'
                              : 'bg-dark-800 hover:bg-amber-500 hover:text-dark-950 text-ivory-100 border border-dark-700'
                          }`}
                        >
                          {isSelected ? 'Table Chosen' : 'Select Table'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Table Sticky Summary Strip */}
      {selectedTableId && (
        <div className="bg-gradient-to-r from-dark-900 via-dark-850 to-dark-900 border-2 border-amber-500/80 rounded-2xl p-4 sm:p-5 shadow-glow-amber flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-300">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500 text-amber-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                  Table Confirmed for Request
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span className="text-xs text-stone-300">
                  {selectedDate} at {selectedTime}
                </span>
              </div>
              <h4 className="font-serif text-lg font-bold text-ivory-100">
                {restaurantTables.find((t) => t.id === selectedTableId)?.name}
              </h4>
              <p className="text-xs text-stone-400">
                {restaurantTables.find((t) => t.id === selectedTableId)?.zoneName} · Max {restaurantTables.find((t) => t.id === selectedTableId)?.capacity} Guests
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-xs text-emerald-400 font-bold bg-emerald-950/80 px-3 py-1.5 rounded-full border border-emerald-500/40 inline-block">
              Ready to Book
            </span>
          </div>
        </div>
      )}

      {/* Table Atmosphere Preview Modal */}
      {previewTable && (
        <div
          className="fixed inset-0 z-50 bg-dark-950/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setPreviewTable(null)}
        >
          <div
            className="bg-dark-900 border border-dark-700 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl space-y-4 p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewTable(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-dark-950/80 text-stone-300 hover:text-ivory-100 border border-dark-700"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="aspect-[16/10] rounded-2xl overflow-hidden border border-dark-700">
              <img
                src={previewTable.image}
                alt={previewTable.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-amber-400 font-bold uppercase tracking-wider">
                  {previewTable.code} · {previewTable.zoneName}
                </span>
                <span className="text-xs text-stone-300">
                  Capacity: {previewTable.capacity} Guests
                </span>
              </div>
              <h3 className="font-serif text-xl font-bold text-ivory-100">
                {previewTable.name}
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                {previewTable.description}
              </p>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setPreviewTable(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-400 hover:text-ivory-100 bg-dark-950 border border-dark-800"
              >
                Close
              </button>
              {!bookedTableIds.has(previewTable.id) && (
                <button
                  type="button"
                  onClick={() => {
                    onSelectTable(previewTable);
                    setPreviewTable(null);
                  }}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-dark-950 bg-amber-500 hover:bg-amber-400 shadow-glow-amber transition-all"
                >
                  Select This Table
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
