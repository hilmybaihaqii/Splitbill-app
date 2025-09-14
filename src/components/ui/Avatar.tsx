import React from 'react';

interface AvatarProps {
  name: string;
}

const Avatar: React.FC<AvatarProps> = ({ name }) => {
  const initials = name.split(' ').map((part) => part.charAt(0).toUpperCase()).join('');
  return (
    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-lg">
      {initials}
    </div>
  );
};

export default Avatar;