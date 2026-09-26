import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  UserPlus, 
  BrainCircuit, 
  ChevronRight, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  FileText,
  HeartPulse,
  Pill,
  ShieldAlert,
  X
} from 'lucide-react';
import { SyntheticPatient } from '../types/clinical';
import { NavTab } from './Sidebar';

interface PatientsViewProps {
  patients: SyntheticPatient[];
  selectedPatient: SyntheticPatient | null;
  onSelectPatient: (patient: SyntheticPatient) => void;
  onNavigate: (tab: NavTab) => void;
  onAnalyzeCase: (patient: SyntheticPatient) => void;
  onAddPatient: (newPatientData: any) => void;
}

export const PatientsView: React.FC<PatientsViewProps> = ({
  patients,
  selectedPatient,
  onSelectPatient,
  onNavigate,
  onAnalyzeCase,
  onAddPatient,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<'ALL' | 'CRITICAL' | 'ABNORMAL' | 'NORMAL' | 'MISSING'>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New patient form state
  const [name, setName] = useState('');
  const [age, setAge] = useState('48');
  const [gender, setGender] = useState('Female');
  const [conditions, setConditions] = useState('Essential Hypertension, Dyslipidemia');
  const [medications, setMedications] = useState('Amlodipine 5mg daily, Atorvastatin 20mg daily');
  const [allergies, setAllergies] = useState('Penicillin (Hives)');
  const [clinicalNote, setClinicalNote] = useState('Patient presents for routine follow up. Complains of intermittent tension headaches.');
  const [symptoms, setSymptoms] = useState('Headache, Fatigue');

  const filteredPatients = patients.filter(p => {
    const matchesSearch = 
      p.synthetic_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.patient_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.medical_history.some(m => m.condition.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.clinical_notes[0]?.symptoms?.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterCategory === 'ALL') return true;
    if (filterCategory === 'CRITICAL') return p.vital_signs.status === 'CRITICAL' || p.lab_results.some(l => l.status === 'CRITICAL');
    if (filterCategory === 'ABNORMAL') return p.vital_signs.status === 'ABNORMAL';
    if (filterCategory === 'NORMAL') return p.vital_signs.status === 'NORMAL';
    if (filterCategory === 'MISSING') return p.vital_signs.status === 'MISSING';

    return true;
  });

  const handleCreatePatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddPatient({
      synthetic_name: name,
      age: parseInt(age, 10) || 45,
      gender,
      medical_history: conditions.split(',').map(c => ({ condition: c.trim(), diagnosis_date: '2026-09-01', status: 'Active' })),
      medications: medications.split(',').map(m => ({ medication: m.trim(), dosage: 'Standard', frequency: 'Daily' })),
      allergies: allergies.split(',').map(a => ({ allergen: a.trim(), reaction: 'Documented' })),
      clinical_note: clinicalNote,
      symptoms: symptoms.split(',').map(s => s.trim()),
    });

    setIsAddModalOpen(false);
    setName('');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Patient Cohort Registry</h1>
          <p className="text-xs text-slate-700">De-identified synthetic cohorts for clinical validation and decision support</p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all cursor-pointer self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Synthetic Patient</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-700 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by ID, name, condition, or symptom..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <span className="text-xs text-slate-700 font-medium mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Triage:
          </span>
          {(['ALL', 'CRITICAL', 'ABNORMAL', 'NORMAL', 'MISSING'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                filterCategory === cat
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat === 'ALL' ? 'All Patients' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Patient List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPatients.map((patient) => {
          const isSelected = selectedPatient?.patient_id === patient.patient_id;
          const isCritical = patient.vital_signs.status === 'CRITICAL' || patient.lab_results.some(l => l.status === 'CRITICAL');
          const isMissing = patient.vital_signs.status === 'MISSING';

          return (
            <div
              key={patient.patient_id}
              onClick={() => onSelectPatient(patient)}
              className={`bg-white rounded-2xl border p-5 shadow-xs transition-all cursor-pointer flex flex-col justify-between gap-4 hover:border-teal-400 hover:shadow-md ${
                isSelected ? 'ring-2 ring-teal-500 border-teal-500 bg-teal-50/20' : 'border-slate-200'
              }`}
            >
              {/* Card Header */}
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      {patient.patient_id}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900 mt-1">
                      {patient.synthetic_name}
                    </h3>
                    <p className="text-xs text-slate-700">
                      {patient.age} years • {patient.gender}
                    </p>
                  </div>

                  {isCritical ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-900 border border-rose-200 shrink-0">
                      CRITICAL
                    </span>
                  ) : isMissing ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200 shrink-0">
                      DATA MISSING
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
                      STABLE
                    </span>
                  )}
                </div>

                {/* Vitals Summary Pill */}
                <div className="p-2.5 bg-slate-50 rounded-xl text-xs flex items-center justify-between border border-slate-100">
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <HeartPulse className="w-3.5 h-3.5 text-rose-500" />
                    <span>BP: <strong className="text-slate-900">{patient.vital_signs.blood_pressure}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <Activity className="w-3.5 h-3.5 text-teal-600" />
                    <span>HR: <strong className="text-slate-900">{patient.vital_signs.heart_rate}</strong></span>
                  </div>
                  <div className="text-[11px] text-slate-700 font-mono">
                    {patient.vital_signs.oxygen_saturation}
                  </div>
                </div>

                {/* Medical History Tags */}
                <div>
                  <div className="text-[11px] font-semibold text-slate-700 mb-1">Primary Chronic Conditions:</div>
                  <div className="flex flex-wrap gap-1">
                    {patient.medical_history.slice(0, 2).map((m, idx) => (
                      <span key={idx} className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200/80 truncate max-w-[200px]">
                        {m.condition}
                      </span>
                    ))}
                    {patient.medical_history.length > 2 && (
                      <span className="text-[10px] px-1.5 py-0.5 text-slate-700">
                        +{patient.medical_history.length - 2} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Presenting Symptoms */}
                <div>
                  <div className="text-[11px] font-semibold text-slate-700 mb-1">Active Symptoms:</div>
                  <p className="text-xs text-slate-800 line-clamp-2">
                    {patient.clinical_notes[0]?.symptoms?.join(', ') || 'None recorded'}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectPatient(patient);
                    onNavigate('analysis');
                  }}
                  className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Profile & Labs</span>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectPatient(patient);
                    onAnalyzeCase(patient);
                  }}
                  className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <BrainCircuit className="w-3.5 h-3.5" />
                  <span>Analyze Case</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Add Synthetic Patient Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <UserPlus className="w-5 h-5 text-teal-600" />
                <span>Add Synthetic Patient Profile</span>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-700 hover:text-slate-900 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePatient} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Synthetic Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Miller"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Age & Biological Sex</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      required
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="w-20 p-2 border border-slate-300 rounded-lg text-xs"
                    />
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Medical History / Chronic Conditions</label>
                <input
                  type="text"
                  placeholder="Comma-separated conditions..."
                  value={conditions}
                  onChange={(e) => setConditions(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Active Medications & Dosages</label>
                <input
                  type="text"
                  placeholder="Comma-separated medications..."
                  value={medications}
                  onChange={(e) => setMedications(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Drug Hypersensitivities / Allergies</label>
                <input
                  type="text"
                  placeholder="e.g. Sulfa (Rash), Penicillin (Anaphylaxis), or NKDA"
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Active Presenting Symptoms</label>
                <input
                  type="text"
                  placeholder="Comma-separated symptoms..."
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Initial Clinical Encounter Note</label>
                <textarea
                  rows={3}
                  value={clinicalNote}
                  onChange={(e) => setClinicalNote(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="p-3 bg-teal-50/60 rounded-xl text-[11px] text-teal-900 border border-teal-200">
                <span className="font-semibold">Notice:</span> Synthetic profiles are auto-assigned a unique ID (e.g. P111) and immediately integrated into the clinical database.
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
                >
                  Save Patient Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
