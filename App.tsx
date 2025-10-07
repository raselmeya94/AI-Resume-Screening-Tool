import React, { useState, useCallback } from 'react';
import { UploadPage } from './components/UploadPage';
import { DashboardPage } from './components/DashboardPage';
import { OutboxPage } from './components/OutboxPage';
import { Page, Candidate, EvaluationResult, SentEmail, ExtractedInfo } from './types';
import { Header } from './components/Header';
import { DocumentTextIcon, TableCellsIcon } from './components/icons/Icons';
import { PaperAirplaneIcon } from './components/icons/PaperAirplaneIcon';
import { UploadedFile } from './components/FileListPanel';
import { extractInfoFromResume } from './services/geminiService';
import { generateUUID } from './utils/uuid';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.UPLOAD);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [sentEmails, setSentEmails] = useState<SentEmail[]>([]);

  // State lifted from UploadPage
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [isProcessingAll, setIsProcessingAll] = useState<boolean>(false);

  // State lifted from DashboardPage
  const [jobRequirements, setJobRequirements] = useState<string>('');
  const [apiKey, setApiKey] = useState<string>('');
  const [jobRoles, setJobRoles] = useState<string>('');

  const navigate = useCallback((page: Page) => {
    setCurrentPage(page);
  }, []);
  
  // Handlers lifted from UploadPage
  const handleFilesAdded = useCallback((readFiles: { name: string; content: string }[]) => {
      const newFiles: UploadedFile[] = readFiles.map(rf => ({
        id: generateUUID(),
        name: rf.name,
        rawText: rf.content,
        status: 'pending',
        extractedInfo: null,
        error: null,
      }));
      setFiles(prev => [...prev, ...newFiles]);
      if (!selectedFileId && newFiles.length > 0) {
        setSelectedFileId(newFiles[0].id);
      }
    }, [selectedFileId]);

  const handleRunExtraction = useCallback(async (fileId: string) => {
    setFiles(prev => prev.map(f => f.id === fileId ? { ...f, status: 'loading', error: null } : f));
    
    const fileToProcess = files.find(f => f.id === fileId);
    if (!fileToProcess) return;

    try {
      const info = await extractInfoFromResume(fileToProcess.rawText);
      setFiles(prev => prev.map(f => f.id === fileId ? { ...f, status: 'success', extractedInfo: info } : f));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setFiles(prev => prev.map(f => f.id === fileId ? { ...f, status: 'error', error: errorMessage } : f));
    }
  }, [files]);

  const handleProcessAll = useCallback(async () => {
    const filesToProcess = files.filter(f => f.status === 'pending');
    if (filesToProcess.length === 0) return;

    setIsProcessingAll(true);
    setFiles(prev => prev.map(f => f.status === 'pending' ? { ...f, status: 'loading', error: null } : f));

    const processingPromises = filesToProcess.map(file => 
      extractInfoFromResume(file.rawText)
        .then(info => ({ id: file.id, status: 'success' as const, extractedInfo: info, error: null }))
        .catch(err => ({
          id: file.id, status: 'error' as const, extractedInfo: null,
          error: err instanceof Error ? err.message : 'Unknown error',
        }))
    );
    
    const results = await Promise.all(processingPromises);
    
    setFiles(prev => {
        const filesMap = new Map(prev.map(f => [f.id, f]));
        results.forEach(res => {
            const existingFile = filesMap.get(res.id);
            if (existingFile) filesMap.set(res.id, { ...existingFile, ...res });
        });
        return Array.from(filesMap.values());
    });
    setIsProcessingAll(false);
  }, [files]);

  const handleAddCandidate = useCallback((newCandidate: Omit<Candidate, 'evaluation' | 'emailSent'>) => {
    setCandidates(prev => {
      if (prev.some(c => c.id === newCandidate.id)) return prev;
      return [...prev, { ...newCandidate, evaluation: undefined, emailSent: false }];
    });
     setFiles(prev => prev.map(f => f.id === newCandidate.id ? { ...f, status: 'added' } : f));
  }, []);

  const handleUpdateEvaluation = useCallback((candidateId: string, result: EvaluationResult) => {
      setCandidates(prev => 
          prev.map(c => c.id === candidateId ? { ...c, evaluation: result } : c)
      );
  }, []);

  const handleMarkEmailSent = useCallback((candidateIds: string[]) => {
    setCandidates(prev =>
      prev.map(c =>
        candidateIds.includes(c.id) ? { ...c, emailSent: true } : c
      )
    );
  }, []);
  
  const handleLogEmails = useCallback((emails: Omit<SentEmail, 'id' | 'sentAt'>[]) => {
      const newEmails: SentEmail[] = emails.map(e => ({
          ...e,
          id: generateUUID(),
          sentAt: new Date(),
      }));
      setSentEmails(prev => [...newEmails, ...prev]);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      <nav className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-16">
            <div className="flex items-center">
              <div className="flex items-baseline space-x-4">
                <button
                  onClick={() => navigate(Page.UPLOAD)}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentPage === Page.UPLOAD ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                ><DocumentTextIcon className="h-5 w-5 mr-2" />Upload & Extract</button>
                <button
                  onClick={() => navigate(Page.DASHBOARD)}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentPage === Page.DASHBOARD ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                ><TableCellsIcon className="h-5 w-5 mr-2" />Screening Dashboard</button>
                <button
                  onClick={() => navigate(Page.OUTBOX)}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentPage === Page.OUTBOX ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                ><PaperAirplaneIcon className="h-5 w-5 mr-2" />Outbox</button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="py-10">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {currentPage === Page.UPLOAD && (
            <UploadPage 
                files={files}
                selectedFileId={selectedFileId}
                isProcessingAll={isProcessingAll}
                onSelectFile={setSelectedFileId}
                onFilesAdded={handleFilesAdded}
                onRunExtraction={handleRunExtraction}
                onProcessAll={handleProcessAll}
                onAddCandidate={handleAddCandidate}
            />
          )}
          {currentPage === Page.DASHBOARD && (
            <DashboardPage 
              candidates={candidates} 
              onUpdateEvaluation={handleUpdateEvaluation}
              onMarkEmailSent={handleMarkEmailSent} 
              onLogEmails={handleLogEmails}
              jobRoles={jobRoles}
              setJobRoles={setJobRoles}
              jobRequirements={jobRequirements}
              setJobRequirements={setJobRequirements}
              apiKey={apiKey}
              setApiKey={setApiKey}
            />
          )}
          {currentPage === Page.OUTBOX && (
              <OutboxPage sentEmails={sentEmails} />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;