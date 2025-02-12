import React from 'react';
import '../../app/globals.css'

interface AchievementProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Achievement: React.FC<AchievementProps> = ({ icon, title, description }) => {
  return (
    <div className="flex flex-col items-center text-center w-[260px] p-7 bg-secondaryColor shadow-lg rounded-lg">
      <div className="text-5xl text-mainColor">{icon}</div>
      <h3 className="mt-4 text-xl font-bold">{title}</h3>
      <p className="mt-2 text-gray-400 font-thin">{description}</p>
    </div>
  );
};

export default Achievement;
