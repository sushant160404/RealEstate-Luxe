import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Star, 
  ExternalLink, 
  Eye, 
  Check, 
  AlertTriangle,
  Building,
  Bed,
  Bath,
  Maximize2
} from 'lucide-react';
import { Property, ListingStatus } from '../../types';

interface AdminPropertiesManagerProps {
  properties: Property[];
  onOpenAddModal: () => void;
  onOpenEditModal: (property: Property) => void;
  onDeleteProperty: (id: string) => Promise<void>;
  onToggleFeatured: (property: Property) => Promise<void>;
  onChangeStatus: (property: Property, newStatus: ListingStatus) => Promise<void>;
  onViewProperty: (property: Property) => void;
}

export const AdminPropertiesManager: React.FC<AdminPropertiesManagerProps> = ({
  properties,
  onOpenAddModal,
  onOpenEditModal,
  onDeleteProperty,
  onToggleFeatured,
  onChangeStatus,
  onViewProperty
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filtered properties
  const filtered = properties.filter((p) => {
    const matchesSearch = 
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.city.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || p.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesType = typeFilter === 'all' || p.type.toLowerCase() === typeFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesType;
  });

  const confirmDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      await onDeleteProperty(deletingId);
      setDeletingId(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusBadgeClass = (status: ListingStatus) => {
    switch (status) {
      case 'For Sale':
        return 'bg-emerald-50 text-[#16a34a] border-emerald-200';
      case 'For Rent':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Sold':
        return 'bg-neutral-100 text-neutral-600 border-neutral-300';
      default:
        return 'bg-neutral-50 text-neutral-600 border-neutral-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Search and New Property Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">
            Property Portfolio Inventory
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Manage listings, adjust INR valuations, toggle feature status, and update architectural specifications.
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#22c55e] hover:bg-[#16a34a] text-white text-sm font-semibold shadow-sm transition-all cursor-pointer active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add New Property
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Bar */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, micro-market, or city (e.g. Worli, Goa, Penthouse)..."
              className="w-full pl-9 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-[#22c55e] focus:bg-white"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2.5 text-xs text-neutral-400 hover:text-neutral-600 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-700 focus:outline-hidden focus:ring-2 focus:ring-[#22c55e] cursor-pointer"
            >
              <option value="all">All Architecture Types</option>
              <option value="villa">Villa / Estate</option>
              <option value="penthouse">Penthouse</option>
              <option value="apartment">Luxury Apartment</option>
              <option value="single family">Single Family</option>
            </select>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pt-2 border-t border-neutral-100 text-xs font-semibold">
          {[
            { key: 'all', label: `All (${properties.length})` },
            { key: 'for sale', label: `For Sale (${properties.filter(p => p.status === 'For Sale').length})` },
            { key: 'for rent', label: `For Rent (${properties.filter(p => p.status === 'For Rent').length})` },
            { key: 'pending', label: `Pending (${properties.filter(p => p.status === 'Pending').length})` },
            { key: 'sold', label: `Sold (${properties.filter(p => p.status === 'Sold').length})` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer shrink-0 ${
                statusFilter === tab.key
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Properties Table / Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-neutral-200/80 p-12 text-center">
          <Building className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-neutral-800">No properties match your filter</h3>
          <p className="text-xs text-neutral-500 mt-1">Try resetting your search query or status filter.</p>
          <button
            onClick={() => { setSearchTerm(''); setStatusFilter('all'); setTypeFilter('all'); }}
            className="mt-4 px-4 py-2 rounded-xl bg-neutral-100 text-neutral-700 text-xs font-semibold hover:bg-neutral-200 transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-neutral-200/80 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50/80 border-b border-neutral-200/80 text-neutral-600 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Estate & Micro-Market</th>
                  <th className="py-3.5 px-4">Valuation (INR)</th>
                  <th className="py-3.5 px-4">Type & Specs</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-center">Hero Star</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filtered.map((prop) => (
                  <tr key={prop.id} className="hover:bg-neutral-50/60 transition-colors">
                    {/* Estate info */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={prop.images[0]}
                          alt={prop.title}
                          className="w-16 h-12 rounded-lg object-cover border border-neutral-200 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-[180px]">
                          <div className="font-bold text-neutral-900 text-sm hover:text-[#22c55e] transition-colors cursor-pointer line-clamp-1"
                            onClick={() => onViewProperty(prop)}
                          >
                            {prop.title}
                          </div>
                          <div className="text-[11px] text-neutral-500 line-clamp-1">
                            {prop.location}
                          </div>
                          <div className="text-[10px] text-neutral-400 font-mono mt-0.5">
                            ID: {prop.id} • Built {prop.yearBuilt}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Price in INR */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-bold text-neutral-900 text-sm text-[#22c55e]">
                        {prop.formattedPrice}
                      </div>
                      <div className="text-[10px] text-neutral-400 font-mono">
                        ₹{prop.price.toLocaleString('en-IN')}
                      </div>
                    </td>

                    {/* Specs */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-semibold text-neutral-800">
                        {prop.type}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-neutral-500 mt-0.5">
                        <span className="flex items-center gap-0.5"><Bed className="w-3 h-3" /> {prop.beds}</span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5"><Bath className="w-3 h-3" /> {prop.baths}</span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5"><Maximize2 className="w-3 h-3" /> {prop.sqft.toLocaleString()} sqft</span>
                      </div>
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <select
                        value={prop.status}
                        onChange={(e) => onChangeStatus(prop, e.target.value as ListingStatus)}
                        className={`px-2.5 py-1 rounded-full border text-[11px] font-semibold cursor-pointer focus:outline-hidden ${getStatusBadgeClass(prop.status)}`}
                      >
                        <option value="For Sale">For Sale</option>
                        <option value="For Rent">For Rent</option>
                        <option value="Pending">Pending</option>
                        <option value="Sold">Sold</option>
                      </select>
                    </td>

                    {/* Featured Toggle */}
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <button
                        onClick={() => onToggleFeatured(prop)}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          prop.isFeatured
                            ? 'text-amber-500 bg-amber-50 hover:bg-amber-100'
                            : 'text-neutral-300 hover:text-amber-400 hover:bg-neutral-100'
                        }`}
                        title={prop.isFeatured ? 'Featured on Hero (Click to toggle)' : 'Mark as Featured'}
                      >
                        <Star className={`w-4 h-4 ${prop.isFeatured ? 'fill-amber-400' : ''}`} />
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onViewProperty(prop)}
                          className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
                          title="Preview Listing"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onOpenEditModal(prop)}
                          className="p-1.5 rounded-lg text-neutral-600 hover:text-[#22c55e] hover:bg-emerald-50 transition-colors cursor-pointer"
                          title="Edit Listing"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setDeletingId(prop.id)}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Delete Listing"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-neutral-200">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900">Delete Property Listing?</h3>
            <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
              Are you sure you want to remove this property from the LuxeLiving portfolio? This listing will be immediately delisted from the website and backend database.
            </p>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setDeletingId(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-xs cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
