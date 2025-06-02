import { useState } from 'react';
import { Plus, Trash2, Edit2, Download, Upload, Search, X } from 'lucide-react';
import { Transition, Dialog } from '@headlessui/react';
import toast from 'react-hot-toast';

import { useEffect } from 'react';
const ResultDatabase = () => {
  const [students, setStudents] = useState([]);
  const [databases, setDatabases] = useState([]);
  const [databaseName, setDatabaseName] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDatabaseNameChange = (e) => {
    setDatabaseName(e.target.value);
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
  const createdBy = localStorage.getItem('teacherId') || "682c421e7c1fa142afd50027"; // Replace with actual logged-in teacher ID if dynamic

  // Prepare data in required format
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
    const teacherId = '682c421e7c1fa142afd50027'; // TODO: Replace with dynamic value if needed

    const response = await fetch('http://localhost:5000/api/students/delete-by-database-teacher', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        createdBy: teacherId,
        databaseName: id,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Delete failed');
    }

    // Update the frontend state
    setDatabases(prev => prev.filter(db => db.id !== id));
    toast.success('Database deleted successfully');
    
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

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Result Database</h1>
          <div className="flex gap-2">
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
      </div>

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

      <Transition show={showAddForm} as="div">
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setShowAddForm(false)}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as="div"
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
              as="div"
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