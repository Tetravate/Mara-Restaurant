import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { galleryItems } from '../data/galleryData';
import { GalleryItem } from '../types';

export const GallerySection: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'atmosphere' | 'food' | 'kitchen' | 'details'>('all');
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  const filteredItems = selectedFilter === 'all'
    ? galleryItems
    : galleryItems.filter((item) => item.category === selectedFilter);

  // Keyboard navigation for lightbox
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

  const currentLightboxItem = activeLightboxIndex !== null ? filteredItems[activeLightboxIndex] : null;

  return (
    <section id="gallery" className="py-20 sm:py-28 bg-sand-50 border-t border-sand-200" aria-labelledby="gallery-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-terracotta-600 font-semibold mb-2 block">
              Atmosphere & Craft
            </span>
            <h2
              id="gallery-heading"
              className="font-serif text-3xl sm:text-5xl font-medium text-charcoal-900 tracking-tight"
            >
              The MĀRA Experience
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto mt-6 md:mt-0 pb-1" role="tablist">
            {(['all', 'atmosphere', 'food', 'kitchen', 'details'] as const).map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedFilter(category);
                  setActiveLightboxIndex(null);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold capitalize whitespace-nowrap transition-colors ${
                  selectedFilter === category
                    ? 'bg-charcoal-900 text-sand-50'
                    : 'bg-white text-charcoal-600 hover:bg-sand-200 border border-sand-200'
                }`}
                role="tab"
                aria-selected={selectedFilter === category}
              >
                {category === 'all' ? 'All Glimpses' : category}
              </button>
            ))}
          </div>
        </div>

        {/* Editorial Masonry/Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredItems.map((item, idx) => {
            // Give some items distinct spans for editorial asymmetry
            const isWide = idx === 0 || idx === 4;
            return (
              <div
                key={item.id}
                className={`group relative rounded-lg overflow-hidden bg-sand-200 cursor-pointer shadow-subtle hover:shadow-elevated transition-all duration-300 ${
                  isWide ? 'sm:col-span-2 aspect-[16/10]' : 'aspect-square'
                }`}
                onClick={() => openLightbox(item)}
              >
                <img
                  src={item.imageUrl}
                  alt={item.altText}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4 text-sand-50">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-saffron-300 font-semibold mb-0.5 capitalize">
                      {item.category}
                    </p>
                    <p className="font-serif text-sm sm:text-base font-medium text-sand-50">
                      {item.title}
                    </p>
                  </div>
                  <div className="p-2 rounded-full bg-sand-50/20 backdrop-blur-sm text-sand-50">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox Modal */}
      {currentLightboxItem && (
        <div
          className="fixed inset-0 z-50 bg-charcoal-950/95 backdrop-blur-md flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={currentLightboxItem.title}
        >
          {/* Close button */}
          <button
            onClick={() => setActiveLightboxIndex(null)}
            className="absolute top-5 right-5 p-2 rounded-full bg-sand-50/10 text-sand-50 hover:bg-sand-50/20 transition-colors z-10"
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
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-sand-50/10 text-sand-50 hover:bg-sand-50/20 transition-colors z-10"
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
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-sand-50/10 text-sand-50 hover:bg-sand-50/20 transition-colors z-10"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Lightbox Image & Caption */}
          <div className="max-w-4xl max-h-[85vh] flex flex-col items-center">
            <img
              src={currentLightboxItem.imageUrl}
              alt={currentLightboxItem.altText}
              className="max-h-[70vh] w-auto max-w-full rounded-lg object-contain shadow-2xl mb-4"
            />
            <div className="text-center text-sand-50 max-w-lg">
              <p className="font-serif text-lg font-medium text-sand-50 mb-1">
                {currentLightboxItem.title}
              </p>
              <p className="text-xs text-sand-300">
                {currentLightboxItem.altText}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
