
// import React from 'react';
// import type { ExtractedInfo } from '../types';
// import { PlayIcon, SaveIcon, TrashIcon, ArrowPathIcon, CheckIcon } from './icons/Icons';
// import { UserPlusIcon } from './icons/UserPlusIcon';
// import { Spinner } from './Spinner';
// import { UploadedFile } from './FileListPanel';

// interface ExtractionPanelProps {
//   rawText: string;
//   fileName: string;
//   extractedInfo: ExtractedInfo | null;
//   isLoading: boolean;
//   status: UploadedFile['status'];
//   error: string | null;
//   onRunExtraction: () => void;
//   onSaveCandidate: () => void;
//   isActionable: boolean;
// }

// const InfoField: React.FC<{ label: string; value: string | string[] | number }> = ({ label, value }) => (
//   <div className="mb-3">
//     <label className="block text-sm font-medium text-gray-500">{label}</label>
//     {Array.isArray(value) ? (
//       <div className="flex flex-wrap gap-2 mt-1">
//         {value.map((item, index) => (
//           <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
//             {item}
//           </span>
//         ))}
//       </div>
//     ) : (
//       <p className="mt-1 text-sm text-gray-900">{value}</p>
//     )}
//   </div>
// );

// export const ExtractionPanel: React.FC<ExtractionPanelProps> = ({
//   rawText,
//   fileName,
//   extractedInfo,
//   isLoading,
//   status,
//   error,
//   onRunExtraction,
//   onSaveCandidate,
//   isActionable,
// }) => {
//   return (
//     <div className="bg-white p-6 rounded-lg shadow-md">
//       <div className="flex justify-between items-center mb-4 pb-4 border-b">
//         <div>
//           <h3 className="text-lg font-semibold text-gray-800">Extraction Preview</h3>
//           {fileName && <p className="text-sm text-gray-500">{fileName}</p>}
//         </div>
//         <div className="flex items-center space-x-2">
//            {status === 'success' && (
//              <button 
//                 onClick={onSaveCandidate}
//                 className="flex items-center bg-green-600 text-white px-4 py-2 rounded-md font-semibold text-sm hover:bg-green-700 transition-colors"
//               >
//                 <UserPlusIcon className="h-5 w-5 mr-2"/>
//                 Add to Dashboard
//              </button>
//            )}
//            {status === 'added' && (
//              <span className="flex items-center text-green-700 font-semibold text-sm px-4 py-2 bg-green-100 rounded-md">
//                 <CheckIcon className="h-5 w-5 mr-2" />
//                 Added to Dashboard
//              </span>
//            )}
            
//           <button
//             onClick={onRunExtraction}
//             disabled={isLoading || !isActionable || status === 'added'}
//             className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md font-semibold text-sm hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
//           >
//             {isLoading ? <Spinner /> : <PlayIcon className="h-5 w-5 mr-2" />}
//             Run Extraction
//           </button>
//         </div>
//       </div>
      
//       {!isActionable ? (
//         <div className="flex items-center justify-center h-96 text-center text-gray-500">
//             <div>
//                 <p>Upload resumes to get started.</p>
//                 <p className="text-sm">Select a file from the list to see its details here.</p>
//             </div>
//         </div>
//       ) : (
//         <>
//             {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                 <h4 className="font-semibold text-gray-700 mb-2">Raw Text</h4>
//                 <textarea
//                     readOnly
//                     value={rawText || 'No content available.'}
//                     className="w-full h-96 p-3 border border-gray-200 rounded-md bg-gray-50 text-sm text-gray-600 focus:ring-blue-500 focus:border-blue-500"
//                 />
//                 </div>
//                 <div>
//                 <h4 className="font-semibold text-gray-700 mb-2">Extracted Information</h4>
//                 <div className="w-full h-96 p-3 border border-gray-200 rounded-md bg-gray-50 overflow-y-auto">
//                     {isLoading && (
//                     <div className="flex items-center justify-center h-full">
//                         <div className="text-center">
//                             <Spinner size="lg" />
//                             <p className="mt-2 text-sm text-gray-500">Extracting info...</p>
//                         </div>
//                     </div>
//                     )}
//                     {extractedInfo && !isLoading && (
//                     <div>
//                         <InfoField label="Name" value={extractedInfo.candidate_name} />
//                         <InfoField label="Email" value={extractedInfo.email_address} />
//                         <InfoField label="Contact" value={extractedInfo.contact_number} />
//                         <InfoField label="Years of Experience" value={extractedInfo.years_of_experience} />
//                         <InfoField label="Experience Summary" value={extractedInfo.experience_summary} />
//                         <InfoField label="Education Summary" value={extractedInfo.education_summary} />
//                         <InfoField label="Skills" value={extractedInfo.skills} />
//                     </div>
//                     )}
//                     {!extractedInfo && !isLoading && (
//                         <div className="flex items-center justify-center h-full">
//                             <p className="text-sm text-gray-500">Extracted data will appear here.</p>
//                         </div>
//                     )}
//                 </div>
//                 </div>
//             </div>
//         </>
//       )}
//     </div>
//   );
// };


