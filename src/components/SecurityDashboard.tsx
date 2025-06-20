
import React from 'react';
import { LogOut, BarChart3, Shield } from 'lucide-react';

interface SecurityDashboardProps {
  onLogout: () => void;
}

const SecurityDashboard = ({ onLogout }: SecurityDashboardProps) => {
  return (
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
      <div className="flex items-center space-x-4">
        <a
          href="/attendance"
          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2"
        >
          <BarChart3 className="w-5 h-5" />
          <span>Attendance Records</span>
        </a>
        <button
          onClick={onLogout}
          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default SecurityDashboard;
