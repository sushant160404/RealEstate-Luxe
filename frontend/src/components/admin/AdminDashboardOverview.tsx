import React from 'react';
import { 
  Building2, 
  CalendarCheck, 
  MessageSquareText, 
  Mail, 
  TrendingUp, 
  Plus, 
  ArrowUpRight, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Sparkles,
  ShieldCheck,
  Send,
  Radio
} from 'lucide-react';
import { Property, TourBookingRecord, InquiryLead, AdminStats } from '../../types';

interface AdminDashboardOverviewProps {
  stats: AdminStats | null;
  properties: Property[];
  tours: TourBookingRecord[];
  inquiries: InquiryLead[];
  subscribersCount: number;
  onNavigateTab: (tab: 'properties' | 'tours' | 'inquiries' | 'subscribers' | 'settings' | 'whatsapp') => void;
  onOpenAddProperty: () => void;
}

export const AdminDashboardOverview: React.FC<AdminDashboardOverviewProps> = ({
  stats,
  properties,
  tours,
  inquiries,
  subscribersCount,
  onNavigateTab,
  onOpenAddProperty
}) => {
  // Aggregate stats
  const totalValue = properties.reduce((acc, p) => acc + (p.status !== 'For Rent' ? p.price : 0), 0);
  const activeCount = properties.filter((p) => p.status !== 'Sold').length;
  const pendingInquiriesCount = inquiries.filter((i) => i.status === 'pending').length;
  const upcomingToursCount = tours.filter((t) => t.status === 'confirmed').length;

  const formattedTotalValue = () => {
    if (totalValue >= 10000000) {
      const cr = totalValue / 10000000;
      return `₹${cr % 1 === 0 ? cr : cr.toFixed(2)} Cr`;
    }
    return `₹${totalValue.toLocaleString('en-IN')}`;
  };

  // City breakdown
  const cityCounts = properties.reduce((acc, p) => {
    const city = p.city || 'Other';
    acc[city] = (acc[city] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-8">
      {/* Top Banner with Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-neutral-900 to-neutral-800 p-6 rounded-2xl text-white shadow-lg">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-ping" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#22c55e]">
              Executive Management System
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">
            LuxeLiving Portfolio Command Center
          </h2>
          <p className="text-neutral-400 text-sm mt-1">
            Monitoring active luxury residential assets, scheduled client viewings, and incoming advisory mandates.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigateTab('whatsapp')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/40 text-sm font-semibold transition-all cursor-pointer active:scale-95"
          >
            <Send className="w-4 h-4 text-emerald-400" />
            <span>WhatsApp Broadcast</span>
          </button>
          <button
            onClick={onOpenAddProperty}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#22c55e] hover:bg-[#16a34a] text-white text-sm font-semibold shadow-md transition-all cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Add Property
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Portfolio Value */}
        <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Total Portfolio Value
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-neutral-900 tracking-tight">
            {stats?.formattedInventoryValue || formattedTotalValue()}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-neutral-500">
            <span className="text-[#22c55e] font-semibold">{properties.length} Estates</span>
            <span>across premier Indian enclaves</span>
          </div>
        </div>

        {/* Card 2: Active Properties */}
        <div 
          onClick={() => onNavigateTab('properties')}
          className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-xs hover:shadow-md hover:border-[#22c55e]/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Active Listings
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#22c55e] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-neutral-900 tracking-tight">
            {activeCount}
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-neutral-500">
            <span>{properties.filter(p => p.isFeatured).length} Featured on Hero</span>
            <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-[#22c55e] transition-colors" />
          </div>
        </div>

        {/* Card 3: Tour Bookings */}
        <div 
          onClick={() => onNavigateTab('tours')}
          className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Private Tour Bookings
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-neutral-900 tracking-tight">
            {tours.length}
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-neutral-500">
            <span className="text-blue-600 font-semibold">{upcomingToursCount} Confirmed upcoming</span>
            <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-blue-600 transition-colors" />
          </div>
        </div>

        {/* Card 4: Consultations & Inquiries */}
        <div 
          onClick={() => onNavigateTab('inquiries')}
          className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-xs hover:shadow-md hover:border-purple-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Client Inquiries & Leads
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <MessageSquareText className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-neutral-900 tracking-tight">
            {inquiries.length}
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-neutral-500">
            <span className="text-purple-600 font-semibold">{pendingInquiriesCount} Pending review</span>
            <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-purple-600 transition-colors" />
          </div>
        </div>
      </div>

      {/* Two Column Layout: Geographic Breakdown & Recent Action Items */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Geographic Portfolio Distribution */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-neutral-200/80 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-neutral-900">Regional Footprint & Inventory</h3>
              <p className="text-xs text-neutral-500 mt-0.5">Properties distributed across primary metropolitan hubs</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-neutral-100 text-neutral-700 text-xs font-semibold">
              {Object.keys(cityCounts).length} Micro-Markets
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
            {Object.entries(cityCounts).map(([city, count]) => (
              <div key={city} className="p-4 rounded-xl bg-neutral-50 border border-neutral-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white border border-neutral-200 flex items-center justify-center text-neutral-700 font-bold text-sm shadow-xs">
                  {count}
                </div>
                <div>
                  <div className="text-sm font-bold text-neutral-900">{city}</div>
                  <div className="text-[11px] text-neutral-500">
                    {count === 1 ? '1 Estate' : `${count} Estates`}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Property Preview Strip */}
          <div className="border-t border-neutral-100 pt-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
                Featured Flagships
              </span>
              <button
                onClick={() => onNavigateTab('properties')}
                className="text-xs font-semibold text-[#22c55e] hover:underline cursor-pointer"
              >
                Manage all {properties.length} properties →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {properties.slice(0, 4).map((prop) => (
                <div 
                  key={prop.id}
                  className="flex items-center gap-3 p-2.5 rounded-xl border border-neutral-100 hover:border-neutral-300 transition-colors"
                >
                  <img
                    src={prop.images[0]}
                    alt={prop.title}
                    className="w-14 h-14 rounded-lg object-cover shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-neutral-900 truncate">{prop.title}</h4>
                    <p className="text-[11px] text-neutral-500 truncate">{prop.location}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-bold text-[#22c55e]">{prop.formattedPrice}</span>
                      <span className="text-[10px] px-1.5 py-0.2 bg-neutral-100 rounded text-neutral-600 font-medium">
                        {prop.type}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Urgent Inquiries & Scheduled Tours */}
        <div className="space-y-6">
          {/* Upcoming Tours Card */}
          <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                <CalendarCheck className="w-4 h-4 text-blue-600" />
                Next Viewings
              </h3>
              <button
                onClick={() => onNavigateTab('tours')}
                className="text-[11px] font-semibold text-blue-600 hover:underline cursor-pointer"
              >
                View all ({tours.length})
              </button>
            </div>

            {tours.length === 0 ? (
              <p className="text-xs text-neutral-400 py-4 text-center">No tours scheduled yet.</p>
            ) : (
              <div className="space-y-3">
                {tours.slice(0, 3).map((tour) => (
                  <div key={tour.id} className="p-3 rounded-xl bg-neutral-50 border border-neutral-100 text-xs">
                    <div className="flex items-center justify-between font-bold text-neutral-900 mb-1">
                      <span className="truncate pr-2">{tour.propertyTitle}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 shrink-0">
                        {tour.status}
                      </span>
                    </div>
                    <div className="text-neutral-600 flex items-center gap-2 text-[11px]">
                      <span>Buyer: <strong>{tour.name}</strong></span>
                      <span>•</span>
                      <span>{tour.tourType}</span>
                    </div>
                    <div className="text-neutral-400 flex items-center gap-1 mt-1 text-[11px]">
                      <Clock className="w-3 h-3" />
                      <span>{tour.date} at {tour.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pending Inquiries Card */}
          <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                <MessageSquareText className="w-4 h-4 text-purple-600" />
                Latest Inquiries
              </h3>
              <button
                onClick={() => onNavigateTab('inquiries')}
                className="text-[11px] font-semibold text-purple-600 hover:underline cursor-pointer"
              >
                View leads ({inquiries.length})
              </button>
            </div>

            {inquiries.length === 0 ? (
              <p className="text-xs text-neutral-400 py-4 text-center">No inquiries received yet.</p>
            ) : (
              <div className="space-y-3">
                {inquiries.slice(0, 3).map((inq) => (
                  <div key={inq.id} className="p-3 rounded-xl bg-neutral-50 border border-neutral-100 text-xs">
                    <div className="flex items-center justify-between font-bold text-neutral-900 mb-0.5">
                      <span>{inq.name}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        inq.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-neutral-100 text-neutral-700'
                      }`}>
                        {inq.status}
                      </span>
                    </div>
                    <p className="text-neutral-500 text-[11px] line-clamp-1">{inq.message}</p>
                    <div className="flex items-center justify-between text-[10px] text-neutral-400 mt-1.5 pt-1.5 border-t border-neutral-200/50">
                      <span>{inq.preferredLocation || 'India Prime'}</span>
                      <span>Budget: {inq.budgetRange || 'Flexible'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
