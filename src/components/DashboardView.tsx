import React from 'react';
import { 
  Users, 
  AlertTriangle, 
  Clock, 
  FileCheck2, 
  BrainCircuit, 
  ArrowUpRight, 
  CheckCircle2, 
  Activity, 
  Stethoscope, 
  ShieldAlert,
  ChevronRight,
  FlaskConical,
  BookOpenCheck
} from 'lucide-react';
import { SyntheticPatient } from '../types/clinical';
import { NavTab } from './Sidebar';

interface DashboardViewProps {
  patients: SyntheticPatient[];
  selectedPatient: SyntheticPatient | null;
  onSelectPatient: (patient: SyntheticPatient) => void;
  onNavigate: (tab: NavTab) => void;
  onAnalyzeCase: (patient: SyntheticPatient) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  patients,
  selectedPatient,
  onSelectPatient,
  onNavigate,
  onAnalyzeCase,
}) => {
  // Compute Dashboard Metrics
  const totalPatients = patients.length;
  
  const casesRequiringReview = patients.filter(p => 
    p.vital_signs.status === 'CRITICAL' || 
    p.vital_signs.status === 'MISSING' ||
    (p.latest_analysis && p.clinician_reviews.length === 0)
  );

  const highRiskPatients = patients.filter(p => 
    p.latest_analysis?.risk_indicators?.some(r => r.level === 'HIGH') ||
    p.vital_signs.status === 'CRITICAL' ||
    p.lab_results.some(l => l.status === 'CRITICAL')
  );

  const analyzedPatients = patients.filter(p => !!p.latest_analysis);
  const pendingAiApprovals = patients.filter(p => p.latest_analysis && p.clinician_reviews.length === 0);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Welcome & Clinical Alert Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-sm border border-slate-700/60">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-semibold">
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Outpatient & Inpatient Clinical Decision Support</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Clinical Triage & Intelligence Dashboard
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl">
            Real-time synthetic case synthesis, guideline-grounded retrieval, risk alerts, and clinician-in-the-loop review pipeline.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {selectedPatient && (
            <button
              onClick={() => onAnalyzeCase(selectedPatient)}
              className="flex items-center gap-2 px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold text-sm rounded-xl shadow-sm transition-all cursor-pointer hover:shadow-teal-500/20"
            >
              <BrainCircuit className="w-4 h-4" />
              <span>Analyze [{selectedPatient.patient_id}]</span>
            </button>
          )}
          <button
            onClick={() => onNavigate('evidence')}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm rounded-xl border border-slate-600 transition-all cursor-pointer"
          >
            <BookOpenCheck className="w-4 h-4 text-teal-400" />
            <span>Guidelines RAG</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Patients */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-700">Total Registry</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{totalPatients}</div>
          <p className="text-xs text-slate-700 mt-1">100% Synthetic de-identified cohort</p>
        </div>

        {/* Cases Requiring Review */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-700">Review Required</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-amber-900">{casesRequiringReview.length}</div>
          <p className="text-xs text-slate-700 mt-1">Abnormal vitals or unverified AI advice</p>
        </div>

        {/* Risk Alerts */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-700">High Risk Signals</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-800 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-rose-900">{highRiskPatients.length}</div>
          <p className="text-xs text-slate-700 mt-1">Requires immediate clinician attention</p>
        </div>

        {/* Pending AI Recommendations */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-700">AI Approvals Pending</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-800 flex items-center justify-center">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-teal-900">{pendingAiApprovals.length}</div>
          <p className="text-xs text-slate-700 mt-1">Awaiting clinician Approve / Modify / Reject</p>
        </div>

      </div>

      {/* Main Grid: Priority Cases & Recent Triage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Priority Patient Triage */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">High-Priority Cases & Warning Signals</h2>
              <p className="text-xs text-slate-700">Stratified by clinical risk level and hemodynamic indicators</p>
            </div>
            <button
              onClick={() => onNavigate('patients')}
              className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
            >
              <span>View All ({patients.length})</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {highRiskPatients.slice(0, 5).map((patient) => {
              const isSelected = selectedPatient?.patient_id === patient.patient_id;
              const hasCritVital = patient.vital_signs.status === 'CRITICAL' || patient.vital_signs.status === 'MISSING';
              return (
                <div
                  key={patient.patient_id}
                  onClick={() => onSelectPatient(patient)}
                  className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors cursor-pointer ${
                    isSelected ? 'bg-teal-50/40 border-l-4 border-l-teal-600' : ''
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        {patient.patient_id}
                      </span>
                      <span className="font-bold text-sm text-slate-900">{patient.synthetic_name}</span>
                      <span className="text-xs text-slate-700">({patient.age}y {patient.gender})</span>
                      {hasCritVital && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-900 border border-rose-200">
                          {patient.vital_signs.status === 'MISSING' ? 'MISSING VITALS' : 'CRITICAL VITALS'}
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-slate-800 line-clamp-1">
                      <strong className="font-semibold text-slate-900">Symptoms:</strong> {patient.clinical_notes[0]?.symptoms?.join(', ') || 'None documented'}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-700 pt-1">
                      <span>BP: <strong className="text-slate-800">{patient.vital_signs.blood_pressure}</strong></span>
                      <span>HR: <strong className="text-slate-800">{patient.vital_signs.heart_rate} bpm</strong></span>
                      <span>SpO2: <strong className="text-slate-800">{patient.vital_signs.oxygen_saturation}</strong></span>
                      <span>Meds: <strong className="text-slate-800">{patient.medications.length}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectPatient(patient);
                        onAnalyzeCase(patient);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                    >
                      <BrainCircuit className="w-3.5 h-3.5" />
                      <span>Analyze</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectPatient(patient);
                        onNavigate('analysis');
                      }}
                      className="p-1.5 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                      title="Open Patient Profile"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Active Patient Snapshot & CDSS Quick Status */}
        <div className="space-y-6">
          
          {/* Active Case Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-teal-600" />
                Active Case Snapshot
              </span>
              <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                {selectedPatient?.patient_id}
              </span>
            </div>

            {selectedPatient ? (
              <div className="space-y-3 text-xs">
                <div>
                  <div className="font-bold text-sm text-slate-900">{selectedPatient.synthetic_name}</div>
                  <div className="text-slate-700">{selectedPatient.age} years old • {selectedPatient.gender}</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 border border-slate-100">
                  <div className="font-semibold text-slate-800 text-[11px] uppercase tracking-wide">Primary Conditions</div>
                  <ul className="list-disc list-inside text-slate-800 space-y-0.5">
                    {selectedPatient.medical_history.slice(0, 3).map((m, idx) => (
                      <li key={idx} className="truncate">{m.condition}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 border border-slate-100">
                  <div className="font-semibold text-slate-800 text-[11px] uppercase tracking-wide">Recent Clinical Note</div>
                  <p className="text-slate-800 line-clamp-3 leading-relaxed">
                    {selectedPatient.clinical_notes[0]?.clinical_note}
                  </p>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <button
                    onClick={() => onAnalyzeCase(selectedPatient)}
                    className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                  >
                    <BrainCircuit className="w-4 h-4" />
                    <span>Run AI Case Analysis</span>
                  </button>
                  <button
                    onClick={() => onNavigate('assistant')}
                    className="w-full py-2 px-4 bg-white hover:bg-slate-50 text-slate-700 font-medium rounded-xl text-xs border border-slate-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                    <span>Ask Clinical Assistant</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-700 text-xs">
                No patient selected. Choose a patient from the registry above.
              </div>
            )}
          </div>

          {/* Clinical Safety Card */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-900">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Non-Autonomous System Reminder</span>
            </div>
            <p className="text-amber-800 text-[11px] leading-relaxed">
              This system is designed strictly for clinical decision support. The AI does not diagnose, prescribe, or substitute for professional medical judgment. Every suggestion must undergo clinician review before being enacted.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
