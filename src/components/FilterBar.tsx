import React from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { ServiceLine, VisitType, PatientPersona, Sentiment, IssueCategory } from '../types';

interface FilterState {
  serviceLine: string;
  visitType: string;
  persona: string;
  sentiment: string;
  issueFlag: string;
  searchQuery: string;
}

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  serviceLines: ServiceLine[];
  visitTypes: VisitType[];
  personas: PatientPersona[];
  onClear: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  serviceLines,
  visitTypes,
  personas,
  onClear,
}) => {
  const hasActiveFilters =
    filters.serviceLine ||
    filters.visitType ||
    filters.persona ||
    filters.sentiment ||
    filters.issueFlag ||
    filters.searchQuery;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg mb-6 backdrop-blur-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300 uppercase tracking-wider">
          <SlidersHorizontal className="w-3.5 h-3.5 text-teal-400" />
          <span>Executive Drill-Down & Segment Filters</span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onClear}
            className="text-xs text-rose-400 hover:text-rose-300 flex items-center space-x-1 font-medium transition cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {/* Search Query */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search keywords..."
            value={filters.searchQuery}
            onChange={(e) =>
              onFilterChange({ ...filters, searchQuery: e.target.value })
            }
            className="w-full bg-slate-800 text-slate-200 text-xs rounded-xl pl-8 pr-3 py-2 border border-slate-700 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition placeholder-slate-500"
          />
        </div>

        {/* Service Line */}
        <div>
          <select
            value={filters.serviceLine}
            onChange={(e) =>
              onFilterChange({ ...filters, serviceLine: e.target.value })
            }
            className="w-full bg-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 border border-slate-700 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
          >
            <option value="">All Service Lines ({serviceLines.length})</option>
            {serviceLines.map((sl) => (
              <option key={sl} value={sl}>
                {sl}
              </option>
            ))}
          </select>
        </div>

        {/* Visit Type */}
        <div>
          <select
            value={filters.visitType}
            onChange={(e) =>
              onFilterChange({ ...filters, visitType: e.target.value })
            }
            className="w-full bg-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 border border-slate-700 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
          >
            <option value="">All Visit Types ({visitTypes.length})</option>
            {visitTypes.map((vt) => (
              <option key={vt} value={vt}>
                {vt}
              </option>
            ))}
          </select>
        </div>

        {/* Patient Persona */}
        <div>
          <select
            value={filters.persona}
            onChange={(e) =>
              onFilterChange({ ...filters, persona: e.target.value })
            }
            className="w-full bg-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 border border-slate-700 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
          >
            <option value="">All Patient Personas ({personas.length})</option>
            {personas.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* Sentiment */}
        <div>
          <select
            value={filters.sentiment}
            onChange={(e) =>
              onFilterChange({ ...filters, sentiment: e.target.value })
            }
            className="w-full bg-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 border border-slate-700 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
          >
            <option value="">All Sentiments</option>
            <option value="Positive">Positive Only</option>
            <option value="Neutral">Neutral Only</option>
            <option value="Negative">Negative Only</option>
          </select>
        </div>

        {/* Risk / Issue Flags */}
        <div>
          <select
            value={filters.issueFlag}
            onChange={(e) =>
              onFilterChange({ ...filters, issueFlag: e.target.value })
            }
            className="w-full bg-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 border border-slate-700 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition text-amber-300 font-medium"
          >
            <option value="">All Flagged Issues</option>
            <option value="HighComplaintRate">🚨 High Complaint Rate</option>
            <option value="CommunicationBottleneck">📢 Bottlenecks</option>
            <option value="WaitTimeComplaint">⏱️ Wait Time Issues</option>
            <option value="TechIssue">💻 Portal / Tech Errors</option>
            <option value="SchedulingIssue">📅 Scheduling Delays</option>
            <option value="LanguageBarrier">🌐 Language Barriers</option>
            <option value="EquityBarrier">⚖️ Equity & Literacy</option>
            <option value="HallucinationTrap">🤖 Hallucination Traps</option>
            <option value="BiasRisk">⚠️ Algorithmic / Human Bias</option>
            <option value="HumanReviewNeeded">🩺 Clinical Review Required</option>
          </select>
        </div>
      </div>
    </div>
  );
};
