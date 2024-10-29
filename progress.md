
---

## **Hostel Grievance Redressal System - Project Checklist**

### **Frontend Components**

#### **Pages**
1. **Authentication Pages**
   - [ ] Login Page
   - [ ] Signup Page
   - [ ] Forgot Password Page

2. **Student Pages**
   - [ ] Student Dashboard
   - [ ] Student Profile
   - [ ] Submit Grievance
   - [ ] View Grievances List
   - [ ] Grievance Details/Chat
   - [ ] Performance History

3. **Warden Pages**
   - [ ] Warden Dashboard
   - [ ] Manage Grievances
   - [ ] Resolve Grievance
   - [ ] Performance Dashboard
   - [ ] Staff Management

#### **Reusable Components**
1. **Common Components**
   - [ ] Navigation Bar
   - [ ] Sidebar
   - [ ] Footer
   - [ ] Notification System
   - [ ] Loading Spinner
   - [ ] Error Boundary
   - [ ] Modal

2. **Form Components**
   - [ ] Login Form
   - [ ] Signup Form
   - [ ] Profile Form
   - [ ] Grievance Form
   - [ ] Resolution Form

3. **Dashboard Components**
   - [ ] Recent Grievances
   - [ ] Statistics Overview
   - [ ] Quick Submit Button
   - [ ] Performance Metrics
   - [ ] Charts/Graphs

4. **Grievance Components**
   - [ ] Grievance List
   - [ ] Grievance Card
   - [ ] Grievance Details
   - [ ] Grievance Filter
   - [ ] Grievance Search

5. **Chat Components**
   - [ ] Chatroom
   - [ ] Message List
   - [ ] Message Input
   - [ ] Chat Bubble

---

### **Backend Components**

#### **API Routes**
1. **Authentication Routes**
   - [x] POST `/api/auth/login`
   - [x] POST `/api/auth/signup`
   - [ ] POST `/api/auth/forgot-password`
   - [ ] POST `/api/auth/reset-password`

2. **User Routes**
   - [x] GET `/api/users/profile`
   - [x] PUT `/api/users/profile`
   - [ ] GET `/api/users/notifications`

3. **Grievance Routes**
   - [x] POST `/api/grievances`
   - [x] GET `/api/grievances`
   - [x] GET `/api/grievances/:id`
   - [x] PUT `/api/grievances/:id`
   - [x] DELETE `/api/grievances/:id`

4. **Chat Routes**
   - [ ] GET `/api/chat/:grievanceId/messages`
   - [ ] POST `/api/chat/:grievanceId/messages`
   - [ ] PUT `/api/chat/message/:id`

5. **Dashboard Routes**
   - [ ] GET `/api/dashboard/statistics`
   - [ ] GET `/api/dashboard/performance`
   - [ ] GET `/api/dashboard/analytics`

#### **Controllers**
1. **authController**
   - [x] `login()`
   - [x] `signup()`
   - [ ] `forgotPassword()`
   - [ ] `resetPassword()`

2. **userController**
   - [x] `getProfile()`
   - [x] `updateProfile()`
   - [ ] `getNotifications()`

3. **grievanceController**
   - [x] `createGrievance()`
   - [x] `getGrievances()`
   - [x] `getGrievanceById()`
   - [x] `updateGrievance()`
   - [x] `deleteGrievance()`

4. **chatController**
   - [ ] `getMessages()`
   - [ ] `sendMessage()`
   - [ ] `updateMessage()`

5. **dashboardController**
   - [ ] `getStatistics()`
   - [ ] `getPerformanceMetrics()`
   - [ ] `getAnalytics()`

#### **Middleware**
- [ ] `authMiddleware`
- [ ] `errorHandler`
- [ ] `requestValidator`
- [ ] `rateLimiter`
- [ ] `fileUploadMiddleware`

---

#### **Database Schema**
- [x] Database schemas for all major entities:
  - Users (including roles like student, warden)
  - Grievances
  - Notifications
  - Messages (for chat)


---

### **AI/ML Components**
1. **Models** (completed by @priyansh)
   - [X] Model for grievance categorization or sentiment analysis
2. **Deployment** (completed by @priyansh)
   - [X] Deploy AI/ML model

---

### **Tasks in Progress or Pending**
1. **Auth Routes**: Forgot password route is pending.
2. **User Routes**: `getNotifications` function is pending.
3. **Chat Controller**: All functions pending.
4. **Dashboard Controller**: All functions pending.
5. **Middlewares**: All middleware components are pending and will be created in the final phase. 

