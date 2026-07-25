import React from 'react';
import { AuditMetrics } from '../types';
import { Clock, ShieldCheck, Heading1, Share2, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface MetricsCardsProps {
  metrics: AuditMetrics;
}

export const MetricsCards: React.FC<MetricsCardsProps> = ({ metrics }) => {
  // Latency styling
  const latency = metrics.response_time_ms;
  const isSpeedGood = latency < 600;
  const isSpeedModerate = latency >= 600 && latency <= 1500;

  // H1 status
  const h1Count = metrics.h1_count;
  const isH1Ideal = h1Count === 1;

  // Status code
  const code = metrics.status_code;
  const isCode200 = code === 200;

  // OpenGraph completeness calculation
  let ogPoints = 0;
  if (metrics.meta_title) ogPoints += 25;
  if (metrics.meta_description) ogPoints += 35;
  if (metrics.og_image) ogPoints += 25;
  if (metrics.canonical_url) ogPoints += 15;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. HTTP Status */}
      <motion.div
        whileHover={{ y: -3 }}
        className="bg-slate-900/80 backdrop-blur-md p-5 rounded-2xl border border-slate-800 flex flex-col justify-between shadow-lg"
      >
        <div className="flex justify-between items-start">
          <span className="text-slate-400 text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            HTTP Status
          </span>
          <span
            className="text-slate-500 hover:text-slate-300 cursor-pointer"
            title="HTTP response code returned by target server (200 OK is healthy)."
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </span>
        </div>

        <div className="my-3">
          <div className="text-3xl font-extrabold text-white flex items-baseline gap-2">
            <span>{code}</span>
            <span className="text-xs font-bold text-slate-400">{metrics.status_text}</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {isCode200 ? '200 OK — Healthy Connection' : 'Non-200 Server Response'}
          </p>
        </div>

        <div className={`h-2 w-full rounded-full ${isCode200 ? 'bg-emerald-500' : 'bg-rose-500'}`} />
      </motion.div>

      {/* 2. Response Speed (Latency) */}
      <motion.div
        whileHover={{ y: -3 }}
        className="bg-slate-900/80 backdrop-blur-md p-5 rounded-2xl border border-slate-800 flex flex-col justify-between shadow-lg"
      >
        <div className="flex justify-between items-start">
          <span className="text-slate-400 text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-blue-400" />
            Response Latency
          </span>
          <span
            className="text-slate-500 hover:text-slate-300 cursor-pointer"
            title="Time to fetch raw page HTML payload in milliseconds."
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </span>
        </div>

        <div className="my-3">
          <div className="text-3xl font-extrabold text-white">
            {latency} <span className="text-base font-normal text-slate-400">ms</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {isSpeedGood ? '⚡ Blazing Fast (<600ms)' : isSpeedModerate ? '🟡 Acceptable Speed' : '🔴 High Latency Delay'}
          </p>
        </div>

        <div
          className={`h-2 w-full rounded-full ${
            isSpeedGood ? 'bg-emerald-500' : isSpeedModerate ? 'bg-amber-500' : 'bg-rose-500'
          }`}
        />
      </motion.div>

      {/* 3. H1 Tag Count */}
      <motion.div
        whileHover={{ y: -3 }}
        className="bg-slate-900/80 backdrop-blur-md p-5 rounded-2xl border border-slate-800 flex flex-col justify-between shadow-lg"
      >
        <div className="flex justify-between items-start">
          <span className="text-slate-400 text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5">
            <Heading1 className="w-4 h-4 text-indigo-400" />
            H1 Headings
          </span>
          <span
            className="text-slate-500 hover:text-slate-300 cursor-pointer"
            title="Number of main title <h1> tags found. Exactly 1 H1 is optimal for SEO."
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </span>
        </div>

        <div className="my-3">
          <div className="text-3xl font-extrabold text-white">
            {h1Count} <span className="text-sm font-normal text-slate-400">tags</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {isH1Ideal ? 'Optimal (Exactly 1 H1 Tag)' : h1Count === 0 ? 'Critical: 0 H1 Tags Found' : `Warning: ${h1Count} Duplicate H1s`}
          </p>
        </div>

        <div className={`h-2 w-full rounded-full ${isH1Ideal ? 'bg-emerald-500' : 'bg-amber-500'}`} />
      </motion.div>

      {/* 4. OpenGraph & Meta Completeness */}
      <motion.div
        whileHover={{ y: -3 }}
        className="bg-slate-900/80 backdrop-blur-md p-5 rounded-2xl border border-slate-800 flex flex-col justify-between shadow-lg"
      >
        <div className="flex justify-between items-start">
          <span className="text-slate-400 text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5">
            <Share2 className="w-4 h-4 text-emerald-400" />
            Social & Meta
          </span>
          <span
            className="text-slate-500 hover:text-slate-300 cursor-pointer"
            title="Completeness of title, description, and social share image preview tags."
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </span>
        </div>

        <div className="my-3">
          <div className="text-3xl font-extrabold text-white">
            {ogPoints}%
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {ogPoints >= 80 ? 'Full Social Cards Configured' : 'Incomplete OpenGraph Tags'}
          </p>
        </div>

        <div
          className={`h-2 w-full rounded-full ${
            ogPoints >= 80 ? 'bg-emerald-500' : ogPoints >= 50 ? 'bg-amber-500' : 'bg-rose-500'
          }`}
        />
      </motion.div>
    </div>
  );
};
