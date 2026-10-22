import React from 'react';
import {
  Scale,
  Languages,
  Smartphone,
  Accessibility,
  AlertTriangle,
  HeartHandshake,
  CheckCircle,
} from 'lucide-react';
import { PatientComment, PatientPersona } from '../types';

interface EquityAccessibilityProps {
  comments: PatientComment[];
  onSelectPersona?: (persona: string) => void;
  onSelectFlag?: (flag: string) => void;
}

export const EquityAccessibility: React.FC<EquityAccessibilityProps> = ({
  comments,
  onSelectPersona,
  onSelectFlag,
}) => {
  const personas = Array.from(new Set(comments.map((c) => c.patientPersona)));

  const personaAnalysis = personas.map((p) => {
    const group = comments.filter((c) => c.patientPersona === p);
    const avgSat =
      group.reduce((acc, c) => acc + c.satisfactionScore, 0) / group.length;
    const avgComm =
      group.reduce((acc, c) => acc + c.communicationRating, 0) / group.length;
    const compliant = group.filter((c) => c.followUpCompliant).length;
    const compRate = ((compliant / group.length) * 100).toFixed(1);

    return {
      persona: p,
      total: group.length,
      avgSat: Number(avgSat.toFixed(2)),
      avgComm: Number(avgComm.toFixed(2)),
      compRate: Number(compRate),
    };
  });

  const languageComments = comments.filter((c) =>
    c.issueCategories.includes('LanguageBarrier')
  );

  const digitalLiteracyComments = comments.filter((c) =>
    c.issueCategories.includes('DigitalLiteracy')
  );

  const equityBarrierComments = comments.filter((c) =>
    c.issueCategories.includes('EquityBarrier')
  );

  return (
    <section className="mb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-950/60 border border-amber-800/80 px-2.5 py-0.5 rounded-full">
            Section 6
          </span>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Healthcare Equity & Accessibility Diagnostic
          </h2>
        </div>
        <p className="text-xs text-amber-300/80 mt-1 sm:mt-0 font-medium">
          Quantifying health disparities, language obstacles, and digital literacy hurdles
        </p>
      </div>

      {/* 3 Pillar Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        {/* Pillar 1: Language Barriers */}
        <div
          onClick={() => onSelectFlag?.('LanguageBarrier')}
          className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-5 shadow-lg cursor-pointer transition group"
        >
          <div className="flex items-center justify-between">
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl">
              <Languages className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono font-bold text-amber-400">
              {languageComments.length} Flagged Incidents
            </span>
          </div>
          <h3 className="text-sm font-bold text-white mt-3 group-hover:text-amber-300 transition">
            Language Barriers (LEP Patients)
          </h3>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            Non-English speakers report uncertified translation via Google Translate on nurses' personal phones, English-only discharge packets, and reversed Arabic printouts.
          </p>
          <div className="mt-3 text-[11px] text-amber-400 font-semibold flex items-center">
            <span>Filter {languageComments.length} Language Barrier Reports →</span>
          </div>
        </div>

        {/* Pillar 2: Digital Literacy Challenges */}
        <div
          onClick={() => onSelectFlag?.('DigitalLiteracy')}
          className="bg-slate-900/90 border border-slate-800 hover:border-sky-500/50 rounded-2xl p-5 shadow-lg cursor-pointer transition group"
        >
          <div className="flex items-center justify-between">
            <div className="p-2 bg-sky-500/10 text-sky-400 rounded-xl">
              <Smartphone className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono font-bold text-sky-400">
              {digitalLiteracyComments.length} Incidents
            </span>
          </div>
          <h3 className="text-sm font-bold text-white mt-3 group-hover:text-sky-300 transition">
            Digital Literacy & Tech Divide
          </h3>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            Mandatory two-factor SMS authentication locks out elderly patients with flip phones; telemedicine links fail due to unguided browser permission settings.
          </p>
          <div className="mt-3 text-[11px] text-sky-400 font-semibold flex items-center">
            <span>Filter {digitalLiteracyComments.length} Digital Divide Reports →</span>
          </div>
        </div>

        {/* Pillar 3: Accessibility & Financial Equity */}
        <div
          onClick={() => onSelectFlag?.('EquityBarrier')}
          className="bg-slate-900/90 border border-slate-800 hover:border-purple-500/50 rounded-2xl p-5 shadow-lg cursor-pointer transition group"
        >
          <div className="flex items-center justify-between">
            <div className="p-2 bg-purple-500/10 text-purple-400 rounded-xl">
              <Scale className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono font-bold text-purple-400">
              {equityBarrierComments.length} Reports
            </span>
          </div>
          <h3 className="text-sm font-bold text-white mt-3 group-hover:text-purple-300 transition">
            Socioeconomic & Cognitive Accessibility
          </h3>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            Underinsured and low health literacy patients encounter prohibitive upfront specialist copays ($350) and impenetrable medical jargon ("ambulate PRN").
          </p>
          <div className="mt-3 text-[11px] text-purple-400 font-semibold flex items-center">
            <span>Filter {equityBarrierComments.length} Equity Barrier Reports →</span>
          </div>
        </div>
      </div>

      {/* Disparities Table Across Personas */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Scale className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">
              Health Equity Metrics Matrix Across Patient Personas
            </h3>
          </div>
          <span className="text-xs text-slate-400">Click persona to filter dataset</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                <th className="py-2.5 px-3">Patient Persona</th>
                <th className="py-2.5 px-3">Sample (n)</th>
                <th className="py-2.5 px-3">Satisfaction Score</th>
                <th className="py-2.5 px-3">Communication Rating</th>
                <th className="py-2.5 px-3">Follow-Up Compliance</th>
                <th className="py-2.5 px-3 text-right">Equity Risk Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {personaAnalysis.map((p) => {
                const isSeverelyImpacted = p.avgSat < 2.5;
                return (
                  <tr
                    key={p.persona}
                    onClick={() => onSelectPersona?.(p.persona)}
                    className="hover:bg-slate-800/40 cursor-pointer transition"
                  >
                    <td className="py-3 px-3 text-white font-semibold flex items-center space-x-2">
                      <span>{p.persona}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-400 font-mono">
                      n={p.total}
                    </td>
                    <td className="py-3 px-3 font-mono">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                          p.avgSat >= 4.0
                            ? 'bg-emerald-950/80 text-emerald-300'
                            : p.avgSat >= 3.0
                            ? 'bg-amber-950/80 text-amber-300'
                            : 'bg-rose-950/80 text-rose-300'
                        }`}
                      >
                        {p.avgSat} / 5.0
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-300">
                      {p.avgComm} / 5.0
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-slate-200">
                          {p.compRate}%
                        </span>
                        <div className="w-16 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              p.compRate >= 75 ? 'bg-emerald-500' : 'bg-rose-500'
                            }`}
                            style={{ width: `${p.compRate}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {isSeverelyImpacted ? (
                        <span className="text-[10px] uppercase font-bold text-rose-400 bg-rose-950/60 border border-rose-800/80 px-2 py-0.5 rounded-full">
                          High Disparity
                        </span>
                      ) : p.avgSat < 3.5 ? (
                        <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-950/60 border border-amber-800/80 px-2 py-0.5 rounded-full">
                          Moderate Disparity
                        </span>
                      ) : (
                        <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded-full">
                          Standard
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
