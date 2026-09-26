import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  BrainCircuit, 
  BookOpenCheck, 
  MessageSquareCode, 
  FileSpreadsheet, 
  Clock3, 
  FileText, 
  Settings, 
  FlaskConical,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export type NavTab = 
  | 'dashboard' 
  | 'patients' 
  | 'analysis' 
  | 'evidence' 
  | 'assistant' 
  | 'lab-analyzer' 
  | 'timeline' 
  | 'reports' 
  | 'settings';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  pendingReviewsCount: number;
  highRiskCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  pendingReviewsCount,
  highRiskCount
}) => {
  const navItems = [
    { id: 'dashboard' as NavTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'patients' as NavTab, label: 'Patients', icon: Users, badge: null },
    { 
      id: 'analysis' as NavTab, 
      label: 'Clinical Analysis', 
      icon: BrainCircuit, 
      badge: highRiskCount > 0 ? `${highRiskCount} Alert` : null,
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300'
    },
    { id: 'evidence' as NavTab, label: 'Evidence Library', icon: BookOpenCheck },
    { id: 'assistant' as NavTab, label: 'AI Assistant', icon: MessageSquareCode },
    { id: 'lab-analyzer' as NavTab, label: 'Lab Report Analyzer', icon: FlaskConical },
    { id: 'timeline' as NavTab, label: 'Patient Timeline', icon: Clock3 },
    { 
      id: 'reports' as NavTab, 
      label: 'Clinical Reports', 
      icon: FileText,
      badge: pendingReviewsCount > 0 ? `${pendingReviewsCount} Due` : null,
      badgeColor: 'bg-teal-100 text-teal-900 border-teal-300'
    },
    { id: 'settings' as NavTab, label: 'System & Dataset', icon: Settings },
  ];

  return (
    <aside className="w-64 shrink-0 bg-slate-900 text-slate-300 flex flex-col justify-between min-h-[calc(100vh-57px)] border-r border-slate-800 select-none">
      <div className="p-3 space-y-6">
        
        {/* Navigation Section */}
        <div>
          <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Clinical Workflow
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-teal-600/90 text-white font-semibold shadow-sm shadow-teal-500/20'
                      : 'hover:bg-slate-800/80 text-slate-300 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${item.badgeColor || 'bg-slate-800 text-slate-300 border-slate-700'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Safety & Protocol Card */}
        <div className="px-3 py-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs">
          <div className="flex items-center gap-2 font-semibold text-slate-200 mb-1">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span>Human-in-the-Loop</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            AI recommendations require mandatory clinician review before integration into patient records.
          </p>
        </div>

      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-800 text-[11px] text-slate-400">
        <div className="flex items-center justify-between">
          <span>Engine Status</span>
          <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Gemini & RAG Ready
          </span>
        </div>
        <div className="text-[10px] text-slate-400 mt-1">
          Synthetic Clinical Dataset v1.0 • CDSS Prototype
        </div>
      </div>
    </aside>
  );
};
