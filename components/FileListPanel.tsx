import React from 'react';
import { FileUploader } from './FileUploader';
import { DocumentIcon, CheckIcon, XMarkIcon } from './icons/Icons';
import { UserPlusIcon } from './icons/UserPlusIcon';
import { Spinner } from './Spinner';
import type { ExtractedInfo } from '../types';

export interface UploadedFile {
  id: string;
  name: string;
  rawText: string;
  status: 'pending' | 'loading' | 'success' | 'error' | 'added';
  extractedInfo: ExtractedInfo | null;
  error: string | null;
}

interface FileListPanelProps {
  files: UploadedFile[];
  selectedFileId: string | null;
  onSelectFile: (id: string) => void;
  onFilesAdded: (readFiles: { name: string; content: string }[]) => void;
  onProcessAll: () => void;
  isProcessingAll: boolean;
}

const FileStatusIcon: React.FC<{ status: UploadedFile['status'] }> = ({ status }) => {
    switch(status) {
        case 'loading':
            return <Spinner size="sm"/>;
        case 'success':
            return <CheckIcon className="h-4 w-4 text-green-500" />;
        case 'error':
            return <XMarkIcon className="h-4 w-4 text-red-500" />;
        case 'added':
            // Fix: Wrap the icon in a `span` with a `title` attribute to provide a tooltip and resolve the TS error.
            return <span title="Added to dashboard"><UserPlusIcon className="h-4 w-4 text-green-600" /></span>;
        case 'pending':
        default:
            return null;
    }
}

export const FileListPanel: React.FC<FileListPanelProps> = ({ files, selectedFileId, onSelectFile, onFilesAdded, onProcessAll, isProcessingAll }) => {
    const pendingFilesCount = files.filter(f => f.status === 'pending').length;
  
    return (
    <div className="bg-white p-6 rounded-lg shadow-md h-full flex flex-col">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Upload Resumes</h3>
      <FileUploader onFilesRead={onFilesAdded} />
      
      <div className="flex-grow mt-4 overflow-y-auto">
        {files.length > 0 ? (
            <ul className="space-y-2">
                {files.map(file => (
                    <li key={file.id}>
                        <button 
                            onClick={() => onSelectFile(file.id)}
                            className={`w-full text-left p-3 rounded-md flex items-center justify-between transition-colors ${
                                selectedFileId === file.id 
                                ? 'bg-blue-100 text-blue-800'
                                : 'hover:bg-gray-100'
                            }`}
                        >
                            <div className="flex items-center min-w-0">
                                <DocumentIcon className="h-5 w-5 mr-3 text-gray-400 flex-shrink-0" />
                                <span className="text-sm font-medium truncate">{file.name}</span>
                            </div>
                            <div className="ml-2 flex-shrink-0">
                                <FileStatusIcon status={file.status} />
                            </div>
                        </button>
                    </li>
                ))}
            </ul>
        ) : (
            <div className="flex items-center justify-center h-full text-sm text-gray-500">
                Uploaded files will appear here.
            </div>
        )}
      </div>

      <div className="mt-4 border-t pt-4">
        <button 
            onClick={onProcessAll}
            disabled={isProcessingAll || pendingFilesCount === 0}
            className="w-full bg-indigo-600 text-white py-2 rounded-md font-semibold text-sm hover:bg-indigo-700 transition-colors disabled:bg-indigo-300 disabled:cursor-not-allowed flex items-center justify-center"
        >
            {isProcessingAll ? <Spinner size="sm" /> : `Process All for Extraction (${pendingFilesCount})`}
        </button>
      </div>
    </div>
  );
};