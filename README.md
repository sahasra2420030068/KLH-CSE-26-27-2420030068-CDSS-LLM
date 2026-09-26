# LLM-Based Clinical Decision Support System (LLM-CDSS)

> **CRITICAL CLINICAL & REGULATORY NOTICE:**
> This system is an **evidence-grounded Clinical Decision Support System (CDSS)** engineered to aid qualified healthcare professionals. It is **NOT** an autonomous physician or diagnostic device. It **never** claims to make a final medical diagnosis or autonomous prescribing decision. All suggestions require human-in-the-loop review by a certified clinician before being acted upon.
>
> **100% Synthetic Data:** All patient records, clinical notes, and laboratory panels in this project are strictly synthetic and de-identified. No real-world Protected Health Information (PHI) is used.

---

## 1. System Architecture & Pipeline Flow

The LLM-CDSS operates through a strictly grounded, non-hallucinatory pipeline:

```text
[Synthetic Patient Record]
(History, Vitals, Symptoms, Labs, Meds, Allergies)
          │
          ▼
[Clinical Context Construction]
(Token Extraction, Fact vs. Assumption Separation)
          │
          ▼
[RAG Knowledge Base Retrieval] ◄─── [Accredited Clinical Guidelines]
(Semantic Match & Domain Weighting)    (AHA/ACC, ADA, KDIGO, GOLD, Beers, etc.)
          │
          ▼
[Retrieved Evidence Citations]
(Guideline Passages, Relevance Scores, Recommendation Excerpts)
          │
          ▼
[Google Gemini 3.8 Flash Engine]
(Low-entropy, Structured JSON Output Schema)
          │
          ▼
[Structured CDSS Output]
├── Patient Summary (Factual synthesis)
├── Key Clinical Factors (Prioritized elements)
├── Missing Information & Workup Gaps (Vitals, pending tests)
├── Risk & Warning Alerts (Low/Moderate/High, "Requires clinical review")
└── Decision Support Suggestions (Grounded in retrieved guidelines)
          │
          ▼
[Clinician-in-the-Loop Review]
├── [ APPROVE ] ──► Verified into EHR record with clinician timestamp
├── [ MODIFY ]  ──► Stores original AI suggestion + edited clinician output
└── [ REJECT ]  ──► Logs audit justification for clinical disagreement
          │
          ▼
[Longitudinal Care Timeline & Audited Case Report]
```

---

## 2. Synthetic Dataset Information

### 2.1 Where the Dataset is Stored
All synthetic clinical files are stored under `/dataset`:
```text
dataset/
├── patients.csv          # Base demographics (ID, Age, Gender, Synthetic Name)
├── clinical_notes.json   # Encounter consultation notes and presenting symptoms
├── lab_results.csv       # Chemistry, hematology, and biomarker panels with reference ranges
├── medical_history.csv   # Documented chronic diagnoses, onset dates, and status
├── medications.csv       # Current medication regimen, dosages, and frequencies
├── allergies.csv         # Verified drug allergies and hypersensitivity reactions
└── README.md             # Dataset schema specification and documentation
```

### 2.2 Dataset File Formats
1. **`patients.csv`**: `patient_id, age, gender, synthetic_name`
2. **`clinical_notes.json`**: Array of `{ patient_id, date, clinical_note, symptoms: [] }`
3. **`lab_results.csv`**: `patient_id, test_name, value, unit, reference_range`
4. **`medical_history.csv`**: `patient_id, condition, diagnosis_date, status`
5. **`medications.csv`**: `patient_id, medication, dosage, frequency`
6. **`allergies.csv`**: `patient_id, allergen, reaction`

