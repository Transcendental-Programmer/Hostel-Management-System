import React, { useEffect, useState } from 'react';
import submitGrievance from "../../../public/submitGrievance.jpeg";
import viewGrievance from "../../../public/viewGrievance.jpeg";
import { useNavigate } from 'react-router-dom';
import { MdAccountCircle } from "react-icons/md";

const StudentHome = () => {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.full_name) {
      setUserName(user.full_name);
    }
  }, []);

  return (
    <div className="md:min-h-[calc(100vh-80px)] min-h-[calc(100vh-64px)] bg-gray-50 flex flex-col justify-center items-center p-4">
      <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-center w-full md:ml-4 lg:mb-10 xl:mb-16 text-gray-700 mb-8">
        Welcome to HostelMate, <span className='text-black'>{userName}</span>
      </h1>
      <div>
        <div className="max-w-4xl justify-center w-full flex flex-col md:flex-row gap-6">
          {/* Left Box */}
          <div className="flex-1 bg-white max-w-32 shadow-xl rounded-lg p-4 flex flex-col items-center relative group">
            {/* Image Placeholder */}
            <img src={viewGrievance} alt="View Grievances" className='max-h-64 mb-4 rounded-lg transition duration-300' />
            {/* Button */}
            <button
              className="absolute bottom-4 w-3/4 py-2 bg-blue-600 text-white font-semibold rounded-lg opacity-100 hover:bg-blue-500 transition duration-300"
              onClick={() => navigate("/my-grievances")}
            >
              View My Grievances
            </button>
          </div>

          {/* Right Box */}
          <div className="flex-1 bg-white shadow-lg rounded-lg p-4 flex flex-col items-center relative group">
            {/* Image Placeholder */}
            <img src={submitGrievance} alt="Submit Grievances" className="max-h-64 mb-4 rounded-lg transition duration-300" />

            {/* Permanent Label */}
            {/* <div className="text-lg font-medium text-gray-700 mb-4">Submit Grievances</div> */}

            {/* Button */}
            <button
              className="absolute bottom-4 w-3/4 py-2 bg-blue-600 text-white font-semibold rounded-lg opacity-100 hover:bg-blue-500 transition duration-300"
              onClick={() => navigate("/submit-grievance")}
            >
              Submit Grievance
            </button>
          </div>

        </div>

        <button className='mt-8 text-2xl w-full rounded-lg flex justify-center items-center gap-2 transition text-white p-6 bg-blue-800 hover:bg-blue-950 '
          onClick={() => navigate("/account")}
        >
          <MdAccountCircle color='white' size={36} />
          <h1>My Profile</h1>
        </button>
      </div>
    </div>
  );
};

export default StudentHome;
