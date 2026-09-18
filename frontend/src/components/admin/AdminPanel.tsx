import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  CalendarCheck, 
  MessageSquareText, 
  Users, 
  UserCheck, 
  ArrowLeft, 
  Plus, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle,
  Home,
  RefreshCw,
  Sparkles,
  LogOut,
  ShieldCheck,
  Send,
  Radio
} from 'lucide-react';
import { Property, TourBookingRecord, InquiryLead, AdminStats, AgentInfo, ListingStatus, AdminUser } from '../../types';
import { api } from '../../services/api';
import { AdminDashboardOverview } from './AdminDashboardOverview';
import { AdminPropertiesManager } from './AdminPropertiesManager';
import { PropertyFormModal } from './PropertyFormModal';
import { AdminToursManager } from './AdminToursManager';
import { AdminInquiriesManager } from './AdminInquiriesManager';
import { AdminSubscribersManager } from './AdminSubscribersManager';
import { AdminWhatsAppManager } from './AdminWhatsAppManager';
import { AdminAgentSettings } from './AdminAgentSettings';
import { AdminLogoutModal } from './AdminLogoutModal';

type AdminTab = 'overview' | 'properties' | 'tours' | 'inquiries' | 'subscribers' | 'whatsapp' | 'settings';

interface AdminPanelProps {
  onClose: () => void;
  properties: Property[];
  onPropertiesChange: (properties: Property[]) => void;
  agent: AgentInfo;
  onAgentChange: (agent: AgentInfo) => void;
  onSelectPropertyForPreview: (property: Property) => void;
  adminUser?: AdminUser | null;
  onLogout?: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  onClose,
  properties,
  onPropertiesChange,
  agent,
  onAgentChange,
  onSelectPropertyForPreview,
  adminUser,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [tours, setTours] = useState<TourBookingRecord[]>([]);
  const [inquiries, setInquiries] = useState<InquiryLead[]>([]);
  const [subscribers, setSubscribers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Fallback admin info if not provided
  const effectiveAdminUser: AdminUser = adminUser || {
    id: 'adm-01',
    name: 'Priya Sharma',
    email: 'admin@luxeliving.in',
    role: 'Managing Principal & Superadmin',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80'
  };

  // Property modal state
  const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false);
  const [propertyToEdit, setPropertyToEdit] = useState<Property | null>(null);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ type, text });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Load all admin data
  const loadAdminData = async () => {
    setIsLoading(true);
    try {
      const [statsData, toursData, inqData, subsData] = await Promise.all([
        api.getAdminStats(),
        api.getTours(),
        api.getInquiries(),
        api.getNewsletterSubscribers()
      ]);

      if (statsData) setStats(statsData);
      if (toursData) setTours(toursData);
      if (inqData) setInquiries(inqData);
      if (subsData) setSubscribers(subsData);
    } catch (err) {
      console.warn('Error loading admin records:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  // Property Operations
  const handleCreateOrUpdateProperty = async (data: Partial<Property>): Promise<boolean> => {
    if (propertyToEdit) {
      // Update
      const res = await api.updateProperty(propertyToEdit.id, data);
      if (res.success && res.data) {
        const updatedList = properties.map((p) => (p.id === propertyToEdit.id ? res.data! : p));
        onPropertiesChange(updatedList);
        showToast(`Listing "${res.data.title}" updated successfully!`);
        return true;
      } else {
        // Fallback local update
        const updated: Property = {
          ...propertyToEdit,
          ...data,
          id: propertyToEdit.id
        } as Property;
        const updatedList = properties.map((p) => (p.id === propertyToEdit.id ? updated : p));
        onPropertiesChange(updatedList);
        showToast(`Listing "${updated.title}" updated!`);
        return true;
      }
    } else {
      // Create new
      const res = await api.createProperty(data);
      if (res.success && res.data) {
        onPropertiesChange([res.data, ...properties]);
        showToast(`New listing "${res.data.title}" published!`);
        return true;
      } else {
        // Fallback local create
        const newLocal: Property = {
          id: `prop-${Date.now().toString().slice(-4)}`,
          slug: (data.title || 'estate').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          title: data.title || 'New Luxury Listing',
          price: data.price || 50000000,
          formattedPrice: data.formattedPrice || '₹5.00 Cr',
          type: data.type || 'Villa',
          status: data.status || 'For Sale',
          location: data.location || 'Bandra West, Mumbai',
          city: data.city || 'Mumbai',
          state: data.state || 'MH',
          zip: data.zip || '400050',
          beds: data.beds || 4,
          baths: data.baths || 4,
          sqft: data.sqft || 3500,
          yearBuilt: data.yearBuilt || 2023,
          description: data.description || '',
          features: data.features || [],
          images: data.images || ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'],
          isFeatured: data.isFeatured,
          hoaMonthly: data.hoaMonthly,
          propertyTaxAnnual: data.propertyTaxAnnual
        };
        onPropertiesChange([newLocal, ...properties]);
        showToast(`New listing "${newLocal.title}" added to portfolio!`);
        return true;
      }
    }
  };

  const handleDeleteProperty = async (id: string) => {
    const res = await api.deleteProperty(id);
    const updated = properties.filter((p) => p.id !== id);
    onPropertiesChange(updated);
    showToast('Listing removed from LuxeLiving portfolio.');
  };

  const handleToggleFeatured = async (prop: Property) => {
    const newFeatured = !prop.isFeatured;
    const res = await api.updateProperty(prop.id, { isFeatured: newFeatured });
    const updatedList = properties.map((p) =>
      p.id === prop.id ? { ...p, isFeatured: newFeatured } : p
    );
    onPropertiesChange(updatedList);
    showToast(
      newFeatured
        ? `"${prop.title}" marked as Featured on Hero!`
        : `"${prop.title}" unfeatured from Hero showcase.`
    );
  };

  const handleChangeStatus = async (prop: Property, newStatus: ListingStatus) => {
    const res = await api.updateProperty(prop.id, { status: newStatus });
    const updatedList = properties.map((p) =>
      p.id === prop.id ? { ...p, status: newStatus } : p
    );
    onPropertiesChange(updatedList);
    showToast(`Status updated to ${newStatus} for "${prop.title}".`);
  };

  // Tour Operations
  const handleUpdateTourStatus = async (
    id: string,
    status: 'confirmed' | 'completed' | 'cancelled' | 'rescheduled'
  ) => {
    await api.updateTour(id, { status });
    setTours((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status } : t))
    );
    showToast(`Showing status updated to "${status}".`);
  };

  const handleDeleteTour = async (id: string) => {
    await api.deleteTour(id);
    setTours((prev) => prev.filter((t) => t.id !== id));
    showToast('Viewing appointment record removed.');
  };

  // Inquiry Operations
  const handleUpdateInquiryStatus = async (
    id: string,
    status: 'pending' | 'contacted' | 'negotiating' | 'closed',
    notes?: string
  ) => {
    await api.updateInquiry(id, { status, notes });
    setInquiries((prev) =>
      prev.map((inq) => (inq.id === id ? { ...inq, status, notes } : inq))
    );
    showToast(`Inquiry lead status updated to "${status}".`);
  };

  const handleDeleteInquiry = async (id: string) => {
    await api.deleteInquiry(id);
    setInquiries((prev) => prev.filter((inq) => inq.id !== id));
    showToast('Lead record removed.');
  };

  // Subscriber Operations
  const handleDeleteSubscriber = async (email: string) => {
    await api.deleteNewsletterSubscriber(email);
    setSubscribers((prev) => prev.filter((e) => e !== email));
    showToast(`Removed ${email} from subscriber list.`);
  };

  // Agent profile update
  const handleSaveAgent = async (updated: Partial<AgentInfo>): Promise<boolean> => {
    const res = await api.updateAgent(updated);
    if (res.success && res.data) {
      onAgentChange(res.data);
      showToast('Advisor profile updated successfully!');
      return true;
    } else {
      onAgentChange({ ...agent, ...updated });
      showToast('Advisor profile updated!');
      return true;
    }
  };

  // Admin Logout Handler
  const handleConfirmLogout = async () => {
    setIsLogoutModalOpen(false);
    try {
      await api.adminLogout(effectiveAdminUser.token);
    } catch {
      // ignore
    }
    if (onLogout) {
      onLogout();
    } else {
      showToast('Signed out of executive session.');
      onClose();
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className={`px-4 py-3 rounded-2xl shadow-xl border flex items-center gap-2.5 text-xs font-semibold ${
            toastMessage.type === 'success'
              ? 'bg-neutral-900 text-white border-neutral-700'
              : 'bg-red-600 text-white border-red-700'
          }`}>
            <CheckCircle2 className="w-4 h-4 text-[#22c55e]" />
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white border-b border-neutral-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-neutral-200 text-neutral-700 text-xs font-semibold hover:bg-neutral-50 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to</span> Live Site
          </button>

          <div className="h-4 w-px bg-neutral-200 hidden sm:block" />

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              <span className="text-[#22c55e]">L</span>L
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-neutral-900 tracking-tight">
                  LuxeLiving <span className="text-[#22c55e]">Admin</span>
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  Live Sync
                </span>
              </div>
              <p className="text-[10px] text-neutral-500 font-mono hidden sm:block">
                Backend: Express + Laravel 11 REST
              </p>
            </div>
          </div>
        </div>

        {/* Right Nav Action */}
        <div className="flex items-center gap-2.5">
          {/* Admin User Profile Pill */}
          <div className="hidden lg:flex items-center gap-2.5 pl-2.5 pr-3 py-1.5 rounded-xl bg-neutral-100/90 border border-neutral-200 text-xs">
            {effectiveAdminUser.avatar ? (
              <img
                src={effectiveAdminUser.avatar}
                alt={effectiveAdminUser.name}
                className="w-5 h-5 rounded-full object-cover border border-neutral-300"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-[10px]">
                {effectiveAdminUser.name.slice(0, 1)}
              </div>
            )}
            <div className="text-left">
              <p className="font-semibold text-neutral-900 leading-none text-[11px]">{effectiveAdminUser.name}</p>
              <p className="text-[9px] text-neutral-500 leading-none mt-0.5">{effectiveAdminUser.role.split('&')[0].trim()}</p>
            </div>
          </div>

          <button
            onClick={loadAdminData}
            disabled={isLoading}
            className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-colors cursor-pointer"
            title="Refresh Records"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#22c55e]' : ''}`} />
          </button>

          <button
            onClick={() => {
              setPropertyToEdit(null);
              setIsPropertyModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#22c55e] hover:bg-[#16a34a] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add</span> Property
          </button>

          {/* Top Bar Log Out Button */}
          <button
            id="admin-header-logout-btn"
            onClick={() => setIsLogoutModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-200 bg-red-50/70 hover:bg-red-100 text-red-700 text-xs font-semibold transition-all cursor-pointer active:scale-95 group shadow-xs"
            title="Sign Out of Admin Console"
          >
            <LogOut className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
            <span className="hidden md:inline">Log Out</span>
          </button>
        </div>
      </header>

      {/* Main Admin Workspace with Sidebar & Content */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 gap-6">
        {/* Left Sidebar Tabs */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-white rounded-2xl border border-neutral-200/80 p-3 shadow-xs space-y-1 sticky top-20">
            <div className="px-3 py-2 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
              Management Portal
            </div>

            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4 text-neutral-400" />
                <span>Command Center</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('properties')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'properties'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Building2 className="w-4 h-4 text-neutral-400" />
                <span>Properties</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-neutral-100 text-neutral-700 font-bold group-hover:bg-neutral-200">
                {properties.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('tours')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'tours'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <CalendarCheck className="w-4 h-4 text-neutral-400" />
                <span>Private Tours</span>
              </div>
              {tours.filter(t => t.status === 'confirmed').length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-blue-100 text-blue-800 font-bold">
                  {tours.filter(t => t.status === 'confirmed').length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('inquiries')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'inquiries'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <MessageSquareText className="w-4 h-4 text-neutral-400" />
                <span>Consultations</span>
              </div>
              {inquiries.filter(i => i.status === 'pending').length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-100 text-purple-800 font-bold">
                  {inquiries.filter(i => i.status === 'pending').length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('subscribers')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'subscribers'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-neutral-400" />
                <span>VIP Subscribers</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-neutral-100 text-neutral-700 font-bold">
                {subscribers.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('whatsapp')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'whatsapp'
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                  : 'text-neutral-700 hover:bg-emerald-50/80 hover:text-emerald-950'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Send className={`w-4 h-4 ${activeTab === 'whatsapp' ? 'text-white' : 'text-emerald-600'}`} />
                <span className="font-bold">WhatsApp Broadcast</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === 'whatsapp' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
              }`}>
                CSV Bulk
              </span>
            </button>

            <div className="pt-2 border-t border-neutral-100 my-1" />

            <div className="px-3 py-1.5 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
              Profile & Configuration
            </div>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <UserCheck className="w-4 h-4 text-neutral-400" />
                <span>Advisor Profile</span>
              </div>
            </button>

            {/* Admin Session & Sign Out Card at bottom of sidebar */}
            <div className="pt-3 mt-3 border-t border-neutral-100 space-y-2">
              <div className="p-2.5 rounded-xl bg-neutral-50/90 border border-neutral-200/80">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                    Executive User
                  </span>
                  <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700 bg-emerald-100/80 px-1.5 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Online
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {effectiveAdminUser.avatar ? (
                    <img
                      src={effectiveAdminUser.avatar}
                      alt={effectiveAdminUser.name}
                      className="w-8 h-8 rounded-full object-cover border border-neutral-200 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                      {effectiveAdminUser.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-neutral-900 truncate">
                      {effectiveAdminUser.name}
                    </p>
                    <p className="text-[10px] text-neutral-500 truncate">
                      {effectiveAdminUser.email}
                    </p>
                  </div>
                </div>
              </div>

              <button
                id="admin-sidebar-logout-btn"
                onClick={() => setIsLogoutModalOpen(true)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer border border-red-100/60"
              >
                <div className="flex items-center gap-2">
                  <LogOut className="w-4 h-4 text-red-500" />
                  <span>Sign Out</span>
                </div>
                <span className="text-[10px] text-neutral-400 font-mono">Exit</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Right Content View */}
        <main className="flex-1 min-w-0">
          {activeTab === 'overview' && (
            <AdminDashboardOverview
              stats={stats}
              properties={properties}
              tours={tours}
              inquiries={inquiries}
              subscribersCount={subscribers.length}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onOpenAddProperty={() => {
                setPropertyToEdit(null);
                setIsPropertyModalOpen(true);
              }}
            />
          )}

          {activeTab === 'properties' && (
            <AdminPropertiesManager
              properties={properties}
              onOpenAddModal={() => {
                setPropertyToEdit(null);
                setIsPropertyModalOpen(true);
              }}
              onOpenEditModal={(prop) => {
                setPropertyToEdit(prop);
                setIsPropertyModalOpen(true);
              }}
              onDeleteProperty={handleDeleteProperty}
              onToggleFeatured={handleToggleFeatured}
              onChangeStatus={handleChangeStatus}
              onViewProperty={(prop) => onSelectPropertyForPreview(prop)}
            />
          )}

          {activeTab === 'tours' && (
            <AdminToursManager
              tours={tours}
              onUpdateStatus={handleUpdateTourStatus}
              onDeleteTour={handleDeleteTour}
            />
          )}

          {activeTab === 'inquiries' && (
            <AdminInquiriesManager
              inquiries={inquiries}
              onUpdateStatus={handleUpdateInquiryStatus}
              onDeleteInquiry={handleDeleteInquiry}
            />
          )}

          {activeTab === 'subscribers' && (
            <AdminSubscribersManager
              subscribers={subscribers}
              onDeleteSubscriber={handleDeleteSubscriber}
            />
          )}

          {activeTab === 'whatsapp' && (
            <AdminWhatsAppManager
              properties={properties}
              agent={agent}
              onSelectPropertyForPreview={onSelectPropertyForPreview}
            />
          )}

          {activeTab === 'settings' && (
            <AdminAgentSettings
              agent={agent}
              onSave={handleSaveAgent}
            />
          )}
        </main>
      </div>

      {/* Add / Edit Property Modal */}
      <PropertyFormModal
        isOpen={isPropertyModalOpen}
        onClose={() => setIsPropertyModalOpen(false)}
        onSubmit={handleCreateOrUpdateProperty}
        propertyToEdit={propertyToEdit}
      />

      {/* Admin Logout Confirmation Modal */}
      <AdminLogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirmLogout={handleConfirmLogout}
        user={effectiveAdminUser}
      />
    </div>
  );
};
