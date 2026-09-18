import React, { useState } from 'react';
import { 
  CalendarCheck, 
  Clock, 
  Phone, 
  Mail, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Video, 
  MapPin, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { TourBookingRecord } from '../../types';

interface AdminToursManagerProps {
  tours: TourBookingRecord[];
  onUpdateStatus: (id: string, status: 'confirmed' | 'completed' | 'cancelled' | 'rescheduled') => Promise<void>;
  onDeleteTour: (id: string) => Promise<void>;
}

export const AdminToursManager: React.FC<AdminToursManagerProps> = ({
  tours,
  onUpdateStatus,
  onDeleteTour
}) => {
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = tours.filter((t) => {
    const matchesFilter = filter === 'all' || t.status === filter;
    const matchesSearch = 
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.propertyTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-emerald-50 text-[#16a34a] border-emerald-200';
      case 'completed':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'rescheduled':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-neutral-100 text-neutral-600 border-neutral-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">
            Private Viewings & Showing Schedule
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Coordinate in-person private inspections and high-definition virtual walkthroughs with VIP buyers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 font-semibold text-xs border border-blue-200 flex items-center gap-1.5">
            <CalendarCheck className="w-4 h-4" />
            {tours.filter(t => t.status === 'confirmed').length} Upcoming Viewings
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-xs">
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto text-xs font-semibold">
          {[
            { key: 'all', label: `All (${tours.length})` },
            { key: 'confirmed', label: `Confirmed (${tours.filter(t => t.status === 'confirmed').length})` },
            { key: 'completed', label: `Completed (${tours.filter(t => t.status === 'completed').length})` },
            { key: 'cancelled', label: `Cancelled (${tours.filter(t => t.status === 'cancelled').length})` }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                filter === tab.key
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-64">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by buyer or property..."
            className="w-full px-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-[#22c55e]"
          />
        </div>
      </div>

      {/* Tour Cards Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-neutral-200/80 p-12 text-center">
          <CalendarCheck className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-neutral-800">No scheduled tours found</h3>
          <p className="text-xs text-neutral-500 mt-1">Bookings submitted via property pages will appear here in real-time.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((tour) => (
            <div
              key={tour.id}
              className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Top Row: Property & Status */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <span className="text-[10px] font-mono text-neutral-400 uppercase font-semibold">
                      Ref #{tour.id}
                    </span>
                    <h3 className="text-sm font-bold text-neutral-900 leading-tight">
                      {tour.propertyTitle}
                    </h3>
                  </div>

                  <select
                    value={tour.status}
                    onChange={(e) => onUpdateStatus(tour.id, e.target.value as any)}
                    className={`px-2.5 py-1 rounded-full border text-[11px] font-semibold cursor-pointer focus:outline-hidden ${getStatusColor(tour.status)}`}
                  >
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="rescheduled">Rescheduled</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Date & Time Slot */}
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 flex items-center justify-between text-xs mb-4">
                  <div className="flex items-center gap-2 text-neutral-800 font-semibold">
                    <Clock className="w-4 h-4 text-[#22c55e]" />
                    <span>{tour.date}</span>
                    <span>•</span>
                    <span>{tour.time}</span>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] font-medium text-neutral-600">
                    {tour.tourType.includes('Video') ? (
                      <span className="flex items-center gap-1 text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                        <Video className="w-3 h-3" /> Virtual
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <MapPin className="w-3 h-3" /> In-Person
                      </span>
                    )}
                  </div>
                </div>

                {/* Buyer Details */}
                <div className="space-y-2 text-xs text-neutral-600">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">Prospective Buyer:</span>
                    <span className="font-bold text-neutral-900">{tour.name}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">Email:</span>
                    <a href={`mailto:${tour.email}`} className="text-blue-600 hover:underline font-mono text-[11px]">
                      {tour.email}
                    </a>
                  </div>

                  {tour.phone && (
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-400">Phone:</span>
                      <a href={`tel:${tour.phone}`} className="text-neutral-800 font-medium">
                        {tour.phone}
                      </a>
                    </div>
                  )}

                  {tour.notes && (
                    <div className="mt-3 p-2.5 bg-amber-50/70 border border-amber-100 rounded-lg text-[11px] text-amber-900">
                      <strong className="block font-semibold mb-0.5 flex items-center gap-1">
                        <FileText className="w-3 h-3 text-amber-600" /> Buyer Request Note:
                      </strong>
                      {tour.notes}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-neutral-100">
                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${tour.phone}`}
                    className="p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold transition-colors flex items-center gap-1.5"
                    title="Direct Phone Call"
                  >
                    <Phone className="w-3.5 h-3.5 text-neutral-600" />
                    Call
                  </a>
                  <a
                    href={`mailto:${tour.email}?subject=Confirmation for Viewing: ${encodeURIComponent(tour.propertyTitle)}`}
                    className="p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold transition-colors flex items-center gap-1.5"
                    title="Send Email"
                  >
                    <Mail className="w-3.5 h-3.5 text-neutral-600" />
                    Email
                  </a>
                </div>

                <button
                  onClick={() => onDeleteTour(tour.id)}
                  className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                  title="Remove Tour Record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
