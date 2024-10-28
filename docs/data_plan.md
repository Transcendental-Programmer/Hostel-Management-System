# Dataset Plan for AI/ML Models

This document outlines the datasets required for implementing the AI/ML functionalities described in the ai_plan.md file. For each model, we'll provide the CSV structure and example records.

## 1. Intelligent Routing and Workflow Automation

### 1.1 Grievance Data (grievances.csv)

Fields:
- grievance_id (string)
- category (string)
- submission_timestamp (datetime)
- student_room_no (string)
- hostel_name (string)
- floor_number (integer)

Examples:
```csv
grievance_id,category,submission_timestamp,student_room_no,hostel_name,floor_number
G12345,plumber,2023-10-01T10:30:00Z,204,bh1,2
G12346,electricity,2023-10-02T08:15:00Z,101,bh2,1
G12347,internet,2023-10-03T14:20:00Z,305,bh3,3
G12348,water cooler,2023-10-04T09:45:00Z,102,ivh,1
G12349,sweeper,2023-10-05T11:00:00Z,201,gh,2
G12350,carpenter,2023-10-06T13:30:00Z,303,bh1,3
```

### 1.2 Staff Data (staff.csv)

Fields:
- staff_id (string)
- department (string)
- current_workload (integer)
- availability_status (string)
- past_resolution_rate (float)

Examples:
```csv
staff_id,department,current_workload,availability_status,past_resolution_rate
S67890,plumber,5,Available,0.95
S67891,electricity,3,Available,0.92
S67892,internet,4,Unavailable,0.88
S67893,water cooler,2,Available,0.97
S67894,sweeper,6,Available,0.91
S67895,carpenter,1,Available,0.94
```

### 1.3 Historical Assignments (historical_assignments.csv)

Fields:
- grievance_id (string)
- staff_id (string)
- assignment_timestamp (datetime)
- resolution_time (string)
- outcome (string)
- floor_number (integer)

Examples:
```csv
grievance_id,staff_id,assignment_timestamp,resolution_time,outcome,floor_number
G12340,S67890,2023-09-25T09:00:00Z,2 hours,Resolved Successfully,1
G12341,S67891,2023-09-26T10:30:00Z,1 hour,Resolved Successfully,2
G12342,S67892,2023-09-27T14:15:00Z,3 hours,Unresolved,3
G12343,S67893,2023-09-28T11:45:00Z,30 minutes,Resolved Successfully,1
G12344,S67894,2023-09-29T08:30:00Z,1 hour,Resolved Successfully,2
G12345,S67895,2023-09-30T13:00:00Z,2 hours,Pending,3
```

### 1.4 Floor Metrics (floor_metrics.csv)

Fields:
- hostel_name (string)
- floor_number (integer)
- date (date)
- number_of_requests (integer)
- total_delays (integer)

Examples:
```csv
hostel_name,floor_number,date,number_of_requests,total_delays
bh1,2,2023-10-01,20,2
bh2,1,2023-10-02,15,1
bh3,3,2023-10-03,18,3
ivh,1,2023-10-04,12,0
gh,2,2023-10-05,22,4
```

### 1.5 Availability Data (availability.csv)

Fields:
- id (string)
- type (string) # 'staff' or 'student'
- date (date)
- time_slot (string)
- availability_status (string)

Examples:
```csv
id,type,date,time_slot,availability_status
S67890,staff,2023-10-02,09:00-12:00,Available
S67891,staff,2023-10-02,14:00-17:00,Unavailable
STU123,student,2023-10-02,10:00-12:00,Available
STU124,student,2023-10-02,14:00-16:00,Unavailable
S67892,staff,2023-10-03,08:00-11:00,Available
STU125,student,2023-10-03,09:00-11:00,Available
```

## 2. Advanced Sentiment and Emotional Intelligence Analysis

### 2.1 Grievance Sentiment Data (grievance_sentiment.csv)

Fields:
- grievance_id (string)
- text (string)
- emotional_label (string)

Example:
```csv
grievance_id,text,emotional_label
G12347,"I am extremely frustrated with the constant power outages in my room.",Frustration
G12348,"Thank you for resolving my issue so quickly.",Satisfaction
```

## 3. Context-Aware Chatbots for Initial Grievance Handling

### 3.1 Conversation Dataset (conversations.csv)

Fields:
- conversation_id (string)
- user_message (string)
- intent (string)
- entities (string, JSON format)
- bot_response (string)

