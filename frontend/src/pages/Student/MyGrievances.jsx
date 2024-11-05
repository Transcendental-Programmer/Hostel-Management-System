import React, { useState, useEffect } from "react";
import GrievanceCard from "../../components/GrievanceCard";
import { toast } from "react-toastify";
import { useAuth } from "../../utils/Auth";
import { Navigate } from "react-router-dom";

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };
  return new Intl.DateTimeFormat("en-US", options).format(date);
};


const user_role = localStorage.getItem("user_role");

const formatTimestamp1 = (timestamp) => {
  const date = new Date(timestamp);
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return new Intl.DateTimeFormat("en-US", options).format(date);
};

const MyGrievances = () => {
  const [grievances, setGrievances] = useState([]);
  const { authToken, headers } = useAuth();
  if(!authToken){
    toast.error("You need to be logged in to view this page.");
    console.log("You need to be logged in to view this page.");
    return <Navigate to="/login" />;
  }
  else if(user_role !== "student"){
    toast.error("You need to be a student to view this page.");
    console.log("You need to be a student to view this page.");
    return <Navigate to="/login" />;
  }

  const getGrievances = async (e) => {
    try {
      const user_id = JSON.parse(localStorage.getItem("user")).user_id;
      const response = await fetch(`http://localhost:3000/grievances/${user_id}`, {
        method: "GET",
        headers: headers,
      });
      const jsonData = await response.json();

      setGrievances(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getGrievances();
  }, []);

  return (
    <>
      <div className="bg-gray-100 p-4 py-8 sm:p-8 md:p-10 h-screen">
        <h1 className="text-2xl font-bold mt-20 mb-8">Grievances</h1>
        {grievances.length === 0 ? (
          <p className="ml-4 mt-2 text-gray-600 text-xl">
            No grievances registered yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {grievances.map((grievance) => (
              <GrievanceCard key={grievance._id} grievance={grievance} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default MyGrievances;
