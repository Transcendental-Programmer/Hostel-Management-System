import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from "../utils/Auth";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import UrgencyLabel from "../components/UrgencyLabel";
import ChatBubble from '../components/ChatBubble';

const GrievanceDetails = () => {
  const { grievance_id } = useParams();
  const navigate = useNavigate();
  const { headers } = useAuth();
  const [grievance, setGrievance] = useState(null);
  const [prevGrievance, setPrevGrievance] = useState(null);
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [chatroomId, setChatroomId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    urgency_level: '',
    items_used: [],
  });

  useEffect(() => {
    const fetchGrievance = async () => {
      if (grievance) {
        return;
      }
      try {
        const response = await fetch(`https://hostelmate-backend-5zcj.onrender.com/grievances/details/${grievance_id}`, {
          method: 'GET',
          headers: headers
        });
        console.log(response);

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setGrievance(data);
          setPrevGrievance(data);
          setFormData({
            title: data.title,
            category: data.category,
            description: data.description,
            urgency_level: data.urgency_level,
            items_used: data.items_used || [],
          });

          const userData = await fetch(`https://hostelmate-backend-5zcj.onrender.com/users/getUserDetailsById/${data.user_id}`, {
            method: 'GET',
            headers: headers
          }
          );
          if (response.ok) {
            const userDataJson = await userData.json();
            console.log(userDataJson);
            setUser(userDataJson);
          } else {
            toast.error("Failed to fetch user details");
          }
          const chatroomResponse = await fetch('https://hostelmate-backend-5zcj.onrender.com/chat/createChatroom', {
            method: 'POST',
            headers: {
              ...headers,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              grievanceId: data.grievance_id,
              studentId: data.user_id,
              staffId: '8986728b-cc0f-4b6f-abd6-93320d5a82b5' // replace with actual staffId
            })
          });
          const chatroomData = await chatroomResponse.json();
          if (chatroomResponse.ok) {
            console.log(chatroomData);
            setChatroomId(chatroomData.chatroom._id);  // Store the chatroom ID
          } else {
            toast.error("Failed to create or fetch chatroom");
          }

        } else {
          toast.error("Failed to fetch grievance details");
        }
      } catch (error) {
        console.error('Failed to fetch grievance:', error);
        toast.error("Error loading grievance details");
      }
    };

    fetchGrievance();
  }, [grievance_id, user]);

  const handleUpdate = async (updatedGrievance) => {
    try {
      const response = await fetch(`https://hostelmate-backend-5zcj.onrender.com/grievances/update/${grievance_id}`, {
        method: 'PUT',
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedGrievance),
      });

      if (response.ok) {
        toast.success("Grievance updated successfully");
        setIsEditing(false);
        const newGrievance = await response.json();
        setGrievance(newGrievance);
      } else {
        toast.error("Failed to update grievance");
      }
    } catch (error) {
      console.error('Error updating grievance:', error);
      toast.error("Error updating grievance");
    }
  };



  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this grievance?")) {
      return;
    }

    try {
      const response = await fetch(`https://hostelmate-backend-5zcj.onrender.com/grievances/delete/${grievance_id}`, {
        method: 'DELETE',
        headers: headers
      });

      if (response.ok) {
        toast.success("Grievance deleted successfully");
        navigate('/dashboard');
      } else {
        toast.error("Failed to delete grievance");
      }
    } catch (error) {
      console.error('Error deleting grievance:', error);
      toast.error("Error deleting grievance");
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);

    // Update the grievance state
    const updatedGrievance = { ...grievance, [name]: name === 'status' ? value.toLowerCase() : value };
    setGrievance(updatedGrievance);

    // If the field being changed is 'status', call handleUpdate with the updated grievance
    if (name === 'status') {
      handleUpdate(updatedGrievance);
    }
  };



  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!grievance) return (
    <>
      <Navbar />
      <div className="mt-20 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    </>
  );

  const handleCancel = () => {
    setGrievance(prevGrievance);
    setIsEditing(false);
  };

  return (
    <>
      {/* <Navbar /> */}
      {chatroomId && <ChatBubble chatroomId={chatroomId} />}
      <div className="container mx-auto my-20 max-w-2xl bg-white p-6 rounded-lg shadow-md">
        <input
          type="text"
          name="title"
          value={grievance.title}
          onChange={(e) => handleChange(e)}
          disabled={!isEditing}
          className={`text-3xl font-semibold text-gray-800 mb-4 w-full bg-transparent border-none 
    ${isEditing
              ? 'focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-text'
              : 'cursor-default'
            } rounded px-2`}
        />
        <p className="text-sm text-gray-500">Submitted on: {formatDate(grievance.submission_timestamp)}</p>
        {user && <p className="text-sm text-gray-500">By:{user.full_name}</p>}

        <div className="mt-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded">
              <label className="font-semibold block mb-2">Category:</label>
              <input
                name="category"
                value={grievance.category}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full p-2 bg-transparent border-none rounded
        ${isEditing
                    ? 'focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-text'
                    : 'cursor-default'}`}
              >
              </input>
            </div>

            <div className="bg-gray-50 p-4 rounded">
              <label className="font-semibold block mb-2">Status:</label>
              <select
                name="status"
                value={grievance.status}
                onChange={handleChange} // Call handleChange directly
                disabled={false}
                className={`w-full p-2 bg-transparent border-none rounded
  ${isEditing
                    ? 'focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-text'
                    : 'cursor-default'}`}
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                {localStorage.getItem('user_role')?.toLowerCase() !== 'staff' && <option value="closed">Closed</option>}
              </select>


            </div>

            <div className="bg-gray-50 p-4 rounded">
              <label className="font-semibold block mb-2">Urgency Level:</label>
              <input
                name="urgency_level"
                value={grievance.urgency_level}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full p-2 bg-transparent border-none rounded
    ${isEditing
                    ? 'focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-text'
                    : 'cursor-default'}`}
              />

            </div>

            <div className="bg-gray-50 p-4 rounded">
              <label className="font-semibold block mb-2">Items Used:</label>
              <input
                type="text"
                name="items_used"
                value={grievance.items_used?.join(', ') || 'None'}
                onChange={(e) => handleChange({
                  target: {
                    name: 'items_used',
                    value: e.target.value.split(',').map(item => item.trim())
                  }
                })}
                disabled={!isEditing}
                className={`w-full p-2 bg-transparent border-none rounded
        ${isEditing
                    ? 'focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-text'
                    : 'cursor-default'}`}
              />
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded mb-6">
            <label className="font-semibold block mb-2">Description:</label>
            <textarea
              name="description"
              value={grievance.description}
              onChange={handleChange}
              disabled={!isEditing}
              rows={4}
              className={`w-full p-2 bg-transparent border-none rounded resize-none
      ${isEditing
                  ? 'focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-text'
                  : 'cursor-default'}`}
            />
          </div>

          {!isEditing && grievance.status === "Pending" && (
            <div className="flex gap-4">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Delete
              </button>
            </div>
          )}

          {
            isEditing && (
              <div className="flex gap-4 mt-6">
                <button
                  onClick={handleUpdate}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                >
                  Cancel
                </button>
              </div>
            )
          }
        </div>



      </div>
    </>
  );
};

export default GrievanceDetails;