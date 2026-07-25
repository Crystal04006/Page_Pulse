import React, { useState, useEffect } from 'react';
import { AuditData, AuditHistoryItem } from './types';
import { INITIAL_AUDIT_DATA, MOCK_HISTORY, SAMPLE_URLS } from './data/mockAudits';
import { runHealthAudit, fetchAuditHistory } from './services/api';
import { Header } from './components/Header';
import { AuditInput } from './components/AuditInput';
import { ScoreGauge } from './components/ScoreGauge';
import { MetricsCards } from './components/MetricsCards';
import { ActionItems } from './components/ActionItems';
import { AuditInspectorTabs } from './components/AuditInspectorTabs';
import { HistoryTable } from './components/HistoryTable';
import { ExportModal } from './components/ExportModal';
import { motion, AnimatePresence } from 'motion/react';
import { Server } from 'lucide-react';

export default function App() {
  const [auditData, setAuditData] = useState<AuditData>(INITIAL_AUDIT_DATA);
  const [isLiveBackend, setIsLiveBackend] = useState<boolean>(false);
  const [selectedFixes, setSelectedFixes] = useState<Set<string>>(new Set());
  const [history, setHistory] = useState<AuditHistoryItem[]>(() => {
    try {
      const stored = localStorage.getItem('page_pulse_history');
      return stored ? JSON.parse(stored) : MOCK_HISTORY;
    } catch (e) {
      return MOCK_HISTORY;
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [isExportOpen, setIsExportOpen] = useState(false);

  // 1. Initial Health Check Ping to FastAPI Server
  useEffect(() => {
    const checkBackendStatus = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/', { method: 'GET' });
        if (response.ok) {
          setIsLiveBackend(true);
        } else {
          setIsLiveBackend(false);
        }
      } catch (err) {
        setIsLiveBackend(false);
      }
    };

    checkBackendStatus();
  }, []);

  // 2. Save history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('page_pulse_history', JSON.stringify(history));
    } catch (e) {
      console.error('Failed to write history to local storage', e);
    }
  }, [history]);

  // 3. Handle URL Audit Execution
  const handleRunAudit = async (url: string) => {
    if (!url || !url.trim()) return;

    setIsLoading(true);
    setSelectedFixes(new Set());
    setLoadingStep('Connecting to FastAPI backend at http://127.0.0.1:8000/api/audit...');

    try {
      const { data: newAudit, isLiveBackend: isLive } = await runHealthAudit(url.trim());
      
      if (newAudit) {
        setAuditData(newAudit);
      }
      setIsLiveBackend(isLive);

      // Try fetching remote history or update local state
      const remoteHistory = await fetchAuditHistory(url.trim());
      if (remoteHistory && remoteHistory.length > 0) {
        setHistory(remoteHistory);
      } else if (newAudit) {
        const historyItem: AuditHistoryItem = {
          id: newAudit.id || `audit-${Date.now()}`,
          url: newAudit.url || url,
          health_score: newAudit.health_score ?? 100,
          response_time_ms: newAudit.metrics?.response_time_ms ?? 0,
          status_code: newAudit.metrics?.status_code ?? 200,
          created_at: newAudit.timestamp || new Date().toISOString(),
          issues_count: newAudit.issues?.length ?? 0
        };
        setHistory((prev) => [historyItem, ...prev.filter((item) => item.id !== historyItem.id)].slice(0, 15));
      }
    } catch (error) {
      console.error("Audit execution failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle Fix Checklist Simulator
  const handleToggleFix = (ruleId: string) => {
    setSelectedFixes((prev) => {
      const next = new Set(prev);
      if (next.has(ruleId)) {
        next.delete(ruleId);
      } else {
        next.add(ruleId);
      }
      return next;
    });
  };

  // Calculate simulated score gain
  let simulatedGain = 0;
  if (auditData?.issues) {
    auditData.issues.forEach((issue) => {
      if (selectedFixes.has(issue.rule_id)) {
        simulatedGain += issue.estimated_score_gain || 0;
      }
    });
  }

  const simulatedScore = Math.min(100, (auditData?.health_score || 0) + simulatedGain);

  // Download JSON
  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(auditData, null, 2)], { type: 'application/json' });
    const jsonUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = jsonUrl;
    link.download = `page-pulse-audit-${auditData.id || 'export'}.json`;
    link.click();
    URL.revokeObjectURL(jsonUrl);
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('page_pulse_history');
  };

  return (
    <div className="min-h-screen bg-[#080d1a] text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white antialiased">
      {/* Background ambient radial gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px]" />
      </div>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto p-4 sm:p-8 w-full relative z-10 space-y-8">
        {/* Header */}
        <Header
          onExportPdf={() => setIsExportOpen(true)}
          onExportJson={handleExportJson}
          onSelectSample={handleRunAudit}
          samples={SAMPLE_URLS}
        />

        {/* Backend Connectivity Status Badge */}
        <div className="flex items-center justify-between bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Server className={`w-4 h-4 ${isLiveBackend ? 'text-emerald-400' : 'text-amber-400'}`} />
            <span>
              Backend Mode:{' '}
              {isLiveBackend ? (
                <strong className="text-emerald-400 font-bold">FastAPI Live API (http://127.0.0.1:8000)</strong>
              ) : (
                <strong className="text-amber-400 font-bold">Client Engine (VSCode FastAPI Disconnected)</strong>
              )}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
            TARGET_API: http://127.0.0.1:8000/api/audit
          </span>
        </div>

        {/* Input Form */}
        <AuditInput
          onSubmitUrl={handleRunAudit}
          isLoading={isLoading}
          loadingStep={loadingStep}
          presetUrls={SAMPLE_URLS}
        />

        {/* Audit Results Dashboard */}
        <AnimatePresence mode="wait">
          {auditData && (
            <motion.div
              key={auditData.id || 'audit-view'}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              {/* Top Grid: Circular Health Score + Executive Metrics */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                <div className="lg:col-span-4 flex">
                  <div className="w-full">
                    <ScoreGauge
                      score={auditData.health_score ?? 100}
                      simulatedScore={simulatedScore}
                      simulatedGain={simulatedGain}
                    />
                  </div>
                </div>

                <div className="lg:col-span-8 flex flex-col justify-between">
                  <MetricsCards metrics={auditData.metrics} />
                </div>
              </div>

              {/* Prioritized Action Items Feed */}
              <ActionItems
                issues={auditData.issues || []}
                selectedFixes={selectedFixes}
                onToggleFix={handleToggleFix}
                simulatedGain={simulatedGain}
              />

              {/* Deep Inspector Tabs */}
              <AuditInspectorTabs metrics={auditData.metrics} url={auditData.url} />

              {/* History Table */}
              <HistoryTable
                history={history}
                onSelectAudit={handleRunAudit}
                onClearHistory={handleClearHistory}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Compliance Footer */}
      <footer className="border-t border-slate-900 mt-12 py-6 text-center text-slate-500 text-xs font-medium relative z-10 no-print">
        Built for{' '}
        <a
          href="https://digitalheroesco.com"
          target="_blank"
          rel="noreferrer"
          className="text-indigo-400 hover:text-indigo-300 font-extrabold underline underline-offset-4 transition-colors"
        >
          Digital Heroes Training Task
        </a>
      </footer>

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        auditData={auditData}
        onExportJson={handleExportJson}
      />
    </div>
  );
}