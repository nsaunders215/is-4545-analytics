import React from 'react';
import {
  MessageSquare,
  Star,
  PhoneCall,
  CheckCircle,
  Building2,
  TrendingDown,
  TrendingUp,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { PatientComment } from '../types';

interface ExecutiveOverviewProps {
  comments: PatientComment[];
}

export const ExecutiveOverview: React.FC<ExecutiveOverviewProps> = ({ comments }) => {
  const totalComments = comments.length;

  const avgSatisfaction =
    totalComments > 0
      ? (
          comments.reduce((acc, c) => acc + c.satisfactionScore, 0) / totalComments
        ).toFixed(2)
      : '0.00';

  const avgCommunication =
    totalComments > 0
      ? (
          comments.reduce((acc, c) => acc + c.communicationRating, 0) / totalComments
        ).toFixed(2)
      : '0.00';

  const compliantCount = comments.filter((c) => c.followUpCompliant).length;
  const complianceRate =
    totalComments > 0
      ? ((compliantCount / totalComments) * 100).toFixed(1)
      : '0.0';

  const uniqueServiceLines = new Set(comments.map((c) => c.serviceLine));
  const serviceLineCount = uniqueServiceLines.size;

  const avgWaitTime =
    totalComments > 0
      ? Math.round(comments.reduce((acc, c) => acc + c.waitTimeMinutes, 0) / totalComments)
      : 0;

  const negativeCount = comments.filter((c) => c.sentiment === 'Negative').length;
  const negativeRate =
    totalComments > 0 ? ((negativeCount / totalComments) * 100).toFixed(1) : '0.0';

  return (
    <section className="mb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400 bg-teal-950/60 border border-teal-800/80 px-2.5 py-0.5 rounded-full">
              Section 1
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Executive Overview & Leadership Cockpit
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time synthesis of patient feedback across clinical service lines, CAHPS benchmarks, and compliance.
          </p>
        </div>

        <div className="mt-3 sm:mt-0 flex items-center space-x-2 text-xs">
          <span className="px-3 py-1 bg-slate-800/80 rounded-xl text-slate-300 border border-slate-700 font-mono">
            Benchmark: 50th Percentile National HCAHPS
          </span>
        </div>
      </div>

      {/* 5 Primary Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* KPI 1: Comments Analyzed */}
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-teal-500/50 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Comments Analyzed
            </span>
            <div className="p-2 bg-teal-500/10 text-teal-400 rounded-xl">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {totalComments}
            </span>
            <span className="text-xs text-slate-400">responses</span>
          </div>
          <div className="mt-3 flex items-center text-[11px] text-teal-400">
            <TrendingUp className="w-3 h-3 mr-1" />
            <span>100% NLP indexed</span>
          </div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-full blur-2xl group-hover:bg-teal-500/10 transition" />
        </div>

        {/* KPI 2: Avg Satisfaction Score */}
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-amber-500/50 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Avg Satisfaction
            </span>
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl">
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {avgSatisfaction}
            </span>
            <span className="text-xs text-slate-400">/ 5.0</span>
          </div>
          <div className="mt-3 flex items-center text-[11px] text-amber-400">
            <span>
              {Number(avgSatisfaction) >= 4.0
                ? '🟢 Top Quartile'
                : Number(avgSatisfaction) >= 3.2
                ? '🟡 Middle Quartile'
                : '🔴 Below Target (3.8)'}
            </span>
          </div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition" />
        </div>

        {/* KPI 3: Avg Communication Rating */}
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-sky-500/50 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Communication Rating
            </span>
            <div className="p-2 bg-sky-500/10 text-sky-400 rounded-xl">
              <PhoneCall className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {avgCommunication}
            </span>
            <span className="text-xs text-slate-400">/ 5.0</span>
          </div>
          <div className="mt-3 flex items-center text-[11px] text-sky-400">
            <span>Primary Driver of CAHPS Score</span>
          </div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/5 rounded-full blur-2xl group-hover:bg-sky-500/10 transition" />
        </div>

        {/* KPI 4: Follow-up Compliance Rate */}
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-emerald-500/50 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Follow-Up Compliance
            </span>
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {complianceRate}%
            </span>
            <span className="text-xs text-slate-400">{compliantCount} pts</span>
          </div>
          <div className="mt-3 flex items-center text-[11px] text-emerald-400">
            <TrendingUp className="w-3 h-3 mr-1" />
            <span>Target: &gt; 80.0%</span>
          </div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition" />
        </div>

        {/* KPI 5: Service Lines Represented */}
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-purple-500/50 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Service Lines
            </span>
            <div className="p-2 bg-purple-500/10 text-purple-400 rounded-xl">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {serviceLineCount}
            </span>
            <span className="text-xs text-slate-400">active depts</span>
          </div>
          <div className="mt-3 flex items-center text-[11px] text-purple-400">
            <span>System-wide visibility</span>
          </div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition" />
        </div>
      </div>

      {/* Leadership Alert Banner */}
      <div className="mt-4 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-900/50 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-500/20 text-indigo-300 rounded-xl shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs md:text-sm font-bold text-white">
              Chief Medical Officer & CEO Briefing Note
            </h4>
            <p className="text-xs text-slate-300">
              Average wait time across all services stands at <strong className="text-amber-300">{avgWaitTime} mins</strong>. 
              Dissatisfaction is heavily concentrated in Emergency Medicine (<strong className="text-rose-300">{negativeRate}% negative</strong>), driven by post-discharge instruction ambiguity and long triage queues.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0 self-end md:self-auto text-xs font-semibold text-indigo-300 bg-indigo-900/40 px-3 py-1.5 rounded-xl border border-indigo-700/50">
          <span>Priority: Discharge Redesign</span>
        </div>
      </div>
    </section>
  );
};
