# Hostel Grievance Redressal System

## Overview

The Hostel Grievance Redressal System is a web application that facilitates the submission, tracking, and resolution of grievances raised by hostel residents. The system provides a user-friendly interface for residents to report issues and for administrators to efficiently manage and resolve them.

## Features

- **User-friendly Interface**: Simple and intuitive design for easy grievance submission by residents.
  
- **Real-time Updates**: Residents receive real-time updates on the status of their submitted grievances.

- **Admin Dashboard**: An administrative dashboard to manage and prioritize grievances effectively.

- **Chatroom Integration**: Real-time communication channels between workers and complainees. Whenever a complaint is filed, a dedicated chatroom (ticket) is created to facilitate direct interaction and efficient resolution.

- **Multilingual Transcription Services**: Automatically transcribes and translates grievance inputs from any language to ensure clear understanding and effective communication between parties, similar to YouTube's comment translation feature.

- **AI-Powered Grievance Analysis**:
  
  - **Automated Categorization**: Utilizes machine learning algorithms to categorize grievances based on content, ensuring they are directed to the appropriate department or personnel.
  
  - **Sentiment Analysis**: Analyzes the sentiment of complaints to prioritize and address issues with higher urgency or emotional weight.
  
  - **Predictive Resolution Time**: Employs predictive analytics to estimate the time required to resolve each grievance, aiding in efficient workload management and setting realistic expectations for residents.

## Technology Stack

- **Frontend**: Built with React.js for a responsive and dynamic user interface. Styled using Tailwind CSS for a modern look and feel.
  
- **Backend**: Powered by Node.js and Express.js for server-side development.

- **Database**: Utilizes PostgreSQL for reliable and scalable data storage.

- **Real-time Communication**: Integrated using Socket.io to enable live chatrooms between users and administrators.

- **Translation Services**: Implements Google Translate API or similar services for multilingual transcription and translation features.

- **AI/ML Technologies**:
  
  - **Natural Language Processing (NLP)**: Leveraging libraries like TensorFlow.js or spaCy for text analysis and sentiment detection.
  
  - **Machine Learning Models**: Custom models for grievance categorization and predictive analytics using Python-based frameworks such as scikit-learn or TensorFlow.

## Styling with Tailwind CSS

The application's UI is styled using Tailwind CSS.

## Component Library

This project utilizes Component Library Preline, ComponentLand for cards, pages, and other components. 

## Project Preview

### Login Page

![Login Page](./images/login(1).png)

### Signup Page

![Signup Page](./images/signup(2).png)

### Student Dashboard

![Student Dashboard](./images/studentDashboard(3).png)

### Student Profile Info

![Student Profile Info](./images/studentAccountInfo(9).png)

### Student Submitting Complaint

![Student Complaint Submission](./images/createComplaint(4).png)

### Student Dashboard After Submitting Complaint

![Student Complaint](./images/studentComplaint(5).png)

### Warden Dashboard 

![Warden Dashboard](./images/wardenDashboard(6).png)

### Warden Resolves Complaint (Clicking "Not Completed" Changes to "Completed")

![Warden Complaint](./images/wardenResolvedComplaint(7).png)

### Student Dashboard Updated

![Student Dashboard Updated](./images/studentDashboardUpdated(8).png)

### Schema Diagram
    
![Entity Relationship Diagram](./images/hostelDatabaseErDiagram.png)

## Getting Started

To run the Hostel Grievance Redressal System locally:

1. **Clone the repository:**
    ```bash
    git clone [repository_url]
    ```

2. **Navigate to the project directory:**
    ```bash
    cd [project_directory]
    ```

3. **Install dependencies:**
    ```bash
    npm install
    ```

4. **Configure the database:**
    - Set up PostgreSQL and update the database configuration.
    - For backend
      ```bash
      node server.js
      ```
  
5. **Run the application:**
    ```bash
    npm run dev
    ```

## Contributing

Contributions are welcome! 

## AI/ML Functionality Details

### 1. Automated Grievance Categorization
Implement machine learning models to automatically categorize grievances based on their content. This ensures that complaints are directed to the appropriate department or personnel without manual intervention, improving response times and efficiency.

### 2. Sentiment Analysis for Prioritization
Use sentiment analysis to assess the emotional tone of each grievance. Complaints with negative sentiments can be prioritized to ensure that emotionally charged issues are addressed promptly, enhancing resident satisfaction.

### 3. Predictive Resolution Time Estimation
Employ predictive analytics to estimate the time required to resolve each grievance based on historical data and current workload. This feature helps in setting realistic expectations for residents and managing administrative resources effectively.

### 4. Anomaly Detection in Grievance Patterns
Detect unusual patterns or spikes in specific types of grievances using anomaly detection algorithms. Identifying such anomalies early can help in addressing systemic issues before they escalate.

### 5. Voice-to-Text Integration for Complaint Submission
Integrate voice recognition technology to allow residents to submit grievances via voice input, which is then transcribed and processed by the system. This enhances accessibility and convenience for users who prefer speaking over typing.

## Future Enhancements

- **Mobile Application**: Develop a mobile version of the system for on-the-go grievance submission and tracking.
  
- **Integration with Notification Systems**: Implement SMS and email notifications to keep residents informed about the status of their grievances in real-time.

- **Advanced Analytics Dashboard**: Provide administrators with detailed analytics and reporting tools to monitor grievance trends, resolution efficiency, and overall system performance.
