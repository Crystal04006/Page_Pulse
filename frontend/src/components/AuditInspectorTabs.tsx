import React, { useState } from 'react';
import { AuditMetrics } from '../types';
import {
  Layers,
  Heading,
  Image as ImageIcon,
  ShieldCheck,
  FileCode,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';

interface AuditInspectorTabsProps {
  metrics: AuditMetrics;
  url: string;
}

type TabType = 'meta' | 'headings' | 'images' | 'security';

export const AuditInspectorTabs: React.FC<AuditInspectorTabsProps> = ({ metrics, url }) => {
  const [activeTab, setActiveTab] = useState<TabType>('meta');

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-800 space-y-6 shadow-xl my-8">
      {/* Header & Tab Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            Deep Web Health Inspector
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Examine underlying page structures, OpenGraph social previews, and image accessibility.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('meta')}
            className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'meta' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Meta & Social</span>
          </button>

          <button
            onClick={() => setActiveTab('headings')}
            className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'headings' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Heading className="w-3.5 h-3.5" />
            <span>Headings Tree</span>
          </button>

          <button
            onClick={() => setActiveTab('images')}
            className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'images' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Image Alt ({metrics.images_missing_alt} missing)</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'security' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Security & Files</span>
          </button>
        </div>
      </div>

      {/* Tab Content Panels */}
      <div>
        {activeTab === 'meta' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Meta Tags Inspector */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 text-xs">
                <h3 className="font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  Primary Head Metadata
                </h3>

                <div>
                  <span className="text-slate-500 font-semibold block">Meta Title ({metrics.meta_title.length} chars)</span>
                  <div className="p-2.5 bg-slate-900 rounded-lg text-slate-100 font-mono mt-1 border border-slate-800">
                    {metrics.meta_title || <span className="text-rose-400 italic">Missing &lt;title&gt; tag</span>}
                  </div>
                </div>

                <div>
                  <span className="text-slate-500 font-semibold block">Meta Description ({metrics.meta_description.length} chars)</span>
                  <div className="p-2.5 bg-slate-900 rounded-lg text-slate-200 font-mono mt-1 border border-slate-800">
                    {metrics.meta_description || <span className="text-rose-400 italic">Missing meta description</span>}
                  </div>
                </div>

                <div>
                  <span className="text-slate-500 font-semibold block">Canonical URL</span>
                  <div className="p-2.5 bg-slate-900 rounded-lg text-indigo-300 font-mono mt-1 border border-slate-800 truncate">
                    {metrics.canonical_url || <span className="text-amber-400 italic">No canonical link declared</span>}
                  </div>
                </div>
              </div>

              {/* Social Media Share Preview Simulation */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <h3 className="font-bold text-xs text-slate-200 uppercase tracking-wider">
                  Social Share Card Preview
                </h3>

                <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden max-w-sm mx-auto shadow-xl">
                  <div className="h-36 bg-slate-800 flex items-center justify-center relative overflow-hidden">
                    {metrics.og_image ? (
                      <img src={metrics.og_image} alt="OG Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-slate-500 text-xs font-mono text-center p-4">
                        <ImageIcon className="w-8 h-8 mx-auto mb-1 text-slate-600" />
                        No OpenGraph og:image preview tag found
                      </div>
                    )}
                  </div>
                  <div className="p-3.5 space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      {new URL(url.startsWith('http') ? url : 'https://' + url).hostname}
                    </span>
                    <h4 className="text-xs font-bold text-white truncate">
                      {metrics.meta_title || 'Untitled Web Page'}
                    </h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2">
                      {metrics.meta_description || 'No meta description provided for social card preview.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'headings' && (
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
            <h3 className="font-bold text-slate-200 uppercase tracking-wider font-sans">
              Heading Tag Structure Tree
            </h3>

            <div className="space-y-2">
              <div className="flex items-center gap-2 p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 font-extrabold text-[10px]">H1</span>
                {metrics.h1_count === 1 ? (
                  <span className="text-emerald-400 font-semibold">{metrics.meta_title || 'Primary Page H1 Title'}</span>
                ) : metrics.h1_count === 0 ? (
                  <span className="text-rose-400 font-semibold italic">Missing &lt;h1&gt; Tag</span>
                ) : (
                  <span className="text-amber-400 font-semibold">{metrics.h1_count} Multiple Duplicate H1 Tags Found</span>
                )}
              </div>

              <div className="pl-6 space-y-1.5 border-l-2 border-slate-800">
                {Array.from({ length: metrics.h2_count }).map((_, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 bg-slate-900/60 rounded border border-slate-800/60">
                    <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 font-bold text-[10px]">H2</span>
                    <span className="text-slate-300">Section Subheading {idx + 1}: Key Feature & Value</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'images' && (
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-slate-200 uppercase tracking-wider">
                Image Accessibility Audit
              </h3>
              <span className="text-slate-400">
                Total Images: <strong className="text-white">{metrics.total_images}</strong> | Missing Alt: <strong className="text-rose-400">{metrics.images_missing_alt}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex items-start gap-3">
                <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">/assets/hero-illustration.png</span>
                  <span className="text-rose-400 text-[11px] block mt-0.5">Missing alt attribute (WCAG Violation)</span>
                </div>
              </div>

              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">/assets/logo-icon.svg</span>
                  <span className="text-emerald-400 text-[11px] block mt-0.5">alt="Page Pulse Developer Assistant Logo"</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-semibold">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
              <span>SSL Encryption (HTTPS)</span>
              {metrics.ssl_active ? (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Active
                </span>
              ) : (
                <span className="text-rose-400 font-bold flex items-center gap-1">
                  <XCircle className="w-4 h-4" /> Insecure
                </span>
              )}
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
              <span>Robots.txt Crawl File</span>
              {metrics.has_robots_txt ? (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Found
                </span>
              ) : (
                <span className="text-amber-400 font-bold">Missing</span>
              )}
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
              <span>XML Sitemap Index</span>
              {metrics.has_sitemap ? (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Valid
                </span>
              ) : (
                <span className="text-amber-400 font-bold">Not Detected</span>
              )}
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
              <span>Total Page Payload Size</span>
              <span className="text-indigo-400 font-mono font-bold">
                {(metrics.page_size_kb / 1024).toFixed(2)} MB
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
