import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, CheckCircle2, Phone, Mail, User } from 'lucide-react';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyName: string;
}

export default function EnquiryModal({
  isOpen,
  onClose,
  propertyName
}: EnquiryModalProps) {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  // Initialize/reset message when property name changes
  React.useEffect(() => {
    if (propertyName) {
      setMessage(`Hi, I am interested in "${propertyName}". Please provide details about zoning approvals, title deeds, and final pricing. Thank you.`);
    }
    setSubmitted(false);
    setName('');
    setEmail('');
    setPhone('');
  }, [propertyName, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim() || !message.trim()) return;

    setIsSubmitting(true);
    
    // Simulate API submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      
      // Auto-close after 3 seconds on success
      setTimeout(() => {
        onClose();
      }, 3000);
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-neutral-950/40 backdrop-blur-xs z-55 cursor-pointer pointer-events-auto"
            id="enquiry-backdrop"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 240 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 w-full max-w-md bg-white rounded-3xl shadow-2xl z-55 border border-gray-150 overflow-hidden font-sans pointer-events-auto"
            id="enquiry-modal"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-brand-green/5">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-brand-green flex items-center justify-center text-white shadow-md">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-[15px] text-brand-charcoal tracking-tight leading-tight">
                    Submit Property Enquiry
                  </h3>
                  <p className="text-[11px] text-brand-green font-semibold">
                    DIRECT PORTAL • NILGIRIS REGISTRY
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full text-neutral-400 hover:text-brand-charcoal hover:bg-neutral-100 transition-colors focus:outline-none cursor-pointer"
                aria-label="Close modal"
                id="btn-close-enquiry-modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content / Form */}
            <div className="p-6">
              {submitted ? (
                <div className="py-8 text-center flex flex-col items-center justify-center space-y-4 animate-scaleIn">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shadow-lg">
                    <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-neutral-800">Enquiry Received</h4>
                    <p className="text-xs text-neutral-500 mt-1 max-w-[280px] mx-auto font-sans">
                      Your interest in <strong className="text-neutral-700">{propertyName}</strong> has been catalogued. An estates representative will reach out shortly.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  {/* Property highlight banner */}
                  <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-150 text-xs text-neutral-600 flex flex-col leading-relaxed select-none">
                    <span className="font-bold text-neutral-400 uppercase tracking-wider text-[9px]">Target Property</span>
                    <span className="font-bold text-neutral-800 mt-0.5 truncate">{propertyName}</span>
                  </div>

                  {/* Input Rows */}
                  <div className="space-y-3">
                    {/* Name */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        required
                        disabled={isSubmitting}
                        placeholder="Your Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-sans focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green"
                      />
                    </div>

                    {/* Email */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        required
                        disabled={isSubmitting}
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-sans focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green"
                      />
                    </div>

                    {/* Phone */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        type="tel"
                        required
                        disabled={isSubmitting}
                        placeholder="Mobile Number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-sans focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green"
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <textarea
                        required
                        rows={3}
                        disabled={isSubmitting}
                        placeholder="Message/Details requested"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl p-3 text-xs font-sans focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green resize-none"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-brand-green hover:bg-brand-green/90 disabled:bg-neutral-300 text-white rounded-xl text-xs font-display font-extrabold active:scale-95 transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-lg shadow-brand-green/15"
                    id="btn-submit-enquiry"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-1.5 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Transmitting Enquiry...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Enquiry</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>

                </form>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
