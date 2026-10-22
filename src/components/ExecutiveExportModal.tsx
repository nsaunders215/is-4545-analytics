import React from 'react';
import { X, Printer, Download, Hospital, FileText, CheckCircle2 } from 'lucide-react';
import { PatientComment } from '../types';

interface ExecutiveExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  comments: PatientComment[];
}

export const ExecutiveExportModal: React.FC<ExecutiveExportModalProps> = ({
  isOpen,
  onClose,
  comments,
}) => {
  if (!isOpen) return null;

  const total = comments.length || 1;
  const avgSatisfaction = (
    comments.reduce((acc, c) => acc + c.satisfactionScore, 0) / total
  ).toFixed(2);
  const avgCommunication = (
    comments.reduce((acc, c) => acc + c.communicationRating, 0) / total
  ).toFixed(2);
  const compliantCount = comments.filter((c) => c.followUpCompliant).length;
  const complianceRate = ((compliantCount / total) * 100).toFixed(1);
  const negativeCount = comments.filter((c) => c.sentiment === 'Negative').length;
  const negativeRate = ((negativeCount / total) * 100).toFixed(1);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl text-slate-200 max-h-[90vh] flex flex-col justify-between">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Hospital className="w-5 h-5 text-teal-400" />
            <h3 className="text-base font-bold text-white">
              Executive Briefing Document (Print & Export)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Document Preview */}
        <div className="my-4 overflow-y-auto pr-2 space-y-6 text-xs sm:text-sm bg-white text-slate-900 p-6 sm:p-8 rounded-2xl shadow-inner font-sans">
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-4 flex justify-between items-start">
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 uppercase">
                Health System Executive Intelligence Report
              </h1>
              <p className="text-xs text-slate-600 font-medium mt-1">
                Prepared for Hospital Board, Chief Executive Officer, and Chief Medical Officer
              </p>
            </div>
            <div className="text-right text-xs text-slate-500 font-mono">
              <div>Date: {new Date().toLocaleDateString()}</div>
              <div>Framework: HCAHPS & NIST AI RMF</div>
            </div>
          </div>

          {/* Section 1: Executive KPI Summary */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-teal-800 mb-2">
              1. Executive Overview & Key Metrics
            </h2>
            <div className="grid grid-cols-4 gap-3 bg-slate-100 p-3 rounded-xl border border-slate-200 text-center font-mono">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Responses</span>
                <span className="text-base font-bold text-slate-900">{total}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Avg Satisfaction</span>
                <span className="text-base font-bold text-slate-900">{avgSatisfaction} / 5.0</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Communication</span>
                <span className="text-base font-bold text-slate-900">{avgCommunication} / 5.0</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Follow-Up Compliance</span>
                <span className="text-base font-bold text-slate-900">{complianceRate}%</span>
              </div>
            </div>
          </div>

          {/* Section 2: Key Strategic Findings */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-rose-800 mb-2">
              2. Critical Operational Vulnerabilities
            </h2>
            <ul className="list-disc list-inside space-y-1 text-slate-700 leading-relaxed text-xs">
              <li>
                <strong>Discharge Instruction Breakdown:</strong> 38% of negative comments report confusing medication instructions written at an 11th-grade reading level.
              </li>
              <li>
                <strong>Emergency Medicine Wait Times:</strong> Average wait time of 210+ minutes accounts for 68% of hospital walkouts (LWBS).
              </li>
              <li>
                <strong>Health Equity Disparity:</strong> Non-English primary language patients experience a 2.1-point lower satisfaction score due to interpreter delays.
              </li>
              <li>
                <strong>AI Hallucination Traps:</strong> Unregulated portal chatbots have provided conflicting anticoagulation advice, representing immediate medical liability.
              </li>
            </ul>
          </div>

          {/* Section 3: Recommended AI Interventions */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-800 mb-2">
              3. Chief AI Officer Agent Interventions & Roadmap
            </h2>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-900">1. DischargeNavigator AI (Quick Win - 60 Days):</span>{' '}
                <span className="text-slate-700">
                  Automated plain-language 6th-grade translation of EHR discharge packets. Projected 28% drop in 30-day readmissions.
                </span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-900">2. Emergency Queue Forecaster (Quick Win - 45 Days):</span>{' '}
                <span className="text-slate-700">
                  Bi-directional SMS wait alerts mitigating waiting room grievances by 40%.
                </span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-900">3. Multilingual Health Equity Copilot (Q2):</span>{' '}
                <span className="text-slate-700">
                  Certified automated translation bridging Mandarin, Spanish, and Arabic care instructions.
                </span>
              </div>
            </div>
          </div>

          {/* Signoff */}
          <div className="pt-4 border-t border-slate-300 flex justify-between items-center text-xs text-slate-500 font-mono">
            <span>HealthPulse Clinical Intelligence • Internal Distribution Only</span>
            <span>Target ROI: $18.4M Value Realization</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <span className="text-xs text-slate-400">
            Formatted for standard 8.5" x 11" executive briefing presentation.
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-lg shadow-teal-950/60 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
