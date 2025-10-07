
import React from 'react';
import type { Candidate } from '../types';
import { RocketLaunchIcon, UserCircleIcon, EnvelopeIcon } from './icons/Icons';
import { Spinner } from './Spinner';

interface CandidateTableProps {
  candidates: Candidate[];
  evaluationLoading: Set<string>;
  onEvaluate: (candidateId: string) => void;
  selectedIds: Set<string>;
  onToggleSelection: (candidateId: string) => void;
  onToggleSelectAll: () => void;
  onOpenEmailModal: (candidates: Candidate[]) => void;
  onViewProfile: (candidate: Candidate) => void;
  isConfigValid: boolean;
}

const getScoreColor = (score: number) => {
    if (score >= 85) return 'bg-green-100 text-green-800';
    if (score >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
}

export const CandidateTable: React.FC<CandidateTableProps> = ({ candidates, evaluationLoading, onEvaluate, selectedIds, onToggleSelection, onToggleSelectAll, onOpenEmailModal, onViewProfile, isConfigValid }) => {
  if (candidates.length === 0) {
    return (
        <div className="text-center py-16 text-gray-500">
            <h3 className="text-lg font-semibold">No candidates yet.</h3>
            <p>Upload resumes and add them to the dashboard to get started.</p>
        </div>
    );
  }
  
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                checked={candidates.length > 0 && candidates.length === selectedIds.size}
                onChange={onToggleSelectAll}
                aria-label="Select all candidates"
              />
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Skills</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fit Score</th>
            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {candidates.map((candidate) => {
            const isEvaluating = evaluationLoading.has(candidate.id);
            const canEmail = candidate.evaluation && !candidate.emailSent;

            return (
            <React.Fragment key={candidate.id}>
                <tr className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={selectedIds.has(candidate.id)}
                    onChange={() => onToggleSelection(candidate.id)}
                    aria-label={`Select ${candidate.name}`}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <button onClick={() => onViewProfile(candidate)} className="text-sm font-medium text-gray-900 hover:text-blue-600 text-left">
                        {candidate.name}
                    </button>
                    <div className="text-sm text-gray-500">{candidate.fileName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                        <div>
                            <div className="text-sm text-gray-900">{candidate.email}</div>
                            <div className="text-sm text-gray-500">{candidate.contact}</div>
                        </div>
                        {candidate.emailSent && (
                            <span title="Email has been sent to this candidate" className="ml-3">
                                <EnvelopeIcon className="h-5 w-5 text-green-600"/>
                            </span>
                        )}
                    </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                        {candidate.skills.slice(0, 4).map(skill => (
                            <span key={skill} className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                {skill}
                            </span>
                        ))}
                        {candidate.skills.length > 4 && <span className="text-xs text-gray-500">+{candidate.skills.length - 4} more</span>}
                    </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {candidate.evaluation ? (
                        <button 
                            onClick={() => onOpenEmailModal([candidate])} 
                            disabled={!canEmail}
                            title={!canEmail ? "Email already sent or evaluation pending" : `Email ${candidate.name}`}
                            className={`px-3 py-1 inline-flex text-sm leading-5 font-bold rounded-full ${getScoreColor(candidate.evaluation.final_fit_score)} ${canEmail ? 'hover:ring-2 hover:ring-offset-1 hover:ring-blue-500' : 'cursor-not-allowed opacity-70'} transition-all`}>
                            {candidate.evaluation.final_fit_score}
                        </button>
                    ) : (
                        <span className="text-gray-400 italic">Not evaluated</span>
                    )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <div className="flex items-center justify-center space-x-2">
                        <button
                            onClick={() => onViewProfile(candidate)}
                            className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-100 transition-colors"
                            title="View Profile"
                        >
                            <UserCircleIcon className="h-5 w-5" />
                        </button>
                        <button 
                            onClick={() => onEvaluate(candidate.id)} 
                            disabled={isEvaluating || !isConfigValid}
                            title={!isConfigValid ? "Please fill in Job Roles and Requirements first" : "Evaluate candidate"}
                            className="flex items-center justify-center bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-md font-semibold text-xs hover:bg-indigo-200 disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-wait transition-colors"
                        >
                            {isEvaluating ? <Spinner size="sm" /> : <RocketLaunchIcon className="h-4 w-4 mr-1.5" />}
                            Evaluate
                        </button>
                    </div>
                </td>
                </tr>
            </React.Fragment>
          )})}
        </tbody>
      </table>
    </div>
  );
};