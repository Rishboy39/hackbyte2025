
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import Shimmer from '@/components/Shimmer';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  earned: boolean;
}

interface BadgeDisplayProps {
  badges?: Badge[]; // Make badges optional
  className?: string;
  loading?: boolean;
}

const BadgeDisplay: React.FC<BadgeDisplayProps> = ({ 
  badges = [], // Provide default empty array
  className,
  loading = false
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Achievement Badges</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex gap-3 flex-wrap">
            {[1, 2, 3].map((i) => (
              <Shimmer key={i} className="w-16 h-16 rounded-full" />
            ))}
          </div>
        ) : (
          <div className={cn('flex gap-3 flex-wrap', className)}>
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`relative group flex flex-col items-center justify-center w-16 h-16 rounded-full ${
                  badge.earned ? badge.color : 'bg-gray-200'
                } ${badge.earned ? '' : 'opacity-50'} transition-all duration-200`}
              >
                <span className="text-xl">{badge.icon}</span>
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-40 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="bg-gray-800 text-white text-xs rounded p-2 shadow-lg">
                    <p className="font-bold mb-1">{badge.name}</p>
                    <p>{badge.description}</p>
                    {!badge.earned && <p className="mt-1 text-gray-300 italic">Not yet earned</p>}
                  </div>
                  <div className="border-t-4 border-l-4 border-r-4 border-transparent border-t-gray-800 w-0 h-0 mx-auto"></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BadgeDisplay;
