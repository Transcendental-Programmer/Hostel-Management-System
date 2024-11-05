import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Plus } from 'lucide-react';
import axios from 'axios';

const AssignStaff = () => {
    const navigate = useNavigate();

    const [grievances, setGrievances] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [editingStatus, setEditingStatus] = useState(null);
    const [staffMembers, setStaffMembers] = useState([
        { id: 1, name: 'John Doe', department: 'Electricity' },
        { id: 2, name: 'Jane Smith', department: 'Plumbing' },
        { id: 3, name: 'Bob Johnson', department: 'Technical' },
        { id: 4, name: 'Sarah Lee', department: 'Internet' },
    ]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch grievances on component mount
    useEffect(() => {
        fetchGrievances();
    }, []);

    // Fetch grievances from API
    const fetchGrievances = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await axios.get('http://localhost:3000/grievances');
            setGrievances(response.data);
        } catch (err) {
            console.error('Failed to fetch grievances:', err);
            setError('Failed to load grievances. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    // Assign staff member to grievance
    const handleStaffAssignment = async (grievanceId, staffId) => {
        try {
            setError(null);
            const response = await axios.put(`http://localhost:3000/grievances/assign/${grievanceId}`, {
                grievance_id: grievanceId,
                staff_id: staffId,
            });

            if (response.status === 200) {
                setGrievances(prevGrievances =>
                    prevGrievances.map(grievance =>
                        grievance.grievance_id === grievanceId
                            ? { ...grievance, staff_id: staffId }
                            : grievance
                    )
                );
                setEditingStatus(null);
            }
        } catch (err) {
            console.error('Failed to assign staff member:', err);
            setError('Failed to assign staff member. Please try again.');
        }
    };

    // Filter and search logic
    const filteredGrievances = grievances.filter(grievance => {
        const matchesSearch =
            grievance.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            grievance.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            grievance.room_number?.toString().includes(searchTerm.toLowerCase());

        const matchesFilter =
            filterCategory.toLowerCase() === 'all' ||
            grievance.category.toLowerCase() === filterCategory.toLowerCase();

        return matchesSearch && matchesFilter;
    });

    const unassignedGrievances = filteredGrievances.filter(grievance => grievance.staff_id === null);
    const assignedGrievances = filteredGrievances.filter(grievance => grievance.staff_id !== null);

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

    // Staff assignment dropdown component
    const StaffAssignmentDropdown = ({ grievance }) => {
        const relevantStaff = staffMembers.filter(
            staff => staff.department.toLowerCase() === grievance.category.toLowerCase()
        );

        return (
            <div className="relative inline-block">
                <select
                    value={grievance.staff_id || 'unassigned'}
                    onChange={(e) => handleStaffAssignment(grievance.grievance_id, e.target.value === 'unassigned' ? null : e.target.value)}
                    className="rounded-md border border-gray-300 px-2 py-1 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                >
                    <option value="unassigned">Unassigned</option>
                    {relevantStaff.map(staff => (
                        <option key={staff.id} value={staff.id}>
                            {staff.name} - {staff.department}
                        </option>
                    ))}
                    {relevantStaff.length === 0 && (
                        <option value="any">Assign to any staff</option>
                    )}
                </select>
            </div>
        );
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading grievances...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Grievance Management System</h1>

                    {error && (
                        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
                            {error}
                        </div>
                    )}

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
                            <span className="text-gray-700">Filter by category:</span>
                            <select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                                className="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Grievances</option>
                                <option value="electricity">Electricity</option>
                                <option value="plumbing">Plumbing</option>
                                <option value="technical">Technical</option>
                                <option value="internet">Internet</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Unassigned Grievances */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Unassigned Grievances</h2>
                    {unassignedGrievances.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {unassignedGrievances.map((grievance) => (
                                <div
                                    key={grievance.grievance_id}
                                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                                >
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="text-xl font-semibold text-gray-900">{grievance.title}</h3>
                                            <button
                                                onClick={() => setEditingStatus(grievance.grievance_id)}
                                                className="text-gray-500 hover:text-gray-700"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </button>
                                        </div>

                                        <div className="space-y-3">
                                            <p className="text-sm text-gray-600">
                                                <span className="font-medium">Category:</span> {grievance.category}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                <span className="font-medium">Room:</span> {grievance.room_number}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                <span className="font-medium">Created:</span> {formatDate(grievance.created_at)}
                                            </p>
                                            <p className="text-sm text-gray-600 line-clamp-2">
                                                {grievance.description}
                                            </p>
                                        </div>

                                        <div className="mt-4 flex justify-between items-center">
                                            <div>
                                                {editingStatus === grievance.grievance_id ? (
                                                    <StaffAssignmentDropdown grievance={grievance} />
                                                ) : (
                                                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                                                        Unassigned
                                                    </span>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => navigate(`/grievance-details/${grievance.grievance_id}`)}
                                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10">
                            <p className="text-gray-600 text-lg">No unassigned grievances found.</p>
                        </div>
                    )}
                </div>

                {/* Assigned Grievances */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Assigned Grievances</h2>
                    {assignedGrievances.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {assignedGrievances.map((grievance) => (
                                <div
                                    key={grievance.grievance_id}
                                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                                >
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="text-xl font-semibold text-gray-900">{grievance.title}</h3>
                                            <div className="flex items-center space-x-2">
                                                {editingStatus === grievance.grievance_id ? (
                                                    <StaffAssignmentDropdown grievance={grievance} />
                                                ) : (
                                                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                                        Assigned
                                                    </span>
                                                )}
                                                <button
                                                    onClick={() => setEditingStatus(grievance.grievance_id)}
                                                    className="text-gray-500 hover:text-gray-700"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <p className="text-sm text-gray-600">
                                                <span className="font-medium">Category:</span> {grievance.category}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                <span className="font-medium">Room:</span> {grievance.room_number}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                <span className="font-medium">Assigned To:</span> {
                                                    staffMembers.find(staff => staff.id === grievance.staff_id)?.name
                                                }
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                <span className="font-medium">Created:</span> {formatDate(grievance.created_at)}
                                            </p>
                                            <p className="text-sm text-gray-600 line-clamp-2">
                                                {grievance.description}
                                            </p>
                                        </div>

                                        <div className="mt-4 flex justify-between items-center">
                                            <div>
                                                {editingStatus === grievance.grievance_id ? (
                                                    <StaffAssignmentDropdown grievance={grievance} />
                                                ) : (
                                                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                                        Assigned
                                                    </span>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => navigate(`/grievance-details/${grievance.grievance_id}`)}
                                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10">
                            <p className="text-gray-600 text-lg">No assigned grievances found.</p>
                        </div>
                    )}
                </div>

                {filteredGrievances.length === 0 && (
                    <div className="text-center py-10">
                        <p className="text-gray-600 text-lg">No grievances found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AssignStaff;