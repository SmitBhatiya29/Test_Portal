import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

/** @param {{ data: any }} props */
const AccuracyBySubjectChart = ({ data }) => {
  return (
    <div className="card-3d p-8 rounded-xl stagger-animation">
      <h3 className="chart-title text-xl font-semibold mb-6">📘 Average Accuracy by Subject</h3>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(59, 130, 246, 0.1)" />
          <XAxis 
            dataKey="subject" 
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
          <Legend />
          <Bar 
            dataKey="accuracy" 
            fill="url(#blueGradient)" 
            name="Accuracy (%)"
            radius={[6, 6, 0, 0]}
          />
          <defs>
            <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1e40af" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AccuracyBySubjectChart;