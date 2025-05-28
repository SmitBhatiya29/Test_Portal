import { useState } from 'react';
import Login from './components/Login';
import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import axios from 'axios';

function App() {
  const [userType, setUserType] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (type, email, password) => {
    // In a real app, you would validate credentials here
    setUserType(type);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setUserType(null);
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <>
      {userType === 'student' ? (
        <StudentDashboard onLogout={handleLogout} />
      ) : (
        <TeacherDashboard onLogout={handleLogout} />
      )}
    </>
  );
}

export default App;