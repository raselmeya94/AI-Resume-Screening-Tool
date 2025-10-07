import React, { useState } from 'react';
import { OutboxPage } from './OutboxPage';
import { EmailModal } from './EmailModal';
import type { SentEmail, Candidate } from '../types';

const ParentComponent: React.FC = () => {
  // State for managing the list of sent emails
  const [sentEmails, setSentEmails] = useState<SentEmail[]>([]);

  // State to manage modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  // This is to be handled dynamically and passed to EmailModal
  const [candidates, setCandidates] = useState<Candidate[]>([]); // Dynamically fetched or passed candidates
  const [jobTitle, setJobTitle] = useState<string>(''); // Dynamically fetched or passed job title

  // Function to handle adding a new sent email to the list
  const addSentEmail = (email: SentEmail) => {
    setSentEmails(prevEmails => [...prevEmails, email]);
  };

  // Function to open the email modal
  const openEmailModal = () => {
    setIsModalOpen(true);
  };

  // Function to close the email modal
  const closeEmailModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      {/* Button to trigger the Email Modal */}
      <button onClick={openEmailModal} className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
        Compose Email
      </button>

      {/* Email Modal */}
      <EmailModal 
        isOpen={isModalOpen} 
        onClose={closeEmailModal} 
        candidates={candidates} 
        jobTitle={jobTitle}
        // Pass addSentEmail as a prop to handle adding emails to the Outbox
        addSentEmail={addSentEmail}
      />

      {/* Outbox Page */}
      <OutboxPage 
        sentEmails={sentEmails}
      />
    </div>
  );
};

export default ParentComponent;
