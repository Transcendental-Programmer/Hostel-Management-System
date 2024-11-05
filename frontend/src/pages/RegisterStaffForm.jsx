import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaUserTie, FaBuilding, FaLanguage, FaLock,FaPhone  } from 'react-icons/fa';

const RegisterStaffForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    full_name: '',
    department: '',
    languagePreference: '',
    password: '',
    phone_number: '',
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);  
    try {
      const response = await fetch('http://localhost:3000/users/createStaff', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage('Staff registered successfully!');
        setError(null);
        // Optionally, clear the form
        setFormData({
          username: '',
          email: '',
          full_name: '',
          department: '',
          languagePreference: '',
          password: '',
          phone_number: '',
        });
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to register staff.');
        setMessage(null);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      setMessage(null);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Register New Staff</h2>

      {message && <div className="text-green-600 mb-4 text-center">{message}</div>}
      {error && <div className="text-red-600 mb-4 text-center">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center border border-gray-300 p-2 rounded-lg bg-gray-50">
          <FaUser className="text-gray-500 mr-2" />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full bg-transparent outline-none text-gray-700"
          />
        </div>
        <div className="flex items-center border border-gray-300 p-2 rounded-lg bg-gray-50">
          <FaEnvelope className="text-gray-500 mr-2" />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full bg-transparent outline-none text-gray-700"
          />
        </div>
        <div className="flex items-center border border-gray-300 p-2 rounded-lg bg-gray-50">
          <FaUserTie className="text-gray-500 mr-2" />
          <input
            type="text"
            name="full_name"
            placeholder="Full Name"
            value={formData.full_name}
            onChange={handleChange}
            required
            className="w-full bg-transparent outline-none text-gray-700"
          />
        </div>
        <div className="flex items-center border border-gray-300 p-2 rounded-lg bg-gray-50">
          <FaBuilding className="text-gray-500 mr-2" />
          <input
            type="text"
            name="department"
            placeholder="Department"
            value={formData.department}
            onChange={handleChange}
            required
            className="w-full bg-transparent outline-none text-gray-700"
          />
        </div>
        <div className="flex items-center border border-gray-300 p-2 rounded-lg bg-gray-50">
          <FaLanguage className="text-gray-500 mr-2" />
          <input
            type="text"
            name="languagePreference"
            placeholder="Language Preference"
            value={formData.languagePreference}
            onChange={handleChange}
            required
            className="w-full bg-transparent outline-none text-gray-700"
          />
        </div>
        <div className="flex items-center border border-gray-300 p-2 rounded-lg bg-gray-50">
          <FaLock className="text-gray-500 mr-2" />
          <input
            type="password"
            name="password"
            placeholder="Set Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full bg-transparent outline-none text-gray-700"
          />
        </div>
        <div className="flex items-center border border-gray-300 p-2 rounded-lg bg-gray-50">
          <FaPhone className="text-gray-500 mr-2" />
          <input
            type="number"
            name="phone_number"
            placeholder="Phone number"
            value={formData.phone_number}
            onChange={handleChange}
            required
            className="w-full bg-transparent outline-none text-gray-700"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-gray-800 text-white py-2 rounded-lg font-semibold hover:bg-gray-700 transition duration-200"
        >
          Register Staff
        </button>
      </form>
    </div>
  );
};

export default RegisterStaffForm;
