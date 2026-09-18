import React, { useState } from 'react';
import { Mail, CheckCircle2, ArrowRight } from 'lucide-react';
import { api } from '../services/api';

export const DreamHomeBanner: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) return;
    setLoading(true);
    try {
      await api.subscribeNewsletter(email);
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="cta-banner" className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Vibrant Green Card matching screenshot */}
      <div className="relative rounded-3xl md:rounded-[36px] bg-[#22c55e] px-6 py-14 sm:py-16 md:py-20 text-center text-white shadow-xl overflow-hidden">
        {/* Subtle background decorative shapes */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-black/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-white">
            Ready to find your dream home?
          </h2>

          <p className="text-white/90 text-sm sm:text-base md:text-lg mb-8 leading-relaxed font-normal">
            Join our newsletter for exclusive off-market listings, weekly price drop alerts,
            and curated real estate tips sent directly to your inbox.
          </p>

          {submitted ? (
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 max-w-md mx-auto flex items-center justify-center gap-3 text-white border border-white/30">
              <CheckCircle2 className="w-6 h-6 text-white shrink-0" />
              <div className="text-left">
                <p className="font-bold text-sm">You're on the VIP list!</p>
                <p className="text-xs text-white/80">We've sent a confirmation to {email}</p>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="max-w-md mx-auto bg-white rounded-full p-1.5 sm:p-2 shadow-lg flex items-center gap-2"
            >
              <div className="flex-1 flex items-center gap-2 pl-4">
                <Mail className="w-4 h-4 text-neutral-400 shrink-0" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your Email"
                  className="w-full bg-transparent text-sm text-neutral-900 placeholder-neutral-400 focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                id="newsletter-subscribe-btn"
                className="px-6 sm:px-8 py-3 rounded-full bg-neutral-900 hover:bg-neutral-800 active:bg-black text-white text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer shrink-0 shadow-xs"
              >
                Subscribe
              </button>
            </form>
          )}

          <p className="text-white/70 text-xs mt-4">
            No spam, ever. Unsubscribe with one click anytime.
          </p>
        </div>
      </div>
    </section>
  );
};
