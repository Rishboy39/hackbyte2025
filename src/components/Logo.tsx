
import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-cafeteria-primary text-white font-bold">
        SB
      </div>
      <span className="font-bold text-lg hidden md:block">School Bites</span>
    </div>
  );
};

export default Logo;
