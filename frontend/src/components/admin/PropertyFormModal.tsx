import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Image as ImageIcon, Sparkles, AlertCircle } from 'lucide-react';
import { Property, ListingStatus } from '../../types';

interface PropertyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Property>) => Promise<boolean>;
  propertyToEdit?: Property | null;
}

const PROPERTY_TYPES = ['Single Family', 'Villa', 'Apartment', 'Penthouse', 'Townhouse'] as const;
const STATUS_OPTIONS: ListingStatus[] = ['For Sale', 'For Rent', 'Pending', 'Sold'];

export const PropertyFormModal: React.FC<PropertyFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  propertyToEdit
}) => {
  const isEditing = Boolean(propertyToEdit);

  const [title, setTitle] = useState('');
  const [type, setType] = useState<'Single Family' | 'Villa' | 'Apartment' | 'Penthouse' | 'Townhouse'>('Villa');
  const [status, setStatus] = useState<ListingStatus>('For Sale');
  const [price, setPrice] = useState<number>(50000000);
  const [location, setLocation] = useState('');
  const [city, setCity] = useState('Mumbai');
  const [state, setState] = useState('MH');
  const [zip, setZip] = useState('400001');
  const [beds, setBeds] = useState(4);
  const [baths, setBaths] = useState(4.5);
  const [sqft, setSqft] = useState(4000);
  const [yearBuilt, setYearBuilt] = useState(2023);
  const [description, setDescription] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [hoaMonthly, setHoaMonthly] = useState(15000);
  const [propertyTaxAnnual, setPropertyTaxAnnual] = useState(120000);

  // Features list
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeatureInput, setNewFeatureInput] = useState('');

  // Images list
  const [images, setImages] = useState<string[]>([]);
  const [newImageInput, setNewImageInput] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (propertyToEdit) {
      setTitle(propertyToEdit.title || '');
      setType(propertyToEdit.type || 'Villa');
      setStatus(propertyToEdit.status || 'For Sale');
      setPrice(propertyToEdit.price || 50000000);
      setLocation(propertyToEdit.location || '');
      setCity(propertyToEdit.city || 'Mumbai');
      setState(propertyToEdit.state || 'MH');
      setZip(propertyToEdit.zip || '400001');
      setBeds(propertyToEdit.beds || 4);
      setBaths(propertyToEdit.baths || 4);
      setSqft(propertyToEdit.sqft || 3500);
      setYearBuilt(propertyToEdit.yearBuilt || 2023);
      setDescription(propertyToEdit.description || '');
      setIsFeatured(Boolean(propertyToEdit.isFeatured));
      setHoaMonthly(propertyToEdit.hoaMonthly || 0);
      setPropertyTaxAnnual(propertyToEdit.propertyTaxAnnual || 0);
      setFeatures(propertyToEdit.features ? [...propertyToEdit.features] : []);
      setImages(propertyToEdit.images ? [...propertyToEdit.images] : []);
    } else {
      // Defaults for new luxury listing
      setTitle('');
      setType('Villa');
      setStatus('For Sale');
      setPrice(65000000);
      setLocation('Pali Hill, Bandra West, Mumbai, Maharashtra');
      setCity('Mumbai');
      setState('MH');
      setZip('400050');
      setBeds(4);
      setBaths(4.5);
      setSqft(4200);
      setYearBuilt(2023);
      setDescription('An extraordinary private architectural sanctuary offering unparalleled privacy, imported natural stone finishes, and sweeping city views.');
      setIsFeatured(true);
      setHoaMonthly(18000);
      setPropertyTaxAnnual(140000);
      setFeatures([
        'Imported Italian Statuario Marble Floors',
        'Direct High-Speed Private Elevator Access',
        'Private Saltwater Plunge Pool & Deck',
        'Lutron Touch Smart Home Automation',
        'Poggenpohl Custom Culinary Suite'
      ]);
      setImages([
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
      ]);
    }
    setErrorMessage('');
  }, [propertyToEdit, isOpen]);

  if (!isOpen) return null;

  const handleAddFeature = () => {
    if (newFeatureInput.trim()) {
      setFeatures([...features, newFeatureInput.trim()]);
      setNewFeatureInput('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleAddImage = () => {
    if (newImageInput.trim()) {
      setImages([...images, newImageInput.trim()]);
      setNewImageInput('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const formattedPricePreview = () => {
    if (status === 'For Rent') {
      return `₹${price.toLocaleString('en-IN')}/mo`;
    }
    if (price >= 10000000) {
      const cr = price / 10000000;
      return `₹${cr % 1 === 0 ? cr : cr.toFixed(2)} Cr`;
    }
    if (price >= 100000) {
      const l = price / 100000;
      return `₹${l % 1 === 0 ? l : l.toFixed(2)} L`;
    }
    return `₹${price.toLocaleString('en-IN')}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!title.trim() || !location.trim()) {
      setErrorMessage('Please provide a property title and location.');
      return;
    }

    if (price <= 0) {
      setErrorMessage('Please enter a valid price.');
      return;
    }

    if (images.length === 0) {
      setErrorMessage('Please include at least one property image.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: Partial<Property> = {
        title: title.trim(),
        type,
        status,
        price: Number(price),
        formattedPrice: formattedPricePreview(),
        location: location.trim(),
        city: city.trim(),
        state: state.trim(),
        zip: zip.trim(),
        beds: Number(beds),
        baths: Number(baths),
        sqft: Number(sqft),
        yearBuilt: Number(yearBuilt),
        description: description.trim(),
        isFeatured,
        hoaMonthly: Number(hoaMonthly),
        propertyTaxAnnual: Number(propertyTaxAnnual),
        features,
        images
      };

      const success = await onSubmit(payload);
      if (success) {
        onClose();
      } else {
        setErrorMessage('Failed to save property. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 bg-neutral-50/50">
          <div>
            <span className="text-xs font-semibold text-[#22c55e] uppercase tracking-wider">
              {isEditing ? 'Property Management' : 'Exclusive Portfolio'}
            </span>
            <h2 className="text-xl font-bold text-neutral-900">
              {isEditing ? `Edit Listing: ${propertyToEdit?.title}` : 'Add New Luxury Property'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Section 1: Basic Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider text-xs border-b border-neutral-100 pb-2">
              1. Title & Listing Classification
            </h3>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Property Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Greenwood Heritage Bungalow"
                required
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-[#22c55e] focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Property Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-[#22c55e] focus:bg-white"
                >
                  {PROPERTY_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Listing Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ListingStatus)}
                  className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-[#22c55e] focus:bg-white"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Price (₹ INR) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-neutral-500 font-semibold text-sm">₹</span>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    min={100000}
                    step={50000}
                    required
                    className="w-full pl-7 pr-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-[#22c55e] focus:bg-white font-medium"
                  />
                </div>
                <span className="text-[11px] text-[#22c55e] font-semibold mt-1 block">
                  Formatted: {formattedPricePreview()}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#22c55e]"></div>
                <span className="ml-3 text-xs font-medium text-neutral-700 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Feature on Homepage Hero & Showcase
                </span>
              </label>
            </div>
          </div>

          {/* Section 2: Location & Address */}
          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider text-xs border-b border-neutral-100 pb-2">
              2. Prime Location Details
            </h3>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Full Address / Landmark *
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. DLF Phase 5, Golf Course Road, Gurgaon, Haryana"
                required
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-[#22c55e] focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Mumbai, Gurgaon, Pune, Goa"
                  required
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-[#22c55e]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">State Code</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="e.g. MH, HR, GA, TS"
                  required
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-[#22c55e]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">PIN / Zip Code</label>
                <input
                  type="text"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  placeholder="e.g. 400020"
                  required
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-[#22c55e]"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Architecture & Specifications */}
          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider text-xs border-b border-neutral-100 pb-2">
              3. Specifications & Dimensions
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Bedrooms</label>
                <input
                  type="number"
                  value={beds}
                  onChange={(e) => setBeds(Number(e.target.value))}
                  min={1}
                  max={20}
                  required
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-[#22c55e]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Bathrooms</label>
                <input
                  type="number"
                  value={baths}
                  onChange={(e) => setBaths(Number(e.target.value))}
                  min={1}
                  max={20}
                  step={0.5}
                  required
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-[#22c55e]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Carpet/Built (sq ft)</label>
                <input
                  type="number"
                  value={sqft}
                  onChange={(e) => setSqft(Number(e.target.value))}
                  min={300}
                  step={50}
                  required
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-[#22c55e]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Year Built</label>
                <input
                  type="number"
                  value={yearBuilt}
                  onChange={(e) => setYearBuilt(Number(e.target.value))}
                  min={1900}
                  max={2030}
                  required
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-[#22c55e]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Monthly Maintenance / HOA (₹)
                </label>
                <input
                  type="number"
                  value={hoaMonthly}
                  onChange={(e) => setHoaMonthly(Number(e.target.value))}
                  min={0}
                  step={500}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-[#22c55e]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Annual Municipal Tax (₹)
                </label>
                <input
                  type="number"
                  value={propertyTaxAnnual}
                  onChange={(e) => setPropertyTaxAnnual(Number(e.target.value))}
                  min={0}
                  step={1000}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-[#22c55e]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Property Architectural Narrative & Description *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Highlight design elements, materials, landscape, privacy, and unique amenities..."
                required
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-[#22c55e] focus:bg-white leading-relaxed"
              />
            </div>
          </div>

          {/* Section 4: Key Luxury Features */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider text-xs border-b border-neutral-100 pb-2">
              4. Bespoke Amenities & Features
            </h3>

            <div className="flex gap-2">
              <input
                type="text"
                value={newFeatureInput}
                onChange={(e) => setNewFeatureInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddFeature();
                  }
                }}
                placeholder="Add luxury feature (e.g. 'Private Schindler High-Speed Elevator')"
                className="flex-1 px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-[#22c55e]"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-4 py-2 bg-neutral-900 text-white rounded-xl text-xs font-semibold hover:bg-neutral-800 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {features.map((feat, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-100 border border-neutral-200 text-xs font-medium text-neutral-800"
                >
                  {feat}
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(idx)}
                    className="text-neutral-400 hover:text-red-500 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Section 5: Gallery Images */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider text-xs border-b border-neutral-100 pb-2">
              5. High-Resolution Gallery Photography
            </h3>

            <div className="flex gap-2">
              <input
                type="url"
                value={newImageInput}
                onChange={(e) => setNewImageInput(e.target.value)}
                placeholder="Paste high-res image URL (e.g. Unsplash URL)"
                className="flex-1 px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-[#22c55e]"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="px-4 py-2 bg-neutral-900 text-white rounded-xl text-xs font-semibold hover:bg-neutral-800 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ImageIcon className="w-4 h-4" />
                Add Photo
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              {images.map((imgUrl, idx) => (
                <div
                  key={idx}
                  className="relative group rounded-xl overflow-hidden border border-neutral-200 aspect-video bg-neutral-100"
                >
                  <img
                    src={imgUrl}
                    alt={`Property view ${idx + 1}`}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between p-2">
                    <span className="text-[10px] font-semibold text-white bg-black/50 px-2 py-0.5 rounded">
                      {idx === 0 ? 'Cover Photo' : `#${idx + 1}`}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="p-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
                      title="Remove image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Modal Footer Controls */}
          <div className="pt-4 border-t border-neutral-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-neutral-200 text-neutral-700 text-sm font-semibold hover:bg-neutral-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-[#22c55e] hover:bg-[#16a34a] text-white text-sm font-semibold shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting
                ? 'Saving Listing...'
                : isEditing
                ? 'Update Luxury Listing'
                : 'Publish New Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
