import React from 'react';
import { AuditData } from '../types';
import { FileJson, Printer, X, Download, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  auditData: AuditData;
  onExportJson: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  auditData,
  onExportJson
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="no-print fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl relative"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg bg-slate-950 border border-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="space-y-1">
            <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
              Export Health Report
            </h3>
            <p className="text-xs text-slate-400">
              Download or print the comprehensive developer SEO health report for <strong className="text-slate-200">{auditData.url}</strong>.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => {
                onClose();
                setTimeout(() => {
                  window.print();
                }, 150);
              }}
              className="w-full p-4 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-left flex items-center justify-between transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Printer className="w-5 h-5" />
                </div>
                <div>
                  <strong className="text-sm font-bold text-white block">Print or Save as PDF</strong>
                  <span className="text-xs text-slate-400">Formatted executive summary document</span>
                </div>
              </div>
            </button>

            <button
              onClick={() => {
                onClose();
                onExportJson();
              }}
              className="w-full p-4 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-left flex items-center justify-between transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <FileJson className="w-5 h-5" />
                </div>
                <div>
                  <strong className="text-sm font-bold text-white block">Download Raw JSON</strong>
                  <span className="text-xs text-slate-400">Complete audit payload for CI/CD integration</span>
                </div>
              </div>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
