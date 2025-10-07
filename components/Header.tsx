
import React from 'react';
import { BriefcaseIcon } from './icons/Icons';

export const Header: React.FC = () => {
  return (
    <header className="bg-white">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex items-center">
        <BriefcaseIcon className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-900 ml-3">AI Resume Screening Tool</h1>
      </div>
    </header>
  );
};
