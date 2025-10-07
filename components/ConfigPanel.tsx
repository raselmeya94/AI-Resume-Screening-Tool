import React, { useState } from 'react';

export const ConfigPanel: React.FC = () => {
  const [ocrMode, setOcrMode] = useState<'ai' | 'manual'>('ai');

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-full">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Text Extractor Configs</h3>
      <div className="space-y-4">
        <div>
          <label htmlFor="ocr-mode" className="block text-sm font-medium text-gray-700">
            Mode Selection
          </label>
          <select
            id="ocr-mode"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            value={ocrMode}
            onChange={(e) => setOcrMode(e.target.value as 'ai' | 'manual')}
          >
            <option value="ai">AI OCR</option>
            <option value="manual">Manual OCR (Human-assisted)</option>
          </select>
        </div>
        <div>
          <label htmlFor="ocr-model" className="block text-sm font-medium text-gray-700">
            AI OCR Model
          </label>
          <select
            id="ocr-model"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md disabled:bg-gray-100 disabled:opacity-70 disabled:cursor-not-allowed"
            defaultValue="gemini"
            disabled={ocrMode === 'manual'}
          >
            <option value="gemini">Gemini 2.5 Flash</option>
            <option value="mistral" disabled>Mistral OCR (coming soon)</option>
            <option value="openai" disabled>OpenAI OCR (coming soon)</option>
          </select>
        </div>
        <fieldset className="border-t border-gray-200 pt-4">
          <legend className="text-sm font-medium text-gray-700 mb-2">OCR Options</legend>
          <div className="space-y-2">
            <div className="relative flex items-start">
              <div className="flex items-center h-5">
                <input id="detect-tables" type="checkbox" className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded" defaultChecked />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="detect-tables" className="font-medium text-gray-700">Detect Tables</label>
              </div>
            </div>
            <div className="relative flex items-start">
              <div className="flex items-center h-5">
                <input id="extract-contact" type="checkbox" className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded" defaultChecked />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="extract-contact" className="font-medium text-gray-700">Extract Contact Blocks</label>
              </div>
            </div>
          </div>
        </fieldset>
      </div>
    </div>
  );
};