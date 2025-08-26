import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { BarChart3, Target, TrendingUp } from 'lucide-react';

const Card = ({ title, value, suffix, icon }) => (
  <div className="bg-white/80 backdrop-blur rounded-xl border border-emerald-100 shadow-sm p-5 flex items-start gap-3">
    <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
      {icon}
    </div>
    <div>
      <div className="text-xs uppercase tracking-wide text-gray-500">{title}</div>
      <div className="text-3xl font-semibold mt-1 text-gray-900">{value}{suffix || ''}</div>
    </div>
  </div>
);

const Bar = ({ label, value, max = 100 }) => {
  const width = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="mb-3">
      <div className="flex items-center justify-between text-sm mb-1">
        <span className="font-medium text-gray-700">{label}</span>
        <span className="px-2 py-0.5 rounded-full text-xs bg-emerald-50 text-emerald-700">{value.toFixed ? value.toFixed(1) : value}%</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
};

const SimpleLine = ({ points }) => {
  if (!points?.length) return <div className="text-sm text-gray-500">No data</div>;
  // Use a normalized coordinate system so SVG can scale responsively
  const w = 100;
  const h = 40;
  const pad = 6;
  const xs = points.map((_, i) => i);
  const ys = points.map((p) => p);
  const xMax = Math.max(...xs, 1);
  const yMax = Math.max(...ys, 1);
  const toX = (i) => pad + (i / xMax) * (w - pad * 2);
  const toY = (v) => h - pad - (v / yMax) * (h - pad * 2);
  const path = points
    .map((v, i) => `${i === 0 ? 'M' : 'L'} ${toX(i)} ${toY(v)}`)
    .join(' ');
  const area = `M ${toX(0)} ${toY(points[0])} ${points
    .map((v, i) => `L ${toX(i)} ${toY(v)}`)
    .join(' ')} L ${toX(points.length - 1)} ${h - pad} L ${toX(0)} ${h - pad} Z`;
  const grid = [0.25, 0.5, 0.75].map((t, i) => (
    <line
      key={i}
      x1={pad}
      x2={w - pad}
      y1={pad + t * (h - pad * 2)}
      y2={pad + t * (h - pad * 2)}
      stroke="#e5e7eb"
      strokeDasharray="4 4"
    />
  ));
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-32 overflow-visible">
      <rect x={0} y={0} width={w} height={h} fill="white" />
      {grid}
      <path d={area} fill="#10b98122" stroke="none" />
      <path d={path} fill="none" stroke="#10b981" strokeWidth={1.5} />
    </svg>
  );
};

