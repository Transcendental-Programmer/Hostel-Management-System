import React, { useState, useEffect } from 'react';
import { User, FileText, CheckSquare, X } from 'lucide-react';
import axios from 'axios';

const StaffDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [staffStats, setStaffStats] = useState({
    resolvedCount: 0,
    present: false,
  });
  const [resolvedGrievances, setResolvedGrievances] = useState([]);
  const [activeGrievances, setActiveGrievances] = useState({
    assignedTasks: 0,
    highPriorityCount: 0,
    pendingVerifications: 0,
  });
  const [staffTasks, setStaffTasks] = useState([]);

  let staffId = '';

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      staffId = user.user_id;
      fetchStaffStats();
      fetchResolvedGrievances();
      fetchActiveGrievances();
      fetchStaffTasks();
    }
  }, []);

  const fetchStaffStats = async () => {
    try {
      const response = await axios.get(`https://hostelmate-backend-5zcj.onrender.com/staff/getStaffStats/${staffId}`);
      setStaffStats(response.data);
    } catch (error) {
      console.error('Error fetching staff stats:', error);
    }
  };

  const fetchResolvedGrievances = async () => {
    try {
      const response = await axios.get(`https://hostelmate-backend-5zcj.onrender.com/staff/getStaffHistory/${staffId}`);
      setResolvedGrievances(response.data);
    } catch (error) {
      console.error('Error fetching resolved grievances:', error);
    }
  };

  const fetchActiveGrievances = async () => {
    try {
      const response = await axios.get(`https://hostelmate-backend-5zcj.onrender.com/staff/getActiveGrievances/${staffId}`);
      setActiveGrievances({
        assignedTasks: response.data.assignedTasks,
        highPriorityCount: response.data.highPriorityCount,
        pendingVerifications: response.data.pendingVerifications,
      });
    } catch (error) {
      console.error('Error fetching active grievances:', error);
    }
  };

  const fetchStaffTasks = async () => {
    try {
      const response = await axios.get(`https://hostelmate-backend-5zcj.onrender.com/staff/getStaffTasks/${staffId}`);
      console.log(response);
      setStaffTasks(response.data);
    } catch (error) {
      console.error('Error fetching staff tasks:', error);
    }
  };

  const handleStaffResolution = async (grievanceId) => {
    try {
      await axios.put('https://hostelmate-backend-5zcj.onrender.com/staff/markComplete', { grievance_id: grievanceId });
      fetchActiveGrievances(); // Refresh the active grievances list
    } catch (error) {
      console.error('Error marking grievance as complete:', error);
    }
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
            {Array.isArray(resolvedGrievances) && resolvedGrievances.map((grievance) => (
              <div key={grievance._id} className="border border-gray-100 rounded-lg p-4">
                <h4 className="font-medium text-gray-900">{grievance.title}</h4>
                <div className="mt-2 text-sm text-gray-500 space-y-1">
                  <p>Resolved by: {grievance.resolvedBy}</p>
                  <p>Date: {new Date(grievance.resolvedDate).toLocaleDateString()}</p>
                  <p>Time: {new Date(grievance.resolvedDate).toLocaleTimeString()}</p>
                </div>
              </div>
            ))}
            {
              resolvedGrievances.length === 0 && (
                <div className="text-center text-gray-500">No grievances resolved yet</div>
              )
            }
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
              <span className="text-2xl font-bold text-orange-600">{activeGrievances.assignedTasks}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">High Priority</span>
              <span className="text-red-600 font-medium">{activeGrievances.highPriorityCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Pending Verification</span>
              <span className="text-blue-600 font-medium">{activeGrievances.pendingVerifications}</span>
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
              <span className="text-gray-600">Resolved Count</span>
              <span className="text-2xl font-bold text-purple-600">{staffStats.resolvedCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Today's Status</span>
              <span className="px-2 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                {staffStats.present ? 'Present' : 'Absent'}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Resolved by Staff</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">More Details</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Array.isArray(staffTasks) && staffTasks.map((grievance) => (
                <tr key={grievance._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{grievance.title}</div>
                    <div className="text-sm text-gray-500">{grievance.urgency_level}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${grievance.urgency_level === 'High'
                        ? 'bg-red-100 text-red-800'
                        : grievance.urgency_level === 'Medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                      {grievance.urgency_level}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={grievance.staffResolved}
                        onChange={() => handleStaffResolution(grievance._id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                      />
                      <span className="text-sm text-gray-500">Mark as Resolved</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <a
                      href={`/grievances/details/${grievance.grievance_id}`}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View Details
                    </a>
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
    <div className="md:min-h-[calc(100vh-80px)] min-h-[calc(100vh-64px)] bg-gray-50 p-8">
      <DashboardSection />
      <HistoryModal />
    </div>
  );
};

export default StaffDashboard;