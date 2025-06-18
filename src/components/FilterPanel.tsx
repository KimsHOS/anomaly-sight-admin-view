
import React from 'react';
import { Search, Filter, Calendar, MapPin, BarChart3, Zap } from 'lucide-react';

const FilterPanel = ({ filters, setFilters, states, onSearch }) => {
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 mb-8 shadow-2xl">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-2 rounded-xl">
          <Filter className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-white">Advanced Filters</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Status Filter */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-purple-200 font-medium">
            <Zap className="w-4 h-4" />
            <span>Status</span>
          </label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300 appearance-none cursor-pointer hover:bg-white/20"
          >
            <option value="">All Statuses</option>
            <option value="MISMATCHED">🔴 MISMATCHED</option>
            <option value="NO_ENROLLEMENT_FOUND">🟡 NO ENROLLMENT FOUND</option>
            <option value="MATCHED">🟢 MATCHED</option>
          </select>
        </div>

        {/* State Filter */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-purple-200 font-medium">
            <MapPin className="w-4 h-4" />
            <span>State</span>
          </label>
          <select
            value={filters.state}
            onChange={(e) => handleFilterChange('state', e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300 appearance-none cursor-pointer hover:bg-white/20"
          >
            <option value="">Select State</option>
            {states.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>

        {/* Date Filter */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-purple-200 font-medium">
            <Calendar className="w-4 h-4" />
            <span>Date</span>
          </label>
          <input
            type="date"
            value={filters.date}
            onChange={(e) => handleFilterChange('date', e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300 hover:bg-white/20"
          />
        </div>

        {/* Confidence Score Filter */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-purple-200 font-medium">
            <BarChart3 className="w-4 h-4" />
            <span>Confidence Score</span>
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.1"
              min="0"
              max="1"
              value={filters.confidenceScore}
              onChange={(e) => handleFilterChange('confidenceScore', e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300 hover:bg-white/20"
              placeholder="0.0 - 1.0"
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <span className="text-purple-300 text-sm">/1.0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search Button */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={onSearch}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2"
        >
          <Search className="w-5 h-5" />
          <span>Apply Filters</span>
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;