### 2.3 Included Synthetic Clinical Scenarios (10 Patients)
- **P101 (Eleanor Vance, 68F)**: HFrEF with CKD Stage 3a and T2D; exertional dyspnea, elevated BNP (840 pg/mL), Lisinopril + Furosemide + Metformin.
- **P102 (Marcus Reed, 52M)**: Acute Coronary Syndrome risk; exertional chest tightness, positive high-sensitivity Troponin I (42 ng/L), heavy smoker, uncontrolled hypertension.
- **P103 (Sophia Chen, 34F)**: Severe microcytic hypochromic iron deficiency anemia; Hemoglobin 8.2 g/dL, Ferritin 6 ng/mL secondary to menorrhagia, sulfa allergy.
- **P104 (Arthur Pendelton, 74M)**: Acute exacerbation of COPD; purulent sputum, respiratory acidosis, SpO2 88%, severe breathlessness.
- **P105 (Liam O'Connor, 29M)**: Healthy baseline control; 29yo marathon runner with normal vitals and unremarkable lab panel.
- **P106 (David Miller, 45M)**: Missing information scenario; acute RUQ pain (Murphy sign), postprandial vomiting; vitals disconnected and metabolic workup incomplete.
- **P107 (Beatrice Bailey, 79F)**: Geriatric polypharmacy and fall risk; high anticholinergic burden (Lorazepam + Zolpidem + Oxybutynin + Diphenhydramine) violating Beers Criteria.
- **P108 (Carlos Gomez, 61M)**: Severe uncontrolled T2D with diabetic neuropathy; HbA1c 10.8%, glucose 265 mg/dL, microalbuminuria, bilateral foot paresthesias.
- **P109 (Maya Patel, 24F)**: Acute uncomplicated cystitis with high-risk drug allergy; severe Penicillin anaphylaxis requiring strict avoidance of beta-lactams.
- **P110 (Harold Washington, 82M)**: Acute Kidney Injury (AKI) on CKD 3b; severe drug-induced nephrotoxicity from NSAID (Ibuprofen 800mg tid) + ACEi (Lisinopril) during dehydration, serum Cr 3.42 mg/dL.

### 2.4 How to Add New Synthetic Patients
1. Open `/dataset/patients.csv` and append a row with a new ID (e.g. `P111,55,Male,Alex Thorne (Synthetic)`).
2. Add corresponding entries in `clinical_notes.json`, `lab_results.csv`, `medical_history.csv`, `medications.csv`, and `allergies.csv`.
3. Alternatively, use the in-app **"Add Synthetic Patient"** button under the **Patients** tab to create records visually.

### 2.5 How to Run the Database Seed Script
A dedicated Python seeding script is provided in `backend/scripts/seed_dataset.py`.

To seed an external PostgreSQL instance:
```bash
# Set your PostgreSQL connection string
export DATABASE_URL="postgresql://username:password@localhost:5432/clinical_db"

# Execute the seeder
python3 backend/scripts/seed_dataset.py
```
*Note: If PostgreSQL is not configured, the application server includes an automated in-memory loader that parses `/dataset` directly on startup, allowing immediate evaluation without database setup.*

### 2.6 How the Dataset Connects to the RAG/LLM Pipeline
1. When **"Analyze Case"** is triggered, the server extracts patient features (demographics, active diagnoses, latest clinical notes, abnormal laboratory markers).
2. The context is vectorized and matched against the **Clinical Evidence Library** containing trusted guidelines (AHA/ACC, ADA, KDIGO, GOLD, Beers Criteria, Tokyo Guidelines).
3. The retrieved guideline excerpts and patient context are passed to **Gemini 3.8 Flash** with a strict JSON schema.
4. If no clinical guidelines match the inquiry, the system explicitly returns `"Insufficient evidence retrieved."`

---

## 3. Local Setup & Execution Guide

### 3.1 Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Gemini API Key**: (Optional for simulation; required for live Gemini calls)

### 3.2 Install Dependencies
```bash
npm install
```

### 3.3 Configure Gemini API Key
Create a `.env` file in the root directory (or copy `.env.example`):
```bash
cp .env.example .env
```
Add your Gemini API key:
```env
GEMINI_API_KEY="YOUR_GEMINI_API_KEY_HERE"
PORT=3000
```
*Note: In the Google AI Studio runtime environment, the `GEMINI_API_KEY` is injected automatically.*

### 3.4 Start the Complete Application
Run the unified full-stack server (Express backend + Vite React frontend):
```bash
npm run dev
```
Open your browser at `http://localhost:3000`.

### 3.5 Testing the RAG Pipeline
1. Navigate to the **Evidence Library** tab in the sidebar.
2. Enter clinical queries in the **Semantic RAG Search Tester** (e.g., *"NSAID induced acute kidney injury"* or *"High sensitivity troponin elevation"*).
3. Review the top matching guideline passages, relevance percentage, and journal citations.

### 3.6 Testing the Lab Report Analyzer
1. Open the **Lab Report Analyzer** tab.
2. Select one of the sample presets (e.g. *Renal Impairment & Hyperkalemia Panel* or *Acute Coronary Biomarkers*) or paste plain lab text.
3. Click **"Extract Structured Labs"** to extract analytes, units, normal ranges, and status classifications.
4. Click **"Attach to Patient Profile"** to integrate the extracted labs into the active synthetic patient's EHR.

---

## 4. Clinician Review & Audit Workflow

For every AI-generated decision-support suggestion:
- **`[ APPROVE ]`**: Validates the AI findings and logs clinician approval with timestamp into the patient's care timeline.
- **`[ MODIFY ]`**: Allows the clinician to edit the summary or clinical factors, saving both the original AI output and the clinician's modified version for full auditability.
- **`[ REJECT ]`**: Rejects the suggestion and prompts the clinician for a reason (e.g., alternative diagnosis or previous adverse response).
- **`[ Generate Case Report ]`**: Produces a formal, printable case audit summary containing the mandatory disclaimer:
  > *"AI-generated decision support. Final clinical decisions remain with qualified healthcare professionals."*

---

## 5. Advanced / Future Capabilities
- **HL7 FHIR / SMART on FHIR Connector**: Interoperability with Epic Systems, Cerner, and hospital EHRs.
- **Multimodal Medical Imaging**: Direct DICOM and ultrasound image analysis.
- **Dynamic Pharmacogenomic Profiling**: Integration with CPIC guidelines for CYP2D6/CYP2C19 drug-gene interactions.
