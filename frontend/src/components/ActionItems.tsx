import React, { useState } from 'react';
import { AuditIssue, Category, Severity } from '../types';
import {
  ListChecks,
  CheckSquare,
  Square,
  Clock,
  Check,
  Copy,
  Code2,
  TrendingUp,
  AlertOctagon,
  AlertTriangle,
  Info,
  Terminal,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ActionItemsProps {
  issues: AuditIssue[];
  selectedFixes: Set<string>;
  onToggleFix: (ruleId: string, gain: number) => void;
  simulatedGain: number;
}

type Framework = 'html' | 'react' | 'vue' | 'nextjs' | 'svelte';

const EXTENSION_MAP: Record<Framework, string> = {
  html: 'index.html',
  react: 'PageHeader.tsx',
  vue: 'Header.vue',
  nextjs: 'app/layout.tsx',
  svelte: 'Header.svelte'
};

export const ActionItems: React.FC<ActionItemsProps> = ({
  issues,
  selectedFixes,
  onToggleFix,
  simulatedGain
}) => {
  const [severityFilter, setSeverityFilter] = useState<'all' | Severity>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | Category>('all');
  const [activeFrameworks, setActiveFrameworks] = useState<Record<string, Framework>>({});
  const [copiedIssueId, setCopiedIssueId] = useState<string | null>(null);

  const filteredIssues = issues.filter((issue) => {
    if (severityFilter !== 'all' && issue.severity !== severityFilter) return false;
    if (categoryFilter !== 'all' && issue.category !== categoryFilter) return false;
    return true;
  });

  const handleCopyCode = (issueId: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedIssueId(issueId);
    setTimeout(() => setCopiedIssueId(null), 2000);
  };

  const getFrameworkTab = (issueId: string): Framework => {
    return activeFrameworks[issueId] || 'html';
  };

  const setFrameworkTab = (issueId: string, framework: Framework) => {
    setActiveFrameworks((prev) => ({ ...prev, [issueId]: framework }));
  };

  return (
    <section className="space-y-6 my-8">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-sky-500/10 via-cyan-500/5 to-white p-6 rounded-3xl border border-sky-100 shadow-lg shadow-sky-500/5">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-sky-500 to-cyan-400 rounded-2xl text-white shadow-md shadow-sky-500/20">
              <ListChecks className="w-6 h-6 !text-white" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Prioritized Action Items ({filteredIssues.length})
            </h2>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1 pl-1">
            Check off items below to simulate real-time health score improvements before committing code.
          </p>
        </div>

        {/* Simulated Score Banner */}
        <AnimatePresence>
          {simulatedGain > 0 && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 !text-white px-5 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/20"
            >
              <TrendingUp className="w-4 h-4 !text-emerald-100" />
              <span className="!text-white">
                Simulated Gain: <strong className="text-base font-black !text-white">+{simulatedGain}%</strong>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-200/50 p-1.5 rounded-2xl border border-slate-200/80">
          <span className="text-slate-400 px-2 font-black uppercase tracking-wider text-[10px]">Severity:</span>
          {(['all', 'critical', 'warning', 'optimization'] as const).map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-3.5 py-1.5 rounded-xl font-bold capitalize transition-all cursor-pointer ${
                severityFilter === sev
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-1.5 bg-slate-200/50 p-1.5 rounded-2xl border border-slate-200/80">
          <span className="text-slate-400 px-2 font-black uppercase tracking-wider text-[10px]">Category:</span>
          {(['all', 'seo', 'performance', 'accessibility', 'security'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3.5 py-1.5 rounded-xl font-bold uppercase transition-all cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-gradient-to-r from-sky-500 to-cyan-500 !text-white shadow-md shadow-sky-500/20'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Action Cards List */}
      <div className="space-y-6">
        {filteredIssues.length === 0 ? (
          <div className="p-10 bg-white/80 border border-slate-200 rounded-3xl text-center space-y-2 shadow-sm">
            <CheckSquare className="w-10 h-10 text-emerald-500 mx-auto" />
            <h3 className="text-base font-extrabold text-slate-800">No matching issues found</h3>
            <p className="text-xs text-slate-500">All rules in this filter criteria passed successfully!</p>
          </div>
        ) : (
          filteredIssues.map((issue) => {
            const isChecked = selectedFixes.has(issue.rule_id);
            const currentFramework = getFrameworkTab(issue.id);
            const codeSnippet = issue.suggested_fix[currentFramework];

            let cardGradient = 'from-rose-500/10 via-rose-500/5 to-white';
            let severityBadge = 'bg-rose-100/80 text-rose-700 border-rose-200';
            let SeverityIcon = AlertOctagon;

            if (issue.severity === 'warning') {
              cardGradient = 'from-amber-500/10 via-amber-500/5 to-white';
              severityBadge = 'bg-amber-100/80 text-amber-800 border-amber-200';
              SeverityIcon = AlertTriangle;
            } else if (issue.severity === 'optimization') {
              cardGradient = 'from-sky-500/10 via-sky-500/5 to-white';
              severityBadge = 'bg-sky-100/80 text-sky-800 border-sky-200';
              SeverityIcon = Info;
            }

            if (isChecked) {
              cardGradient = 'from-emerald-500/15 via-emerald-500/5 to-white';
            }

            return (
              <motion.div
                key={issue.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white rounded-3xl border transition-all duration-300 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-sky-500/10 overflow-hidden ${
                  isChecked
                    ? 'border-emerald-400 ring-2 ring-emerald-400/20'
                    : 'border-slate-200/90'
                }`}
              >
                {/* Gradient Top Header Banner (Inspired by mock target) */}
                <div className={`bg-gradient-to-r ${cardGradient} p-5 md:px-6 md:py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3`}>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => onToggleFix(issue.rule_id, issue.estimated_score_gain)}
                      className="text-slate-300 hover:text-emerald-600 transition-transform active:scale-95 cursor-pointer shrink-0"
                      title={isChecked ? 'Uncheck to revert score simulation' : 'Check to simulate health gain'}
                    >
                      {isChecked ? (
                        <CheckSquare className="w-6 h-6 text-emerald-600" />
                      ) : (
                        <Square className="w-6 h-6 hover:text-slate-400" />
                      )}
                    </button>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-xs font-black px-3 py-1 rounded-xl border flex items-center gap-1.5 uppercase tracking-wide ${severityBadge}`}>
                        <SeverityIcon className="w-3.5 h-3.5" />
                        {issue.severity}
                      </span>
                      <span className="bg-emerald-500 text-white text-xs font-black px-3 py-1 rounded-xl shadow-sm">
                        +{issue.estimated_score_gain}% Gain
                      </span>
                      <span className="bg-slate-900 !text-slate-100 text-xs font-bold px-2.5 py-0.5 rounded-lg uppercase">
                        {issue.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200/60 self-start sm:self-auto shadow-2xs">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Fix Time: <strong className="text-slate-800">{issue.estimated_fix_time}</strong></span>
                  </div>
                </div>

                {/* Main Card Body */}
                <div className="p-5 md:p-6 space-y-4">
                  {/* Title & Business Impact */}
                  <div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                      {issue.title}
                    </h3>
                    <p className="text-sm text-slate-600 font-medium mt-1 leading-relaxed">
                      {issue.business_impact}
                    </p>
                  </div>

                  {/* DOM Context Pill */}
                  <div className="text-xs bg-slate-100 text-slate-800 p-3 rounded-2xl border border-slate-200 flex items-center gap-2.5 font-mono overflow-x-auto">
                    <Terminal className="w-4 h-4 text-sky-600 shrink-0" />
                    <span className="shrink-0 text-slate-500 font-sans font-extrabold">DOM Context:</span>
                    <span className="text-sky-700 font-bold">{issue.location_context}</span>
                  </div>

                  {/* Multi-Framework Code Window */}
                  <div className="pt-2 space-y-2.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Code2 className="w-3.5 h-3.5 text-sky-600" />
                        Recommended Code Fix
                      </span>

                      {/* Framework Tab Buttons */}
                      <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs">
                        {(['html', 'react', 'vue', 'nextjs', 'svelte'] as const).map((fw) => (
                          <button
                            key={fw}
                            onClick={() => setFrameworkTab(issue.id, fw)}
                            className={`px-3 py-1 rounded-xl font-extrabold capitalize transition-all cursor-pointer ${
                              currentFramework === fw
                                ? 'bg-sky-600 !text-white shadow-sm'
                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                            }`}
                          >
                            {fw === 'nextjs' ? 'Next.js' : fw}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Dark Code Window Box */}
                    <div className="rounded-2xl border border-slate-800 overflow-hidden shadow-xl bg-[#0f172a]">
                      {/* Window Header */}
                      <div className="bg-[#1e293b] px-4 py-2.5 border-b border-slate-700/80 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                          </div>
                          <span className="ml-2 font-mono text-[11px] !text-slate-300 font-bold">
                            {EXTENSION_MAP[currentFramework]}
                          </span>
                        </div>

                        {/* High-Contrast Copy Button */}
                        <button
                          type="button"
                          onClick={() => handleCopyCode(issue.id, codeSnippet)}
                          className="!bg-slate-700 hover:!bg-slate-600 !text-white px-3 py-1 rounded-xl text-xs font-bold border border-slate-500/50 transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                        >
                          {copiedIssueId === issue.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 !text-emerald-400" />
                              <span className="!text-emerald-400 font-extrabold">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 !text-slate-200" />
                              <span className="!text-white font-extrabold">Copy</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Code Content */}
                      <pre className="p-4 text-xs sm:text-sm !text-cyan-300 overflow-x-auto font-mono leading-relaxed max-h-60 selection:bg-sky-500/30">
                        <code>{codeSnippet}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </section>
  );
};