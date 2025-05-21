import React from 'react';
import { FileText } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-5 flex items-center justify-between max-w-6xl">
        <div className="flex items-center gap-2">
          <FileText className="h-8 w-8 text-blue-700" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
            ImageToPDF
          </h1>
        </div>
        <nav>
          <ul className="flex gap-6">
            <li>
              <a 
                href="#" 
                className="text-gray-600 hover:text-blue-700 transition-colors"
              >
                Home
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className="text-gray-600 hover:text-blue-700 transition-colors"
              >
                Features
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className="text-gray-600 hover:text-blue-700 transition-colors"
              >
                About
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;