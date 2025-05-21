"use client"
import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { ImageFile } from '@/types/types';

interface PDFContextProps {
  images: ImageFile[];
  addImages: (files: File[]) => void;
  removeImage: (id: string) => void;
  rotateImage: (id: string, angle: number) => void;
  moveImageUp: (index: number) => void;
  moveImageDown: (index: number) => void;
  clearAllImages: () => void;
  quality: string;
  setQuality: (quality: string) => void;
  customDPI: number;
  setCustomDPI: (dpi: number) => void;
  pageSize: string;
  setPageSize: (size: string) => void;
  filename: string;
  setFilename: (name: string) => void;
  generatePDF: () => void;
  isGenerating: boolean;
}

const PDFContext = createContext<PDFContextProps | null>(null);

export const usePDFContext = () => {
  const context = useContext(PDFContext);
  if (!context) {
    throw new Error('usePDFContext must be used within a PDFProvider');
  }
  return context;
};

export const PDFProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [quality, setQuality] = useState('medium');
  const [customDPI, setCustomDPI] = useState(300);
  const [pageSize, setPageSize] = useState('a4');
  const [filename, setFilename] = useState('document');
  const [isGenerating, setIsGenerating] = useState(false);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      images.forEach(image => {
        URL.revokeObjectURL(image.preview);
      });
    };
  }, []);

  const addImages = useCallback((files: File[]) => {
    const newImages = files.map(file => {
      const preview = URL.createObjectURL(file);
      return {
        id: crypto.randomUUID(),
        file,
        preview,
        rotation: 0
      };
    });

    setImages(prev => [...prev, ...newImages]);
  }, []);

  const removeImage = useCallback((id: string) => {
    setImages(prev => {
      const imageToRemove = prev.find(img => img.id === id);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview);
      }
      return prev.filter(image => image.id !== id);
    });
  }, []);

  const rotateImage = useCallback((id: string, angle: number) => {
    setImages(prev =>
      prev.map(image =>
        image.id === id
          ? { ...image, rotation: (image.rotation + angle) % 360 }
          : image
      )
    );
  }, []);

  const moveImageUp = useCallback((index: number) => {
    if (index <= 0) return;

    setImages(prev => {
      const newImages = [...prev];
      [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
      return newImages;
    });
  }, []);

  const moveImageDown = useCallback((index: number) => {
    setImages(prev => {
      if (index >= prev.length - 1) return prev;

      const newImages = [...prev];
      [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
      return newImages;
    });
  }, []);

  const clearAllImages = useCallback(() => {
    images.forEach(image => {
      URL.revokeObjectURL(image.preview);
    });
    setImages([]);
  }, [images]);

  const getQualityDPI = useCallback(() => {
    if (quality === 'custom') return customDPI;

    const qualityMap: Record<string, number> = {
      low: 72,
      medium: 150,
      high: 300,
      ultra: 600
    };

    return qualityMap[quality] || 150;
  }, [quality, customDPI]);

  const getPageDimensions = useCallback(() => {
    const dimensions: Record<string, { width: number, height: number }> = {
      a4: { width: 210, height: 297 },
      letter: { width: 215.9, height: 279.4 },
      legal: { width: 215.9, height: 355.6 },
      a3: { width: 297, height: 420 },
      a5: { width: 148, height: 210 }
    };

    return dimensions[pageSize] || dimensions.a4;
  }, [pageSize]);

  const generatePDF = useCallback(async () => {
    if (images.length === 0 || isGenerating) return;

    setIsGenerating(true);

    try {
      const dpi = getQualityDPI();
      const { width, height } = getPageDimensions();
      const orientation = width > height ? 'landscape' : 'portrait';

      const doc = new jsPDF({
        orientation,
        unit: 'mm',
        format: pageSize === 'letter' || pageSize === 'legal' ? pageSize : [width, height]
      });

      // Wait for all image processing to complete
      for (let i = 0; i < images.length; i++) {
        const image = images[i];

        // Add a new page for all images except the first one
        if (i > 0) {
          doc.addPage();
        }

        const img = new Image();
        img.src = image.preview;

        await new Promise<void>((resolve) => {
          img.onload = async () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (!ctx) {
              resolve();
              return;
            }

            // Calculate dimensions based on image rotation
            const isRotated90or270 = image.rotation % 180 !== 0;
            const imgWidth = isRotated90or270 ? img.height : img.width;
            const imgHeight = isRotated90or270 ? img.width : img.height;

            // Set canvas dimensions
            canvas.width = imgWidth;
            canvas.height = imgHeight;

            // Draw rotated image on canvas
            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate((image.rotation * Math.PI) / 180);
            ctx.drawImage(img, -img.width / 2, -img.height / 2);
            ctx.restore();

            // Get image data and add to PDF
            const imageData = canvas.toDataURL('image/jpeg', 0.95);

            // Calculate dimensions to fit the page while maintaining aspect ratio
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();

            let finalWidth = pageWidth;
            let finalHeight = (imgHeight / imgWidth) * finalWidth;

            if (finalHeight > pageHeight) {
              finalHeight = pageHeight;
              finalWidth = (imgWidth / imgHeight) * finalHeight;
            }

            const xOffset = (pageWidth - finalWidth) / 2;
            const yOffset = (pageHeight - finalHeight) / 2;

            doc.addImage(imageData, 'JPEG', xOffset, yOffset, finalWidth, finalHeight);
            resolve();
          };

          img.onerror = () => {
            console.error('Error loading image:', image.file.name);
            resolve();
          };
        });
      }

      // Save the PDF
      const outputFilename = `${filename || 'document'}.pdf`;
      doc.save(outputFilename);
      images.forEach(image => {
        URL.revokeObjectURL(image.preview);
      });
      setImages([]);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [images, filename, pageSize, quality, customDPI, getQualityDPI, getPageDimensions, isGenerating]);

  return (
    <PDFContext.Provider
      value={{
        images,
        addImages,
        removeImage,
        rotateImage,
        moveImageUp,
        moveImageDown,
        clearAllImages,
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
      }}
    >
      {children}
    </PDFContext.Provider>
  );
};