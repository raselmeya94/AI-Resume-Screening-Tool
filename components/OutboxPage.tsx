import React, { useState, useMemo } from 'react';
import type { SentEmail } from '../types';
import { EnvelopeIcon, XMarkIcon } from './icons/Icons';

interface OutboxPageProps {
  sentEmails: SentEmail[];
}

const EmailDetailModal: React.FC<{ email: SentEmail, onClose: () => void }> = ({ email, onClose }) => (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>
        <div className="inline-block bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-2xl sm:w-full z-10">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">{email.subject}</h3>
                <p className="text-sm text-gray-500 mt-1">To: {email.candidate.name} &lt;{email.candidate.email}&gt;</p>
                <p className="text-sm text-gray-500">Sent: {email.sentAt.toLocaleString()}</p>
              </div>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 -mt-2 -mr-2">
                <XMarkIcon className="h-6 w-6 text-gray-400"/>
              </button>
            </div>
          </div>
          <div className="px-6 py-5 bg-gray-50 max-h-[60vh] overflow-y-auto">
            <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans">{email.body}</pre>
          </div>
        </div>
      </div>
    </div>
);

export const OutboxPage: React.FC<OutboxPageProps> = ({ sentEmails }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingEmail, setViewingEmail] = useState<SentEmail | null>(null);
  
  const filteredEmails = useMemo(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    if (!lowercasedFilter) return sentEmails;
    
    return sentEmails.filter(email => 
      email.candidate.name.toLowerCase().includes(lowercasedFilter) ||
      email.candidate.email.toLowerCase().includes(lowercasedFilter) ||
      email.subject.toLowerCase().includes(lowercasedFilter)
    );
  }, [sentEmails, searchTerm]);

  return (
    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Outbox</h2>
        <input
          type="text"
          placeholder="Search by name, email, or subject..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-72 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-full inline-block align-middle">
          {filteredEmails.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {filteredEmails.map(email => (
                <li key={email.id}>
                  <button onClick={() => setViewingEmail(email)} className="w-full text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out">
                    <div className="flex items-center px-4 py-4 sm:px-6">
                      <div className="min-w-0 flex-1 flex items-center">
                        <div className="flex-shrink-0">
                          <EnvelopeIcon className="h-6 w-6 text-gray-400" />
                        </div>
                        <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-3 md:gap-4">
                          <div>
                            <p className="text-sm font-medium text-blue-600 truncate">{email.candidate.name}</p>
                            <p className="mt-1 flex items-center text-sm text-gray-500">{email.candidate.email}</p>
                          </div>
                          <div className="hidden md:block col-span-2">
                            <p className="text-sm text-gray-900 truncate">{email.subject}</p>
                            <p className="mt-1 text-sm text-gray-500 truncate">{email.body.split('\n')[0]}</p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">{email.sentAt.toLocaleDateString()}</p>
                        <p className="text-xs text-gray-400">{email.sentAt.toLocaleTimeString()}</p>
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-16">
              <EnvelopeIcon className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-2 text-lg font-medium text-gray-800">No Sent Emails</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? "No emails match your search." : "When you send emails to candidates, they will appear here."}
              </p>
            </div>
          )}
        </div>
      </div>
      {viewingEmail && <EmailDetailModal email={viewingEmail} onClose={() => setViewingEmail(null)} />}
    </div>
  );
};
