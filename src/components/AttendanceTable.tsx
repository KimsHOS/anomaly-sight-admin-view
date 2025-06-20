
import React, { useState } from 'react';
import { Eye, AlertCircle, CheckCircle, Clock, User, MapPin, Calendar } from 'lucide-react';
import { theme } from '../config/theme';

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

interface AttendanceTableProps {
  data: { success: boolean; records: AttendanceRecord[]; message?: string } | undefined;
  isLoading: boolean;
  error: any;
  filters: any;
  setFilters: any;
  onSearch: () => void;
}

const AttendanceTable: React.FC<AttendanceTableProps> = ({ 
  data, 
  isLoading, 
  error, 
  filters, 
  setFilters, 
  onSearch 
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const getStatusBadge = (status: string) => {
    const config = {
      'MATCHED': { bg: theme.status.matched.bg, text: theme.status.matched.text, icon: CheckCircle },
      'MISMATCHED': { bg: theme.status.mismatched.bg, text: theme.status.mismatched.text, icon: AlertCircle },
      'PENDING': { bg: theme.status.pending.bg, text: theme.status.pending.text, icon: Clock }
    };

    const { bg, text, icon: Icon } = config[status as keyof typeof config] || config.PENDING;

    return (
      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium`} 
            style={{ backgroundColor: bg, color: text }}>
        <Icon className="w-4 h-4" />
        <span>{status}</span>
      </span>
    );
  };

  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return {
        date: date.toLocaleDateString('en-IN'),
        time: date.toLocaleTimeString('en-IN')
      };
    } catch {
      return { date: 'Invalid', time: 'Date' };
    }
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev: any) => ({ ...prev, page: newPage }));
    onSearch();
  };

  if (isLoading) {
    return (
      <div className={`${theme.gradients.card} border border-white/20 rounded-2xl p-8 shadow-xl`}>
        <div className="flex items-center justify-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-lg text-gray-600">Searching records...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${theme.gradients.card} border border-red-200 rounded-2xl p-8 shadow-xl`}>
        <div className="flex items-center space-x-3 text-red-600">
          <AlertCircle className="w-6 h-6" />
          <div>
            <h3 className="font-semibold">Error Loading Records</h3>
            <p className="text-sm text-red-500">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data?.success) {
    return (
      <div className={`${theme.gradients.card} border border-yellow-200 rounded-2xl p-8 shadow-xl`}>
        <div className="flex items-center space-x-3 text-yellow-600">
          <AlertCircle className="w-6 h-6" />
          <div>
            <h3 className="font-semibold">Search Failed</h3>
            <p className="text-sm text-yellow-700">{data?.message || 'Unknown error occurred'}</p>
          </div>
        </div>
      </div>
    );
  }

  const records = data.records || [];

  return (
    <div className={`${theme.gradients.card} border border-white/20 rounded-2xl overflow-hidden shadow-xl`}>
      {/* Table Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Eye className="w-6 h-6" />
            <h3 className="text-xl font-semibold">Attendance Records</h3>
          </div>
          <div className="text-sm bg-white/20 px-3 py-1 rounded-full">
            {records.length} records found
          </div>
        </div>
      </div>

      {/* Table Content */}
      {records.length === 0 ? (
        <div className="p-8 text-center">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Records Found</h3>
          <p className="text-gray-500">Try adjusting your search filters or date range.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Login Time
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Marked Time
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Confidence
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {records.map((record, index) => {
                const loginDateTime = formatDateTime(record.loginTime);
                const markedDateTime = formatDateTime(record.markedTime);
                
                return (
                  <tr key={`${record.id}-${index}`} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <User className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{record.employeeId}</div>
                          <div className="text-sm text-gray-500 flex items-center space-x-1">
                            <MapPin className="w-3 h-3" />
                            <span>{record.state}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(record.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{loginDateTime.date}</div>
                          <div className="text-sm text-gray-500">{loginDateTime.time}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{markedDateTime.date}</div>
                          <div className="text-sm text-gray-500">{markedDateTime.time}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(record.confidanceScore * 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {(record.confidanceScore * 100).toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {record.loginImage && (
                        <button
                          onClick={() => setSelectedImage(`http://0.0.0.0:3003/api/proxy-image?url=${encodeURIComponent(record.loginImage)}`)}
                          className="bg-blue-100 hover:bg-blue-200 p-2 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4 text-blue-600" />
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>Differ: {record.differ}s</div>
                      <div>Type: {record.login_type}</div>
                      <div>App: v{record.appVersion}</div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {records.length > 0 && (
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Page {filters.page} • {records.length} records
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange(filters.page - 1)}
                disabled={filters.page <= 1}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(filters.page + 1)}
                disabled={records.length < filters.limit}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-2xl max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Login Image</h3>
              <button
                onClick={() => setSelectedImage(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <img 
              src={selectedImage} 
              alt="Login" 
              className="max-w-full h-auto rounded-lg shadow-lg"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceTable;
