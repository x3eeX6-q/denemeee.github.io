import React, { useState } from 'react';
import { Upload, Search } from 'lucide-react';
import { FileData } from '../types/file';
import { storeFile } from '../utils/db';
import FindFile from './FindFile';

const FileUpload: React.FC = () => {
  const [mode, setMode] = useState<'initial' | 'upload' | 'find'>('initial');
  const [fileData, setFileData] = useState<FileData>({ file: null, code: '', name: '' });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileData({ file, code: '', name: file.name });
    }
  };

  const handleUpload = async () => {
    if (fileData.file && fileData.code) {
      setIsLoading(true);
      try {
        await storeFile(fileData.file, fileData.code);
        setMessage(`File uploaded successfully! Share this code: ${fileData.code}`);
        setTimeout(() => {
          setMode('initial');
          setFileData({ file: null, code: '', name: '' });
          setMessage('');
        }, 3000);
      } catch (error) {
        setMessage('Error uploading file. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
        {message && (
          <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg text-center">
            {message}
          </div>
        )}

        {isLoading && (
          <div className="mb-6 p-4 bg-blue-100 text-blue-700 rounded-lg text-center">
            Processing...
          </div>
        )}

        {mode === 'initial' && (
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-center mb-8">File Transfer</h1>
            <button
              onClick={() => setMode('upload')}
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
            >
              <Upload size={20} />
              Upload File
            </button>
            <button
              onClick={() => setMode('find')}
              className="w-full py-3 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center justify-center gap-2"
            >
              <Search size={20} />
              Find File
            </button>
          </div>
        )}

        {mode === 'upload' && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-center mb-6">Upload File</h2>
            <div className="space-y-4">
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full p-2 border rounded-lg"
                disabled={isLoading}
              />
              <input
                type="text"
                placeholder="Enter file code (e.g., 123456)"
                value={fileData.code}
                onChange={(e) => setFileData({ ...fileData, code: e.target.value })}
                className="w-full p-2 border rounded-lg"
                disabled={isLoading}
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setMode('initial')}
                  className="flex-1 py-2 px-4 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                  disabled={isLoading}
                >
                  Back
                </button>
                <button
                  onClick={handleUpload}
                  disabled={!fileData.file || !fileData.code || isLoading}
                  className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        )}

        {mode === 'find' && (
          <FindFile onClose={() => setMode('initial')} />
        )}
      </div>
    </div>
  );
};

export default FileUpload;