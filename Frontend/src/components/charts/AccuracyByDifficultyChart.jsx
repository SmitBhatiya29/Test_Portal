import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = {
  Easy: '#10B981',
  Medium: '#F59E0B', 
  Hard: '#EF4444'
};

const AccuracyByDifficultyChart = ({ data }) => {
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={13}
        fontWeight="bold"
        filter="drop-shadow(0 2px 4px rgba(0,0,0,0.5))"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="card-3d p-8 rounded-xl stagger-animation">
      <h3 className="chart-title text-xl font-semibold mb-6">🍩 Accuracy Distribution by Difficulty</h3>
      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={90}
            innerRadius={50}
            fill="#8884d8"
            dataKey="value"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth={2}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[entry.difficulty]}
                filter="drop-shadow(0 4px 8px rgba(0,0,0,0.3))"
              />
            ))}
          </Pie>
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
          <Legend 
            wrapperStyle={{ color: '#cbd5e1' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AccuracyByDifficultyChart;