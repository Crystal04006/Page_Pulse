import React, { useState } from 'react';
import { AuditHistoryItem } from '../types';
import { History, Search, RotateCcw, Trash2, Database } from 'lucide-react';
import { motion } from 'motion/react';

interface HistoryTableProps {
  history: AuditHistoryItem[];
  onSelectAudit: (url: string) => void;
  onClearHistory: () => void;
}

export const HistoryTable: React.FC<HistoryTableProps> = ({
  history = [],
  onSelectAudit,
  onClearHistory
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Safe null-checking filter to prevent crash on missing or undefined url/fields
  const filtered = (history || []).filter((item) => {
    if (!item) return false;
    const url = item.url || '';
    return url.toLowerCase().includes((searchTerm || '').toLowerCase());
  });

  return (
    <section className="bg-slate-900/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl my-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2.5">
          <History className="w-5 h-5 text-indigo-400" />
          <h2 className="text-lg font-bold text-white tracking-tight">
            Recent Audit History
          </h2>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-950 text-slate-400 border border-slate-800 flex items-center gap-1">
            <Database className="w-3 h-3 text-indigo-400" />
            Local Engine Store
          </span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Search bar */}
          <div className="relative flex-grow sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search history..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {history && history.length > 0 && (
            <button
              onClick={onClearHistory}
              title="Clear all audit logs"
              className="p-2 bg-slate-950 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-500/30 rounded-xl transition-all cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/80 text-slate-400 uppercase font-extrabold tracking-wider border-b border-slate-800">
            <tr>
              <th className="p-3.5 rounded-l-xl">Audit ID</th>
              <th className="p-3.5">Target Website</th>
              <th className="p-3.5">Health Score</th>
              <th className="p-3.5">Response Time</th>
              <th className="p-3.5">HTTP Status</th>
              <th className="p-3.5">Timestamp</th>
              <th className="p-3.5 text-right rounded-r-xl">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-medium">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-6 text-center text-slate-500">
                  No historical audits match your search query.
                </td>
              </tr>
            ) : (
              filtered.map((row, index) => {
                if (!row) return null;

                const score = row.health_score ?? 0;
                let scoreColor = 'text-emerald-400';
                if (score < 50) scoreColor = 'text-rose-400';
                else if (score < 80) scoreColor = 'text-amber-400';

                // Safe date formatting
                let formattedTime = 'N/A';
                if (row.created_at) {
                  try {
                    formattedTime = new Date(row.created_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    });
                  } catch {
                    formattedTime = String(row.created_at);
                  }
                }

                return (
                  <motion.tr
                    key={row.id || `hist-${index}`}
                    whileHover={{ backgroundColor: 'rgba(30, 41, 59, 0.4)' }}
                    className="transition-colors"
                  >
                    <td className="p-3.5 font-mono text-slate-500">{row.id || `hist-${index}`}</td>
                    <td className="p-3.5 font-bold text-white max-w-xs truncate">
                      {row.url || 'Unknown URL'}
                    </td>
                    <td className={`p-3.5 font-extrabold text-sm ${scoreColor}`}>
                      {score}%
                    </td>
                    <td className="p-3.5 font-mono text-slate-300">
                      {row.response_time_ms ?? 0} ms
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded font-mono bg-slate-950 border border-slate-800 text-slate-300">
                        {row.status_code ?? 200}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-400">
                      {formattedTime}
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => onSelectAudit(row.url)}
                        className="px-2.5 py-1 rounded-lg bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white border border-indigo-500/20 font-bold transition-all flex items-center gap-1 ml-auto cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Re-Audit</span>
                      </button>
                    </td>
                  </motion.tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};