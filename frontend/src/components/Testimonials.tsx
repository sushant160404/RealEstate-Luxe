import React from 'react';
import { Testimonial } from '../types';
import { Star, CheckCircle2 } from 'lucide-react';

interface TestimonialsProps {
  testimonials: Testimonial[];
}

export const Testimonials: React.FC<TestimonialsProps> = ({ testimonials }) => {
  return (
    <section id="client-testimonials" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header with Centered Green Underline Bar */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
          What Clients Say
        </h2>
        {/* Signature Green Underline Bar from Mockup */}
        <div className="w-14 h-1 bg-[#22c55e] rounded-full mx-auto mt-3 mb-4" />
        <p className="text-neutral-500 text-base">
          Read candid reviews from homeowners, relocators, and investors who trusted LuxeLiving.
        </p>
      </div>

      {/* 3 Testimonial Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="bg-white rounded-2xl p-7 border border-neutral-200/80 shadow-xs hover:shadow-md transition-shadow duration-300 flex flex-col justify-between"
          >
            <div>
              {/* 5 Green Stars */}
              <div className="flex items-center gap-1 mb-5">
                {[...Array(t.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-[#22c55e] text-[#22c55e]"
                  />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-neutral-700 text-sm sm:text-[15px] leading-relaxed mb-6 font-normal">
                {t.text}
              </p>
            </div>

            {/* Author Profile */}
            <div className="flex items-center gap-3 pt-5 border-t border-neutral-100">
              <img
                src={t.avatar}
                alt={t.name}
                className="w-11 h-11 rounded-full object-cover ring-2 ring-neutral-100 shrink-0"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-bold text-neutral-900 truncate">
                    {t.name}
                  </h4>
                  {t.verified && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#22c55e] shrink-0" />
                  )}
                </div>
                <p className="text-xs text-neutral-500 truncate">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
