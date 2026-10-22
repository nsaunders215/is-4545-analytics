import React, { useState, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { FilterBar } from './components/FilterBar';
import { ExecutiveOverview } from './components/ExecutiveOverview';
import { SatisfactionInsights } from './components/SatisfactionInsights';
import { NLPAnalysis } from './components/NLPAnalysis';
import { HiddenProblems } from './components/HiddenProblems';
import { EquityAccessibility } from './components/EquityAccessibility';
import { AIRiskMonitoring } from './components/AIRiskMonitoring';
import { AIAgentOpportunities } from './components/AIAgentOpportunities';
import { ExecutiveRecommendations } from './components/ExecutiveRecommendations';
import { CAIODashboard } from './components/CAIODashboard';
import { CommunicationEvaluator } from './components/CommunicationEvaluator';
import { UploadModal } from './components/UploadModal';
import { ExecutiveExportModal } from './components/ExecutiveExportModal';
import { getInitialFeedbackDataset } from './data/patientFeedbackDataset';
import {
  PatientComment,
  ServiceLine,
  VisitType,
  PatientPersona,
} from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'analytics' | 'caio' | 'evaluator'>('analytics');
  const [allComments, setAllComments] = useState<PatientComment[]>(() =>
    getInitialFeedbackDataset()
  );

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Filters State
  const [filters, setFilters] = useState({
    serviceLine: '',
    visitType: '',
    persona: '',
    sentiment: '',
    issueFlag: '',
    searchQuery: '',
  });

  // Selected keyword from NLP wordcloud/search
  const [selectedKeyword, setSelectedKeyword] = useState<string>('');

  // Extract unique options
  const serviceLines = useMemo(() => {
    return Array.from(new Set(allComments.map((c) => c.serviceLine))).sort() as ServiceLine[];
  }, [allComments]);

  const visitTypes = useMemo(() => {
    return Array.from(new Set(allComments.map((c) => c.visitType))).sort() as VisitType[];
  }, [allComments]);

  const personas = useMemo(() => {
    return Array.from(new Set(allComments.map((c) => c.patientPersona))).sort() as PatientPersona[];
  }, [allComments]);

  // Apply filters
  const filteredComments = useMemo(() => {
    return allComments.filter((c) => {
      if (filters.serviceLine && c.serviceLine !== filters.serviceLine) return false;
      if (filters.visitType && c.visitType !== filters.visitType) return false;
      if (filters.persona && c.patientPersona !== filters.persona) return false;
      if (filters.sentiment && c.sentiment !== filters.sentiment) return false;
      if (filters.issueFlag && !c.issueCategories.includes(filters.issueFlag as any))
        return false;
      if (
        selectedKeyword &&
        !c.commentText.toLowerCase().includes(selectedKeyword.toLowerCase()) &&
        !c.keywords.some((k) => k.toLowerCase() === selectedKeyword.toLowerCase())
      ) {
        return false;
      }
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        const matchesText = c.commentText.toLowerCase().includes(q);
        const matchesKw = c.keywords.some((k) => k.toLowerCase().includes(q));
        const matchesId = c.patientId.toLowerCase().includes(q) || c.id.toLowerCase().includes(q);
        if (!matchesText && !matchesKw && !matchesId) return false;
      }
      return true;
    });
  }, [allComments, filters, selectedKeyword]);

  const isFiltered = Boolean(
    filters.serviceLine ||
    filters.visitType ||
    filters.persona ||
    filters.sentiment ||
    filters.issueFlag ||
    filters.searchQuery ||
    selectedKeyword
  );

  const handleClearFilters = () => {
    setFilters({
      serviceLine: '',
      visitType: '',
      persona: '',
      sentiment: '',
      issueFlag: '',
      searchQuery: '',
    });
    setSelectedKeyword('');
  };

  const handleResetBaselineData = () => {
    setAllComments(getInitialFeedbackDataset());
    handleClearFilters();
  };

  const handleDrillDownIssue = (issueFlag: string) => {
    setFilters((prev) => ({ ...prev, issueFlag }));
    setActiveTab('analytics');
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleSelectServiceLine = (sl: string) => {
    setFilters((prev) => ({ ...prev, serviceLine: prev.serviceLine === sl ? '' : sl }));
  };

  const handleSelectPersona = (p: string) => {
    setFilters((prev) => ({ ...prev, persona: prev.persona === p ? '' : p }));
  };

  const handleSelectVisitType = (vt: string) => {
    setFilters((prev) => ({ ...prev, visitType: prev.visitType === vt ? '' : vt }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-teal-500 selection:text-white">
      {/* Top Navbar & Mode Switcher */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        totalComments={allComments.length}
        filteredCount={filteredComments.length}
        onOpenUpload={() => setIsUploadOpen(true)}
        onExportReport={() => setIsExportOpen(true)}
        onResetData={handleResetBaselineData}
        isFiltered={isFiltered}
        onClearFilters={handleClearFilters}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mode 1: Healthcare Analytics Dashboard (Sections 1 - 9) */}
        {activeTab === 'analytics' && (
          <div>
            {/* Filter Toolbar */}
            <FilterBar
              filters={filters}
              onFilterChange={setFilters}
              serviceLines={serviceLines}
              visitTypes={visitTypes}
              personas={personas}
              onClear={handleClearFilters}
            />

            {/* SECTION 1: Executive Overview */}
            <ExecutiveOverview comments={filteredComments} />

            {/* SECTION 2: Patient Satisfaction Insights */}
            <SatisfactionInsights
              comments={filteredComments}
              onSelectServiceLine={handleSelectServiceLine}
              onSelectPersona={handleSelectPersona}
              onSelectVisitType={handleSelectVisitType}
            />

            {/* SECTION 3: NLP Analysis */}
            <NLPAnalysis
              comments={filteredComments}
              selectedKeyword={selectedKeyword}
              onSelectKeyword={setSelectedKeyword}
            />

            {/* SECTION 4: Hidden Organizational Problems */}
            <HiddenProblems
              comments={filteredComments}
              onDrillDownIssue={handleDrillDownIssue}
            />

            {/* SECTION 6: Healthcare Equity and Accessibility */}
            <EquityAccessibility
              comments={filteredComments}
              onSelectPersona={handleSelectPersona}
              onSelectFlag={handleDrillDownIssue}
            />

            {/* SECTION 7: AI Risk Monitoring */}
            <AIRiskMonitoring comments={filteredComments} />

            {/* SECTION 8: AI Agent Opportunities */}
            <AIAgentOpportunities />

            {/* SECTION 9: Executive Recommendations */}
            <ExecutiveRecommendations />
          </div>
        )}

        {/* Mode 2: Chief AI Officer Agent & AI Transformation Dashboard */}
        {activeTab === 'caio' && <CAIODashboard comments={allComments} />}

        {/* Mode 3: Healthcare Communication Quality Evaluator */}
        {activeTab === 'evaluator' && <CommunicationEvaluator />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-teal-400 inline-block animate-pulse" />
            <span>HealthPulse Clinical Intelligence • System Version 4.2</span>
          </div>
          <div className="flex space-x-6 text-slate-400">
            <span>CAHPS / HCAHPS Compliant</span>
            <span>NIST AI RMF 1.0</span>
            <span>HIPAA BAA Architecture</span>
          </div>
          <div>
            <span>© 2026 Academic Health System • Confidential Executive Asset</span>
          </div>
        </div>
      </footer>

      {/* Upload Modal (CSV / Excel) */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onDataLoaded={(newComments) => {
          setAllComments(newComments);
          setActiveTab('analytics');
          handleClearFilters();
        }}
        onCommunicationLoaded={(text, title) => {
          setActiveTab('evaluator');
        }}
      />

      {/* Executive Brief Export Modal (Print / PDF) */}
      <ExecutiveExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        comments={filteredComments}
      />
    </div>
  );
}
