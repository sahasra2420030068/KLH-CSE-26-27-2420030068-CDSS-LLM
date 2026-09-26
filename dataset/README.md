# Synthetic Clinical Dataset for LLM-CDSS

> **IMPORTANT CLINICAL & ETHICAL DISCLAIMER:**
> All data in this directory is **100% SYNTHETIC and DE-IDENTIFIED**. No real patient records, protected health information (PHI), or personally identifiable information (PII) are contained herein. This dataset is engineered exclusively for demonstration, academic, and evaluation purposes for an **LLM-Based Clinical Decision Support System (LLM-CDSS)**.
>
> The system is a decision-support aid designed to assist qualified healthcare professionals; it is **NOT** an autonomous diagnostic system or medical practitioner.

---

## 1. Storage Location
All raw synthetic dataset files reside in `/dataset/`:
```text
dataset/
├── patients.csv          # Base synthetic demographics (ID, Age, Gender, Name)
├── clinical_notes.json   # Longitudinal physician notes and presenting symptoms
├── lab_results.csv       # Laboratory panel results with units and reference ranges
├── medical_history.csv   # Historical diagnoses, onset dates, and clinical status
├── medications.csv       # Current medication regimen, dosages, and administration frequency
├── allergies.csv         # Drug allergies and hypersensitivity reaction types
└── README.md             # Dataset documentation and schema specifications
```

---

## 2. Dataset File Formats & Schemas

### `patients.csv`
| Column | Type | Example | Description |
|---|---|---|---|
| `patient_id` | String | `P101` | Unique synthetic identifier |
| `age` | Integer | `68` | Patient chronological age |
| `gender` | String | `Female` | Biological sex |
| `synthetic_name` | String | `Eleanor Vance (Synthetic)` | De-identified synthetic name label |

### `clinical_notes.json`
Array of JSON objects:
```json
{
  "patient_id": "P101",
  "date": "2026-09-18",
  "clinical_note": "Detailed subjective and objective clinical note text...",
  "symptoms": ["Exertional dyspnea", "Orthopnea", "Bilateral pedal edema"]
}
```

### `lab_results.csv`
| Column | Type | Example | Description |
|---|---|---|---|
| `patient_id` | String | `P101` | Matching patient identifier |
| `test_name` | String | `Serum Creatinine` | Diagnostic analyte or panel name |
| `value` | String/Float | `1.85` | Measured laboratory value |
| `unit` | String | `mg/dL` | Standard SI or clinical measurement unit |
| `reference_range` | String | `0.7 - 1.3` | Normal biological interval for lab test |

### `medical_history.csv`
| Column | Type | Example | Description |
|---|---|---|---|
| `patient_id` | String | `P101` | Matching patient identifier |
| `condition` | String | `Heart Failure with Reduced Ejection Fraction` | Diagnostic ICD-equivalent condition |
| `diagnosis_date` | String | `2022-04-12` | Historical record date |
| `status` | String | `Active` | Active, Inactive, Exacerbation, or Pending |

### `medications.csv`
| Column | Type | Example | Description |
|---|---|---|---|
| `patient_id` | String | `P101` | Matching patient identifier |
| `medication` | String | `Lisinopril` | Generic pharmaceutical name |
| `dosage` | String | `20 mg` | Prescribed dose |
| `frequency` | String | `Once daily` | Administration frequency/schedule |

### `allergies.csv`
| Column | Type | Example | Description |
|---|---|---|---|
| `patient_id` | String | `P109` | Matching patient identifier |
| `allergen` | String | `Amoxicillin / Penicillin` | Drug substance |
| `reaction` | String | `Anaphylaxis requiring IM Epinephrine` | Documented adverse hypersensitivity event |

---

## 3. Included Clinical Scenarios (10 Synthetic Cases)

