import React, { useState } from 'react';
import { Globe, ArrowRight, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AuditInputProps {
  onSubmitUrl: (url: string) => void;
  isLoading: boolean;
  loadingStep: string;
  presetUrls: { label: string; url: string }[];
}

export const AuditInput: React.FC<AuditInputProps> = ({
  onSubmitUrl,
  isLoading,
  loadingStep,
  presetUrls
}) => {
  const [inputUrl, setInputUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;
    onSubmitUrl(inputUrl.trim());
  };

  return (
    <section className="no-print mb-8">
      <div className="bg-slate-900/90 backdrop-blur-xl p-4 md:p-6 rounded-2xl border border-slate-800 shadow-2xl glow-primary">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <Globe className="w-5 h-5 text-indigo-400" />
            </div>
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              required
              placeholder="https://yourwebsite.com or domain.com"
              disabled={isLoading}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-12 pr-4 py-4 text-base text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
            />
          </div>

          <motion.button
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
            type="submit"
            disabled={isLoading}
            className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold px-8 py-4 rounded-xl text-base transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 min-w-[200px] cursor-pointer disabled:opacity-75"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-white" />
                <span>Scanning Site...</span>
              </>
            ) : (
              <>
                <span>Run Health Audit</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </motion.button>
        </form>

        {/* Scanning step loader animation */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs sm:text-sm text-indigo-300 font-medium"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" />
                <span>{loadingStep || 'Analyzing DOM structure & SEO rules...'}</span>
              </div>
              <div className="h-1.5 w-32 bg-slate-950 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Presets */}
        <div className="mt-4 pt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Quick Try:
          </span>
          {presetUrls.slice(0, 4).map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setInputUrl(preset.url);
                onSubmitUrl(preset.url);
              }}
              className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-indigo-300 border border-slate-800/80 transition-all cursor-pointer"
            >
              {preset.label.split(' ')[0]} ({new URL(preset.url).hostname})
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
