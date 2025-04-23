import React, { useState } from 'react';
import { Settings, HelpCircle, Download, Upload, Trash2 } from 'lucide-react';

interface SettingsViewProps {
  onResetLibrary: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ onResetLibrary }) => {
  const [exportUrl, setExportUrl] = useState<string | null>(null);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  
  // Export library data to JSON file
  const handleExport = () => {
    try {
      const libraryData = localStorage.getItem('library-books');
      
      if (!libraryData) {
        setExportUrl(null);
        return;
      }
      
      const blob = new Blob([libraryData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      setExportUrl(url);
      
      // Auto-click the download link
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = `library-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      // Cleanup URL after a delay
      setTimeout(() => {
        URL.revokeObjectURL(url);
        setExportUrl(null);
      }, 1000);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };
  
  // Handle file import
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        
        // Validate JSON structure
        const parsed = JSON.parse(content);
        
        if (!Array.isArray(parsed)) {
          setImportError("Invalid data format: The imported file must contain an array of books");
          return;
        }
        
        // Validate book structure (basic validation)
        const isValid = parsed.every(book => 
          typeof book === 'object' && 
          book !== null &&
          typeof book.id === 'string' && 
          typeof book.title === 'string' && 
          typeof book.author === 'string' &&
          typeof book.isCheckedOut === 'boolean'
        );
        
        if (!isValid) {
          setImportError("Invalid data format: The book data is missing required fields");
          return;
        }
        
        // Save to localStorage
        localStorage.setItem('library-books', content);
        
        // Refresh the page to load new data
        window.location.reload();
      } catch (error) {
        console.error('Import failed:', error);
        setImportError("Failed to parse the imported file. Please make sure it's a valid JSON file.");
      }
    };
    
    reader.readAsText(file);
  };
  
  // Reset library data
  const handleReset = () => {
    if (showConfirmReset) {
      localStorage.removeItem('library-books');
      onResetLibrary();
      setShowConfirmReset(false);
      
      // Refresh the page
      window.location.reload();
    } else {
      setShowConfirmReset(true);
    }
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 flex items-center">
        <Settings className="h-5 w-5 mr-2 text-indigo-600" />
        Library Settings
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Data Management */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Data Management</h3>
          
          <div className="space-y-4">
            {/* Export Data */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium text-gray-700">Export Library</h4>
                <button
                  className="text-gray-400 hover:text-gray-600"
                  title="Export your library data to a JSON file"
                >
                  <HelpCircle className="h-4 w-4" />
                </button>
              </div>
              <p className="text-sm text-gray-500 mb-3">
                Save a backup of your entire library collection
              </p>
              <button
                onClick={handleExport}
                className="flex items-center px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <Download className="h-4 w-4 mr-2" />
                Export to JSON
              </button>
            </div>
            
            {/* Import Data */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium text-gray-700">Import Library</h4>
                <button
                  className="text-gray-400 hover:text-gray-600"
                  title="Import library data from a JSON file"
                >
                  <HelpCircle className="h-4 w-4" />
                </button>
              </div>
              <p className="text-sm text-gray-500 mb-3">
                Restore your library from a backup file
              </p>
              <div>
                <label className="flex items-center px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-md transition-colors cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" />
                  <span>Import from JSON</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="sr-only"
                  />
                </label>
                {importError && (
                  <p className="mt-2 text-sm text-red-600">{importError}</p>
                )}
              </div>
            </div>
            
            {/* Reset Library */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium text-gray-700">Reset Library</h4>
                <button
                  className="text-gray-400 hover:text-gray-600"
                  title="Clear all library data and start fresh"
                >
                  <HelpCircle className="h-4 w-4" />
                </button>
              </div>
              <p className="text-sm text-gray-500 mb-3">
                Remove all books and start with a fresh library
              </p>
              {!showConfirmReset ? (
                <button
                  onClick={() => setShowConfirmReset(true)}
                  className="flex items-center px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Reset Library
                </button>
              ) : (
                <div className="bg-red-50 p-3 rounded-md">
                  <p className="text-sm text-red-700 mb-2 font-medium">
                    Are you sure? This will permanently delete all your library data!
                  </p>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleReset}
                      className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                    >
                      Yes, Reset Everything
                    </button>
                    <button
                      onClick={() => setShowConfirmReset(false)}
                      className="px-3 py-1 bg-gray-200 text-gray-800 text-sm rounded hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* About */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-700 mb-4">About Library Manager</h3>
          
          <div className="prose prose-sm text-gray-600">
            <p>
              <strong>Library Manager</strong> is a simple yet powerful tool to manage your personal or small institutional library collection.
            </p>
            
            <h4 className="text-gray-700 mt-4 mb-2">Features</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Catalog your entire book collection with detailed metadata</li>
              <li>Track borrowed books with due dates and borrower information</li>
              <li>Search and filter your collection by various criteria</li>
              <li>View statistics about your library</li>
              <li>Import and export your data for safekeeping</li>
            </ul>
            
            <h4 className="text-gray-700 mt-4 mb-2">Data Storage</h4>
            <p>
              All your data is stored locally in your browser using localStorage. 
              This means your data never leaves your computer, but it also means
              you should export backups regularly to prevent data loss.
            </p>
            
            <h4 className="text-gray-700 mt-4 mb-2">Version</h4>
            <p>1.0.0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;