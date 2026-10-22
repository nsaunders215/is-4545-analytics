import React from 'react';
import {
  AlertOctagon,
  Clock,
  PhoneOff,
  Cpu,
  CalendarX,
  TrendingDown,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { PatientComment } from '../types';

interface HiddenProblemsProps {
  comments: PatientComment[];
  onDrillDownIssue?: (issue: string) => void;
}

export const HiddenProblems: React.FC<HiddenProblemsProps> = ({
  comments,
  onDrillDownIssue,
}) => {
  const total = comments.length || 1;

  // 1. Complaint Rate by Service Line (unusually high complaint rates)
  const serviceLines = Array.from(new Set(comments.map((c) => c.serviceLine)));
  const serviceLineComplaints = serviceLines
    .map((sl) => {
      const group = comments.filter((c) => c.serviceLine === sl);
      const complaints = group.filter((c) => c.sentiment === 'Negative' || c.satisfactionScore <= 2);
      const complaintRate = ((complaints.length / group.length) * 100).toFixed(1);
      return {
        serviceLine: sl,
        total: group.length,
        complaints: complaints.length,
        rate: Number(complaintRate),
      };
    })
    .sort((a, b) => b.rate - a.rate);

  // 2. Count distinct categories
  const bottleneckCount = comments.filter((c) =>
    c.issueCategories.includes('CommunicationBottleneck')
  ).length;

  const techIssueCount = comments.filter((c) =>
    c.issueCategories.includes('TechIssue')
  ).length;

  const schedulingCount = comments.filter((c) =>
    c.issueCategories.includes('SchedulingIssue')
  ).length;

  const waitTimeCount = comments.filter((c) =>
    c.issueCategories.includes('WaitTimeComplaint') || c.waitTimeMinutes > 60
  ).length;

  // Average wait times per service line
  const waitTimesBySL = serviceLines
    .map((sl) => {
      const group = comments.filter((c) => c.serviceLine === sl);
      const avgWait = Math.round(
        group.reduce((acc, c) => acc + c.waitTimeMinutes, 0) / group.length
      );
      return { serviceLine: sl, avgWait };
    })
    .sort((a, b) => b.avgWait - a.avgWait);

  return (
    <section className="mb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-400 bg-rose-950/60 border border-rose-800/80 px-2.5 py-0.5 rounded-full">
            Section 4
          </span>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Hidden Organizational Problems & System Bottlenecks
          </h2>
        </div>
        <p className="text-xs text-rose-300/80 mt-1 sm:mt-0 font-medium">
          Root-cause triage: Identifying latent risks before clinical escalation
        </p>
      </div>

      {/* 4 Problem Category Callout Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Card 1: Communication Bottlenecks */}
        <div
          onClick={() => onDrillDownIssue?.('CommunicationBottleneck')}
          className="bg-slate-900/90 border border-slate-800 hover:border-rose-500/50 rounded-2xl p-4 shadow-lg cursor-pointer transition group"
        >
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
              <PhoneOff className="w-4 h-4" />
            </div>
            <span className="text-xs font-mono font-bold text-rose-400">
              {((bottleneckCount / total) * 100).toFixed(0)}% Prevalence
            </span>
          </div>
          <h4 className="text-sm font-bold text-white mt-3 group-hover:text-rose-300 transition">
            Communication Bottlenecks
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            {bottleneckCount} patient comments cite hurried discharge notes, unreturned callbacks, or conflicting provider advice.
          </p>
          <div className="mt-3 flex items-center text-[11px] text-rose-400 font-medium">
            <span>Inspect bottleneck cohort</span>
            <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition" />
          </div>
        </div>

        {/* Card 2: Technology-Related Issues */}
        <div
          onClick={() => onDrillDownIssue?.('TechIssue')}
          className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-4 shadow-lg cursor-pointer transition group"
        >
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Cpu className="w-4 h-4" />
            </div>
            <span className="text-xs font-mono font-bold text-amber-400">
              {techIssueCount} incidents
            </span>
          </div>
          <h4 className="text-sm font-bold text-white mt-3 group-hover:text-amber-300 transition">
            Technology-Related Issues
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            Portal 2FA lockouts, reversed Arabic/Mandarin fonts, incorrect dosage sync, and video telehealth dropouts.
          </p>
          <div className="mt-3 flex items-center text-[11px] text-amber-400 font-medium">
            <span>Inspect tech friction points</span>
            <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition" />
          </div>
        </div>

        {/* Card 3: Scheduling-Related Issues */}
        <div
          onClick={() => onDrillDownIssue?.('SchedulingIssue')}
          className="bg-slate-900/90 border border-slate-800 hover:border-sky-500/50 rounded-2xl p-4 shadow-lg cursor-pointer transition group"
        >
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
              <CalendarX className="w-4 h-4" />
            </div>
            <span className="text-xs font-mono font-bold text-sky-400">
              {schedulingCount} flagged
            </span>
          </div>
          <h4 className="text-sm font-bold text-white mt-3 group-hover:text-sky-300 transition">
            Scheduling-Related Issues
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            4-month new patient booking delays in Primary Care, phone infinite hold loops, and dropped MRI pre-authorizations.
          </p>
          <div className="mt-3 flex items-center text-[11px] text-sky-400 font-medium">
            <span>Inspect scheduling log</span>
            <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition" />
          </div>
        </div>

        {/* Card 4: Wait-Time Complaints */}
        <div
          onClick={() => onDrillDownIssue?.('WaitTimeComplaint')}
          className="bg-slate-900/90 border border-slate-800 hover:border-purple-500/50 rounded-2xl p-4 shadow-lg cursor-pointer transition group"
        >
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-xs font-mono font-bold text-purple-400">
              {waitTimeCount} grievances
            </span>
          </div>
          <h4 className="text-sm font-bold text-white mt-3 group-hover:text-purple-300 transition">
            Wait-Time Complaints
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            Severe triage delays exceeding 4 hours in Emergency, clinic schedule slippage, and inaccurate wait display boards.
          </p>
          <div className="mt-3 flex items-center text-[11px] text-purple-400 font-medium">
            <span>Inspect wait-time analysis</span>
            <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition" />
          </div>
        </div>
      </div>

      {/* Two Detailed Charts: High Complaint Rate Ranking + Wait Time Bottleneck Hotspots */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Service Lines with Unusually High Complaint Rates */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <AlertOctagon className="w-4 h-4 text-rose-400" />
              <h3 className="text-sm font-bold text-white">
                Service Lines with Unusually High Complaint Rates
              </h3>
            </div>
            <span className="text-xs text-rose-400 font-semibold">Priority Targets</span>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Percentage of patient comments with negative sentiment or satisfaction score ≤ 2.
          </p>

          <div className="space-y-3">
            {serviceLineComplaints.map((item) => {
              const isHighRisk = item.rate >= 40;
              return (
                <div key={item.serviceLine} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">
                      {item.serviceLine}
                    </span>
                    <div className="flex items-center space-x-2 font-mono">
                      <span className="text-slate-400 text-[11px]">
                        ({item.complaints}/{item.total})
                      </span>
                      <span
                        className={`font-bold px-2 py-0.5 rounded ${
                          isHighRisk
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {item.rate}%
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isHighRisk
                          ? 'bg-gradient-to-r from-rose-600 to-rose-400'
                          : 'bg-gradient-to-r from-amber-600 to-yellow-500'
                      }`}
                      style={{ width: `${item.rate}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Wait-Time Hotspots Breakdown */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold text-white">
                Wait-Time Hotspots by Clinical Department
              </h3>
            </div>
            <span className="text-xs text-slate-400">Minutes to Provider</span>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Direct correlation between wait time duration and negative CAHPS score drops.
          </p>

          <div className="space-y-2.5">
            {waitTimesBySL.map((item) => (
              <div
                key={item.serviceLine}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/40 border border-slate-800/80 text-xs"
              >
                <span className="font-medium text-slate-200">
                  {item.serviceLine}
                </span>
                <div className="flex items-center space-x-3">
                  <div className="w-28 sm:w-40 bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        item.avgWait > 120
                          ? 'bg-rose-500'
                          : item.avgWait > 45
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{
                        width: `${Math.min(100, (item.avgWait / 240) * 100)}%`,
                      }}
                    />
                  </div>
                  <span
                    className={`font-mono font-bold w-16 text-right ${
                      item.avgWait > 120
                        ? 'text-rose-400'
                        : item.avgWait > 45
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {item.avgWait} mins
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-purple-950/30 rounded-xl border border-purple-800/40 text-[11px] text-purple-200 flex items-start space-x-2">
            <ShieldAlert className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <span>
              Emergency Medicine wait times exceed 3.5 hours on average, accounting for 68% of all hospital walkouts (Left Without Being Seen - LWBS).
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
