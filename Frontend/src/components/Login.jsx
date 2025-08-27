import { useState } from 'react';
import { UserRound, School, Mail, Lock, User, Building2, Eye, EyeOff } from 'lucide-react';
import PropTypes from 'prop-types';
import axios from 'axios';

const Login = ({ onLogin }) => {
  const [selectedType, setSelectedType] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [institute, setInstitute] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

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

        // Store user data based on type
        if (selectedType === 'teacher') {
          localStorage.setItem('teacherId', response.data.teacher.id);
          localStorage.setItem('name', response.data.teacher.name);
        }

        if (selectedType === 'student') {
          localStorage.setItem('studentId', response.data.student.id);
          localStorage.setItem('name', response.data.student.name);
        }

        // Store userType and email for session persistence
        localStorage.setItem('userType', selectedType);
        localStorage.setItem('email', email);

        onLogin(selectedType, email, password, response.data);
      } else {
        alert(response.data.message || 'Login/Register failed.');
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error connecting to the server.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedType(null);
    setIsRegistering(false);
    setName('');
    setEmail('');
    setInstitute('');
    setPassword('');
    setShowPassword(false);
  };

  return (
    <div >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-10 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Back Button */}
        {selectedType && (
          <button
            onClick={resetForm}
            className="mb-6 flex items-center gap-2 text-white/80 hover:text-white transition-all duration-300 hover:translate-x-1 group"
          >
            <svg className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to selection
          </button>
        )}

        {/* Main Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 animate-fade-in-up">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in-up animation-delay-200">
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg animate-float">
              <UserRound className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              {!selectedType ? 'Welcome to TestPortal' : 
               isRegistering ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-white/70 text-lg">
              {!selectedType ? 'Choose your role to continue' :
               isRegistering ? 'Fill in your details to get started' :
               `Sign in as ${selectedType}`}
            </p>
          </div>

          {!selectedType ? (
            /* Role Selection */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in-up animation-delay-400">
              <button
                onClick={() => setSelectedType('teacher')}
                className="group relative overflow-hidden bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 rounded-2xl p-6 transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10 flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <UserRound className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">Teacher</h3>
                    <p className="text-white/70 text-sm">Create and manage quizzes</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setSelectedType('student')}
                className="group relative overflow-hidden bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 rounded-2xl p-6 transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10 flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <School className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">Student</h3>
                    <p className="text-white/70 text-sm">Take quizzes and track progress</p>
                  </div>
                </div>
              </button>
            </div>
          ) : (
            /* Login/Register Form */
            <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in-up animation-delay-400">
              {isRegistering && selectedType === 'teacher' && (
                <>
                  {/* Full Name Field */}
                  <div className="space-y-2 animate-slide-in-left animation-delay-600">
                    <label className="block text-sm font-medium text-white/90">Full Name</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-white/50 group-focus-within:text-white/80 transition-colors duration-300" />
                      </div>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:bg-white/15 focus:bg-white/15 backdrop-blur-sm"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  {/* Institute Field */}
                  <div className="space-y-2 animate-slide-in-left animation-delay-800">
                    <label className="block text-sm font-medium text-white/90">Institute</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Building2 className="h-5 w-5 text-white/50 group-focus-within:text-white/80 transition-colors duration-300" />
                      </div>
                      <input
                        type="text"
                        required
                        value={institute}
                        onChange={(e) => setInstitute(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:bg-white/15 focus:bg-white/15 backdrop-blur-sm"
                        placeholder="Enter your institute name"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Email Field */}
              <div className="space-y-2 animate-slide-in-left animation-delay-1000">
                <label className="block text-sm font-medium text-white/90">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-white/50 group-focus-within:text-white/80 transition-colors duration-300" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:bg-white/15 focus:bg-white/15 backdrop-blur-sm"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2 animate-slide-in-left animation-delay-1200">
                <label className="block text-sm font-medium text-white/90">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-white/50 group-focus-within:text-white/80 transition-colors duration-300" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:bg-white/15 focus:bg-white/15 backdrop-blur-sm"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/50 hover:text-white/80 transition-colors duration-300"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 animate-fade-in-up animation-delay-1400">
                {selectedType === 'teacher' && (
                  <button
                    type="button"
                    onClick={() => setIsRegistering(!isRegistering)}
                    className="text-white/80 hover:text-white transition-colors duration-300 font-medium hover:underline"
                  >
                    {isRegistering ? 'Already have an account? Sign in' : 'Need an account? Register'}
                  </button>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative flex items-center justify-center gap-2">
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        {isRegistering ? 'Create Account' : 'Sign In'}
                        <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </>
                    )}
                  </span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 animate-fade-in-up animation-delay-1600">
          <p className="text-white/60 text-sm">
            Secure login powered by TestPortal
          </p>
        </div>
      </div>
    </div>
  );
};

Login.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default Login;