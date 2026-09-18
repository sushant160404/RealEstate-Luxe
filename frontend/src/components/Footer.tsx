import React from 'react';
import { Home, MapPin, Phone, Mail, Instagram, Linkedin, Twitter, Facebook, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  return (
    <footer className="bg-white border-t border-neutral-200/80 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-neutral-100">
          {/* Brand & Mission Statement (col-span 2) */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#22c55e] flex items-center justify-center text-white shadow-xs">
                <Home className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold tracking-tight text-neutral-900">
                Luxe<span className="text-[#22c55e]">Living</span>
              </span>
            </div>
            <p className="text-neutral-500 text-sm leading-relaxed max-w-sm mb-6">
              A premier luxury real estate brokerage connecting clients with extraordinary architectural homes,
              high-growth investments, and white-glove advisory.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <a
                href="#instagram"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-neutral-900 flex items-center justify-center transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#twitter"
                aria-label="Twitter"
                className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-neutral-900 flex items-center justify-center transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#linkedin"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-neutral-900 flex items-center justify-center transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="#facebook"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-neutral-900 flex items-center justify-center transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm text-neutral-600">
              <li>
                <a href="#about" className="hover:text-neutral-950 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#careers" className="hover:text-neutral-950 transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#our-team" className="hover:text-neutral-950 transition-colors">
                  Our Team
                </a>
              </li>
              <li>
                <a href="#press" className="hover:text-neutral-950 transition-colors">
                  Press & Media
                </a>
              </li>
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-4">
              Services
            </h4>
            <ul className="space-y-2.5 text-sm text-neutral-600">
              <li>
                <a href="#buy" className="hover:text-neutral-950 transition-colors">
                  Buy A Home
                </a>
              </li>
              <li>
                <a href="#sell" className="hover:text-neutral-950 transition-colors">
                  Sell A Property
                </a>
              </li>
              <li>
                <a href="#rent" className="hover:text-neutral-950 transition-colors">
                  Rent A Home
                </a>
              </li>
              <li>
                <a href="#consulting" className="hover:text-neutral-950 transition-colors">
                  Investment Consulting
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-4">
              Contact
            </h4>
            <ul className="space-y-3 text-sm text-neutral-600">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#22c55e] shrink-0 mt-0.5" />
                <span>Level 24, One World Center, Lower Parel, Mumbai, MH 400013</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#22c55e] shrink-0" />
                <span>+91 98201 54321 / +91 22 6790 1200</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#22c55e] shrink-0" />
                <span>concierge@luxeliving.in</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-400 gap-4">
          <p>© 2026 LuxeLiving Real Estate Group. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#privacy" className="hover:text-neutral-600 transition-colors">
              Privacy Policy
            </a>
            <a href="#terms" className="hover:text-neutral-600 transition-colors">
              Terms of Service
            </a>
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="hover:text-[#22c55e] transition-colors cursor-pointer font-semibold flex items-center gap-1 text-neutral-500"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin Portal
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