1. **P101 (Eleanor Vance)**: Complex multimorbidity — HFrEF, CKD Stage 3a, T2D, worsening heart failure exacerbation, elevated BNP, Lisinopril + Furosemide + Metformin.
2. **P102 (Marcus Reed)**: Acute Coronary Syndrome risk — exertional chest tightness, positive high-sensitivity Troponin I (42 ng/L), heavy smoker, uncontrolled hypertension.
3. **P103 (Sophia Chen)**: Severe microcytic hypochromic iron deficiency anemia — Hemoglobin 8.2 g/dL, Ferritin 6 ng/mL secondary to menorrhagia, sulfa allergy.
4. **P104 (Arthur Pendelton)**: Acute exacerbation of COPD — purulent sputum, respiratory acidosis, SpO2 88%, severe breathlessness.
5. **P105 (Liam O'Connor)**: Healthy baseline control — 29yo marathon runner with completely normal vitals and unremarkable lab panel.
6. **P106 (David Miller)**: Missing information scenario — acute RUQ pain (Murphy sign), postprandial vomiting; vitals disconnected and metabolic workup incomplete.
7. **P107 (Beatrice Bailey)**: Geriatric polypharmacy and fall risk — high anticholinergic burden (Lorazepam + Zolpidem + Oxybutynin + Diphenhydramine) violating Beers Criteria.
8. **P108 (Carlos Gomez)**: Severe uncontrolled T2D with diabetic neuropathy — HbA1c 10.8%, glucose 265 mg/dL, microalbuminuria, bilateral foot paresthesias.
9. **P109 (Maya Patel)**: Acute uncomplicated cystitis with high-risk drug allergy — severe Penicillin anaphylaxis requiring strict avoidance of beta-lactams.
10. **P110 (Harold Washington)**: Acute Kidney Injury (AKI) on CKD 3b — severe drug-induced nephrotoxicity from NSAID (Ibuprofen 800mg tid) + ACEi (Lisinopril) during dehydration, serum Cr 3.42 mg/dL.

---

## 4. How to Add New Synthetic Patients
1. Assign a new sequential ID (e.g., `P111`).
2. Add a demographic row in `patients.csv`.
3. Add at least one clinical consultation note and symptom array in `clinical_notes.json`.
4. Add relevant laboratory measurements in `lab_results.csv`.
5. Enter known chronic diseases in `medical_history.csv`.
6. Add current active pharmacotherapy in `medications.csv`.
7. Add verified drug sensitivities or `NKDA` in `allergies.csv`.
8. The server hot-reloads or seeds the updated records automatically upon startup.

---

## 5. How to Run the Dataset Seed Script

### For PostgreSQL (Production):
Ensure `DATABASE_URL` is set in your environment:
```bash
python3 backend/scripts/seed_dataset.py
```

### For In-Memory / Local Prototype:
The application server automatically reads the files in `/dataset/` on boot and initializes the clinical database in-memory with automatic persistence. No manual SQL configuration is required to immediately run and test the prototype.

---

## 6. How the Dataset Connects to the RAG / LLM Pipeline

```text
[Synthetic Dataset (/dataset)]
            │
            ▼
[Structured Patient Context Builder] ───► [Clinical Query & Token Extraction]
            │                                             │
            │                                             ▼
            │                           [Vector Search & Embedding Match]
            │                                             │
            │                                             ▼
            │                                [Evidence Library Guidelines]
            │                                (AHA/ACC, ADA, KDIGO, GOLD)
            │                                             │
            ▼                                             ▼
[Combined Context: Patient Records + Retrieved Clinical Evidence Passages]
                                    │
                                    ▼
                   [Google Gemini LLM Engine]
                                    │
                                    ▼
               [Structured JSON Decision Support Output]
               • Patient Summary
               • Key Clinical Factors
               • Missing Information
               • Risk & Warning Alerts
               • Evidence-Grounded Recommendations
                                    │
                                    ▼
                 [Clinician-in-the-Loop Review]
                 (Approve / Modify / Reject + Audit Trail)
```
