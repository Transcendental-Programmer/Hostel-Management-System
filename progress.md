

## **Hostel Grievance Redressal System - Project Checklist**

---

### **Task Assignments**

#### **Frontend Team: @yash, @dhakad**

| **Component**              | **Sub-component/Task**                    | **Assigned To**       | **Status** |
|----------------------------|-------------------------------------------|------------------------|------------|
| **Frontend Components**    | **Authentication Pages**                  |                        | Pending    |
|                            | Login Page                                | @dhakd                  | [X]        |
|                            | Signup Page                               | @dhakad                | [X]        |
|                            | Forgot Password Page                      | @dhakad                 | [x ]        |
|                            | **Student Pages**                         |                        | Pending    |
|                            | Student Dashboard                         | @dhakad                | [ ]        |
|                            | Student Profile                           | @dhakad                | [ ]        |
|                            | Submit Grievance                          | @dhakad                | [ ]        |
|                            | View Grievances List                      | @dhakad                  | [ ]        |
|                            | Grievance Details/Chat                    | @dhakad                | [ ]        |
|                            | Performance History                       | @dhakad                  | [ ]        |
|                            | **Warden Pages**                          |                        | Pending    |
|                            | Warden Dashboard                          | @dhakad                | [ x]        |
|                            | Manage Grievances                         | @dhakad                  | [x ]        |
|                            | Resolve Grievance                         | @dhakad                | [x ]        |
|                            | Performance Dashboard                     | @dhakad                  | [x ]        |
|                            | Staff Management                          | @dhakad                | [x ]        |
|                            | **Reusable Components**                   |                        | Pending    |
|                            | Navigation Bar                            | @yash                  | [ ]        |
|                            | Sidebar                                   | @yash                | [ ]        |
|                            | Footer                                    | @yash                  | [ ]        |
|                            | Notification System                       | @yash               | [ ]        |
|                            | Loading Spinner                           | @yash                  | [ ]        |
|                            | Error Boundary                            | @yash                | [ ]        |
|                            | Modal                                     | @yash                  | [ ]        |
|                            | **Form Components**                       |                        | Pending    |
|                            | Login Form                                | @dhakad                | [X]        |
|                            | Signup Form                               | @dhakad                  | [X]        |
|                            | Profile Form                              | @yash                | [ ]        |
|                            | Grievance Form                            | @yash                  | [ ]        |
|                            | Resolution Form                           | @yash                | [ ]        |
|                            | **Dashboard Components**                  |                        | Pending    |
|                            | Recent Grievances                         | @dhakad                  | [ ]        |
|                            | Statistics Overview                       | @dhakad                | [ ]        |
|                            | Quick Submit Button                       | @dhakad                  | [ ]        |
|                            | Performance Metrics                       | @dhakad                | [ ]        |
|                            | Charts/Graphs                             | @dhakad                  | [ ]        |
|                            | **Grievance Components**                  |                        | Pending    |
|                            | Grievance List                            | @dhakad               | [ x]        |
|                            | Grievance Card                            | @dhakad                  | [ x]        |
|                            | Grievance Details                         |@dhakad | [x ]        |
|                            | Grievance Filter                          | @dhakad                | [ x]        |
|                            | Grievance Search                          | @dhakad               | [ x]        |
|                            | **Chat Components**                       |                        | Pending    |
|                            | Chatroom                                  | @yash                  | [ ]        |
|                            | Message List                              | @yash                | [ ]        |
|                            | Message Input                             | @yash                 | [ ]        |
|                            | Chat Bubble                               | @yash               | [ ]        |

---

#### **Backend Team: @ankesh, @shreshtha**

| **API Routes**             | **Endpoint**                              | **Assigned To**       | **Status** |
|----------------------------|-------------------------------------------|------------------------|------------|
| Authentication Routes      | POST `/api/auth/login`                    | @shreshtha                | [x]        |
|                            | POST `/api/auth/signup`                   | @shreshtha                | [x]        |
|                            | POST `/api/auth/forgot-password`          | @shreshtha             | [x]        |
|                            | POST `/api/auth/reset-password`           | @shreshtha             | [x]        |
| User Routes                | GET `/api/users/profile`                  | @shreshtha             | [x]        |
|                            | PUT `/api/users/profile`                  | @shreshtha             | [x]        |
|                            | GET `/api/users/notifications`            | @shreshtha             | [ ]        |
| Grievance Routes           | POST `/api/grievances`                    | @ankesh                | [x]        |
|                            | GET `/api/grievances`                     | @ankesh                | [x]        |
|                            | GET `/api/grievances/:id`                 | @ankesh                | [x]        |
|                            | PUT `/api/grievances/:id`                 | @ankesh                | [x]        |
|                            | DELETE `/api/grievances/:id`              | @ankesh                | [x]        |
| Chat Routes                | GET `/api/chat/:grievanceId/messages`     | @shreshtha             | [x]        |
|                            | POST `/api/chat/:grievanceId/messages`    | @shreshtha             | [x]        |
|                            | POST `/api/chat/createChatroom`           | @shreshtha             | [x]        |
|                            | PUT `/api/chat/message/:id` (rejected)    | @shreshtha             | [x]        |
| Dashboard Routes           | GET `/api/dashboard/statistics`           | @ankesh                | [ ]        |
|                            | GET `/api/dashboard/performance`          | @ankesh                | [ ]        |
|                            | GET `/api/dashboard/analytics`            | @ankesh                | [ ]        |

| **Controllers**            | **Method**                                | **Assigned To**       | **Status** |
|----------------------------|-------------------------------------------|------------------------|------------|
| authController             | login()                                   | @shreshtha             | [x]        |
|                            | signup()                                  | @shreshtha             | [x]        |
|                            | forgotPassword()                          | @shreshtha             | [x]        |
|                            | resetPassword()                           | @shreshtha             | [x]        |
| userController             | getProfile()                              | @shreshtha             | [x]        |
|                            | updateProfile()                           | @shreshtha             | [x]        |
|                            | getNotifications()                        | @shreshtha             | [ ]        |
| grievanceController        | createGrievance()                         | @ankesh                | [x]        |
|                            | getGrievances()                           | @ankesh                | [x]        |
|                            | getGrievanceById()                        | @ankesh                | [x]        |
|                            | updateGrievance()                         | @ankesh                | [x]        |
|                            | deleteGrievance()                         | @ankesh                | [x]        |
| chatController             | getMessages()                             | @shreshtha             | [x]        |
|                            | sendMessage()                             | @shreshtha             | [x]        |
|                            | createChatroom()                          | @shreshtha             | [x]        |
|                            | updateMessage()      (rejected)           | @shreshtha             | [x]        |
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
