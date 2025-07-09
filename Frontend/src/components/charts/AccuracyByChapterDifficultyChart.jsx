import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

/** @param {{ data: any }} props */
const AccuracyByChapterDifficultyChart = ({ data }) => {
  return (
    <div className="card-3d p-8 rounded-xl stagger-animation">
      <h3 className="chart-title text-xl font-semibold mb-6">🧱 Accuracy by Chapter and Difficulty</h3>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(59, 130, 246, 0.1)" />
          <XAxis 
            dataKey="chapter" 
            tick={{ fontSize: 12, fill: '#cbd5e1' }}
            stroke="#475569"
          />
          <YAxis 
            tick={{ fontSize: 12, fill: '#cbd5e1' }}
            stroke="#475569"
            domain={[0, 100]}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'rgba(15, 23, 42, 0.95)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              backdropFilter: 'blur(20px)',
              color: '#e2e8f0'
            }}
            formatter={(value) => [`${value}%`, 'Accuracy']}
          />
          <Legend wrapperStyle={{ color: '#cbd5e1' }} />
          <Bar dataKey="Easy" stackId="a" fill="#10B981" name="Easy" radius={[2, 2, 0, 0]} />
          <Bar dataKey="Medium" stackId="a" fill="#F59E0B" name="Medium" />
          <Bar dataKey="Hard" stackId="a" fill="#EF4444" name="Hard" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AccuracyByChapterDifficultyChart;