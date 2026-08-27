import React from 'react';
import { AlertCircle, ShieldCheck } from 'lucide-react';

interface Props {
  className?: string;
  variant?: 'banner' | 'inline' | 'subtle';
}

export const DisclaimerBanner: React.FC<Props> = ({ className = '', variant = 'banner' }) => {
  if (variant === 'inline') {
    return (
      <div className={`flex items-center gap-1.5 text-xs text-amber-400/90 font-medium ${className}`}>
        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 text-amber-400" />
        <span>AI-generated content may require human review.</span>
      </div>
    );
  }

  if (variant === 'subtle') {
    return (
      <div className={`flex items-center justify-between text-xs text-slate-400 bg-slate-900/60 border border-slate-800/80 rounded-lg px-3 py-2 ${className}`}>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-indigo-400" />
          <span>Professional AI Guardrails active • <strong>AI-generated content may require human review.</strong></span>
        </div>
        <span className="text-[11px] text-slate-500 hidden sm:inline">Verification recommended before distribution</span>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-l-4 border-amber-500/80 text-amber-200/95 px-4 py-2.5 rounded-r-lg text-xs flex items-center justify-between shadow-sm backdrop-blur-sm ${className}`}>
      <div className="flex items-center gap-2.5">
        <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 animate-pulse" />
        <div>
          <span className="font-semibold text-amber-300">Human-in-the-Loop Notice:</span>{' '}
          <span>AI-generated content may require human review. Always verify sensitive data, legal terms, and operational details.</span>
        </div>
      </div>
      <span className="bg-amber-500/20 text-amber-300 font-mono text-[10px] uppercase px-2 py-0.5 rounded border border-amber-500/30 hidden md:inline">
        Compliance Safe
      </span>
    </div>
  );
};
