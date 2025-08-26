import { useState, useEffect } from "react";
import axios from "axios";
import {
  Search,
  Filter,
  Download,
  Eye,
  Calendar,
  Users,
  Trophy,
} from "lucide-react";

const Respondents = ({ teacherId: propTeacherId }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedQuiz, setSelectedQuiz] = useState("all");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ TeacherId fix: localStorage fallback
  const teacherId = propTeacherId || localStorage.getItem("teacherId");

  // ✅ Fetch teacher responses from backend
  useEffect(() => {
    const fetchResponses = async () => {
      try {
        setLoading(true);
        console.log("📡 Fetching responses for teacherId:", teacherId);

        const res = await axios.get(
          `http://localhost:5000/api/teacher-responses/${teacherId}`
        );

        console.log("✅ API Response:", res.data); // <-- Debug log
        setResults(res.data);
      } catch (error) {
        console.error("❌ Error fetching responses:", error);
      } finally {
        setLoading(false);
      }
    };

    if (teacherId) {
      fetchResponses();
    } else {
      console.warn("⚠️ teacherId not provided");
      setLoading(false);
    }
  }, [teacherId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getScoreColor = (score) => {
    if (score >= 90) return "text-green-600 bg-green-100";
    if (score >= 70) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  // ✅ Filtered results (search + quiz filter)
  const filteredResults = results.filter((result) => {
    const matchSearch =
      result.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.studentEmail?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchQuiz =
      selectedQuiz === "all" ||
      result.quizName?.toLowerCase() === selectedQuiz.toLowerCase();

    return matchSearch && matchQuiz;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Respondents of Your's Quiz
            </h1>
            <p className="text-gray-600 mt-1">
              View and analyze quiz results and student performance
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Respondents
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {results.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <Trophy className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Average Score
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {results.length > 0
                    ? (
                        results.reduce((acc, r) => acc + (r.score || 0), 0) /
                        results.length
                      ).toFixed(1) + ""
                    : "0"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Latest Submission
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {results.length > 0 ? formatDate(results[0].createdAt) : "-"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <Eye className="w-8 h-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Completion Rate
                </p>
                <p className="text-2xl font-bold text-gray-900">100%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by student name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="relative">
              <Filter className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <select
                value={selectedQuiz}
                onChange={(e) => setSelectedQuiz(e.target.value)}
                className="appearance-none pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="all">All Quizzes</option>
                {[...new Set(results.map((r) => r.quizName))].map((quiz) => (
                  <option key={quiz} value={quiz}>
                    {quiz}
                  </option>
                ))}
              </select>
            </div>

            <button className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors w-full sm:w-auto">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Results - Responsive */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-6 text-center text-gray-500">Loading...</div>
          ) : (
            <>
              {/* Table for md+ */}
              <div className="overflow-x-auto hidden md:block">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quiz</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed At</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredResults.map((result) => (
                      <tr key={result._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900 truncate max-w-[240px]">{result.studentName}</div>
                            <div className="text-sm text-gray-500 truncate max-w-[260px]">{result.studentEmail}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 truncate max-w-[240px]">{result.quizName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getScoreColor(result.score || 0)}`}>
                            {result.score || 0}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(result.createdAt)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>View Details</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredResults.length === 0 && (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 text-center text-gray-500">No responses found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Cards for < md */}
              <div className="md:hidden divide-y divide-gray-100">
                {filteredResults.map((result) => (
                  <div key={result._id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{result.studentName}</p>
                        <p className="text-xs text-gray-500 truncate">{result.studentEmail}</p>
                      </div>
                      <span className={`ml-3 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getScoreColor(result.score || 0)}`}>
                        {result.score || 0}
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-gray-700">
                      <div className="truncate"><span className="text-gray-500">Quiz:</span> {result.quizName}</div>
                      <div className="text-gray-500">{formatDate(result.createdAt)}</div>
                    </div>
                    <div className="mt-3">
                      <button className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg">
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
                {filteredResults.length === 0 && (
                  <div className="p-6 text-center text-gray-500">No responses found</div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Respondents;
