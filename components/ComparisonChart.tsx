import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { StateData } from '../types';
import { formatCurrency } from '../utils/data';

interface ComparisonChartProps {
  data: StateData[];
  themeColor: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 backdrop-blur border border-gray-200 p-3 rounded-lg shadow-xl">
        <p className="font-semibold text-gray-800">{label}</p>
        <p className="text-sm text-gray-600">
          GDP: <span className="font-bold">{formatCurrency(payload[0].value)}</span>
        </p>
      </div>
    );
  }
  return null;
};

const ComparisonChart: React.FC<ComparisonChartProps> = ({ data, themeColor }) => {
  if (data.length === 0) {
    return (
      <div className="h-64 w-full flex items-center justify-center text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
        <p>Select states on the map to compare</p>
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
          <XAxis 
            dataKey="name" 
            tick={{ fill: '#6B7280', fontSize: 12 }} 
            axisLine={false} 
            tickLine={false}
          />
          <YAxis 
            tick={{ fill: '#6B7280', fontSize: 12 }} 
            axisLine={false} 
            tickLine={false}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F3F4F6' }} />
          <Bar dataKey="gdp" radius={[6, 6, 0, 0]} animationDuration={1000}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={themeColor} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ComparisonChart;