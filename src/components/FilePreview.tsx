import React, { useState } from 'react';
import { FileTransfer } from '../types/file';
import { Folder, ArrowRight } from 'lucide-react';
import { transferFile } from '../utils/db';

interface FilePreviewProps {
  fileData: FileTransfer;
  onClose: () => void;
}

const FilePreview: React.FC<FilePreviewProps> = ({ fileData, onClose }) => {
  const [status, setStatus] = useState<'preview' | 'transferring' | 'done' | 'error'>('preview');

  const handleTransfer = async () => {
    try {
      setStatus('transferring');
      const success = await transferFile(fileData.code);
      
      if (success) {
        setStatus('done');
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <div className="space-y-6">
      {status === 'preview' && (
        <>
          <div className="text-center space-y-2">
            <div className="bg-green-100 text-green-700 p-4 rounded-lg">
              File found! Viewing file details
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
            <div className="flex items-center justify-center">
              <Folder className="w-16 h-16 text-yellow-400" />
            </div>
            
            <div className="space-y-2 text-center">
              <h3 className="font-medium text-lg">{fileData.name}</h3>
              <p className="text-sm text-gray-600">
                Size: {(fileData.file.size / 1024).toFixed(2)} KB
              </p>
              <p className="text-sm text-gray-600">
                Type: {fileData.file.type || 'Unknown'}
              </p>
            </div>

            <button
              onClick={handleTransfer}
              className="w-full py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
            >
              <ArrowRight size={20} />
              Transfer File
            </button>

            <button
              onClick={onClose}
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Close
            </button>
          </div>
        </>
      )}

      {status === 'transferring' && (
        <div className="text-center space-y-4">
          <div className="animate-pulse">
            <ArrowRight size={40} className="mx-auto text-green-600" />
          </div>
          <p className="text-lg">Transferring file...</p>
        </div>
      )}

      {status === 'done' && (
        <div className="text-center space-y-4">
          <div className="bg-green-100 text-green-700 p-4 rounded-lg">
            File transferred successfully!
          </div>
          <div className="text-sm text-gray-600">
            The file has been moved to your transfers.
          </div>
          <button
            onClick={onClose}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Close
          </button>
        </div>
      )}

      {status === 'error' && (
        <div className="text-center space-y-4">
          <div className="bg-red-100 text-red-700 p-4 rounded-lg">
            Transfer failed. Please try again.
          </div>
          <button
            onClick={() => setStatus('preview')}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default FilePreview;