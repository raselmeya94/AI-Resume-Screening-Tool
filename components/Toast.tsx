
import React, { useEffect } from 'react';
import { CheckIcon, XMarkIcon } from './icons/Icons';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Auto-close after 5 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-600' : 'bg-red-600';
  const Icon = type === 'success' ? CheckIcon : XMarkIcon;

  return (
    <div 
        className={`fixed bottom-5 right-5 z-50 flex items-center p-4 rounded-lg shadow-2xl text-white ${bgColor} animate-fade-in-up`}
        role="alert"
    >
      <div className="flex-shrink-0">
        <Icon className="h-6 w-6" />
      </div>
      <div className="ml-3 text-sm font-medium">
        {message}
      </div>
      <button 
        onClick={onClose} 
        className="ml-4 -mr-2 p-1.5 rounded-md inline-flex items-center justify-center hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
        aria-label="Close"
      >
        <XMarkIcon className="h-5 w-5" />
      </button>
      <style>{`
        @keyframes fade-in-up {
            0% {
                opacity: 0;
                transform: translateY(20px);
            }
            100% {
                opacity: 1;
                transform: translateY(0);
            }
        }
        .animate-fade-in-up {
            animation: fade-in-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
