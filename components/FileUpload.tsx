"use client"
import React, { useCallback, useState } from 'react';
import { ArrowUpFromLine, X, ImagePlus } from 'lucide-react';
import { usePDFContext } from './PDFContext';

const FileUpload = () => {
  const { addImages } = usePDFContext();
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files) {
      const files = Array.from(e.dataTransfer.files);
      const imageFiles = files.filter(file => file.type.startsWith('image/'));
      
      if (imageFiles.length > 0) {
        addImages(imageFiles);
      }
    }
  }, [addImages]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      addImages(files);
      e.target.value = '';
    }
  }, [addImages]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Upload Images</h2>
      
      <div 
        className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center transition-colors duration-200 ${
          isDragging 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="bg-blue-100 p-4 rounded-full mb-4">
          <ArrowUpFromLine className="h-8 w-8 text-blue-600" />
        </div>
        <p className="text-center mb-2 font-medium text-gray-700">
          Drag and drop your images here
        </p>
        <p className="text-sm text-gray-500 mb-4 text-center">
          Supports: JPG, PNG, WEBP, GIF, BMP (Max 20MB per file)
        </p>
        
        <label className="relative">
          <span className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md cursor-pointer transition-colors duration-200 inline-block">
            Select Files
          </span>
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleFileChange}
            accept="image/*"
            multiple
          />
        </label>
      </div>
    </div>
  );
};

export default FileUpload;