import React, { useState } from 'react';
import {
  Bot,
  Sparkles,
  Zap,
  Target,
  ArrowUpRight,
  CheckCircle,
  Building2,
  TrendingUp,
} from 'lucide-react';
import { RECOMMENDED_AI_AGENTS } from '../data/patientFeedbackDataset';
import { AIAgentOpportunity, ServiceLine } from '../types';

interface AIAgentOpportunitiesProps {
  onSelectAgent?: (agent: AIAgentOpportunity) => void;
}

export const AIAgentOpportunities: React.FC<AIAgentOpportunitiesProps> = ({
  onSelectAgent,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    'All',
    'Post-Care Adherence',
    'Operations & Triage',
    'Health Equity',
    'Safety & Governance',
  ];

  const filteredAgents =
    selectedCategory === 'All'
      ? RECOMMENDED_AI_AGENTS
      : RECOMMENDED_AI_AGENTS.filter((a) => a.category === selectedCategory);

  return (
    <section className="mb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950/60 border border-indigo-800/80 px-2.5 py-0.5 rounded-full">
            Section 8
          </span>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Healthcare AI Agent Opportunity Portfolio
          </h2>
        </div>
        <p className="text-xs text-indigo-300/80 mt-1 sm:mt-0 font-medium">
          Pattern-derived autonomous agent architectures tailored to patient pain points
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/60'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Recommended Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAgents.map((agent) => (
          <div
            key={agent.id}
            className="bg-slate-900/90 border border-slate-800 hover:border-indigo-500/60 rounded-2xl p-5 shadow-xl flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 group"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20 transition">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-indigo-300 border border-indigo-900/40">
                    {agent.quadrant}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500 mt-0.5">
                    Timeframe: {agent.timeframe}
                  </span>
                </div>
              </div>

              {/* Agent Name & Purpose */}
              <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition">
                {agent.name}
              </h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                {agent.purpose}
              </p>

              {/* Expected Organizational Impact */}
              <div className="mt-4 p-3 rounded-xl bg-indigo-950/30 border border-indigo-900/40">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-indigo-300 mb-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Expected Organizational Impact:</span>
                </div>
                <p className="text-xs text-slate-200 leading-normal">
                  {agent.expectedImpact}
                </p>
              </div>
            </div>

            {/* Target Service Lines & KPIs */}
            <div className="mt-5 pt-3 border-t border-slate-800/80">
              <div className="text-[11px] text-slate-400 font-semibold mb-1.5 flex items-center space-x-1">
                <Building2 className="w-3 h-3 text-slate-500" />
                <span>Target Service Lines:</span>
              </div>
              <div className="flex flex-wrap gap-1 mb-3">
                {agent.targetServiceLines.map((sl) => (
                  <span
                    key={sl}
                    className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300"
                  >
                    {sl}
                  </span>
                ))}
              </div>

              <div className="text-[11px] text-slate-400 font-semibold mb-1 flex items-center space-x-1">
                <Target className="w-3 h-3 text-teal-400" />
                <span>Targeted KPIs:</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {agent.kpisTargeted.map((kpi) => (
                  <span
                    key={kpi}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-teal-950/60 text-teal-300 border border-teal-800/60 font-mono"
                  >
                    {kpi}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
