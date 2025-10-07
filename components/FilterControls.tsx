import React from 'react';
import { XCircleIcon, FunnelIcon } from './icons/Icons';

interface FilterState {
  skills: string;
  minExp: string;
  maxExp: string;
  minScore: string;
  maxScore: string;
}

interface FilterControlsProps {
  filters: FilterState;
  onFilterChange: (changedFilters: Partial<FilterState>) => void;
  onClearFilters: () => void;
}

export const FilterControls: React.FC<FilterControlsProps> = ({ filters, onFilterChange, onClearFilters }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ [e.target.name]: e.target.value });
  };

  return (
    <div className="mb-4 pt-4 border-t border-gray-200">
       <div className="grid grid-cols-1 md:grid-cols-12 gap-x-4 gap-y-3 items-end">
        <div className="md:col-span-12">
            <h4 className="flex items-center text-sm font-semibold text-gray-600 mb-2">
                <FunnelIcon className="h-5 w-5 mr-2 text-gray-400" />
                Filter Candidates
            </h4>
        </div>

        {/* Skills Filter */}
        <div className="md:col-span-4">
          <label htmlFor="skills" className="block text-xs font-medium text-gray-500">
            Skills
          </label>
          <input
            type="text"
            name="skills"
            id="skills"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
            placeholder="React, Node.js..."
            value={filters.skills}
            onChange={handleInputChange}
          />
        </div>

        {/* Experience Filter */}
        <div className="md:col-span-3">
            <label className="block text-xs font-medium text-gray-500">Experience (Years)</label>
            <div className="flex items-center mt-1 space-x-2">
                <input
                    type="number"
                    name="minExp"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                    placeholder="Min"
                    value={filters.minExp}
                    onChange={handleInputChange}
                    min="0"
                />
                <input
                    type="number"
                    name="maxExp"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                    placeholder="Max"
                    value={filters.maxExp}
                    onChange={handleInputChange}
                    min="0"
                />
            </div>
        </div>
        
        {/* Score Filter */}
        <div className="md:col-span-3">
            <label className="block text-xs font-medium text-gray-500">Fit Score</label>
            <div className="flex items-center mt-1 space-x-2">
                <input
                    type="number"
                    name="minScore"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                    placeholder="Min"
                    value={filters.minScore}
                    onChange={handleInputChange}
                    min="0" max="100"
                />
                <input
                    type="number"
                    name="maxScore"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                    placeholder="Max"
                    value={filters.maxScore}
                    onChange={handleInputChange}
                    min="0" max="100"
                />
            </div>
        </div>
        
        {/* Action Buttons */}
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-transparent hidden md:block">Actions</label>
          <button
            onClick={onClearFilters}
            className="flex mt-1 items-center justify-center w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-semibold text-sm hover:bg-gray-300 transition-colors"
          >
            <XCircleIcon className="h-5 w-5 mr-1.5" />
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};