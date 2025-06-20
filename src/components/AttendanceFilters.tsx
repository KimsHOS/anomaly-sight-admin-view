
import React from 'react';
import { Search, User, MapPin, Calendar, Filter } from 'lucide-react';
import { theme } from '../config/theme';

interface FilterState {
  employeeId: string;
  state: string;
  status: string;
  dateRangeType: 'today' | 'current_week' | 'last_week' | 'custom';
  fromDate: string;
  toDate: string;
  page: number;
  limit: number;
}

interface AttendanceFiltersProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onSearch: () => void;
}

const AttendanceFilters: React.FC<AttendanceFiltersProps> = ({ filters, setFilters, onSearch }) => {
  const states = ['ACHALA', 'AP', 'ARP', 'ASSAM', 'CHTDG', 'CORP', 'DL', 'GOA', 'GUJ', 'HERSF', 'JH', 'KER', 'KTK', 'NTPC', 'OD', 'RAJ', 'TN', 'TS', 'UP', 'UT', 'WB'];
  const statusOptions = ['MISMATCHED', 'MATCHED', 'PENDING'];

  const handleFilterChange = (key: keyof FilterState, value: string | number) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className={`${theme.gradients.card} border border-white/20 rounded-2xl p-8 shadow-xl`}>
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-2 rounded-xl">
          <Filter className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900">Search Filters</h3>
      </div>

      <div className="space-y-6">
        {/* Row 1: Basic Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Employee ID */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-gray-700 font-medium">
              <User className="w-4 h-4 text-blue-500" />
              <span>Employee ID (optional)</span>
            </label>
            <input
              type="text"
              value={filters.employeeId}
              onChange={(e) => handleFilterChange('employeeId', e.target.value)}
              placeholder="Enter Employee ID, e.g., EMP123"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80"
            />
          </div>

          {/* State */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-gray-700 font-medium">
              <MapPin className="w-4 h-4 text-green-500" />
              <span>State (optional)</span>
            </label>
            <select
              value={filters.state}
              onChange={(e) => handleFilterChange('state', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/80 appearance-none cursor-pointer"
            >
              <option value="">Select or enter state, e.g., CA</option>
              {states.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-gray-700 font-medium">
              <Filter className="w-4 h-4 text-purple-500" />
              <span>Status (optional)</span>
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/80 appearance-none cursor-pointer"
            >
              <option value="">Select status</option>
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2: Date Range */}
        <div className="space-y-4">
          <label className="flex items-center space-x-2 text-gray-700 font-medium">
            <Calendar className="w-4 h-4 text-orange-500" />
            <span>Date Range</span>
          </label>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: 'today', label: 'Today' },
              { value: 'current_week', label: 'Current Week' },
              { value: 'last_week', label: 'Last Week' },
              { value: 'custom', label: 'Custom' }
            ].map((option) => (
              <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="dateRange"
                  value={option.value}
                  checked={filters.dateRangeType === option.value}
                  onChange={(e) => handleFilterChange('dateRangeType', e.target.value)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>

          {/* Custom Date Range */}
          {filters.dateRangeType === 'custom' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="space-y-2">
                <label className="text-gray-700 font-medium">From Date</label>
                <input
                  type="date"
                  value={filters.fromDate}
                  onChange={(e) => handleFilterChange('fromDate', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-gray-700 font-medium">To Date</label>
                <input
                  type="date"
                  value={filters.toDate}
                  onChange={(e) => handleFilterChange('toDate', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                />
              </div>
            </div>
          )}
        </div>

        {/* Row 3: Pagination */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Page */}
          <div className="space-y-2">
            <label className="text-gray-700 font-medium">Page</label>
            <input
              type="number"
              min="1"
              value={filters.page}
              onChange={(e) => handleFilterChange('page', parseInt(e.target.value) || 1)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80"
            />
          </div>

          {/* Records per Page */}
          <div className="space-y-2">
            <label className="text-gray-700 font-medium">Records per Page</label>
            <select
              value={filters.limit}
              onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 appearance-none cursor-pointer"
            >
              <option value={10}>10</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={200}>200</option>
            </select>
          </div>
        </div>

        {/* Search Button */}
        <div className="flex justify-center pt-4">
          <button
            onClick={onSearch}
            className={`${theme.gradients.button} text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-3 text-lg`}
          >
            <Search className="w-6 h-6" />
            <span>Search Records</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceFilters;
