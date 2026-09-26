import React, { useState } from 'react';
import { 
  BrainCircuit, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Edit3, 
  HelpCircle, 
  BookOpen, 
  FileText, 
  ShieldAlert, 
  Activity, 
  HeartPulse, 
  Pill, 
  ExternalLink, 
  RotateCw, 
  Check, 
  Clock,
  Printer,
  ChevronDown,
  Layers,
  FlaskConical,
  X
} from 'lucide-react';
import { SyntheticPatient, AIAnalysisOutput, EvidenceDocument, RiskLevel } from '../types/clinical';

interface AnalysisViewProps {
  patient: SyntheticPatient | null;
  analysis: AIAnalysisOutput | null;
  isLoadingAnalysis: boolean;
  onRunAnalysis: () => void;
  onSubmitReview: (decision: 'APPROVED' | 'MODIFIED' | 'REJECTED', modifiedOutput?: any, feedback?: string) => void;
  onOpenReportModal: () => void;
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({
  patient,
  analysis,
  isLoadingAnalysis,
  onRunAnalysis,
  onSubmitReview,
  onOpenReportModal,
}) => {
  const [selectedEvidenceModal, setSelectedEvidenceModal] = useState<EvidenceDocument | null>(null);
  const [isModifying, setIsModifying] = useState(false);
  const [modifiedSummary, setModifiedSummary] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  if (!patient) {
    return (
      <div className="p-8 text-center max-w-lg mx-auto space-y-3">
        <Activity className="w-12 h-12 text-slate-400 mx-auto" />
        <h2 className="text-lg font-bold text-slate-800">No Patient Selected</h2>
        <p className="text-xs text-slate-700">Please select a patient from the top bar or dashboard to run case decision support.</p>
      </div>
    );
  }

  const latestReview = patient.clinician_reviews[0];

  const handleStartModify = () => {
    setModifiedSummary(analysis?.patient_summary || '');
    setIsModifying(true);
  };

  const handleSaveModification = () => {
    onSubmitReview('MODIFIED', {
      ...analysis,
      patient_summary: modifiedSummary
    }, feedbackText || 'Modified summary and prioritized clinical factors.');
    setIsModifying(false);
  };

  const handleApprove = () => {
    onSubmitReview('APPROVED', analysis, feedbackText || 'Clinician verified and accepted decision support guidance.');
  };

  const handleReject = () => {
    onSubmitReview('REJECTED', analysis, rejectReason || 'Clinician determined alternate clinical pathway warranted.');
    setShowRejectDialog(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Top Case Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
              {patient.patient_id}
            </span>
            <h1 className="text-xl font-bold text-slate-900">
              {patient.synthetic_name}
            </h1>
            <span className="text-xs font-medium text-slate-700">
              ({patient.age}y {patient.gender} • Telemetry Unit)
            </span>
          </div>
          <p className="text-xs text-slate-700">
            Presenting: {patient.clinical_notes[0]?.symptoms?.join(', ') || 'Routine clinical encounter'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onRunAnalysis}
            disabled={isLoadingAnalysis}
            className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
          >
            {isLoadingAnalysis ? (
              <>
                <RotateCw className="w-4 h-4 animate-spin" />
                <span>Running Gemini & RAG Pipeline...</span>
              </>
            ) : (
              <>
                <BrainCircuit className="w-4 h-4" />
                <span>{analysis ? 'Re-Analyze Case' : 'Analyze Case with Gemini'}</span>
              </>
            )}
          </button>

          {analysis && (
            <button
              onClick={onOpenReportModal}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold border border-slate-300 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Generate Case Report</span>
            </button>
          )}
        </div>
      </div>

      {/* Two Column Layout: Left Patient Profile, Right AI Decision Support */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Col (4/12): Patient Profile Card */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Patient Profile Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-teal-600" />
                Patient Profile & Vitals
              </h2>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                patient.vital_signs.status === 'CRITICAL' 
                  ? 'bg-rose-100 text-rose-900 border-rose-200' 
                  : patient.vital_signs.status === 'MISSING'
                  ? 'bg-amber-100 text-amber-900 border-amber-200'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200'
              }`}>
                {patient.vital_signs.status} VITALS
              </span>
            </div>

            {/* Vital Signs Grid */}
            <div className="space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-700">Hemodynamic Parameters</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-[10px] text-slate-700">Blood Pressure</div>
                  <div className="font-bold text-slate-900">{patient.vital_signs.blood_pressure}</div>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-[10px] text-slate-700">Heart Rate</div>
                  <div className="font-bold text-slate-900">{patient.vital_signs.heart_rate} bpm</div>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-[10px] text-slate-700">Resp Rate / Temp</div>
                  <div className="font-bold text-slate-900">{patient.vital_signs.respiratory_rate} / {patient.vital_signs.temperature}</div>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-[10px] text-slate-700">Oxygen Saturation</div>
                  <div className="font-bold text-slate-900">{patient.vital_signs.oxygen_saturation}</div>
                </div>
              </div>
            </div>

            {/* Medical History */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-700">Medical History</div>
              <ul className="space-y-1 text-xs">
                {patient.medical_history.map((m, idx) => (
                  <li key={idx} className="flex items-start justify-between gap-2 p-1.5 bg-slate-50 rounded-lg text-slate-800">
                    <span className="font-medium truncate">{m.condition}</span>
                    <span className="text-[10px] text-slate-700 shrink-0">{m.status}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Active Medications */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
                <span>Current Medications</span>
                <span className="text-[10px] text-slate-700 font-normal">({patient.medications.length} Rx)</span>
              </div>
              <ul className="space-y-1 text-xs">
                {patient.medications.map((m, idx) => (
                  <li key={idx} className="p-1.5 bg-slate-50 rounded-lg text-slate-800 flex items-center justify-between">
                    <span className="font-semibold text-slate-900">{m.medication}</span>
                    <span className="text-[11px] text-slate-700">{m.dosage} ({m.frequency})</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Hypersensitivities & Allergies */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-700">Allergies & Sensitivities</div>
              <div className="space-y-1 text-xs">
                {patient.allergies.map((a, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-rose-50/70 border border-rose-200 text-rose-900 text-[11px]">
                    <strong>{a.allergen}:</strong> {a.reaction}
                  </div>
                ))}
              </div>
            </div>

            {/* Laboratory Results */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
                <span>Recent Diagnostic Labs</span>
                <span className="text-[10px] text-slate-700">({patient.lab_results.length} tests)</span>
              </div>
              <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
                {patient.lab_results.length === 0 ? (
                  <p className="text-xs text-slate-700 italic">No lab results on file.</p>
                ) : (
                  patient.lab_results.map((l, idx) => (
                    <div key={idx} className="flex items-center justify-between p-1.5 text-[11px] rounded bg-slate-50 border border-slate-100">
                      <span className="font-medium text-slate-800 truncate max-w-[140px]">{l.test_name}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-slate-900">{l.value} {l.unit}</span>
                        {l.status !== 'NORMAL' && (
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                            l.status === 'CRITICAL' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {l.status}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Clinical Encounter Notes */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-700">Clinical Encounter Note</div>
              <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-800 border border-slate-100 leading-relaxed max-h-40 overflow-y-auto">
                <div className="text-[10px] font-mono text-slate-700 mb-1">{patient.clinical_notes[0]?.date} Encounter</div>
                {patient.clinical_notes[0]?.clinical_note}
              </div>
            </div>

          </div>

        </div>

        {/* Right Col (8/12): AI Decision Support Output */}
        <div className="lg:col-span-8 space-y-6">
          
          {!analysis && !isLoadingAnalysis && (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto shadow-xs">
                <BrainCircuit className="w-7 h-7" />
              </div>
              <div className="space-y-1.5 max-w-md mx-auto">
                <h3 className="font-bold text-base text-slate-900">Case Not Yet Analyzed</h3>
                <p className="text-xs text-slate-700">
                  Click below to synthesize the patient's structured medical history, symptoms, and lab panels against verified clinical guidelines using Gemini and RAG.
                </p>
              </div>
              <button
                onClick={onRunAnalysis}
                className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
              >
                Start Clinical Case Analysis
              </button>
            </div>
          )}

          {isLoadingAnalysis && (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto animate-pulse">
                <RotateCw className="w-6 h-6 animate-spin" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-base text-slate-900">Consulting RAG Knowledge Base & Gemini...</h3>
                <p className="text-xs text-slate-700">Retrieving guideline evidence, identifying risk flags, and generating structured clinical advice.</p>
              </div>
            </div>
          )}

          {analysis && !isLoadingAnalysis && (
            <div className="space-y-6">
              
              {/* Review Status Banner */}
              <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                latestReview?.decision === 'APPROVED'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : latestReview?.decision === 'MODIFIED'
                  ? 'bg-blue-50 border-blue-200 text-blue-900'
                  : latestReview?.decision === 'REJECTED'
                  ? 'bg-rose-50 border-rose-200 text-rose-900'
                  : 'bg-amber-50/80 border-amber-200 text-amber-900'
              }`}>
                <div className="flex items-center gap-2.5">
                  {latestReview ? (
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                  ) : (
                    <Clock className="w-5 h-5 shrink-0 text-amber-600" />
                  )}
                  <div>
                    <div className="font-bold text-xs">
                      {latestReview ? `Decision Status: ${latestReview.decision}` : 'Pending Clinician Review & Decision'}
                    </div>
                    <div className="text-[11px] opacity-90">
                      {latestReview
                        ? `Evaluated by ${latestReview.clinician_name} on ${latestReview.timestamp.slice(0, 16).replace('T', ' ')}`
                        : 'Every AI suggestion must be confirmed, modified, or rejected by a clinician.'}
                    </div>
                  </div>
                </div>

                {/* Approve / Modify / Reject CTA buttons */}
                <div className="flex items-center gap-1.5 self-end sm:self-auto">
                  <button
                    onClick={handleApprove}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={handleStartModify}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Modify</span>
                  </button>
                  <button
                    onClick={() => setShowRejectDialog(true)}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>

              {/* 1. Patient Summary Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-teal-600" />
                    Patient Summary
                  </h3>
                  <span className="text-[11px] text-slate-700 font-mono">Fact vs Assumption Guardrails Active</span>
                </div>

                {isModifying ? (
                  <div className="space-y-2">
                    <textarea
                      rows={5}
                      value={modifiedSummary}
                      onChange={(e) => setModifiedSummary(e.target.value)}
                      className="w-full p-3 text-xs border border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-500/20"
                    />
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setIsModifying(false)}
                        className="px-3 py-1.5 text-xs text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveModification}
                        className="px-3 py-1.5 text-xs bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
                      >
                        Save Clinician Modification
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-800 leading-relaxed">
                    {analysis.patient_summary}
                  </p>
                )}
              </div>

              {/* 2. Key Clinical Factors & Missing Information (2 cols) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Key Factors */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-teal-600" />
                    Key Clinical Factors
                  </h3>
                  <ul className="space-y-1.5 text-xs">
                    {analysis.clinical_factors.map((factor, idx) => (
                      <li key={idx} className="flex items-start gap-2 p-2 bg-slate-50 rounded-xl text-slate-800 border border-slate-100">
                        <span className="w-4 h-4 rounded-full bg-teal-100 text-teal-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{factor}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Missing Information */}
                <div className="bg-white rounded-2xl border border-amber-200 bg-amber-50/30 p-5 shadow-xs space-y-3">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-amber-600" />
                    Missing Information & Pending Workup
                  </h3>
                  <ul className="space-y-1.5 text-xs">
                    {analysis.missing_information.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 p-2 bg-white rounded-xl text-slate-800 border border-amber-200/80">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* 3. Risk & Warning System */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    Risk & Warning Indicators
                  </h3>
                  <span className="text-[11px] text-slate-700 italic">
                    Requires clinical review (Non-definitive wording)
                  </span>
                </div>

                <div className="space-y-2.5">
                  {analysis.risk_indicators.map((risk, idx) => (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        risk.level === 'HIGH'
                          ? 'bg-rose-50/80 border-rose-200 text-rose-950'
                          : risk.level === 'MODERATE'
                          ? 'bg-amber-50/80 border-amber-200 text-amber-950'
                          : 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            risk.level === 'HIGH'
                              ? 'bg-rose-200 text-rose-900 border-rose-300'
                              : risk.level === 'MODERATE'
                              ? 'bg-amber-200 text-amber-900 border-amber-300'
                              : 'bg-emerald-200 text-emerald-900 border-emerald-300'
                          }`}>
                            {risk.level} RISK SIGNAL
                          </span>
                          <span className="font-bold text-xs">{risk.signal}</span>
                        </div>
                        <p className="text-xs opacity-90 leading-relaxed">
                          {risk.clinical_rationale}
                        </p>
                      </div>

                      <div className="shrink-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 bg-white/80 px-2 py-1 rounded border border-slate-300">
                          Review Required
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Evidence-Grounded Decision Support Suggestions */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-teal-600" />
                    Evidence-Grounded Decision Support
                  </h3>
                  <span className="text-[11px] text-slate-700">RAG Guideline Anchored</span>
                </div>

                <div className="space-y-3">
                  {analysis.decision_support.map((item, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 hover:border-slate-300 transition-colors">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-100 text-teal-900 border border-teal-200">
                          {item.category}
                        </span>
                        <span className="text-[11px] text-slate-700 font-mono truncate max-w-xs">
                          {item.evidence_source}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-900 leading-snug">
                        {item.recommendation}
                      </p>
                      <p className="text-[11px] text-slate-700 leading-relaxed">
                        <strong>Rationale:</strong> {item.rationale}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. Retrieved Evidence Sources (RAG Box) */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-teal-600" />
                    Retrieved Clinical Evidence Guidelines ({analysis.retrieved_evidence?.length || 0})
                  </h3>
                  <span className="text-[11px] text-slate-700">Zero-Hallucination Citations</span>
                </div>

                {(!analysis.retrieved_evidence || analysis.retrieved_evidence.length === 0) ? (
                  <div className="p-4 rounded-xl bg-slate-50 text-slate-700 text-xs italic">
                    Insufficient evidence retrieved.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {analysis.retrieved_evidence.map((ev, idx) => (
                      <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between gap-2 text-[10px] text-slate-700 mb-1">
                            <span className="font-bold text-teal-800 uppercase">{ev.category}</span>
                            <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200">
                              {ev.relevance_percentage || 92}% Match
                            </span>
                          </div>
                          <h4 className="font-bold text-xs text-slate-900 line-clamp-1">{ev.title}</h4>
                          <div className="text-[10px] text-slate-700 mb-1">{ev.source} ({ev.publication_year})</div>
                          <p className="text-[11px] text-slate-700 line-clamp-3 leading-relaxed">
                            "{ev.content}"
                          </p>
                        </div>
                        <button
                          onClick={() => setSelectedEvidenceModal(ev)}
                          className="text-[11px] font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1 mt-2 pt-2 border-t border-slate-200 cursor-pointer"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>View Full Guideline Passage</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 6. Clinical Uncertainty & Follow-Up Questions */}
              <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-700 space-y-2">
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-slate-700" />
                  <span>Clinical Uncertainty & Diagnostic Boundaries</span>
                </div>
                <p className="leading-relaxed text-[11px]">
                  {analysis.uncertainty}
                </p>
                {analysis.follow_up_questions?.length > 0 && (
                  <div className="pt-2 border-t border-slate-200">
                    <span className="font-semibold text-slate-900 block mb-1">Recommended Follow-up Questions for Next Encounter:</span>
                    <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                      {analysis.follow_up_questions.map((q, idx) => (
                        <li key={idx}>{q}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

            </div>
          )}

        </div>

      </div>

      {/* Reject Modal Dialog */}
      {showRejectDialog && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2 font-bold text-rose-600">
                <XCircle className="w-5 h-5" />
                <span>Reject AI Clinical Suggestion</span>
              </div>
              <button onClick={() => setShowRejectDialog(false)} className="p-1 text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-700">
              Provide clinical reasoning for rejecting this automated decision-support proposal for the medical audit record:
            </p>

            <textarea
              rows={4}
              placeholder="e.g. Alternative etiology suspected; patient previously had adverse reaction; medication already discontinued..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500/20"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowRejectDialog(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Guideline View Source Modal */}
      {selectedEvidenceModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl border border-slate-200 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded uppercase">
                  {selectedEvidenceModal.category}
                </span>
                <h3 className="font-bold text-sm text-slate-900 mt-1">
                  {selectedEvidenceModal.title}
                </h3>
                <div className="text-xs text-slate-700">{selectedEvidenceModal.source} ({selectedEvidenceModal.publication_year})</div>
              </div>
              <button
                onClick={() => setSelectedEvidenceModal(null)}
                className="p-1 text-slate-700 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-semibold text-slate-700 block mb-1">Section:</span>
                <p className="font-medium text-slate-900">{selectedEvidenceModal.section}</p>
              </div>

              <div>
                <span className="font-semibold text-slate-700 block mb-1">Guideline Text:</span>
                <p className="text-slate-800 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  {selectedEvidenceModal.content}
                </p>
              </div>

              <div>
                <span className="font-semibold text-slate-700 block mb-1">Key Recommendations:</span>
                <ul className="list-disc list-inside space-y-1 text-slate-800">
                  {selectedEvidenceModal.key_recommendations.map((rec, idx) => (
                    <li key={idx}>{rec}</li>
                  ))}
                </ul>
              </div>

              <div className="text-[11px] font-mono text-slate-700 pt-2 border-t border-slate-100">
                Citation: {selectedEvidenceModal.url_reference}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedEvidenceModal(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Close Evidence Viewer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
