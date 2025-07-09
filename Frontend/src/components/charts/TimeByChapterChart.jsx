import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const TimeByChapterChart = ({ data }) => {
  return (
    <div className="card-3d p-8 rounded-xl stagger-animation">
      <h3 className="chart-title text-xl font-semibold mb-6">⏱ Average Time per Question by Chapter</h3>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
            formatter={(value) => [`${value}s`, 'Average Time']}
          />
          <Legend wrapperStyle={{ color: '#cbd5e1' }} />
          <Line 
            type="monotone" 
            dataKey="averageTime" 
            stroke="#8B5CF6" 
            strokeWidth={4}
            dot={{ fill: '#8B5CF6', strokeWidth: 3, r: 6, filter: 'drop-shadow(0 2px 4px rgba(139, 92, 246, 0.5))' }}
            name="Average Time (seconds)"
            filter="drop-shadow(0 2px 8px rgba(139, 92, 246, 0.3))"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TimeByChapterChart;