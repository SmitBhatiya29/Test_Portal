import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const QuestionsByChapterChart = ({ data }) => {
  return (
    <div className="card-3d p-8 rounded-xl stagger-animation">
      <h3 className="chart-title text-xl font-semibold mb-6">📚 Questions Attempted vs Correct by Chapter</h3>
      <ResponsiveContainer width="100%" height={320}>
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
            formatter={(value, name) => [value, name === 'attempted' ? 'Questions Attempted' : 'Questions Correct']}
          />
          <Legend wrapperStyle={{ color: '#cbd5e1' }} />
          <Bar 
            dataKey="attempted" 
            fill="rgba(148, 163, 184, 0.8)" 
            name="Attempted"
            radius={[3, 3, 0, 0]}
          />
          <Bar 
            dataKey="correct" 
            fill="#10B981" 
            name="Correct"
            radius={[3, 3, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default QuestionsByChapterChart;