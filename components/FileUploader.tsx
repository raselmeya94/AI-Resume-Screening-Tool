import React, { useState, useCallback } from 'react';
import { UploadIcon } from './icons/Icons';

declare const pdfjsLib: any;
declare const mammoth: any;

interface FileUploaderProps {
  onFilesRead: (files: { name: string; content: string }[]) => void;
}

const readFileContent = (file: File): Promise<{ name: string, content: string }> => {
  return new Promise((resolve, reject) => {
    const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
    const reader = new FileReader();

    if (fileExtension === '.txt') {
      reader.onload = (e) => {
        const content = e.target?.result as string;
        resolve({ name: file.name, content });
      };
      reader.onerror = () => reject(new Error(`Error reading file: ${file.name}`));
      reader.readAsText(file);
    } else if (fileExtension === '.pdf') {
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
          let fullText = '';
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map((item: any) => item.str).join(' ');
            fullText += pageText + '\n\n';
          }
          resolve({ name: file.name, content: fullText });
        } catch (error) {
          console.error('Error parsing PDF:', error);
          reject(new Error(`Failed to parse PDF file: ${file.name}`));
        }
      };
      reader.onerror = () => reject(new Error(`Error reading PDF file: ${file.name}`));
      reader.readAsArrayBuffer(file);
    } else if (fileExtension === '.docx') {
        reader.onload = async (e) => {
            try {
                const arrayBuffer = e.target?.result as ArrayBuffer;
                const result = await mammoth.extractRawText({ arrayBuffer });
                resolve({ name: file.name, content: result.value });
            } catch (error) {
                console.error('Error parsing DOCX:', error);
                reject(new Error(`Failed to parse DOCX file: ${file.name}`));
            }
        };
        reader.onerror = () => reject(new Error(`Error reading DOCX file: ${file.name}`));
        reader.readAsArrayBuffer(file);
    } else if (fileExtension === '.doc') {
        reject(new Error(`Unsupported file type: ${file.name}. Please convert .doc files to .docx or .pdf.`));
    } else {
      reject(new Error(`Unsupported file type: ${file.name}`));
    }
  });
};

export const FileUploader: React.FC<FileUploaderProps> = ({ onFilesRead }) => {
  const [dragging, setDragging] = useState(false);

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const readPromises = fileArray.map(readFileContent);

    try {
      const results = await Promise.allSettled(readPromises);
      const successfulReads = results
        .filter(result => result.status === 'fulfilled')
        .map(result => (result as PromiseFulfilledResult<{ name: string; content: string }>).value);
      
      const failedReads = results.filter(result => result.status === 'rejected');
      if (failedReads.length > 0) {
        const errorMessages = failedReads.map(result => (result as PromiseRejectedResult).reason.message).join('\n');
        alert(`Could not read some files:\n${errorMessages}`);
      }

      if (successfulReads.length > 0) {
        onFilesRead(successfulReads);
      }

    } catch (error) {
      console.error(error);
      alert('An unexpected error occurred while reading files.');
    }
  }, [onFilesRead]);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    e.target.value = ''; 
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
        dragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
      }`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => document.getElementById('file-upload')?.click()}
    >
      <UploadIcon className="mx-auto h-10 w-10 text-gray-400" />
      <p className="mt-2 text-sm text-gray-600">
        <span className="font-semibold text-blue-600">Click to upload</span> or drag and drop
      </p>
      <p className="text-xs text-gray-500 mt-1">TXT, PDF, DOCX files supported</p>
      <input id="file-upload" type="file" className="hidden" multiple accept=".txt,.pdf,.docx" onChange={handleFileChange} />
    </div>
  );
};