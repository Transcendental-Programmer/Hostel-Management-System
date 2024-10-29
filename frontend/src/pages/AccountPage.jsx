import Navbar from "./Navbar";
import { useState, useEffect } from "react";
import { useAuth } from "../utils/Auth";
import { Link } from "react-router-dom";

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

  useEffect(() => {
    const fetchUserType = async () => {
      try {
        const response = await fetch("http://localhost:3000/userType", {
          method: "GET",
          headers: headers,
        });

        if (response.ok) {
          const data = await response.json();
          setUserType(data.userType);
          console.log(data.userType);
        } else {
          console.error("Failed to fetch user type");
        }
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchUserType();
  }, []);

  const getuserDetails = async (user_id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/userDetails/${user_id}`,
        {
          method: "GET",
          headers: headers,
        }
      );
      const data = await response.json();
      console.log(data);
      setUserName(data[0].full_name);
      setemail(data[0].email);
      setphone(data[0].phone);
      setUsername(data[0].userName);
      setRoom(data[0].room);
      setRollno(data[0].Rollno);
      setHostel(data[0].Hostel);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getuserDetails();
  }, []);

  return (
    <>
      <Navbar />
      <h2 className="mt-20 ml-5 mr-5 text-2xl font-semibold">Profile</h2>

      <ul className="mt-6 flex flex-col ml-5 mr-5 ">
        <li className="lg:w-1/3  sm:w-full inline-flex items-center gap-x-2 py-3 px-4 text-sm border text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg">
          <div className="flex items-center justify-between w-full">
            <span>Name</span>
            <span>{userName}</span>
          </div>
        </li>
        <li className="lg:w-1/3  sm:w-full inline-flex items-center gap-x-2 py-3 px-4 text-sm border text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg">
          <div className="flex items-center justify-between w-full">
            <span>Email</span>
            <span>{useremail}</span>
          </div>
        </li>
        <li className="lg:w-1/3  sm:w-full inline-flex items-center gap-x-2 py-3 px-4 text-sm border text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg">
          <div className="flex items-center justify-between w-full">
            <span>Phone</span>
            <span>{userphone}</span>
          </div>
        </li>
        {userType !== "warden" && (
          <>
            <li className="lg:w-1/3  sm:w-full inline-flex items-center gap-x-2 py-3 px-4 text-sm border text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg">
              <div className="flex items-center justify-between w-full">
                <span>Username</span>
                <span>{userUsername}</span>
              </div>
            </li>
            <li className="lg:w-1/3  sm:w-full inline-flex items-center gap-x-2 py-3 px-4 text-sm border text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg">
              <div className="flex items-center justify-between w-full">
                <span>Roll no.</span>
                <span>{userRollno}</span>
              </div>
            </li>
            <li className="lg:w-1/3  sm:w-full inline-flex items-center gap-x-2 py-3 px-4 text-sm border text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg">
              <div className="flex items-center justify-between w-full">
                <span>Hostel</span>
                <span>{userHostel}</span>
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
      <button class="mt-5 ml-5 relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800">
        <Link
          class=" relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-blue-500 rounded-md group-hover:bg-opacity-0"
          to="/"
        >
          Back
        </Link>
      </button>
    </>
  );
}

export default AccountPage;
