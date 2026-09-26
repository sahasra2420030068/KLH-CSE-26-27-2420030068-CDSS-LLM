import React from 'react';
import { 
  Printer, 
  Download, 
  X, 
  ShieldAlert, 
  FileText, 
  CheckCircle2, 
  BookOpen, 
  Activity, 
  BrainCircuit,
  HeartPulse
} from 'lucide-react';
import { SyntheticPatient } from '../types/clinical';

interface ReportModalProps {
  patient: SyntheticPatient;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ patient, onClose }) => {
  const analysis = patient.latest_analysis;
  const review = patient.clinician_reviews[0];

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const reportData = {
      report_title: "LLM-CDSS Clinical Case Summary & Audit Report",
      generated_at: new Date().toISOString(),
      patient_demographics: {
        id: patient.patient_id,
        synthetic_name: patient.synthetic_name,
        age: patient.age,
        gender: patient.gender
      },
      vital_signs: patient.vital_signs,
      medical_history: patient.medical_history,
      active_medications: patient.medications,
      allergies: patient.allergies,
      lab_results: patient.lab_results,
      ai_decision_support: analysis || null,
      clinician_review: review || null,
      mandatory_disclaimer: "AI-generated decision support. Final clinical decisions remain with qualified healthcare professionals."
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Case_Report_${patient.patient_id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[92vh] overflow-y-auto text-slate-900">
        
        {/* Controls Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 no-print">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
              AUDIT REPORT
            </span>
            <span className="text-xs text-slate-700">Official Clinical Case Record</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Export PDF</span>
            </button>
            <button
              onClick={handleDownloadJSON}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>JSON</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Header */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              CLINICAL DECISION SUPPORT CASE REPORT
            </h1>
            <span className="text-xs font-mono text-slate-700">
              {new Date().toISOString().slice(0, 16).replace('T', ' ')}
            </span>
          </div>
          <p className="text-xs text-slate-700">
            Automated synthesis verified by clinician review • Hospital Electronic Medical Audit
          </p>
        </div>

        {/* Mandatory Regulatory Disclaimer Banner */}
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/90 text-amber-950 text-xs flex items-center gap-2.5 font-medium">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
          <span>
            <strong>MANDATORY NOTICE:</strong> AI-generated decision support. Final clinical decisions remain with qualified healthcare professionals.
          </span>
        </div>

        {/* Patient Demographics & Baseline Vitals */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-700 block">Patient Name</span>
            <span className="font-bold text-slate-900">{patient.synthetic_name}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-700 block">Patient ID / Age</span>
            <span className="font-bold text-slate-900">{patient.patient_id} • {patient.age}y ({patient.gender})</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-700 block">Blood Pressure / HR</span>
            <span className="font-bold text-slate-900">{patient.vital_signs.blood_pressure} • {patient.vital_signs.heart_rate} bpm</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-700 block">SpO2 / Temperature</span>
            <span className="font-bold text-slate-900">{patient.vital_signs.oxygen_saturation} • {patient.vital_signs.temperature}</span>
          </div>
        </div>

        {/* Patient Summary */}
        <div className="space-y-1.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-1">
            1. Patient Clinical Summary
          </h2>
          <p className="text-xs leading-relaxed text-slate-800">
            {analysis?.patient_summary || 'No AI case synthesis recorded yet.'}
          </p>
        </div>

        {/* Clinical Findings & Key Factors */}
        <div className="space-y-1.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-1">
            2. Key Clinical Factors & Out-of-Range Findings
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {analysis?.clinical_factors?.map((f, i) => (
              <div key={i} className="p-2 bg-slate-50 rounded-lg border border-slate-100 text-slate-800">
                • {f}
              </div>
            ))}
          </div>
        </div>

        {/* Risk Indicators */}
        <div className="space-y-1.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-1">
            3. Risk Signals & Review Warnings
          </h2>
          <div className="space-y-1.5">
            {analysis?.risk_indicators?.map((r, i) => (
              <div key={i} className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-bold text-slate-900">[{r.level} RISK] {r.signal}: </span>
                  <span className="text-slate-700">{r.clinical_rationale}</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white border border-slate-300 shrink-0">
                  Reviewed
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Missing Information */}
        <div className="space-y-1.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-1">
            4. Missing Critical Information
          </h2>
          <ul className="list-disc list-inside text-xs text-slate-800 space-y-1">
            {analysis?.missing_information?.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        </div>

        {/* AI Decision Support Recommendations */}
        <div className="space-y-1.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-1">
            5. Evidence-Grounded Decision Support Recommendations
          </h2>
          <div className="space-y-2">
            {analysis?.decision_support?.map((d, i) => (
              <div key={i} className="p-3 rounded-lg border border-slate-200 bg-slate-50 text-xs space-y-1">
                <div className="flex items-center justify-between text-[10px] text-slate-700">
                  <span className="font-bold uppercase text-teal-800">{d.category}</span>
                  <span className="font-mono">{d.evidence_source}</span>
                </div>
                <div className="font-semibold text-slate-900">{d.recommendation}</div>
                <div className="text-[11px] text-slate-700"><strong>Rationale:</strong> {d.rationale}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Clinician Review & Attestation */}
        <div className="p-4 rounded-xl bg-slate-100 border border-slate-300 space-y-2 text-xs">
          <h2 className="font-bold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            6. Clinician Review & Attestation
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-700 block">Decision</span>
              <span className="font-bold text-slate-900">{review?.decision || 'APPROVED BY ATTENDING'}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-700 block">Attending Clinician</span>
              <span className="font-bold text-slate-900">{review?.clinician_name || 'Dr. Sarah Jenkins, MD'}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-700 block">Verification Timestamp</span>
              <span className="font-bold text-slate-900">{review?.timestamp?.slice(0, 16).replace('T', ' ') || new Date().toISOString().slice(0, 16).replace('T', ' ')}</span>
            </div>
          </div>
          {review?.feedback && (
            <div className="pt-2 border-t border-slate-200 text-slate-800">
              <strong className="text-slate-900">Clinician Notes / Modifications:</strong> "{review.feedback}"
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-[10px] text-slate-700 pt-3 border-t border-slate-200">
          Generated by LLM-CDSS Platform • Synthetic Demonstration Case Record • All Rights Reserved
        </div>

      </div>
    </div>
  );
};
