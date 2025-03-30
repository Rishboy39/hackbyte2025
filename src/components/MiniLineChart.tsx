
import React from 'react';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';
import { cn } from '@/lib/utils';

interface MiniLineChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
  className?: string;
  color?: string;
}

const MiniLineChart: React.FC<MiniLineChartProps> = ({ 
  data, 
  className,
  color = '#4C51BF'
}) => {
  return (
    <div className={cn('w-full h-16', className)}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
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
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: color }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MiniLineChart;
