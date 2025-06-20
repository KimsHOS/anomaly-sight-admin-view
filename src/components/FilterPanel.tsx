
import React from 'react';
import { Search, Filter, MapPin, Calendar, User, BarChart3 } from 'lucide-react';

interface FilterPanelProps {
  filters: {
    status: string;
    state: string;
    date: string;
    confidenceScore: number;
    employeeId: string;
    dateRangeType: 'today' | 'current_week' | 'last_week' | 'custom' | 'single_date';
    fromDate: string;
    toDate: string;
  };
  setFilters: React.Dispatch<React.SetStateAction<any>>;
  states: string[];
  onSearch: () => void;
}

const FilterPanel = ({ filters, setFilters, states, onSearch }: FilterPanelProps) => {
  const handleFilterChange = (key: string, value: string | number) => {
    setFilters((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    if (filters.dateRangeType === 'custom' && (!filters.fromDate || !filters.toDate)) {
      alert('Please select both from and to dates for custom range.');
      return;
    }
    if (filters.dateRangeType === 'single_date' && !filters.date) {
      alert('Please select a date.');
      return;
    }
    onSearch();
  };

  return (
    <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 shadow-2xl">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-3 rounded-xl">
          <Filter className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-white">Search Filters</h3>
      </div>

      <div className="space-y-6">
        {/* Row 1: Employee ID, State, Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Employee ID */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-white font-medium">
              <User className="w-4 h-4 text-blue-400" />
              <span>Employee ID (optional)</span>
            </label>
            <input
              type="text"
              value={filters.employeeId}
              onChange={(e) => handleFilterChange('employeeId', e.target.value)}
              placeholder="Enter Employee ID, e.g., EMP123"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* State */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-white font-medium">
              <MapPin className="w-4 h-4 text-green-400" />
              <span>State</span>
            </label>
            <select
              value={filters.state}
              onChange={(e) => handleFilterChange('state', e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
            >
              <option value="" className="text-gray-800">Select State</option>
              {states.map(state => (
                <option key={state} value={state} className="text-gray-800">{state}</option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-white font-medium">
              <BarChart3 className="w-4 h-4 text-purple-400" />
              <span>Status</span>
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
            >
              <option value="MISMATCHED" className="text-gray-800">Mismatched</option>
              <option value="MATCHED" className="text-gray-800">Matched</option>
              <option value="NO_ENROLLEMENT_FOUND" className="text-gray-800">No Enrollment</option>
            </select>
          </div>
        </div>

        {/* Row 2: Date Range Options */}
        <div className="space-y-4">
          <label className="flex items-center space-x-2 text-white font-medium">
            <Calendar className="w-4 h-4 text-orange-400" />
            <span>Date Range</span>
          </label>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { value: 'today', label: 'Today' },
              { value: 'current_week', label: 'Current Week' },
              { value: 'last_week', label: 'Last Week' },
              { value: 'single_date', label: 'Single Date' },
              { value: 'custom', label: 'Custom Range' }
            ].map((option) => (
              <label key={option.value} className="flex items-center space-x-2 cursor-pointer text-white">
                <input
                  type="radio"
                  name="dateRange"
                  value={option.value}
                  checked={filters.dateRangeType === option.value}
                  onChange={(e) => handleFilterChange('dateRangeType', e.target.value)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 focus:ring-2"
                />
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
          </div>

          {/* Single Date Picker */}
          {filters.dateRangeType === 'single_date' && (
            <div className="p-4 bg-blue-500/20 rounded-xl border border-blue-400/30">
              <label className="block text-white font-medium mb-2">Select Date</label>
              <input
                type="date"
                value={filters.date}
                onChange={(e) => handleFilterChange('date', e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          )}

          {/* Custom Date Range */}
          {filters.dateRangeType === 'custom' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-500/20 rounded-xl border border-blue-400/30">
              <div className="space-y-2">
                <label className="text-white font-medium">From Date</label>
                <input
                  type="date"
                  value={filters.fromDate}
                  onChange={(e) => handleFilterChange('fromDate', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div className="space-y-2">
                <label className="text-white font-medium">To Date</label>
                <input
                  type="date"
                  value={filters.toDate}
                  onChange={(e) => handleFilterChange('toDate', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
          )}
        </div>

        {/* Row 3: Confidence Score */}
        <div className="space-y-2">
          <label className="text-white font-medium">Confidence Score: {filters.confidenceScore}</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={filters.confidenceScore}
            onChange={(e) => handleFilterChange('confidenceScore', parseFloat(e.target.value))}
            className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-sm text-white/70">
            <span>0.0</span>
            <span>1.0</span>
          </div>
        </div>

        {/* Search Button */}
        <div className="flex justify-center pt-4">
          <button
            onClick={handleSearch}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-3 text-lg"
          >
            <Search className="w-6 h-6" />
            <span>Search Records</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
