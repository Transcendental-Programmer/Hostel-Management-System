import React, { useState } from 'react';
import { User, FileText, CheckSquare, BarChart2, Users, Menu } from 'lucide-react';
import RegisterStaffForm from './RegisterStaffForm';
import GrievanceManagementByWarden from './GrievanceManagementByWarden';
import AssignStaff from './AssignStaff';
import { LineChart, XAxis, YAxis, Tooltip, Legend, Line, ResponsiveContainer } from 'recharts';

const WardenDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Mock data remains the same
  const dashboardStats = {
    totalGrievances: 156,
    pendingGrievances: 45,
    resolvedToday: 12,
    averageResolutionTime: '2.5 days',
    staffOnDuty: 8,
    urgentMatters: 3
  };

  const staffMembers = [
    { id: 1, name: "John Smith", role: "Maintenance", status: "On Duty", tasksCompleted: 45 },
    { id: 2, name: "Sarah Wilson", role: "Security", status: "On Leave", tasksCompleted: 38 },
    { id: 3, name: "Mike Johnson", role: "Housekeeping", status: "On Duty", tasksCompleted: 52 }
  ];

  const performanceData = [
    { name: 'Oct 24', resolved: 25, pending: 8 },
    { name: 'Oct 25', resolved: 30, pending: 10 },
    { name: 'Oct 26', resolved: 28, pending: 12 },
    { name: 'Oct 27', resolved: 32, pending: 6 },
    { name: 'Oct 28', resolved: 35, pending: 9 }
  ];

  // Dashboard Section Component 
  const DashboardSection = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-sm sm:text-base text-gray-600">Total Grievances</span>
            <span className="font-medium">{dashboardStats.totalGrievances}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm sm:text-base text-gray-600">Pending</span>
            <span className="font-medium text-orange-600">{dashboardStats.pendingGrievances}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm sm:text-base text-gray-600">Resolved Today</span>
            <span className="font-medium text-green-600">{dashboardStats.resolvedToday}</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Staff Overview</h3>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-sm sm:text-base text-gray-600">Staff on Duty</span>
            <span className="font-medium">{dashboardStats.staffOnDuty}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm sm:text-base text-gray-600">Avg. Resolution Time</span>
            <span className="font-medium">{dashboardStats.averageResolutionTime}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm sm:text-base text-gray-600">Urgent Matters</span>
            <span className="font-medium text-red-600">{dashboardStats.urgentMatters}</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm sm:col-span-2 lg:col-span-1">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            <p>• New grievance reported from Room 304</p>
            <p className="text-xs text-gray-400 mt-1">2 minutes ago</p>
          </div>
          <div className="text-sm text-gray-600">
            <p>• Maintenance completed in Room 201</p>
            <p className="text-xs text-gray-400 mt-1">15 minutes ago</p>
          </div>
          <div className="text-sm text-gray-600">
            <p>• Staff assignment updated</p>
            <p className="text-xs text-gray-400 mt-1">1 hour ago</p>
          </div>
        </div>
      </div>
    </div>
  );

  
  const StaffManagement = () => {
    const [isRegisterFormVisible, setIsRegisterFormVisible] = useState(false);

    const handleRegisterStaff = () => {
      setIsRegisterFormVisible(true);
    };
  
    const handleCancelRegister = () => {
      setIsRegisterFormVisible(false);
    };
  
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Staff Management</h3>
          <button onClick={handleRegisterStaff} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded">
            Register Staff
          </button>
        </div>
  
        {isRegisterFormVisible && (
          <div className="mt-6">
            <RegisterStaffForm onCancel={handleCancelRegister} />
          </div>
        )}
  
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden border border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="hidden sm:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tasks</th>
                    <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {staffMembers.map((staff) => (
                    <tr key={staff.id} className="hover:bg-gray-50">
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{staff.name}</td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{staff.role}</td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          staff.status === 'On Duty' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {staff.status}
                        </span>
                      </td>
                      <td className="hidden sm:table-cell px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{staff.tasksCompleted}</td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                        <button className="text-blue-600 hover:text-blue-900">Manage</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };

  
  const PerformanceDashboard = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Performance Metrics</h3>
        <div className="h-64 sm:h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performanceData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="resolved" stroke="#10B981" />
              <Line type="monotone" dataKey="pending" stroke="#F59E0B" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return <DashboardSection />;
      case 'grievances':
        return <AssignStaff />;
      case 'resolve':
        return <GrievanceManagementByWarden />;
      case 'performance':
        return <PerformanceDashboard />;
      case 'staff':
        return <StaffManagement />;
      default:
        return <DashboardSection />;
    }
  };

  const navItems = [
    { id: 'dashboard', icon: User, label: 'Dashboard' },
    { id: 'grievances', icon: FileText, label: 'Assign Staff' },
    { id: 'resolve', icon: CheckSquare, label: 'Resolve Grievance' },
    { id: 'performance', icon: BarChart2, label: 'Performance' },
    { id: 'staff', icon: Users, label: 'Staff Management' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm p-4 fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Warden Portal</h1>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-screen bg-white shadow-sm z-40 transition-transform duration-300 ease-in-out
        w-64 lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 hidden lg:block">
          <h1 className="text-2xl font-bold text-gray-900">Warden Portal</h1>
        </div>
        <nav className="mt-6">
          <div className="px-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`flex items-center space-x-3 w-full px-4 py-2 rounded-lg transition-colors duration-200 ${
                  activeTab === item.id
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </nav>
      </div>

      
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

     
      <div className={`
        transition-all duration-300 ease-in-out
        lg:ml-64
        pt-16 lg:pt-0
        p-4 sm:p-6 lg:p-8
      `}>
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default WardenDashboard;