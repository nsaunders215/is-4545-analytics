import React from 'react';
import { Star, BarChart2, PieChart, Users, Layers } from 'lucide-react';
import { PatientComment, ServiceLine, VisitType, PatientPersona } from '../types';

interface SatisfactionInsightsProps {
  comments: PatientComment[];
  onSelectServiceLine?: (sl: string) => void;
  onSelectPersona?: (persona: string) => void;
  onSelectVisitType?: (vt: string) => void;
}

export const SatisfactionInsights: React.FC<SatisfactionInsightsProps> = ({
  comments,
  onSelectServiceLine,
  onSelectPersona,
  onSelectVisitType,
}) => {
  const total = comments.length || 1;

  // 1. Satisfaction Distribution (1 to 5 stars)
  const scoreCounts = [1, 2, 3, 4, 5].map((score) => {
    const count = comments.filter((c) => c.satisfactionScore === score).length;
    const pct = ((count / total) * 100).toFixed(1);
    return { score, count, pct: Number(pct) };
  });

  // 2. Satisfaction by Service Line
  const serviceLines = Array.from(new Set(comments.map((c) => c.serviceLine)));
  const serviceLineStats = serviceLines
    .map((sl) => {
      const group = comments.filter((c) => c.serviceLine === sl);
      const avg =
        group.reduce((acc, c) => acc + c.satisfactionScore, 0) / group.length;
      const count = group.length;
      return { serviceLine: sl, avg: Number(avg.toFixed(2)), count };
    })
    .sort((a, b) => a.avg - b.avg); // ascending to highlight lowest first

  // 3. Satisfaction by Visit Type
  const visitTypes = Array.from(new Set(comments.map((c) => c.visitType)));
  const visitTypeStats = visitTypes
    .map((vt) => {
      const group = comments.filter((c) => c.visitType === vt);
      const avg =
        group.reduce((acc, c) => acc + c.satisfactionScore, 0) / group.length;
      const count = group.length;
      return { visitType: vt, avg: Number(avg.toFixed(2)), count };
    })
    .sort((a, b) => a.avg - b.avg);

  // 4. Satisfaction by Patient Persona
  const personas = Array.from(new Set(comments.map((c) => c.patientPersona)));
  const personaStats = personas
    .map((p) => {
      const group = comments.filter((c) => c.patientPersona === p);
      const avg =
        group.reduce((acc, c) => acc + c.satisfactionScore, 0) / group.length;
      const count = group.length;
      return { persona: p, avg: Number(avg.toFixed(2)), count };
    })
    .sort((a, b) => a.avg - b.avg);

  const getScoreColor = (score: number) => {
    if (score >= 4.0) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (score >= 3.0) return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
  };

  const getBarGradient = (score: number) => {
    if (score >= 4.0) return 'from-emerald-600 to-teal-400';
    if (score >= 3.0) return 'from-amber-600 to-yellow-400';
    return 'from-rose-600 to-rose-400';
  };

  return (
    <section className="mb-10">
      <div className="flex items-center space-x-2 pb-4 mb-6 border-b border-slate-800">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-400 bg-teal-950/60 border border-teal-800/80 px-2.5 py-0.5 rounded-full">
          Section 2
        </span>
        <h2 className="text-xl font-bold text-white tracking-tight">
          Patient Satisfaction Insights
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Viz 1: Satisfaction Distribution */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <PieChart className="w-4 h-4 text-teal-400" />
              <h3 className="text-sm font-bold text-white">
                Satisfaction Rating Distribution
              </h3>
            </div>
            <span className="text-xs text-slate-400">Total: {comments.length}</span>
          </div>

          <div className="space-y-3">
            {scoreCounts.map((item) => (
              <div key={item.score} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1.5 font-medium text-slate-300">
                    <span className="w-3 text-right">{item.score}</span>
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 inline" />
                    <span className="text-slate-400">
                      ({item.score === 5 ? 'Excellent' : item.score === 1 ? 'Poor' : item.score === 4 ? 'Good' : item.score === 2 ? 'Fair' : 'Neutral'})
                    </span>
                  </div>
                  <div className="text-slate-300 font-mono">
                    <span className="font-semibold text-white">{item.count}</span>{' '}
                    <span className="text-slate-500">({item.pct}%)</span>
                  </div>
                </div>

                <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden p-0.5">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r transition-all duration-500 ${
                      item.score >= 4
                        ? 'from-emerald-500 to-teal-400'
                        : item.score === 3
                        ? 'from-amber-500 to-yellow-400'
                        : 'from-rose-500 to-rose-400'
                    }`}
                    style={{ width: `${Math.max(item.pct, 3)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>🔴 Detractors (1-2 Stars): {scoreCounts[0].pct + scoreCounts[1].pct}%</span>
            <span>🟢 Promoters (4-5 Stars): {scoreCounts[3].pct + scoreCounts[4].pct}%</span>
          </div>
        </div>

        {/* Viz 2: Satisfaction by Service Line */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <BarChart2 className="w-4 h-4 text-sky-400" />
              <h3 className="text-sm font-bold text-white">
                Satisfaction by Service Line (Ascending)
              </h3>
            </div>
            <span className="text-xs text-slate-500">Click to filter</span>
          </div>

          <div className="space-y-2.5 max-h-[290px] overflow-y-auto pr-1">
            {serviceLineStats.map((item) => (
              <div
                key={item.serviceLine}
                onClick={() => onSelectServiceLine?.(item.serviceLine)}
                className="group p-2 rounded-xl hover:bg-slate-800/60 transition cursor-pointer border border-transparent hover:border-slate-700"
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium text-slate-200 group-hover:text-teal-300 transition">
                    {item.serviceLine}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-500 text-[11px]">n={item.count}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${getScoreColor(
                        item.avg
                      )}`}
                    >
                      {item.avg} / 5.0
                    </span>
                  </div>
                </div>

                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r transition-all duration-500 ${getBarGradient(
                      item.avg
                    )}`}
                    style={{ width: `${(item.avg / 5) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Viz 3: Satisfaction by Visit Type */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold text-white">
                Satisfaction by Visit Type
              </h3>
            </div>
            <span className="text-xs text-slate-500">Acuity vs Outpatient</span>
          </div>

          <div className="space-y-3">
            {visitTypeStats.map((item) => (
              <div
                key={item.visitType}
                onClick={() => onSelectVisitType?.(item.visitType)}
                className="group p-2 rounded-xl hover:bg-slate-800/60 transition cursor-pointer border border-transparent hover:border-slate-700"
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium text-slate-200 group-hover:text-purple-300 transition">
                    {item.visitType}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-500 text-[11px]">{item.count} visits</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${getScoreColor(
                        item.avg
                      )}`}
                    >
                      {item.avg} / 5.0
                    </span>
                  </div>
                </div>

                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r transition-all duration-500 ${getBarGradient(
                      item.avg
                    )}`}
                    style={{ width: `${(item.avg / 5) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 text-[11px] text-slate-400 bg-slate-800/40 p-2.5 rounded-xl border border-slate-800">
            💡 <strong>Observation:</strong> Emergency visits experience the steepest satisfaction deficit (avg 1.8), while Telehealth and Ambulatory Surgery lead hospital benchmarks (&gt; 4.2).
          </div>
        </div>

        {/* Viz 4: Satisfaction by Patient Persona */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">
                Satisfaction by Patient Persona
              </h3>
            </div>
            <span className="text-xs text-rose-400 font-medium">Equity Alert</span>
          </div>

          <div className="space-y-2.5">
            {personaStats.map((item) => (
              <div
                key={item.persona}
                onClick={() => onSelectPersona?.(item.persona)}
                className="group p-2 rounded-xl hover:bg-slate-800/60 transition cursor-pointer border border-transparent hover:border-slate-700"
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium text-slate-200 group-hover:text-amber-300 transition">
                    {item.persona}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-500 text-[11px]">n={item.count}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${getScoreColor(
                        item.avg
                      )}`}
                    >
                      {item.avg} / 5.0
                    </span>
                  </div>
                </div>

                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r transition-all duration-500 ${getBarGradient(
                      item.avg
                    )}`}
                    style={{ width: `${(item.avg / 5) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 text-[11px] text-rose-300 bg-rose-950/40 p-2.5 rounded-xl border border-rose-800/40">
            ⚠️ <strong>Health Equity Disparity:</strong> Non-English Primary (LEP) and Low Health Literacy patients register 1.8 to 2.2 points lower than Tech-Savvy Young Adults, signaling acute linguistic and communication friction.
          </div>
        </div>
      </div>
    </section>
  );
};
