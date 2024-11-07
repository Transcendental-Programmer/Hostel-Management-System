import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const GrievanceManagement = () => {
  const navigate = useNavigate();
  // Mock data
  const initialGrievances = [
    {
      complaint_id: 1,
      name: "Broken Air Conditioner",
      room: "301",
      description: "The AC unit is making loud noises and not cooling properly. This has been an issue for the past week and is affecting my ability to study and sleep.",
      created_at: "2024-10-28T10:30:00",
      is_completed: false
    },
    {
      complaint_id: 2,
      name: "Water Leakage",
      room: "205",
      description: "There's a significant water leak from the ceiling in the bathroom. The issue is getting worse and might damage personal belongings.",
      created_at: "2024-10-27T15:45:00",
      assigned_at: "2024-10-29T09:15:00",
      is_completed: true
    },
    {
      complaint_id: 3,
      name: "Faulty Light Fixtures",
      room: "102",
      description: "Two light fixtures in the room are flickering constantly. This needs to be fixed as it's causing eye strain.",
      created_at: "2024-10-29T08:20:00",
      is_completed: false
    },
    {
      complaint_id: 4,
      name: "Internet Connectivity",
      room: "405",
      description: "Wi-Fi connection is extremely slow and keeps disconnecting. This is affecting my online classes and assignments.",
      created_at: "2024-10-26T14:10:00",
      assigned_at: "2024-10-28T11:30:00",
      is_completed: true
    }
  ];

  const [grievances, setGrievances] = useState(initialGrievances);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedGrievance, setSelectedGrievance] = useState(null);

  // Filter and search logic
  const filteredGrievances = grievances.filter(grievance => {
    const matchesSearch = 
      grievance.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grievance.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grievance.room.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = 
      filterStatus === 'all' ||
      (filterStatus === 'completed' && grievance.is_completed) ||
      (filterStatus === 'pending' && !grievance.is_completed);

    return matchesSearch && matchesFilter;
  });

  // Format date helper
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="md:min-h-[calc(100vh-80px)] min-h-[calc(100vh-64px)] bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Grievance Management System</h1>
          
          {/* Search and Filter Section */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between bg-white p-4 rounded-lg shadow-sm">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search grievances..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 rounded-md border border-gray-300 pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* Filter */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Filter by status:</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Grievances</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Grievances Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGrievances.map((grievance) => (
            <div
              key={grievance.complaint_id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">{grievance.name}</h2>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    grievance.is_completed 
                      ? "bg-green-100 text-green-800" 
                      : "bg-red-100 text-red-800"
                  }`}>
                    {grievance.is_completed ? "Completed" : "Pending"}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Room:</span> {grievance.room}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Created:</span> {formatDate(grievance.created_at)}
                  </p>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {grievance.description}
                  </p>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    // onClick={() => setSelectedGrievance(grievance)}
                    onClick={() => navigate(`/grievances/details/${grievance.complaint_id}`)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Details Modal */}
        {selectedGrievance && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">{selectedGrievance.name}</h2>
                <button
                  onClick={() => setSelectedGrievance(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold">Room Number</h3>
                    <p>{selectedGrievance.room}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Status</h3>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      selectedGrievance.is_completed 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {selectedGrievance.is_completed ? "Completed" : "Pending"}
                    </span>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold">Description</h3>
                  <p className="text-gray-600">{selectedGrievance.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold">Created At</h3>
                    <p>{formatDate(selectedGrievance.created_at)}</p>
                  </div>
                  {selectedGrievance.assigned_at && (
                    <div>
                      <h3 className="font-semibold">Completed At</h3>
                      <p>{formatDate(selectedGrievance.assigned_at)}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {filteredGrievances.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-600 text-lg">No grievances found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GrievanceManagement;