import React from 'react';
import { AgentInfo } from '../types';
import { Award, ShieldCheck, Phone, Mail, ArrowRight } from 'lucide-react';

interface AgentSpotlightProps {
  agent: AgentInfo;
  onOpenBio: () => void;
  onOpenConsultation: () => void;
}

export const AgentSpotlight: React.FC<AgentSpotlightProps> = ({
  agent,
  onOpenBio,
  onOpenConsultation,
}) => {
  return (
    <section id="agent-spotlight" className="py-16 md:py-24 bg-neutral-50/70 border-y border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Copy, Metrics & CTAs */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            {/* Tag badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-neutral-200 text-xs font-semibold text-neutral-700 w-fit mb-4 shadow-xs">
              <Award className="w-3.5 h-3.5 text-[#22c55e]" />
              <span>Broker Spotlight</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 tracking-tight leading-[1.15] mb-6">
              Dedicated to finding your perfect match
            </h2>

            <p className="text-neutral-600 text-base sm:text-lg leading-relaxed mb-8">
              {agent.bio}
            </p>

            {/* Metrics Triad */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 py-6 border-y border-neutral-200 mb-8">
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
                  {agent.experienceYears}+
                </div>
                <div className="text-xs sm:text-sm font-medium text-neutral-500 mt-1">
                  Years of Experience
                </div>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
                  Top 1%
                </div>
                <div className="text-xs sm:text-sm font-medium text-neutral-500 mt-1">
                  Agent in Region
                </div>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
                  {agent.salesVolume.replace(' Sales Volume', '')}
                </div>
                <div className="text-xs sm:text-sm font-medium text-neutral-500 mt-1">
                  Sales Volume
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={onOpenBio}
                className="px-7 py-3.5 rounded-full bg-neutral-900 hover:bg-neutral-800 active:bg-black text-white text-sm font-semibold shadow-sm transition-all duration-200 cursor-pointer"
              >
                Read Full Bio
              </button>

              <button
                onClick={onOpenConsultation}
                className="px-7 py-3.5 rounded-full bg-white hover:bg-neutral-100 border border-neutral-300 text-neutral-800 text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2"
              >
                <span>Schedule Consultation</span>
                <ArrowRight className="w-4 h-4 text-neutral-500" />
              </button>
            </div>
          </div>

          {/* Right Column: Broker Portrait Card */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md">
              {/* Decorative background shape */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-[#22c55e]/20 to-neutral-200 rounded-[32px] transform rotate-1 scale-98" />

              {/* Portrait Container */}
              <div className="relative bg-white rounded-3xl overflow-hidden shadow-xl border border-neutral-100">
                <img
                  src={agent.image}
                  alt={agent.name}
                  className="w-full aspect-4/5 object-cover object-top"
                />

                {/* Floating Info Overlay on Bottom of Image */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold">{agent.name}</h3>
                      <p className="text-xs text-neutral-300 font-medium">{agent.role}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[#22c55e] flex items-center justify-center text-white shadow-md">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-white/20 flex items-center justify-between text-xs text-neutral-300">
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#22c55e]" />
                      {agent.phone}
                    </span>
                    <span>{agent.licenseNumber}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
