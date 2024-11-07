import Login from "./pages/Login";
import Register from "./pages/Register";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { RoutesPathName } from "./constants";
import PrivateRoute from "./utils/PrivateRoute";
import AccountPage from "./pages/AccountPage";
import Chat from "./components/chat";
import VerifyOTP from "./pages/VerifyOTP"
import GrievanceManagement from "./pages/GrievanceManagement"
import WardenDashboard from "./pages/WardenDashboard";
import ForgotPassword from "./pages/ForgotPassword";
import MyGrievances from "./pages/Student/MyGrievances";
import SubmitGrievance from "./pages/Student/SubmitGrievance";
import GrievanceDetails from "./pages/GrievanceDetails";
import Layout from "./components/Layout";
import StaffDashboard from "./pages/Staff/StaffDashboard";
import StudentHome from "./pages/Student/StudentHome";
import HomePage from "./components/HomePage";

const routes = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,  // This makes HomePage the default component for '/'
        element: <HomePage />,
      },
      {
        path: RoutesPathName.SIGNUP_PAGE,
        // index: true,
        Component: Register,
      },
      {
        path: RoutesPathName.LOGIN_PAGE,
        element: <Login />,
      },
      {
        path: RoutesPathName.FORGOT_PASSWORD,
        element: <ForgotPassword />,
      },
      {
        path: RoutesPathName.ACCOUNT,
        element: <AccountPage />,
      },
      {
        path: RoutesPathName.MY_GRIEVANCES,
        element: <MyGrievances />,
      },
      {
        path: RoutesPathName.SUBMIT_GRIEVANCE,
        element: <SubmitGrievance />,
      },
      {
        path: `${RoutesPathName.GRIEVANCE_DETAILS}/:grievance_id`,
        element: <GrievanceDetails />,
      },
      {
        path: RoutesPathName.CHAT_PAGE, // Define the route for the chat page
        element: <Chat />,
      },
      {
        path: RoutesPathName.VERIFY_OTP,
        element: <VerifyOTP />,
      },
      {
        path: RoutesPathName.GRIEVANCE,
        element: <GrievanceManagement />,
      },
      {
        path: RoutesPathName.WARDEN_DASHBOARD,
        element: <WardenDashboard />,
      },
      {
        path:RoutesPathName.GRIEVANCE_DETAILS,
        element: <GrievanceDetails />,
      },
      {
        path: RoutesPathName.STAFF_DASHBOARD,
        element: <StaffDashboard />,
      },
      {
        path: RoutesPathName.STUDENT_HOME,
        element: <StudentHome />,
      }
    ],
  },
]);

function App() {
  return <RouterProvider router={routes} />;
}

export default App;
