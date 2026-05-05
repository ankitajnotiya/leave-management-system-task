import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// FAQ Item Component
interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 transition-colors duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
      >
        <span className="font-medium text-gray-800">{question}</span>
        <svg
          className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <p className="text-gray-600">{answer}</p>
        </div>
      )}
    </div>
  );
};

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleStartApplication = () => {
    navigate('/leave-form');
  };

  const handleCheckStatus = () => {
    navigate('/status');
  };

  // const handleAdminDashboard = () => {
  //   navigate('/admin');
  // };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white mt-0 pt-0">
      {/* Hero Section */}
<div
  className="text-white"
  style={{
    background: 'linear-gradient(90deg, #177cc0, #71b03e)'
  }}
>        <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-lg sm:text-4xl md:text-5xl">
              Need a Leave?
            </h1>
            <p className="text-xl sm:text-2xl mb-8 text-blue-100">
              Workforce Management Simplified – Plan, Track, and Manage Leaves with Ease.
            </p>
            <button
              onClick={handleStartApplication}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
            >
              Apply for Leave
            </button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 
            className="text-3xl font-bold text-center mb-12 text-lg md:text-3xl"
            style={{
              background: 'linear-gradient(90deg, #177cc0, #71b03e)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Trusted by Organizations
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 ease-in-out group">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 group-hover:scale-110 transition-all duration-300">
                <svg className="w-8 h-8 text-blue-600 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="text-4xl font-bold text-gray-800 mb-2 text-center group-hover:text-blue-600 transition-colors duration-300">100+</div>
              <div className="text-gray-600 text-center group-hover:text-gray-700 transition-colors duration-300">Employees Managed</div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 ease-in-out group">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 group-hover:scale-110 transition-all duration-300">
                <svg className="w-8 h-8 text-green-600 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <div className="text-4xl font-bold text-gray-800 mb-2 text-center group-hover:text-green-600 transition-colors duration-300">500+</div>
              <div className="text-gray-600 text-center group-hover:text-gray-700 transition-colors duration-300">Leaves Processed</div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 ease-in-out group">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 group-hover:scale-110 transition-all duration-300">
                <svg className="w-8 h-8 text-purple-600 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="text-4xl font-bold text-gray-800 mb-2 text-center group-hover:text-purple-600 transition-colors duration-300">99%</div>
              <div className="text-gray-600 text-center group-hover:text-gray-700 transition-colors duration-300">Approval Accuracy</div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 
            className="text-3xl font-bold text-center mb-12 text-lg md:text-3xl"
            style={{
              background: 'linear-gradient(90deg, #177cc0, #71b03e)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            How It Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="text-center transform hover:-translate-y-3 transition-all duration-300 ease-in-out group">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 group-hover:scale-110 transition-all duration-300 shadow-md group-hover:shadow-lg">
                <span className="text-2xl font-bold text-blue-600 group-hover:text-blue-700 transition-colors duration-300">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                Complete Form
              </h3>
              <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                Enter your personal information
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center transform hover:-translate-y-3 transition-all duration-300 ease-in-out group">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 group-hover:scale-110 transition-all duration-300 shadow-md group-hover:shadow-lg">
                <span className="text-2xl font-bold text-blue-600 group-hover:text-blue-700 transition-colors duration-300">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                Real-time Tracking
              </h3>
              <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                Instantly view leave balances and team availability
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center transform hover:-translate-y-3 transition-all duration-300 ease-in-out group">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 group-hover:scale-110 transition-all duration-300 shadow-md group-hover:shadow-lg">
                <span className="text-2xl font-bold text-blue-600 group-hover:text-blue-700 transition-colors duration-300">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                Admin Review
              </h3>
              <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                Your manager or admin reviews the request
              </p>
            </div>

            {/* Step 4 */}
            <div className="text-center transform hover:-translate-y-3 transition-all duration-300 ease-in-out group">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 group-hover:scale-110 transition-all duration-300 shadow-md group-hover:shadow-lg">
                <span className="text-2xl font-bold text-blue-600 group-hover:text-blue-700 transition-colors duration-300">4</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                Get Approved
              </h3>
              <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                Receive verification status
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div 
        className="py-16"
        style={{
          background: 'linear-gradient(135deg, rgba(23, 124, 192, 0.05) 0%, rgba(113, 176, 62, 0.05) 100%)'
        }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <h2 
            className="text-3xl font-bold text-center mb-12 text-lg md:text-3xl"
            style={{
              background: 'linear-gradient(90deg, #177cc0, #71b03e)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Why Choose Our Leave Management Platform?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 ease-in-out group">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 group-hover:scale-110 transition-all duration-300">
                <svg className="w-6 h-6 text-green-600 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3 text-center group-hover:text-green-600 transition-colors duration-300">
                Quick Approvals
              </h3>
              <p className="text-gray-600 text-center group-hover:text-gray-700 transition-colors duration-300">
                Get leave approvals quickly with real-time notifications
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 ease-in-out group">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 group-hover:scale-110 transition-all duration-300">
                <svg className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3 text-center group-hover:text-blue-600 transition-colors duration-300">
                Data-Driven Strategy
              </h3>
              <p className="text-gray-600 text-center group-hover:text-gray-700 transition-colors duration-300">
                Convert reactive chaos into structured management
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 ease-in-out group">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 group-hover:scale-110 transition-all duration-300">
                <svg className="w-6 h-6 text-purple-600 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3 text-center group-hover:text-purple-600 transition-colors duration-300">
                Real-time Updates
              </h3>
              <p className="text-gray-600 text-center group-hover:text-gray-700 transition-colors duration-300">
                Track your application status in real-time with live updates
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Who Can Use This Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 
            className="text-3xl font-bold text-center mb-12 text-lg md:text-3xl"
            style={{
              background: 'linear-gradient(90deg, #177cc0, #71b03e)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Who Can Use This?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-blue-100">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">For Employees</h3>
              <p className="text-gray-600 text-center">
                Apply leaves in 1-click, check balance, and track history.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-green-100">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">For Admins</h3>
              <p className="text-gray-600 text-center">
                One-click approval, leave analytics, and team management.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 
            className="text-3xl font-bold text-center mb-12 text-lg md:text-3xl"
            style={{
              background: 'linear-gradient(90deg, #177cc0, #71b03e)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-4">
            <FAQItem 
              question="Can I cancel a pending leave?" 
              answer="Yes, through your dashboard. You can cancel any pending leave request before it's approved." 
            />
            <FAQItem 
              question="How is leave balance calculated?" 
              answer="Automatically deducted on approval. Your remaining balance updates in real-time." 
            />
            <FAQItem 
              question="What types of leaves can I apply for?" 
              answer="Sick Leave, Casual Leave, Earned Leave, Maternity Leave, and Paternity Leave." 
            />
            <FAQItem 
              question="How quickly are leaves approved?" 
              answer="Most leaves are approved within 24 hours by your manager or admin." 
            />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div 
        className="py-16 text-white"
        style={{
          background: 'linear-gradient(135deg, #177cc0 0%, #71b03e 100%)'
        }}
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-lg md:text-3xl">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
            Join thousands of employees who manage their leaves efficiently
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleStartApplication}
              className="px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              style={{
                backgroundColor: 'white',
                color: '#177cc0',
                border: '2px solid rgba(255, 255, 255, 0.8)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.color = '#177cc0';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.color = '#177cc0';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              Start Application
            </button>
            <button
              onClick={handleCheckStatus}
              className="px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              style={{
                backgroundColor: 'white',
                color: '#177cc0',
                border: '2px solid rgba(255, 255, 255, 0.8)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.color = '#177cc0';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.color = '#177cc0';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              Check Status
            </button>
          </div>
        </div>
      </div>

      {/* Admin Access */}
      {/* <div className="py-8 bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm mb-2">Admin Access</p>
          <button
            onClick={handleAdminDashboard}
            className="text-blue-400 hover:text-blue-300 underline text-sm"
          >
            Review Dashboard →
          </button>
        </div>
      </div>
 */}
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <h3 
                className="text-lg font-semibold mb-4"
                style={{
                  background: 'linear-gradient(90deg, #177cc0, #71b03e)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Product
              </h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors" style={{ transition: 'color 0.3s' }}>Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors" style={{ transition: 'color 0.3s' }}>Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors" style={{ transition: 'color 0.3s' }}>Security</a></li>
              </ul>
            </div>
            <div className="md:col-span-1">
              <h3 
                className="text-lg font-semibold mb-4"
                style={{
                  background: 'linear-gradient(90deg, #177cc0, #71b03e)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Company
              </h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors" style={{ transition: 'color 0.3s' }}>About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors" style={{ transition: 'color 0.3s' }}>Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors" style={{ transition: 'color 0.3s' }}>Careers</a></li>
              </ul>
            </div>
            <div className="col-span-2 md:col-span-1">
              <h3 
                className="text-lg font-semibold mb-4"
                style={{
                  background: 'linear-gradient(90deg, #177cc0, #71b03e)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Support
              </h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors" style={{ transition: 'color 0.3s' }}>Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors" style={{ transition: 'color 0.3s' }}>Contact</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors" style={{ transition: 'color 0.3s' }}>Status</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              &copy; 2026 Leave Management. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
