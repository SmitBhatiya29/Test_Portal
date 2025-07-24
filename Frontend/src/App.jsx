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

// import { useEffect, useState } from 'react';
// import { Routes, Route, useNavigate } from 'react-router-dom';
// import Login from './components/Login';
// import StudentDashboard from './components/StudentDashboard';
// import TeacherDashboard from './components/TeacherDashboard';

// function App() {
//   const [userType, setUserType] = useState(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [userData, setUserData] = useState({});
//   const navigate = useNavigate();

//   // ✅ Restore login state from localStorage on app load
//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     const type = localStorage.getItem('userType');
//     const email = localStorage.getItem('email');
//     const name = localStorage.getItem('name');

//     if (token && type && email) {
//       setUserType(type);
//       setIsAuthenticated(true);
//       setUserData({ email, name });

//       // Auto-redirect to dashboard based on type
//       if (type === 'student') {
//         navigate('/student');
//       } else if (type === 'teacher') {
//         navigate('/teacher');
//       }
//     }
//   }, [navigate]);

//   // ✅ After successful login
//   const handleLogin = (type, email, password, data) => {
//     const name = data.teacher?.name || data.student?.name || '';
//     setUserType(type);
//     setIsAuthenticated(true);
//     setUserData({ email, name });

//     if (type === 'student') {
//       navigate('/student');
//     } else {
//       navigate('/teacher');
//     }
//   };

//   // ✅ On logout
//   const handleLogout = () => {
//     localStorage.clear();
//     setUserType(null);
//     setIsAuthenticated(false);
//     setUserData({});
//     navigate('/');
//   };

//   return (
//     <Routes>
//       <Route
//         path="/"
//         element={<Login onLogin={handleLogin} />}
//       />

//       <Route
//         path="/student"
//         element={
//           isAuthenticated && userType === 'student' ? (
//             <StudentDashboard user={userData} onLogout={handleLogout} />
//           ) : (
//             <Login onLogin={handleLogin} />
//           )
//         }
//       />

//       <Route
//         path="/teacher"
//         element={
//           isAuthenticated && userType === 'teacher' ? (
//             <TeacherDashboard user={userData} onLogout={handleLogout} />
//           ) : (
//             <Login onLogin={handleLogin} />
//           )
//         }
//       />
//     </Routes>
//   );
// }

// export default App;
import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';

function App() {
  const [userType, setUserType] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();

  // ✅ Restore login state from localStorage on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const type = localStorage.getItem('userType');
    const email = localStorage.getItem('email');
    const name = localStorage.getItem('name');

    if (token && type && email) {
      setUserType(type);
      setIsAuthenticated(true);
      setUserData({ email, name });

      // Auto-redirect to dashboard based on type
      if (type === 'student') {
        navigate('/student');
      } else if (type === 'teacher') {
        navigate('/teacher');
      }
    }
  }, [navigate]);

  // ✅ After successful login
  const handleLogin = (type, email, password, data) => {
    const name = data.teacher?.name || data.student?.name || '';
    setUserType(type);
    setIsAuthenticated(true);
    setUserData({ email, name });

    if (type === 'student') {
      navigate('/student');
    } else {
      navigate('/teacher');
    }
  };

  // ✅ On logout
  const handleLogout = () => {
    localStorage.clear();
    setUserType(null);
    setIsAuthenticated(false);
    setUserData({});
    navigate('/');
  };

  return (
    <Routes>
      <Route
        path="/"
        element={<LandingPage onLogin={handleLogin} />}
      />
      
      <Route
        path="/login"
        element={<Login onLogin={handleLogin} />}
      />

      <Route
        path="/student"
        element={
          isAuthenticated && userType === 'student' ? (
            <StudentDashboard user={userData} onLogout={handleLogout} />
          ) : (
            <Login onLogin={handleLogin} />
          )
        }
      />

      <Route
        path="/teacher"
        element={
          isAuthenticated && userType === 'teacher' ? (
            <TeacherDashboard user={userData} onLogout={handleLogout} />
          ) : (
            <Login onLogin={handleLogin} />
          )
        }
      />
    </Routes>
  );
}

export default App;