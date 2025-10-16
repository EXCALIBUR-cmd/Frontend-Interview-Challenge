import React, { useState } from 'react';

interface AppointmentSearchProps {
  onSearch: (searchTerm: string, filters: AppointmentFilters) => void;
}

export interface AppointmentFilters {
  type?: string;
  dateRange?: {
    start: Date | null;
    end: Date | null;
  };
}

export default function AppointmentSearch({ onSearch }: AppointmentSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<AppointmentFilters>({
    type: '',
    dateRange: {
      start: null,
      end: null
    }
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm, filters);
  };

  return (
    <div className="mb-4">
      <form onSubmit={handleSearch} className="flex flex-wrap gap-2">
        <div className="flex-grow">
          <input
            type="text"
            placeholder="Search patient name..."
            className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search appointments"
          />
        </div>
        
        <button 
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded-md"
          aria-expanded={showFilters}
          aria-controls="search-filters"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
          </svg>
        </button>
        
        <button 
          type="submit" 
          className="px-4 py-2 bg-blue-500 text-white rounded-md dark:bg-blue-600"
        >
          Search
        </button>
      </form>
      
      {showFilters && (
        <div id="search-filters" className="mt-2 p-3 border rounded-md dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm mb-1">Appointment Type</label>
              <select
                className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                value={filters.type || ''}
                onChange={(e) => setFilters({...filters, type: e.target.value || undefined})}
              >
                <option value="">All Types</option>
                <option value="checkup">Checkup</option>
                <option value="consultation">Consultation</option>
                <option value="procedure">Procedure</option>
                <option value="follow-up">Follow-up</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm mb-1">Date Range</label>
              <div className="flex gap-2">
                <input
                  type="date"
                  className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                  onChange={(e) => setFilters({
                    ...filters, 
                    dateRange: {
                      ...filters.dateRange,
                      start: e.target.value ? new Date(e.target.value) : null,
                      end: filters.dateRange?.end || null
                    }
                  })}
                />
                <span className="self-center">to</span>
                <input
                  type="date"
                  className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                  onChange={(e) => setFilters({
                    ...filters, 
                    dateRange: {
                      ...filters.dateRange,
                      start: filters.dateRange?.start || null,
                      end: e.target.value ? new Date(e.target.value) : null
                    }
                  })}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}