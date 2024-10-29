

## **Hostel Grievance Redressal System - Project Checklist**

---

### **Task Assignments**

#### **Frontend Team: @yash, @dhakad**

| **Component**              | **Sub-component/Task**                    | **Assigned To**       | **Status** |
|----------------------------|-------------------------------------------|------------------------|------------|
| **Frontend Components**    | **Authentication Pages**                  |                        | Pending    |
|                            | Login Page                                | @yash                  | [ ]        |
|                            | Signup Page                               | @dhakad                | [ ]        |
|                            | Forgot Password Page                      | @yash                  | [ ]        |
|                            | **Student Pages**                         |                        | Pending    |
|                            | Student Dashboard                         | @dhakad                | [ ]        |
|                            | Student Profile                           | @yash                  | [ ]        |
|                            | Submit Grievance                          | @dhakad                | [ ]        |
|                            | View Grievances List                      | @yash                  | [ ]        |
|                            | Grievance Details/Chat                    | @dhakad                | [ ]        |
|                            | Performance History                       | @yash                  | [ ]        |
|                            | **Warden Pages**                          |                        | Pending    |
|                            | Warden Dashboard                          | @dhakad                | [ ]        |
|                            | Manage Grievances                         | @yash                  | [ ]        |
|                            | Resolve Grievance                         | @dhakad                | [ ]        |
|                            | Performance Dashboard                     | @yash                  | [ ]        |
|                            | Staff Management                          | @dhakad                | [ ]        |
|                            | **Reusable Components**                   |                        | Pending    |
|                            | Navigation Bar                            | @yash                  | [ ]        |
|                            | Sidebar                                   | @dhakad                | [ ]        |
|                            | Footer                                    | @yash                  | [ ]        |
|                            | Notification System                       | @dhakad                | [ ]        |
|                            | Loading Spinner                           | @yash                  | [ ]        |
|                            | Error Boundary                            | @dhakad                | [ ]        |
|                            | Modal                                     | @yash                  | [ ]        |
|                            | **Form Components**                       |                        | Pending    |
|                            | Login Form                                | @dhakad                | [ ]        |
|                            | Signup Form                               | @yash                  | [ ]        |
|                            | Profile Form                              | @dhakad                | [ ]        |
|                            | Grievance Form                            | @yash                  | [ ]        |
|                            | Resolution Form                           | @dhakad                | [ ]        |
|                            | **Dashboard Components**                  |                        | Pending    |
|                            | Recent Grievances                         | @yash                  | [ ]        |
|                            | Statistics Overview                       | @dhakad                | [ ]        |
|                            | Quick Submit Button                       | @yash                  | [ ]        |
|                            | Performance Metrics                       | @dhakad                | [ ]        |
|                            | Charts/Graphs                             | @yash                  | [ ]        |
|                            | **Grievance Components**                  |                        | Pending    |
|                            | Grievance List                            | @dhakad                | [ ]        |
|                            | Grievance Card                            | @yash                  | [ ]        |
|                            | Grievance Details                         | @dhakad                | [ ]        |
|                            | Grievance Filter                          | @yash                  | [ ]        |
|                            | Grievance Search                          | @dhakad                | [ ]        |
|                            | **Chat Components**                       |                        | Pending    |
|                            | Chatroom                                  | @yash                  | [ ]        |
|                            | Message List                              | @dhakad                | [ ]        |
|                            | Message Input                             | @yash                  | [ ]        |
|                            | Chat Bubble                               | @dhakad                | [ ]        |

---

#### **Backend Team: @ankesh, @shreshtha**

| **API Routes**             | **Endpoint**                              | **Assigned To**       | **Status** |
|----------------------------|-------------------------------------------|------------------------|------------|
| Authentication Routes      | POST `/api/auth/login`                    | @ankesh                | [x]        |
|                            | POST `/api/auth/signup`                   | @ankesh                | [x]        |
|                            | POST `/api/auth/forgot-password`          | @shreshtha             | [ ]        |
|                            | POST `/api/auth/reset-password`           | @shreshtha             | [ ]        |
| User Routes                | GET `/api/users/profile`                  | @shreshtha             | [x]        |
|                            | PUT `/api/users/profile`                  | @shreshtha             | [x]        |
|                            | GET `/api/users/notifications`            | @shreshtha             | [ ]        |
| Grievance Routes           | POST `/api/grievances`                    | @ankesh                | [x]        |
|                            | GET `/api/grievances`                     | @ankesh                | [x]        |
|                            | GET `/api/grievances/:id`                 | @ankesh                | [x]        |
|                            | PUT `/api/grievances/:id`                 | @ankesh                | [x]        |
|                            | DELETE `/api/grievances/:id`              | @ankesh                | [x]        |
| Chat Routes                | GET `/api/chat/:grievanceId/messages`     | @shreshtha             | [ ]        |
|                            | POST `/api/chat/:grievanceId/messages`    | @shreshtha             | [ ]        |
|                            | PUT `/api/chat/message/:id`               | @shreshtha             | [ ]        |
| Dashboard Routes           | GET `/api/dashboard/statistics`           | @ankesh                | [ ]        |
|                            | GET `/api/dashboard/performance`          | @ankesh                | [ ]        |
|                            | GET `/api/dashboard/analytics`            | @ankesh                | [ ]        |

| **Controllers**            | **Method**                                | **Assigned To**       | **Status** |
|----------------------------|-------------------------------------------|------------------------|------------|
| authController             | login()                                   | @shreshtha             | [x]        |
|                            | signup()                                  | @shreshtha             | [x]        |
|                            | forgotPassword()                          | @shreshtha             | [ ]        |
|                            | resetPassword()                           | @shreshtha             | [ ]        |
| userController             | getProfile()                              | @shreshtha             | [x]        |
|                            | updateProfile()                           | @shreshtha             | [x]        |
|                            | getNotifications()                        | @shreshtha             | [ ]        |
| grievanceController        | createGrievance()                         | @ankesh                | [x]        |
|                            | getGrievances()                           | @ankesh                | [x]        |
|                            | getGrievanceById()                        | @ankesh                | [x]        |
|                            | updateGrievance()                         | @ankesh                | [x]        |
|                            | deleteGrievance()                         | @ankesh                | [x]        |
| chatController             | getMessages()                             | @shreshtha             | [ ]        |
|                            | sendMessage()                             | @shreshtha             | [ ]        |
|                            | updateMessage()                           | @shreshtha             | [ ]        |
| dashboardController        | getStatistics()                           | @ankesh                | [ ]        |
|                            | getPerformanceMetrics()                   | @ankesh                | [ ]        |
|                            | getAnalytics()                            | @ankesh                | [ ]        |

---

#### **AI Team: @priyansh**

| **AI/ML Components**       | **Task**                                  | **Assigned To**       | **Status** |
|----------------------------|-------------------------------------------|------------------------|------------|
| Models                     | Model for grievance categorization or sentiment analysis | @priyansh             | [X]        |
| Deployment                 | Deploy AI/ML model                        | @priyansh              | [X]        |

---
