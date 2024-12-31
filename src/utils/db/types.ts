import { DBSchema } from 'idb';
import { FileTransfer } from '../../types/file';

export interface FileDB extends DBSchema {
  files: {
    key: string;
    value: FileTransfer;
  };
  transfers: {
    key: string;
    value: FileTransfer;
  };
}