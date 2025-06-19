
import React from 'react';
import { Eye } from 'lucide-react';
import DataTableHeader from './DataTableHeader';
import DataTableRow from './DataTableRow';
import DataTableStates from './DataTableStates';

interface DataTableProps {
  records: any[];
  loading: boolean;
  error: string;
  onImageHover: (image: { src: string; title: string; type: string }) => void;
  onLoadMore: () => void;
}

const DataTable = ({ records, loading, error, onImageHover, onLoadMore }: DataTableProps) => {
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
          <DataTableHeader />
          <tbody>
            {records.map((record, index) => (
              <DataTableRow
                key={`${record.employee_id}-${record.insert_update_time}-${index}`}
                record={record}
                index={index}
                onImageHover={onImageHover}
              />
            ))}
          </tbody>
        </table>
      </div>

      <DataTableStates
        loading={loading}
        error={error}
        records={records}
        onLoadMore={onLoadMore}
      />
    </div>
  );
};

export default DataTable;
