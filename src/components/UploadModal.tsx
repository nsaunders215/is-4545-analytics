import React, { useState, useRef } from 'react';
import { X, Upload, FileText, CheckCircle2, AlertTriangle, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import { PatientComment, ServiceLine, VisitType, PatientPersona, Sentiment, PrimaryTheme } from '../types';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataLoaded: (comments: PatientComment[]) => void;
  onCommunicationLoaded?: (text: string, title: string) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onDataLoaded,
  onCommunicationLoaded,
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [parsedRows, setParsedRows] = useState<any[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [uploadType, setUploadType] = useState<'feedback' | 'communication'>('feedback');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFile = async (file: File) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setFileName(file.name);

    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const rawData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

      if (!rawData || rawData.length === 0) {
        setErrorMsg('The uploaded file appears to be empty or has no readable rows.');
        return;
      }

      setParsedRows(rawData);
      setSuccessMsg(`Successfully read ${rawData.length} rows from "${file.name}"!`);
    } catch (err: any) {
      setErrorMsg(`Failed to parse file: ${err?.message || 'Invalid format'}`);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const applyData = () => {
    if (parsedRows.length === 0) return;

    if (uploadType === 'feedback') {
      // Map rows into PatientComment interface
      const mappedComments: PatientComment[] = parsedRows.map((r, idx) => {
        const text = r.commentText || r.Comment || r.comment || r.feedback || r.Feedback || r.text || r.Text || 'No comment provided';
        const serviceLine = (r.serviceLine || r.ServiceLine || r.Department || r.department || 'Primary Care') as ServiceLine;
        const visitType = (r.visitType || r.VisitType || r.Type || 'Outpatient Clinic') as VisitType;
        const persona = (r.patientPersona || r.Persona || r.persona || 'Elderly Chronic Care') as PatientPersona;
        const satisfactionScore = Math.min(5, Math.max(1, Number(r.satisfactionScore || r.Satisfaction || r.score || r.Score || 3)));
        const communicationRating = Math.min(5, Math.max(1, Number(r.communicationRating || r.CommunicationRating || r.communication || 3)));
        const followUpCompliant = String(r.followUpCompliant || r.FollowUp || 'true').toLowerCase() === 'true' || r.followUpCompliant === true;
        const waitTimeMinutes = Number(r.waitTimeMinutes || r.WaitTime || r.Wait || 35);
        const sentiment = (satisfactionScore >= 4 ? 'Positive' : satisfactionScore === 3 ? 'Neutral' : 'Negative') as Sentiment;
        const primaryTheme = (r.primaryTheme || r.Theme || (satisfactionScore <= 2 ? 'Wait Time & Access' : 'Staff Communication')) as PrimaryTheme;

        // Auto tag issues
        const issues: any[] = [];
        if (waitTimeMinutes > 60 || satisfactionScore <= 2) issues.push('WaitTimeComplaint');
        if (satisfactionScore <= 2) issues.push('HighComplaintRate');
        if (String(text).toLowerCase().includes('jargon') || String(text).toLowerCase().includes('confus')) issues.push('CommunicationBottleneck');
        if (String(text).toLowerCase().includes('portal') || String(text).toLowerCase().includes('login') || String(text).toLowerCase().includes('app')) issues.push('TechIssue');
        if (String(text).toLowerCase().includes('spanish') || String(text).toLowerCase().includes('language') || String(text).toLowerCase().includes('translate')) issues.push('LanguageBarrier');
        if (String(text).toLowerCase().includes('copay') || String(text).toLowerCase().includes('bill')) issues.push('EquityBarrier');
        if (String(text).toLowerCase().includes('chatbot') || String(text).toLowerCase().includes('wrong dose')) issues.push('HallucinationTrap');

        return {
          id: `UPLOAD-${idx + 1001}`,
          date: r.date || r.Date || new Date().toISOString().split('T')[0],
          patientId: `PT-${2000 + idx}`,
          serviceLine,
          visitType,
          patientPersona: persona,
          satisfactionScore,
          communicationRating,
          followUpCompliant,
          waitTimeMinutes,
          commentText: String(text),
          sentiment,
          primaryTheme,
          keywords: String(text).toLowerCase().match(/\b[a-z]{4,}\b/g)?.slice(0, 5) || ['patient', 'care'],
          issueCategories: issues,
        };
      });

      onDataLoaded(mappedComments);
      onClose();
    } else {
      // It's a communication text or list of communications
      const firstRow = parsedRows[0];
      const text = firstRow.text || firstRow.Text || firstRow.communicationText || firstRow.content || firstRow.Content || JSON.stringify(firstRow, null, 2);
      const title = firstRow.title || firstRow.Title || fileName || 'Uploaded Clinical Document';
      if (onCommunicationLoaded) {
        onCommunicationLoaded(text, title);
      }
      onClose();
    }
  };

  const downloadSampleTemplate = () => {
    const sampleData = [
      {
        date: '2026-10-15',
        serviceLine: 'Emergency Medicine',
        visitType: 'Emergency',
        patientPersona: 'Elderly Chronic Care',
        satisfactionScore: 2,
        communicationRating: 2,
        followUpCompliant: 'false',
        waitTimeMinutes: 180,
        commentText: 'Long wait time in triage. Confusing discharge paperwork about blood thinner dosages.',
      },
      {
        date: '2026-10-16',
        serviceLine: 'Pediatrics',
        visitType: 'Outpatient Clinic',
        patientPersona: 'Busy Working Parent',
        satisfactionScore: 5,
        communicationRating: 5,
        followUpCompliant: 'true',
        waitTimeMinutes: 15,
        commentText: 'Fast check-in via SMS. The doctor explained ear infection recovery clearly.',
      },
      {
        date: '2026-10-17',
        serviceLine: 'Cardiology',
        visitType: 'Inpatient',
        patientPersona: 'Non-English Primary (LEP)',
        satisfactionScore: 2,
        communicationRating: 2,
        followUpCompliant: 'false',
        waitTimeMinutes: 30,
        commentText: 'No spanish interpreter was provided for the medication consultation.',
      },
    ];

    const ws = XLSX.utils.json_to_sheet(sampleData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'PatientFeedback');
    XLSX.writeFile(wb, 'healthcare_patient_feedback_template.xlsx');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl text-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Upload className="w-5 h-5 text-teal-400" />
            <h3 className="text-base font-bold text-white">
              Upload Dataset or Clinical Communication
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upload Mode Selector */}
        <div className="grid grid-cols-2 gap-2 my-4 p-1 bg-slate-800/60 rounded-xl border border-slate-700/60">
          <button
            onClick={() => setUploadType('feedback')}
            className={`py-2 px-3 text-xs font-semibold rounded-lg transition ${
              uploadType === 'feedback'
                ? 'bg-teal-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            📊 Patient Feedback Dataset (CSV / Excel)
          </button>
          <button
            onClick={() => setUploadType('communication')}
            className={`py-2 px-3 text-xs font-semibold rounded-lg transition ${
              uploadType === 'communication'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🩺 Clinical Document to Evaluate
          </button>
        </div>

        {/* Drag & Drop Zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition ${
            dragOver
              ? 'border-teal-400 bg-teal-500/10'
              : 'border-slate-700 hover:border-slate-500 bg-slate-800/40'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            accept=".csv, .xlsx, .xls, .tsv, .txt"
            className="hidden"
          />
          <div className="w-12 h-12 rounded-full bg-teal-500/20 text-teal-300 mx-auto flex items-center justify-center mb-3">
            <FileText className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium text-slate-200 mb-1">
            Drag & drop your CSV or Excel file here, or{' '}
            <span className="text-teal-400 underline font-semibold">browse</span>
          </p>
          <p className="text-xs text-slate-500">
            Supports .xlsx, .xls, .csv, and .txt files
          </p>
        </div>

        {/* Status / Preview */}
        {errorMsg && (
          <div className="mt-4 p-3 bg-rose-950/60 border border-rose-800/60 rounded-xl text-rose-300 text-xs flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mt-4 p-3 bg-emerald-950/60 border border-emerald-800/60 rounded-xl text-emerald-300 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            onClick={downloadSampleTemplate}
            className="text-xs text-slate-400 hover:text-teal-300 flex items-center space-x-1.5 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Sample Template (.xlsx)</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              disabled={parsedRows.length === 0}
              onClick={applyData}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition cursor-pointer shadow-lg ${
                parsedRows.length > 0
                  ? 'bg-teal-600 hover:bg-teal-500 text-white shadow-teal-900/40'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              Apply to Dashboard ({parsedRows.length} rows)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
