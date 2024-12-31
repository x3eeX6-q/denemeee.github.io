import React, { useState } from 'react';
import { Eye } from 'lucide-react';
import { retrieveFile } from '../utils/db';
import FilePreview from './FilePreview';

const FindFile: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'initial' | 'found' | 'error'>('initial');
  const [fileDetails, setFileDetails] = useState<any>(null);

  const handleFind = async () => {
    if (!code.trim()) return;
    
    try {
      const file = await retrieveFile(code);
      if (file) {
        setFileDetails(file);
        setStatus('found');
      } else {
        setStatus('error');
        setTimeout(() => setStatus('initial'), 3000);
      }
    } catch (error) {
      setStatus('error');
      setTimeout(() => setStatus('initial'), 3000);
    }
  };

  if (status === 'found' && fileDetails) {
    return <FilePreview fileData={fileDetails} onClose={onClose} />;
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Find File</h2>
        <p className="text-gray-600">Enter the file code to access the shared file</p>
      </div>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Enter file code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />

        {status === 'error' && (
          <div className="p-3 bg-red-100 text-red-700 rounded-lg text-center">
            File not found. Please check the code.
          </div>
        )}

        <button
          onClick={handleFind}
          disabled={!code.trim()}
          className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Eye size={20} />
          Find File
        </button>

        <button
          onClick={onClose}
          className="w-full py-3 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default FindFile;