
import React from 'react';
import { Eye, User, BarChart3, Shield } from 'lucide-react';

interface StatsCardsProps {
  records: Array<{ status: string }>;
}

const StatsCards = ({ records }: StatsCardsProps) => {
  return (
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
  );
};

export default StatsCards;
