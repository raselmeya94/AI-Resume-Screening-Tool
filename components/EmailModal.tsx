
import React, { useState, useEffect } from 'react';
import type { Candidate, EmailTemplate } from '../types';
import { emailTemplates } from '../data/emailTemplates';
import { XMarkIcon, EnvelopeIcon } from './icons/Icons'; // Assuming these are valid paths

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidates: Candidate[];
  // Removed onSend as the modal will now handle sending internally
  jobTitle: string;
}

const replacePlaceholders = (template: string, candidate: Candidate, jobTitle: string): string => {
  return template
    .replace(/{{name}}/g, candidate.name)
    .replace(/{{job_title}}/g, jobTitle);
};

export const EmailModal: React.FC<EmailModalProps> = ({ isOpen, onClose, candidates, jobTitle }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate>(emailTemplates[0]);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [sendSuccess, setSendSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (candidates.length > 0) {
      if (candidates.length === 1) {
        const firstCandidate = candidates[0];
        setSubject(replacePlaceholders(selectedTemplate.subject, firstCandidate, jobTitle));
        setBody(replacePlaceholders(selectedTemplate.body, firstCandidate, jobTitle));
      } else {
        setSubject(selectedTemplate.subject.replace(/{{job_title}}/g, jobTitle));
        setBody(selectedTemplate.body.replace(/{{job_title}}/g, jobTitle));
      }
    }
    // Reset status messages when modal opens or candidates change
    setSendError(null);
    setSendSuccess(false);
  }, [selectedTemplate, candidates, jobTitle, isOpen]); // Added isOpen to dependencies to reset state on open

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const template = emailTemplates.find(t => t.name === e.target.value);
    if (template) {
        setSelectedTemplate(template);
    }
  };

  const handleSend = async () => {
    setIsSending(true);
    setSendError(null);
    setSendSuccess(false);

    const emailsToSend = candidates.map(candidate => ({
        to: candidate.email, // Assuming candidate has an email property
        subject: subject.replace(/{{name}}/g, candidate.name),
        body: body.replace(/{{name}}/g, candidate.name),
    }));

    try {
      // THIS IS THE CRUCIAL PART: Making an API call to your backend
      const response = await fetch('http://localhost:5000/api/send-emails', { // Replace with your actual backend endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // You might include authorization headers here if your API requires it
        },
        body: JSON.stringify(emailsToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send emails');
      }

      setSendSuccess(true);
      // Optionally, close the modal on success after a short delay
      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (error: any) {
      console.error('Error sending emails:', error);
      setSendError(error.message || 'An unexpected error occurred.');
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  const recipientText = candidates.length > 1 ? `${candidates.length} candidates` : candidates[0]?.name || 'No recipient';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                <EnvelopeIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Send Email to {recipientText}
                </h3>
                <div className="mt-4 space-y-4">
                    <div>
                        <label htmlFor="template-select" className="block text-sm font-medium text-gray-700">Email Template</label>
                        <select id="template-select" value={selectedTemplate.name} onChange={handleTemplateChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                            {emailTemplates.map(t => <option key={t.name}>{t.name}</option>)}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
                        <input type="text" id="subject" value={subject} onChange={e => setSubject(e.target.value)} className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2"/>
                    </div>
                    <div>
                        <label htmlFor="body" className="block text-sm font-medium text-gray-700">Body</label>
                        <textarea id="body" rows={10} value={body} onChange={e => setBody(e.target.value)} className="mt-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2" />
                        <p className="mt-1 text-xs text-gray-500">Placeholders like {'{{name}}'} will be replaced for each candidate.</p>
                    </div>

                    {isSending && (
                      <div className="text-blue-600 text-sm flex items-center">
                         <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                         </svg>
                         Sending emails...
                      </div>
                    )}
                    {sendError && (
                      <div className="text-red-600 text-sm">Error: {sendError}</div>
                    )}
                    {sendSuccess && (
                      <div className="text-green-600 text-sm">Emails sent successfully!</div>
                    )}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={handleSend}
              disabled={isSending} // Disable button while sending
              className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm
                ${isSending ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'}`}
            >
              {isSending ? 'Sending...' : 'Send Email'}
            </button>
            <button type="button" onClick={onClose} disabled={isSending} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};