import React from 'react';
import { 
  Settings, 
  Database, 
  FileCode, 
  Cpu, 
  CheckCircle2, 
  Terminal, 
  ShieldCheck, 
  BookOpen, 
  Layers,
  Sparkles
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">System Architecture & Dataset Configuration</h1>
        <p className="text-xs text-slate-700">Detailed overview of data persistence, RAG grounding pipeline, and Gemini model parameters</p>
      </div>

      {/* Grid: 1. Dataset Specs */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-teal-600" />
            <h2 className="font-bold text-sm text-slate-900">Synthetic Clinical Dataset Structure (/dataset)</h2>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            10 Patients Loaded
          </span>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed">
          The application reads synthetic data directly from the dedicated <code className="font-mono text-teal-700">/dataset</code> directory upon server boot and maintains an in-memory transactional database with real-time audit logs.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-mono font-bold text-slate-900 block mb-1">patients.csv</span>
            <span className="text-slate-700 text-[11px]">patient_id, age, gender, synthetic_name</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-mono font-bold text-slate-900 block mb-1">clinical_notes.json</span>
            <span className="text-slate-700 text-[11px]">patient_id, date, clinical_note, symptoms</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-mono font-bold text-slate-900 block mb-1">lab_results.csv</span>
            <span className="text-slate-700 text-[11px]">patient_id, test_name, value, unit, reference_range</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-mono font-bold text-slate-900 block mb-1">medical_history.csv</span>
            <span className="text-slate-700 text-[11px]">patient_id, condition, diagnosis_date, status</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-mono font-bold text-slate-900 block mb-1">medications.csv</span>
            <span className="text-slate-700 text-[11px]">patient_id, medication, dosage, frequency</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-mono font-bold text-slate-900 block mb-1">allergies.csv</span>
            <span className="text-slate-700 text-[11px]">patient_id, allergen, reaction</span>
          </div>
        </div>

        {/* PostgreSQL Seed Script Instructions */}
        <div className="p-4 bg-slate-900 text-slate-200 rounded-xl space-y-2 text-xs">
          <div className="flex items-center justify-between text-teal-400 font-mono text-[11px]">
            <span className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5" />
              <span>Database Seeding Script (backend/scripts/seed_dataset.py)</span>
            </span>
            <span>Python 3.10+ / PostgreSQL</span>
          </div>
          <p className="text-[11px] text-slate-400">
            To populate an external PostgreSQL database from the synthetic dataset, execute:
          </p>
          <pre className="p-2.5 bg-slate-950 rounded-lg font-mono text-emerald-400 text-[11px] overflow-x-auto">
            DATABASE_URL="postgres://user:pass@localhost:5432/clinical_db" python3 backend/scripts/seed_dataset.py
          </pre>
        </div>
      </div>

      {/* Grid: 2. Core AI & RAG Configuration */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Cpu className="w-5 h-5 text-teal-600" />
          <h2 className="font-bold text-sm text-slate-900">LLM & RAG Pipeline Configuration</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-bold text-slate-900 block">LLM Reasoning Engine</span>
            <p className="text-slate-700">Model: <strong>Google Gemini 3.8 Flash (gemini-3.8-flash)</strong></p>
            <p className="text-slate-700">Output Modality: <strong>Structured JSON Schema</strong></p>
            <p className="text-slate-700">Temperature: <strong>0.20</strong> (Low-entropy for clinical reliability)</p>
          </div>

          <div className="space-y-1.5 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-bold text-slate-900 block">Retrieval-Augmented Generation (RAG)</span>
            <p className="text-slate-700">Knowledge Base: <strong>9 Peer-Reviewed Practice Guidelines</strong></p>
            <p className="text-slate-700">Sources: <strong>AHA/ACC, ADA, GOLD, KDIGO, Beers, Tokyo, IDSA, BSG</strong></p>
            <p className="text-slate-700">Verification: <strong>Strict "Insufficient evidence" fallback if ungrounded</strong></p>
          </div>
        </div>

        {/* Safety Constitution */}
        <div className="p-4 bg-teal-50/60 rounded-xl border border-teal-200 text-xs space-y-1.5 text-teal-950">
          <div className="flex items-center gap-2 font-bold text-teal-900">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>AI Safety & Clinical Guardrails</span>
          </div>
          <ul className="list-disc list-inside space-y-0.5 text-[11px] text-teal-900">
            <li>Zero autonomous medical diagnosis or prescription claim</li>
            <li>Clear separation between factual patient record and clinical assumptions</li>
            <li>Advisory wording standard: "Requires clinical review" over "Patient has disease X"</li>
            <li>Clinician-in-the-loop review mandatory before decision support is enacted</li>
          </ul>
        </div>
      </div>

    </div>
  );
};
