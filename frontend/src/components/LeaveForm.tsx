import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { LeaveRequestData, FormErrors, UserProfile } from '../types/kyc';
import { leaveApi } from '../services/kycApi';

const LeaveForm: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<LeaveRequestData & { applicant_name?: string; employee_identifier?: string }>({
    leave_type: 'casual',
    start_date: '',
    end_date: '',
    leave_reason: '',
    status: 'pending',
    applicant_name: '',
    employee_identifier: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [employees, setEmployees] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Load user profile, current user, and employees on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [profile, user, employeesList] = await Promise.all([
          leaveApi.getUserProfile(),
          leaveApi.getCurrentUser(),
          leaveApi.getEmployees()
        ]);
        setUserProfile(profile);
        setCurrentUser(user);
        setEmployees(employeesList);
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };
    loadData();
  }, []);

  // Auto redirect to home after successful submission
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        navigate('/');
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [showSuccess, navigate]);

  // Live validation
  const validateField = (name: string, value: string): string => {
    if (name === 'leave_type' && !value) return 'Leave type is required';
    if (name === 'start_date' && !value) return 'Start date is required';
    if (name === 'end_date' && !value) return 'End date is required';
    if (name === 'applicant_name' && !value.trim()) return 'Employee name is required';
    if (name === 'employee_identifier' && !value.trim()) return 'Employee ID is required';
    if (name === 'leave_reason' && typeof value === 'string') {
      if (!value.trim()) return 'Leave reason is required';
      if (value.length < 10) return 'Please provide a detailed reason (minimum 10 characters)';
    }
    
    // Date validation
    if (name === 'end_date' && formData.start_date && value) {
      if (new Date(value) < new Date(formData.start_date)) {
        return 'End date must be after start date';
      }
    }
    
    return '';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Live validation
    const error = validateField(name, value);
    setErrors(prev => ({ 
      ...prev, 
      [name]: error 
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    // Only validate fields for current step
    if (currentStep === 1) {
      // Step 1 fields: leave_type, start_date, end_date, applicant_name, employee_identifier
      const step1Fields = ['leave_type', 'start_date', 'end_date', 'applicant_name', 'employee_identifier'];
      step1Fields.forEach(key => {
        const value = formData[key as keyof (LeaveRequestData & { applicant_name?: string; employee_identifier?: string })];
        if (typeof value === 'string') {
          const error = validateField(key, value);
          if (error) newErrors[key] = error;
        }
      });
    } else if (currentStep === 2) {
      // Step 2 fields: leave_reason
      const step2Fields = ['leave_reason'];
      step2Fields.forEach(key => {
        const value = formData[key as keyof LeaveRequestData];
        if (typeof value === 'string') {
          const error = validateField(key, value);
          if (error) newErrors[key] = error;
        }
      });
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateDays = (): number => {
    if (!formData.start_date || !formData.end_date) return 0;
    const start = new Date(formData.start_date);
    const end = new Date(formData.end_date);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix all errors before submitting');
      return;
    }

    const leaveDays = calculateDays();
    if (userProfile && userProfile.remaining_leaves < leaveDays) {
      toast.error(`Insufficient leave balance. Available: ${userProfile.remaining_leaves}, Required: ${leaveDays}`);
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Ensure data is sent with correct key names
      const dataToSubmit = {
        ...formData,
        applicant_name: formData.applicant_name, // Form se uthaya gaya naam
        employee_identifier: formData.employee_identifier, // Form se uthayi gayi ID
        employee: currentUser?.id || 1 // Backend relationship ke liye Ankit ki ID
      };
      
      console.log('Submitting data:', dataToSubmit);
      await leaveApi.submitLeaveRequest(dataToSubmit);
      setShowSuccess(true);
      toast.success('Leave request submitted successfully!');
    } catch (error: any) {
      console.error('Submission error:', error);
      if (error.response?.data) {
        const apiErrors = error.response.data;
        const formattedErrors: FormErrors = {};
        
        if (typeof apiErrors === 'object') {
          Object.keys(apiErrors).forEach(key => {
            formattedErrors[key] = Array.isArray(apiErrors[key]) 
              ? apiErrors[key][0] 
              : apiErrors[key];
          });
        }
        
        setErrors(formattedErrors);
        toast.error('Please fix the errors and try again');
      } else {
        toast.error('Failed to submit leave request. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (validateForm()) {
      setCurrentStep(prev => prev + 1);
    } else {
      toast.error('Please fix all errors before proceeding');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const leaveTypes = [
    { value: 'sick', label: 'Sick Leave' },
    { value: 'casual', label: 'Casual Leave' },
    { value: 'earned', label: 'Earned Leave' },
    { value: 'maternity', label: 'Maternity Leave' },
    { value: 'paternity', label: 'Paternity Leave' },
  ];

  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 text-center"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Leave Request Submitted!</h2>
          <p className="text-gray-600 mb-4">Your leave request has been submitted successfully and is pending approval.</p>
          <p className="text-sm text-gray-500">Redirecting to home page...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div 
            className="p-6 text-white"
            style={{
              background: 'linear-gradient(90deg, #177cc0, #71b03e)'
            }}
          >
            <h1 className="text-3xl font-bold text-center">Leave Application</h1>
            <p className="text-center mt-2 text-blue-100">Submit your leave request</p>
          </div>

          
          {/* User Profile Info */}
          {userProfile && (
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 m-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    <span className="font-medium">Your Remaining Leaves:</span> {userProfile.remaining_leaves} / {userProfile.total_leaves}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Progress Bar */}
          <div className="px-6 pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Step {currentStep} of 2</span>
              <span className="text-sm text-gray-500">Leave Application</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full"
                initial={{ width: '50%' }}
                animate={{ width: currentStep === 1 ? '50%' : '100%' }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Leave Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="leave_type"
                      value={formData.leave_type}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.leave_type ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      {leaveTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                    {errors.leave_type && (
                      <p className="mt-1 text-sm text-red-600">{errors.leave_type}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Employee Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="applicant_name"
                      value={formData.applicant_name}
                      onChange={handleInputChange}
                      placeholder="Enter employee name"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.applicant_name ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.applicant_name && (
                      <p className="mt-1 text-sm text-red-600">{errors.applicant_name}</p>
                    )}
                    <p className="mt-1 text-sm text-gray-500">
                      Enter the name of the employee applying for leave
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Employee ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="employee_identifier"
                      value={formData.employee_identifier || ''}
                      onChange={handleInputChange}
                      placeholder="Enter employee ID )"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.employee_identifier ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.employee_identifier && (
                      <p className="mt-1 text-sm text-red-600">{errors.employee_identifier}</p>
                    )}
                    <p className="mt-1 text-sm text-gray-500">
                      Enter the employee ID for tracking purposes
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="start_date"
                        value={formData.start_date}
                        onChange={handleInputChange}
                        min={new Date().toISOString().split('T')[0]}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.start_date ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.start_date && (
                        <p className="mt-1 text-sm text-red-600">{errors.start_date}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="end_date"
                        value={formData.end_date}
                        onChange={handleInputChange}
                        min={formData.start_date || new Date().toISOString().split('T')[0]}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.end_date ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.end_date && (
                        <p className="mt-1 text-sm text-red-600">{errors.end_date}</p>
                      )}
                    </div>
                  </div>

                  {formData.start_date && formData.end_date && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-sm text-blue-700">
                        <strong>Total Leave Days:</strong> {calculateDays()} days
                      </p>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={nextStep}
                      className="px-6 py-2 text-white rounded-lg transition-all duration-200 hover:scale-105"
                      style={{
                        background: 'linear-gradient(90deg, #177cc0, #71b03e)'
                      }}
                    >
                      Next Step
                    </button>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Leave Reason <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="leave_reason"
                      value={formData.leave_reason}
                      onChange={handleInputChange}
                      rows={6}
                      placeholder="Please provide a detailed reason for your leave request..."
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                        errors.leave_reason ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.leave_reason && (
                      <p className="mt-1 text-sm text-red-600">{errors.leave_reason}</p>
                    )}
                    <p className="mt-1 text-sm text-gray-500">
                      {formData.leave_reason.length}/500 characters
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-2">Review Your Application</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Employee Name:</span>
                        <span className="font-medium">{formData.applicant_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Employee ID:</span>
                        <span className="font-medium">{formData.employee_identifier}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Leave Type:</span>
                        <span className="font-medium">{leaveTypes.find(t => t.value === formData.leave_type)?.label}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Period:</span>
                        <span className="font-medium">{formData.start_date} to {formData.end_date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Days:</span>
                        <span className="font-medium">{calculateDays()} days</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      Previous
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                      style={{
                        background: 'linear-gradient(90deg, #177cc0, #71b03e)'
                      }}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Leave Request'}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default LeaveForm;
