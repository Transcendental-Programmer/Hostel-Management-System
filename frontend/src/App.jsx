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
const routes = createBrowserRouter([
  {
    path: RoutesPathName.SIGNUP_PAGE,
    index: true,
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
]);

function App() {
  return <RouterProvider router={routes} />;
}

export default App;
