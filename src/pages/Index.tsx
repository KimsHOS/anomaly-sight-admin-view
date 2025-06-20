
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginScreen from '../components/LoginScreen';
import SecurityDashboard from '../components/SecurityDashboard';
import StatsCards from '../components/StatsCards';
import FilterPanel from '../components/FilterPanel';
import DataTable from '../components/DataTable';
import ImageZoom from '../components/ImageZoom';
import AnimatedBackground from '../components/AnimatedBackground';
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

interface AttendanceFilterState {
  employeeId: string;
  state: string;
  status: string;
  dateRangeType: 'today' | 'current_week' | 'last_week' | 'custom';
  fromDate: string;
  toDate: string;
  page: number;
  limit: number;
}

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAuthenticated') === 'true'
  );
  const [activeTab, setActiveTab] = useState('face-recognition');
  
  // Face Recognition States - Enhanced with employee ID and new date options
  const [records, setRecords] = useState([]);
  const [filters, setFilters] = useState({
    status: 'MISMATCHED',
    state: '',
    date: '',
    confidenceScore: 0.4,
    employeeId: '',
    dateRangeType: 'single_date' as 'today' | 'current_week' | 'last_week' | 'custom' | 'single_date',
    fromDate: '',
    toDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hoveredImage, setHoveredImage] = useState(null);

  // Attendance Records States
  const [attendanceFilters, setAttendanceFilters] = useState<AttendanceFilterState>({
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

  const states = ['ACHALA', 'AP', 'ARP', 'ASSAM', 'CHTDG', 'CORP', 'DL', 'GOA', 'GUJ', 'HERSF', 'JH', 'KER', 'KTK', 'NTPC', 'OD', 'RAJ', 'TN', 'TS', 'UP', 'UT', 'WB'];

  const handleLogin = (credentials) => {
    if (credentials.username === 'admin' && credentials.password === 'admin@123') {
      setIsAuthenticated(true);
      localStorage.setItem('isAuthenticated', 'true');
      fetchFaceRecognitionData(true);
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    setRecords([]);
    setFilters({
      status: 'MISMATCHED',
      state: '',
      date: '',
      confidenceScore: 0.4,
      employeeId: '',
      dateRangeType: 'single_date',
      fromDate: '',
      toDate: ''
    });
    setAttendanceFilters({
      employeeId: '',
      state: '',
      status: '',
      dateRangeType: 'today',
      fromDate: '',
      toDate: '',
      page: 1,
      limit: 100
    });
    setHasSearched(false);
  };

  // Enhanced Face Recognition Data Fetching with new filter options
  const fetchFaceRecognitionData = async (reset = false) => {
    // Validation based on date range type
    if (filters.dateRangeType === 'single_date' && !filters.date) {
      setError('Please select a date');
      return;
    }
    if (filters.dateRangeType === 'custom' && (!filters.fromDate || !filters.toDate)) {
      setError('Please select both from and to dates for custom range');
      return;
    }
    if (!filters.state) {
      setError('Please select a state');
      return;
    }

    if (reset) {
      setPage(1);
      setRecords([]);
    }

    setLoading(true);
    setError('');

    try {
      // Prepare request body based on date range type
      let requestBody: any = {
        status: filters.status || 'MISMATCHED',
        state: filters.state,
        confidanceScore: parseFloat(filters.confidenceScore.toString()),
        page: reset ? 1 : page,
        limit: 20
      };

      // Add employee ID if provided
      if (filters.employeeId) {
        requestBody.employeeId = filters.employeeId;
      }

      // Handle different date range types
      if (filters.dateRangeType === 'single_date') {
        requestBody.date = filters.date;
      } else if (filters.dateRangeType === 'custom') {
        requestBody.fromDate = filters.fromDate;
        requestBody.toDate = filters.toDate;
      } else {
        // For today, current_week, last_week - let the backend handle
        requestBody.dateRangeType = filters.dateRangeType;
      }

      console.log('Face Recognition Request:', requestBody);

      const response = await fetch('http://emrisvsschedularint.emri.in/face_mismatch/records', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setRecords(prev => reset ? data.records : [...prev, ...data.records]);
        if (!reset) setPage(prev => prev + 1);
      } else {
        setError(data.message || 'Failed to fetch records');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      if (err.name === 'TypeError' && err.message === 'Failed to fetch') {
        setError('Unable to connect to the API. Please check if the server is running.');
      } else {
        setError('Error connecting to the server. Please check the backend service.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Attendance Records Data Fetching
  const fetchAttendanceRecords = async (): Promise<{ success: boolean; records: AttendanceRecord[]; message?: string }> => {
    const requestBody = {
      employeeId: attendanceFilters.employeeId || null,
      state: attendanceFilters.state || null,
      status: attendanceFilters.status || null,
      dateRangeType: attendanceFilters.dateRangeType,
      fromDate: attendanceFilters.dateRangeType === 'custom' ? attendanceFilters.fromDate : null,
      toDate: attendanceFilters.dateRangeType === 'custom' ? attendanceFilters.toDate : null,
      page: attendanceFilters.page,
      limit: attendanceFilters.limit
    };

    console.log('Attendance Request:', requestBody);

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
    console.log('Attendance Response:', data);
    return data;
  };

  const { data: attendanceData, isLoading: attendanceLoading, error: attendanceError, refetch: refetchAttendance } = useQuery({
    queryKey: ['attendance-records', attendanceFilters],
    queryFn: fetchAttendanceRecords,
    enabled: hasSearched,
    retry: 2
  });

  const handleAttendanceSearch = () => {
    if (!attendanceFilters.dateRangeType) {
      alert('Please select a date range.');
      return;
    }

    if (attendanceFilters.dateRangeType === 'custom' && (!attendanceFilters.fromDate || !attendanceFilters.toDate)) {
      alert('Please select a date range. For custom range, provide both from and to dates.');
      return;
    }

    setHasSearched(true);
    refetchAttendance();
  };

  useEffect(() => {
    if (isAuthenticated && filters.state && activeTab === 'face-recognition') {
      if (filters.dateRangeType === 'single_date' && filters.date) {
        fetchFaceRecognitionData(true);
      } else if (filters.dateRangeType === 'custom' && filters.fromDate && filters.toDate) {
        fetchFaceRecognitionData(true);
      } else if (['today', 'current_week', 'last_week'].includes(filters.dateRangeType)) {
        fetchFaceRecognitionData(true);
      }
    }
  }, [filters]);

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      <AnimatedBackground />

      <div className="relative z-10 p-6 max-w-7xl mx-auto">
        <SecurityDashboard onLogout={handleLogout} />
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl p-2 mb-8">
            <TabsTrigger 
              value="face-recognition" 
              className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white rounded-xl transition-all duration-300"
            >
              Face Recognition Records
            </TabsTrigger>
            <TabsTrigger 
              value="attendance" 
              className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white rounded-xl transition-all duration-300"
            >
              Employee Attendance Records
            </TabsTrigger>
          </TabsList>

          <TabsContent value="face-recognition" className="space-y-8">
            <StatsCards records={records} />

            <FilterPanel 
              filters={filters} 
              setFilters={setFilters}
              states={states}
              onSearch={() => fetchFaceRecognitionData(true)}
            />

            <DataTable 
              records={records}
              loading={loading}
              error={error}
              onImageHover={setHoveredImage}
              onLoadMore={() => fetchFaceRecognitionData()}
            />
          </TabsContent>

          <TabsContent value="attendance" className="space-y-8">
            <AttendanceFilters 
              filters={attendanceFilters}
              setFilters={setAttendanceFilters}
              onSearch={handleAttendanceSearch}
            />

            {hasSearched && (
              <AttendanceTable 
                data={attendanceData}
                isLoading={attendanceLoading}
                error={attendanceError}
                filters={attendanceFilters}
                setFilters={setAttendanceFilters}
                onSearch={handleAttendanceSearch}
              />
            )}
          </TabsContent>
        </Tabs>

        {hoveredImage && (
          <ImageZoom 
            image={hoveredImage}
            onClose={() => setHoveredImage(null)}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
