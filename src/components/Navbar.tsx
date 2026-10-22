import React from 'react';
import {
  Activity,
  BarChart3,
  Bot,
  FileCheck2,
  Upload,
  Download,
  Filter,
  RefreshCw,
  Hospital,
  Sparkles,
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'analytics' | 'caio' | 'evaluator';
  onTabChange: (tab: 'analytics' | 'caio' | 'evaluator') => void;
  totalComments: number;
  filteredCount: number;
  onOpenUpload: () => void;
  onExportReport: () => void;
  onResetData: () => void;
  isFiltered: boolean;
  onClearFilters: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  totalComments,
  filteredCount,
  onOpenUpload,
  onExportReport,
  onResetData,
  isFiltered,
  onClearFilters,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-teal-500/20">
              <Hospital className="w-6 h-6 text-slate-950 font-bold" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-white">
                  HealthPulse
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  Executive Suite
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Patient Feedback Intelligence • CAIO Strategy • Clinical Quality
              </p>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="flex space-x-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
            <button
              onClick={() => onTabChange('analytics')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all ${
                activeTab === 'analytics'
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-900/40'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Healthcare Analytics</span>
            </button>

            <button
              onClick={() => onTabChange('caio')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all ${
                activeTab === 'caio'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/40'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Bot className="w-4 h-4 text-indigo-300" />
              <span>Chief AI Officer</span>
              <span className="hidden lg:inline-block text-[10px] bg-indigo-500/40 px-1.5 py-0.2 rounded text-indigo-100">
                Strategy
              </span>
            </button>

            <button
              onClick={() => onTabChange('evaluator')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all ${
                activeTab === 'evaluator'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <FileCheck2 className="w-4 h-4 text-emerald-300" />
              <span>Communication Evaluator</span>
              <span className="hidden lg:inline-block text-[10px] bg-emerald-500/30 text-emerald-200 px-1.5 py-0.5 rounded font-mono">
                10-Step
              </span>
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenUpload}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white transition shadow-sm"
              title="Upload custom patient feedback or communications (CSV/Excel)"
            >
              <Upload className="w-3.5 h-3.5 text-teal-400" />
              <span className="hidden md:inline">Upload Dataset</span>
            </button>

            <button
              onClick={onExportReport}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-teal-600/20 hover:bg-teal-600/30 border border-teal-500/40 text-teal-200 hover:text-white transition shadow-sm"
              title="Export Executive Brief to Print / PDF"
            >
              <Download className="w-3.5 h-3.5 text-teal-300" />
              <span className="hidden md:inline">Export Brief</span>
            </button>
          </div>
        </div>

        {/* Status bar info */}
        <div className="py-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1.5 text-slate-300 font-medium">
              <Activity className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
              <span>
                Active Dataset: <strong className="text-white">{filteredCount}</strong> of{' '}
                <strong className="text-white">{totalComments}</strong> comments
              </span>
            </span>
            {isFiltered && (
              <span className="flex items-center space-x-1 text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60 text-[11px]">
                <Filter className="w-3 h-3" />
                <span>Filters Active</span>
                <button
                  onClick={onClearFilters}
                  className="ml-1 underline hover:text-white cursor-pointer"
                >
                  Clear
                </button>
              </span>
            )}
          </div>

          <div className="flex items-center space-x-4 text-[11px]">
            <span className="hidden sm:inline text-slate-400">
              Target Framework: <strong className="text-slate-300">CAHPS / HCAHPS & NIST AI RMF</strong>
            </span>
            <button
              onClick={onResetData}
              className="text-slate-400 hover:text-slate-200 flex items-center space-x-1 transition"
              title="Reset to default multi-department dataset"
            >
              <RefreshCw className="w-3 h-3" />
              <span className="hidden md:inline">Reset Baseline</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
