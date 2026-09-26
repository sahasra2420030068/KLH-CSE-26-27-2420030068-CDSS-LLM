import React from 'react';
import { 
  UserCheck, 
  ShieldCheck, 
  Stethoscope, 
  Lock, 
  X, 
  Check, 
  Layers,
  AlertCircle
} from 'lucide-react';
import { UserProfile } from '../types/clinical';

interface AuthModalProps {
  currentUser: UserProfile;
  onSelectUser: (user: UserProfile) => void;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ currentUser, onSelectUser, onClose }) => {
  const clinicalUsers: UserProfile[] = [
    {
      id: 'usr-1',
      name: 'Dr. Sarah Jenkins, MD',
      role: 'Clinician',
      department: 'Cardiovascular Medicine & Inpatient Telemetry',
      licenseNumber: 'MD-849204'
    },
    {
      id: 'usr-2',
      name: 'Dr. David Zhao, MD',
      role: 'Clinician',
      department: 'Internal Medicine & Nephrology',
      licenseNumber: 'MD-773192'
    },
    {
      id: 'usr-3',
      name: 'Dr. Maya Lin, PharmD',
      role: 'Clinician',
      department: 'Clinical Pharmacy & Antimicrobial Stewardship',
      licenseNumber: 'RPH-559128'
    },
    {
      id: 'usr-4',
      name: 'Alex Rivera, MS (Admin)',
      role: 'Admin',
      department: 'Clinical Informatics & System Oversight',
      licenseNumber: 'ADM-1002'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 text-slate-900">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-slate-900">Clinician Identity & Authentication</h2>
              <p className="text-[11px] text-slate-700">Prototype Role Switcher (Clinician vs Admin)</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-700 hover:text-slate-900">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed">
          Select an active practitioner session. The user identity is stamped on all clinical reviews, case modifications, and audit logs.
        </p>

        <div className="space-y-2.5">
          {clinicalUsers.map((user) => {
            const isCurrent = currentUser.id === user.id;
            return (
              <div
                key={user.id}
                onClick={() => {
                  onSelectUser(user);
                  onClose();
                }}
                className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  isCurrent
                    ? 'border-teal-500 bg-teal-50/40 ring-2 ring-teal-500/20'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">{user.name}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${
                      user.role === 'Admin' ? 'bg-purple-100 text-purple-900 border-purple-200' : 'bg-teal-100 text-teal-900 border-teal-200'
                    }`}>
                      {user.role}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-700">{user.department}</div>
                  <div className="text-[10px] font-mono text-slate-700">License: {user.licenseNumber}</div>
                </div>

                {isCurrent && (
                  <div className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-700 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
          <span>Session securely simulated for healthcare demonstration. In production, OAuth/SAML Single-Sign-On is enforced.</span>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
