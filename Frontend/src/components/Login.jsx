import { useState } from 'react';
import { UserRound, School } from 'lucide-react';
import PropTypes from 'prop-types';
import axios from 'axios';

const Login = ({ onLogin }) => {
  const [selectedType, setSelectedType] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [institute, setInstitute] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let response;

      if (isRegistering && selectedType === 'teacher') {
        // Teacher registration
        response = await axios.post('http://localhost:5000/api/teachers/signup', {
          name,
          email,
          institute,
          password
        });
        console.log('Teacher registered:', {
          name,
          email,
          institute,
          password
        });
      } else if (selectedType === 'teacher') {
        // Teacher login
        response = await axios.post('http://localhost:5000/api/teachers/login', {
          email,
          password
        });
      } else if (selectedType === 'student') {
        // Student login
        response = await axios.post('http://localhost:5000/api/students/login', {
          email,
          password
        });
      }

      if (response.status === 200) {
        console.log("Login/Register Success:", response.data);

          

        // Store token
        localStorage.setItem('token', response.data.token);

        // 👇 Store teacherId only if selectedType is teacher
        if (selectedType === 'teacher') {
          localStorage.setItem('teacherId', response.data.teacher.id);
          console.log("Teacher ID stored:", response.data.teacher.id);
        }
        // Store studentId if student
        if (selectedType === 'student') {
          localStorage.setItem('studentId', response.data.student.id);
          console.log("Student ID stored:", response.data.student.id);
        }

        onLogin(selectedType, email, password, response.data);
      } else {
        alert(response.data.message || 'Login/Register failed.');
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error connecting to the server.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Welcome to TestPortal</h2>
          <p className="mt-2 text-gray-600">
            {isRegistering ? 'Create your account' : 'Please select your role to continue'}
          </p>
        </div>

        {!selectedType ? (
          <div className="mt-8 grid grid-cols-2 gap-4">
            <button
              onClick={() => setSelectedType('teacher')}
              className="flex flex-col items-center gap-3 p-6 border-2 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-colors"
            >
              <UserRound size={40} className="text-emerald-600" />
              <span className="font-medium">Teacher</span>
            </button>

            <button
              onClick={() => setSelectedType('student')}
              className="flex flex-col items-center gap-3 p-6 border-2 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-colors"
            >
              <School size={40} className="text-emerald-600" />
              <span className="font-medium">Student</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {isRegistering && selectedType === 'teacher' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Institute</label>
                  <input
                    type="text"
                    required
                    value={institute}
                    onChange={(e) => setInstitute(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center justify-between">
              {selectedType === 'teacher' && (
                <button
                  type="button"
                  onClick={() => setIsRegistering(!isRegistering)}
                  className="text-sm text-emerald-600 hover:text-emerald-500"
                >
                  {isRegistering ? 'Back to Login' : 'Register'}
                </button>
              )}

              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                {isRegistering ? 'Register' : 'Sign in'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

Login.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default Login;
