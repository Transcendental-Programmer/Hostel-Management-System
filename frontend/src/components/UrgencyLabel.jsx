import React from 'react'

const UrgencyLabel = ({urgencyLevel}) => {
  return (
    <div>
        {urgencyLevel === 'Low' && <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-200 rounded-full sm:text-sm sm:px-3 sm:py-1.5">Low</span>}
        {urgencyLevel === 'Medium' && <span className="px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-200 rounded-full sm:text-sm sm:px-3 sm:py-1.5">Medium</span>}
        {urgencyLevel === 'High' && <span className="px-2 py-1 text-xs font-semibold text-orange-600 bg-orange-200 rounded-full sm:text-sm sm:px-3 sm:py-1.5">High</span>}
        {urgencyLevel === 'Critical' && <span className="px-2 py-1 text-xs font-semibold text-red-600 bg-red-200 rounded-full sm:text-sm sm:px-3 sm:py-1.5">Critical</span>}
    </div>
  )
}

export default UrgencyLabel