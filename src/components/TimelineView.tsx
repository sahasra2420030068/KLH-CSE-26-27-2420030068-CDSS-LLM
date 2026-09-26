import React, { useState } from 'react';
import { 
  Clock, 
  Calendar, 
  UserCheck, 
  FileText, 
  BrainCircuit, 
  FlaskConical, 
  CheckCircle2, 
  Plus, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { SyntheticPatient, TimelineEvent } from '../types/clinical';

interface TimelineViewProps {
  selectedPatient: SyntheticPatient | null;
  onAddTimelineEvent?: (event: Partial<TimelineEvent>) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({ selectedPatient }) => {
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDesc, setNewEventDesc] = useState('');
  const [eventType, setEventType] = useState<'FOLLOW_UP' | 'CLINICAL_NOTE'>('FOLLOW_UP');
  const [isAdding, setIsAdding] = useState(false);

  if (!selectedPatient) {
    return (
      <div className="p-12 text-center text-slate-700">
        Please select a patient to inspect their longitudinal timeline.
      </div>
    );
  }

  const getEventBadge = (type: string) => {
    switch (type) {
      case 'REGISTRATION':
        return { color: 'bg-blue-100 text-blue-900 border-blue-200', icon: UserCheck };
      case 'CLINICAL_NOTE':
        return { color: 'bg-slate-100 text-slate-800 border-slate-300', icon: FileText };
      case 'LAB_REPORT':
        return { color: 'bg-teal-100 text-teal-900 border-teal-200', icon: FlaskConical };
      case 'AI_ANALYSIS':
        return { color: 'bg-purple-100 text-purple-900 border-purple-200', icon: BrainCircuit };
      case 'CLINICIAN_REVIEW':
        return { color: 'bg-emerald-100 text-emerald-900 border-emerald-200', icon: CheckCircle2 };
      default:
        return { color: 'bg-amber-100 text-amber-900 border-amber-200', icon: Clock };
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-xs font-semibold mb-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Longitudinal Care Journey</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            Patient Timeline: {selectedPatient.synthetic_name}
          </h1>
          <p className="text-xs text-slate-700">
            Chronological audit trail of clinical notes, lab results, AI analyses, and clinician reviews
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Follow-Up Event</span>
        </button>
      </div>

      {/* Add Event Form */}
      {isAdding && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Log Clinical Follow-Up Event</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Event Title (e.g. Inpatient Cardiology Consult)..."
              value={newEventTitle}
              onChange={(e) => setNewEventTitle(e.target.value)}
              className="p-2 border border-slate-300 rounded-lg text-xs"
            />
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value as any)}
              className="p-2 border border-slate-300 rounded-lg text-xs"
            >
              <option value="FOLLOW_UP">Follow-Up Note</option>
              <option value="CLINICAL_NOTE">Clinical Encounter Note</option>
            </select>
          </div>
          <textarea
            rows={2}
            placeholder="Clinical observation or follow-up summary..."
            value={newEventDesc}
            onChange={(e) => setNewEventDesc(e.target.value)}
            className="w-full p-2 border border-slate-300 rounded-lg text-xs"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 text-xs text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (newEventTitle) {
                  selectedPatient.timeline.unshift({
                    id: `tl-custom-${Date.now()}`,
                    date: new Date().toISOString().slice(0, 10),
                    event_type: eventType,
                    title: newEventTitle,
                    description: newEventDesc || 'Follow-up clinical encounter recorded.',
                    clinician: 'Attending Clinician'
                  });
                  setIsAdding(false);
                  setNewEventTitle('');
                  setNewEventDesc('');
                }
              }}
              className="px-3 py-1.5 text-xs bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700"
            >
              Append to Care Timeline
            </button>
          </div>
        </div>
      )}

      {/* Timeline Stream */}
      <div className="relative pl-6 border-l-2 border-slate-200 space-y-6">
        {selectedPatient.timeline.map((event, idx) => {
          const badge = getEventBadge(event.event_type);
          const Icon = badge.icon;
          return (
            <div key={event.id || idx} className="relative group">
              {/* Dot */}
              <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-teal-600 group-hover:scale-110 transition-transform"></div>

              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2 hover:border-slate-300 transition-colors">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.color} flex items-center gap-1`}>
                      <Icon className="w-3 h-3" />
                      <span>{event.event_type.replace('_', ' ')}</span>
                    </span>
                    <h3 className="font-bold text-xs text-slate-900">{event.title}</h3>
                  </div>
                  <span className="text-[11px] font-mono text-slate-700">{event.date}</span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed">
                  {event.description}
                </p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-700">
                  <span>Author / Clinician: <strong className="text-slate-800">{event.clinician}</strong></span>
                  <span className="font-mono text-[10px] text-slate-700">Verified Record</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
