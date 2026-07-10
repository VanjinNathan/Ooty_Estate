import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Info, X } from 'lucide-react';

interface InfoTooltipProps {
  className?: string;
}

export default function InfoTooltip({ className = '' }: InfoTooltipProps) {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    // Check localStorage to see if the user dismissed it
    const dismissed = localStorage.getItem('ooty-map-tooltip-dismissed');
    if (!dismissed) {
      // Show with a tiny delay for a delightful animation cascade
      const timer = setTimeout(() => setIsVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('ooty-map-tooltip-dismissed', 'true');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className={`bg-brand-charcoal text-white rounded-2xl shadow-2xl px-4 py-3 flex items-center space-x-3 border border-white/10 max-w-sm sm:max-w-md pointer-events-auto backdrop-blur-md bg-opacity-95 z-40 ${className}`}
          id="info-tooltip-banner"
        >
          <div className="p-1.5 rounded-lg bg-brand-green/20 text-brand-green flex-shrink-0 animate-pulse">
            <Info className="w-5 h-5" />
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold tracking-wide text-brand-green uppercase font-display">
              Regional Focus
            </p>
            <p className="text-sm text-gray-200 font-sans leading-snug">
              This interactive map currently covers the Udhagamandalam (Ooty) region only.
            </p>
          </div>

          <button
            onClick={handleDismiss}
            className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-white/10 active:bg-white/20 transition-all cursor-pointer focus:outline-none"
            aria-label="Dismiss info"
            id="btn-info-tooltip-dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
