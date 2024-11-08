import React from 'react';
import { NavLink } from 'react-router-dom';
import UrgencyLabel from './UrgencyLabel';

const GrievanceCard = ({ grievance }) => {
    const formatTimestamp = (timestamp) => {
        // Formatting function can go here
        return new Date(timestamp).toLocaleDateString();
    };

    return (
        <NavLink to={`/grievances/details/${grievance.grievance_id}`} className="flex flex-col w-full h-full">
        <div className="relative flex h-full flex-col rounded-md border border-gray-300 shadow-sm hover:cursor-pointer bg-white p-2.5 hover:border-gray-400 sm:rounded-lg sm:p-5">
            <div className="text-lg mb-2 font-semibold text-gray-900 hover:text-black sm:mb-1.5 sm:text-2xl">
                {grievance.title}
            </div>
            {/* Urgency and category  */}
            <div className='flex flex-row gap-2 mb-2'>
                <div>
                    <UrgencyLabel urgencyLevel={grievance.urgency_level} />
                </div>
                <div>
                    <span className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-200 rounded-full sm:text-sm sm:px-3 sm:py-1.5">
                        {grievance.category}
                    </span>
                </div>
            </div>
            <p className="text-sm">
                Created on {formatTimestamp(grievance.created_at)}
            </p>
            <p className="mb-4 text-sm">
                {grievance.assigned_at
                    ? `Completed on ${formatTimestamp(grievance.assigned_at)}`
                    : null}
            </p>
            <div
                className="text-md leading-normal text-gray-400 sm:block overflow-hidden"
                style={{ maxHeight: '100px' }}
            >
                {grievance.description}
            </div>
            <button
                className={`group flex w-1/3 mt-3 cursor-pointer items-center justify-center rounded-md px-4 py-2 text-white transition text-sm ${grievance.status === 'completed' ||grievance.status === 'Completed'  ? 'bg-green-500' : 'bg-red-600'
                    }`}
            >
                <span className="group flex w-full items-center justify-center rounded py-1 text-center font-bold">
                    {grievance.status}
                </span>
            </button>
        </div>
        </NavLink>
    );
};

export default GrievanceCard;
