import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Download, Search, X, Users, Calendar, Mail, AlertCircle, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { Transition, Dialog } from '@headlessui/react';
import toast from 'react-hot-toast';
import axios from 'axios';
const ResultDatabase = () => {
  const [students, setStudents] = useState([]);
  const [databases, setDatabases] = useState([]);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [databaseName, setDatabaseName] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [enrolledLoading, setEnrolledLoading] = useState(true);
  const [enrolledError, setEnrolledError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('manage'); // 'manage' or 'enrolled'
  const studentsPerPage = 8;
  
  // --- FIX: Define fetchEnrolledStudents ---
  const fetchEnrolledStudents = async () => {
    setEnrolledLoading(true);
    setEnrolledError(null);

    const token = localStorage.getItem("token");
    const teacherId = localStorage.getItem("teacherId");

    try {
      const res = await axios.get(`http://localhost:5000/api/teachers/students/${teacherId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setEnrolledStudents(res.data);
      setEnrolledLoading(false);
    } catch (err) {
      setEnrolledError(err.response?.data?.message || err.message || "Failed to fetch enrolled students");
      setEnrolledLoading(false);
    }
  };

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    branch: '',
    institute: '',
    batchRollNo: '',
    enrollmentNo: '',
    phoneNo: ''
  });

  // Mock teacher data - replace with actual login data
  const teacherData = {
    teacherId: localStorage.getItem('teacherId') || '682c421e7c1fa142afd50027',
    authToken: localStorage.getItem('authToken') || 'your-auth-token-here'
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDatabaseNameChange = (e) => {
    setDatabaseName(e.target.value);
  };

 const fetchMyStudents = async () => {
  const token = localStorage.getItem("token");
  const teacherId = localStorage.getItem("teacherId");

  try {
    const res = await axios.get(`http://localhost:5000/api/teachers/students/${teacherId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log("✅ Students fetched:", res.data);
  } catch (err) {
    console.error("❌ Error fetching students:", err.response?.data || err.message);
  }
};

  useEffect(() => {
    if (activeTab === 'enrolled') {
      fetchEnrolledStudents();
    }
  }, [activeTab]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Pagination logic for enrolled students
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentEnrolledStudents = enrolledStudents.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(enrolledStudents.length / studentsPerPage);

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const goToPrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const addStudent = () => {
    if (Object.values(formData).some(value => value === '')) {
      toast.error("All fields are mandatory");
      return;
    }
    setStudents([...students, { srNo: students.length + 1, ...formData }]);
    setFormData({
      email: '',
      password: '',
      name: '',
      branch: '',
      institute: '',
      batchRollNo: '',
      enrollmentNo: '',
      phoneNo: ''
    });
    setShowAddForm(false);
    toast.success('Student added successfully');
  };

  const createDatabase = async () => {
    if (students.length === 0) {
      toast.error("Please add at least one student before creating a database.");
      return;
    }
    if (databaseName.trim() === '') {
      toast.error("Please enter a database name");
      return;
    }

    const dbName = databaseName.trim();
    const createdBy = teacherData.teacherId;

    const payload = {
      students: students.map(student => ({
        ...student,
        createdBy,
        databaseName: dbName
      }))
    };

    try {
      const response = await fetch('http://localhost:5000/api/students/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        toast.success('Database and students saved successfully!');
        setDatabases([...databases, { id: dbName, students }]);
        setStudents([]);
        setDatabaseName('');
        // Refresh enrolled students if we're on that tab
        if (activeTab === 'enrolled') {
          fetchEnrolledStudents();
        }
      } else {
        const errorData = await response.json();
        toast.error(`Failed to save: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error saving students:", error);
      toast.error("Something went wrong while saving students");
    }
  };

  const deleteDatabase = async (id) => {
    try {
      const response = await fetch('http://localhost:5000/api/students/delete-by-database-teacher', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          createdBy: teacherData.teacherId,
          databaseName: id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Delete failed');
      }

      setDatabases(prev => prev.filter(db => db.id !== id));
      toast.success('Database deleted successfully');
      
      // Refresh enrolled students if we're on that tab
      if (activeTab === 'enrolled') {
        fetchEnrolledStudents();
      }
    } catch (error) {
      console.error('Error deleting database:', error);
      toast.error(`Delete failed: ${error.message}`);
    }
  };

  const editDatabase = (id) => {
    const dbToEdit = databases.find(db => db.id === id);
    setStudents(dbToEdit.students);
    setDatabaseName(dbToEdit.id);
    setDatabases(databases.filter(db => db.id !== id));
    setActiveTab('manage');
    toast.success('Database loaded for editing');
  };

  const exportToCSV = (dbId) => {
    const db = databases.find(d => d.id === dbId);
    const csvContent = [
      ['Sr No', 'Email ID', 'Password', 'Name', 'Branch', 'Institute', 'Batch Roll No', 'Enrollment No', 'Phone No'],
      ...db.students.map(s => [s.srNo, s.email, s.password, s.name, s.branch, s.institute, s.batchRollNo, s.enrollmentNo, s.phoneNo])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${dbId}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Database exported successfully');
  };

  const filteredDatabases = databases.filter(db => 
    db.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    db.students.some(student => 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const renderEnrolledStudentsContent = () => {
    if (enrolledLoading) {
      return (
        <div className="bg-white rounded-lg shadow p-8">
          <div className="flex items-center justify-center">
            <RefreshCw className="animate-spin text-blue-500 mr-3" size={24} />
            <span className="text-gray-600">Loading enrolled students...</span>
          </div>
        </div>
      );
    }

    if (enrolledError) {
      return (
        <div className="bg-white rounded-lg shadow p-8">
          <div className="flex items-center justify-center text-red-600">
            <AlertCircle className="mr-3" size={24} />
            <div>
              <p className="font-medium">Error loading students</p>
              <p className="text-sm text-gray-600 mt-1">{enrolledError}</p>
              <button
                onClick={fetchEnrolledStudents}
                className="mt-3 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (enrolledStudents.length === 0) {
      return (
        <div className="bg-white rounded-lg shadow p-8">
          <div className="text-center">
            <Users className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No students enrolled yet</h3>
            <p className="text-gray-600">Students you enroll will appear here.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="text-blue-600 mr-3" size={24} />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Enrolled Students</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {enrolledStudents.length} student{enrolledStudents.length !== 1 ? 's' : ''} enrolled
                </p>
              </div>
            </div>
            <button
              onClick={fetchEnrolledStudents}
              className="inline-flex items-center px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <RefreshCw size={16} className="mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {/* Mobile Card Layout */}
        <div className="block md:hidden">
          {currentEnrolledStudents.map((student, index) => (
            <div key={student._id} className="p-4 border-b border-gray-200 last:border-b-0">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-gray-900">{student.name}</h3>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  #{indexOfFirstStudent + index + 1}
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-gray-600">
                  <Mail size={14} className="mr-2 text-blue-500" />
                  {student.email}
                </div>
                {student.branch && (
                  <div className="text-gray-600">
                    <span className="font-medium">Branch:</span> {student.branch}
                  </div>
                )}
                {student.institute && (
                  <div className="text-gray-600">
                    <span className="font-medium">Institute:</span> {student.institute}
                  </div>
                )}
                {student.enrollmentNo && (
                  <div className="text-gray-600">
                    <span className="font-medium">Enrollment:</span> {student.enrollmentNo}
                  </div>
                )}
                <div className="flex items-center text-gray-500 text-xs">
                  <Calendar size={12} className="mr-1" />
                  Enrolled: {formatDate(student.createdAt)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table Layout */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Institute</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrollment No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrolled Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentEnrolledStudents.map((student, index) => (
                <tr key={student._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {indexOfFirstStudent + index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {student.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {student.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {student.branch || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {student.institute || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {student.enrollmentNo || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {student.phoneNo || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {formatDate(student.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200 bg-gray-50">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} className="mr-1" />
                Previous
              </button>
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight size={16} className="ml-1" />
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{indexOfFirstStudent + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(indexOfLastStudent, enrolledStudents.length)}
                  </span>{' '}
                  of <span className="font-medium">{enrolledStudents.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={goToPrevPage}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => goToPage(i + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === i + 1
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={16} />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Result Database</h1>
          
          {/* Tab Navigation */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('manage')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'manage'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Manage Databases
            </button>
            <button
              onClick={() => {
                setActiveTab('enrolled');
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'enrolled'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Enrolled Students
            </button>
          </div>
        </div>

        {activeTab === 'manage' && (
          <>
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
              >
                <Plus size={20} className="mr-2" />
                Add Students
              </button>
              <button
                onClick={createDatabase}
                disabled={students.length === 0}
                className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Database
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Database Name"
                  value={databaseName}
                  onChange={handleDatabaseNameChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search databases..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>
          </>
        )}
      </div>

      {activeTab === 'enrolled' ? (
        renderEnrolledStudentsContent()
      ) : (
        <>
          {students.length > 0 && (
            <div className="mb-8 overflow-x-auto bg-white rounded-lg shadow">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold">Current Students</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {['Sr No', 'Email ID', 'Password', 'Name', 'Branch', 'Institute', 'Batch Roll No', 'Enrollment No', 'Phone No'].map((header) => (
                        <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {students.map((student, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        {Object.values(student).map((value, i) => (
                          <td key={i} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {value}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {filteredDatabases.map((db, index) => (
              <div key={index} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b">
                  <h3 className="text-lg font-semibold text-gray-900">{db.id}</h3>
                  <div className="flex gap-2 mt-2 sm:mt-0">
                    <button
                      onClick={() => editDatabase(db.id)}
                      className="inline-flex items-center px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors"
                    >
                      <Edit2 size={16} className="mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => exportToCSV(db.id)}
                      className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      <Download size={16} className="mr-1" />
                      Export
                    </button>
                    <button
                      onClick={() => deleteDatabase(db.id)}
                      className="inline-flex items-center px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      <Trash2 size={16} className="mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {['Sr No', 'Email ID', 'Password', 'Name', 'Branch', 'Institute', 'Batch Roll No', 'Enrollment No', 'Phone No'].map((header) => (
                          <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {db.students.map((student, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          {Object.values(student).map((value, j) => (
                            <td key={j} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {value}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <Transition show={showAddForm}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setShowAddForm(false)}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
            </Transition.Child>

            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <Transition.Child
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
              className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl"
            >
              <div className="flex justify-between items-center mb-4">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Add New Student
                </Dialog.Title>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.keys(formData).map((key) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                    </label>
                    <input
                      type={key === 'email' ? 'email' : key === 'phoneNo' ? 'tel' : 'text'}
                      name={key}
                      value={formData[key]}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder={`Enter ${key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}`}
                    />
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={addStudent}
                  className="px-4 py-2 text-sm font-medium text-white bg-emerald-500 rounded-lg hover:bg-emerald-600"
                >
                  Add Student
                </button>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default ResultDatabase;