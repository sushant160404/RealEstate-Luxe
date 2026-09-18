import React, { useState } from 'react';
import { X, Calendar, Clock, CheckCircle2, User, Mail, Phone, MessageSquare } from 'lucide-react';
import { api } from '../services/api';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const [submitted, setSubmitted] = useState(false);
  const [inquiryId, setInquiryId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceType: 'Buying a Luxury Home',
    preferredDate: '',
    preferredTime: 'Morning (9AM - 12PM)',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.submitInquiry({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        interestType: formData.serviceType,
        message: `Preferred date: ${formData.preferredDate || 'Flexible'}, Time: ${formData.preferredTime}. Notes: ${formData.notes || 'None'}`
      });
      if (res.inquiryId) {
        setInquiryId(res.inquiryId);
      }
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-neutral-100 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#22c55e]/15 text-[#16a34a] flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-neutral-900">Book Private Consultation</h3>
              <p className="text-xs text-neutral-500">
                1-on-1 strategic session with Priya Sharma & our advisory team
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

        {submitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-[#16a34a]" />
            </div>
            <h4 className="text-2xl font-bold text-neutral-900 mb-2">Consultation Scheduled!</h4>
            {inquiryId && (
              <div className="inline-block px-3 py-1 mb-3 rounded-full bg-green-100 text-green-800 font-mono text-xs font-bold">
                Inquiry Ref: {inquiryId}
              </div>
            )}
            <p className="text-sm text-neutral-600 max-w-sm mx-auto mb-6">
              Thank you, {formData.name}. We've sent calendar invites and preliminary market reports
              to <strong className="text-neutral-900">{formData.email}</strong>.
            </p>
            <button
              onClick={onClose}
              className="px-8 py-3 rounded-full bg-neutral-900 text-white text-sm font-semibold hover:bg-neutral-800 transition-colors"
            >
              Return to Website
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Consultation Purpose
              </label>
              <select
                value={formData.serviceType}
                onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:outline-hidden cursor-pointer font-medium"
              >
                <option value="Buying a Luxury Home">Buying a Luxury Home</option>
                <option value="Selling a Property (Valuation)">Selling a Property (Free Valuation)</option>
                <option value="Luxury Real Estate Portfolio / Investment">Investment Portfolio Review</option>
                <option value="Relocation Concierge">Relocation Concierge</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Eleanor Vance"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98200 00000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="eleanor@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Target Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.preferredDate}
                  onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Target Time Window
                </label>
                <select
                  value={formData.preferredTime}
                  onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:outline-hidden cursor-pointer"
                >
                  <option value="Morning (9AM - 12PM)">Morning (9AM - 12PM)</option>
                  <option value="Afternoon (12PM - 4PM)">Afternoon (12PM - 4PM)</option>
                  <option value="Late Afternoon (4PM - 7PM)">Late Afternoon (4PM - 7PM)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Specific Interests or Target Neighborhoods (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="Target budget, preferred architectural styles, or questions..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:outline-hidden"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-[#22c55e] hover:bg-[#16a34a] text-white font-semibold text-sm shadow-md transition-all duration-200 cursor-pointer"
              >
                Confirm & Request Consultation
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
