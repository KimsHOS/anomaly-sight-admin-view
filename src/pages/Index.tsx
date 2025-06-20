
import React, { useState, useEffect } from 'react';
import LoginScreen from '../components/LoginScreen';
import SecurityDashboard from '../components/SecurityDashboard';
import StatsCards from '../components/StatsCards';
import FilterPanel from '../components/FilterPanel';
import DataTable from '../components/DataTable';
import ImageZoom from '../components/ImageZoom';
import AnimatedBackground from '../components/AnimatedBackground';

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
      <AnimatedBackground />

      <div className="relative z-10 p-6 max-w-7xl mx-auto">
        <SecurityDashboard onLogout={handleLogout} />
        
        <StatsCards records={records} />

        <FilterPanel 
          filters={filters} 
          setFilters={setFilters}
          states={states}
          onSearch={() => fetchData(true)}
        />

        <DataTable 
          records={records}
          loading={loading}
          error={error}
          onImageHover={setHoveredImage}
          onLoadMore={() => fetchData()}
        />

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
