import React from 'react';
import { 
  Stethoscope, 
  ShieldAlert, 
  UserCheck, 
  ChevronDown, 
  Activity, 
  Sparkles,
  Info,
  Layers
} from 'lucide-react';
import { SyntheticPatient, UserProfile } from '../types/clinical';

interface HeaderProps {
  currentUser: UserProfile;
  patients: SyntheticPatient[];
  selectedPatient: SyntheticPatient | null;
  onSelectPatient: (patient: SyntheticPatient) => void;
  onOpenAuthModal: () => void;
  onOpenDisclaimerModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  patients,
  selectedPatient,
  onSelectPatient,
  onOpenAuthModal,
  onOpenDisclaimerModal,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200 px-4 lg:px-6 py-2.5 transition-all">
      <div className="flex items-center justify-between gap-3 max-w-7xl mx-auto">
        
        {/* Left: Brand + Regulatory Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-teal-600 flex items-center justify-center text-white shadow-sm shadow-teal-500/30">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-slate-900">LLM-CDSS</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-teal-100 text-teal-800 border border-teal-200/80">
                  RAG Core v2.4
                </span>
              </div>
              <p className="text-[11px] text-slate-700 hidden sm:block">Clinical Decision Support System</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-1.5 pl-3 border-l border-slate-200">
            <button
              onClick={onOpenDisclaimerModal}
              className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md bg-amber-50 text-amber-900 border border-amber-200/80 hover:bg-amber-100 transition-colors"
              title="Click to view regulatory & safety constraints"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
              <span>Advisory Only • Non-Autonomous</span>
            </button>
          </div>
        </div>

        {/* Center: Active Patient Selector */}
        <div className="flex items-center gap-2">
          <div className="relative group">
            <label className="text-[10px] uppercase font-semibold tracking-wider text-slate-700 block mb-0.5">
              Active Patient Record
            </label>
            <div className="flex items-center bg-slate-100/90 hover:bg-slate-200/80 border border-slate-300 rounded-lg px-2.5 py-1.5 transition-colors cursor-pointer min-w-[200px] sm:min-w-[260px]">
              <Activity className="w-4 h-4 text-teal-600 mr-2 shrink-0" />
              <select
                value={selectedPatient?.patient_id || ''}
                onChange={(e) => {
                  const p = patients.find(item => item.patient_id === e.target.value);
                  if (p) onSelectPatient(p);
                }}
                className="bg-transparent text-xs font-semibold text-slate-900 w-full focus:outline-none cursor-pointer truncate"
              >
                {patients.map(p => (
                  <option key={p.patient_id} value={p.patient_id}>
                    [{p.patient_id}] {p.synthetic_name} ({p.age}y {p.gender[0]})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-700 shrink-0 ml-1.5" />
            </div>
          </div>
        </div>

        {/* Right: Clinician Session & Switcher */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenDisclaimerModal}
            className="p-1.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg md:hidden"
            aria-label="Clinical safety disclaimer"
          >
            <Info className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenAuthModal}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 shadow-xs transition-all text-left"
          >
            <div className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs">
              {currentUser.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
            </div>
            <div className="hidden lg:block leading-tight">
              <div className="text-xs font-semibold text-slate-900 flex items-center gap-1">
                <span>{currentUser.name}</span>
                <span className="text-[10px] font-normal text-slate-700">({currentUser.role})</span>
              </div>
              <div className="text-[10px] text-slate-700">{currentUser.department}</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-700" />
          </button>
        </div>

      </div>
    </header>
  );
};
