#!/bin/bash

# Create the main data directory
mkdir -p data

# Function to create directory and files with sample data
create_directory_and_files() {
    local dir=$1
    shift
    mkdir -p "data/$dir"
    while [ "$#" -ge 3 ]; do
        echo "$2" > "data/$dir/$1"
        echo "$3" >> "data/$dir/$1"
        shift 3
    done
}

# Intelligent Routing
create_directory_and_files "intelligent_routing" \
    "grievances.csv" "grievance_id,category,description,urgency_level,submission_timestamp,student_room_no,hostel_name,floor_number" "G12345,Maintenance,Leaky faucet in the bathroom,High,2023-10-01T10:30:00Z,204,Hostel A,2" \
    "staff.csv" "staff_id,expertise,current_workload,availability_status,past_resolution_rate" "S67890,\"Plumbing,Electrical\",5,Available,0.95" \
    "historical_assignments.csv" "grievance_id,staff_id,assignment_timestamp,resolution_time,outcome,floor_number" "G12340,S67885,2023-09-25T09:00:00Z,2 hours,Resolved Successfully,1" \
    "floor_metrics.csv" "hostel_name,floor_number,date,number_of_requests,average_urgency_level,total_delays" "Hostel A,2,2023-10-01,20,3.5,2" \
    "availability.csv" "id,type,date,time_slot,availability_status" "S67890,staff,2023-10-02,09:00-12:00,Available"

# Sentiment Analysis
create_directory_and_files "sentiment_analysis" \
    "grievance_sentiment.csv" "grievance_id,text,emotional_label" "G12347,\"I am extremely frustrated with the constant power outages in my room.\",Frustration"

# Chatbot
create_directory_and_files "chatbot" \
    "conversations.csv" "conversation_id,user_message,intent,entities,bot_response" "C12345,\"I want to report a broken heater in my room.\",submit_grievance,'{\"grievance_type\": \"Broken Heater\", \"room_number\": \"305\"}',\"I'm sorry to hear that. Could you please provide your room number?\"" \
    "faqs.csv" "question_id,question,answer" "Q12345,\"How can I check the status of my grievance?\",\"You can check the status by logging into your dashboard and navigating to the 'My Grievances' section.\""

# Anomaly Detection
create_directory_and_files "anomaly_detection" \
    "grievance_logs.csv" "grievance_id,category,timestamp,description" "G12350,Plumbing,2023-10-03T14:20:00Z,\"Clogged drain in the kitchen area.\"" \
    "anomaly_indicators.csv" "date,category,grievance_count,is_anomaly" "2023-10-01,Electrical,50,false"

# Multilingual Translation
create_directory_and_files "multilingual_translation" \
    "translation_pairs.csv" "pair_id,source_language,target_language,source_sentence,target_sentence" "TP12345,Hindi,English,\"toilet me paani nahi aa rha hain\",\"There is no water coming in the toilet.\"" \
    "language_preferences.csv" "user_id,preferred_language" "U12345,Hindi"

# Job Recommendation
create_directory_and_files "job_recommendation" \
    "job_requests.csv" "job_id,type,description,urgency_level,submission_timestamp,hostel_name,floor_number,room_number" "J12345,Electrical,\"Fan not working in room 204.\",High,2023-10-02T08:15:00Z,Hostel A,2,204" \
    "worker_profiles.csv" "worker_id,department,current_workload,availability_status,job_success_rate" "W67890,Electrical,3,Available,0.95" \
    "historical_job_assignments.csv" "job_id,worker_id,assignment_timestamp,resolution_time,outcome,hostel_name,floor_number,room_number" "J12340,W67885,2023-09-25T09:00:00Z,2 hours,Resolved Successfully,Hostel A,1,101" \
    "worker_locations.csv" "worker_id,timestamp,hostel_name,floor_number,room_number" "W67890,2023-10-02T08:00:00Z,Hostel A,2,210"

echo "Data folder structure and CSV files with sample data have been created successfully."

