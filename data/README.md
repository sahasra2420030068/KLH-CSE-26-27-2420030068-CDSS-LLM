# 🩺 AI-Powered Chest X-Ray Clinical Decision Support System

An AI-powered **Clinical Decision Support System (CDSS)** that analyzes chest X-ray images to assist in the detection of **pneumonia** and provide clinical decision-support information based on patient vitals and symptoms.

> ⚠️ **Medical Disclaimer:** This project is intended for educational and research purposes only. It is not a substitute for professional medical diagnosis or clinical judgment.

---

## 🚀 Overview

The **Chest X-Ray CDSS** combines deep learning-based image analysis with patient clinical information to provide an easy-to-understand diagnostic support interface.

The system allows users to:

* Upload a chest X-ray image
* Analyze the image using a trained deep learning model
* Detect pneumonia-related findings
* View prediction confidence
* Visualize important image regions using a heatmap
* Enter patient vitals and symptoms
* Generate additional clinical decision-support information
* Manage user accounts through authentication
* View analysis results through a responsive web interface

The project follows a full-stack architecture with a **Next.js frontend**, **Django REST backend**, and **TensorFlow/Keras machine-learning model**.

---

## ✨ Features

### 🩻 X-Ray Analysis

* Drag-and-drop chest X-ray upload
* AI-powered pneumonia prediction
* Prediction confidence score
* Image preprocessing before inference
* Heatmap visualization for model interpretation

### 👨‍⚕️ Patient Information

The system can collect:

* Date of birth
* Gender
* Temperature
* Systolic blood pressure
* Diastolic blood pressure
* Heart rate
* Cough
* Headache
* Ability to smell/taste

### 🧠 Clinical Decision Support

Patient information is combined with the X-ray prediction to generate additional decision-support information.

The backend contains a rule/Bayesian-based knowledge system that considers factors such as:

* Fever
* Cough
* Headache
* Loss of smell
* Elevated heart rate
* Elevated blood pressure
* Age
* Gender
* Pneumonia prediction

### 📊 Results Dashboard

The results interface provides:

* AI prediction
* Confidence information
* Clinical indicators
* Severity information
* Visual X-ray analysis
* Heatmap visualization
* Clinical recommendations

### 🔐 Authentication

The application includes:

* User registration
* Login
* Protected routes
* Authentication state management
* Backend authentication APIs

### 🌓 Responsive UI

* Responsive desktop/mobile interface
* Light/dark theme support
* Modern medical dashboard design
* Reusable React components

### 📴 Demo Mode

The frontend includes a demo mode that can generate mock analysis results when the backend is unavailable, allowing the interface to be demonstrated without running the complete backend stack.

---

# 🏗️ System Architecture

```text
                    ┌─────────────────────┐
                    │      User           │
                    │ Healthcare Provider │
                    └──────────┬──────────┘
                               │
                               ▼
                 ┌─────────────────────────┐
                 │      Next.js Frontend   │
                 │                         │
                 │ • X-Ray Upload          │
                 │ • Patient Vitals        │
                 │ • Authentication        │
                 │ • Results Dashboard     │
                 │ • Heatmap Visualization │
                 └────────────┬────────────┘
                              │
                         REST API
                              │
                              ▼
                 ┌─────────────────────────┐
                 │      Django Backend     │
                 │                         │
                 │ • Authentication       │
                 │ • Image Processing      │
                 │ • API Endpoints         │
                 │ • Clinical Logic        │
                 └────────────┬────────────┘
                              │
                              ▼
                 ┌─────────────────────────┐
                 │   TensorFlow / Keras    │
                 │      ML Model           │
                 │                         │
                 │ Chest X-Ray Analysis    │
                 │ Pneumonia Prediction    │
                 └────────────┬────────────┘
                              │
                              ▼
                 ┌─────────────────────────┐
                 │ Clinical Decision       │
                 │ Support Engine          │
                 │                         │
                 │ • Patient Vitals        │
                 │ • Symptoms              │
                 │ • Bayesian Rules        │
                 │ • Risk Information      │
                 └─────────────────────────┘
```

---

# 🛠️ Tech Stack

## Frontend

| Technology   | Purpose                   |
| ------------ | ------------------------- |
| Next.js      | Web application framework |
| React        | UI development            |
| TypeScript   | Type-safe development     |
| Tailwind CSS | Styling                   |
| Recharts     | Data visualization        |
| Lucide React | Icons                     |

## Backend

| Technology            | Purpose                |
| --------------------- | ---------------------- |
| Python                | Backend/ML programming |
| Django                | Backend framework      |
| Django REST Framework | REST APIs              |
| SQLite                | Development database   |

## Machine Learning

| Technology | Purpose                     |
| ---------- | --------------------------- |
| TensorFlow | Deep learning framework     |
| Keras      | Model development/inference |
| NumPy      | Numerical processing        |
| Pillow     | Image processing            |
| OpenCV     | Image processing            |

---

# 📁 Project Structure

```text
cdss-xray-app-main/
│
├── backend/
│   └── core/
│       ├── core/
│       │   ├── settings.py
│       │   ├── urls.py
│       │   ├── asgi.py
│       │   └── wsgi.py
│       │
│       ├── auth_service/
│       │   ├── models.py
│       │   ├── serializers.py
│       │   ├── views.py
│       │   └── urls.py
│       │
│       ├── imaging_service/
│       │   ├── model/
│       │   │   ├── model_loader.py
│       │   │   ├── model_predict.py
│       │   │   └── pneumonia_model.keras
│       │   │
│       │   ├── knowledge_base.py
│       │   ├── views.py
│       │   └── urls.py
│       │
│       ├── manage.py
│       └── requirements.txt
│
├── cdss-xray-app/
│   ├── app/
│   │   ├── analyze/
│   │   ├── result/
│   │   ├── login/
│   │   ├── register/
│   │   ├── about/
│   │   └── contact/
│   │
│   ├── components/
│   │   └── ui/
│   │       ├── ImageUploader.tsx
│   │       ├── HeatmapViewer.tsx
│   │       ├─
```
