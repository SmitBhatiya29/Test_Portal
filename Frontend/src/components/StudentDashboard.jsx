import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { LayoutDashboard, BookOpen, Award, Calendar, HelpCircle, LogOut, User, ChevronDown, Menu } from 'lucide-react';
import StudentSidebar from './StudentSidebar';
import AssessmentSection from './student/AssessmentSection';
import ResultSection from './student/ResultSection';
import TestPlannerSection from './student/TestPlannerSection';
import ProfileDropdown from './student/ProfileDropdown';

import axios from 'axios';

const DEFAULT_PROFILE_IMAGE = 'https://cdn-icons-png.flaticon.com/512/149/149071.png'; // default profile pic

const StudentDashboard = ({ onLogout }) => {
  const [currentSection, setCurrentSection] = useState('dashboard');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  // Student info state, initially empty
  const [studentInfo, setStudentInfo] = useState({
    name: '',
    batch: '',
    institute: '',
    rollNo: '',
    enrollmentNo: '',
    phone: '',
    email: '',
    course: '',
    semester: '',
    profileImage: DEFAULT_PROFILE_IMAGE,
  });

  // Fetch student profile on mount
 // Update the setStudentInfo mapping in useEffect
 useEffect(() => {
   const token = localStorage.getItem('token');
   
   if (!token) {
     console.error('No token found');
     onLogout();
     return;
   }

   axios.get('http://localhost:5000/api/students/profile', { 
     headers: {
       'Authorization': `Bearer ${token}`
     }
   })
   .then(response => {
     const data = response.data.student;
     const profileImage = data.profileImage && data.profileImage.trim() !== ''
       ? data.profileImage
       : DEFAULT_PROFILE_IMAGE;
   
     setStudentInfo({
       name: data.name || '',
       batch: data.batchRollNo || '',
       institute: data.institute || '',
       rollNo: data.batchRollNo || '',
       enrollmentNo: data.enrollmentNo || '',
       phone: data.phoneNo || '',
       email: data.email || '',
       course: data.branch || '',
       semester: data.databaseName || '',
       profileImage,
     });
   })
   .catch(error => {
     console.error('Failed to fetch student profile:', error);
     if (error.response?.status === 401) {
       // Redirect to login or handle unauthorized access
       onLogout();
     }
   });
 }, [onLogout]);

  const DashboardCard = ({ title, value, icon, color, subtext }) => (
    <div className={`${color} rounded-lg p-4 md:p-6`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-700 font-medium text-sm md:text-base">{title}</h3>
        {icon}
      </div>
      <p className="text-xl md:text-2xl font-bold text-gray-900">{value}</p>
      {subtext && <p className="text-xs md:text-sm text-gray-600 mt-1">{subtext}</p>}
    </div>
  );

  DashboardCard.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    icon: PropTypes.node.isRequired,
    color: PropTypes.string.isRequired,
    subtext: PropTypes.string,
  };

  const renderContent = () => {
    switch (currentSection) {
      case 'assessment':
        return <AssessmentSection />;
      case 'result':
        return <ResultSection />;
      case 'planner':
        return <TestPlannerSection />;
      case 'support':
        return (
          <div className="p-4 md:p-6">
            <h2 className="text-xl md:text-2xl font-semibold mb-4">Support</h2>
            <div className="bg-white rounded-lg shadow p-4 md:p-6">
              <p className="text-gray-600">Contact support at support@example.com</p>
            </div>
          </div>
        );
      default:
        return (
          <div className="p-4 md:p-6">
            <h2 className="text-xl md:text-2xl font-semibold mb-6">Welcome, {studentInfo.name || 'Student'}!</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <DashboardCard
                title="Upcoming Tests"
                value="3"
                icon={<BookOpen className="text-blue-500" />}
                color="bg-blue-50"
              />
              <DashboardCard
                title="Completed Tests"
                value="12"
                icon={<Award className="text-green-500" />}
                color="bg-green-50"
              />
              <DashboardCard
                title="Average Score"
                value="85%"
                icon={<Award className="text-purple-500" />}
                color="bg-purple-50"
              />
              <DashboardCard
                title="Next Test"
                value="Physics"
                subtext="Tomorrow, 10:00 AM"
                icon={<Calendar className="text-orange-500" />}
                color="bg-orange-50"
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden ${showMobileSidebar ? 'block' : 'hidden'}`} 
           onClick={() => setShowMobileSidebar(false)}>
        <div className="absolute inset-y-0 left-0 w-64" onClick={e => e.stopPropagation()}>
          <StudentSidebar
            currentSection={currentSection}
            onSectionChange={(section) => {
              setCurrentSection(section);
              setShowMobileSidebar(false);
            }}
            onLogout={onLogout}
          />
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <StudentSidebar
          currentSection={currentSection}
          onSectionChange={setCurrentSection}
          onLogout={onLogout}
        />
      </div>

      <div className="flex-1">
        <header className="bg-white shadow-sm">
          <div className="flex justify-between items-center px-4 md:px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowMobileSidebar(true)}
                className="lg:hidden text-gray-600 hover:text-gray-900"
              >
                <Menu size={24} />
              </button>
              <h1 className="text-lg md:text-xl font-semibold text-gray-900">
                {currentSection.charAt(0).toUpperCase() + currentSection.slice(1)}
              </h1>
            </div>
            <div className="relative">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
              >
                <img
                  src={studentInfo.profileImage || DEFAULT_PROFILE_IMAGE}
                  alt={studentInfo.name || 'Student'}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="hidden md:inline">{studentInfo.name || 'Student'}</span>
                <ChevronDown size={16} />
              </button>
              {showProfileDropdown && (
                <ProfileDropdown
                  studentInfo={studentInfo}
                  onClose={() => setShowProfileDropdown(false)}
                />
              )}
            </div>
          </div>
        </header>
        <main className="p-4 md:p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

StudentDashboard.propTypes = {
  onLogout: PropTypes.func.isRequired,
};

export default StudentDashboard;
