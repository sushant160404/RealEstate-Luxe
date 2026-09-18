import React, { useState } from 'react';
import { MapPin, Home, IndianRupee, Search, Sparkles, ArrowRight } from 'lucide-react';
import { FilterOptions } from '../types';

interface HeroSectionProps {
  filters: FilterOptions;
  onFilterChange: (newFilters: Partial<FilterOptions>) => void;
  onApplySearch: () => void;
  onOpenConsultation: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  filters,
  onFilterChange,
  onApplySearch,
  onOpenConsultation,
}) => {
  const [localLocation, setLocalLocation] = useState(filters.location);
  const [localType, setLocalType] = useState(filters.propertyType);
  const [localPrice, setLocalPrice] = useState(filters.priceRange);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({
      location: localLocation,
      propertyType: localType,
      priceRange: localPrice,
    });
    onApplySearch();
    // Scroll down to properties
    const element = document.getElementById('featured-properties');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero-section" className="relative pt-24 pb-16 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Hero Visual Card with Rounded Corners */}
      <div className="relative rounded-3xl md:rounded-[36px] overflow-hidden min-h-[500px] md:min-h-[580px] flex items-center justify-center text-center shadow-xl">
        {/* Background Architectural Image */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-100"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=85')`,
          }}
        >
          {/* Subtle cinematic gradient overlay to ensure crystal clear contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/35 backdrop-brightness-95" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-3xl mx-auto px-6 py-16 md:py-24 text-white">
          {/* Subtle Tag badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-medium text-white/90 mb-6 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#22c55e]" />
            <span>Curated Luxury Living & Advisory</span>
          </div>

          {/* Main Display Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.12] mb-6">
            Find your place to <br className="hidden sm:inline" />
            <span className="text-[#22c55e] drop-shadow-xs">call home</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-neutral-200 font-normal max-w-2xl mx-auto mb-9 leading-relaxed">
            Discover bespoke residences and high-yield properties tailored to your lifestyle.
            We guide you through premier off-market opportunities with unmatched expertise.
          </p>

          {/* Action CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => {
                const el = document.getElementById('featured-properties');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#22c55e] hover:bg-[#16a34a] text-white font-semibold text-sm sm:text-base shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>View Listings</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenConsultation}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/30 text-white font-semibold text-sm sm:text-base transition-all duration-200 cursor-pointer"
            >
              Book Consultation
            </button>
          </div>
        </div>
      </div>

      {/* Floating Filter Search Bar overlapping hero bottom */}
      <div className="relative -mt-10 sm:-mt-12 z-20 max-w-5xl mx-auto px-2 sm:px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl md:rounded-full p-3 sm:p-4 shadow-xl border border-neutral-100 flex flex-col md:flex-row items-stretch md:items-center gap-3 sm:gap-4"
        >
          {/* Location Input */}
          <div className="flex-1 flex items-center gap-3 px-4 py-2.5 rounded-xl md:rounded-full bg-neutral-50/80 hover:bg-neutral-50 border border-neutral-200/70 focus-within:border-[#22c55e] focus-within:bg-white transition-colors">
            <MapPin className="w-5 h-5 text-neutral-400 shrink-0" />
            <div className="flex-1 text-left">
              <label htmlFor="search-location" className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                Location
              </label>
              <input
                id="search-location"
                type="text"
                value={localLocation}
                onChange={(e) => setLocalLocation(e.target.value)}
                placeholder="Mumbai, Gurgaon, Goa, Pune, Bengaluru..."
                className="w-full bg-transparent text-sm font-medium text-neutral-800 placeholder-neutral-400 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Property Type Dropdown */}
          <div className="flex-1 flex items-center gap-3 px-4 py-2.5 rounded-xl md:rounded-full bg-neutral-50/80 hover:bg-neutral-50 border border-neutral-200/70 focus-within:border-[#22c55e] focus-within:bg-white transition-colors">
            <Home className="w-5 h-5 text-neutral-400 shrink-0" />
            <div className="flex-1 text-left">
              <label htmlFor="search-property-type" className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                Property Type
              </label>
              <select
                id="search-property-type"
                value={localType}
                onChange={(e) => setLocalType(e.target.value)}
                className="w-full bg-transparent text-sm font-medium text-neutral-800 focus:outline-hidden cursor-pointer"
              >
                <option value="All">All Types</option>
                <option value="Single Family">Heritage Bungalow</option>
                <option value="Villa">Luxury Villa</option>
                <option value="Apartment">Apartment</option>
                <option value="Penthouse">Penthouse</option>
              </select>
            </div>
          </div>

          {/* Price Range Dropdown */}
          <div className="flex-1 flex items-center gap-3 px-4 py-2.5 rounded-xl md:rounded-full bg-neutral-50/80 hover:bg-neutral-50 border border-neutral-200/70 focus-within:border-[#22c55e] focus-within:bg-white transition-colors">
            <IndianRupee className="w-5 h-5 text-neutral-400 shrink-0" />
            <div className="flex-1 text-left">
              <label htmlFor="search-price-range" className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                Price Range
              </label>
              <select
                id="search-price-range"
                value={localPrice}
                onChange={(e) => setLocalPrice(e.target.value)}
                className="w-full bg-transparent text-sm font-medium text-neutral-800 focus:outline-hidden cursor-pointer"
              >
                <option value="Any">Any Budget</option>
                <option value="Under ₹5 Cr">Under ₹5 Crore</option>
                <option value="₹5 Cr - ₹10 Cr">₹5 Cr - ₹10 Crore</option>
                <option value="₹10 Cr+">₹10 Crore+</option>
              </select>
            </div>
          </div>

          {/* Search Submit Button */}
          <button
            type="submit"
            id="hero-search-submit"
            className="flex items-center justify-center gap-2 px-7 py-3.5 md:py-4 rounded-xl md:rounded-full bg-neutral-900 hover:bg-neutral-800 active:bg-black text-white text-sm font-semibold shadow-md transition-all duration-200 cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
          </button>
        </form>
      </div>
    </section>
  );
};
