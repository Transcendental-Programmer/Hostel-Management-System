import React, { useState, useEffect } from "react";
import {
  User,
  FileText,
  CheckSquare,
  BarChart2,
  Users,
  Menu,
} from "lucide-react";
import RegisterStaffForm from "./RegisterStaffForm";
import GrievanceManagementByWarden from "./GrievanceManagementByWarden";
import AssignStaff from "./AssignStaff";
import {
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  ResponsiveContainer,
} from "recharts";
import StaffStatusSwitch from "../components/StaffStatusSwitch";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../components/NavLogo";

const WardenDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({
    totalGrievances: 0,
    pendingGrievances: 0,
    resolvedToday: 0,
    completedGrievances: 0,
    closedGrievances: 0,
  });
  const [staffOverview, setStaffOverview] = useState({
    staffOnDuty: 0,
    staffOnLeave: 0,
    avgResolutionTime: "0.0 days",
    urgentMatters: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const [authToken, setAuthToken] = useState(localStorage.getItem("jwtToken"));

  const logout = () => {
    setAuthToken(null);
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("user_role");
    localStorage.removeItem("user_id");
    navigate("/login");
  };

  const ROLE_PATHS = {
    STAFF: "/staff-dashboard",
    STUDENT: "/student-home",
    WARDEN: "/warden-dashboard",
    ADMIN: "/warden-dashboard"
  };
  const token = localStorage.getItem("jwtToken");
  const userRole = localStorage.getItem("user_role");
  // Function to handle navigation based on role
  const handleBackNavigation = () => {
    if (token && userRole) {
      const roleKey = userRole.toUpperCase();
      const path = ROLE_PATHS[roleKey];
      if (path) {
        navigate(path);
      } else {
        // Default path if role does not match
        navigate("/");
      }
    } else {
      // Navigate to default path if no token or role
      navigate("/");
    }
  };
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch all data in parallel
        const [statsResponse, staffResponse, activitiesResponse] =
          await Promise.all([
            fetch("https://hostelmate-backend-5zcj.onrender.com/grievances/quick-stats"),
            fetch("https://hostelmate-backend-5zcj.onrender.com/grievances/staff-overview"),
            fetch("https://hostelmate-backend-5zcj.onrender.com/grievances/recent-activity"),
          ]);

        if (!statsResponse.ok || !staffResponse.ok || !activitiesResponse.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const [statsData, staffData, activitiesData] = await Promise.all([
          statsResponse.json(),
          staffResponse.json(),
          activitiesResponse.json(),
        ]);

        setDashboardStats(statsData);
        setStaffOverview(staffData);
        setRecentActivities(activitiesData);
      } catch (err) {
        setError("Failed to load dashboard data. Please try again later.");
        console.error("Error fetching dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []); // Empty dependency array means this runs once on component mount


  // Dashboard Section Component
  const DashboardSection = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 p-4 rounded-lg text-red-600">{error}</div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 mb-8 mt-8 md:mt-20">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Stats
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm sm:text-base text-gray-600">
                Total Grievances
              </span>
              <span className="font-medium">
                {dashboardStats.totalGrievances}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm sm:text-base text-gray-600">
                Pending
              </span>
              <span className="font-medium text-orange-600">
                {dashboardStats.pendingGrievances}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm sm:text-base text-gray-600">
                Resolved Today
              </span>
              <span className="font-medium text-green-600">
                {dashboardStats.resolvedToday}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm sm:text-base text-gray-600">
                Completed
              </span>
              <span className="font-medium text-green-600">
                {dashboardStats.completedGrievances}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm sm:text-base text-gray-600">Closed</span>
              <span className="font-medium text-gray-600">
                {dashboardStats.closedGrievances}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Staff Overview
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm sm:text-base text-gray-600">
                Staff on Duty
              </span>
              <span className="font-medium text-green-600">
                {staffOverview.staffOnDuty}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm sm:text-base text-gray-600">
                Avg. Resolution Time
              </span>
              <span className="font-medium">
                {staffOverview.avgResolutionTime}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm sm:text-base text-gray-600">
                Urgent Matters
              </span>
              <span className="font-medium text-red-600">
                {staffOverview.urgentMatters}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm sm:text-base text-gray-600">
                Staff on Leave
              </span>
              <span className="font-medium text-red-600">
                {staffOverview.staffOnLeave}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm sm:col-span-2 lg:col-span-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Activity
          </h3>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div
                className="text-sm text-gray-600"
                key={activity.timestamp + index}
              >
                <p>{activity.message}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(activity.timestamp).toLocaleTimeString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const StaffManagement = () => {
    const [isRegisterFormVisible, setIsRegisterFormVisible] = useState(false);
    const [staffMembers, setStaffMembers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      const fetchStaffMembers = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(
            "https://hostelmate-backend-5zcj.onrender.com/grievances/staff"
          );
          if (!response.ok) {
            throw new Error("Failed to fetch staff data");
          }
          const data = await response.json();
          setStaffMembers(data);
        } catch (err) {
          setError("Failed to load staff members. Please try again later.");
          console.error("Error fetching staff data:", err);
        } finally {
          setIsLoading(false);
        }
      };

      fetchStaffMembers();
    }, []);

    const handleRegisterStaff = () => {
      setIsRegisterFormVisible(true);
    };

    const handleCancelRegister = () => {
      setIsRegisterFormVisible(false);
    };


    const handleUpdateStatus = async (staffMember) => {
      try {
        const response = await fetch(
          `https://hostelmate-backend-5zcj.onrender.com/users/updateStaffStatus/${staffMember.user_id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ is_active: !staffMember.is_active }),
          }
        );

        if (response.ok) {
          // Update the staff member's status in the local state
          setStaffMembers((prevMembers) =>
            prevMembers.map((member) =>
              member.user_id === staffMember.user_id
                ? { ...member, is_active: !member.is_active }
                : member
            )
          );
        } else {
          console.error('Failed to update staff member status');
        }
      } catch (err) {
        console.error('Error updating staff member status:', err);
      }
    };

    const formatPhoneNumber = (phoneNumber) => {
      // Add any phone number formatting logic if needed
      return phoneNumber || "Not provided";
    };

    if (isLoading) {
      return (
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mt-20">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mt-20">
          <div className="bg-red-50 p-4 rounded-lg text-red-600">{error}</div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow-sm p-4 xl:p-6 mt-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0 mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            Staff Management
          </h3>
          <button
            onClick={handleRegisterStaff}
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
          >
            Register Staff
          </button>
        </div>

        {isRegisterFormVisible && (
          <div className="mt-6">
            <RegisterStaffForm onCancel={handleCancelRegister} />
          </div>
        )}

        <div className="overflow-x-auto -mx-4 md:mx-0">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden border border-gray-200 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="md:hidden px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Details
                    </th>
                    <th
                      scope="col"
                      className="hidden md:table-cell px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Department
                    </th>
                    <th
                      scope="col"
                      className="hidden md:table-cell px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Contact
                    </th>
                    <th
                      scope="col"
                      className="hidden md:table-cell px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      On Duty
                    </th>
                    {/* <th
                      scope="col"
                      className="hidden md:table-cell px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th> */}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {staffMembers.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-4 md:px-6 py-4 text-center text-sm text-gray-500"
                      >
                        No staff members found
                      </td>
                    </tr>
                  ) : (
                    staffMembers.map((staff) => (
                      <tr key={staff.user_id} className="hover:bg-gray-50">
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <div className="text-sm font-medium text-gray-900">
                              {staff.full_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {staff.email}
                            </div>
                          </div>
                        </td>
                        <td className="hidden md:table-cell px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {staff.department}
                        </td>
                        <td className="hidden md:table-cell px-4 md:px-6 py-4 whitespace-nowrap">
                          <a
                            href={`tel:${staff.phone_number}`}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            {formatPhoneNumber(staff.phone_number)}
                          </a>
                        </td>
                        {/* <td className="hidden md:table-cell px-4 md:px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${staff.is_active
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                              }`}
                          >
                            {staff.is_active ? 'Present' : 'Absent'}
                          </span>
                          <button
                            className="ml-2 text-blue-600 hover:text-blue-900"
                            onClick={() => handleUpdateStatus(staff)}
                          >
                            {staff.is_active ? 'Mark Absent' : 'Mark Present'}
                          </button>
                        </td> */}
                        <td className="hidden md:table-cell px-4 md:px-6 py-4 whitespace-nowrap">
                          <StaffStatusSwitch
                            staff={staff}
                            onUpdateStatus={handleUpdateStatus}
                          />
                        </td>

                        {/* <td className="hidden md:table-cell px-4 md:px-6 py-4 whitespace-nowrap text-sm">
                          <button className="text-blue-600 hover:text-blue-900">
                            Manage
                          </button>
                        </td> */}
                        {/* Dropdown for small screens */}
                        <td className="md:hidden px-4 md:px-6 py-4 whitespace-nowrap">
                          <div className="mt-2 text-xs text-gray-500">
                            <p className="my-0.5">
                              <strong>Department:</strong> {staff.department}
                            </p>
                            <p className="my-0.5">
                              <strong>Contact:</strong>{" "}
                              <a
                                href={`tel:${staff.phone_number}`}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                {formatPhoneNumber(staff.phone_number)}
                              </a>
                            </p>
                            <p className="my-0.5 flex justify-start gap-2 items-center mr-2">
                              <strong>On Duty: </strong>{" "}
                              <StaffStatusSwitch
                                staff={staff}
                                onUpdateStatus={handleUpdateStatus}
                              />
                            </p>
                            {/* <p className="my-0.5">
                              <button className="text-blue-600 hover:text-blue-900">
                                Manage
                              </button>
                            </p> */}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };
  // const performanceData = [
  //   { name: "Oct 24", resolved: 25, pending: 8 },
  //   { name: "Oct 25", resolved: 30, pending: 10 },
  //   { name: "Oct 26", resolved: 28, pending: 12 },
  //   { name: "Oct 27", resolved: 32, pending: 6 },
  //   { name: "Oct 28", resolved: 35, pending: 9 },
  // ];


  const PerformanceDashboard = () => {
    // Function to fetch performance data from API
    const fetchPerformanceData = async () => {
      try {
        const response = await fetch('https://hostelmate-backend-5zcj.onrender.com/grievances/performance-data', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch performance data');
        }

        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching performance data:', error);
        return null;
      }
    };
    const [performanceData, setPerformanceData] = useState([]);

    useEffect(() => {
      const getData = async () => {
        const data = await fetchPerformanceData();
        if (data) {
          setPerformanceData(data);
        }
      };
      getData();
    }, []);

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Performance Metrics
          </h3>
          <div className="h-64 sm:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={performanceData}
                margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
              >
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
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardSection />;
      case "grievances":
        return <AssignStaff />;
      case "resolve":
        return <GrievanceManagementByWarden />;
      case "performance":
        return <PerformanceDashboard />;
      case "staff":
        return <StaffManagement />;
      default:
        return <DashboardSection />;
    }
  };

  const navItems = [
    { id: "dashboard", icon: User, label: "Dashboard" },
    { id: "grievances", icon: FileText, label: "Assign Staff" },
    { id: "resolve", icon: CheckSquare, label: "Resolve Grievance" },
    { id: "performance", icon: BarChart2, label: "Performance" },
    { id: "staff", icon: Users, label: "Staff Management" },
  ];

  return (
    <div className=" bg-gray-100">
      {/* Mobile Header with Navbar Features */}
      <div className="lg:hidden h-16 md:h-20 bg-white shadow-sm sm:p-4 py-2 fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo/Home Link */}
          <div
            onClick={handleBackNavigation}
            className="flex items-center whitespace-nowrap text-2xl font-black cursor-pointer"
          >
            {/* <span className="text-black">IIITM HMS</span> */}
            <Logo />
          </div>

          {/* Title in Center */}
          <h1 className="text-xl font-bold sm:text-center text-left text-gray-900 absolute sm:left-1/2 left-1/3 transform -translate-x-1/2 ">
            Warden Portal
          </h1>

          {/* Account and Logout buttons */}
          <div className="hidden md:flex items-center space-x-4 ml-auto">
            <Link to="/account" className="text-gray-600 hover:text-blue-600">
              Account
            </Link>
            <button
              className="rounded-md border-2 border-blue-600 px-4 py-1 font-medium text-blue-600 transition-colors hover:bg-blue-600 hover:text-white"
              onClick={logout}
            >
              Logout
            </button>
          </div>


        </div>
      </div>



      {/* Sidebar */}
      <div
        className={` mt-16 lg:mt-20 
        fixed top-0 left-0 h-screen bg-white shadow-sm z-40 transition-transform duration-300 ease-in-out
        w-64 lg:translate-x-0
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="p-4 hidden lg:block text-center">
          <h1 className="text-2xl font-bold text-gray-900">Warden Portal</h1>
        </div>
        <nav className="mt-6 lg:mt-2">
          <div className="px-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`flex items-center space-x-3 w-full px-4 py-2 rounded-lg transition-colors duration-200 ${activeTab === item.id
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50"
                  }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ))}
            {/* Account and Logout in Sidebar (shown only below md) */}
            {isSidebarOpen && (
              <div className="md:hidden mt-4 px-4 space-y-2">
                <Link to="/account" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                  <User className="w-5 h-5" />
                  <span>Account</span>
                </Link>

                <button
                  className="w-full rounded-md border-2 border-blue-600 px-4 py-1 font-medium text-blue-600 transition-colors hover:bg-blue-600 hover:text-white"
                  onClick={logout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div
        className={`
        transition-all duration-300 ease-in-out
        lg:ml-64
        pt-16 lg:pt-0
        p-4 sm:p-6 lg:p-8
      `}
      >
        <div className="max-w-7xl mx-auto">{renderContent()}</div>
      </div>
    </div>
  );
};

export default WardenDashboard;
