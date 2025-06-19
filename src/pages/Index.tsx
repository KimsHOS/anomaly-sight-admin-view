import React, { useState, useEffect } from 'react';
import { Search, LogOut, Filter, Eye, Calendar, MapPin, BarChart3, User, Shield } from 'lucide-react';
import LoginScreen from '../components/LoginScreen';
import FilterPanel from '../components/FilterPanel';
import DataTable from '../components/DataTable';
import ImageZoom from '../components/ImageZoom';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAuthenticated') === 'true'
  );
  const [records, setRecords] = useState([]);
  const [filters, setFilters] = useState({
    status: 'MISMATCHED',
    state: '',
    date: '',
    confidenceScore: 0.4
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hoveredImage, setHoveredImage] = useState(null);

  const states = ['ACHALA', 'AP', 'ARP', 'ASSAM', 'CHTDG', 'CORP', 'DL', 'GOA', 'GUJ', 'HERSF', 'JH', 'KER', 'KTK', 'NTPC', 'OD', 'RAJ', 'TN', 'TS', 'UP', 'UT', 'WB'];

  const handleLogin = (credentials) => {
    if (credentials.username === 'admin' && credentials.password === 'admin@123') {
      setIsAuthenticated(true);
      localStorage.setItem('isAuthenticated', 'true');
      fetchData(true);
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
      confidenceScore: 0.4
    });
  };

  const fetchData = async (reset = false) => {
    if (!filters.state || !filters.date) {
      setError('Please select a state and date');
      return;
    }

    if (reset) {
      setPage(1);
      setRecords([]);
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://emrisvsschedularint.emri.in/face_mismatch/records', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          status: filters.status || 'MISMATCHED',
          state: filters.state,
          date: filters.date,
          confidanceScore: parseFloat(filters.confidenceScore.toString()),
          page: reset ? 1 : page,
          limit: 20
        })
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

  useEffect(() => {
    if (isAuthenticated && filters.state && filters.date) {
      fetchData(true);
    }
  }, [filters]);

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-blue-400 to-cyan-600 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-full opacity-10 animate-spin-slow"></div>
      </div>

      <div className="relative z-10 p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                Security Dashboard
              </h1>
              <p className="text-purple-200 text-lg">Unauthorized Employee Login Monitor</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-red-500/20 to-red-600/20 backdrop-blur-xl border border-red-500/30 p-6 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-200 text-sm">Mismatched</p>
                <p className="text-3xl font-bold text-white">{records.filter(r => r.status === 'MISMATCHED').length}</p>
              </div>
              <div className="bg-red-500/30 p-3 rounded-xl">
                <Eye className="w-6 h-6 text-red-300" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 backdrop-blur-xl border border-yellow-500/30 p-6 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-200 text-sm">No Enrollment</p>
                <p className="text-3xl font-bold text-white">{records.filter(r => r.status === 'NO_ENROLLEMENT_FOUND').length}</p>
              </div>
              <div className="bg-yellow-500/30 p-3 rounded-xl">
                <User className="w-6 h-6 text-yellow-300" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-xl border border-green-500/30 p-6 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-200 text-sm">Matched</p>
                <p className="text-3xl font-bold text-white">{records.filter(r => r.status === 'MATCHED').length}</p>
              </div>
              <div className="bg-green-500/30 p-3 rounded-xl">
                <BarChart3 className="w-6 h-6 text-green-300" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-xl border border-blue-500/30 p-6 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm">Total Records</p>
                <p className="text-3xl font-bold text-white">{records.length}</p>
              </div>
              <div className="bg-blue-500/30 p-3 rounded-xl">
                <Shield className="w-6 h-6 text-blue-300" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <FilterPanel 
          filters={filters} 
          setFilters={setFilters}
          states={states}
          onSearch={() => fetchData(true)}
        />

        {/* Data Table */}
        <DataTable 
          records={records}
          loading={loading}
          error={error}
          onImageHover={setHoveredImage}
          onLoadMore={() => fetchData()}
        />

        {/* Image Zoom Modal */}
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
