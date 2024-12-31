export const getFilePreview = async (file: File): Promise<{ type: string; content: string }> => {
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    // Handle text files
    if (file.type.startsWith('text/') || 
        file.type === 'application/json' ||
        file.type === 'application/javascript') {
      reader.onload = () => resolve({
        type: 'text',
        content: reader.result as string
      });
      reader.readAsText(file);
    }
    // Handle images
    else if (file.type.startsWith('image/')) {
      reader.onload = () => resolve({
        type: 'image',
        content: reader.result as string
      });
      reader.readAsDataURL(file);
    }
    // Handle PDFs
    else if (file.type === 'application/pdf') {
      reader.onload = () => resolve({
        type: 'pdf',
        content: reader.result as string
      });
      reader.readAsDataURL(file);
    }
    // Handle other file types
    else {
      reader.onload = () => resolve({
        type: 'other',
        content: reader.result as string
      });
      reader.readAsDataURL(file);
    }

    reader.onerror = () => reject(new Error('Failed to read file'));
  });
};