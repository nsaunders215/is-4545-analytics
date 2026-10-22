import React from 'react';
import {
  ShieldAlert,
  Bot,
  UserCheck,
  AlertTriangle,
  Eye,
  CheckCircle2,
  FileWarning,
} from 'lucide-react';
import { PatientComment } from '../types';

interface AIRiskMonitoringProps {
  comments: PatientComment[];
  onSelectComment?: (comment: PatientComment) => void;
}

export const AIRiskMonitoring: React.FC<AIRiskMonitoringProps> = ({
  comments,
  onSelectComment,
}) => {
  // 1. Hallucination Trap Comments
  const hallucinationComments = comments.filter((c) =>
    c.issueCategories.includes('HallucinationTrap') ||
    c.commentText.toLowerCase().includes('chatbot') ||
    c.commentText.toLowerCase().includes('conflicting advice') ||
    c.commentText.toLowerCase().includes('hallucination')
  );

  // 2. Bias-related Comments
  const biasComments = comments.filter((c) =>
    c.issueCategories.includes('BiasRisk') ||
    c.commentText.toLowerCase().includes('uninsured') ||
    c.commentText.toLowerCase().includes('condescend') ||
    c.commentText.toLowerCase().includes('dismissive') ||
    c.commentText.toLowerCase().includes('equity training')
  );

  // 3. Cases Requiring Human Clinical Review
  const humanReviewComments = comments.filter((c) =>
    c.issueCategories.includes('HumanReviewNeeded') ||
    c.commentText.toLowerCase().includes('wrong dose') ||
    c.commentText.toLowerCase().includes('near miss') ||
    c.commentText.toLowerCase().includes('clerical error') ||
    c.commentText.toLowerCase().includes('stroke risk') ||
    c.commentText.toLowerCase().includes('sublingually')
  );

  return (
    <section className="mb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-400 bg-rose-950/60 border border-rose-800/80 px-2.5 py-0.5 rounded-full">
            Section 7
          </span>
          <h2 className="text-xl font-bold text-white tracking-tight">
            AI Risk Monitoring & Clinical Safety Sentry
          </h2>
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <span className="bg-rose-500/10 text-rose-300 border border-rose-500/30 px-2.5 py-1 rounded-xl font-mono">
            NIST AI RMF 1.0 Aligned
          </span>
        </div>
      </div>

      {/* 3 Risk Severity Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        {/* Risk 1: Hallucination Traps */}
        <div className="bg-slate-900/90 border border-rose-900/50 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-rose-500/10 text-rose-400 rounded-xl">
              <Bot className="w-5 h-5" />
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-950 text-rose-300 border border-rose-800">
              {hallucinationComments.length} Flagged
            </span>
          </div>
          <h3 className="text-sm font-bold text-white mt-3">
            Hallucination Trap Comments
          </h3>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            Identifies automated portal chatbot responses and templated EHR drafts providing contradictory drug guidance or dangerous medical advice.
          </p>
          <div className="mt-3 text-[11px] text-rose-400 font-medium">
            Status: Active Guardrails Interception Required
          </div>
        </div>

        {/* Risk 2: Bias-Related Comments */}
        <div className="bg-slate-900/90 border border-amber-900/50 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-950 text-amber-300 border border-amber-800">
              {biasComments.length} Flagged
            </span>
          </div>
          <h3 className="text-sm font-bold text-white mt-3">
            Bias-Related Comments
          </h3>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            Flags linguistic or socioeconomic sentiment disparities where underinsured, elderly, or LEP patients report substandard clinical empathy.
          </p>
          <div className="mt-3 text-[11px] text-amber-400 font-medium">
            Status: Algorithmic Parity Audit Underway
          </div>
        </div>

        {/* Risk 3: Human Review Required */}
        <div className="bg-slate-900/90 border border-purple-900/50 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-purple-500/10 text-purple-400 rounded-xl">
              <UserCheck className="w-5 h-5" />
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-950 text-purple-300 border border-purple-800">
              {humanReviewComments.length} Near-Misses
            </span>
          </div>
          <h3 className="text-sm font-bold text-white mt-3">
            Mandatory Human Clinical Review
          </h3>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            Critical medication transcription errors, unmonitored anticoagulation tapers, and omitted emergency red-flag criteria.
          </p>
          <div className="mt-3 text-[11px] text-purple-400 font-medium">
            Status: Routed to Hospital Risk Committee
          </div>
        </div>
      </div>

      {/* Detailed Risk Registry Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <FileWarning className="w-4 h-4 text-rose-400" />
            <h3 className="text-sm font-bold text-white">
              AI Risk & Clinical Near-Miss Incident Registry
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            {humanReviewComments.length + hallucinationComments.length} Total Safety Incidents
          </span>
        </div>

        <div className="space-y-3">
          {[...hallucinationComments, ...biasComments, ...humanReviewComments]
            .filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i)
            .map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-slate-800/40 border border-rose-950 hover:border-rose-800/80 transition"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold text-rose-400">
                      {item.id}
                    </span>
                    <span className="text-xs text-white font-medium bg-slate-700 px-2 py-0.5 rounded">
                      {item.serviceLine}
                    </span>
                    <span className="text-xs text-slate-400">{item.patientPersona}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {item.issueCategories.map((cat) => (
                      <span
                        key={cat}
                        className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800"
                      >
                        {cat === 'HallucinationTrap'
                          ? '🤖 Hallucination Trap'
                          : cat === 'HumanReviewNeeded'
                          ? '🚨 Clinical Near Miss'
                          : cat === 'BiasRisk'
                          ? '⚖️ Bias Risk'
                          : cat}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans italic">
                  "{item.commentText}"
                </p>

                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
                  <span className="text-amber-400">
                    ⚠️ <strong>Clinical Safety Hazard:</strong> Patient safety compromised due to contradictory instructions or unverified chatbot output.
                  </span>
                  <span className="text-slate-500 font-mono">
                    Incident Date: {item.date}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};
