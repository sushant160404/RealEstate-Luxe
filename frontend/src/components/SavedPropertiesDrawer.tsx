import React from 'react';
import { Property } from '../types';
import { X, Trash2, ArrowRight, Heart, ExternalLink } from 'lucide-react';

interface SavedPropertiesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedProperties: Property[];
  onRemoveSave: (id: string) => void;
  onClearAll: () => void;
  onSelectProperty: (property: Property) => void;
}

export const SavedPropertiesDrawer: React.FC<SavedPropertiesDrawerProps> = ({
  isOpen,
  onClose,
  savedProperties,
  onRemoveSave,
  onClearAll,
  onSelectProperty,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end">
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
              <Heart className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900">Saved Properties</h3>
              <p className="text-xs text-neutral-500">
                {savedProperties.length} {savedProperties.length === 1 ? 'home' : 'homes'} bookmarked
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-900 rounded-full hover:bg-neutral-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body: List of Properties */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {savedProperties.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-400">
              <Heart className="w-12 h-12 stroke-[1.2] mb-3 text-neutral-300" />
              <p className="text-sm font-semibold text-neutral-800 mb-1">No saved homes yet</p>
              <p className="text-xs text-neutral-500 max-w-xs mb-6">
                Click the heart icon on any property card to save homes for quick comparison.
              </p>
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-full bg-neutral-900 text-white text-xs font-semibold"
              >
                Browse Listings
              </button>
            </div>
          ) : (
            savedProperties.map((prop) => (
              <div
                key={prop.id}
                className="bg-neutral-50 rounded-2xl p-3 border border-neutral-200/70 hover:border-neutral-300 transition-colors flex items-center gap-3.5 group cursor-pointer"
                onClick={() => {
                  onSelectProperty(prop);
                  onClose();
                }}
              >
                <img
                  src={prop.images[0]}
                  alt={prop.title}
                  className="w-20 h-20 rounded-xl object-cover shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#16a34a] bg-green-50 px-2 py-0.5 rounded-sm">
                      {prop.status}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveSave(prop.id);
                      }}
                      className="text-neutral-400 hover:text-rose-500 p-1"
                      title="Remove from saved"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h4 className="text-sm font-bold text-neutral-900 truncate mt-1 group-hover:text-[#16a34a] transition-colors">
                    {prop.title}
                  </h4>
                  <p className="text-xs text-neutral-500 truncate">{prop.location}</p>
                  <p className="text-sm font-extrabold text-neutral-900 mt-1">
                    {prop.formattedPrice}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        {savedProperties.length > 0 && (
          <div className="p-4 border-t border-neutral-100 flex items-center justify-between bg-neutral-50/50">
            <button
              onClick={onClearAll}
              className="text-xs font-semibold text-neutral-500 hover:text-rose-600 transition-colors cursor-pointer"
            >
              Clear all ({savedProperties.length})
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-full bg-[#22c55e] hover:bg-[#16a34a] text-white text-xs font-semibold shadow-xs"
            >
              Continue Browsing
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
