
import React from 'react';
import { getValidBase64, getEnrollImageUrl } from '../utils/imageUtils';
import { getStatusColor } from '../utils/statusUtils';
import ImagePreview from './ImagePreview';

interface Record {
  id: string;
  employee_id: string;
  state: string;
  insert_update_time: string;
  confidanceScore?: number;
  status: string;
  login_image: string;
}

interface DataTableRowProps {
  record: Record;
  index: number;
  onImageHover: (image: { src: string; title: string; type: string }) => void;
}

const DataTableRow = ({ record, index, onImageHover }: DataTableRowProps) => {
  return (
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
          <ImagePreview
            src={getValidBase64(record.login_image, record.employee_id)}
            alt="Login"
            title={`Login Image - ${record.employee_id}`}
            type="login"
            employeeId={record.employee_id}
            onClick={() => onImageHover({
              src: getValidBase64(record.login_image, record.employee_id),
              title: `Login Image - ${record.employee_id}`,
              type: 'login'
            })}
          />
          <ImagePreview
            src={getEnrollImageUrl(record.state, record.employee_id)}
            alt="Enrolled"
            title={`Enrolled Image - ${record.employee_id}`}
            type="enroll"
            employeeId={record.employee_id}
            onClick={() => onImageHover({
              src: getEnrollImageUrl(record.state, record.employee_id),
              title: `Enrolled Image - ${record.employee_id}`,
              type: 'enroll'
            })}
          />
        </div>
      </td>
    </tr>
  );
};

export default DataTableRow;
