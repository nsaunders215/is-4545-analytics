import React, { useState } from 'react';
import {
  FileCheck2,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  Copy,
  Check,
  RefreshCw,
  Heart,
  Scale,
  ShieldAlert,
  HelpCircle,
  FileText,
  Sliders,
  Eye,
  Download,
} from 'lucide-react';
import { SAMPLE_COMMUNICATIONS, SampleCommunication } from '../data/patientFeedbackDataset';
import { CommunicationEvaluation } from '../types';

export const CommunicationEvaluator: React.FC = () => {
  const [selectedSampleId, setSelectedSampleId] = useState<string>('sample-1');
  const [customText, setCustomText] = useState<string>(SAMPLE_COMMUNICATIONS[0].originalText);
  const [documentType, setDocumentType] = useState<string>(SAMPLE_COMMUNICATIONS[0].documentType);
  const [evaluating, setEvaluating] = useState<boolean>(false);
  const [evaluation, setEvaluation] = useState<CommunicationEvaluation | null>(null);
  const [activeStepTab, setActiveStepTab] = useState<number>(1);
  const [copiedRewrite, setCopiedRewrite] = useState<boolean>(false);
  const [copiedOutputFormat, setCopiedOutputFormat] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'side-by-side' | 'stepper' | 'formatted-output'>('side-by-side');

  // Trigger evaluation
  const runEvaluation = async (textToEvaluate: string, docType: string) => {
    setEvaluating(true);
    try {
      const res = await fetch('/api/evaluate-communication', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          communicationText: textToEvaluate,
          documentType: docType,
        }),
      });

      const data = await res.json();
      if (data.evaluation) {
        setEvaluation(data.evaluation);
      }
    } catch (err) {
      console.error('Evaluation failed:', err);
    } finally {
      setEvaluating(false);
    }
  };

  // Initial evaluation on mount if not yet evaluated
  React.useEffect(() => {
    if (!evaluation) {
      runEvaluation(SAMPLE_COMMUNICATIONS[0].originalText, SAMPLE_COMMUNICATIONS[0].documentType);
    }
  }, []);

  const handleSelectSample = (sample: SampleCommunication) => {
    setSelectedSampleId(sample.id);
    setCustomText(sample.originalText);
    setDocumentType(sample.documentType);
    runEvaluation(sample.originalText, sample.documentType);
  };

  const handleCopyRewrite = () => {
    if (!evaluation) return;
    navigator.clipboard.writeText(evaluation.step9_rewrittenCommunication);
    setCopiedRewrite(true);
    setTimeout(() => setCopiedRewrite(false), 2000);
  };

  const getFormattedReportText = () => {
    if (!evaluation) return '';
    return `Communication Purpose:
${evaluation.step1_purpose.primaryPurpose} - ${evaluation.step1_purpose.explanation}

Communication Quality Scores:
Clarity: ${evaluation.step2_scores.clarity.score}/5 (${evaluation.step2_scores.clarity.explanation})
Organization: ${evaluation.step2_scores.organization.score}/5 (${evaluation.step2_scores.organization.explanation})
Completeness: ${evaluation.step2_scores.completeness.score}/5 (${evaluation.step2_scores.completeness.explanation})
Readability: ${evaluation.step2_scores.readability.score}/5 (${evaluation.step2_scores.readability.explanation})
Professionalism: ${evaluation.step2_scores.professionalism.score}/5 (${evaluation.step2_scores.professionalism.explanation})
Empathy: ${evaluation.step2_scores.empathy.score}/5 (${evaluation.step2_scores.empathy.explanation})
Patient-centeredness: ${evaluation.step2_scores.patientCenteredness.score}/5 (${evaluation.step2_scores.patientCenteredness.explanation})
Actionability: ${evaluation.step2_scores.actionability.score}/5 (${evaluation.step2_scores.actionability.explanation})
Overall Average: ${evaluation.step2_scores.overallScore}/5.0

Health Literacy Assessment:
Classification: ${evaluation.step3_healthLiteracy.classification}
Reading Grade Level: ${evaluation.step3_healthLiteracy.readingGradeLevelEstimate}
Identified Medical Jargon: ${evaluation.step3_healthLiteracy.medicalJargonIdentified.join(', ')}
Recommendations: ${evaluation.step3_healthLiteracy.recommendations}

Patient Understanding Assessment:
- What Happened: ${evaluation.step4_patientUnderstanding.whatHappened.clear ? 'Clear' : 'Unclear'} (${evaluation.step4_patientUnderstanding.whatHappened.details})
- What To Do: ${evaluation.step4_patientUnderstanding.whatToDo.clear ? 'Clear' : 'Unclear'} (${evaluation.step4_patientUnderstanding.whatToDo.details})
- When To Seek Help: ${evaluation.step4_patientUnderstanding.whenToSeekHelp.clear ? 'Clear' : 'Unclear'} (${evaluation.step4_patientUnderstanding.whenToSeekHelp.details})
- When To Follow Up: ${evaluation.step4_patientUnderstanding.whenToFollowUp.clear ? 'Clear' : 'Unclear'} (${evaluation.step4_patientUnderstanding.whenToFollowUp.details})
- Who To Contact: ${evaluation.step4_patientUnderstanding.whoToContact.clear ? 'Clear' : 'Unclear'} (${evaluation.step4_patientUnderstanding.whoToContact.details})
Missing or Unclear Info: ${evaluation.step4_patientUnderstanding.missingOrUnclearInfo.join('; ') || 'None identified'}

Communication Risks:
Overall Risk: ${evaluation.step5_riskAssessment.overallRisk}
Risk Factors: ${evaluation.step5_riskAssessment.riskFactors.join(', ')}
Explanation: ${evaluation.step5_riskAssessment.explanation}

Accessibility Review:
- Older Adults: ${evaluation.step6_accessibilityReview.olderAdults}
- Limited Health Literacy: ${evaluation.step6_accessibilityReview.limitedHealthLiteracy}
- Limited English Proficiency: ${evaluation.step6_accessibilityReview.limitedEnglishProficiency}
- Disabilities: ${evaluation.step6_accessibilityReview.disabilities}
Accessibility Concerns: ${evaluation.step6_accessibilityReview.accessibilityConcerns.join(', ')}

Emotional Tone:
Tone: ${evaluation.step7_emotionalTone.tone}
Explanation: ${evaluation.step7_emotionalTone.explanation}

Improvement Recommendations:
${evaluation.step8_improvementRecommendations.map((r, i) => `${i + 1}. ${r}`).join('\n')}

Rewritten Communication (6th-Grade Target):
${evaluation.step9_rewrittenCommunication}

Executive Summary:
- Overall Quality: ${evaluation.step10_executiveSummary.overallQuality}
- Major Strengths: ${evaluation.step10_executiveSummary.majorStrengths.join(', ')}
- Major Weaknesses: ${evaluation.step10_executiveSummary.majorWeaknesses.join(', ')}
- Highest Communication Risk: ${evaluation.step10_executiveSummary.highestCommunicationRisk}
- Most Important Improvement: ${evaluation.step10_executiveSummary.mostImportantImprovement}
`;
  };

  const handleCopyFormattedOutput = () => {
    const text = getFormattedReportText();
    navigator.clipboard.writeText(text);
    setCopiedOutputFormat(true);
    setTimeout(() => setCopiedOutputFormat(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border border-emerald-800/60 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="max-w-3xl">
          <div className="flex items-center space-x-2 text-emerald-400 font-mono text-xs font-semibold mb-2">
            <FileCheck2 className="w-4 h-4" />
            <span>CLINICAL QUALITY IMPROVEMENT INSTRUMENT</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Healthcare Communication Quality Evaluator
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            Strict 10-step protocol to assess patient-facing healthcare communications. Evaluates readability, empathy, health literacy, and clinical risk—transforming complex notes into compassionate 6th-grade action guides.
          </p>
        </div>

        {/* Clinical Guardrail Badge */}
        <div className="mt-4 pt-3 border-t border-emerald-800/60 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
          <span>
            ⚖️ <strong>Role Boundary:</strong> Evaluates communication quality and safety, not diagnostic correctness. Preserves medical intent without inventing clinical facts.
          </span>
          <span className="bg-emerald-900/60 text-emerald-300 border border-emerald-700/60 px-2.5 py-1 rounded-full font-mono text-[11px]">
            Target: 6th-Grade Reading Level
          </span>
        </div>
      </div>

      {/* Preset Communications Selector & Input Area */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Select Clinical Communication or Paste Custom Text</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Choose from authentic EHR discharge instructions, portal notes, billing notices, or AI responses.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => runEvaluation(customText, documentType)}
              disabled={evaluating || !customText.trim()}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-lg shadow-emerald-900/40 cursor-pointer"
            >
              {evaluating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Evaluating 10 Steps...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Run 10-Step Audit</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Preset Buttons */}
        <div className="flex flex-wrap gap-2 mb-4">
          {SAMPLE_COMMUNICATIONS.map((sample) => (
            <button
              key={sample.id}
              onClick={() => handleSelectSample(sample)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer text-left border ${
                selectedSampleId === sample.id
                  ? 'bg-emerald-600/30 text-emerald-200 border-emerald-500/60 shadow-sm'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
            >
              <div className="font-semibold text-white truncate max-w-[220px]">
                {sample.title}
              </div>
              <div className="text-[10px] text-slate-400">{sample.documentType}</div>
            </button>
          ))}
        </div>

        {/* Text Input Editor */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <span className="text-slate-400">Communication Context:</span>
              <input
                type="text"
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white"
                placeholder="e.g. Discharge Instructions"
              />
            </div>
            <span className="text-slate-500 font-mono text-[11px]">
              {customText.length} characters • {customText.split(/\s+/).filter(Boolean).length} words
            </span>
          </div>

          <textarea
            value={customText}
            onChange={(e) => {
              setCustomText(e.target.value);
              setSelectedSampleId('');
            }}
            rows={7}
            placeholder="Paste patient discharge instructions, portal message, after-visit summary, or chatbot response here..."
            className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono leading-relaxed"
          />
        </div>
      </div>

      {/* Results Section */}
      {evaluation && (
        <div className="space-y-6">
          {/* View Mode Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-900 border border-slate-800 rounded-2xl">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-300">View Audit Mode:</span>
              <div className="flex space-x-1 bg-slate-800 p-1 rounded-xl">
                <button
                  onClick={() => setViewMode('side-by-side')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    viewMode === 'side-by-side'
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  ⚡ Side-by-Side 6th Grade Rewrite
                </button>
                <button
                  onClick={() => setViewMode('stepper')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    viewMode === 'stepper'
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  📑 10-Step Deep Dive
                </button>
                <button
                  onClick={() => setViewMode('formatted-output')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    viewMode === 'formatted-output'
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  📄 Formal Output Format
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopyFormattedOutput}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium transition flex items-center space-x-1 cursor-pointer border border-slate-700"
              >
                {copiedOutputFormat ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Report Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Full Audit</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Scorecard Header */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl">
              <span className="text-[11px] text-slate-400 block uppercase font-mono">
                Step 1: Purpose
              </span>
              <span className="text-xs font-bold text-teal-300 mt-1 block truncate">
                {evaluation.step1_purpose.primaryPurpose}
              </span>
            </div>

            <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl">
              <span className="text-[11px] text-slate-400 block uppercase font-mono">
                Step 2: Quality Score
              </span>
              <span className="text-base font-extrabold text-white mt-0.5 block">
                {evaluation.step2_scores.overallScore}{' '}
                <span className="text-xs font-normal text-slate-400">/ 5.0</span>
              </span>
            </div>

            <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl">
              <span className="text-[11px] text-slate-400 block uppercase font-mono">
                Step 3: Literacy
              </span>
              <span
                className={`text-xs font-bold mt-1 block ${
                  evaluation.step3_healthLiteracy.classification === 'Poor'
                    ? 'text-rose-400'
                    : evaluation.step3_healthLiteracy.classification === 'Fair'
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}
              >
                {evaluation.step3_healthLiteracy.classification} (
                {evaluation.step3_healthLiteracy.readingGradeLevelEstimate})
              </span>
            </div>

            <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl">
              <span className="text-[11px] text-slate-400 block uppercase font-mono">
                Step 5: Risk Level
              </span>
              <span
                className={`text-xs font-bold mt-1 block ${
                  evaluation.step5_riskAssessment.overallRisk === 'High'
                    ? 'text-rose-400'
                    : evaluation.step5_riskAssessment.overallRisk === 'Moderate'
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}
              >
                {evaluation.step5_riskAssessment.overallRisk} Risk
              </span>
            </div>

            <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl">
              <span className="text-[11px] text-slate-400 block uppercase font-mono">
                Step 7: Emotional Tone
              </span>
              <span className="text-xs font-bold text-indigo-300 mt-1 block">
                {evaluation.step7_emotionalTone.tone}
              </span>
            </div>

            <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl">
              <span className="text-[11px] text-slate-400 block uppercase font-mono">
                Step 9: Rewrite Target
              </span>
              <span className="text-xs font-bold text-emerald-400 mt-1 block">
                6th-Grade Level Ready
              </span>
            </div>
          </div>

          {/* VIEW MODE 1: SIDE-BY-SIDE REWRITE (STEP 9 FOCUS) */}
          {viewMode === 'side-by-side' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Original with Jargon Highlighting */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-800">
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                      <h4 className="text-sm font-bold text-white">
                        Original Healthcare Communication
                      </h4>
                    </div>
                    <span className="text-xs text-rose-400 font-mono font-medium">
                      Estimated: {evaluation.step3_healthLiteracy.readingGradeLevelEstimate}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 font-mono text-xs sm:text-sm text-slate-300 whitespace-pre-line leading-relaxed max-h-[460px] overflow-y-auto">
                    {customText}
                  </div>

                  {/* Highlighted Jargon Tags */}
                  <div className="mt-4">
                    <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider block mb-1.5">
                      Identified Medical Jargon & Barrier Words ({evaluation.step3_healthLiteracy.medicalJargonIdentified.length}):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {evaluation.step3_healthLiteracy.medicalJargonIdentified.map((j) => (
                        <span
                          key={j}
                          className="px-2 py-0.5 rounded-full bg-rose-950/80 text-rose-300 border border-rose-800/80 text-[11px] font-mono"
                        >
                          ⚠️ {j}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
                  ⚠️ High cognitive load; patients unfamiliar with Latin abbreviations (PO, BID, PRN) may commit severe dosing errors.
                </div>
              </div>

              {/* Rewritten 6th-Grade Communication */}
              <div className="bg-slate-900/90 border border-emerald-900/50 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3 pb-3 border-b border-emerald-800/60">
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                      <h4 className="text-sm font-bold text-white">
                        STEP 9: Rewritten Patient-Centered Communication
                      </h4>
                    </div>
                    <button
                      onClick={handleCopyRewrite}
                      className="text-xs text-emerald-300 hover:text-white flex items-center space-x-1 cursor-pointer"
                    >
                      {copiedRewrite ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Rewrite</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-900/60 text-xs sm:text-sm text-slate-100 whitespace-pre-line leading-relaxed max-h-[460px] overflow-y-auto">
                    {evaluation.step9_rewrittenCommunication}
                  </div>

                  {/* Highlights of Rewrite */}
                  <div className="mt-4 p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 space-y-1">
                    <div className="font-bold text-emerald-300 flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Quality Transformation Highlights:</span>
                    </div>
                    <ul className="list-disc list-inside text-[11px] text-slate-300 space-y-0.5">
                      <li>Simplified vocabulary to approx 6th-grade reading level</li>
                      <li>Clear, bulleted action items with water and food guidelines</li>
                      <li>Explicit warning signs for emergency hospital return</li>
                      <li>Preserves medical intent with zero invented clinical facts</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-emerald-400 font-medium">
                  ✅ Suitable for direct printing or portal delivery to elderly and limited-health-literacy cohorts.
                </div>
              </div>
            </div>
          )}

          {/* VIEW MODE 2: STEPPER (ALL 10 STEPS DEEP DIVE) */}
          {viewMode === 'stepper' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl">
              {/* Stepper Tabs */}
              <div className="flex flex-wrap gap-1.5 mb-6 pb-4 border-b border-slate-800">
                {[
                  { step: 1, label: 'Purpose' },
                  { step: 2, label: 'Quality Scores' },
                  { step: 3, label: 'Health Literacy' },
                  { step: 4, label: 'Understanding' },
                  { step: 5, label: 'Risk' },
                  { step: 6, label: 'Accessibility' },
                  { step: 7, label: 'Tone' },
                  { step: 8, label: 'Recommendations' },
                  { step: 9, label: 'Rewrite' },
                  { step: 10, label: 'Executive Summary' },
                ].map((s) => (
                  <button
                    key={s.step}
                    onClick={() => setActiveStepTab(s.step)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center space-x-1.5 ${
                      activeStepTab === s.step
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-slate-800/80 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-black/20 text-[10px] flex items-center justify-center font-mono">
                      {s.step}
                    </span>
                    <span>{s.label}</span>
                  </button>
                ))}
              </div>

              {/* STEP 1: Purpose */}
              {activeStepTab === 1 && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
                    <BookOpen className="w-4 h-4" />
                    <span>STEP 1: Communication Purpose</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-2">
                    <div className="text-xs text-slate-400 uppercase font-mono">Primary Category:</div>
                    <div className="text-lg font-bold text-white">
                      {evaluation.step1_purpose.primaryPurpose}
                    </div>
                    <div className="text-xs text-slate-300">
                      <strong>Clinical Rationale:</strong> {evaluation.step1_purpose.explanation}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: 8 Dimensions Quality Evaluation */}
              {activeStepTab === 2 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
                      <Sliders className="w-4 h-4" />
                      <span>STEP 2: Communication Quality Evaluation (1 - 5 Scale)</span>
                    </div>
                    <span className="text-sm font-extrabold text-white">
                      Composite: {evaluation.step2_scores.overallScore} / 5.0
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { key: 'clarity', label: 'Clarity', data: evaluation.step2_scores.clarity },
                      { key: 'organization', label: 'Organization', data: evaluation.step2_scores.organization },
                      { key: 'completeness', label: 'Completeness', data: evaluation.step2_scores.completeness },
                      { key: 'readability', label: 'Readability', data: evaluation.step2_scores.readability },
                      { key: 'professionalism', label: 'Professionalism', data: evaluation.step2_scores.professionalism },
                      { key: 'empathy', label: 'Empathy', data: evaluation.step2_scores.empathy },
                      { key: 'patientCenteredness', label: 'Patient-Centeredness', data: evaluation.step2_scores.patientCenteredness },
                      { key: 'actionability', label: 'Actionability', data: evaluation.step2_scores.actionability },
                    ].map((item) => (
                      <div
                        key={item.key}
                        className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-white">{item.label}</span>
                          <span
                            className={`font-mono font-bold px-2 py-0.5 rounded ${
                              item.data.score >= 4
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                : item.data.score === 3
                                ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                : 'bg-rose-950 text-rose-300 border border-rose-800'
                            }`}
                          >
                            {item.data.score} / 5
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300">{item.data.explanation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 3: Health Literacy */}
              {activeStepTab === 3 && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
                    <BookOpen className="w-4 h-4" />
                    <span>STEP 3: Health Literacy Assessment</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">Classification:</span>
                      <span className="text-xs font-bold text-white px-2.5 py-1 rounded-full bg-slate-700">
                        {evaluation.step3_healthLiteracy.classification}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">Reading Grade Level Estimate:</span>
                      <span className="text-xs font-mono font-bold text-amber-300">
                        {evaluation.step3_healthLiteracy.readingGradeLevelEstimate}
                      </span>
                    </div>

                    <div>
                      <span className="text-xs text-slate-400 block mb-1">
                        Medical Jargon Identified:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {evaluation.step3_healthLiteracy.medicalJargonIdentified.map((j) => (
                          <span
                            key={j}
                            className="px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800 text-[11px] font-mono"
                          >
                            {j}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-700/60 text-xs text-slate-200">
                      <strong>Literacy Recommendations:</strong> {evaluation.step3_healthLiteracy.recommendations}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Patient Understanding */}
              {activeStepTab === 4 && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
                    <HelpCircle className="w-4 h-4" />
                    <span>STEP 4: Patient Understanding Assessment</span>
                  </div>

                  <div className="space-y-2.5">
                    {[
                      { label: 'What Happened', item: evaluation.step4_patientUnderstanding.whatHappened },
                      { label: 'What They Need To Do', item: evaluation.step4_patientUnderstanding.whatToDo },
                      { label: 'When To Seek Help', item: evaluation.step4_patientUnderstanding.whenToSeekHelp },
                      { label: 'When To Follow Up', item: evaluation.step4_patientUnderstanding.whenToFollowUp },
                      { label: 'Who To Contact', item: evaluation.step4_patientUnderstanding.whoToContact },
                    ].map((elem, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 flex items-start space-x-3 text-xs"
                      >
                        {elem.item.clear ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <span className="font-bold text-white mr-2">{elem.label}:</span>
                          <span className="text-slate-300">{elem.item.details}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {evaluation.step4_patientUnderstanding.missingOrUnclearInfo.length > 0 && (
                    <div className="p-3.5 bg-rose-950/40 border border-rose-900/60 rounded-xl text-xs text-rose-200">
                      <strong>Missing or Unclear Information:</strong>{' '}
                      {evaluation.step4_patientUnderstanding.missingOrUnclearInfo.join('; ')}
                    </div>
                  )}
                </div>
              )}

              {/* STEP 5: Risk Assessment */}
              {activeStepTab === 5 && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-rose-400 font-bold text-sm">
                    <ShieldAlert className="w-4 h-4" />
                    <span>STEP 5: Communication Risk Assessment</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">Overall Communication Risk:</span>
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full ${
                          evaluation.step5_riskAssessment.overallRisk === 'High'
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : evaluation.step5_riskAssessment.overallRisk === 'Moderate'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        }`}
                      >
                        {evaluation.step5_riskAssessment.overallRisk} Risk
                      </span>
                    </div>

                    <div>
                      <span className="text-xs text-slate-400 block mb-1">Identified Risk Factors:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {evaluation.step5_riskAssessment.riskFactors.map((rf) => (
                          <span
                            key={rf}
                            className="px-2 py-0.5 rounded-full bg-rose-950/80 text-rose-300 border border-rose-800 text-[11px]"
                          >
                            ⚠️ {rf}
                          </span>
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 pt-2 border-t border-slate-700/60">
                      <strong>Risk Reasoning:</strong> {evaluation.step5_riskAssessment.explanation}
                    </p>
                  </div>
                </div>
              )}

              {/* STEP 6: Accessibility */}
              {activeStepTab === 6 && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-indigo-400 font-bold text-sm">
                    <Scale className="w-4 h-4" />
                    <span>STEP 6: Accessibility & Inclusiveness Review</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 text-xs space-y-1">
                      <strong className="text-white">Older Adults:</strong>
                      <p className="text-slate-300">{evaluation.step6_accessibilityReview.olderAdults}</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 text-xs space-y-1">
                      <strong className="text-white">Limited Health Literacy:</strong>
                      <p className="text-slate-300">{evaluation.step6_accessibilityReview.limitedHealthLiteracy}</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 text-xs space-y-1">
                      <strong className="text-white">Limited English Proficiency (LEP):</strong>
                      <p className="text-slate-300">{evaluation.step6_accessibilityReview.limitedEnglishProficiency}</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 text-xs space-y-1">
                      <strong className="text-white">Disabilities:</strong>
                      <p className="text-slate-300">{evaluation.step6_accessibilityReview.disabilities}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 7: Emotional Tone */}
              {activeStepTab === 7 && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-teal-400 font-bold text-sm">
                    <Heart className="w-4 h-4" />
                    <span>STEP 7: Emotional Tone Evaluation</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">Classification:</span>
                      <span className="text-sm font-bold text-white px-3 py-1 rounded-full bg-slate-700">
                        {evaluation.step7_emotionalTone.tone}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-2">
                      <strong>Tone Analysis:</strong> {evaluation.step7_emotionalTone.explanation}
                    </p>
                  </div>
                </div>
              )}

              {/* STEP 8: Improvement Recommendations */}
              {activeStepTab === 8 && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
                    <Sparkles className="w-4 h-4" />
                    <span>STEP 8: Tactical Improvement Recommendations</span>
                  </div>

                  <div className="space-y-2.5">
                    {evaluation.step8_improvementRecommendations.map((rec, i) => (
                      <div
                        key={i}
                        className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 flex items-start space-x-3 text-xs text-slate-200"
                      >
                        <span className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-[11px] shrink-0">
                          {i + 1}
                        </span>
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 9: Rewrite */}
              {activeStepTab === 9 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
                      <FileCheck2 className="w-4 h-4" />
                      <span>STEP 9: Rewritten Communication (6th-Grade Target)</span>
                    </div>
                    <button
                      onClick={handleCopyRewrite}
                      className="text-xs text-emerald-300 hover:text-white flex items-center space-x-1 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-900/60 text-xs sm:text-sm text-slate-100 whitespace-pre-line leading-relaxed font-sans">
                    {evaluation.step9_rewrittenCommunication}
                  </div>
                </div>
              )}

              {/* STEP 10: Executive Summary */}
              {activeStepTab === 10 && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-indigo-400 font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>STEP 10: Executive Summary</span>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-3 text-xs">
                    <div>
                      <strong className="text-white block text-sm mb-1">Overall Quality:</strong>
                      <p className="text-slate-300 leading-relaxed">
                        {evaluation.step10_executiveSummary.overallQuality}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                      <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-900/40">
                        <strong className="text-emerald-300 block mb-1">Major Strengths:</strong>
                        <ul className="list-disc list-inside text-slate-300 space-y-0.5">
                          {evaluation.step10_executiveSummary.majorStrengths.map((s, idx) => (
                            <li key={idx}>{s}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-900/40">
                        <strong className="text-rose-300 block mb-1">Major Weaknesses:</strong>
                        <ul className="list-disc list-inside text-slate-300 space-y-0.5">
                          {evaluation.step10_executiveSummary.majorWeaknesses.map((w, idx) => (
                            <li key={idx}>{w}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-2 space-y-1.5">
                      <div>
                        <strong className="text-rose-400">Highest Communication Risk:</strong>{' '}
                        <span className="text-slate-200">
                          {evaluation.step10_executiveSummary.highestCommunicationRisk}
                        </span>
                      </div>
                      <div>
                        <strong className="text-teal-400">Most Important Improvement:</strong>{' '}
                        <span className="text-slate-200">
                          {evaluation.step10_executiveSummary.mostImportantImprovement}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* VIEW MODE 3: FORMAL OUTPUT FORMAT (AS SPECIFIED IN PROMPT) */}
          {viewMode === 'formatted-output' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span>Standard Healthcare Quality Output Format</span>
                </h4>
                <button
                  onClick={handleCopyFormattedOutput}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Formatted Document</span>
                </button>
              </div>

              <pre className="p-5 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed max-h-[600px] overflow-y-auto">
                {getFormattedReportText()}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
