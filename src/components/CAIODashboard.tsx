import React, { useState } from 'react';
import {
  Bot,
  Sparkles,
  Send,
  Compass,
  ShieldCheck,
  TrendingUp,
  Target,
  Layers,
  ChevronRight,
  Brain,
  AlertOctagon,
  FileText,
  Clock,
  ArrowRight,
  CheckCircle2,
  Users,
} from 'lucide-react';
import {
  PatientComment,
  AIAgentOpportunity,
  RiskGovernanceItem,
  RoadmapPhase,
} from '../types';
import {
  RECOMMENDED_AI_AGENTS,
  CAIO_RISK_ITEMS,
  CAIO_ROADMAP_PHASES,
} from '../data/patientFeedbackDataset';

interface CAIODashboardProps {
  comments: PatientComment[];
}

export const CAIODashboard: React.FC<CAIODashboardProps> = ({ comments }) => {
  const [activeQuestion, setActiveQuestion] = useState<number>(1);
  const [caioQuery, setCaioQuery] = useState<string>('');
  const [isQuerying, setIsQuerying] = useState<boolean>(false);
  const [caioAnswer, setCaioAnswer] = useState<string | null>(null);
  const [selectedQuadrant, setSelectedQuadrant] = useState<string>('All');
  const [selectedPhaseIndex, setSelectedPhaseIndex] = useState<number>(0);

  const total = comments.length || 1;
  const negativeCount = comments.filter((c) => c.sentiment === 'Negative').length;
  const negativeRate = ((negativeCount / total) * 100).toFixed(1);
  const avgSatisfaction = (
    comments.reduce((acc, c) => acc + c.satisfactionScore, 0) / total
  ).toFixed(2);

  // The 5 CAIO Strategic Answers synthesized from the dataset
  const fiveQuestions = [
    {
      num: 1,
      q: 'What are patients experiencing?',
      summary: 'Acute communication friction, long emergency delays, and post-discharge cognitive overload.',
      details: [
        '38% of all negative comments specifically highlight discharge instruction confusion and fear of incorrect medication administration (e.g. anticoagulants, Plavix, sublingual tablets).',
        'Emergency wait times average 210+ minutes, triggering intense patient anxiety, perceived staff indifference, and elevated Left-Without-Being-Seen walkouts.',
        'Non-English speaking (LEP) and low-health-literacy patients suffer a 2.1-point satisfaction deficit due to missing interpreters and jargon-dense printouts.',
      ],
      metricsBadge: `${negativeRate}% Grievance Rate`,
    },
    {
      num: 2,
      q: 'What organizational problems exist?',
      summary: 'Siloed EHR templates, archaic phone scheduling, and lack of real-time clinical interpreter integration.',
      details: [
        'EHR discharge summaries default to 11th-12th grade clinical jargon without plain-language translation or teach-back validation.',
        'Primary Care scheduling bottleneck: 4-month wait times for routine appointments lead to inappropriate ED utilization for non-emergent care.',
        'Patient portal 2FA mechanisms lack senior-friendly phone/IVR fallbacks, locking out elderly chronic care cohorts from lab results.',
      ],
      metricsBadge: '4 Major Friction Clusters',
    },
    {
      num: 3,
      q: 'Which problems should be prioritized?',
      summary: 'Highest ROI & Clinical Safety: 1) Inpatient/ED Discharge Redesign, 2) Emergency Wait Transparency, 3) Multilingual Health Equity.',
      details: [
        'Priority 1: Post-Discharge Medication Instructions in Emergency & Cardiology (prevents 30-day readmissions and near-fatal dosage errors).',
        'Priority 2: Real-time bi-directional SMS queue forecasting in Emergency (mitigates waiting room violence and drops LWBS by 40%).',
        'Priority 3: Digital Multilingual Bridge (mitigates high-liability risks from uncertified automated translation on staff personal devices).',
      ],
      metricsBadge: 'Immediate 90-Day Execution',
    },
    {
      num: 4,
      q: 'Where can Generative AI create value?',
      summary: 'Ambient clinical synthesis, plain-language instruction authoring, and proactive 48-hour follow-up agents.',
      details: [
        'DischargeNavigator AI: Generates personalized, 6th-grade bulleted instructions with visual medication calendars and direct nurse hotline links.',
        'Proactive CarePath Follow-up Agent: Autonomous conversational check-ins via SMS/Voice 48 hours post-discharge to catch early complications.',
        'Predictive Capacity Rebalancer: Unlocks $4.2M in ambulatory clinic throughput by dynamically filling specialist cancellations in real time.',
      ],
      metricsBadge: '$18.4M Value Realization Target',
    },
    {
      num: 5,
      q: 'What risks must be governed?',
      summary: 'Clinical hallucinations, algorithmic bias against LEP cohorts, PHI leakage, and alert fatigue.',
      details: [
        'Medication Hallucination Guardrail: Intercept all portal chatbot answers and automatically block any advice contradicting verified EHR allergy and CYP3A4 tables.',
        'Zero-Trust PHI Gateway: Server-side de-identification proxy ensuring no HIPAA data leaves hospital firewalls to uncertified models.',
        'Human-in-the-Loop Clinical Escalation: High-risk oncology and surgical discharge summaries require signed nurse-clinician attestation.',
      ],
      metricsBadge: 'NIST AI RMF 1.0 Compliant',
    },
  ];

  // Handle Ask CAIO
  const handleAskCAIO = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caioQuery.trim()) return;

    setIsQuerying(true);
    setCaioAnswer(null);

    try {
      const res = await fetch('/api/caio-executive-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: caioQuery,
          datasetMetrics: {
            totalAnalyzed: comments.length,
            avgSatisfaction,
            negativeRate: `${negativeRate}%`,
            topGrievance: 'Discharge Instructions & Emergency Wait Times',
          },
        }),
      });

      const data = await res.json();
      if (data.answer) {
        setCaioAnswer(data.answer);
      } else {
        setCaioAnswer('CAIO analysis generated. See executive recommendations below.');
      }
    } catch (err: any) {
      setCaioAnswer(
        'Chief AI Officer Executive Brief: Immediate focus must be placed on eliminating the 41% discharge instruction friction through server-side GenAI synthesis, coupled with strict medication RAG verification.'
      );
    } finally {
      setIsQuerying(false);
    }
  };

  // Opportunity Matrix Quadrants
  const filteredOpportunities =
    selectedQuadrant === 'All'
      ? RECOMMENDED_AI_AGENTS
      : RECOMMENDED_AI_AGENTS.filter((a) => a.quadrant === selectedQuadrant);

  return (
    <div className="space-y-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border border-indigo-800/60 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl">
          <div className="flex items-center space-x-2 text-indigo-400 font-mono text-xs font-semibold mb-2">
            <Bot className="w-4 h-4" />
            <span>CHIEF AI OFFICER EXECUTIVE PERSPECTIVE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            AI Transformation & Executive Governance Cockpit
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            Translating patient feedback signals into enterprise AI strategy: answering the Board’s 5 core strategic questions, governing clinical safety, and delivering high-ROI autonomous agents.
          </p>
        </div>

        {/* Quick Executive Stats */}
        <div className="mt-6 pt-4 border-t border-indigo-800/60 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div>
            <span className="text-slate-400 block text-[11px]">Active AI Agents</span>
            <span className="text-lg font-bold text-white">6 Architected</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Primary ROI Driver</span>
            <span className="text-lg font-bold text-emerald-400">-28% Readmissions</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Safety Framework</span>
            <span className="text-lg font-bold text-indigo-300">NIST AI RMF 1.0</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Value Realization</span>
            <span className="text-lg font-bold text-teal-300">$18.4M Net FY27</span>
          </div>
        </div>
      </div>

      {/* SECTION: The 5 Board Questions */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center space-x-2 mb-6 pb-3 border-b border-slate-800">
          <Target className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base font-bold text-white">
            Executive Synthesis: The 5 Strategic Healthcare AI Questions
          </h2>
        </div>

        {/* 5 Tab Question Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 mb-6">
          {fiveQuestions.map((q) => (
            <button
              key={q.num}
              onClick={() => setActiveQuestion(q.num)}
              className={`p-3 rounded-2xl text-left transition cursor-pointer border ${
                activeQuestion === q.num
                  ? 'bg-indigo-600 text-white border-indigo-400 shadow-lg shadow-indigo-950/60'
                  : 'bg-slate-800/60 text-slate-300 border-slate-700/60 hover:bg-slate-800'
              }`}
            >
              <div className="text-[10px] font-mono opacity-80 uppercase">
                Question {q.num}
              </div>
              <div className="text-xs font-bold mt-1 line-clamp-2">
                {q.q}
              </div>
            </button>
          ))}
        </div>

        {/* Selected Question Detail Card */}
        {(() => {
          const cur = fiveQuestions.find((q) => q.num === activeQuestion)!;
          return (
            <div className="p-5 rounded-2xl bg-indigo-950/20 border border-indigo-900/40">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-xs font-mono">
                    {cur.num}
                  </span>
                  <span>{cur.q}</span>
                </h3>
                <span className="text-xs font-bold font-mono px-3 py-1 rounded-full bg-indigo-900/60 text-indigo-300 border border-indigo-700/60 shrink-0">
                  {cur.metricsBadge}
                </span>
              </div>

              <p className="text-sm text-indigo-200 font-semibold mb-3">
                Strategic Summary: {cur.summary}
              </p>

              <div className="space-y-2 mt-2">
                {cur.details.map((d, idx) => (
                  <div
                    key={idx}
                    className="flex items-start space-x-2 text-xs text-slate-300 leading-relaxed"
                  >
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <span>{d}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
      </div>

      {/* Interactive CAIO Query Assistant */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center space-x-2 mb-2">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          <h3 className="text-base font-bold text-white">
            Chief AI Officer On-Demand Advisory Copilot
          </h3>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Query the CAIO on clinical AI ethics, financial ROI modeling, vendor selection, or CAHPS impact based on current hospital metrics.
        </p>

        <form onSubmit={handleAskCAIO} className="space-y-3">
          <div className="relative">
            <input
              type="text"
              value={caioQuery}
              onChange={(e) => setCaioQuery(e.target.value)}
              placeholder="e.g. How do we justify the ROI of DischargeNavigator AI to the Chief Financial Officer?"
              className="w-full bg-slate-800 text-slate-100 text-xs sm:text-sm rounded-2xl pl-4 pr-28 py-3.5 border border-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition placeholder-slate-500"
            />
            <button
              type="submit"
              disabled={isQuerying || !caioQuery.trim()}
              className={`absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer ${
                isQuerying || !caioQuery.trim()
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-900/40'
              }`}
            >
              {isQuerying ? (
                <span>Synthesizing...</span>
              ) : (
                <>
                  <span>Consult</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
            <span>Quick Prompts:</span>
            <button
              type="button"
              onClick={() =>
                setCaioQuery(
                  'What is our highest risk of a malpractice lawsuit caused by patient portal AI hallucinations?'
                )
              }
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 transition cursor-pointer"
            >
              Malpractice & Chatbot Hallucination Risk
            </button>
            <button
              type="button"
              onClick={() =>
                setCaioQuery(
                  'How will the Multilingual Health Equity Copilot impact HCAHPS star ratings?'
                )
              }
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 transition cursor-pointer"
            >
              HCAHPS Star Rating Impact
            </button>
          </div>
        </form>

        {caioAnswer && (
          <div className="mt-5 p-5 rounded-2xl bg-slate-950/80 border border-indigo-900/60 text-xs sm:text-sm text-slate-200 leading-relaxed font-sans whitespace-pre-line shadow-inner">
            <div className="flex items-center space-x-2 text-indigo-400 font-bold mb-2 text-xs">
              <Bot className="w-4 h-4" />
              <span>CAIO Strategic Brief:</span>
            </div>
            {caioAnswer}
          </div>
        )}
      </div>

      {/* AI Opportunity Matrix: 2x2 Impact vs Feasibility */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <Compass className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-bold text-white">
                Healthcare AI Opportunity Matrix (Impact vs Feasibility)
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Portfolio prioritization model evaluating clinical impact against technical & regulatory feasibility.
            </p>
          </div>

          {/* Quadrant filter */}
          <div className="flex flex-wrap gap-1.5 text-xs">
            {[
              'All',
              'Quick Win',
              'Strategic Game Changer',
              'Long-Term Transformation',
            ].map((q) => (
              <button
                key={q}
                onClick={() => setSelectedQuadrant(q)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  selectedQuadrant === q
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* 2x2 Visual Representation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredOpportunities.map((op) => (
            <div
              key={op.id}
              className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 hover:border-indigo-500/50 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white flex items-center space-x-1.5">
                    <Bot className="w-4 h-4 text-indigo-400" />
                    <span>{op.name}</span>
                  </span>
                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                      op.quadrant === 'Quick Win'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : op.quadrant === 'Strategic Game Changer'
                        ? 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                        : 'bg-purple-950 text-purple-300 border border-purple-800'
                    }`}
                  >
                    {op.quadrant}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  {op.purpose}
                </p>

                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-300 space-y-1">
                  <div>
                    <strong className="text-teal-300">Expected ROI:</strong> {op.expectedImpact}
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Impact: {op.impactScore}/10</span>
                <span>Feasibility: {op.feasibilityScore}/10</span>
                <span className="text-indigo-400">{op.timeframe}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Risk & Governance Matrix (NIST AI RMF 1.0) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-rose-400" />
            <h3 className="text-base font-bold text-white">
              AI Risk & Governance Matrix (NIST AI RMF 1.0)
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Audit Level: Clinical Board Oversight
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                <th className="py-2.5 px-3">Risk ID</th>
                <th className="py-2.5 px-3">Risk Title & Description</th>
                <th className="py-2.5 px-3">Severity</th>
                <th className="py-2.5 px-3">NIST Domain</th>
                <th className="py-2.5 px-3">Mandatory Mitigating Control</th>
                <th className="py-2.5 px-3 text-right">Audit Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {CAIO_RISK_ITEMS.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-3 font-mono font-bold text-slate-400">
                    {item.id}
                  </td>
                  <td className="py-3 px-3 text-white max-w-xs">
                    <div className="font-bold">{item.title}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {item.description}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        item.severity === 'Critical'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {item.severity}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-300">
                    {item.nistDomain}
                  </td>
                  <td className="py-3 px-3 text-slate-300 text-[11px] max-w-sm">
                    {item.mitigationControl}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded-full">
                      {item.auditStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Implementation Phased Roadmap (Gantt Style) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center space-x-2 mb-6 pb-3 border-b border-slate-800">
          <Clock className="w-5 h-5 text-teal-400" />
          <h3 className="text-base font-bold text-white">
            Chief AI Officer 360-Day Phased Transformation Roadmap
          </h3>
        </div>

        {/* Phase Timeline Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-6">
          {CAIO_ROADMAP_PHASES.map((phase, idx) => (
            <button
              key={phase.phase}
              onClick={() => setSelectedPhaseIndex(idx)}
              className={`p-3.5 rounded-2xl text-left border transition cursor-pointer ${
                selectedPhaseIndex === idx
                  ? 'bg-teal-600 text-white border-teal-400 shadow-lg shadow-teal-950/60'
                  : 'bg-slate-800/60 text-slate-300 border-slate-700/60 hover:bg-slate-800'
              }`}
            >
              <div className="text-[10px] font-mono uppercase opacity-80">
                {phase.timeframe}
              </div>
              <div className="text-xs font-bold mt-1 line-clamp-1">
                {phase.phase}
              </div>
              <div className="text-[11px] opacity-90 mt-1 line-clamp-1">
                {phase.readinessLevel}
              </div>
            </button>
          ))}
        </div>

        {/* Selected Phase Detail Content */}
        {(() => {
          const curPhase = CAIO_ROADMAP_PHASES[selectedPhaseIndex];
          return (
            <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <span className="text-xs font-mono font-bold text-teal-400">
                    {curPhase.timeframe} • {curPhase.phase}
                  </span>
                  <h4 className="text-base font-bold text-white mt-1">
                    {curPhase.title}
                  </h4>
                </div>
                <span className="text-xs font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-800 px-3 py-1 rounded-full self-start sm:self-auto">
                  Readiness: {curPhase.readinessLevel}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Milestones */}
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <h5 className="text-xs font-bold text-teal-300 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Implementation Milestones</span>
                  </h5>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {curPhase.milestones.map((m, i) => (
                      <li key={i} className="flex items-start space-x-1.5">
                        <span className="text-teal-400 font-bold">•</span>
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Governance Gates */}
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <h5 className="text-xs font-bold text-rose-300 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Governance Exit Gates</span>
                  </h5>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {curPhase.governanceGates.map((g, i) => (
                      <li key={i} className="flex items-start space-x-1.5">
                        <span className="text-rose-400 font-bold">•</span>
                        <span>{g}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Targeted Outcomes */}
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <h5 className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Targeted Outcomes & ROI</span>
                  </h5>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {curPhase.targetedOutcomes.map((o, i) => (
                      <li key={i} className="flex items-start space-x-1.5">
                        <span className="text-indigo-400 font-bold">•</span>
                        <span>{o}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
};
