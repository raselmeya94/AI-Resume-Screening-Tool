import React from 'react';
import type { Candidate } from '../types';
import { XMarkIcon, UserCircleIcon } from './icons/Icons';

interface CandidateProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: Candidate;
}

const InfoCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h4 className="text-sm font-semibold text-gray-500 mb-3">{title}</h4>
        {children}
    </div>
);

const ScoreBar: React.FC<{ label: string, score: number }> = ({ label, score }) => {
    const getScoreColor = (s: number) => {
        if (s >= 85) return 'bg-green-500';
        if (s >= 70) return 'bg-yellow-500';
        return 'bg-red-500';
    };
    return (
        <div>
            <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-700">{label}</span>
                <span className={`text-sm font-bold ${getScoreColor(score).replace('bg','text')}`}>{score}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div className={`${getScoreColor(score)} h-2 rounded-full`} style={{ width: `${score}%` }}></div>
            </div>
        </div>
    )
};


export const CandidateProfileModal: React.FC<CandidateProfileModalProps> = ({ isOpen, onClose, candidate }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-gray-50 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-gray-200">
                <div className="flex items-start justify-between">
                    <div className="flex items-center">
                        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                            <UserCircleIcon className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="mt-0 ml-4 text-left">
                            <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                            {candidate.name}
                            </h3>
                            <p className="text-sm text-gray-500">{candidate.fileName}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
                        <XMarkIcon className="h-6 w-6 text-gray-500"/>
                    </button>
                </div>
            </div>
          
          <div className="px-4 py-5 sm:p-6 bg-gray-50 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-1 space-y-6">
                    <InfoCard title="Contact Information">
                        <div className="space-y-2 text-sm">
                            <p><strong className="font-medium text-gray-600">Email:</strong> {candidate.email}</p>
                            <p><strong className="font-medium text-gray-600">Phone:</strong> {candidate.contact}</p>
                            <p><strong className="font-medium text-gray-600">Experience:</strong> {candidate.experienceYears} years</p>
                        </div>
                    </InfoCard>
                    <InfoCard title="Skills">
                         <div className="flex flex-wrap gap-2">
                            {candidate.skills.map((skill, index) => (
                                <span key={index} className="px-2.5 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </InfoCard>
                    {candidate.evaluation && (
                        <InfoCard title="Evaluation Results">
                            <div className="space-y-4">
                               <ScoreBar label="Skills" score={candidate.evaluation.skills_score} />
                               <ScoreBar label="Experience" score={candidate.evaluation.experience_score} />
                               <ScoreBar label="Education" score={candidate.evaluation.education_score} />
                               <ScoreBar label="Keywords" score={candidate.evaluation.keywords_score} />
                               <div className="pt-2 border-t">
                                <ScoreBar label="Final Fit Score" score={candidate.evaluation.final_fit_score} />
                               </div>
                            </div>
                            <p className="mt-4 text-sm text-gray-600 bg-gray-100 p-3 rounded-md">{candidate.evaluation.explanation}</p>
                        </InfoCard>
                    )}
                </div>
                {/* Right Column */}
                <div className="lg:col-span-2 space-y-6">
                    <InfoCard title="Experience Summary">
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{candidate.experience}</p>
                    </InfoCard>
                    <InfoCard title="Education Summary">
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{candidate.education}</p>
                    </InfoCard>
                     <InfoCard title="Raw Resume Text">
                        <textarea
                            readOnly
                            value={candidate.rawText}
                            className="w-full h-80 p-3 border border-gray-200 rounded-md bg-gray-100 text-xs text-gray-600 focus:ring-blue-500 focus:border-blue-500 font-mono"
                        />
                    </InfoCard>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
