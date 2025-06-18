
import React, { useState, useRef, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, RotateCw, Download, Maximize2 } from 'lucide-react';

const ImageZoom = ({ image, onClose }) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const containerRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === '+' || e.key === '=') handleZoomIn();
      if (e.key === '-') handleZoomOut();
      if (e.key === 'r' || e.key === 'R') handleRotate();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev * 1.2, 5));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev / 1.2, 0.5));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setRotation(0);
  };

  const handleMouseDown = (e) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale(prev => Math.max(0.5, Math.min(5, prev * delta)));
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = image.src;
    link.download = `${image.title.replace(/\s+/g, '_')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Controls */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-10">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 flex items-center space-x-4">
          <button
            onClick={handleZoomOut}
            className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-xl transition-all duration-300 transform hover:scale-110"
            title="Zoom Out (-)"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          
          <div className="text-white font-medium min-w-[60px] text-center">
            {Math.round(scale * 100)}%
          </div>
          
          <button
            onClick={handleZoomIn}
            className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-xl transition-all duration-300 transform hover:scale-110"
            title="Zoom In (+)"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          
          <div className="w-px h-6 bg-white/20"></div>
          
          <button
            onClick={handleRotate}
            className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-xl transition-all duration-300 transform hover:scale-110"
            title="Rotate (R)"
          >
            <RotateCw className="w-5 h-5" />
          </button>
          
          <button
            onClick={handleReset}
            className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-xl transition-all duration-300 transform hover:scale-110"
            title="Reset View"
          >
            <Maximize2 className="w-5 h-5" />
          </button>
          
          <button
            onClick={handleDownload}
            className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-xl transition-all duration-300 transform hover:scale-110"
            title="Download"
          >
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-white p-3 rounded-xl transition-all duration-300 transform hover:scale-110 z-10"
        title="Close (Esc)"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Image Title */}
      <div className="absolute top-6 left-6 z-10">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-6 py-3">
          <h3 className="text-white font-semibold text-lg">{image.title}</h3>
          <p className="text-purple-200 text-sm capitalize">{image.type} Image</p>
        </div>
      </div>

      {/* Image Container */}
      <div
        ref={containerRef}
        className="relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <img
          ref={imageRef}
          src={image.src}
          alt={image.title}
          className="max-w-none max-h-none transition-all duration-300 ease-out drop-shadow-2xl"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale}) rotate(${rotation}deg)`,
            cursor: isDragging ? 'grabbing' : scale > 1 ? 'grab' : 'default'
          }}
          draggable={false}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjNGI1NTYzIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMjAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSIxOCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPkltYWdlIE5vdCBGb3VuZDwvdGV4dD4KPC9zdmc+';
          }}
        />
      </div>

      {/* Instructions */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-6 py-3">
          <p className="text-purple-200 text-sm text-center">
            🖱️ Scroll to zoom • 🖱️ Drag to pan • ⌨️ Press R to rotate • ⌨️ Esc to close
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImageZoom;
