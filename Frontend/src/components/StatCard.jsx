import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }) => {
  return (
    <div className="stat-card p-6 rounded-xl border-l-4 stagger-animation" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-400 mb-1">{title}</p>
          <p className="text-3xl font-bold text-black">{value}</p>
        </div>
        <div className="p-4 rounded-full icon-pulse" style={{ backgroundColor: `${color}20` }}>
          <Icon className="w-7 h-7" style={{ color }} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;