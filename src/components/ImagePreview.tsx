
import React from 'react';
import { ZoomIn } from 'lucide-react';

interface ImagePreviewProps {
  src: string;
  alt: string;
  title: string;
  type: 'login' | 'enroll';
  employeeId: string;
  onClick: () => void;
}

const ImagePreview = ({ src, alt, title, type, employeeId, onClick }: ImagePreviewProps) => {
  const borderColor = type === 'login' ? 'border-purple-500/50 group-hover:border-purple-400' : 'border-cyan-500/50 group-hover:border-cyan-400';
  const badgeColor = type === 'login' ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gradient-to-r from-cyan-500 to-blue-500';

  return (
    <div 
      className="relative group cursor-pointer transform transition-all duration-300 hover:scale-110"
      onClick={onClick}
    >
      <img
        src={src}
        alt={alt}
        className={`w-20 h-20 object-cover rounded-xl border-2 ${borderColor} shadow-lg transition-all duration-300`}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          const nextElement = target.nextSibling as HTMLElement;
          if (nextElement) {
            nextElement.style.display = 'flex';
          }
        }}
      />
      <div className={`hidden w-20 h-20 bg-gradient-to-br from-gray-600 to-gray-800 rounded-xl border-2 ${borderColor} items-center justify-center`}>
        <span className="text-white text-xs text-center">{type === 'login' ? 'Login' : 'Enroll'}<br/>Failed</span>
      </div>
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 rounded-xl transition-all duration-300 flex items-center justify-center">
        <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className={`absolute -top-2 -right-2 ${badgeColor} text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300`}>
        {type === 'login' ? 'Login' : 'Enroll'}
      </div>
    </div>
  );
};

export default ImagePreview;
