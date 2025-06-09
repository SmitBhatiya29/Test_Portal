  import { User, Mail, Lock, Building, Camera } from 'lucide-react';
  import { useState, useEffect } from 'react';
  import axios from 'axios';

  const AccountSettings = () => {
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      role: 'Teacher',
      institute: '',
      profileImage: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400'
    });
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          return;
        }

        const res = await axios.get('http://localhost:5000/api/teachers/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = res.data;
        console.log('Fetched Teacher Profile:', data);
        setFormData({
          name: data.teacher.name || '',
          email: data.teacher.email || '',
          currentPassword: '' ,
          newPassword: '',
          confirmPassword: '',
          role: data.role || 'Teacher',
          institute: data.teacher.institute || '',
          profileImage: data.profileImage || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
        });
      } catch (error) {
        console.error('Error fetching teacher profile:', error);
        // Optional: logout or redirect if 401
        if (error.response?.status === 401) {
          // e.g. redirect or clear localStorage
          // localStorage.removeItem('token');
        }
      }
    };

    fetchProfile();
  }, []); 

    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
  e.preventDefault();

  const token = localStorage.getItem('token');
  if (!token) {
    console.error('No token found');
    return;
  }

  try {
    const response = await axios.put('http://localhost:5000/api/teachers/profile', {
      name: formData.name,
      email: formData.email,
      institute: formData.institute,
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword,
      confirmPassword: formData.confirmPassword
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('Profile updated successfully:', response.data);
    // Show success toast or UI feedback here
  } catch (error) {
    console.error('Error updating profile:', error.response?.data || error.message);
    // Show error toast or UI feedback here
  }
};


    return (
      <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="relative">
                <img
                  src={formData.profileImage}
                  alt={formData.name}
                  className="w-24 h-24 rounded-full object-cover"
                />
                <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border hover:bg-gray-50">
                  <Camera size={16} className="text-gray-600" />
                </button>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{formData.name}</h2>
                <p className="text-gray-500">{formData.email}</p>
                <span className="inline-block mt-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                  {formData.role}
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <User size={20} className="absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail size={20} className="absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Institute</label>
                <div className="relative">
                  <Building size={20} className="absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="text"
                    name="institute"
                    value={formData.institute}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Change Password</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                  <div className="relative">
                    <Lock size={20} className="absolute left-3 top-2.5 text-gray-400" />
                    <input
                      type="password"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <div className="relative">
                    <Lock size={20} className="absolute left-3 top-2.5 text-gray-400" />
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                  <div className="relative">
                    <Lock size={20} className="absolute left-3 top-2.5 text-gray-400" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  export default AccountSettings;