Example:
```csv
conversation_id,user_message,intent,entities,bot_response
C12345,"I want to report a broken heater in my room.",submit_grievance,"{'grievance_type': 'Broken Heater', 'room_number': '305'}","I'm sorry to hear that. Could you please provide your room number?"
```

### 3.2 FAQs Dataset (faqs.csv)

Fields:
- question_id (string)
- question (string)
- answer (string)

Example:
```csv
question_id,question,answer
Q12345,"How can I check the status of my grievance?","You can check the status by logging into your dashboard and navigating to the 'My Grievances' section."
```

## 4. Anomaly Detection in Grievance Patterns

### 4.1 Grievance Logs (grievance_logs.csv)

Fields:
- grievance_id (string)
- category (string)
- timestamp (datetime)
- description (string)

Example:
```csv
grievance_id,category,timestamp,description
G12350,Plumbing,2023-10-03T14:20:00Z,"Clogged drain in the kitchen area."
```

### 4.2 Anomaly Indicators (anomaly_indicators.csv)

Fields:
- date (date)
- category (string)
- grievance_count (integer)
- is_anomaly (boolean)

Example:
```csv
date,category,grievance_count,is_anomaly
2023-10-01,Electrical,50,false
2023-10-02,Electrical,150,true
```

## 5. Multilingual Translation in Chatroom

### 5.1 Translation Pairs (translation_pairs.csv)

Fields:
- pair_id (string)
- source_language (string)
- target_language (string)
- source_sentence (string)
- target_sentence (string)

Example:
```csv
pair_id,source_language,target_language,source_sentence,target_sentence
TP12345,Hindi,English,"toilet me paani nahi aa rha hain","There is no water coming in the toilet."
```

### 5.2 Language Preferences (language_preferences.csv)

Fields:
- user_id (string)
- preferred_language (string)

Example:
```csv
user_id,preferred_language
U12345,Hindi
W67890,English
```

## 6. Worker Job Recommendation

### 6.1 Job Requests (job_requests.csv)

Fields:
- job_id (string)
- type (string)
- description (string)
- urgency_level (string)
- submission_timestamp (datetime)
- hostel_name (string)
- floor_number (integer)
- room_number (string)

Example:
```csv
job_id,type,description,urgency_level,submission_timestamp,hostel_name,floor_number,room_number
J12345,Electrical,"Fan not working in room 204.",High,2023-10-02T08:15:00Z,Hostel A,2,204
```

### 6.2 Worker Profiles (worker_profiles.csv)

Fields:
- worker_id (string)
- department (string)
- current_workload (integer)
- availability_status (string)
- job_success_rate (float)

Example:
```csv
worker_id,department,current_workload,availability_status,job_success_rate
W67890,Electrical,3,Available,0.95
```

### 6.3 Historical Job Assignments (historical_job_assignments.csv)

Fields:
- job_id (string)
- worker_id (string)
- assignment_timestamp (datetime)
- resolution_time (string)
- outcome (string)
- hostel_name (string)
- floor_number (integer)
- room_number (string)

Example:
```csv
job_id,worker_id,assignment_timestamp,resolution_time,outcome,hostel_name,floor_number,room_number
J12340,W67885,2023-09-25T09:00:00Z,2 hours,Resolved Successfully,Hostel A,1,101
```

### 6.4 Worker Locations (worker_locations.csv)

Fields:
- worker_id (string)
- timestamp (datetime)
- hostel_name (string)
- floor_number (integer)
- room_number (string)

Example:
```csv
worker_id,timestamp,hostel_name,floor_number,room_number
W67890,2023-10-02T08:00:00Z,Hostel A,2,210
```
```
data/
│
├── intelligent_routing/
│   ├── grievances.csv
│   ├── staff.csv
│   ├── historical_assignments.csv
│   ├── floor_metrics.csv
│   └── availability.csv
│
├── sentiment_analysis/
│   └── grievance_sentiment.csv
│
├── chatbot/
│   ├── conversations.csv
│   └── faqs.csv
│
├── anomaly_detection/
│   ├── grievance_logs.csv
│   └── anomaly_indicators.csv
│
├── multilingual_translation/
│   ├── translation_pairs.csv
│   └── language_preferences.csv
│
└── job_recommendation/
    ├── job_requests.csv
    ├── worker_profiles.csv
    ├── historical_job_assignments.csv
    └── worker_locations.csv

```