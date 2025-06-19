
import React from 'react';
import { Calendar, User, MapPin, BarChart3, Eye, ZoomIn } from 'lucide-react';

const DataTable = ({ records, loading, error, onImageHover, onLoadMore }) => {
  const getValidBase64 = (base64, employee_id) => {
    if (!base64) {
      console.warn(`No base64 data for login image, employee_id: ${employee_id}`);
      return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
    }
    if (!base64.startsWith('data:image/')) {
      return `data:image/png;base64,${base64}`;
    }
    return base64;
  };

  const getEnrollImageUrl = (state, employee_id) => {
    const baseUrl = 'http://eams.achalasolutions.com:8091/attendance/document/fetchFileFromCloud';
    const filePath = `EMPLOYEEIMAGES/${state}/${employee_id}.png`;
    return filePath;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'MISMATCHED':
        return 'bg-gradient-to-r from-red-500 to-red-600 text-white';
      case 'NO_ENROLLEMENT_FOUND':
        return 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white';
      case 'MATCHED':
        return 'bg-gradient-to-r from-green-500 to-green-600 text-white';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl overflow-hidden shadow-2xl">
      {/* Table Header */}
      <div className="bg-gradient-to-r from-purple-600/50 to-pink-600/50 p-6 border-b border-white/20">
        <h3 className="text-2xl font-bold text-white flex items-center space-x-3">
          <Eye className="w-6 h-6" />
          <span>Login Records</span>
        </h3>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto max-h-[600px] scrollbar-thin scrollbar-track-transparent scrollbar-thumb-purple-500/50">
        <table className="w-full">
          <thead className="sticky top-0 bg-gradient-to-r from-purple-800/80 to-blue-800/80 backdrop-blur-xl">
            <tr>
              <th className="p-4 text-left text-purple-200 font-semibold">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Login ID</span>
                </div>
              </th>
              <th className="p-4 text-left text-purple-200 font-semibold">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Employee ID</span>
                </div>
              </th>
              <th className="p-4 text-left text-purple-200 font-semibold">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>State</span>
                </div>
              </th>
              <th className="p-4 text-left text-purple-200 font-semibold">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Timestamp</span>
                </div>
              </th>
              <th className="p-4 text-left text-purple-200 font-semibold">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4" />
                  <span>Confidence</span>
                </div>
              </th>
              <th className="p-4 text-left text-purple-200 font-semibold">Status</th>
              <th className="p-4 text-left text-purple-200 font-semibold">
                <div className="flex items-center space-x-2">
                  <ZoomIn className="w-4 h-4" />
                  <span>Images</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {records.map((record, index) => (
              <tr
                key={`${record.employee_id}-${record.insert_update_time}-${index}`}
                className="border-b border-white/10 hover:bg-white/5 transition-all duration-300 group"
              >
                <td className="p-4 text-white font-mono">{record.id}</td>
                <td className="p-4 text-white font-semibold">{record.employee_id}</td>
                <td className="p-4">
                  <span className="bg-blue-500/20 text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
                    {record.state}
                  </span>
                </td>
                <td className="p-4 text-purple-200 text-sm">
                  {new Date(record.insert_update_time).toLocaleString()}
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {record.confidanceScore?.toFixed(2) || 'N/A'}
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(record.status)}`}>
                    {record.status}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex space-x-4">
                    {/* Login Image */}
                    <div 
                      className="relative group cursor-pointer transform transition-all duration-300 hover:scale-110"
                      onClick={() => onImageHover({
                        src: getValidBase64(record.login_image, record.employee_id),
                        title: `Login Image - ${record.employee_id}`,
                        type: 'login'
                      })}
                    >
                      <img
                        src={getValidBase64(record.login_image, record.employee_id)}
                        alt="Login"
                        className="w-20 h-20 object-cover rounded-xl border-2 border-purple-500/50 shadow-lg group-hover:border-purple-400 transition-all duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const nextElement = target.nextSibling as HTMLElement;
                          if (nextElement) {
                            nextElement.style.display = 'flex';
                          }
                        }}
                      />
                      <div className="hidden w-20 h-20 bg-gradient-to-br from-gray-600 to-gray-800 rounded-xl border-2 border-purple-500/50 items-center justify-center">
                        <span className="text-white text-xs text-center">Login<br/>Failed</span>
                      </div>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 rounded-xl transition-all duration-300 flex items-center justify-center">
                        <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300">
                        Login
                      </div>
                    </div>

                    {/* Enroll Image */}
                    <div 
                      className="relative group cursor-pointer transform transition-all duration-300 hover:scale-110"
                      onClick={() => onImageHover({
                        src: getEnrollImageUrl(record.state, record.employee_id),
                        title: `Enrolled Image - ${record.employee_id}`,
                        type: 'enroll'
                      })}
                    >
                      <img
                        src={getEnrollImageUrl(record.state, record.employee_id)}
                        alt="Enrolled"
                        className="w-20 h-20 object-cover rounded-xl border-2 border-cyan-500/50 shadow-lg group-hover:border-cyan-400 transition-all duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const nextElement = target.nextSibling as HTMLElement;
                          if (nextElement) {
                            nextElement.style.display = 'flex';
                          }
                        }}
                      />
                      <div className="hidden w-20 h-20 bg-gradient-to-br from-gray-600 to-gray-800 rounded-xl border-2 border-cyan-500/50 items-center justify-center">
                        <span className="text-white text-xs text-center">Enroll<br/>Failed</span>
                      </div>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 rounded-xl transition-all duration-300 flex items-center justify-center">
                        <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300">
                        Enroll
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Loading and Error States */}
      {loading && (
        <div className="p-8 text-center">
          <div className="inline-flex items-center space-x-3">
            <div className="w-6 h-6 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
            <span className="text-purple-200 text-lg">Loading records...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="p-8 text-center">
          <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 text-red-200">
            {error}
          </div>
        </div>
      )}

      {!loading && records.length === 0 && !error && (
        <div className="p-8 text-center">
          <div className="text-purple-200 text-lg">No records found. Please adjust your filters.</div>
        </div>
      )}

      {/* Load More Button */}
      {records.length > 0 && !loading && (
        <div className="p-6 text-center border-t border-white/20">
          <button
            onClick={onLoadMore}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Load More Records
          </button>
        </div>
      )}
    </div>
  );
};

export default DataTable;
