🩺 AI-Powered Chest X-Ray CDSS
Next.js TypeScript React Tailwind CSS Django Python Semi-Graduation Development Time

Live Demo | Demo Video | Kaggle Dataset
A Clinical Decision Support System (CDSS) for analyzing chest X-ray images to detect pneumonia and aid COVID-19 diagnosis. Built with a Convolutional Neural Network (CNN) trained on the Kaggle Chest X-ray Pneumonia Dataset (~5,000 images), achieving 89.9% accuracy. Features a full-stack architecture with Next.js, Django, TensorFlow, and PostgreSQL, supporting drag-and-drop uploads, patient vitals input, and detailed diagnostic reports. Includes demo and integrated BE modes for seamless UX. Developed as a course project at Cairo University, rivaling graduation project quality.

This semi-graduation project demonstrates a clean architecture approach with three distinct service layers (Frontend, Backend, and AI Analysis) that work together to provide a comprehensive medical diagnostic tool.

App Screenshot

📋 Table of Contents
Features
Tech Stack
Architecture
Getting Started
Clinical Workflow
UI & UX Highlights
Backend API Documentation
Deployment
Development Notes
License
Contributing
Author
📸 Features
🖼️ X-ray Image Upload: Drag and drop interface for easy chest X-ray upload
🤖 AI-powered Analysis: Advanced machine learning models for accurate diagnostic suggestions
🔍 Heatmap Visualization: Visual highlighting of regions of interest in X-ray images
📊 Detailed Results: Comprehensive diagnostic suggestions with confidence scores
🔁 Rule-Based Fallback: Intelligent fallback mechanisms when ML inference is uncertain
📋 Patient Vitals Integration: Form for capturing patient temperature, blood pressure, heart rate, and symptoms
🏥 Enhanced Diagnosis: Combined analysis of imaging findings with clinical parameters
⚕️ Treatment Recommendations: Tailored treatment suggestions based on imaging and vitals
⚠️ Severity Classification: Automatic categorization of cases as Low, Moderate, or High severity
🌗 Light & Dark Mode: Toggle between themes for comfortable viewing in any environment
📱 Responsive Design: Optimized user experience across all device sizes
🔒 User Authentication: Secure login and registration system
📊 Interactive Data Visualization: Display of prediction results using Recharts
♻️ Component Architecture: Clean, modular design with reusable components
📄 Downloadable Reports: Generate comprehensive diagnostic reports (coming soon)
🧱 Tech Stack
🌐 Frontend
Next.js 15.3: React framework with App Router architecture
TypeScript: Type-safe code development
React 19: Component-based UI library
Tailwind CSS: Utility-first CSS framework for styling
React Dropzone: For drag-and-drop file uploads
Recharts: For data visualization
Lucide React: Icon library
🧠 AI & Backend
Python 3.12: Core backend language
Django 4.2: Backend web framework
Django REST Framework: API development toolkit
PyTorch/TensorFlow: ML model implementation
Pillow/OpenCV: Image processing libraries
NumPy/Pandas: Data handling
SQLite: Development database (PostgreSQL in production)
🏗 Architecture
The application follows a modern client-server architecture with a clean separation of three distinct service layers:

Frontend Service:

Built with Next.js 15.3, React 19, TypeScript, and Tailwind CSS
Handles user interface, interactions, and data visualization
Provides responsive design for various devices and clinical settings
Features interactive heatmap visualization of X-ray regions of interest
Includes light/dark mode for different working environments
Implements comprehensive form validation and error handling
Supports downloadable diagnostic reports in PDF format
Backend Service:

Developed with Django 4.2, Python 3.12, and Django REST Framework
Manages API endpoints, authentication (JWT-based), and user management
Handles image processing and metadata extraction
Provides secure data storage and retrieval
Implements clinical data validation and processing
Offers comprehensive error handling and logging
AI Analysis Service:

Integrates deep learning models for chest X-ray pathology detection
Analyzes images for conditions like pneumonia, COVID-19, cardiomegaly, etc.
Incorporates rule-based systems for diagnostic refinement using patient vitals
Generates heatmaps highlighting regions of interest in X-rays
Provides severity classification (Low, Moderate, High) based on findings
Delivers evidence-based treatment recommendations
Supports multiple diagnosis possibilities with confidence scores
Each layer has clear responsibilities and communicates through well-defined interfaces:

📁 cdss-xray-app/           # Frontend application
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Homepage
│   ├── analyze/            # X-ray upload & analysis
│   ├── result/             # Analysis results display with vitals form
│   ├── login/              # Authentication
│   └── register/           # New user registration
├── components/             # Reusable React components
│   ├── ui/                 # UI components
│   │   ├── ImageUploader.tsx
│   │   ├── HeatmapViewer.tsx
│   │   ├── PatientVitalsForm.tsx
│   │   ├── FinalDiagnosisCard.tsx
│   │   └── ...
├── hooks/                  # Custom React hooks
├── utils/                  # Helper functions
│   ├── predictionService.ts
│   └── imageUploadService.ts
├── types/                  # TypeScript type definitions
└── public/                 # Static assets

📁 backend/                 # Backend services
├── core/                   # Django project
│   ├── settings.py         # Project configuration
│   └── urls.py             # URL routing
├── auth_service/           # Authentication API
│   ├── models.py           # User model
│   ├── views.py            # Auth endpoints
│   └── ...
├── imaging_service/        # X-ray processing service
│   ├── models.py           # X-ray and diagnosis models
│   ├── views.py            # Image analysis endpoints
│   └── ...
└── requirements.txt        # Python dependencies
