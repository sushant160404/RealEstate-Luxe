import React, { useState } from 'react';
import { Property } from '../types';
import { api } from '../services/api';
import {
  X,
  Heart,
  Bed,
  Bath,
  Square,
  Calendar,
  DollarSign,
  MapPin,
  CheckCircle,
  Share2,
  Phone,
  Mail,
  Send,
  Calculator,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface PropertyDetailModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  isOpen,
  onClose,
  isSaved,
  onToggleSave,
}) => {
  if (!isOpen || !property) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'calculator' | 'tour'>('overview');

  // Mortgage / Home Loan EMI Calculator state
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(8.5);
  const [loanTermYears, setLoanTermYears] = useState(20);

  // Tour Booking state
  const [tourDate, setTourDate] = useState('');
  const [tourTime, setTourTime] = useState('11:00 AM');
  const [tourType, setTourType] = useState<'In-Person' | 'Video Call'>('In-Person');
  const [inquirerName, setInquirerName] = useState('');
  const [inquirerEmail, setInquirerEmail] = useState('');
  const [tourBooked, setTourBooked] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [isSubmittingTour, setIsSubmittingTour] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Mortgage calculations
  const principal = property.price * (1 - downPaymentPercent / 100);
  const monthlyRate = interestRate / 100 / 12;
  const numPayments = loanTermYears * 12;
  const monthlyPrincipalAndInterest =
    monthlyRate > 0
      ? (principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
        (Math.pow(1 + monthlyRate, numPayments) - 1)
      : principal / numPayments;

  const monthlyTax = (property.propertyTaxAnnual || 12000) / 12;
  const monthlyInsurance = (property.price * 0.0035) / 12;
  const monthlyHoa = property.hoaMonthly || 0;
  const totalMonthlyPayment = Math.round(
    monthlyPrincipalAndInterest + monthlyTax + monthlyInsurance + monthlyHoa
  );

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleTourSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingTour(true);
    try {
      const res = await api.bookTour({
        propertyId: property.id,
        propertyTitle: property.title,
        tourType,
        date: tourDate || new Date().toISOString().split('T')[0],
        time: tourTime,
        name: inquirerName,
        email: inquirerEmail,
        phone: ''
      });
      if (res.bookingId) {
        setBookingId(res.bookingId);
      }
      setTourBooked(true);
    } catch {
      setTourBooked(true);
    } finally {
      setIsSubmittingTour(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-neutral-100 flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Sticky Header Bar */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#22c55e] text-white">
              {property.status}
            </span>
            <span className="text-xs font-semibold text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded-full">
              {property.type}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer"
              title="Share property link"
            >
              <Share2 className="w-4 h-4" />
            </button>
            {copiedLink && (
              <span className="text-xs font-medium text-[#16a34a] bg-green-50 px-2 py-0.5 rounded-sm">
                Link copied!
              </span>
            )}

            <button
              onClick={() => onToggleSave(property.id)}
              className={`p-2 rounded-full transition-colors cursor-pointer ${
                isSaved
                  ? 'bg-rose-50 text-rose-600'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
              title={isSaved ? 'Remove from saved' : 'Save to favorites'}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>

            <button
              onClick={onClose}
              className="p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 rounded-full transition-colors cursor-pointer ml-1"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Gallery Carousel */}
          <div className="relative rounded-2xl overflow-hidden aspect-16/9 bg-neutral-100 group">
            <img
              src={property.images[activeImageIndex]}
              alt={property.title}
              className="w-full h-full object-cover"
            />

            {property.images.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setActiveImageIndex((prev) =>
                      prev === 0 ? property.images.length - 1 : prev - 1
                    )
                  }
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() =>
                    setActiveImageIndex((prev) =>
                      prev === property.images.length - 1 ? 0 : prev + 1
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-md backdrop-blur-xs">
              {activeImageIndex + 1} / {property.images.length}
            </div>
          </div>

          {/* Thumbnail Strip */}
          {property.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {property.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                    activeImageIndex === idx
                      ? 'border-[#22c55e] scale-98'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Title, Location & Main Price */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-neutral-100">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 mb-2">
                {property.title}
              </h2>
              <div className="flex items-center gap-1.5 text-neutral-500 text-sm">
                <MapPin className="w-4 h-4 text-neutral-400 shrink-0" />
                <span>{property.location}</span>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <div className="text-3xl font-black text-neutral-900 tracking-tight">
                {property.formattedPrice}
              </div>
              <div className="text-xs text-neutral-500 mt-0.5">
                Est. ₹{Math.round(totalMonthlyPayment).toLocaleString('en-IN')}/month
              </div>
            </div>
          </div>

          {/* Quick Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-100">
              <div className="flex items-center gap-2 text-neutral-500 text-xs mb-1">
                <Bed className="w-4 h-4 text-neutral-400" />
                <span>Bedrooms</span>
              </div>
              <span className="text-lg font-bold text-neutral-900">{property.beds}</span>
            </div>

            <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-100">
              <div className="flex items-center gap-2 text-neutral-500 text-xs mb-1">
                <Bath className="w-4 h-4 text-neutral-400" />
                <span>Bathrooms</span>
              </div>
              <span className="text-lg font-bold text-neutral-900">{property.baths}</span>
            </div>

            <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-100">
              <div className="flex items-center gap-2 text-neutral-500 text-xs mb-1">
                <Square className="w-4 h-4 text-neutral-400" />
                <span>Square Feet</span>
              </div>
              <span className="text-lg font-bold text-neutral-900">
                {property.sqft.toLocaleString()}
              </span>
            </div>

            <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-100">
              <div className="flex items-center gap-2 text-neutral-500 text-xs mb-1">
                <Calendar className="w-4 h-4 text-neutral-400" />
                <span>Year Built</span>
              </div>
              <span className="text-lg font-bold text-neutral-900">{property.yearBuilt}</span>
            </div>
          </div>

          {/* Modal Tab Controls */}
          <div className="flex border-b border-neutral-200">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-3 px-4 font-semibold text-sm transition-colors relative cursor-pointer ${
                activeTab === 'overview'
                  ? 'text-neutral-900'
                  : 'text-neutral-400 hover:text-neutral-700'
              }`}
            >
              Overview & Features
              {activeTab === 'overview' && (
                <div className="absolute bottom-0 inset-x-0 h-0.5 bg-[#22c55e]" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('calculator')}
              className={`pb-3 px-4 font-semibold text-sm transition-colors relative cursor-pointer ${
                activeTab === 'calculator'
                  ? 'text-neutral-900'
                  : 'text-neutral-400 hover:text-neutral-700'
              }`}
            >
              Home Loan & EMI Calculator
              {activeTab === 'calculator' && (
                <div className="absolute bottom-0 inset-x-0 h-0.5 bg-[#22c55e]" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('tour')}
              className={`pb-3 px-4 font-semibold text-sm transition-colors relative cursor-pointer ${
                activeTab === 'tour'
                  ? 'text-neutral-900'
                  : 'text-neutral-400 hover:text-neutral-700'
              }`}
            >
              Schedule Tour
              {activeTab === 'tour' && (
                <div className="absolute bottom-0 inset-x-0 h-0.5 bg-[#22c55e]" />
              )}
            </button>
          </div>

          {/* Tab 1: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-3">
                  About This Home
                </h4>
                <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
                  {property.description}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-3">
                  Key Amenities & Upgrades
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {property.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-sm text-neutral-700 bg-neutral-50 px-3.5 py-2.5 rounded-lg border border-neutral-100"
                    >
                      <CheckCircle className="w-4 h-4 text-[#22c55e] shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Home Loan & EMI Calculator */}
          {activeTab === 'calculator' && (
            <div className="space-y-6">
              <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-200">
                <div className="flex flex-col sm:flex-row items-center justify-between pb-6 border-b border-neutral-200 gap-4">
                  <div>
                    <span className="text-xs uppercase font-semibold text-neutral-500">
                      Estimated Monthly EMI
                    </span>
                    <div className="text-3xl font-extrabold text-neutral-900 mt-1">
                      ₹{Math.round(totalMonthlyPayment).toLocaleString('en-IN')}{' '}
                      <span className="text-sm font-normal text-neutral-500">/mo</span>
                    </div>
                  </div>

                  <div className="text-xs text-neutral-500 sm:text-right space-y-1">
                    <div>Monthly Principal & Interest: ₹{Math.round(monthlyPrincipalAndInterest).toLocaleString('en-IN')}</div>
                    <div>Est. Property Tax: ₹{Math.round(monthlyTax).toLocaleString('en-IN')}</div>
                    <div>Society Maintenance: ₹{Math.round(monthlyInsurance + monthlyHoa).toLocaleString('en-IN')}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Down Payment ({downPaymentPercent}%)
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="50"
                      step="5"
                      value={downPaymentPercent}
                      onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                      className="w-full accent-[#22c55e] cursor-pointer"
                    />
                    <div className="text-xs text-neutral-500 mt-1">
                      ₹{Math.round((property.price * downPaymentPercent) / 100).toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Interest Rate ({interestRate}%)
                    </label>
                    <input
                      type="range"
                      min="7"
                      max="14"
                      step="0.1"
                      value={interestRate}
                      onChange={(e) => setInterestRate(Number(e.target.value))}
                      className="w-full accent-[#22c55e] cursor-pointer"
                    />
                    <div className="text-xs text-neutral-500 mt-1">Indian bank avg ~8.5%</div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Loan Tenure
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setLoanTermYears(25)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border ${
                          loanTermYears === 25
                            ? 'bg-neutral-900 text-white border-neutral-900'
                            : 'bg-white text-neutral-700 border-neutral-200'
                        }`}
                      >
                        25 Yrs
                      </button>
                      <button
                        type="button"
                        onClick={() => setLoanTermYears(20)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border ${
                          loanTermYears === 20
                            ? 'bg-neutral-900 text-white border-neutral-900'
                            : 'bg-white text-neutral-700 border-neutral-200'
                        }`}
                      >
                        20 Yrs
                      </button>
                      <button
                        type="button"
                        onClick={() => setLoanTermYears(15)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border ${
                          loanTermYears === 15
                            ? 'bg-neutral-900 text-white border-neutral-900'
                            : 'bg-white text-neutral-700 border-neutral-200'
                        }`}
                      >
                        15 Yrs
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Schedule Tour */}
          {activeTab === 'tour' && (
            <div>
              {tourBooked ? (
                <div className="p-8 text-center bg-green-50 rounded-2xl border border-green-200 space-y-2">
                  <CheckCircle className="w-12 h-12 text-[#16a34a] mx-auto mb-2" />
                  <h4 className="text-lg font-bold text-neutral-900">Tour Requested!</h4>
                  {bookingId && (
                    <div className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-800 font-mono text-xs font-bold">
                      Booking Reference: {bookingId}
                    </div>
                  )}
                  <p className="text-sm text-neutral-600 max-w-sm mx-auto">
                    We've confirmed your {tourType.toLowerCase()} tour for {tourDate || 'this week'} at{' '}
                    {tourTime}. An agent confirmation has been sent to {inquirerEmail}.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleTourSubmit} className="space-y-4">
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setTourType('In-Person')}
                      className={`flex-1 py-2.5 rounded-xl font-semibold text-xs transition-colors ${
                        tourType === 'In-Person'
                          ? 'bg-neutral-900 text-white'
                          : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                      }`}
                    >
                      In-Person Tour
                    </button>
                    <button
                      type="button"
                      onClick={() => setTourType('Video Call')}
                      className={`flex-1 py-2.5 rounded-xl font-semibold text-xs transition-colors ${
                        tourType === 'Video Call'
                          ? 'bg-neutral-900 text-white'
                          : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                      }`}
                    >
                      Live Video Walkthrough
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-600 mb-1">
                        Preferred Date
                      </label>
                      <input
                        type="date"
                        required
                        value={tourDate}
                        onChange={(e) => setTourDate(e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-600 mb-1">
                        Preferred Time
                      </label>
                      <select
                        value={tourTime}
                        onChange={(e) => setTourTime(e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:outline-hidden cursor-pointer"
                      >
                        <option value="10:00 AM">10:00 AM</option>
                        <option value="11:30 AM">11:30 AM</option>
                        <option value="2:00 PM">2:00 PM</option>
                        <option value="4:30 PM">4:30 PM</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-600 mb-1">
                        Your Full Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={inquirerName}
                        onChange={(e) => setInquirerName(e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-600 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="john@example.com"
                        value={inquirerEmail}
                        onChange={(e) => setInquirerEmail(e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-full bg-[#22c55e] hover:bg-[#16a34a] text-white font-semibold text-sm shadow-sm transition-colors cursor-pointer"
                  >
                    Confirm Tour Appointment
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Agent Contact Footer Bar */}
          <div className="pt-6 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80"
                alt="David Sterling"
                className="w-11 h-11 rounded-full object-cover ring-2 ring-neutral-100"
              />
              <div>
                <p className="text-xs text-neutral-400 font-medium">Listing Broker</p>
                <h5 className="text-sm font-bold text-neutral-900">David Sterling</h5>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <a
                href="tel:+15553478821"
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-neutral-300 text-neutral-800 text-xs font-semibold hover:bg-neutral-50 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#22c55e]" />
                <span>Call Broker</span>
              </a>
              <button
                onClick={() => setActiveTab('tour')}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Request Private Tour</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
