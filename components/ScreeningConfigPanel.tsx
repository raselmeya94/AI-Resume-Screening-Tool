import React from 'react';
import { KeyIcon } from './icons/Icons';

interface ScreeningConfigPanelProps {
    jobRequirements: string;
    setJobRequirements: (value: string) => void;
    apiKey: string;
    setApiKey: (value: string) => void;
    jobRoles: string;
    setJobRoles: (value: string) => void;
}

export const ScreeningConfigPanel: React.FC<ScreeningConfigPanelProps> = ({ 
    jobRequirements, setJobRequirements, 
    apiKey, setApiKey,
    jobRoles, setJobRoles
}) => {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-md sticky top-24 w-full max-w-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Screening Configs</h3>
      <div className="space-y-6">
        <div>
          <label htmlFor="llm-model" className="block text-sm font-medium text-gray-700">
            LLM Selection
          </label>
          <select
            id="llm-model"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            defaultValue="gemini"
          >
            <option value="gemini">Gemini 2.5 Flash</option>
            <option value="gpt4" disabled>GPT-4 (coming soon)</option>
          </select>
        </div>

        <div>
          <label htmlFor="api-key" className="block text-sm font-medium text-gray-700">
            API Key
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                <KeyIcon className="h-5 w-5" />
            </span>
            <input
              type="password"
              id="api-key"
              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter your API Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <button
                type="button"
                onClick={() => alert('API Key test functionality is not implemented yet.')}
                className="-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              Test
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="job-roles" className="block text-sm font-medium text-gray-700">
            Expected Job Roles <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="job-roles"
            className="mt-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
            value={jobRoles}
            onChange={(e) => setJobRoles(e.target.value)}
            placeholder="e.g., Senior Engineer, Product Manager"
            required
          />
          <p className="mt-1 text-xs text-gray-500">Required for evaluation. Comma-separated roles are supported.</p>
        </div>
        
        <div>
          <label htmlFor="job-requirements" className="block text-sm font-medium text-gray-700">
            Job Requirements <span className="text-red-500">*</span>
          </label>
          <textarea
            id="job-requirements"
            rows={8}
            className="mt-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
            value={jobRequirements}
            onChange={(e) => setJobRequirements(e.target.value)}
            placeholder="Enter key requirements, one per line..."
            required
          />
           <p className="mt-1 text-xs text-gray-500">Required for evaluation.</p>
        </div>
      </div>
    </div>
  );
};