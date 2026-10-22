import React from 'react';
import {
  Award,
  Zap,
  Compass,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

export const ExecutiveRecommendations: React.FC = () => {
  const topPriorities = [
    {
      rank: 1,
      title: 'Standardize 6th-Grade Plain-Language Discharge Protocol',
      dept: 'Hospital-Wide / CMO Office',
      urgency: 'Immediate',
      impact: 'Eliminates 78% of medication non-compliance grievances; drops 30-day preventable readmissions by 22%.',
    },
    {
      rank: 2,
      title: 'Deploy Real-Time ED Triage & Wait Transparency Engine',
      dept: 'Emergency Medicine',
      urgency: 'Month 1-2',
      impact: 'Reduces Left-Without-Being-Seen (LWBS) rate by 40% and halts viral negative social sentiment spikes.',
    },
    {
      rank: 3,
      title: 'Institutionalize Certified Digital Multilingual Equity Bridge',
      dept: 'Health Equity / Patient Access',
      urgency: 'Month 2-3',
      impact: 'Closes the 2.1-point satisfaction gap for LEP patients (Mandarin, Spanish, Arabic) across all ambulatory hubs.',
    },
    {
      rank: 4,
      title: 'Establish Mandatory Clinical AI Guardrails & Hallucination Sentry',
      dept: 'CAIO & Pharmacy Committee',
      urgency: 'Immediate',
      impact: 'Blocks contradictory automated portal advice, protecting patients from severe anticoagulation and diabetic near-misses.',
    },
    {
      rank: 5,
      title: 'Overhaul Primary Care & Specialty Scheduling Architecture',
      dept: 'Ambulatory Operations',
      urgency: 'Month 3-6',
      impact: 'Shrinks 4-month booking delays down to < 21 days through automated cancel-fill optimization and capacity rebalancing.',
    },
  ];

  const quickWins = [
    {
      title: 'Bulleted Medication Schedules on Bedside Discharges',
      timeframe: '30 Days',
      metric: '+15% discharge comprehension score',
    },
    {
      title: 'Bi-Directional SMS Queue Alerts for Waiting ED Patients',
      timeframe: '45 Days',
      metric: '-35% waiting room verbal conflict logs',
    },
    {
      title: 'Voice/Telephone 2FA Fallback for Non-Smartphone Seniors',
      timeframe: '60 Days',
      metric: '+4,200 senior portal active logins',
    },
    {
      title: 'Weekend Nurse Triage Escalation Hotline for High-Risk Surgical Discharges',
      timeframe: '75 Days',
      metric: '-18% Monday emergency room bounce-backs',
    },
  ];

  const longTermOpportunities = [
    {
      title: 'Autonomous Multi-Specialty Capacity & Schedule Rebalancing Agent',
      timeframe: '6 - 9 Months',
      metric: '$4.2M unlocked clinical appointment capacity',
    },
    {
      title: 'Predictive In-Home Patient Deterioration Sentry for Chronic Heart Failure',
      timeframe: '9 - 12 Months',
      metric: '-28% 90-day cardiovascular readmission events',
    },
    {
      title: 'System-Wide Ambient Clinical Documentation & Quality Auditing Suite',
      timeframe: '10 - 12 Months',
      metric: 'Save 2.4 hours daily per physician EHR documentation load',
    },
  ];

  return (
    <section className="mb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-0.5 rounded-full">
            Section 9
          </span>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Executive Recommendations & Strategic Roadmap
          </h2>
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <span className="bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-xl font-mono">
            Board Presentation Ready
          </span>
        </div>
      </div>

      {/* Top 5 Organizational Priorities */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <Award className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base font-bold text-white">
            Top 5 Healthcare System Leadership Priorities
          </h3>
        </div>

        <div className="space-y-3.5">
          {topPriorities.map((item) => (
            <div
              key={item.rank}
              className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 hover:border-emerald-500/40 transition flex flex-col md:flex-row md:items-center justify-between gap-3"
            >
              <div className="flex items-start space-x-3.5">
                <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-300 font-extrabold flex items-center justify-center shrink-0 text-xs border border-emerald-500/30">
                  #{item.rank}
                </span>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-300 mt-1">
                    {item.impact}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0 self-end md:self-auto text-xs">
                <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 text-[11px] font-mono">
                  {item.dept}
                </span>
                <span className="px-2.5 py-1 rounded-md bg-emerald-950/80 text-emerald-300 border border-emerald-800 text-[11px] font-bold">
                  {item.urgency}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Grid: Quick Wins vs Long-Term AI Opportunities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Wins (< 3 Months) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-bold text-white">
                Quick Wins (Within 3 Months)
              </h3>
            </div>
            <span className="text-xs text-amber-400 font-bold bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-800">
              Low Friction / High Velocity
            </span>
          </div>

          <div className="space-y-3">
            {quickWins.map((win, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 flex items-start space-x-3"
              >
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-white">{win.title}</h5>
                    <span className="text-[10px] text-amber-400 font-mono ml-2">
                      {win.timeframe}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 flex items-center space-x-1">
                    <TrendingUp className="w-3 h-3 text-emerald-400 mr-1" />
                    <span>Target Outcome: {win.metric}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Long-Term AI Opportunities (6-12 Months) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Compass className="w-5 h-5 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">
                Long-Term AI Opportunities (6–12 Months)
              </h3>
            </div>
            <span className="text-xs text-indigo-300 font-bold bg-indigo-950/80 px-2 py-0.5 rounded-full border border-indigo-800">
              Transformational ROI
            </span>
          </div>

          <div className="space-y-3">
            {longTermOpportunities.map((opp, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 flex items-start space-x-3"
              >
                <div className="w-4 h-4 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-white">{opp.title}</h5>
                    <span className="text-[10px] text-indigo-300 font-mono ml-2">
                      {opp.timeframe}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 flex items-center space-x-1">
                    <TrendingUp className="w-3 h-3 text-emerald-400 mr-1" />
                    <span>Strategic ROI: {opp.metric}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-indigo-950/30 rounded-xl border border-indigo-900/40 text-[11px] text-slate-300 flex items-center justify-between">
            <span>Aligned with Health System FY27 Capital AI Investment Plan</span>
            <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
          </div>
        </div>
      </div>
    </section>
  );
};
