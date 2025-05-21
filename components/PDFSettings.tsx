"use client"
import React, { useState } from 'react';
import { DownloadCloud, Settings, HelpCircle, FileText } from 'lucide-react';
import { usePDFContext } from './PDFContext';

const qualityOptions = [
  { value: 'low', label: 'Low (72 DPI)', dpi: 72 },
  { value: 'medium', label: 'Medium (150 DPI)', dpi: 150 },
  { value: 'high', label: 'High (300 DPI)', dpi: 300 },
  { value: 'ultra', label: 'Ultra HD (600 DPI)', dpi: 600 },
  { value: 'custom', label: 'Custom DPI', dpi: 0 },
];

const pageSizes = [
  { value: 'a4', label: 'A4 (210 × 297 mm)' },
  { value: 'letter', label: 'US Letter (8.5 × 11 in)' },
  { value: 'legal', label: 'US Legal (8.5 × 14 in)' },
  { value: 'a3', label: 'A3 (297 × 420 mm)' },
  { value: 'a5', label: 'A5 (148 × 210 mm)' },
];

const PDFSettings = () => {
  const { 
    images, 
    quality, 
    setQuality, 
    customDPI, 
    setCustomDPI,
    pageSize,
    setPageSize,
    filename,
    setFilename,
    generatePDF,
    isGenerating
  } = usePDFContext();

  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 sticky top-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <Settings className="h-5 w-5 mr-2 text-blue-600" />
          PDF Settings
        </h2>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-400 hover:text-gray-600"
        >
          {isOpen ? 'Hide' : 'Show'}
        </button>
      </div>

      {isOpen && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Output Quality
            </label>
            <select
              value={quality}
              onChange={(e) => setQuality(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 p-2 border"
            >
              {qualityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {quality === 'custom' && (
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Custom DPI (10-1200)
                </label>
                <input
                  type="number"
                  min="10"
                  max="1200"
                  value={customDPI}
                  onChange={(e) => setCustomDPI(Math.min(1200, Math.max(10, parseInt(e.target.value) || 0)))}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 p-2 border"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Page Size
            </label>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 p-2 border"
            >
              {pageSizes.map((size) => (
                <option key={size.value} value={size.value}>
                  {size.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Output Filename
            </label>
            <div className="flex">
              <input
                type="text"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                className="w-full rounded-l-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 p-2 border"
                placeholder="document"
              />
              <span className="bg-gray-100 text-gray-700 px-3 py-2 rounded-r-md border border-l-0 border-gray-300 flex items-center">
                .pdf
              </span>
            </div>
          </div>

          <button
            onClick={generatePDF}
            disabled={images.length === 0 || isGenerating}
            className={`
              w-full py-3 rounded-md font-medium flex items-center justify-center
              ${images.length === 0 || isGenerating
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
              } transition-colors
            `}
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating PDF...
              </>
            ) : (
              <>
                <DownloadCloud className="h-5 w-5 mr-2" />
                Generate PDF
              </>
            )}
          </button>

          <div className="text-xs text-gray-500 flex items-start mt-4">
            <HelpCircle className="h-4 w-4 mr-1 flex-shrink-0 mt-0.5" />
            <p>
              Higher quality PDFs will have better resolution but larger file sizes. Choose the appropriate quality based on your needs.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFSettings;