// Simulating in-memory storage (in a real app, this would be a server)
const fileStorage = new Map<string, FileTransfer>();

export const storeFile = (file: File, code: string): void => {
  fileStorage.set(code, {
    file,
    code,
    name: file.name,
    timestamp: Date.now()
  });
};

export const retrieveFile = (code: string): FileTransfer | undefined => {
  return fileStorage.get(code);
};