import React, { useState, useCallback, useMemo } from 'react';
import { CandidateTable } from './CandidateTable';
import { ScreeningConfigPanel } from './ScreeningConfigPanel';
import { evaluateCandidate } from '../services/geminiService';
import type { Candidate, EvaluationResult, SentEmail } from '../types';
import { EmailModal } from './EmailModal';
import { Toast } from './Toast';
import { EnvelopeIcon, RocketLaunchIcon } from './icons/Icons';
import { FilterControls } from './FilterControls';
import { CandidateProfileModal } from './CandidateProfileModal';
import { Spinner } from './Spinner';

interface DashboardPageProps {
    candidates: Candidate[];
    onUpdateEvaluation: (candidateId: string, result: EvaluationResult) => void;
    onMarkEmailSent: (candidateIds: string[]) => void;
    onLogEmails: (emails: Omit<SentEmail, 'id' | 'sentAt'>[]) => void;
    jobRoles: string;
    setJobRoles: (value: string) => void;
    jobRequirements: string;
    setJobRequirements: (value: string) => void;
    apiKey: string;
    setApiKey: (value: string) => void;
}

const initialFilterState = {
  skills: '',
  minExp: '',
  maxExp: '',
  minScore: '',
  maxScore: '',
};

export const DashboardPage: React.FC<DashboardPageProps> = ({ 
    candidates, 
    onUpdateEvaluation, 
    onMarkEmailSent, 
    onLogEmails,
    jobRoles,
    setJobRoles,
    jobRequirements,
    setJobRequirements,
    apiKey,
    setApiKey
}) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [evaluationLoading, setEvaluationLoading] = useState<Set<string>>(new Set());
  const [isBulkEvaluating, setIsBulkEvaluating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailCandidates, setEmailCandidates] = useState<Candidate[]>([]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [filters, setFilters] = useState(initialFilterState);
  const [viewingCandidate, setViewingCandidate] = useState<Candidate | null>(null);

  const isConfigValid = useMemo(() => jobRequirements.trim() !== '' && jobRoles.trim() !== '', [jobRequirements, jobRoles]);

  const handleFilterChange = useCallback((changedFilters: Partial<typeof initialFilterState>) => {
    setFilters(prev => ({ ...prev, ...changedFilters }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters(initialFilterState);
  }, []);

  const filteredCandidates = useMemo(() => {
    return candidates.filter(candidate => {
      const { skills, minExp, maxExp, minScore, maxScore } = filters;

      if (skills) {
        const searchSkills = skills.toLowerCase().split(',').map(s => s.trim()).filter(Boolean);
        const candidateSkills = candidate.skills.map(s => s.toLowerCase());
        if (searchSkills.length > 0 && !searchSkills.every(skill => candidateSkills.some(cs => cs.includes(skill)))) {
            return false;
        }
      }
      
      const minExpNum = parseFloat(minExp);
      const maxExpNum = parseFloat(maxExp);
      if (!isNaN(minExpNum) && candidate.experienceYears < minExpNum) return false;
      if (!isNaN(maxExpNum) && candidate.experienceYears > maxExpNum) return false;

      const minScoreNum = parseFloat(minScore);
      const maxScoreNum = parseFloat(maxScore);
      if (minScore || maxScore) {
          if (!candidate.evaluation) return false;
          if (!isNaN(minScoreNum) && candidate.evaluation.final_fit_score < minScoreNum) return false;
          if (!isNaN(maxScoreNum) && candidate.evaluation.final_fit_score > maxScoreNum) return false;
      }

      return true;
    });
  }, [candidates, filters]);

  const toggleSelection = useCallback((candidateId: string) => {
    setSelectedIds(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(candidateId)) {
        newSelection.delete(candidateId);
      } else {
        newSelection.add(candidateId);
      }
      return newSelection;
    });
  }, []);

  const handleToggleSelectAll = useCallback(() => {
    const filteredIds = filteredCandidates.map(c => c.id);
    const filteredIdSet = new Set(filteredIds);
    
    const allFilteredSelected = filteredIds.length > 0 && filteredIds.every(id => selectedIds.has(id));

    if (allFilteredSelected) {
      setSelectedIds(prev => {
        const newSelection = new Set(prev);
        filteredIdSet.forEach(id => newSelection.delete(id));
        return newSelection;
      });
    } else {
      setSelectedIds(prev => new Set([...Array.from(prev), ...Array.from(filteredIdSet)]));
    }
  }, [filteredCandidates, selectedIds]);

  const handleEvaluate = useCallback(async (candidateId: string) => {
    if (!isConfigValid) {
        setToast({ message: 'Please fill in Job Roles and Requirements before evaluating.', type: 'error' });
        return;
    }
    const candidate = candidates.find(c => c.id === candidateId);
    if (!candidate) return;

    setEvaluationLoading(prev => new Set(prev).add(candidateId));
    setError(null);
    try {
      const result = await evaluateCandidate(candidate.rawText, jobRequirements, jobRoles);
      onUpdateEvaluation(candidateId, result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred during evaluation.');
      console.error(err);
    } finally {
      setEvaluationLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(candidateId);
        return newSet;
      });
    }
  }, [candidates, jobRequirements, jobRoles, onUpdateEvaluation, isConfigValid]);

  const handleEvaluateSelected = useCallback(async () => {
    const idsToEvaluate = Array.from(selectedIds);
    if (idsToEvaluate.length === 0) return;

    setIsBulkEvaluating(true);
    setError(null);

    const evaluationPromises = idsToEvaluate.map(id => handleEvaluate(id));
    
    await Promise.all(evaluationPromises);

    setIsBulkEvaluating(false);
    setSelectedIds(new Set());
  }, [selectedIds, handleEvaluate]);

  const handleOpenEmailModal = useCallback((candidatesForEmail: Candidate[]) => {
    const eligibleCandidates = candidatesForEmail.filter(c => c.evaluation && !c.emailSent);
    if (eligibleCandidates.length > 0) {
      setEmailCandidates(eligibleCandidates);
      setIsEmailModalOpen(true);
    } else if (candidatesForEmail.length > 0) {
        const message = candidatesForEmail.every(c => !c.evaluation) 
            ? 'Selected candidates must be evaluated first.'
            : 'All selected candidates have already been emailed.';
        setToast({ message, type: 'error' });
    }
  }, []);

  const handleSendEmail = (emailsToSend: { candidate: Candidate; subject: string; body: string }[]) => {
    setIsEmailModalOpen(false);

    const sentCandidateIds = emailsToSend.map(e => e.candidate.id);
    onMarkEmailSent(sentCandidateIds);

    const emailLogs: Omit<SentEmail, 'id' | 'sentAt'>[] = emailsToSend.map(e => ({
        candidate: { id: e.candidate.id, name: e.candidate.name, email: e.candidate.email },
        subject: e.subject,
        body: e.body,
    }));
    onLogEmails(emailLogs);

    setToast({ message: `Successfully sent emails to ${sentCandidateIds.length} candidate(s).`, type: 'success' });
    setSelectedIds(new Set());
  };
  
  const selectedCandidates = useMemo(() => filteredCandidates.filter(c => selectedIds.has(c.id)), [filteredCandidates, selectedIds]);
  const eligibleForEmail = useMemo(() => selectedCandidates.filter(c => c.evaluation && !c.emailSent), [selectedCandidates]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-9">
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Candidate Dashboard</h3>
              <div className="flex items-center space-x-2">
                <button
                    onClick={handleEvaluateSelected}
                    disabled={selectedCandidates.length === 0 || isBulkEvaluating || !isConfigValid}
                    title={!isConfigValid ? "Please fill in Job Roles and Requirements first" : ""}
                    className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-md font-semibold text-sm hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors"
                >
                    {isBulkEvaluating ? <Spinner size="sm" /> : <RocketLaunchIcon className="h-5 w-5 mr-2" />}
                    Evaluate Selected ({selectedCandidates.length})
                </button>
                <button
                  onClick={() => handleOpenEmailModal(selectedCandidates)}
                  disabled={eligibleForEmail.length === 0}
                  className="flex items-center bg-gray-600 text-white px-4 py-2 rounded-md font-semibold text-sm hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  <EnvelopeIcon className="h-5 w-5 mr-2" />
                  Email Selected ({eligibleForEmail.length})
                </button>
              </div>
            </div>
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
            
            <FilterControls 
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
            />

            <CandidateTable 
              candidates={filteredCandidates} 
              evaluationLoading={evaluationLoading}
              onEvaluate={handleEvaluate} 
              selectedIds={selectedIds}
              onToggleSelection={toggleSelection}
              onToggleSelectAll={handleToggleSelectAll}
              onOpenEmailModal={handleOpenEmailModal}
              onViewProfile={(candidate) => setViewingCandidate(candidate)}
              isConfigValid={isConfigValid}
            />
        </div>
      </div>
      <div className="lg:col-span-3">
        <ScreeningConfigPanel
          jobRequirements={jobRequirements}
          setJobRequirements={setJobRequirements}
          apiKey={apiKey}
          setApiKey={setApiKey}
          jobRoles={jobRoles}
          setJobRoles={setJobRoles}
        />
      </div>
      {isEmailModalOpen && (
        <EmailModal 
          isOpen={isEmailModalOpen}
          onClose={() => setIsEmailModalOpen(false)}
          candidates={emailCandidates}
          onSend={handleSendEmail}
          jobTitle={jobRoles}
        />
      )}
      {viewingCandidate && (
        <CandidateProfileModal
          isOpen={!!viewingCandidate}
          onClose={() => setViewingCandidate(null)}
          candidate={viewingCandidate}
        />
      )}
      {toast && (
        <Toast 
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};