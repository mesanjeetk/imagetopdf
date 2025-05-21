"use client";
import React from "react";
import {
  X,
  RotateCw,
  ArrowUp,
  ArrowDown,
  Trash2,
  RotateCcw,
} from "lucide-react";
import { usePDFContext } from "./PDFContext";

const ImagePreview = () => {
  const {
    images,
    removeImage,
    rotateImage,
    moveImageUp,
    moveImageDown,
    clearAllImages,
  } = usePDFContext();

  if (images.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Image Preview</h2>
        <button
          onClick={clearAllImages}
          className="text-red-500 hover:text-red-700 transition-colors flex items-center text-sm"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div
            key={image.id}
            className="border border-gray-200 rounded-lg p-2 relative group"
          >
            <div className="aspect-w-3 aspect-h-2 mb-2 overflow-hidden flex items-center justify-center">
              <img
                src={image.preview}
                alt={`Preview ${index + 1}`}
                style={{ transform: `rotate(${image.rotation}deg)` }}
                className="max-w-full max-h-full object-contain rounded transition-transform duration-300 ease-in-out"
              />
            </div>

            <div className="flex justify-between items-center">
              <p className="text-sm truncate w-32" title={image.file?.name}>
                {image.file?.name}
              </p>
              <div className="flex space-x-1">
                <button
                  onClick={() => rotateImage(image.id, -90)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                  title="Rotate counterclockwise"
                >
                  <RotateCcw className="h-4 w-4 text-gray-600" />
                </button>
                <button
                  onClick={() => rotateImage(image.id, 90)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                  title="Rotate clockwise"
                >
                  <RotateCw className="h-4 w-4 text-gray-600" />
                </button>
                <button
                  onClick={() => moveImageUp(index)}
                  disabled={index === 0}
                  className={`p-1 rounded transition-colors ${index === 0
                      ? "text-gray-300 cursor-not-allowed"
                      : "hover:bg-gray-100 text-gray-600"
                    }`}
                  title="Move up"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button
                  onClick={() => moveImageDown(index)}
                  disabled={index === images.length - 1}
                  className={`p-1 rounded transition-colors ${index === images.length - 1
                      ? "text-gray-300 cursor-not-allowed"
                      : "hover:bg-gray-100 text-gray-600"
                    }`}
                  title="Move down"
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
                <button
                  onClick={() => removeImage(image.id)}
                  className="p-1 hover:bg-red-100 rounded transition-colors"
                  title="Remove image"
                >
                  <X className="h-4 w-4 text-red-500" />
                </button>
              </div>
            </div>

            <div className="absolute top-2 right-2 bg-gray-900 text-white text-xs px-2 py-0.5 rounded-full opacity-75">
              {index + 1}
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-1 text-center italic mt-2">
        Full image will be preserved in final PDF
      </p>

    </div>
  );
};

export default ImagePreview;