export default function TeacherAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get('http://localhost:5000/api/teachers/analytics/overview', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          withCredentials: true
        });
        if (mounted) setData(res.data);
      } catch (e) {
        console.error('Failed to fetch analytics:', e);
        setError(e?.response?.data?.message || 'Failed to fetch analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    return () => { mounted = false; };
  }, []);

  const subjectDifficultyMatrix = useMemo(() => {
    const matrix = {};
    const order = ['Easy', 'Medium', 'Hard'];
    (data?.subjectDifficulty || []).forEach(row => {
      const s = row.subject || 'Unknown';
      if (!matrix[s]) matrix[s] = { Easy: 0, Medium: 0, Hard: 0 };
      matrix[s][row.difficulty || 'Easy'] = row.accuracy || 0;
    });
    return { matrix, order };
  }, [data]);

  // New: Accuracy distribution across students (bins)
  const accuracyDistribution = useMemo(() => {
    const bins = [
      { label: '0-20%', min: 0, max: 20, count: 0 },
      { label: '21-40%', min: 21, max: 40, count: 0 },
      { label: '41-60%', min: 41, max: 60, count: 0 },
      { label: '61-80%', min: 61, max: 80, count: 0 },
      { label: '81-100%', min: 81, max: 100, count: 0 },
    ];
    (data?.studentComparison || []).forEach(s => {
      const acc = Math.max(0, Math.min(100, s?.avgAccuracy || 0));
      const bin = bins.find(b => acc >= b.min && acc <= b.max);
      if (bin) bin.count += 1;
    });
    return bins;
  }, [data]);

  // New: Overall difficulty weaknesses (average accuracy per difficulty)
  const difficultySummary = useMemo(() => {
    const agg = { Easy: { sum: 0, n: 0 }, Medium: { sum: 0, n: 0 }, Hard: { sum: 0, n: 0 } };
    (data?.subjectDifficulty || []).forEach(row => {
      const d = row?.difficulty || 'Easy';
      const a = row?.accuracy || 0;
      if (agg[d]) { agg[d].sum += a; agg[d].n += 1; }
    });
    const avg = Object.fromEntries(Object.entries(agg).map(([k, v]) => [k, v.n ? v.sum / v.n : 0]));
    const sorted = Object.entries(avg).sort((a,b) => a[1]-b[1]);
    return { avg, weakest: sorted[0]?.[0] || 'N/A', strongest: sorted[sorted.length-1]?.[0] || 'N/A' };
  }, [data]);

  // New: At-risk students (lowest accuracy)
  const atRiskStudents = useMemo(() => {
    return [...(data?.studentComparison || [])]
      .sort((a,b) => (a?.avgAccuracy||0) - (b?.avgAccuracy||0))
      .slice(0, 5);
  }, [data]);

  if (loading) return <div className="p-6">Loading analytics...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  const { overview, subjectAccuracy, studentComparison, trend, weakAreas } = data || {};

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-white p-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-600 text-white"><BarChart3 size={22} /></div>
          <div>
            <div className="text-xl font-semibold text-gray-900">Teacher Analytics</div>
            <div className="text-sm text-gray-600">Track student performance, identify weak areas, and monitor trends</div>
          </div>
        </div>
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-emerald-100 opacity-40" />
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="Overall Average Accuracy" value={(overview?.overallAvgAccuracy || 0).toFixed(2)} suffix="%" icon={<Target size={18} />} />
        <Card title="Average Score" value={(overview?.overallAvgScore || 0).toFixed(2)} suffix="%" icon={<TrendingUp size={18} />} />
        <Card title="Total Questions Attempted" value={overview?.totalQuestionsAttempted || 0} icon={<BarChart3 size={18} />} />
      </div>

      {/* Subject-wise Accuracy */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="text-lg font-semibold">Student Accuracy per Subject</div>
          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">Bar Chart</span>
        </div>
        <div>
          {(subjectAccuracy || []).length === 0 && (
            <div className="text-sm text-gray-500">No data</div>
          )}
          {(subjectAccuracy || []).map((s) => (
            <Bar key={s.subject} label={s.subject || 'Unknown'} value={s.accuracy || 0} />
          ))}
        </div>
      </div>

      {/* Difficulty x Subject grouped bars (as grid) */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="text-lg font-semibold">Accuracy by Subject & Difficulty</div>
          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">Grouped Bars</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600">
                <th className="p-2">Subject</th>
                {subjectDifficultyMatrix.order.map((d) => (
                  <th key={d} className="p-2">{d}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(subjectDifficultyMatrix.matrix).map(([subject, row]) => (
                <tr key={subject} className="border-t">
                  <td className="p-2 font-medium">{subject}</td>
                  {subjectDifficultyMatrix.order.map((d) => (
                    <td key={d} className="p-2">
                      <div className="w-28 sm:w-40">
                        <Bar label={''} value={row[d] || 0} />
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Weak Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="text-lg font-semibold mb-2">Weak Subjects</div>
          <ul className="list-disc ml-5 text-sm text-gray-700">
            {(weakAreas?.subjects || []).map((s) => (
              <li key={s.subject}>
                <span className="font-medium">{s.subject}:</span> {(s.accuracy || 0).toFixed(1)}% accuracy
              </li>
            ))}
            {(weakAreas?.subjects || []).length === 0 && <li>No weak subjects detected</li>}
          </ul>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="text-lg font-semibold mb-2">Weak Difficulty Levels</div>
          <ul className="list-disc ml-5 text-sm text-gray-700">
            {(weakAreas?.difficulty || []).map((d) => (
              <li key={d.difficulty}>
                <span className="font-medium">{d.difficulty}:</span> {(d.accuracy || 0).toFixed(1)}% accuracy
              </li>
            ))}
            {(weakAreas?.difficulty || []).length === 0 && <li>No weak difficulty levels detected</li>}
          </ul>
        </div>
      </div>

      {/* New: Accuracy Distribution and At-Risk Students */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="text-lg font-semibold">Accuracy Distribution</div>
            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">Histogram</span>
          </div>
          <div>
            {accuracyDistribution.map(b => (
              <Bar key={b.label} label={b.label} value={(b.count || 0)} max={Math.max(1, Math.max(...accuracyDistribution.map(x=>x.count||0)))} />
            ))}
            {accuracyDistribution.every(b => b.count === 0) && (
              <div className="text-sm text-gray-500">No data</div>
            )}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="text-lg font-semibold">At-Risk Students</div>
            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">Bottom 5 by Accuracy</span>
          </div>
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600">
                <th className="p-2">Student</th>
                <th className="p-2">Email</th>
                <th className="p-2">Avg. Accuracy</th>
              </tr>
            </thead>
            <tbody>
              {atRiskStudents.map(s => (
                <tr key={s.studentId} className="border-t">
                  <td className="p-2">{s.name || 'Unknown'}</td>
                  <td className="p-2 text-gray-600">{s.email || ''}</td>
                  <td className="p-2">{(s.avgAccuracy || 0).toFixed(1)}%</td>
                </tr>
              ))}
              {atRiskStudents.length === 0 && (
                <tr><td className="p-2 text-gray-500" colSpan="3">No data</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New: Overall Difficulty Summary */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="text-lg font-semibold">Overall Difficulty Performance</div>
          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">Summary</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card title="Avg Easy Accuracy" value={(difficultySummary.avg.Easy || 0).toFixed(1)} suffix="%" icon={<Target size={18} />} />
          <Card title="Avg Medium Accuracy" value={(difficultySummary.avg.Medium || 0).toFixed(1)} suffix="%" icon={<Target size={18} />} />
          <Card title="Avg Hard Accuracy" value={(difficultySummary.avg.Hard || 0).toFixed(1)} suffix="%" icon={<Target size={18} />} />
        </div>
        <div className="text-sm text-gray-600 mt-2">
          Weakest Difficulty: <span className="font-medium text-red-600">{difficultySummary.weakest}</span> · Strongest Difficulty: <span className="font-medium text-emerald-600">{difficultySummary.strongest}</span>
        </div>
      </div>

      {/* Student-wise Comparison */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="text-lg font-semibold mb-2">Student-wise Comparison</div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600">
                <th className="p-2">Student</th>
                <th className="p-2">Email</th>
                <th className="p-2">Avg. Accuracy</th>
                <th className="p-2">Avg. Score</th>
                <th className="p-2">Attempts</th>
              </tr>
            </thead>
            <tbody>
              {(studentComparison || []).map((s) => (
                <tr key={s.studentId} className="border-t">
                  <td className="p-2">{s.name || 'Unknown'}</td>
                  <td className="p-2 text-gray-600">{s.email || ''}</td>
                  <td className="p-2">{(s.avgAccuracy || 0).toFixed(1)}%</td>
                  <td className="p-2">{(s.avgScore || 0).toFixed(1)}%</td>
                  <td className="p-2">{s.attempts || 0}</td>
                </tr>
              ))}
              {(studentComparison || []).length === 0 && (
                <tr><td className="p-2 text-gray-500" colSpan="5">No data</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      
    </div>
  );
}
