// import { useState } from 'react';
// import Login from './components/Login';
// import StudentDashboard from './components/StudentDashboard';
// import TeacherDashboard from './components/TeacherDashboard';
// import axios from 'axios';
// import { BrowserRouter } from "react-router-dom";

// function App() {
//   const [userType, setUserType] = useState(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   const handleLogin = (type, email, password) => {
//     // In a real app, you would validate credentials here
//     setUserType(type);
//     setIsAuthenticated(true);
//   };

//   const handleLogout = () => {
//     setUserType(null);
//     setIsAuthenticated(false);
//   };

//   if (!isAuthenticated) {
//     return <Login onLogin={handleLogin} />;
//   }

//   return (
//     <>
//       {userType === 'student' ? (
//         <StudentDashboard onLogout={handleLogout} />
//       ) : (
//         <TeacherDashboard onLogout={handleLogout} />
//       )}
//     </>
//   );
// }

// export default App;
 
import { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';

function App() {
  const [userType, setUserType] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (type, email, password) => {
    setUserType(type);
    setIsAuthenticated(true);
    if (type === 'student') {
      navigate('/student');
    } else {
      navigate('/teacher');
    }
  };

  const handleLogout = () => {
    setUserType(null);
    setIsAuthenticated(false);
    navigate('/');
  };

  return (
    <Routes>
      <Route
        path="/"
        element={<Login onLogin={handleLogin} />}
      />
      <Route
        path="/student"
        element={
          isAuthenticated && userType === 'student' ? (
            <StudentDashboard onLogout={handleLogout} />
          ) : (
            <Login onLogin={handleLogin} />
          )
        }
      />
      <Route
        path="/teacher"
        element={
          isAuthenticated && userType === 'teacher' ? (
            <TeacherDashboard onLogout={handleLogout} />
          ) : (
            <Login onLogin={handleLogin} />
          )
        }
      />
    </Routes>
  );
}

export default App;


