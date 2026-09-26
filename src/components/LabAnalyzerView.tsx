import React, { useState } from 'react';
import { 
  FlaskConical, 
  Upload, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCw, 
  PlusCircle, 
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { SyntheticPatient } from '../types/clinical';

interface LabAnalyzerViewProps {
  selectedPatient: SyntheticPatient | null;
  onAttachLabsToPatient: (newLabs: any[]) => void;
}

export const LabAnalyzerView: React.FC<LabAnalyzerViewProps> = ({
  selectedPatient,
  onAttachLabsToPatient,
}) => {
  const [inputText, setInputText] = useState(`Comprehensive Metabolic & Hematology Panel:
Serum Creatinine: 2.35 mg/dL (Ref: 0.7 - 1.3)
Blood Urea Nitrogen (BUN): 48 mg/dL (Ref: 7 - 20)
Serum Potassium: 5.6 mEq/L (Ref: 3.5 - 5.0)
Serum Sodium: 136 mEq/L (Ref: 135 - 145)
eGFR: 28 mL/min/1.73m2 (Ref: > 60)
Hemoglobin: 9.8 g/dL (Ref: 12.0 - 15.5)
High-Sensitivity Troponin I: 38 ng/L (Ref: < 14)
Glucose Fasting: 184 mg/dL (Ref: 70 - 99)`);

  const [extractedLabs, setExtractedLabs] = useState<any[]>([]);
  const [findingsSummary, setFindingsSummary] = useState<string>('');
  const [clinicalWarning, setClinicalWarning] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAttached, setIsAttached] = useState(false);

  const samplePresets = [
    {
      name: 'Sample 1: Renal Impairment & Hyperkalemia Panel',
      text: `Metabolic Panel:
Serum Creatinine: 3.2 mg/dL (Ref: 0.7 - 1.3)
Blood Urea Nitrogen: 62 mg/dL (Ref: 7 - 20)
Potassium: 5.8 mEq/L (Ref: 3.5 - 5.0)
Sodium: 132 mEq/L (Ref: 135 - 145)
eGFR: 18 mL/min/1.73m2 (Ref: > 60)`
    },
    {
      name: 'Sample 2: Acute Coronary Biomarker Panel',
      text: `Cardiac Enzymes:
High-Sensitivity Troponin I: 68 ng/L (Ref: < 14)
CK-MB: 12.4 ng/mL (Ref: 0.0 - 5.0)
Total Cholesterol: 260 mg/dL (Ref: < 200)
LDL Cholesterol: 182 mg/dL (Ref: < 100)
Triglycerides: 240 mg/dL (Ref: < 150)`
    },
    {
      name: 'Sample 3: Microcytic Anemia & Iron Study',
      text: `Hematology & Iron Workup:
Hemoglobin: 7.9 g/dL (Ref: 12.0 - 15.5)
Hematocrit: 25.1 % (Ref: 37.0 - 48.0)
MCV: 66 fL (Ref: 80 - 100)
Serum Ferritin: 5 ng/mL (Ref: 15 - 150)
Total Iron Binding Capacity: 480 mcg/dL (Ref: 250 - 450)`
    }
  ];

  const handleRunAnalysis = async (textToProcess?: string) => {
    const text = textToProcess || inputText;
    if (!text.trim()) return;

    setIsAnalyzing(true);
    setIsAttached(false);

    try {
      const res = await fetch('/api/analyze-lab', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          document_text: text,
          patient_id: selectedPatient?.patient_id
        })
      });
      const data = await res.json();
      setExtractedLabs(data.tests || []);
      setFindingsSummary(data.notable_findings_summary || '');
      setClinicalWarning(data.clinical_warning || 'Requires clinician correlation.');
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAttachToPatient = () => {
    if (!selectedPatient || extractedLabs.length === 0) return;
    onAttachLabsToPatient(extractedLabs);
    setIsAttached(true);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-xs font-semibold mb-1">
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Document & Analyte Intelligence</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Lab Report Analyzer</h1>
          <p className="text-xs text-slate-700">Extracts structured laboratory values, reference ranges, and abnormal status flags</p>
        </div>

        <div className="flex items-center gap-2 text-xs text-amber-900 bg-amber-50 border border-amber-200/80 px-3 py-1.5 rounded-xl">
          <ShieldAlert className="w-4 h-4 text-amber-600" />
          <span>Non-Autonomous • No Independent Diagnosis</span>
        </div>
      </div>

      {/* Input / Presets Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Paste Synthetic Lab Report Text or Choose Sample
          </span>
          <div className="flex flex-wrap gap-1.5">
            {samplePresets.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputText(preset.text);
                  handleRunAnalysis(preset.text);
                }}
                className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer transition-colors"
              >
                {preset.name.split(':')[0]}
              </button>
            ))}
          </div>
        </div>

        <textarea
          rows={6}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste plain text lab results (e.g. Test: Value Unit (Ref: Range))..."
          className="w-full p-3 text-xs font-mono border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20"
        />

        <div className="flex items-center justify-between">
          <span className="text-[11px] text-slate-700">
            Target Patient: <strong>{selectedPatient ? `${selectedPatient.synthetic_name} (${selectedPatient.patient_id})` : 'None selected'}</strong>
          </span>
          <button
            onClick={() => handleRunAnalysis()}
            disabled={isAnalyzing}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
          >
            {isAnalyzing ? (
              <>
                <RotateCw className="w-3.5 h-3.5 animate-spin" />
                <span>Extracting Analytes...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Extract Structured Labs</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Extracted Labs Output Table */}
      {extractedLabs.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-600" />
                Structured Laboratory Extraction Table
              </h3>
              <p className="text-xs text-slate-700">Extracted {extractedLabs.length} analytes with biological status classifications</p>
            </div>

            {selectedPatient && (
              <button
                onClick={handleAttachToPatient}
                disabled={isAttached}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer ${
                  isAttached
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                {isAttached ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Attached to {selectedPatient.patient_id} Record</span>
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-4 h-4" />
                    <span>Attach to {selectedPatient.patient_id} Profile</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-2.5 px-3">Test Name</th>
                  <th className="py-2.5 px-3">Measured Value</th>
                  <th className="py-2.5 px-3">Unit</th>
                  <th className="py-2.5 px-3">Reference Range</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {extractedLabs.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{row.test_name}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{row.value}</td>
                    <td className="py-2.5 px-3 text-slate-700">{row.unit}</td>
                    <td className="py-2.5 px-3 text-slate-700 font-mono">{row.reference_range}</td>
                    <td className="py-2.5 px-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        row.status === 'CRITICAL'
                          ? 'bg-rose-100 text-rose-900 border-rose-200'
                          : row.status === 'HIGH'
                          ? 'bg-amber-100 text-amber-900 border-amber-200'
                          : row.status === 'LOW'
                          ? 'bg-blue-100 text-blue-900 border-blue-200'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Notable Findings Summary */}
          {findingsSummary && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wide block">
                Summary of Notable Findings
              </span>
              <p className="text-xs text-slate-800 leading-relaxed">
                {findingsSummary}
              </p>
              <div className="pt-2 text-[11px] text-amber-900 font-medium flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>{clinicalWarning}</span>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
