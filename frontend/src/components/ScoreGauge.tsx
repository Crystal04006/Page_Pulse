import React from 'react';
import { HelpCircle, ArrowUpRight, ShieldAlert, CheckCircle, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';

interface ScoreGaugeProps {
  score: number;
  simulatedScore?: number;
  simulatedGain?: number;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  score,
  simulatedScore,
  simulatedGain = 0
}) => {
  const displayScore = simulatedScore !== undefined ? simulatedScore : score;
  const circumference = 364.4; // 2 * PI * 58
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;

  let colorClass = 'text-emerald-500';
  let badgeBg = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  let badgeText = '🟢 Healthy Web Health';
  let Icon = CheckCircle;

  if (displayScore < 50) {
    colorClass = 'text-rose-500';
    badgeBg = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    badgeText = '🔴 Critical Action Required';
    Icon = ShieldAlert;
  } else if (displayScore < 80) {
    colorClass = 'text-amber-500';
    badgeBg = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    badgeText = '🟡 Needs Optimization';
    Icon = AlertTriangle;
  }

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl p-6 md:p-8 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-xl">
      {/* Background radial ambient glow */}
      <div className={`absolute -top-12 -left-12 w-40 h-40 rounded-full blur-3xl opacity-20 ${
        displayScore >= 80 ? 'bg-emerald-500' : displayScore >= 50 ? 'bg-amber-500' : 'bg-rose-500'
      }`} />

      <span className="text-slate-400 text-xs font-extrabold uppercase tracking-widest mb-3 flex items-center gap-1.5">
        Executive Health Score
        <span
          className="cursor-pointer text-slate-500 hover:text-slate-300 transition-colors"
          title="Weighted health index calculated from strict W3C, Google Lighthouse, and SEO audit policies."
        >
          <HelpCircle className="w-4 h-4" />
        </span>
      </span>

      {/* SVG Ring */}
      <div className="relative my-4 flex items-center justify-center">
        <svg className="w-44 h-44 transform -rotate-90">
          <circle
            cx="88"
            cy="88"
            r="58"
            stroke="currentColor"
            strokeWidth="14"
            className="text-slate-950/80"
            fill="transparent"
          />
          <motion.circle
            cx="88"
            cy="88"
            r="58"
            stroke="currentColor"
            strokeWidth="14"
            className={`${colorClass} transition-all duration-700 ease-out`}
            strokeDasharray={circumference}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: 'easeOut' }}
            fill="transparent"
            strokeLinecap="round"
          />
        </svg>

        {/* Score Number Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            key={displayScore}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-5xl font-black text-white tracking-tight"
          >
            {displayScore}%
          </motion.span>

          {simulatedGain > 0 && (
            <motion.span
              initial={{ y: 5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-xs font-bold text-emerald-400 flex items-center gap-0.5 mt-0.5"
            >
              <ArrowUpRight className="w-3.5 h-3.5" />+{simulatedGain}% Sim
            </motion.span>
          )}
        </div>
      </div>

      {/* Score Status Badge */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`mt-2 px-4 py-1.5 rounded-full text-xs font-extrabold border flex items-center gap-2 ${badgeBg}`}
      >
        <Icon className="w-4 h-4" />
        <span>{badgeText}</span>
      </motion.div>
    </div>
  );
};
