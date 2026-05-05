import React from 'react';

interface SkeletonProps {
  className?: string;
  lines?: number;
  height?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', lines = 1, height = 'h-4' }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`${height} bg-gray-200 rounded animate-pulse`}
          style={{
            animationDelay: `${index * 0.1}s`,
            animationDuration: '1.5s',
          }}
        />
      ))}
    </div>
  );
};

export const StatusSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Skeleton className="mb-8" height="h-8" />
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <Skeleton lines={1} height="h-6" className="mb-4" />
          <div className="flex gap-2">
            <Skeleton height="h-10" className="flex-1" />
            <Skeleton height="h-10" className="w-24" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <Skeleton lines={3} height="h-4" className="mb-4" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton lines={2} height="h-4" />
            <Skeleton lines={2} height="h-4" />
            <Skeleton lines={2} height="h-4" />
            <Skeleton lines={2} height="h-4" />
          </div>
          <Skeleton height="h-20" className="mt-6" />
        </div>
      </div>
    </div>
  );
};

export default Skeleton;
