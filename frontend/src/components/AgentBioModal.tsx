import React, { useState } from 'react';
import { AgentInfo } from '../types';
import { X, Award, ShieldCheck, Phone, Mail, CheckCircle2, Send, Star } from 'lucide-react';

interface AgentBioModalProps {
  agent: AgentInfo;
  isOpen: boolean;
  onClose: () => void;
  onOpenConsultation: () => void;
}

export const AgentBioModal: React.FC<AgentBioModalProps> = ({
  agent,
  isOpen,
  onClose,
  onOpenConsultation,
}) => {
  if (!isOpen) return null;

  const [messageSent, setMessageSent] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    setMessageSent(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-neutral-100 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#16a34a] bg-green-50 px-2.5 py-1 rounded-full">
              {agent.rank}
            </span>
            <span className="text-xs text-neutral-400 font-mono">{agent.licenseNumber}</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-900 rounded-full hover:bg-neutral-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 mb-6 pb-6 border-b border-neutral-100">
          <img
            src={agent.image}
            alt={agent.name}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover object-top ring-4 ring-[#22c55e]/20 shrink-0"
          />
          <div className="text-center sm:text-left">
            <h3 className="text-2xl font-bold text-neutral-900">{agent.name}</h3>
            <p className="text-sm text-neutral-500 font-medium mt-0.5">{agent.role}</p>

            <div className="flex items-center justify-center sm:justify-start gap-4 mt-3 text-xs text-neutral-600">
              <span className="flex items-center gap-1 font-semibold text-neutral-900">
                <Star className="w-4 h-4 fill-[#22c55e] text-[#22c55e]" />
                5.0 (48 Reviews)
              </span>
              <span>•</span>
              <span>{agent.experienceYears}+ Years Active</span>
              <span>•</span>
              <span className="text-[#16a34a] font-semibold">{agent.salesVolume}</span>
            </div>
          </div>
        </div>

        {/* Full Bio */}
        <div className="space-y-4 mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            Professional Background
          </h4>
          <p className="text-neutral-700 text-sm sm:text-base leading-relaxed">
            {agent.fullBio}
          </p>
        </div>

        {/* Specialties */}
        <div className="mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2.5">
            Areas of Practice & Specialties
          </h4>
          <div className="flex flex-wrap gap-2">
            {agent.specialties.map((spec, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-neutral-100 text-neutral-800 text-xs font-medium rounded-lg"
              >
                {spec}
              </span>
            ))}
          </div>
        </div>

        {/* Direct Contact Form */}
        <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-200">
          <h4 className="text-sm font-bold text-neutral-900 mb-1">
            Send a Private Message to {agent.name}
          </h4>
          <p className="text-xs text-neutral-500 mb-4">
            {agent.name} typically responds within 30 minutes during business hours.
          </p>

          {messageSent ? (
            <div className="p-4 bg-green-100/60 rounded-xl text-center text-sm font-semibold text-green-900 flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#16a34a]" />
              Message sent! {agent.name} will reach out directly.
            </div>
          ) : (
            <form onSubmit={handleSendMessage} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="px-3 py-2 text-sm bg-white rounded-xl border border-neutral-200 focus:outline-hidden"
                />
                <input
                  type="email"
                  required
                  placeholder="Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-3 py-2 text-sm bg-white rounded-xl border border-neutral-200 focus:outline-hidden"
                />
              </div>
              <textarea
                required
                rows={3}
                placeholder={`What property or market inquiry can ${agent.name} assist you with?`}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white rounded-xl border border-neutral-200 focus:outline-hidden"
              />
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenConsultation();
                  }}
                  className="text-xs font-semibold text-[#16a34a] hover:underline"
                >
                  Or schedule a live consultation →
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
