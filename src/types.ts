export type ServiceLine =
  | 'Emergency Medicine'
  | 'Cardiology'
  | 'Oncology'
  | 'Orthopedics'
  | 'Pediatrics'
  | 'Neurology'
  | 'Primary Care'
  | 'Telehealth'
  | 'General Surgery';

export type VisitType =
  | 'Emergency'
  | 'Inpatient'
  | 'Outpatient Clinic'
  | 'Telehealth'
  | 'Ambulatory Surgery';

export type PatientPersona =
  | 'Elderly Chronic Care'
  | 'Tech-Savvy Young Adult'
  | 'Non-English Primary (LEP)'
  | 'Busy Working Parent'
  | 'Low Health Literacy'
  | 'Underinsured / High Deductible';

export type Sentiment = 'Positive' | 'Neutral' | 'Negative';

export type PrimaryTheme =
  | 'Wait Time & Access'
  | 'Staff Communication'
  | 'Discharge Instructions'
  | 'Digital Portal & Tech'
  | 'Billing & Insurance'
  | 'Care Coordination'
  | 'Empathy & Bedside Manner'
  | 'Facility & Environment';

export type IssueCategory =
  | 'HighComplaintRate'
  | 'CommunicationBottleneck'
  | 'TechIssue'
  | 'SchedulingIssue'
  | 'WaitTimeComplaint'
  | 'EquityBarrier'
  | 'LanguageBarrier'
  | 'DigitalLiteracy'
  | 'HallucinationTrap'
  | 'BiasRisk'
  | 'HumanReviewNeeded';

export interface PatientComment {
  id: string;
  date: string;
  patientId: string;
  serviceLine: ServiceLine;
  visitType: VisitType;
  patientPersona: PatientPersona;
  satisfactionScore: number; // 1 to 5
  communicationRating: number; // 1 to 5
  followUpCompliant: boolean;
  waitTimeMinutes: number;
  commentText: string;
  sentiment: Sentiment;
  primaryTheme: PrimaryTheme;
  keywords: string[];
  issueCategories: IssueCategory[];
  providerFeedback?: string;
}

export interface DimensionScore {
  score: number; // 1 to 5
  explanation: string;
}

export interface CommunicationEvaluation {
  step1_purpose: {
    primaryPurpose:
      | 'Patient Education'
      | 'Appointment Information'
      | 'Medication Instructions'
      | 'Follow-up Care'
      | 'Care Coordination'
      | 'Administrative Communication'
      | 'Billing Communication'
      | 'Health Promotion'
      | 'Emergency Instructions'
      | 'Other';
    explanation: string;
  };
  step2_scores: {
    clarity: DimensionScore;
    organization: DimensionScore;
    completeness: DimensionScore;
    readability: DimensionScore;
    professionalism: DimensionScore;
    empathy: DimensionScore;
    patientCenteredness: DimensionScore;
    actionability: DimensionScore;
    overallScore: number;
  };
  step3_healthLiteracy: {
    classification: 'Excellent' | 'Good' | 'Fair' | 'Poor';
    readingGradeLevelEstimate: string;
    medicalJargonIdentified: string[];
    technicalExplanationsFlagged: string[];
    recommendations: string;
  };
  step4_patientUnderstanding: {
    whatHappened: { clear: boolean; details: string };
    whatToDo: { clear: boolean; details: string };
    whenToSeekHelp: { clear: boolean; details: string };
    whenToFollowUp: { clear: boolean; details: string };
    whoToContact: { clear: boolean; details: string };
    missingOrUnclearInfo: string[];
  };
  step5_riskAssessment: {
    overallRisk: 'Low' | 'Moderate' | 'High';
    riskFactors: string[];
    explanation: string;
  };
  step6_accessibilityReview: {
    olderAdults: string;
    limitedHealthLiteracy: string;
    limitedEnglishProficiency: string;
    disabilities: string;
    accessibilityConcerns: string[];
  };
  step7_emotionalTone: {
    tone: 'Highly Empathetic' | 'Empathetic' | 'Neutral' | 'Cold' | 'Potentially Distressing';
    explanation: string;
  };
  step8_improvementRecommendations: string[];
  step9_rewrittenCommunication: string;
  step10_executiveSummary: {
    overallQuality: string;
    majorStrengths: string[];
    majorWeaknesses: string[];
    highestCommunicationRisk: string;
    mostImportantImprovement: string;
  };
}

export interface AIAgentOpportunity {
  id: string;
  name: string;
  purpose: string;
  expectedImpact: string;
  category: 'Clinical Navigation' | 'Operations & Triage' | 'Health Equity' | 'Safety & Governance' | 'Post-Care Adherence';
  quadrant: 'Quick Win' | 'Strategic Game Changer' | 'Foundational' | 'Long-Term Transformation';
  impactScore: number; // 1-10
  feasibilityScore: number; // 1-10
  timeframe: '< 3 Months' | '3-6 Months' | '6-12 Months' | '12+ Months';
  targetServiceLines: ServiceLine[];
  kpisTargeted: string[];
}

export interface RiskGovernanceItem {
  id: string;
  category: 'Hallucination & Safety' | 'Algorithmic Bias & Equity' | 'HIPAA & Data Privacy' | 'Clinical Triage Risk' | 'Physician Burnout';
  severity: 'Critical' | 'High' | 'Medium';
  title: string;
  description: string;
  mitigationControl: string;
  nistDomain: 'Govern' | 'Map' | 'Measure' | 'Manage';
  auditStatus: 'Compliant & Guardrailed' | 'In Validation' | 'Monitoring';
}

export interface RoadmapPhase {
  phase: string;
  timeframe: string;
  title: string;
  milestones: string[];
  governanceGates: string[];
  targetedOutcomes: string[];
  readinessLevel: string;
}
