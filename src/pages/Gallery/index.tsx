import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2, Camera } from 'lucide-react';
import { galleryCategories, galleryItems, GalleryCategory, GalleryItem } from '../../data/gallery';

export const GalleryPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<GalleryCategory>('all');
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  const filteredItems = selectedCategory === 'all'
    ? galleryItems
    : galleryItems.filter((i) => i.category === selectedCategory);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeLightboxIndex === null) return;
      if (e.key === 'Escape') setActiveLightboxIndex(null);
      if (e.key === 'ArrowRight') {
        setActiveLightboxIndex((prev) => (prev !== null ? (prev + 1) % filteredItems.length : 0));
      }
      if (e.key === 'ArrowLeft') {
        setActiveLightboxIndex((prev) =>
          prev !== null ? (prev - 1 + filteredItems.length) % filteredItems.length : 0
        );
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeLightboxIndex, filteredItems.length]);

  const openLightbox = (item: GalleryItem) => {
    const idx = filteredItems.findIndex((i) => i.id === item.id);
    if (idx !== -1) setActiveLightboxIndex(idx);
  };

  const currentItem = activeLightboxIndex !== null ? filteredItems[activeLightboxIndex] : null;

  return (
    <div className="py-12 sm:py-20 bg-dark-950 text-ivory-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header & Categories */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-dark-800/80 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Camera className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-amber-500 font-mono text-xs uppercase tracking-widest font-semibold">
                Atmosphere and Craft
              </span>
            </div>
            <h1 className="font-serif text-4xl sm:text-6xl font-medium text-ivory-100 tracking-tight">
              Visual Stories of MĀRA
            </h1>
            <p className="text-xs sm:text-sm text-stone-400 mt-2 max-w-xl">
              From our slow-simmered brass handis to the teakwood dining room, glimpse the textures, rituals, and faces that define our table.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none" role="tablist">
            {galleryCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setActiveLightboxIndex(null);
                }}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  selectedCategory === cat.id
                    ? 'bg-amber-500 text-dark-950 shadow-glow-amber font-bold'
                    : 'bg-dark-900/90 text-stone-400 hover:text-ivory-100 hover:bg-dark-800 border border-dark-700/80'
                }`}
                role="tab"
                aria-selected={selectedCategory === cat.id}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Cohesive Restaurant Atmosphere Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-2xl overflow-hidden bg-dark-900 border border-dark-750/80 cursor-pointer hover:border-amber-500/60 shadow-xl transition-all duration-500 aspect-[4/3]"
              onClick={() => openLightbox(item)}
            >
              <img
                src={item.imageUrl}
                alt={item.altText}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-950/95 via-dark-950/30 to-transparent p-5 flex flex-col justify-end">
                <div className="flex items-end justify-between gap-2">
                  <div>
                    {item.subtitle && (
                      <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold block mb-1">
                        {item.subtitle}
                      </span>
                    )}
                    <p className="font-serif text-base sm:text-lg font-bold text-ivory-100 group-hover:text-amber-200 transition-colors">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-stone-400 line-clamp-1 mt-0.5">
                      {item.altText}
                    </p>
                  </div>
                  <div className="p-2 rounded-full bg-dark-900/90 border border-dark-700 text-amber-400 group-hover:bg-amber-500 group-hover:text-dark-950 transition-colors shrink-0">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {currentItem && (
        <div
          className="fixed inset-0 z-50 bg-dark-950/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={currentItem.title}
        >
          {/* Close button */}
          <button
            onClick={() => setActiveLightboxIndex(null)}
            className="absolute top-6 right-6 p-3 rounded-full bg-dark-900/90 border border-dark-700 text-stone-300 hover:text-ivory-100 hover:border-amber-500 transition-colors z-10"
            aria-label="Close image viewer"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Prev button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveLightboxIndex((prev) =>
                prev !== null ? (prev - 1 + filteredItems.length) % filteredItems.length : 0
              );
            }}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full bg-dark-900/90 border border-dark-700 text-stone-300 hover:text-ivory-100 hover:border-amber-500 transition-colors z-10"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveLightboxIndex((prev) =>
                prev !== null ? (prev + 1) % filteredItems.length : 0
              );
            }}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full bg-dark-900/90 border border-dark-700 text-stone-300 hover:text-ivory-100 hover:border-amber-500 transition-colors z-10"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Lightbox Image & Caption */}
          <div className="max-w-4xl max-h-[85vh] flex flex-col items-center">
            <div className="relative rounded-2xl overflow-hidden border border-dark-700/80 shadow-2xl bg-dark-900">
              <img
                src={currentItem.imageUrl}
                alt={currentItem.altText}
                className="max-h-[70vh] w-auto max-w-full object-contain"
              />
            </div>
            <div className="text-center text-ivory-100 max-w-lg mt-4 space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-500 block">
                {currentItem.category}
              </span>
              <p className="font-serif text-xl font-medium text-ivory-100">
                {currentItem.title}
              </p>
              <p className="text-xs text-stone-400">
                {currentItem.altText}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
