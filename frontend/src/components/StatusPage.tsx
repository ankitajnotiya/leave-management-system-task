import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { LeaveRequestData } from '../types/kyc';
import { leaveApi } from '../services/kycApi';
import { StatusSkeleton } from './Skeleton';

const StatusPage: React.FC = () => {
  const [searchId, setSearchId] = useState('');
  const [leaveData, setLeaveData] = useState<LeaveRequestData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [estimatedTime, setEstimatedTime] = useState<string>('');

  const calculateEstimatedTime = (status: string, createdAt?: string): string => {
    if (!createdAt) return 'Unknown';
    
    const createdDate = new Date(createdAt);
    const now = new Date();
    const hoursElapsed = (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60);
    
    switch (status) {
      case 'pending':
        if (hoursElapsed < 2) return 'Your leave request will be reviewed in 2 hours';
        if (hoursElapsed < 6) return 'Your leave request will be reviewed in 1 hour';
        return 'Your leave request will be reviewed shortly';
      case 'approved':
        return 'Your leave request has been approved!';
      case 'rejected':
        return 'Your leave request has been rejected. Please contact your manager.';
      default:
        return 'Processing...';
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchId.trim()) {
      setError('Please enter a valid Leave Request ID');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const data = await leaveApi.getLeaveRequest(Number(searchId));
      setLeaveData(data);
      setEstimatedTime(calculateEstimatedTime(data.status, data.created_at));
      toast.success('Leave request status found successfully!');
    } catch (err) {
      setError('Leave request not found. Please check your ID and try again.');
      setLeaveData(null);
      toast.error('Leave request not found. Please check your ID and try again.');
    } finally {
      setLoading(false);
    }
  };

  // const getStatusColor = (status: string): string => {
  //   switch (status) {
  //     case 'approved':
  //       return 'bg-green-100 text-green-800';
  //     case 'rejected':
  //       return 'bg-red-100 text-red-800';
  //     case 'under_review':
  //       return 'bg-yellow-100 text-yellow-800';
  //     case 'more_info_requested':
  //       return 'bg-orange-100 text-orange-800';
  //     default:
  //       return 'bg-blue-100 text-blue-800';
  //   }
  // };

  const getStatusIcon = (status: string): string => {
    switch (status) {
      case 'approved':
        return '✓';
      case 'rejected':
        return '✗';
      case 'under_review':
        return '⏳';
      case 'more_info_requested':
        return '!';
      default:
        return '📋';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 mt-0 pt-0">
      <div className="max-w-2xl mx-auto px-4">
        <h1 
          className="text-3xl font-bold text-center mt-8 mb-4 text-lg md:text-3xl"
          style={{
            background: 'linear-gradient(90deg, #177cc0, #71b03e)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Check Leave Management Status
        </h1>
        
        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 mt-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontSize: '14px' }}>
                KYC Application ID
              </label> 
              <div className="flex flex-col md:flex-row gap-2">
                <input
                  type="text"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  placeholder="Enter your KYC ID (e.g., 1, 2, 3...)"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 text-white rounded-md font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 w-full md:w-auto"
                  style={{
                    background: 'linear-gradient(90deg, #177cc0, #71b03e)',
                    border: 'none'
                  }}
                  onMouseOver={(e) => {
                    if (!loading) {
                      e.currentTarget.style.background = 'linear-gradient(90deg, #1565a0, #5f9035)';
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(90deg, #177cc0, #71b03e)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  {loading ? 'Searching...' : 'Search'}
                </button>
              </div>
            </div>
          </form>
          
          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
              {error}
            </div>
          )}
        </div>
        
        {/* Status Display */}
        {leaveData && (
          <div className="bg-white rounded-lg shadow-md p-6">
            {loading ? (
              <StatusSkeleton />
            ) : (
              <>
                <div className="space-y-6">
                  {/* Header */}
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                      <span className="text-2xl">{getStatusIcon(leaveData.status)}</span>
                    </div>
                  </div>
                
                  {/* Application Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Application ID</p>
                      <p className="font-medium text-gray-800">#{leaveData.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Employee Name</p>
                      <p className="font-medium text-gray-800">{leaveData.employee_name || 'Unknown'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Leave Type</p>
                      <p className="font-medium text-gray-800">{leaveData.leave_type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Submitted On</p>
                      <p className="font-medium text-gray-800">
                        {leaveData.created_at ? new Date(leaveData.created_at).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Estimated Time */}
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-blue-800">
                          {estimatedTime}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Risk Indicator */}
                  {leaveData.is_overdue && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-red-800">
                            This leave request is overdue for review
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusPage;
