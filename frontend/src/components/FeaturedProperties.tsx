import React from 'react';
import { Property, FilterOptions } from '../types';
import { PropertyCard } from './PropertyCard';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';

interface FeaturedPropertiesProps {
  properties: Property[];
  filters: FilterOptions;
  onFilterChange: (filters: Partial<FilterOptions>) => void;
  savedIds: string[];
  onToggleSave: (id: string) => void;
  onSelectProperty: (property: Property) => void;
}

export const FeaturedProperties: React.FC<FeaturedPropertiesProps> = ({
  properties,
  filters,
  onFilterChange,
  savedIds,
  onToggleSave,
  onSelectProperty,
}) => {
  const tabs = [
    { id: 'all', label: 'All Properties' },
    { id: 'sale', label: 'For Sale' },
    { id: 'rent', label: 'For Rent' },
    { id: 'villa', label: 'Luxury Villas' },
    { id: 'house', label: 'Single Family' },
  ];

  // Filter properties based on tab, location, propertyType, priceRange
  const filteredProperties = properties.filter((prop) => {
    // Tab filter
    if (filters.statusTab === 'sale' && prop.status !== 'For Sale') return false;
    if (filters.statusTab === 'rent' && prop.status !== 'For Rent') return false;
    if (filters.statusTab === 'villa' && prop.type !== 'Villa') return false;
    if (filters.statusTab === 'house' && prop.type !== 'Single Family') return false;

    // Location search
    if (filters.location.trim()) {
      const q = filters.location.toLowerCase();
      const matchLocation =
        prop.city.toLowerCase().includes(q) ||
        prop.state.toLowerCase().includes(q) ||
        prop.zip.toLowerCase().includes(q) ||
        prop.location.toLowerCase().includes(q);
      if (!matchLocation) return false;
    }

    // Property Type
    if (filters.propertyType && filters.propertyType !== 'All') {
      if (prop.type !== filters.propertyType) return false;
    }

    // Price Range
    if (filters.priceRange && filters.priceRange !== 'Any') {
      if ((filters.priceRange === 'Under ₹5 Cr' || filters.priceRange === 'Under $1M') && prop.price >= 50000000) return false;
      if ((filters.priceRange === '₹5 Cr - ₹10 Cr' || filters.priceRange === '$1M - $2M') && (prop.price < 50000000 || prop.price > 100000000)) return false;
      if ((filters.priceRange === '₹10 Cr+' || filters.priceRange === '$2M+') && prop.price < 100000000) return false;
    }

    return true;
  });

  const resetFilters = () => {
    onFilterChange({
      location: '',
      propertyType: 'All',
      priceRange: 'Any',
      statusTab: 'all',
    });
  };

  const hasActiveFilters =
    filters.location !== '' ||
    filters.propertyType !== 'All' ||
    filters.priceRange !== 'Any' ||
    filters.statusTab !== 'all';

  return (
    <section id="featured-properties" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
            Featured Properties
          </h2>
          <p className="mt-2 text-neutral-500 text-base sm:text-lg">
            Curated selection of the finest homes for you
          </p>
        </div>

        {/* Filter Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {tabs.map((tab) => {
            const isActive = filters.statusTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onFilterChange({ statusTab: tab.id })}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Filter Indicators */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 mb-8 text-xs text-neutral-600">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-500" />
            <span>
              Showing results for:{' '}
              {filters.location && <strong className="font-semibold text-neutral-900">"{filters.location}" </strong>}
              {filters.propertyType !== 'All' && <span className="bg-neutral-200 px-2 py-0.5 rounded-sm mr-1">{filters.propertyType}</span>}
              {filters.priceRange !== 'Any' && <span className="bg-neutral-200 px-2 py-0.5 rounded-sm mr-1">{filters.priceRange}</span>}
            </span>
          </div>
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 font-semibold text-[#16a34a] hover:text-[#15803d] cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset all
          </button>
        </div>
      )}

      {/* Properties Grid */}
      {filteredProperties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              isSaved={savedIds.includes(property.id)}
              onToggleSave={onToggleSave}
              onSelectProperty={onSelectProperty}
            />
          ))}
        </div>
      ) : (
        <div className="bg-neutral-50 rounded-2xl border border-dashed border-neutral-300 p-12 text-center max-w-lg mx-auto">
          <p className="text-lg font-semibold text-neutral-800 mb-2">No homes matched your criteria</p>
          <p className="text-neutral-500 text-sm mb-6">
            Try adjusting your search location, price tier, or property type filters.
          </p>
          <button
            onClick={resetFilters}
            className="px-5 py-2.5 rounded-full bg-[#22c55e] hover:bg-[#16a34a] text-white text-sm font-semibold transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}
    </section>
  );
};
