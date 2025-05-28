import React from 'react';
import { User, Mail, Phone, BookOpen, Building, Hash } from 'lucide-react';
import PropTypes from 'prop-types';

const DEFAULT_PROFILE_IMAGE = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 text-sm">
    <span className="text-gray-500">{icon}</span>
    <span className="text-gray-600 hidden sm:inline">{label}:</span>
    <span className="font-medium truncate">{value}</span>
  </div>
);

InfoRow.propTypes = {
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

const ProfileDropdown = ({ studentInfo, onClose }) => {
  return (
    <div className="absolute right-0 top-12 w-[280px] sm:w-80 bg-white rounded-lg shadow-lg border p-4 z-50">
      <div className="flex items-center gap-4 pb-4 border-b">
        <img
          src={studentInfo.profileImage && studentInfo.profileImage.trim() !== '' ? studentInfo.profileImage : DEFAULT_PROFILE_IMAGE}
          alt={studentInfo.name}
          className="w-12 sm:w-16 h-12 sm:h-16 rounded-full object-cover"
        />
        <div>
          <h3 className="font-semibold text-base sm:text-lg">{studentInfo.name}</h3>
          <p className="text-gray-600 text-sm">{studentInfo.course}</p>
        </div>
      </div>
      
      <div className="space-y-3 mt-4">
        <InfoRow icon={<Building size={18} />} label="Institute" value={studentInfo.institute} />
        <InfoRow icon={<BookOpen size={18} />} label="Batch" value={studentInfo.batch} />
        <InfoRow icon={<Hash size={18} />} label="Roll No" value={studentInfo.rollNo} />
        <InfoRow icon={<Hash size={18} />} label="Enrollment" value={studentInfo.enrollmentNo} />
        <InfoRow icon={<Phone size={18} />} label="Phone" value={studentInfo.phone} />
        <InfoRow icon={<Mail size={18} />} label="Email" value={studentInfo.email} />
      </div>
    </div>
  );
};

ProfileDropdown.propTypes = {
  studentInfo: PropTypes.shape({
    name: PropTypes.string.isRequired,
    batch: PropTypes.string.isRequired,
    institute: PropTypes.string.isRequired,
    rollNo: PropTypes.string.isRequired,
    enrollmentNo: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    course: PropTypes.string.isRequired,
    profileImage: PropTypes.string,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ProfileDropdown;
