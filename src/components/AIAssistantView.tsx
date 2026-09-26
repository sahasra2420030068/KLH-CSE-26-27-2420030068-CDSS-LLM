import React, { useState } from 'react';
import { 
  MessageSquareCode, 
  Send, 
  Sparkles, 
  BrainCircuit, 
  ShieldAlert, 
  HelpCircle, 
  BookOpen, 
  Activity, 
  AlertTriangle,
  RotateCw,
  User,
  Stethoscope
} from 'lucide-react';
import { SyntheticPatient } from '../types/clinical';

interface AssistantMessage {
  id: string;
  sender: 'clinician' | 'assistant';
  timestamp: string;
  question?: string;
  structuredResponse?: {
    answer: string;
    clinical_factors: string[];
    evidence: string[];
    uncertainty: string;
    missing_information: string[];
  };
}

interface AIAssistantViewProps {
  selectedPatient: SyntheticPatient | null;
}

export const AIAssistantView: React.FC<AIAssistantViewProps> = ({ selectedPatient }) => {
  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      structuredResponse: {
        answer: selectedPatient 
          ? `I am prepared to assist with decision support for patient ${selectedPatient.synthetic_name} (${selectedPatient.patient_id}). I synthesize patient history, clinical encounter notes, and accredited clinical guidelines. All outputs are strictly advisory.`
          : 'Please select a patient to begin patient-grounded clinical decision support inquiry.',
        clinical_factors: selectedPatient ? [
          `Age: ${selectedPatient.age}, Biological Sex: ${selectedPatient.gender}`,
          `Active Conditions: ${selectedPatient.medical_history.map(m => m.condition).slice(0, 2).join(', ') || 'None'}`,
          `Current Meds: ${selectedPatient.medications.map(m => m.medication).slice(0, 3).join(', ')}`
        ] : [],
        evidence: [
          'AHA/ACC, ADA, KDIGO, and GOLD accredited clinical practice guidelines indexed.'
        ],
        uncertainty: 'Outputs reflect probabilistic recommendations based on provided synthetic records. Clinician examination takes priority.',
        missing_information: []
      }
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSendMessage = async (queryToSend?: string) => {
    const text = queryToSend || inputText;
    if (!text.trim() || !selectedPatient || isSending) return;

    const userMsg: AssistantMessage = {
      id: `usr-${Date.now()}`,
      sender: 'clinician',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      question: text
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsSending(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_id: selectedPatient.patient_id,
          question: text
        })
      });
      const data = await res.json();

      const aiMsg: AssistantMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        structuredResponse: data
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        structuredResponse: {
          answer: 'Unable to communicate with clinical reasoning engine. Please try again.',
          clinical_factors: [],
          evidence: ['Insufficient evidence retrieved.'],
          uncertainty: 'Communication timeout.',
          missing_information: []
        }
      }]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-4">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs">
            <MessageSquareCode className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">Clinical AI Assistant</h1>
            <p className="text-xs text-slate-700">
              {selectedPatient ? (
                <>Context grounded in <strong>{selectedPatient.synthetic_name}</strong> ({selectedPatient.patient_id})</>
              ) : (
                'No patient selected'
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
          <span>Strict Format • No Hallucinated Evidence</span>
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-6 min-h-[480px] max-h-[620px] overflow-y-auto space-y-5">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.sender === 'clinician' ? 'justify-end' : 'justify-start'}`}>
            
            {msg.sender === 'assistant' && (
              <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 mt-0.5">
                <BrainCircuit className="w-4 h-4" />
              </div>
            )}

            <div className={`max-w-2xl rounded-2xl p-4 space-y-3 ${
              msg.sender === 'clinician'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-50 border border-slate-200/90 text-slate-800'
            }`}>
              {msg.sender === 'clinician' ? (
                <div className="text-xs leading-relaxed font-medium">
                  {msg.question}
                </div>
              ) : (
                <div className="space-y-3 text-xs">
                  
                  {/* Structured Answer */}
                  <div>
                    <span className="font-bold text-slate-900 text-[11px] uppercase tracking-wider block mb-1">
                      Clinical Assessment & Answer
                    </span>
                    <p className="leading-relaxed text-slate-800">
                      {msg.structuredResponse?.answer}
                    </p>
                  </div>

                  {/* Clinical Factors */}
                  {msg.structuredResponse?.clinical_factors && msg.structuredResponse.clinical_factors.length > 0 && (
                    <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                      <span className="font-bold text-teal-900 text-[10px] uppercase tracking-wide block">
                        Clinical Factors Considered
                      </span>
                      <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-700">
                        {msg.structuredResponse.clinical_factors.map((f, idx) => (
                          <li key={idx}>{f}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Evidence Citations */}
                  {msg.structuredResponse?.evidence && msg.structuredResponse.evidence.length > 0 && (
                    <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                      <span className="font-bold text-slate-900 text-[10px] uppercase tracking-wide block flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5 text-teal-600" />
                        Grounded Guideline Evidence
                      </span>
                      <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-700">
                        {msg.structuredResponse.evidence.map((ev, idx) => (
                          <li key={idx}>{ev}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Uncertainty & Missing Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    {msg.structuredResponse?.uncertainty && (
                      <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200 text-amber-950">
                        <strong className="block text-[10px] uppercase mb-0.5">Uncertainty:</strong>
                        {msg.structuredResponse.uncertainty}
                      </div>
                    )}
                    {msg.structuredResponse?.missing_information && msg.structuredResponse.missing_information.length > 0 && (
                      <div className="p-2.5 rounded-lg bg-rose-50/70 border border-rose-200 text-rose-950">
                        <strong className="block text-[10px] uppercase mb-0.5">Missing Info:</strong>
                        {msg.structuredResponse.missing_information.join('; ')}
                      </div>
                    )}
                  </div>

                </div>
              )}

              <div className={`text-[10px] text-right ${msg.sender === 'clinician' ? 'text-slate-400' : 'text-slate-700'}`}>
                {msg.timestamp}
              </div>
            </div>

            {msg.sender === 'clinician' && (
              <div className="w-8 h-8 rounded-lg bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                MD
              </div>
            )}

          </div>
        ))}

        {isSending && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
              <BrainCircuit className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-700 flex items-center gap-2">
              <RotateCw className="w-3.5 h-3.5 animate-spin text-teal-600" />
              <span>Retrieving evidence and formulating clinical response...</span>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Clinician Prompts */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-700 text-[11px] font-semibold">Suggested questions:</span>
        {[
          'What clinical factors should I review in this patient?',
          'Are there any guideline contraindications or drug-drug interactions?',
          'What diagnostic tests or missing labs are recommended next?',
          'What are the risk signals in this patient?'
        ].map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-[11px] text-slate-700 font-medium transition-colors cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Message Input Box */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">
        <input
          type="text"
          placeholder="Ask a clinical question about this patient (e.g. 'Evaluate renal risk with Lisinopril and recent labs')..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSendMessage();
          }}
          disabled={!selectedPatient || isSending}
          className="w-full px-3 py-2 text-xs focus:outline-none focus:ring-0 text-slate-900"
        />
        <button
          onClick={() => handleSendMessage()}
          disabled={!selectedPatient || isSending || !inputText.trim()}
          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Send</span>
        </button>
      </div>

    </div>
  );
};
