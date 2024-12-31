import React, { useState, useEffect } from 'react';
import { FileTransfer } from '../types/file';
import { Eye, Download } from 'lucide-react';
import { getFilePreview } from '../utils/filePreview';

interface FileDisplayProps {
  fileData: FileTransfer;
  onClose: () => void;
}

const FileDisplay: React.FC<FileDisplayProps> = ({ fileData, onClose }) => {
  const [preview, setPreview] = useState<{ type: string; content: string | null }>({
    type: '',
    content: null
  });

  useEffect(() => {
    handleViewFile();
  }, [fileData]);

  const handleViewFile = async () => {
    try {
      const { type, content } = await getFilePreview(fileData.file);
      setPreview({ type, content });
    } catch (error) {
      console.error('Error reading file:', error);
    }
  };

  const renderPreview = () => {
    if (!preview.content) return null;

    switch (preview.type) {
      case 'text':
        return (
          <pre className="p-4 bg-gray-100 rounded-lg overflow-auto max-h-[60vh] text-sm">
            {preview.content}
          </pre>
        );
      case 'image':
        return (
          <img 
            src={preview.content} 
            alt={fileData.name}
            className="max-w-full max-h-[60vh] object-contain rounded-lg"
          />
        );
      case 'pdf':
        return (
          <iframe
            src={preview.content}
            className="w-full h-[60vh] rounded-lg"
            title={fileData.name}
          />
        );
      default:
        return (
          <div className="text-center p-4 bg-gray-100 rounded-lg">
            <p>Preview not available for this file type</p>
            <button
              onClick={() => window.open(preview.content!, '_blank')}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Open in New Tab
            </button>
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium mb-2">File Details</h3>
        <p className="text-sm text-gray-600">Name: {fileData.name}</p>
        <p className="text-sm text-gray-600">Size: {(fileData.file.size / 1024).toFixed(2)} KB</p>
        <p className="text-sm text-gray-600">Type: {fileData.file.type || 'Unknown'}</p>
      </div>

      <div className="mt-4">
        <h4 className="font-medium mb-2">File Preview:</h4>
        {renderPreview()}
      </div>

      <button
        onClick={onClose}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Close
      </button>
    </div>
  );
}