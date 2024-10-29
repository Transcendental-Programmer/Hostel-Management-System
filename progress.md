
---

## **Hostel Grievance Redressal System - Project Checklist**

---

### **Task Assignments**

| **Component**              | **Sub-component/Task**                    | **Assigned To**       | **Status** |
|----------------------------|-------------------------------------------|------------------------|------------|
| **Frontend Components**    | **Authentication Pages**                  | Team Frontend          | Pending    |
|                            | Login Page                                | @john                  | [ ]        |
|                            | Signup Page                               | @john                  | [ ]        |
|                            | Forgot Password Page                      | @lily                  | [ ]        |
|                            | **Student Pages**                         | Team Frontend          | Pending    |
|                            | Student Dashboard                         | @lily                  | [ ]        |
|                            | Student Profile                           | @lily                  | [ ]        |
|                            | Submit Grievance                          | @mike                  | [ ]        |
|                            | View Grievances List                      | @mike                  | [ ]        |
|                            | Grievance Details/Chat                    | @alex                  | [ ]        |
|                            | Performance History                       | @alex                  | [ ]        |
|                            | **Warden Pages**                          | Team Frontend          | Pending    |
|                            | Warden Dashboard                          | @mike                  | [ ]        |
|                            | Manage Grievances                         | @mike                  | [ ]        |
|                            | Resolve Grievance                         | @mike                  | [ ]        |
|                            | Performance Dashboard                     | @alex                  | [ ]        |
|                            | Staff Management                          | @alex                  | [ ]        |
|                            | **Reusable Components**                   | Team Frontend          | Pending    |
|                            | Navigation Bar                            | @john                  | [ ]        |
|                            | Sidebar                                   | @john                  | [ ]        |
|                            | Footer                                    | @john                  | [ ]        |
|                            | Notification System                       | @lily                  | [ ]        |
|                            | Loading Spinner                           | @lily                  | [ ]        |
|                            | Error Boundary                            | @alex                  | [ ]        |
|                            | Modal                                     | @alex                  | [ ]        |
|                            | **Form Components**                       | Team Frontend          | Pending    |
|                            | Login Form                                | @john                  | [ ]        |
|                            | Signup Form                               | @john                  | [ ]        |
|                            | Profile Form                              | @lily                  | [ ]        |
|                            | Grievance Form                            | @mike                  | [ ]        |
|                            | Resolution Form                           | @mike                  | [ ]        |
|                            | **Dashboard Components**                  | Team Frontend          | Pending    |
|                            | Recent Grievances                         | @alex                  | [ ]        |
|                            | Statistics Overview                       | @alex                  | [ ]        |
|                            | Quick Submit Button                       | @lily                  | [ ]        |
|                            | Performance Metrics                       | @lily                  | [ ]        |
|                            | Charts/Graphs                             | @alex                  | [ ]        |
|                            | **Grievance Components**                  | Team Frontend          | Pending    |
|                            | Grievance List                            | @mike                  | [ ]        |
|                            | Grievance Card                            | @mike                  | [ ]        |
|                            | Grievance Details                         | @john                  | [ ]        |
|                            | Grievance Filter                          | @john                  | [ ]        |
|                            | Grievance Search                          | @alex                  | [ ]        |
|                            | **Chat Components**                       | Team Frontend          | Pending    |
|                            | Chatroom                                  | @alex                  | [ ]        |
|                            | Message List                              | @alex                  | [ ]        |
|                            | Message Input                             | @lily                  | [ ]        |
|                            | Chat Bubble                               | @lily                  | [ ]        |

---

### **Backend Components**

| **API Routes**            | **Endpoint**                               | **Assigned To**       | **Status** |
|---------------------------|--------------------------------------------|------------------------|------------|
| Authentication Routes     | POST `/api/auth/login`                     | @anna                  | [x]        |
|                           | POST `/api/auth/signup`                    | @anna                  | [x]        |
|                           | POST `/api/auth/forgot-password`           | @matt                  | [ ]        |
|                           | POST `/api/auth/reset-password`            | @matt                  | [ ]        |
| User Routes               | GET `/api/users/profile`                   | @anna                  | [x]        |
|                           | PUT `/api/users/profile`                   | @anna                  | [x]        |
|                           | GET `/api/users/notifications`             | @jane                  | [ ]        |
| Grievance Routes          | POST `/api/grievances`                     | @jane                  | [x]        |
|                           | GET `/api/grievances`                      | @jane                  | [x]        |
|                           | GET `/api/grievances/:id`                  | @jane                  | [x]        |
|                           | PUT `/api/grievances/:id`                  | @jane                  | [x]        |
|                           | DELETE `/api/grievances/:id`               | @jane                  | [x]        |
| Chat Routes               | GET `/api/chat/:grievanceId/messages`      | @matt                  | [ ]        |
|                           | POST `/api/chat/:grievanceId/messages`     | @matt                  | [ ]        |
|                           | PUT `/api/chat/message/:id`                | @matt                  | [ ]        |
| Dashboard Routes          | GET `/api/dashboard/statistics`            | @jane                  | [ ]        |
|                           | GET `/api/dashboard/performance`           | @jane                  | [ ]        |
|                           | GET `/api/dashboard/analytics`             | @jane                  | [ ]        |

| **Controllers**           | **Method**                                 | **Assigned To**       | **Status** |
|---------------------------|--------------------------------------------|------------------------|------------|
| authController            | login()                                    | @anna                  | [x]        |
|                           | signup()                                   | @anna                  | [x]        |
|                           | forgotPassword()                           | @matt                  | [ ]        |
|                           | resetPassword()                            | @matt                  | [ ]        |
| userController            | getProfile()                               | @anna                  | [x]        |
|                           | updateProfile()                            | @anna                  | [x]        |
|                           | getNotifications()                         | @jane                  | [ ]        |
| grievanceController       | createGrievance()                          | @jane                  | [x]        |
|                           | getGrievances()                            | @jane                  | [x]        |
|                           | getGrievanceById()                         | @jane                  | [x]        |
|                           | updateGrievance()                          | @jane                  | [x]        |
|                           | deleteGrievance()                          | @jane                  | [x]        |
| chatController            | getMessages()                              | @matt                  | [ ]        |
|                           | sendMessage()                              | @matt                  | [ ]        |
|                           | updateMessage()                            | @matt                  | [ ]        |
| dashboardController       | getStatistics()                            | @jane                  | [ ]        |
|                           | getPerformanceMetrics()                    | @jane                  | [ ]        |
|                           | getAnalytics()                             | @jane                  | [ ]        |

---

