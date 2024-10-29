import Login from "./pages/Login";
import Register from "./pages/Register";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { RoutesPathName } from "./constants";
import PrivateRoute from "./utils/PrivateRoute";
import AccountPage from "./pages/AccountPage";
import Chat from "./components/chat";
import VerifyOTP from "./pages/VerifyOTP"


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
    path: RoutesPathName.ACCOUNT,
    element: <AccountPage />,
  },
  {
    path: RoutesPathName.DASHBOARD_PAGE,
    element: <PrivateRoute />,
  },
  {
    path: RoutesPathName.CHAT_PAGE, // Define the route for the chat page
    element: <Chat />,
  },
  {
    path: RoutesPathName.VERIFY_OTP,
    element: <VerifyOTP />,
  },
]);

function App() {
  return <RouterProvider router={routes} />;
}

export default App;
