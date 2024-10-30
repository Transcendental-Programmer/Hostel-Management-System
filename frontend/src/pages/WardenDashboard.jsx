import React, { useState } from 'react';
import { User, FileText, CheckSquare, BarChart2, Users } from 'lucide-react';


const WardenDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Mock data
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Total Grievances</span>
            <span className="font-medium">{dashboardStats.totalGrievances}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Pending</span>
            <span className="font-medium text-orange-600">{dashboardStats.pendingGrievances}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Resolved Today</span>
            <span className="font-medium text-green-600">{dashboardStats.resolvedToday}</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Staff Overview</h3>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Staff on Duty</span>
            <span className="font-medium">{dashboardStats.staffOnDuty}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Avg. Resolution Time</span>
            <span className="font-medium">{dashboardStats.averageResolutionTime}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Urgent Matters</span>
            <span className="font-medium text-red-600">{dashboardStats.urgentMatters}</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
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

  // Staff Management Section Component
  const StaffManagement = () => (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Staff Management</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tasks Completed</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {staffMembers.map((staff) => (
              <tr key={staff.id}>
                <td className="px-6 py-4 whitespace-nowrap">{staff.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{staff.role}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    staff.status === 'On Duty' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {staff.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{staff.tasksCompleted}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button className="text-blue-600 hover:text-blue-900">Manage</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Performance Dashboard Component
  const PerformanceDashboard = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Performance Metrics</h3>
        <div className="h-64">
          <LineChart width={600} height={200} data={performanceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="resolved" stroke="#10B981" />
            <Line type="monotone" dataKey="pending" stroke="#F59E0B" />
          </LineChart>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return <DashboardSection />;
      case 'grievances':
        return <GrievanceManagement />;
      case 'resolve':
        return <div className="bg-white p-6 rounded-lg shadow-sm">Resolve Grievance Section</div>;
      case 'performance':
        return <PerformanceDashboard />;
      case 'staff':
        return <StaffManagement />;
      default:
        return <DashboardSection />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white h-screen fixed shadow-sm">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900">Warden Portal</h1>
          </div>
          <nav className="mt-6">
            <div className="px-4 space-y-2">
              {[
                { id: 'dashboard', icon: User, label: 'Dashboard' },
                { id: 'grievances', icon: FileText, label: 'Manage Grievances' },
                { id: 'resolve', icon: CheckSquare, label: 'Resolve Grievance' },
                { id: 'performance', icon: BarChart2, label: 'Performance' },
                { id: 'staff', icon: Users, label: 'Staff Management' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
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

        {/* Main Content */}
        <div className="ml-64 flex-1 p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default WardenDashboard;