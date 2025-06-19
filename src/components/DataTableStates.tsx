
import React from 'react';

interface DataTableStatesProps {
  loading: boolean;
  error: string;
  records: any[];
  onLoadMore: () => void;
}

const DataTableStates = ({ loading, error, records, onLoadMore }: DataTableStatesProps) => {
  return (
    <>
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
    </>
  );
};

export default DataTableStates;
