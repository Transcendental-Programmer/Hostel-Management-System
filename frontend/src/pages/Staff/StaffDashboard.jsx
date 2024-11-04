import React, { useState } from 'react';
import { User, FileText, CheckSquare, X } from 'lucide-react';

const StaffDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  
  // Mock data
  const staffStats = {
    totalLeaves: 12,
    leavesTaken: 4,
    activeDays: 234,
    status: 'Present',
    totalGrievancesResolved: 45,
    activeGrievances: 3
  };

  // Mock resolved grievances history
  const resolvedGrievances = [
    {
      id: 1,
      title: "Water Leakage - Room 102",
      resolvedDate: "2024-03-15T14:30:00",
      resolvedBy: "John Smith"
    },
    {
      id: 2,
      title: "AC Maintenance - Block A",
      resolvedDate: "2024-03-14T11:20:00",
      resolvedBy: "John Smith"
    },
    {
      id: 3,
      title: "Door Lock Repair - Room 405",
      resolvedDate: "2024-03-13T16:45:00",
      resolvedBy: "John Smith"
    },
    {
      id: 4,
      title: "Light Fixture - Common Area",
      resolvedDate: "2024-03-12T09:15:00",
      resolvedBy: "John Smith"
    }
  ];

  const [activeGrievances, setActiveGrievances] = useState([
    { 
      id: 1, 
      title: "Plumbing Issue - Room 304",
      status: "In Progress",
      staffResolved: true,
      wardenVerified: false,
      priority: "High",
      deadline: "2024-03-20"
    },
    { 
      id: 2, 
      title: "Electrical Maintenance - Block B",
      status: "Pending",
      staffResolved: false,
      wardenVerified: false,
      priority: "Medium",
      deadline: "2024-03-22"
    },
    { 
      id: 3, 
      title: "Window Repair - Room 201",
      status: "In Progress",
      staffResolved: true,
      wardenVerified: true,
      priority: "Low",
      deadline: "2024-03-25"
    }
  ]);

  const handleStaffResolution = (grievanceId) => {
    setActiveGrievances(prevGrievances =>
      prevGrievances.map(grievance =>
        grievance.id === grievanceId
          ? { ...grievance, staffResolved: !grievance.staffResolved, wardenVerified: false }
          : grievance
      )
    );
  };

  // History Modal Component
  const HistoryModal = () => (
    <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center ${isHistoryModalOpen ? '' : 'hidden'}`}>
      <div className="bg-white rounded-xl max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Resolved Grievances History</h3>
          <button 
            onClick={() => setIsHistoryModalOpen(false)}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="overflow-y-auto p-6">
          <div className="space-y-4">
            {resolvedGrievances.map((grievance) => (
              <div key={grievance.id} className="border border-gray-100 rounded-lg p-4">
                <h4 className="font-medium text-gray-900">{grievance.title}</h4>
                <div className="mt-2 text-sm text-gray-500 space-y-1">
                  <p>Resolved by: {grievance.resolvedBy}</p>
                  <p>Date: {new Date(grievance.resolvedDate).toLocaleDateString()}</p>
                  <p>Time: {new Date(grievance.resolvedDate).toLocaleTimeString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Dashboard Section Component
  const DashboardSection = () => (
    <div className="space-y-8">
      {/* Header with User Info */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
            <User className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Staff Portal</h1>
            <p className="text-sm text-gray-500">Maintenance Staff</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Grievance History Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Grievance History</h3>
            <FileText className="w-6 h-6 text-blue-500" />
          </div>
          <div className="flex items-center justify-center py-4">
            <div className="text-center">
              <span className="block text-4xl font-bold text-green-600">{staffStats.totalGrievancesResolved}</span>
              <span className="block text-sm text-gray-600 mt-1">Total Grievances Resolved</span>
              <button
                onClick={() => setIsHistoryModalOpen(true)}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
              >
                Check History
              </button>
            </div>
          </div>
        </div>

        {/* Active Grievances Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Active Grievances</h3>
            <CheckSquare className="w-6 h-6 text-orange-500" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Assigned Tasks</span>
              <span className="text-2xl font-bold text-orange-600">{staffStats.activeGrievances}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">High Priority</span>
              <span className="text-red-600 font-medium">1</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Pending Verification</span>
              <span className="text-blue-600 font-medium">2</span>
            </div>
          </div>
        </div>

        {/* Staff Stats Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Staff Statistics</h3>
            <User className="w-6 h-6 text-purple-500" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Active Days</span>
              <span className="text-2xl font-bold text-purple-600">{staffStats.activeDays}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Leaves Taken</span>
              <span className="text-xl font-semibold">{staffStats.leavesTaken}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Today's Status</span>
              <span className="px-2 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                {staffStats.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Grievances Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Active Grievances Details</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Task</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deadline</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Resolved by Staff</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Verified by Warden</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {activeGrievances.map((grievance) => (
                <tr key={grievance.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{grievance.title}</div>
                    <div className="text-sm text-gray-500">{grievance.status}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      grievance.priority === 'High' 
                        ? 'bg-red-100 text-red-800'
                        : grievance.priority === 'Medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {grievance.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {grievance.deadline}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        checked={grievance.staffResolved}
                        onChange={() => handleStaffResolution(grievance.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                      />
                      <span className="text-sm text-gray-500">Mark as Resolved</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        checked={grievance.wardenVerified}
                        disabled
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-not-allowed"
                      />
                      <span className="text-sm text-gray-500">Pending Verification</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <DashboardSection />
      <HistoryModal />
    </div>
  );
};

export default StaffDashboard;