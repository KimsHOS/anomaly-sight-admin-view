
import React from 'react';
import { Calendar, User, MapPin, BarChart3, ZoomIn } from 'lucide-react';

const DataTableHeader = () => {
  return (
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
  );
};

export default DataTableHeader;
