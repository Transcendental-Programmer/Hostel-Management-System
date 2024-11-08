import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil } from 'lucide-react';
import axios from 'axios';

const GrievanceManagementByWarden = () => {
    const navigate = useNavigate();

    const [grievances, setGrievances] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [editingStatus, setEditingStatus] = useState(null);
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
            const response = await axios.get('https://hostelmate-backend-5zcj.onrender.com/grievances/open');
            console.log(response.data);
            
            setGrievances(response.data);
        } catch (err) {
            console.error('Failed to fetch grievances:', err);
            setError('Failed to load grievances. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    // Update grievance status
    const handleStatusChange = async (grievanceId, newStatus) => {
        try {
            setError(null);
            const response = await axios.put(`https://hostelmate-backend-5zcj.onrender.com/grievances/update/${grievanceId}`, {
                grievance_id: grievanceId,
                status: newStatus,
            });

            if (response.status === 200) {
                setGrievances(prevGrievances =>
                    prevGrievances.map(grievance =>
                        grievance.grievance_id === grievanceId
                            ? { ...grievance, status: newStatus }
                            : grievance
                    )
                );
                setEditingStatus(null);
            }
        } catch (err) {
            console.error('Failed to update grievance status:', err);
            setError('Failed to update status. Please try again.');
        }
    };

    // Filter and search logic
    const filteredGrievances = grievances.filter(grievance => {
        const matchesSearch =
            grievance.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            grievance.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            grievance.room_number?.toString().includes(searchTerm.toLowerCase());

        const matchesFilter =
            filterStatus.toLowerCase() === 'all' ||
            (filterStatus.toLowerCase() === 'completed' && grievance.status.toLowerCase() === 'completed') ||
            (filterStatus.toLowerCase() === 'pending' && grievance.status.toLowerCase() === 'pending') ||
            (filterStatus.toLowerCase() === 'closed' && grievance.status.toLowerCase() === 'closed');

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

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'closed':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-red-100 text-red-800';
        }
    };

    // Status edit dropdown component
    const StatusDropdown = ({ grievance }) => {
        return (
            <div className="relative inline-block">
                <select
                    value={grievance.status}
                    onChange={(e) => handleStatusChange(grievance.grievance_id, e.target.value)}
                    className="rounded-md border border-gray-300 px-2 py-1 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="closed">Closed</option>
                </select>
            </div>
        );
    };

    if (isLoading) {
        return (
            <div className="md:min-h-[calc(100vh-80px)] min-h-[calc(100vh-64px)] bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading grievances...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="md:min-h-[calc(100vh-80px)] min-h-[calc(100vh-64px)] bg-gray-100 p-6">
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
                            <span className="text-gray-700">Filter by status:</span>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Grievances</option>
                                <option value="completed">Completed</option>
                                <option value="pending">Pending</option>
                                <option value="closed">Closed</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Grievances Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredGrievances.map((grievance) => (
                        <div
                            key={grievance.grievance_id}
                            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <h2 className="text-xl font-semibold text-gray-900">{grievance.title}</h2>
                                    <div className="flex items-center space-x-2">
                                        {editingStatus === grievance.grievance_id ? (
                                            <StatusDropdown grievance={grievance} />
                                        ) : (
                                            <>
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(grievance.status)}`}>
                                                    {grievance.status.charAt(0).toUpperCase() + grievance.status.slice(1)}
                                                </span>
                                                <button
                                                    onClick={() => setEditingStatus(grievance.grievance_id)}
                                                    className="text-gray-500 hover:text-gray-700"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">Room:</span> {grievance.room_number}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">Created:</span> {formatDate(grievance.created_at)}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">Urgency:</span> {grievance.urgency_level}
                                    </p>
                                    <p className="text-sm text-gray-600 line-clamp-2">
                                        {grievance.description}
                                    </p>
                                </div>

                                <div className="mt-4 flex justify-end">
                                    <button
                                        onClick={() => navigate(`/grievances/details/${grievance.grievance_id}`)}
                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
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

export default GrievanceManagementByWarden;