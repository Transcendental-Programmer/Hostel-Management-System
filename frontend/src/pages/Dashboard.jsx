import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import MyGrievances from "./Student/MyGrievances";
import WardenComplaints from "./WardenComplaint";
import { GetAuthHeader } from "../testing/Headers";

function Dashboard() {
  const [user_role, setUser_role] = useState(localStorage.getItem("user")?.user_role||null);
  useEffect(() => {
   
    const fetchUser_role = async () => {
      const user_role = localStorage.getItem("user_role");
      console.log(user_role);
      if(!user_role){
        console.log("User not logged in");
      }
        setUser_role(user_role);
        console.log(user_role);
    };

    fetchUser_role();
  }, []); 

  return (
    <>
      <Navbar />
      {user_role === "student" ? (
        <MyGrievances />
      ) : user_role === "warden" ? (
        <WardenComplaints />
      ) : null}
    </>
  );
}

export default Dashboard;
