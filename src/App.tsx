/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar, NavTab } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { PatientsView } from './components/PatientsView';
import { AnalysisView } from './components/AnalysisView';
import { EvidenceView } from './components/EvidenceView';
import { AIAssistantView } from './components/AIAssistantView';
import { LabAnalyzerView } from './components/LabAnalyzerView';
import { TimelineView } from './components/TimelineView';
import { SettingsView } from './components/SettingsView';
import { ReportModal } from './components/ReportModal';
import { AuthModal } from './components/AuthModal';
import { DisclaimerModal } from './components/DisclaimerModal';
import { SyntheticPatient, UserProfile } from './types/clinical';
import { CheckCircle2, RotateCw } from 'lucide-react';

export default function App() {
  const [patients, setPatients] = useState<SyntheticPatient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<SyntheticPatient | null>(null);
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [isLoadingPatients, setIsLoadingPatients] = useState(true);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isDisclaimerModalOpen, setIsDisclaimerModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Active Clinician Session
  const [currentUser, setCurrentUser] = useState<UserProfile>({
    id: 'usr-1',
    name: 'Dr. Sarah Jenkins, MD',
    role: 'Clinician',
    department: 'Cardiovascular Medicine & Telemetry',
    licenseNumber: 'MD-849204'
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchPatients = async () => {
    try {
      const res = await fetch('/api/patients');
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        // Detailed fetch for first patient
        const detailedRes = await fetch(`/api/patients/${data[0].patient_id}`);
        const firstDetailed = await detailedRes.json();
        
        // Load details for all patients in memory
        const allDetailed = await Promise.all(
          data.map(async (p: any) => {
            const r = await fetch(`/api/patients/${p.patient_id}`);
            return r.json();
          })
        );

        setPatients(allDetailed);
        setSelectedPatient(prev => prev ? (allDetailed.find(item => item.patient_id === prev.patient_id) || firstDetailed) : firstDetailed);
      }
    } catch (err) {
      console.error('Error fetching patients:', err);
    } finally {
      setIsLoadingPatients(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleSelectPatient = (patient: SyntheticPatient) => {
    setSelectedPatient(patient);
  };

  const handleRunAnalysis = async (targetPatient?: SyntheticPatient) => {
    const patientToAnalyze = targetPatient || selectedPatient;
    if (!patientToAnalyze) return;

    setIsLoadingAnalysis(true);
    setCurrentTab('analysis');

    try {
      const res = await fetch('/api/analyze-case', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patient_id: patientToAnalyze.patient_id })
      });
      const analysisOutput = await res.json();

      setPatients(prev => prev.map(p => {
        if (p.patient_id === patientToAnalyze.patient_id) {
          return {
            ...p,
            latest_analysis: analysisOutput
          };
        }
        return p;
      }));

      setSelectedPatient(prev => {
        if (prev?.patient_id === patientToAnalyze.patient_id) {
          return {
            ...prev,
            latest_analysis: analysisOutput
          };
        }
        return prev;
      });

      showToast(`AI Case Analysis synthesized for ${patientToAnalyze.synthetic_name}. Awaiting clinician review.`);
    } catch (err) {
      console.error('Error analyzing case:', err);
      showToast('Error during clinical analysis. Falling back to local guideline engine.');
    } finally {
      setIsLoadingAnalysis(false);
    }
  };

  const handleSubmitReview = async (decision: 'APPROVED' | 'MODIFIED' | 'REJECTED', modifiedOutput?: any, feedback?: string) => {
    if (!selectedPatient) return;

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_id: selectedPatient.patient_id,
          decision,
          original_suggestion: selectedPatient.latest_analysis,
          clinician_output: modifiedOutput,
          feedback,
          clinician_name: currentUser.name
        })
      });
      const data = await res.json();
      if (data.patient) {
        setPatients(prev => prev.map(p => p.patient_id === data.patient.patient_id ? data.patient : p));
        setSelectedPatient(data.patient);
      }
      showToast(`Clinician Decision (${decision}) logged into patient audit record.`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddPatient = async (newPatientData: any) => {
    try {
      const res = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPatientData)
      });
      const created = await res.json();
      setPatients(prev => [created, ...prev]);
      setSelectedPatient(created);
      showToast(`Synthetic patient [${created.patient_id}] successfully enrolled.`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAttachLabs = async (labsToAttach: any[]) => {
    if (!selectedPatient) return;

    try {
      for (const lab of labsToAttach) {
        await fetch(`/api/patients/${selectedPatient.patient_id}/labs`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(lab)
        });
      }
      // Refresh patient
      const res = await fetch(`/api/patients/${selectedPatient.patient_id}`);
      const updated = await res.json();
      setPatients(prev => prev.map(p => p.patient_id === updated.patient_id ? updated : p));
      setSelectedPatient(updated);
      showToast(`Attached ${labsToAttach.length} extracted laboratory analytes to ${selectedPatient.synthetic_name}.`);
    } catch (err) {
      console.error(err);
    }
  };

  const pendingReviewsCount = patients.filter(p => p.latest_analysis && p.clinician_reviews.length === 0).length;
  const highRiskCount = patients.filter(p => p.vital_signs.status === 'CRITICAL' || p.latest_analysis?.risk_indicators?.some(r => r.level === 'HIGH')).length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-700 text-xs font-semibold flex items-center gap-2.5 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-teal-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Clinical Header */}
      <Header
        currentUser={currentUser}
        patients={patients}
        selectedPatient={selectedPatient}
        onSelectPatient={handleSelectPatient}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenDisclaimerModal={() => setIsDisclaimerModalOpen(true)}
      />

      <div className="flex-1 flex overflow-hidden">
        
        {/* Healthcare Navigation Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          pendingReviewsCount={pendingReviewsCount}
          highRiskCount={highRiskCount}
        />

        {/* Dynamic View Area */}
        <main className="flex-1 overflow-y-auto">
          {isLoadingPatients ? (
            <div className="p-16 text-center space-y-3">
              <RotateCw className="w-8 h-8 animate-spin text-teal-600 mx-auto" />
              <p className="text-xs text-slate-700">Loading synthetic patient cohort & RAG knowledge base...</p>
            </div>
          ) : (
            <>
              {currentTab === 'dashboard' && (
                <DashboardView
                  patients={patients}
                  selectedPatient={selectedPatient}
                  onSelectPatient={handleSelectPatient}
                  onNavigate={setCurrentTab}
                  onAnalyzeCase={handleRunAnalysis}
                />
              )}

              {currentTab === 'patients' && (
                <PatientsView
                  patients={patients}
                  selectedPatient={selectedPatient}
                  onSelectPatient={handleSelectPatient}
                  onNavigate={setCurrentTab}
                  onAnalyzeCase={handleRunAnalysis}
                  onAddPatient={handleAddPatient}
                />
              )}

              {currentTab === 'analysis' && (
                <AnalysisView
                  patient={selectedPatient}
                  analysis={selectedPatient?.latest_analysis || null}
                  isLoadingAnalysis={isLoadingAnalysis}
                  onRunAnalysis={() => handleRunAnalysis()}
                  onSubmitReview={handleSubmitReview}
                  onOpenReportModal={() => setIsReportModalOpen(true)}
                />
              )}

              {currentTab === 'evidence' && (
                <EvidenceView />
              )}

              {currentTab === 'assistant' && (
                <AIAssistantView selectedPatient={selectedPatient} />
              )}

              {currentTab === 'lab-analyzer' && (
                <LabAnalyzerView
                  selectedPatient={selectedPatient}
                  onAttachLabsToPatient={handleAttachLabs}
                />
              )}

              {currentTab === 'timeline' && (
                <TimelineView selectedPatient={selectedPatient} />
              )}

              {currentTab === 'reports' && (
                <div className="p-6 max-w-5xl mx-auto space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-2xl font-bold tracking-tight text-slate-900">Clinical Case Reports</h1>
                      <p className="text-xs text-slate-700">Formal printable case summaries and audit reports</p>
                    </div>
                    {selectedPatient && (
                      <button
                        onClick={() => setIsReportModalOpen(true)}
                        className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-xs"
                      >
                        Generate Report for {selectedPatient.patient_id}
                      </button>
                    )}
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                    <h2 className="font-bold text-sm text-slate-900">Select Patient to Export Case Audit Record</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {patients.map(p => (
                        <div
                          key={p.patient_id}
                          onClick={() => {
                            setSelectedPatient(p);
                            setIsReportModalOpen(true);
                          }}
                          className="p-4 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/20 cursor-pointer transition-all space-y-1"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-mono font-bold text-slate-700">{p.patient_id}</span>
                            <span className="text-[10px] text-teal-700 font-semibold">
                              {p.latest_analysis ? 'Analyzed' : 'Intake'}
                            </span>
                          </div>
                          <div className="font-bold text-xs text-slate-900">{p.synthetic_name}</div>
                          <div className="text-[11px] text-slate-700">{p.age}y {p.gender}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {currentTab === 'settings' && (
                <SettingsView />
              )}
            </>
          )}
        </main>

      </div>

      {/* Global Modals */}
      {isReportModalOpen && selectedPatient && (
        <ReportModal
          patient={selectedPatient}
          onClose={() => setIsReportModalOpen(false)}
        />
      )}

      {isAuthModalOpen && (
        <AuthModal
          currentUser={currentUser}
          onSelectUser={setCurrentUser}
          onClose={() => setIsAuthModalOpen(false)}
        />
      )}

      {isDisclaimerModalOpen && (
        <DisclaimerModal
          onClose={() => setIsDisclaimerModalOpen(false)}
        />
      )}

    </div>
  );
}
