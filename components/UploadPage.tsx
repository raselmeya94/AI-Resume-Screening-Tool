import React, { useState, useCallback } from 'react';
import { FileListPanel, UploadedFile } from './FileListPanel';
import { ExtractionPanel } from './ExtractionPanel';
import { ConfigPanel } from './ConfigPanel';
import type { Candidate } from '../types';

interface UploadPageProps {
    files: UploadedFile[];
    selectedFileId: string | null;
    isProcessingAll: boolean;
    onSelectFile: (id: string) => void;
    onFilesAdded: (readFiles: { name: string; content: string }[]) => void;
    onRunExtraction: (fileId: string) => void;
    onProcessAll: () => void;
    onAddCandidate: (candidate: Omit<Candidate, 'evaluation' | 'emailSent'>) => void;
}

export const UploadPage: React.FC<UploadPageProps> = ({ 
    files, 
    selectedFileId, 
    isProcessingAll,
    onSelectFile, 
    onFilesAdded, 
    onRunExtraction,
    onProcessAll,
    onAddCandidate,
}) => {
  
  const handleSaveCandidate = useCallback((fileId: string) => {
      const fileToAdd = files.find(f => f.id === fileId);
      if (fileToAdd && fileToAdd.extractedInfo) {
          onAddCandidate({
              id: fileToAdd.id,
              fileName: fileToAdd.name,
              rawText: fileToAdd.rawText,
              name: fileToAdd.extractedInfo.candidate_name,
              email: fileToAdd.extractedInfo.email_address,
              contact: fileToAdd.extractedInfo.contact_number,
              education: fileToAdd.extractedInfo.education_summary,
              experience: fileToAdd.extractedInfo.experience_summary,
              skills: fileToAdd.extractedInfo.skills,
              experienceYears: fileToAdd.extractedInfo.years_of_experience,
          });
      }
  }, [files, onAddCandidate]);

  const selectedFile = files.find(f => f.id === selectedFileId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-3">
        <FileListPanel 
            files={files}
            selectedFileId={selectedFileId}
            onSelectFile={onSelectFile}
            onFilesAdded={onFilesAdded}
            onProcessAll={onProcessAll}
            isProcessingAll={isProcessingAll}
        />
      </div>
      <div className="lg:col-span-6">
        <ExtractionPanel
          rawText={selectedFile?.rawText ?? ''}
          fileName={selectedFile?.name ?? ''}
          extractedInfo={selectedFile?.extractedInfo ?? null}
          isLoading={selectedFile?.status === 'loading'}
          status={selectedFile?.status ?? 'pending'}
          error={selectedFile?.error ?? null}
          onRunExtraction={() => selectedFileId && onRunExtraction(selectedFileId)}
          onSaveCandidate={() => selectedFileId && handleSaveCandidate(selectedFileId)}
          isActionable={!!selectedFile}
        />
      </div>
      <div className="lg:col-span-3">
        <ConfigPanel />
      </div>
    </div>
  );
};
