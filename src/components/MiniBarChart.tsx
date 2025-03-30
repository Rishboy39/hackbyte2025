
import React from 'react';
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip } from 'recharts';
import { cn } from '@/lib/utils';

interface MiniBarChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
  className?: string;
  color?: string;
}

const MiniBarChart: React.FC<MiniBarChartProps> = ({ 
  data, 
  className,
  color = '#38B2AC'
}) => {
  return (
    <div className={cn('w-full h-16', className)}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <XAxis 
            dataKey="name" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: '#9CA3AF' }}
            dy={5}
          />
          <Tooltip
            contentStyle={{ 
              backgroundColor: 'white', 
              border: 'none', 
              borderRadius: '8px', 
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)', 
              fontSize: '12px' 
            }}
            labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
          />
          <Bar 
            dataKey="value" 
            fill={color}
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MiniBarChart;
