import React from 'react';
import { ShieldAlert, Check, X, BookOpen, AlertTriangle } from 'lucide-react';

interface DisclaimerModalProps {
  onClose: () => void;
}

export const DisclaimerModal: React.FC<DisclaimerModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-slate-900">
        
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4 text-amber-700" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-slate-900">Clinical Safety & Regulatory Notice</h2>
              <p className="text-[11px] text-slate-700">Prototype Non-Autonomous Architecture</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-700 hover:text-slate-900">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 text-xs leading-relaxed text-slate-700">
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-950 font-medium">
            This system is a <strong>Clinical Decision Support System (CDSS)</strong>, NOT an autonomous doctor or diagnostic system.
          </div>

          <div className="space-y-1.5">
            <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wide">Key Principles Enforced:</h4>
            <ul className="list-disc list-inside space-y-1 text-slate-800">
              <li><strong>Zero Autonomous Decisions:</strong> The AI will never claim to make a final medical diagnosis or autonomous treatment decision.</li>
              <li><strong>Advisory Terminology:</strong> Uses standard wording such as <em>"Requires clinical review"</em> rather than <em>"Patient has disease X"</em>.</li>
              <li><strong>RAG Evidence Grounding:</strong> Suggestions are grounded in peer-reviewed clinical guidelines (AHA/ACC, ADA, KDIGO, GOLD, Beers Criteria). When no evidence is found, it explicitly states <em>"Insufficient evidence retrieved."</em></li>
              <li><strong>Clinician-in-the-Loop Review:</strong> Every recommendation provides <code>[Approve]</code>, <code>[Modify]</code>, or <code>[Reject]</code> audit controls before integration into the patient record.</li>
              <li><strong>Synthetic Data Only:</strong> 100% de-identified, synthetic patient scenarios. No real Protected Health Information (PHI) is used.</li>
            </ul>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold cursor-pointer"
          >
            I Acknowledge & Understand
          </button>
        </div>

      </div>
    </div>
  );
};
