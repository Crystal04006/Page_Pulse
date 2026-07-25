import React from 'react';
import { Activity, Download, FileJson, Sparkles, Layers, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface HeaderProps {
  onExportPdf: () => void;
  onExportJson: () => void;
  onSelectSample: (url: string) => void;
  samples: { label: string; url: string }[];
}

export const Header: React.FC<HeaderProps> = ({
  onExportPdf,
  onExportJson,
  onSelectSample,
  samples
}) => {
  return (
    <header className="border-b border-slate-800/80 pb-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      {/* Brand & Title */}
      <div className="flex items-center gap-3.5">
        <motion.div
          whileHover={{ scale: 1.05, rotate: 3 }}
          whileTap={{ scale: 0.95 }}
          className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-emerald-400 p-0.5 shadow-xl shadow-indigo-500/20 flex items-center justify-center"
        >
          <div className="h-full w-full bg-slate-950 rounded-[14px] flex items-center justify-center">
            <Activity className="w-6 h-6 text-blue-400 animate-pulse" />
          </div>
        </motion.div>

        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
              Page Pulse
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 tracking-wider">
              v3.1 PRO
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Engine Active
            </span>
          </div>
          <p className="text-slate-400 text-sm font-medium mt-0.5">
            Developer SEO Assistant & Instant Web Health Inspector
          </p>
        </div>
      </div>

      {/* Quick Actions & Samples Dropdown */}
      <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto no-print">
        {/* Sample URLs Quick Picker */}
        <div className="relative group">
          <select
            onChange={(e) => {
              if (e.target.value) onSelectSample(e.target.value);
              e.target.value = '';
            }}
            defaultValue=""
            className="bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500 cursor-pointer transition-all"
          >
            <option value="" disabled>
              ⚡ Load Preset Site...
            </option>
            {samples.map((s, idx) => (
              <option key={idx} value={s.url}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* JSON Export */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onExportJson}
          className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white px-3.5 py-2.5 rounded-xl text-xs font-semibold border border-slate-800 transition-all shadow-sm cursor-pointer"
        >
          <FileJson className="w-4 h-4 text-slate-400" />
          <span>JSON</span>
        </motion.button>

        {/* Export PDF Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onExportPdf}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold border border-indigo-500/30 shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
        >
          <Download className="w-4 h-4 text-indigo-200" />
          <span>Export Report PDF</span>
        </motion.button>
      </div>
    </header>
  );
};
