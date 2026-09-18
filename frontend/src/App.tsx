import React, { useState, useEffect } from 'react';
import { Property, FilterOptions, AgentInfo, AdminUser } from './types';
import { PROPERTIES, TESTIMONIALS, AGENT_INFO } from './data/properties';
import { api } from './services/api';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FeaturedProperties } from './components/FeaturedProperties';
import { AgentSpotlight } from './components/AgentSpotlight';
import { Testimonials } from './components/Testimonials';
import { DreamHomeBanner } from './components/DreamHomeBanner';
import { Footer } from './components/Footer';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { MortgageCalculatorModal } from './components/MortgageCalculatorModal';
import { AgentBioModal } from './components/AgentBioModal';
import { SavedPropertiesDrawer } from './components/SavedPropertiesDrawer';
import { ConsultationModal } from './components/ConsultationModal';
import { AdminPanel } from './components/admin/AdminPanel';
import { AdminLogin } from './components/admin/AdminLogin';
import { ShieldCheck } from 'lucide-react';

export default function App() {
  const [properties, setProperties] = useState<Property[]>(PROPERTIES);
  const [agentInfo, setAgentInfo] = useState<AgentInfo>(AGENT_INFO);
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('luxeliving_saved_ids');
      return stored ? JSON.parse(stored) : ['prop-2'];
    } catch {
      return ['prop-2'];
    }
  });

  const [filters, setFilters] = useState<FilterOptions>({
    location: '',
    propertyType: 'All',
    priceRange: 'Any',
    statusTab: 'all',
  });

  // Admin authentication & view state
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    try {
      const stored = localStorage.getItem('luxeliving_admin_user') || sessionStorage.getItem('luxeliving_admin_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [adminLogoutNotice, setAdminLogoutNotice] = useState<string | null>(null);

  // Modals & Views state
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isBioModalOpen, setIsBioModalOpen] = useState(false);
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);

  // Dynamic API sync with Laravel REST backend
  useEffect(() => {
    let isCurrent = true;
    api.getProperties(filters).then((data) => {
      if (isCurrent && data && data.length > 0) {
        setProperties(data);
      }
    });
    api.getAgent().then((data) => {
      if (isCurrent && data) {
        setAgentInfo(data);
      }
    });
    return () => {
      isCurrent = false;
    };
  }, [filters]);

  // Sync savedIds to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('luxeliving_saved_ids', JSON.stringify(savedIds));
    } catch {
      // Ignore storage errors in restricted contexts
    }
  }, [savedIds]);

  const handleToggleSave = (id: string) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleClearAllSaved = () => {
    setSavedIds([]);
  };

  const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleAdminLoginSuccess = (user: AdminUser, _token: string) => {
    setAdminUser(user);
    setAdminLogoutNotice(null);
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('luxeliving_admin_token');
    localStorage.removeItem('luxeliving_admin_user');
    sessionStorage.removeItem('luxeliving_admin_token');
    sessionStorage.removeItem('luxeliving_admin_user');
    setAdminUser(null);
    setAdminLogoutNotice('You have been securely signed out. Enter your credentials to re-authenticate.');
  };

  const savedPropertiesList = properties.filter((p) => savedIds.includes(p.id));

  // If Admin Panel is requested
  if (isAdminOpen) {
    // If not authenticated, present the dedicated Executive Admin Login page
    if (!adminUser) {
      return (
        <AdminLogin
          onSuccess={handleAdminLoginSuccess}
          onCancel={() => {
            setAdminLogoutNotice(null);
            setIsAdminOpen(false);
          }}
          logoutNotice={adminLogoutNotice}
        />
      );
    }

    // Authenticated admin workspace
    return (
      <div className="min-h-screen bg-[#f8fafc]">
        <AdminPanel
          adminUser={adminUser}
          onLogout={handleAdminLogout}
          onClose={() => setIsAdminOpen(false)}
          properties={properties}
          onPropertiesChange={setProperties}
          agent={agentInfo}
          onAgentChange={setAgentInfo}
          onSelectPropertyForPreview={(prop) => {
            setIsAdminOpen(false);
            setSelectedProperty(prop);
          }}
        />

        {/* Selected property modal can still preview directly if invoked */}
        <PropertyDetailModal
          property={selectedProperty}
          isOpen={!!selectedProperty}
          onClose={() => setSelectedProperty(null)}
          isSaved={selectedProperty ? savedIds.includes(selectedProperty.id) : false}
          onToggleSave={handleToggleSave}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] selection:bg-[#22c55e]/20 selection:text-neutral-900">
      {/* Top Fixed Navbar */}
      <Navbar
        savedCount={savedIds.length}
        onOpenSaved={() => setIsSavedDrawerOpen(true)}
        onOpenConsultation={() => setIsConsultationModalOpen(true)}
        onOpenCalculator={() => setIsCalculatorOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        adminUser={adminUser}
      />

      {/* Main Content Sections matching user mockup */}
      <main className="flex-1">
        {/* Hero Section with Architectural Home & Floating Search Bar */}
        <HeroSection
          filters={filters}
          onFilterChange={handleFilterChange}
          onApplySearch={() => {}}
          onOpenConsultation={() => setIsConsultationModalOpen(true)}
        />

        {/* Featured Properties Grid with Filter Tabs & Spec Badges */}
        <FeaturedProperties
          properties={properties}
          filters={filters}
          onFilterChange={handleFilterChange}
          savedIds={savedIds}
          onToggleSave={handleToggleSave}
          onSelectProperty={(prop) => setSelectedProperty(prop)}
        />

        {/* Dedicated to Finding Your Perfect Match (Broker Spotlight) */}
        <AgentSpotlight
          agent={agentInfo}
          onOpenBio={() => setIsBioModalOpen(true)}
          onOpenConsultation={() => setIsConsultationModalOpen(true)}
        />

        {/* What Clients Say (Testimonials) */}
        <Testimonials testimonials={TESTIMONIALS} />

        {/* Ready to Find Your Dream Home (Vibrant Green Banner & Newsletter) */}
        <DreamHomeBanner />
      </main>

      {/* Footer matching screenshot */}
      <Footer onOpenAdmin={() => setIsAdminOpen(true)} />

      {/* Floating Bottom Navigation Pills */}
      <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2.5">
        {/* Admin Portal Quick Launcher */}
        <button
          id="floating-admin-btn"
          onClick={() => setIsAdminOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-white hover:bg-neutral-50 text-neutral-800 text-xs font-semibold shadow-xl border border-neutral-200/90 transition-all hover:scale-105 active:scale-95 cursor-pointer group"
          title={adminUser ? `Signed in as ${adminUser.name} (${adminUser.role})` : "Open Admin Portal (Sign In Required)"}
        >
          <ShieldCheck className="w-4 h-4 text-[#22c55e]" />
          <span className="font-semibold">{adminUser ? `Admin (${adminUser.name.split(' ')[0]})` : 'Admin Panel'}</span>
          <span className={`w-1.5 h-1.5 rounded-full ${adminUser ? 'bg-[#22c55e] animate-pulse' : 'bg-neutral-400'}`} />
        </button>

      </div>

      {/* Interactive Modals & Slide-out Drawers */}
      <PropertyDetailModal
        property={selectedProperty}
        isOpen={!!selectedProperty}
        onClose={() => setSelectedProperty(null)}
        isSaved={selectedProperty ? savedIds.includes(selectedProperty.id) : false}
        onToggleSave={handleToggleSave}
      />

      <MortgageCalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
        defaultPrice={selectedProperty ? selectedProperty.price : 1250000}
      />

      <AgentBioModal
        agent={agentInfo}
        isOpen={isBioModalOpen}
        onClose={() => setIsBioModalOpen(false)}
        onOpenConsultation={() => {
          setIsBioModalOpen(false);
          setIsConsultationModalOpen(true);
        }}
      />

      <SavedPropertiesDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        savedProperties={savedPropertiesList}
        onRemoveSave={handleToggleSave}
        onClearAll={handleClearAllSaved}
        onSelectProperty={(prop) => setSelectedProperty(prop)}
      />

      <ConsultationModal
        isOpen={isConsultationModalOpen}
        onClose={() => setIsConsultationModalOpen(false)}
      />

    </div>
  );
}
