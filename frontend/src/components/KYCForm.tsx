import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import ProgressBar from './ProgressBar';
import FileUpload from './FileUpload';
import { KYCData, FormErrors } from '../types/kyc';
import { kycApi } from '../services/kycApi';

const KYCForm: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<KYCData>({
    merchant_name: '',
    business_name: '',
    business_type: '',
    expected_volume: '',
    status: 'draft',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [filePreviews, setFilePreviews] = useState<{
    pan_card?: string;
    aadhaar_card?: string;
    bank_statement?: string;
    pan_card_info?: { name: string; size: string };
    aadhaar_card_info?: { name: string; size: string };
    bank_statement_info?: { name: string; size: string };
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Auto redirect to home after successful submission
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        navigate('/');
      }, 3000); // Redirect after 3 seconds
      
      return () => clearTimeout(timer);
    }
  }, [showSuccess, navigate]);

  // Live validation
  const validateField = (name: string, value: string | File): string => {
    if (name === 'merchant_name' && typeof value === 'string') {
      if (!value.trim()) return 'Merchant name is required';
      if (value.length < 3) return 'Name must be at least 3 characters';
    }
    if (name === 'business_name' && typeof value === 'string') {
      if (!value.trim()) return 'Business name is required';
    }
    if (name === 'business_type' && typeof value === 'string') {
      if (!value.trim()) return 'Business type is required';
    }
    if (name === 'expected_volume' && typeof value === 'string') {
      if (!value.trim()) return 'Expected volume is required';
      if (isNaN(Number(value))) return 'Must be a valid number';
    }
    if (name === 'email' && typeof value === 'string') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) return 'Invalid email format';
    }
    return '';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Live validation
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      setFormData(prev => ({ ...prev, [name]: file }));
      
      // Create preview for image files
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreviews(prev => ({ 
            ...prev, 
            [name]: reader.result as string,
            [`${name}_info`]: { name: file.name, size: (file.size / 1024 / 1024).toFixed(2) + 'MB' }
          }));
        };
        reader.readAsDataURL(file);
      } else {
        // For non-image files, just store info
        setFilePreviews(prev => ({ 
          ...prev, 
          [`${name}_info`]: { name: file.name, size: (file.size / 1024 / 1024).toFixed(2) + 'MB' }
        }));
      }
    }
  };

  const handleFileRemove = (fieldName: 'pan_card' | 'aadhaar_card' | 'bank_statement') => {
    setFormData(prev => ({ ...prev, [fieldName]: undefined }));
    setFilePreviews(prev => {
      const newPreviews = { ...prev };
      delete newPreviews[fieldName];
      delete newPreviews[`${fieldName}_info`];
      return newPreviews;
    });
  };

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {};
    
    if (step === 1) {
      newErrors.merchant_name = validateField('merchant_name', formData.merchant_name);
      newErrors.business_name = validateField('business_name', formData.business_name);
      newErrors.business_type = validateField('business_type', formData.business_type);
      newErrors.expected_volume = validateField('expected_volume', formData.expected_volume);
    }
    
    if (step === 2) {
      if (!formData.pan_card) newErrors.pan_card = 'PAN card is required';
      if (!formData.aadhaar_card) newErrors.aadhaar_card = 'Aadhaar card is required';
    }
    
    if (step === 3) {
      if (!formData.bank_statement) newErrors.bank_statement = 'Bank statement is required';
    }
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) return;
    
    setIsSubmitting(true);
    try {
      const submitData = new FormData();
      submitData.append('merchant_name', formData.merchant_name);
      submitData.append('business_name', formData.business_name);
      submitData.append('business_type', formData.business_type);
      submitData.append('expected_volume', formData.expected_volume);
      submitData.append('status', 'submitted');
      
      if (formData.pan_card) submitData.append('pan_card', formData.pan_card);
      if (formData.aadhaar_card) submitData.append('aadhaar_card', formData.aadhaar_card);
      if (formData.bank_statement) submitData.append('bank_statement', formData.bank_statement);
      
      await kycApi.submitKYC(submitData);
      setShowSuccess(true);
      toast.success('KYC submitted successfully!');
    } catch (error) {
      console.error('Error submitting KYC:', error);
      setErrors({ submit: 'Failed to submit KYC. Please try again.' });
      toast.error('Failed to submit KYC. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">KYC Submitted Successfully!</h2>
          <p className="text-gray-600 mb-2">Your application has been submitted and is under review.</p>
          <p className="text-sm text-gray-500">You will be redirected to the home page automatically...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 mt-0 pt-0">
      <div className="max-w-4xl mx-auto px-4">
        <h1 
          className="text-3xl font-bold text-center mb-8 mt-8"
          style={{
            background: 'linear-gradient(90deg, #177cc0, #71b03e)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          KYC Application
        </h1>
        
        <ProgressBar currentStep={currentStep} totalSteps={3} />
        
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8">
          <AnimatePresence mode="wait">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="merchant_name"
                  value={formData.merchant_name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.merchant_name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your full name"
                />
                {errors.merchant_name && (
                  <p className="mt-1 text-sm text-red-500">{errors.merchant_name}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Name *
                </label>
                <input
                  type="text"
                  name="business_name"
                  value={formData.business_name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.business_name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your business name"
                />
                {errors.business_name && (
                  <p className="mt-1 text-sm text-red-500">{errors.business_name}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Type *
                </label>
                <select
                  name="business_type"
                  value={formData.business_type}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.business_type ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select business type</option>
                  <option value="sole_proprietor">Sole Proprietor</option>
                  <option value="partnership">Partnership</option>
                  <option value="private_limited">Private Limited</option>
                  <option value="public_limited">Public Limited</option>
                </select>
                {errors.business_type && (
                  <p className="mt-1 text-sm text-red-500">{errors.business_type}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Monthly Volume *
                </label>
                <input
                  type="text"
                  name="expected_volume"
                  value={formData.expected_volume}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.expected_volume ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter expected monthly volume"
                />
                {errors.expected_volume && (
                  <p className="mt-1 text-sm text-red-500">{errors.expected_volume}</p>
                )}
              </div>
              </motion.div>
            )}
          
          {/* Step 2: Documents */}
          {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload Documents</h2>
              
              <FileUpload
                name="pan_card"
                label="PAN Card"
                value={formData.pan_card}
                onChange={(file) => setFormData(prev => ({ ...prev, pan_card: file }))}
                onRemove={() => setFormData(prev => ({ ...prev, pan_card: undefined }))}
                error={errors.pan_card}
                required
              />
              
              <FileUpload
                name="aadhaar_card"
                label="Aadhaar Card"
                value={formData.aadhaar_card}
                onChange={(file) => setFormData(prev => ({ ...prev, aadhaar_card: file }))}
                onRemove={() => setFormData(prev => ({ ...prev, aadhaar_card: undefined }))}
                error={errors.aadhaar_card}
                required
              />
              </motion.div>
            )}
          
          {/* Step 3: Bank Details */}
          {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Bank Details</h2>
              
              <FileUpload
                name="bank_statement"
                label="Bank Statement"
                value={formData.bank_statement}
                onChange={(file) => setFormData(prev => ({ ...prev, bank_statement: file }))}
                onRemove={() => setFormData(prev => ({ ...prev, bank_statement: undefined }))}
                error={errors.bank_statement}
                required
              />
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentStep === 1}
              className={`px-6 py-2 rounded-md font-medium ${
                currentStep === 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
              }`}
            >
              Previous
            </button>
            
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2 text-white rounded-md font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                style={{
                  background: 'linear-gradient(90deg, #177cc0, #71b03e)',
                  border: 'none'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(90deg, #1565a0, #5f9035)';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(90deg, #177cc0, #71b03e)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 text-white rounded-md font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center gap-2"
                style={{
                  background: 'linear-gradient(90deg, #177cc0, #71b03e)',
                  border: 'none'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(90deg, #1565a0, #5f9035)';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(90deg, #177cc0, #71b03e)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  'Submit KYC'
                )}
              </button>
            )}
          </div>
          
          {errors.submit && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
              {errors.submit}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default KYCForm;
