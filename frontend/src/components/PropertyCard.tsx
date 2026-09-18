import React from 'react';
import { Heart, Bed, Bath, Square, MapPin, ArrowUpRight } from 'lucide-react';
import { Property } from '../types';

interface PropertyCardProps {
  property: Property;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onSelectProperty: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  isSaved,
  onToggleSave,
  onSelectProperty,
}) => {
  return (
    <div
      id={`property-card-${property.id}`}
      className="group bg-white rounded-2xl overflow-hidden border border-neutral-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full cursor-pointer hover:-translate-y-1"
      onClick={() => onSelectProperty(property)}
    >
      {/* Property Image with Badges */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-neutral-100">
        <img
          src={property.images[0]}
          alt={property.title}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Status / Category Badge */}
        <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#22c55e] text-white shadow-xs tracking-wide">
            {property.status}
          </span>
          {property.isFeatured && (
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-900/80 backdrop-blur-xs text-white">
              Featured
            </span>
          )}
        </div>

        {/* Save to Favorites Button */}
        <button
          type="button"
          aria-label={isSaved ? 'Remove from saved' : 'Save property'}
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave(property.id);
          }}
          className={`absolute top-3.5 right-3.5 p-2 rounded-full transition-all duration-200 cursor-pointer shadow-sm ${
            isSaved
              ? 'bg-rose-500 text-white scale-105'
              : 'bg-white/90 backdrop-blur-xs text-neutral-700 hover:bg-white hover:text-rose-500 hover:scale-105'
          }`}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>

        {/* Price Pill Floating on Bottom Left of Image */}
        <div className="absolute bottom-3 left-3 bg-neutral-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-white font-bold text-base shadow-sm">
          {property.formattedPrice}
        </div>
      </div>

      {/* Property Details Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title and Open Arrow */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-lg font-bold text-neutral-900 group-hover:text-[#16a34a] transition-colors line-clamp-1">
              {property.title}
            </h3>
            <div className="text-neutral-400 group-hover:text-neutral-900 transition-colors shrink-0">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-neutral-500 text-xs mb-4">
            <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <span className="truncate">{property.location}</span>
          </div>
        </div>

        {/* Property Specs (Beds, Baths, SqFt) */}
        <div className="pt-4 border-t border-neutral-100 grid grid-cols-3 gap-2 text-neutral-600 text-xs font-medium">
          <div className="flex items-center gap-1.5 justify-center py-1.5 px-2 bg-neutral-50 rounded-lg">
            <Bed className="w-3.5 h-3.5 text-neutral-400" />
            <span>{property.beds} Beds</span>
          </div>
          <div className="flex items-center gap-1.5 justify-center py-1.5 px-2 bg-neutral-50 rounded-lg">
            <Bath className="w-3.5 h-3.5 text-neutral-400" />
            <span>{property.baths} Baths</span>
          </div>
          <div className="flex items-center gap-1.5 justify-center py-1.5 px-2 bg-neutral-50 rounded-lg">
            <Square className="w-3.5 h-3.5 text-neutral-400" />
            <span>{property.sqft.toLocaleString()} sqft</span>
          </div>
        </div>
      </div>
    </div>
  );
};
