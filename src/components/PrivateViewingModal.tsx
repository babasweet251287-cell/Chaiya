import React, { useState, useEffect } from 'react';
import { X, Check, Building2, Calendar, Clock, ShieldCheck, Sparkles, MapPin } from 'lucide-react';
import { ViewingFormData } from '../types';

interface PrivateViewingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivateViewingModal: React.FC<PrivateViewingModalProps> = ({
  isOpen,
  onClose
}) => {
  const [formData, setFormData] = useState<ViewingFormData>({
    fullName: '',
    email: '',
    phone: '',
    residenceType: 'The Crown Sky Penthouse — 4 BHK + Private Terrace',
    preferredDate: '',
    preferredTime: '11:00 AM (Optimal Mountain & Daylight View)',
    representation: 'private',
    specialRequests: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Lock background scroll on mobile / iOS
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const refCode = 'NCT-' + Math.floor(100000 + Math.random() * 900000);
    setConfirmationCode(refCode);

    try {
      await fetch('/api/viewing-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          confirmationCode: refCode,
          development: 'Nirmal Chhaya Towers, VIP Road, Zirakpur, Chandigarh'
        })
      });
    } catch (err) {
      console.warn('Viewing request logged locally:', err);
    } finally {
      setSubmitting(false);
      setSubmitted(true);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 lg:p-6 bg-black/80 backdrop-blur-md overflow-y-auto overscroll-contain"
      id="private-viewing-modal-overlay"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#0d0f15] border border-[#d4af37]/40 rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 shadow-[0_24px_80px_rgba(0,0,0,0.95)] my-auto max-h-[calc(100dvh-1rem)] sm:max-h-[92dvh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        id="private-viewing-modal-card"
      >
        {/* Close Button with >= 44x44px touch target */}
        <button
          onClick={onClose}
          className="absolute top-4 sm:top-6 right-4 sm:right-6 min-w-[44px] min-h-[44px] p-2 text-white/50 hover:text-white rounded-full hover:bg-white/[0.08] transition-colors focus:outline-none flex items-center justify-center z-10 cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex-1 overflow-y-auto overscroll-contain pr-1 sm:pr-2 pt-[max(0.25rem,env(safe-area-inset-top))] pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          {!submitted ? (
            <div>
              {/* Header */}
              <div className="mb-6 sm:mb-8 pr-8">
                <div className="flex items-center gap-2 text-[#d4af37] mb-2">
                  <Building2 className="w-4 h-4 shrink-0" />
                  <span className="text-[9.5px] sm:text-[10px] font-sans font-semibold tracking-[0.25em] uppercase truncate">
                    NIRMAL CHHAYA TOWERS // VIP ROAD CHANDIGARH
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif-luxury text-[#f4efe8] mb-2">
                  Schedule a Private Site Visit
                </h2>
                <p className="text-[#c7bfb5] text-xs sm:text-sm leading-relaxed font-sans">
                  Experience Chandigarh&apos;s premier sky residences. Private viewings include a personalized guided tour of our 17.32-acre landscaped township, sample sky apartments, and clubhouse facilities.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">
                {/* Residence Selection - text-base for mobile to prevent iOS auto-zoom */}
                <div>
                  <label className="block text-[10px] sm:text-[10.5px] font-medium tracking-[0.18em] uppercase text-[#d4af37] mb-1.5">
                    Residence Preference
                  </label>
                  <select
                    value={formData.residenceType}
                    onChange={(e) => setFormData({ ...formData, residenceType: e.target.value })}
                    className="w-full px-3.5 py-3 rounded-xl bg-[#141822] border border-white/[0.12] text-[#f4efe8] text-base sm:text-sm focus:border-[#d4af37] focus:outline-none transition-colors"
                  >
                    <option value="The Crown Sky Penthouse — 4 BHK + Private Terrace">
                      The Crown Sky Penthouse — 4 BHK + Private Terrace (VIP Road View)
                    </option>
                    <option value="Luxury Grand 4 BHK Sky Residence — 3-Side Open">
                      Luxury Grand 4 BHK Sky Residence — 3-Side Open (Shivalik Hill View)
                    </option>
                    <option value="Premium 3 BHK Deluxe Residence — Landscaped Garden Facing">
                      Premium 3 BHK Deluxe Residence — Landscaped Garden Facing
                    </option>
                  </select>
                </div>

                {/* Personal Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                  <div>
                    <label className="block text-[10px] font-medium tracking-[0.18em] uppercase text-white/70 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Gurpreet Singh / Rajesh Sharma"
                      className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl bg-[#141822] border border-white/[0.12] text-[#f4efe8] placeholder:text-white/20 text-base sm:text-sm focus:border-[#d4af37] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-medium tracking-[0.18em] uppercase text-white/70 mb-1.5">
                      Contact Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@company.com"
                      className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl bg-[#141822] border border-white/[0.12] text-[#f4efe8] placeholder:text-white/20 text-base sm:text-sm focus:border-[#d4af37] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                  <div>
                    <label className="block text-[10px] font-medium tracking-[0.18em] uppercase text-white/70 mb-1.5">
                      Direct Telephone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl bg-[#141822] border border-white/[0.12] text-[#f4efe8] placeholder:text-white/20 text-base sm:text-sm focus:border-[#d4af37] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-medium tracking-[0.18em] uppercase text-white/70 mb-1.5">
                      Representation
                    </label>
                    <select
                      value={formData.representation}
                      onChange={(e) => setFormData({ ...formData, representation: e.target.value as 'private' | 'broker' | 'family_office' })}
                      className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl bg-[#141822] border border-white/[0.12] text-[#f4efe8] text-base sm:text-sm focus:border-[#d4af37] focus:outline-none transition-colors"
                    >
                      <option value="private">Individual Homebuyer / Resident</option>
                      <option value="family_office">Family Office / NRI Investor</option>
                      <option value="broker">Channel Partner / Certified Advisor</option>
                    </select>
                  </div>
                </div>

                {/* Timing */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                  <div>
                    <label className="block text-[10px] font-medium tracking-[0.18em] uppercase text-white/70 mb-1.5">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      value={formData.preferredDate}
                      onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                      className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl bg-[#141822] border border-white/[0.12] text-[#f4efe8] text-base sm:text-sm focus:border-[#d4af37] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-medium tracking-[0.18em] uppercase text-white/70 mb-1.5">
                      Preferred Time Slot
                    </label>
                    <select
                      value={formData.preferredTime}
                      onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                      className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl bg-[#141822] border border-white/[0.12] text-[#f4efe8] text-base sm:text-sm focus:border-[#d4af37] focus:outline-none transition-colors"
                    >
                      <option value="10:00 AM (Morning Natural Light)">10:00 AM (Morning Natural Light)</option>
                      <option value="11:00 AM (Optimal Mountain & Daylight View)">11:00 AM (Optimal Mountain &amp; Daylight View)</option>
                      <option value="03:00 PM (Afternoon Architectural Tour)">03:00 PM (Afternoon Architectural Tour)</option>
                      <option value="05:30 PM (Golden Hour Sunset & City Lights)">05:30 PM (Golden Hour Sunset &amp; City Lights)</option>
                    </select>
                  </div>
                </div>

                {/* Special Requests */}
                <div>
                  <label className="block text-[10px] font-medium tracking-[0.18em] uppercase text-white/70 mb-1.5">
                    Specific Inquiries or Requirements
                  </label>
                  <textarea
                    rows={2}
                    value={formData.specialRequests}
                    onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                    placeholder="Floor preference, NRI consultation, site chauffeur pickup..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#141822] border border-white/[0.12] text-[#f4efe8] placeholder:text-white/20 text-base sm:text-sm focus:border-[#d4af37] focus:outline-none transition-colors resize-none"
                  />
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full min-h-[48px] py-3.5 rounded-xl border border-[#d4af37] bg-gradient-to-r from-[#d4af37]/35 to-[#d4af37]/20 hover:from-[#d4af37]/50 active:scale-[0.99] text-[#fbf8f2] text-xs font-semibold tracking-widest uppercase transition-all shadow-[0_0_25px_rgba(212,175,55,0.2)] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                  >
                    {submitting ? 'RESERVED ACCESS...' : 'CONFIRM PRIVATE VIEWING'}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* Confirmation State */
            <div className="py-6 sm:py-8 text-center flex flex-col items-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#d4af37]/20 border border-[#d4af37] flex items-center justify-center text-[#d4af37] mb-5">
                <Check className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>

              <div className="flex items-center gap-2 text-[#d4af37] mb-2">
                <Sparkles className="w-4 h-4" />
                <span className="text-[10px] uppercase font-sans font-semibold tracking-[0.3em]">
                  VISIT RESERVED // VIP CONCIERGE
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-serif-luxury text-[#f4efe8] mb-3">
                Your Site Visit is Requested
              </h3>

              <p className="text-xs sm:text-sm text-[#c7bfb5] max-w-md mx-auto leading-relaxed mb-6 font-sans">
                Thank you, <strong className="text-white">{formData.fullName}</strong>. A dedicated relationship director from Nirmal Chhaya Towers will reach out directly at <strong className="text-white">{formData.phone}</strong> to confirm your personalized escort.
              </p>

              <div className="p-4 sm:p-5 rounded-xl bg-[#141822] border border-[#d4af37]/30 max-w-sm w-full mb-6 text-left">
                <div className="text-[10px] uppercase tracking-widest text-[#d4af37] mb-1">
                  Private Access Reference
                </div>
                <div className="text-xl sm:text-2xl font-mono text-[#fbf8f2] font-semibold tracking-wider mb-2">
                  {confirmationCode}
                </div>
                <div className="text-[11px] text-white/60 space-y-1">
                  <div>Type: <span className="text-white/80">{formData.residenceType.split('—')[0]}</span></div>
                  <div>Location: <span className="text-white/80">VIP Road, Zirakpur, Chandigarh</span></div>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="min-h-[44px] px-8 py-3 rounded-full border border-[#d4af37] bg-[#d4af37]/20 text-[#fbf8f2] text-xs font-semibold tracking-widest uppercase hover:bg-[#d4af37]/35 transition-colors cursor-pointer"
              >
                RETURN TO EXPERIENCE
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
