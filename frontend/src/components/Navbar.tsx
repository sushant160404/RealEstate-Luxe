import React, { useState, useEffect } from 'react';
import { Home, Heart, Menu, X, PhoneCall, Calendar, Calculator, ShieldCheck } from 'lucide-react';
import { AdminUser } from '../types';

interface NavbarProps {
  savedCount: number;
  onOpenSaved: () => void;
  onOpenConsultation: () => void;
  onOpenCalculator: () => void;
  onOpenAdmin: () => void;
  adminUser?: AdminUser | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  savedCount,
  onOpenSaved,
  onOpenConsultation,
  onOpenCalculator,
  onOpenAdmin,
  adminUser
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const navOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm py-3 border-b border-neutral-100'
          : 'bg-white/80 backdrop-blur-xs py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2 group"
          id="brand-logo"
        >
          <div className="w-9 h-9 rounded-xl bg-[#22c55e] flex items-center justify-center text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
            <Home className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-xl font-bold tracking-tight text-neutral-900">
            Luxe<span className="text-[#22c55e]">Living</span>
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-[15px] font-medium text-neutral-600">
          <button
            onClick={() => scrollToSection('featured-properties')}
            className="hover:text-neutral-950 transition-colors cursor-pointer"
          >
            Properties
          </button>
          <button
            onClick={() => scrollToSection('agent-spotlight')}
            className="hover:text-neutral-950 transition-colors cursor-pointer"
          >
            About Agent
          </button>
          <button
            onClick={() => scrollToSection('client-testimonials')}
            className="hover:text-neutral-950 transition-colors cursor-pointer"
          >
            Reviews
          </button>
          <button
            onClick={onOpenCalculator}
            className="flex items-center gap-1.5 hover:text-neutral-950 transition-colors cursor-pointer"
          >
            <Calculator className="w-4 h-4 text-neutral-400" />
            Mortgage Tool
          </button>
        </nav>

        {/* Right Action Controls */}
        <div className="hidden md:flex items-center gap-2.5">
          {/* Admin Management Panel Button */}
          <button
            id="admin-portal-btn"
            onClick={onOpenAdmin}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold shadow-xs transition-colors cursor-pointer border border-neutral-200"
            title={adminUser ? `Admin Session Active: ${adminUser.name}` : "Open Admin Management Panel (Login Required)"}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#22c55e]" />
            <span>{adminUser ? `Admin (${adminUser.name.split(' ')[0]})` : 'Admin Panel'}</span>
            {adminUser && <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />}
          </button>

          {/* Saved Properties Button */}
          <button
            id="saved-properties-btn"
            onClick={onOpenSaved}
            className="relative p-2.5 rounded-full text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 transition-colors cursor-pointer"
            aria-label="View saved homes"
            title="View saved homes"
          >
            <Heart className="w-5 h-5 text-neutral-700" />
            {savedCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#22c55e] text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-xs">
                {savedCount}
              </span>
            )}
          </button>

          {/* Book Consultation CTA Button */}
          <button
            id="nav-consultation-btn"
            onClick={onOpenConsultation}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#22c55e] hover:bg-[#16a34a] text-white text-xs font-semibold shadow-sm transition-all duration-200 cursor-pointer active:scale-98"
          >
            <Calendar className="w-3.5 h-3.5" />
            Book Consultation
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={onOpenSaved}
            className="relative p-2 text-neutral-700 hover:bg-neutral-100 rounded-lg"
            aria-label="View saved homes"
          >
            <Heart className="w-5 h-5" />
            {savedCount > 0 && (
              <span className="absolute 0 -top-0.5 -right-0.5 w-4 h-4 bg-[#22c55e] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {savedCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-neutral-700 hover:bg-neutral-100 rounded-lg cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-neutral-200 px-4 pt-3 pb-6 space-y-4 shadow-lg">
          <nav className="flex flex-col space-y-3 text-base font-medium text-neutral-700">
            <button
              onClick={() => scrollToSection('featured-properties')}
              className="text-left py-2 px-3 rounded-lg hover:bg-neutral-50"
            >
              Properties
            </button>
            <button
              onClick={() => scrollToSection('agent-spotlight')}
              className="text-left py-2 px-3 rounded-lg hover:bg-neutral-50"
            >
              About Agent
            </button>
            <button
              onClick={() => scrollToSection('client-testimonials')}
              className="text-left py-2 px-3 rounded-lg hover:bg-neutral-50"
            >
              Client Reviews
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="text-left py-2 px-3 rounded-lg hover:bg-neutral-50 flex items-center justify-between text-neutral-900 font-semibold"
            >
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#22c55e]" />
                <span>{adminUser ? `Admin Portal (${adminUser.name.split(' ')[0]})` : 'Admin Portal & Login'}</span>
              </span>
              <span className="text-[11px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold flex items-center gap-1">
                {adminUser && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />}
                {adminUser ? 'Active' : 'Auth'}
              </span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCalculator();
              }}
              className="text-left py-2 px-3 rounded-lg hover:bg-neutral-50 flex items-center gap-2"
            >
              <Calculator className="w-4 h-4 text-neutral-500" />
              Mortgage Calculator
            </button>
          </nav>
          <div className="pt-2 border-t border-neutral-100 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenConsultation();
              }}
              className="w-full py-3 rounded-full bg-[#22c55e] hover:bg-[#16a34a] text-white text-center font-semibold text-sm shadow-sm"
            >
              Book Consultation
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
