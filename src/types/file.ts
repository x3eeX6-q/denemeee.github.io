export interface FileData {
  file: File | null;
  code: string;
  name: string;
}

export interface FileTransfer {
  file: File;
  code: string;
  name: string;
  timestamp: number;
}