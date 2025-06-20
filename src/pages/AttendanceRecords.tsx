
import React, { useState } from 'react';
import { Search, Calendar, User, MapPin, Filter, Clock, BarChart3 } from 'lucide-react';
import { theme } from '../config/theme';
import AttendanceFilters from '../components/AttendanceFilters';
import AttendanceTable from '../components/AttendanceTable';
import { useQuery } from '@tanstack/react-query';

interface AttendanceRecord {
  id: number;
  employeeId: string;
  state: string;
  loginTime: string;
  confidanceScore: number;
  status: string;
  loginImage: string;
  employeeIdFromEmployee: string;
  login_type: string;
  differ: number;
  markedTime: string;
  appVersion: string;
  shiftStart: string;
}

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

const AttendanceRecords = () => {
  const [filters, setFilters] = useState<FilterState>({
    employeeId: '',
    state: '',
    status: '',
    dateRangeType: 'today',
    fromDate: '',
    toDate: '',
    page: 1,
    limit: 100
  });

  const [hasSearched, setHasSearched] = useState(false);

  const fetchRecords = async (): Promise<{ success: boolean; records: AttendanceRecord[]; message?: string }> => {
    const requestBody = {
      employeeId: filters.employeeId || null,
      state: filters.state || null,
      status: filters.status || null,
      dateRangeType: filters.dateRangeType,
      fromDate: filters.dateRangeType === 'custom' ? filters.fromDate : null,
      toDate: filters.dateRangeType === 'custom' ? filters.toDate : null,
      page: filters.page,
      limit: filters.limit
    };

    console.log('Sending request:', requestBody);

    const response = await fetch('http://0.0.0.0:3003/api/records', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Received response:', data);
    return data;
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['attendance-records', filters],
    queryFn: fetchRecords,
    enabled: hasSearched,
    retry: 2
  });

  const handleSearch = () => {
    // Validation
    if (!filters.dateRangeType) {
      alert('Please select a date range.');
      return;
    }

    if (filters.dateRangeType === 'custom' && (!filters.fromDate || !filters.toDate)) {
      alert('Please select a date range. For custom range, provide both from and to dates.');
      return;
    }

    setHasSearched(true);
    refetch();
  };

  const totalRecords = data?.records?.length || 0;

  return (
    <div className={`min-h-screen ${theme.gradients.primary} p-6`}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className={`${theme.gradients.card} border border-white/20 rounded-2xl p-8 shadow-xl`}>
          <div className="flex items-center space-x-4 mb-6">
            <div className={`${theme.gradients.button} p-3 rounded-xl shadow-lg`}>
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Employee Attendance Records
              </h1>
              <p className="text-gray-600 text-lg">Search and analyze employee login data</p>
            </div>
          </div>

          {/* Stats Summary */}
          {hasSearched && data?.success && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 text-sm font-medium">Total Records</p>
                    <p className="text-2xl font-bold text-blue-900">{totalRecords}</p>
                  </div>
                  <Clock className="w-8 h-8 text-blue-500" />
                </div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 text-sm font-medium">Page</p>
                    <p className="text-2xl font-bold text-green-900">{filters.page}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-green-500" />
                </div>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-600 text-sm font-medium">Per Page</p>
                    <p className="text-2xl font-bold text-purple-900">{filters.limit}</p>
                  </div>
                  <Filter className="w-8 h-8 text-purple-500" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Filters */}
        <AttendanceFilters 
          filters={filters}
          setFilters={setFilters}
          onSearch={handleSearch}
        />

        {/* Results */}
        {hasSearched && (
          <AttendanceTable 
            data={data}
            isLoading={isLoading}
            error={error}
            filters={filters}
            setFilters={setFilters}
            onSearch={handleSearch}
          />
        )}
      </div>
    </div>
  );
};

export default AttendanceRecords;