import React from 'react';
import type { ExtractedInfo } from '../types';
import { PlayIcon, SaveIcon, TrashIcon, ArrowPathIcon, CheckIcon } from './icons/Icons';
import { UserPlusIcon } from './icons/UserPlusIcon';
import { Spinner } from './Spinner';
import { UploadedFile } from './FileListPanel';

interface ExtractionPanelProps {
  rawText: string;
  fileName: string;
  extractedInfo: ExtractedInfo | null;
  isLoading: boolean;
  status: UploadedFile['status'];
  error: string | null;
  onRunExtraction: () => void;
  onSaveCandidate: () => void;
  isActionable: boolean;
}

const InfoField: React.FC<{ label: string; value: string | string[] | number }> = ({ label, value }) => (
  <div className="mb-3">
    <label className="block text-sm font-medium text-gray-500">{label}</label>
    {Array.isArray(value) ? (
      <div className="flex flex-wrap gap-2 mt-1">
        {value.map((item, index) => (
          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
            {item}
          </span>
        ))}
      </div>
    ) : (
      <p className="mt-1 text-sm text-gray-900">{value}</p>
    )}
  </div>
);

export const ExtractionPanel: React.FC<ExtractionPanelProps> = ({
  rawText,
  fileName,
  extractedInfo,
  isLoading,
  status,
  error,
  onRunExtraction,
  onSaveCandidate,
  isActionable,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4 pb-4 border-b">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Extraction Preview</h3>
          {fileName && <p className="text-sm text-gray-500">{fileName}</p>}
        </div>
        <div className="flex items-center space-x-2">
          {status === 'success' && (
            <button 
              onClick={onSaveCandidate}
              className="flex items-center bg-green-600 text-white px-4 py-2 rounded-md font-semibold text-sm hover:bg-green-700 transition-colors"
            >
              <UserPlusIcon className="h-5 w-5 mr-2"/>
              Add to Dashboard
            </button>
          )}
          {status === 'added' && (
            <span className="flex items-center text-green-700 font-semibold text-sm px-4 py-2 bg-green-100 rounded-md">
              <CheckIcon className="h-5 w-5 mr-2" />
              Added to Dashboard
            </span>
          )}

          <button
            onClick={onRunExtraction}
            disabled={isLoading || !isActionable || status === 'added'}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md font-semibold text-sm hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? <Spinner /> : <PlayIcon className="h-5 w-5 mr-2" />}
            Run Extraction
          </button>
        </div>
      </div>

      {!isActionable ? (
        <div className="flex items-center justify-center h-96 text-center text-gray-500">
          <div>
            <p>Upload resumes to get started.</p>
            <p className="text-sm">Select a file from the list to see its details here.</p>
          </div>
        </div>
      ) : (
        <>
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Raw Text</h4>
              <textarea
                readOnly
                value={rawText || 'No content available.'}
                className="w-full h-96 p-3 border border-gray-200 rounded-md bg-gray-50 text-sm text-gray-600 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Extracted Information</h4>
              <div className="w-full h-96 p-3 border border-gray-200 rounded-md bg-gray-50 overflow-y-auto">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="flex flex-col items-center justify-center">
                      <Spinner size="lg" />
                      <p className="mt-2 text-sm text-gray-500">Extracting info...</p>
                    </div>
                  </div>
                ) : (
                  extractedInfo ? (
                    <div>
                      <InfoField label="Name" value={extractedInfo.candidate_name} />
                      <InfoField label="Email" value={extractedInfo.email_address} />
                      <InfoField label="Contact" value={extractedInfo.contact_number} />
                      <InfoField label="Years of Experience" value={extractedInfo.years_of_experience} />
                      <InfoField label="Experience Summary" value={extractedInfo.experience_summary} />
                      <InfoField label="Education Summary" value={extractedInfo.education_summary} />
                      <InfoField label="Skills" value={extractedInfo.skills} />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-sm text-gray-500">Extracted data will appear here.</p>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
