---
title: Hostel Management System
emoji: 🏨
colorFrom: blue
colorTo: green
sdk: docker
app_port: 7860
pinned: false
---

# Hostel Grievance Redressal System

## Overview

The Hostel Grievance Redressal System is designed to efficiently manage and resolve grievances raised by residents. By leveraging AI/ML functionalities, the system aims to enhance communication, streamline grievance handling, and provide timely resolutions. This document outlines the implementation plans for various AI/ML features, system architecture, and usage instructions.

---

## Table of Contents

1. [System Architecture Overview](#system-architecture-overview)
2. [AI/ML Functionalities](#aiml-functionalities)
   - [1. Intelligent Routing and Workflow Automation](#1-intelligent-routing-and-workflow-automation)
   - [2. Advanced Sentiment and Emotional Intelligence Analysis](#2-advanced-sentiment-and-emotional-intelligence-analysis)
   - [3. Multilingual Translation in Chatroom](#3-multilingual-translation-in-chatroom)
   - [4. Worker Job Recommendation](#4-worker-job-recommendation)
3. [Directory Structure](#directory-structure)
4. [Conclusion](#conclusion)
5. [License](#license)
6. [Contact](#contact)

---

## System Architecture Overview

The Hostel Grievance Redressal System is built as a centralized Flask API server that hosts all AI/ML models. This architecture allows different services and applications to interact with the models by sending HTTP requests containing input data and receiving model predictions in response. Each AI/ML functionality is exposed through distinct endpoints, enabling modularity and scalability.

### Key Components

1. **Flask API Server**
   - Central hub for all AI/ML models.
   - RESTful API design for standardized interactions.
   - Authentication and authorization mechanisms.

2. **Model Endpoints**
   - `/api/intelligent-routing` - Endpoint for intelligent routing and workflow automation.
   - `/api/sentiment-analysis` - Endpoint for advanced sentiment and emotional intelligence analysis.
   - `/api/multilingual-translation` - Endpoint for multilingual translation in chatroom.
   - `/api/job-recommendation` - Endpoint for worker job recommendation.

3. **Data Handling and Validation**
   - Input validation using libraries like `pydantic` or `marshmallow`.

4. **Scalability and Deployment**
   - Docker for containerization.

---

## AI/ML Functionalities

### 1. Intelligent Routing and Workflow Automation

**Purpose:** Efficiently assign grievances to the most suitable personnel or department based on various factors.

**Model Design Pipeline:**
- Data Collection: Grievance data, staff data, historical assignments.
- Data Preprocessing: Cleaning, feature engineering, encoding.
- Model Selection: Reinforcement Learning (RL) and Multi-Criteria Decision-Making (MCDM).
- Training and Evaluation: Define environment, implement reward functions, and evaluate using metrics like resolution time.

**API Endpoint:** `https://archcoder-hostel-management-and-greivance-redres-2eeefad.hf.space/api/intelligent-routing`

**Example Input:**
```json
{
  "grievance_id": "G12346",
  "category": "electricity",
  "submission_timestamp": "2023-10-02T08:15:00Z",
  "student_room_no": "204",
  "hostel_name": "bh2",
  "floor_number": 2,
  "current_staff_status": [
    {
      "staff_id": "S67890",
      "department": "electricity",
      "current_workload": 3,
      "availability_status": "Available",
      "past_resolution_rate": 0.95
    },
    {
      "staff_id": "S67891",
      "department": "plumber",
      "current_workload": 2,
      "availability_status": "Available",
      "past_resolution_rate": 0.90
    }
  ],
  "floor_metrics": {
    "number_of_requests": 15,
    "total_delays": 1
  },
  "availability_data": {
    "staff_availability": [
      {
        "staff_id": "S67890",
        "time_slot": "08:00-12:00",
        "availability_status": "Available"
      }
    ],
    "student_availability": [
      {
        "student_id": "STU204",
        "time_slot": "08:00-10:00",
        "availability_status": "Unavailable"
      }
    ]
  }
}
```

**Example Output:**
```json
{
  "job_id": "J12346",
  "assigned_worker_id": "W67890",
  "assignment_timestamp": "2023-10-02T08:16:00Z",
  "expected_resolution_time": "1 hour",
  "location": {
  "grievance_id": "G12346",
  "assigned_staff_id": "S67890",
  ...
}
```

---
### 2. Advanced Sentiment and Emotional Intelligence Analysis

**Purpose:** Detect complex emotional states in grievances to enhance responses from administrators.

**Model Design Pipeline:**
- Data Collection: Grievance texts and emotional labels.
- Data Preprocessing: Text cleaning, tokenization, and normalization.
- Model Selection: Transformer-based models like BERT.

**API Endpoint:** `https://archcoder-hostel-management-and-greivance-redres-2eeefad.hf.space/api/sentiment-analysis`

**Example Input:**
```json
{
  "grievance_id": "G12349",
  "text": "Why hasn't the maintenance team fixed the leaking roof yet?"
}
```

**Example Output:**
```json
{
  "grievance_id": "G12349",
  "predicted_emotional_label": "Anger",
  ...
}
```

---

### 3. Multilingual Translation in Chatroom

**Purpose:** Facilitate communication between residents and workers who speak different languages.

**Model Design Pipeline:**
- Data Collection: Multilingual conversation logs and translation pairs.
- Data Preprocessing: Cleaning, tokenization, and alignment.
- Model Selection: Neural Machine Translation (NMT) models.

**API Endpoint:** `https://archcoder-hostel-management-and-greivance-redres-2eeefad.hf.space/api/multilingual-translation`

**Example Input:**
```json
{
  "user_message": "toilet me paani nahi aa rha hain",
  "source_language": "Hindi",
  "target_language": "English"
}
```

**Example Output:**
```json
{
  "translated_message": "There is no water coming in the toilet."
}
```

---

### 4. Worker Job Recommendation

**Purpose:** Optimize job assignments to workers based on various factors.

**Model Design Pipeline:**
- Data Collection: Job requests, worker profiles, historical assignments.
- Data Preprocessing: Cleaning, feature engineering, encoding.
- Model Selection: Collaborative Filtering and Decision Trees.

**API Endpoint:** `https://archcoder-hostel-management-and-greivance-redres-2eeefad.hf.space/api/job-recommendation`

**Example Input:**
```json
{
  "job_id": "J12346",
  "type": "Electrical",
  "description": "Fan not working in room 204.",
  "urgency_level": "High",
  "submission_timestamp": "2023-10-02T08:15:00Z",
  "hostel_name": "Hostel A",
  "floor_number": 2,
  "room_number": "204"
}
```

**Example Output:**
```json
{
  "job_id": "J12346",
  "assigned_worker_id": "W67890",
  "current_timestamp": "2023-10-02T08:30:00Z",
  "expected_resolution_time": "2023-10-02T10:00:00Z",
  "location": {
    "hostel_name": "Hostel A",
    "floor_number": 2,
    "room_number": "210"
  }
}
```

---

# Directory Structure

```
📁 config
  📄 __init__.py
  📄 config.py
📁 docs
  📄 README.md
  📄 ai_plan.md
  📄 data_plan.md
  📄 plan.md
📁 models
  📁 intelligent_routing
    📁 saved_model
      📄 model.keras
    📁 test_data
      📄 __init__.py
      📄 test_data.json
    📁 test_results
      📄 confusion_matrix.png
      📄 roc_curve.png
      📄 test_report.json
    📁 train_data
      📄 __init__.py
      📄 training_data.json
    📄 generate_data.py
    📄 model.py
    📄 test_model.py
    📄 train.py
  📁 job_recommendation
    📁 saved_model
      📄 model.keras
    📁 test_data
      📄 __init__.py
      📄 test_data.json
    📁 test_results
      📄 test_report.json
    📁 train_data
      📄 __init__.py
      📄 training_data.json
    📄 generate_data.py
    📄 model.py
    📄 test.py
    📄 train.py
  📁 multilingual_translation
    📁 test_data
      📄 __init__.py
      📄 test_data.json
    📁 test_results
      📄 test_report.json
    📁 train_data
      📄 __init__.py
      📄 training_data.json
    📄 model.py
    📄 test_model.py
  📁 sentiment_analysis
    📁 test_data
      📄 __init__.py
      📄 test_data.json
    📁 test_results
      📄 test_report.json
    📁 train_data
      📄 __init__.py
      📄 training_data.json
    📄 model.py
    📄 test_model.py
📁 test_results
  📄 endpoint_test_results.json
📁 utils
  📄 __init__.py
  📄 logger.py
📄 .env
📄 .gitignore
📄 app.py
📄 readme.md
📄 requirements.txt
📄 routes.py
📄 test_endpoints.py
```
---

> To test the application, you can use the `test_endpoints.py` script, which provides a convenient way to verify the functionality of the API endpoints.


## Conclusion

Implementing these AI/ML functionalities will significantly enhance the efficiency and effectiveness of the Hostel Grievance Redressal System. By leveraging advanced technologies and integrating them within a Flask API framework, the system will provide a more responsive, empathetic, and proactive approach to managing resident grievances.

---

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

For any questions or feedback, please contact [imt_2022089@iiitm.ac.in](mailto:imt_2022089@iiitm.ac.in).
