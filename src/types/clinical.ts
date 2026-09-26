export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH';

export interface VitalSigns {
  blood_pressure: string;
  heart_rate: number | string;
  respiratory_rate: number | string;
  temperature: string;
  oxygen_saturation: string;
  recorded_at: string;
  status: 'NORMAL' | 'ABNORMAL' | 'CRITICAL' | 'MISSING';
}

export interface MedicalHistoryItem {
  condition: string;
  diagnosis_date: string;
  status: string;
}

export interface MedicationItem {
  medication: string;
  dosage: string;
  frequency: string;
}

export interface AllergyItem {
  allergen: string;
  reaction: string;
}

export interface LabResultItem {
  test_name: string;
  value: string;
  unit: string;
  reference_range: string;
  status?: 'NORMAL' | 'HIGH' | 'LOW' | 'CRITICAL' | 'ABNORMAL';
}

export interface ClinicalNoteItem {
  date: string;
  clinical_note: string;
  symptoms: string[];
}

export interface TimelineEvent {
  id: string;
  date: string;
  event_type: 'REGISTRATION' | 'CLINICAL_NOTE' | 'LAB_REPORT' | 'AI_ANALYSIS' | 'CLINICIAN_REVIEW' | 'FOLLOW_UP';
  title: string;
  description: string;
  clinician: string;
}

export interface EvidenceDocument {
  id: string;
  title: string;
  source: string;
  publication_year: number;
  category: string;
  section: string;
  content: string;
  key_recommendations: string[];
  url_reference: string;
  score?: number;
  relevance_percentage?: number;
  relevance_explanation?: string;
}

export interface RiskIndicator {
  signal: string;
  level: RiskLevel;
  clinical_rationale: string;
  requires_review: boolean;
}

export interface DecisionSupportItem {
  recommendation: string;
  evidence_source: string;
  category: 'DIAGNOSTIC' | 'THERAPEUTIC' | 'MONITORING' | 'SAFETY';
  rationale: string;
}

export interface AIAnalysisOutput {
  analysis_id?: string;
  timestamp?: string;
  patient_summary: string;
  clinical_factors: string[];
  important_findings: string[];
  missing_information: string[];
  follow_up_questions: string[];
  risk_indicators: RiskIndicator[];
  decision_support: DecisionSupportItem[];
  uncertainty: string;
  evidence_required: boolean;
  retrieved_evidence: EvidenceDocument[];
}

export interface ClinicianReview {
  id: string;
  analysis_id: string;
  decision: 'APPROVED' | 'MODIFIED' | 'REJECTED';
  original_suggestion: any;
  clinician_output: any;
  feedback: string;
  clinician_name: string;
  timestamp: string;
}

export interface SyntheticPatient {
  patient_id: string;
  synthetic_name: string;
  age: number;
  gender: string;
  contact_info: string;
  vital_signs: VitalSigns;
  medical_history: MedicalHistoryItem[];
  medications: MedicationItem[];
  allergies: AllergyItem[];
  lab_results: LabResultItem[];
  clinical_notes: ClinicalNoteItem[];
  timeline: TimelineEvent[];
  latest_analysis?: AIAnalysisOutput;
  clinician_reviews: ClinicianReview[];
}

export interface UserProfile {
  id: string;
  name: string;
  role: 'Clinician' | 'Admin';
  department: string;
  licenseNumber: string;
}
