import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { LeaveRequestData } from '../types/kyc';
import { leaveApi } from '../services/kycApi';

const AdminDashboard: React.FC = () => {
  const [leaveQueue, setLeaveQueue] = useState<LeaveRequestData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequestData | null>(null);

  useEffect(() => {
    fetchLeaveQueue();
  }, []);

  const fetchLeaveQueue = async () => {
    try {
      setError('');
      setRefreshLoading(true);
      setLoading(true);
      
      // Add 2 second delay for demo purposes
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const data = await leaveApi.getLeaveQueue();
      setLeaveQueue(data);
    } catch (err) {
      setError('Failed to fetch leave requests');
    } finally {
      setLoading(false);
      setRefreshLoading(false);
    }
  };

  const handleStatusUpdate = async (leaveId: number, newStatus: string) => {
    try {
      await leaveApi.updateLeaveStatus(leaveId, { status: newStatus as any });
      await fetchLeaveQueue();
      setSelectedLeave(null);
      toast.success(`Leave request ${newStatus} successfully`);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to update status';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'approved':
        return 'bg-green-500 text-white';
      case 'rejected':
        return 'bg-red-500 text-white';
      case 'pending':
        return 'bg-yellow-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getLeaveTypeLabel = (type: string): string => {
    switch (type) {
      case 'sick': return 'Sick Leave';
      case 'casual': return 'Casual Leave';
      case 'earned': return 'Earned Leave';
      case 'maternity': return 'Maternity Leave';
      case 'paternity': return 'Paternity Leave';
      default: return type;
    }
  };

  const isOverdue = (leave: LeaveRequestData): boolean => {
    return leave.is_overdue || false;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading Leave Requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 mt-0 pt-0">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center h-auto md:h-16 py-4 md:py-0">
            <div className="flex items-center mb-4 md:mb-0">
              <h1 
                className="text-xl font-bold text-lg md:text-xl"
                style={{
                  background: 'linear-gradient(90deg, #177cc0, #71b03e)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Leave Management Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={fetchLeaveQueue}
                disabled={refreshLoading}
                className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 w-auto md:w-auto text-sm"
              >
                {refreshLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Refreshing...
                  </>
                ) : (
                  'Refresh'
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Total Requests</h3>
            <p className="text-2xl font-bold text-gray-900">{leaveQueue.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Pending</h3>
            <p className="text-2xl font-bold text-yellow-600">
              {leaveQueue.filter(l => l.status === 'pending').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Overdue</h3>
            <p className="text-2xl font-bold text-red-600">
              {leaveQueue.filter(l => isOverdue(l)).length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Approved</h3>
            <p className="text-2xl font-bold text-green-600">
              {leaveQueue.filter(l => l.status === 'approved').length}
            </p>
          </div>
        </div>

        {/* Leave Requests Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {leaveQueue.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No leave requests found</h3>
              <p className="text-gray-500">There are currently no leave requests to review.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Leave Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Leave Dates
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reason
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {leaveQueue.map((leave) => (
                    <tr
                      key={leave.id}
                      className={`hover:bg-gray-50 ${isOverdue(leave) ? 'animate-pulse bg-red-50' : ''}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{leave.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <div className="font-medium">{leave.applicant_name || 'Unknown'}</div>
                          <div className="text-xs text-gray-500">{leave.employee_identifier || ''}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {getLeaveTypeLabel(leave.leave_type)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <div>{leave.start_date}</div>
                          <div className="text-xs text-gray-500">to {leave.end_date}</div>
                          <div className="text-xs font-medium text-blue-600">{leave.total_days} days</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="max-w-xs truncate" title={leave.leave_reason}>
                          {leave.leave_reason}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(leave.status)}`}>
                          {leave.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {leave.created_at ? new Date(leave.created_at).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => setSelectedLeave(leave)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          Review
                        </button>
                        {leave.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(leave.id!, 'approved')}
                              className="text-green-600 hover:text-green-900 mr-3"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(leave.id!, 'rejected')}
                              className="text-red-600 hover:text-red-900"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Review Modal */}
        {selectedLeave && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Review Leave Request #{selectedLeave.id}
                  </h3>
                  <button
                    onClick={() => setSelectedLeave(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Employee</p>
                      <p className="font-medium">{selectedLeave.applicant_name || 'Unknown'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Leave Type</p>
                      <p className="font-medium">{getLeaveTypeLabel(selectedLeave.leave_type)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Start Date</p>
                      <p className="font-medium">{selectedLeave.start_date}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">End Date</p>
                      <p className="font-medium">{selectedLeave.end_date}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Leave Reason</p>
                    <div className="p-3 bg-gray-50 rounded">
                      <p className="text-gray-900">{selectedLeave.leave_reason}</p>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-700">
                      <strong>Total Leave Days:</strong> {selectedLeave.total_days} days
                    </p>
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4">
                    {selectedLeave.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(selectedLeave.id!, 'approved')}
                          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(selectedLeave.id!, 'rejected')}
                          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
