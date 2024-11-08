import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import { useAuth } from "../utils/Auth";
import { Link ,useNavigate} from "react-router-dom";

function AccountPage() {
  const { headers } = useAuth();
  const [userName, setUserName] = useState("");
  const [useremail, setemail] = useState("");
  const [userphone, setphone] = useState("");
  const [userUsername, setUsername] = useState("");
  const [userRoom, setRoom] = useState("");
  const [userRollno, setRollno] = useState("");
  const [userHostel, setHostel] = useState("");
  const [userType, setUserType] = useState(null);
  const navigate  = useNavigate();
  const ROLE_PATHS = {
    STAFF: "/staff-dashboard",
    STUDENT: "/student-home",
    WARDEN: "/warden-dashboard",
    ADMIN: "/warden-dashboard"
  };
  // Function to handle navigation based on role
  const token = localStorage.getItem("jwtToken");
  const userRole = localStorage.getItem("user_role");
  const handleBackNavigation = () => {
    if (token && userRole) {
      const roleKey = userRole.toUpperCase();
      const path = ROLE_PATHS[roleKey];
      if (path) {
        navigate(path);
      } else {
        // Default path if role does not match
        navigate("/");
      }
    } else {
      // Navigate to default path if no token or role
      navigate("/");
    }
  };
  useEffect(() => {
    const storedUserDetails = JSON.parse(localStorage.getItem("user"));
    if (storedUserDetails) {
      setUserName(storedUserDetails.full_name || "");
      setemail(storedUserDetails.email || "");
      setphone(storedUserDetails.phone_number || "");
      setUsername(storedUserDetails.username || "");
      setRoom(storedUserDetails.room_number || "");
      setRollno(storedUserDetails.roll_number || "");
      setHostel(storedUserDetails.hostel_number || "");
    }

    const storedUserType = localStorage.getItem("user_role");
    if (storedUserType) {
      setUserType(storedUserType); 
    }
  }, []);

  return (
    <>
      <Navbar />
      <h2 className="mt-20 ml-5 mr-5 text-2xl font-semibold">Profile</h2>

      <ul className="mt-6 flex flex-col ml-5 mr-5 ">
        <li className="lg:w-1/3 sm:w-full inline-flex items-center gap-x-2 py-3 px-4 text-sm border text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg">
          <div className="flex items-center justify-between w-full">
            <span>Name</span>
            <span>{userName}</span>
          </div>
        </li>
        <li className="lg:w-1/3 sm:w-full inline-flex items-center gap-x-2 py-3 px-4 text-sm border text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg">
          <div className="flex items-center justify-between w-full">
            <span>Email</span>
            <span>{useremail}</span>
          </div>
        </li>
        <li className="lg:w-1/3 sm:w-full inline-flex items-center gap-x-2 py-3 px-4 text-sm border text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg">
          <div className="flex items-center justify-between w-full">
            <span>Phone</span>
            <span>{userphone}</span>
          </div>
        </li>
        
        {(userType === "student" || userType === "warden" || userType === "staff" || userType === "admin") && (
          <>
            <li className="lg:w-1/3 sm:w-full inline-flex items-center gap-x-2 py-3 px-4 text-sm border text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg">
              <div className="flex items-center justify-between w-full">
                <span>Username</span>
                <span>{userUsername}</span>
              </div>
            </li>
            <li className="lg:w-1/3 sm:w-full inline-flex items-center gap-x-2 py-3 px-4 text-sm border text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg">
              <div className="flex items-center justify-between w-full">
                <span>Hostel</span>
                <span>{userHostel}</span>
              </div>
            </li>
          </>
        )}

        {userType === "student" && (
          <>
            <li className="lg:w-1/3 sm:w-full inline-flex items-center gap-x-2 py-3 px-4 text-sm border text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg">
              <div className="flex items-center justify-between w-full">
                <span>Roll no.</span>
                <span>{userRollno}</span>
              </div>
            </li>
            <li className="lg:w-1/3 sm:w-full inline-flex items-center gap-x-2 py-3 px-4 text-sm border text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg">
              <div className="flex items-center justify-between w-full">
                <span>Room</span>
                <span>{userRoom}</span>
              </div>
            </li>
          </>
        )}
      </ul>
      <button className="mt-5 ml-5 relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800" 
      onClick={handleBackNavigation}
      >
        
        {/* <Link
          class=" relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-blue-500 rounded-md group-hover:bg-opacity-0"
          to="/"
        > */}
          Back
        {/* </Link> */}
      </button>
    </>
  );
}

export default AccountPage;
