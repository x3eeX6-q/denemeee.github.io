import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { FileTransfer } from '../types/file';

interface FileDB extends DBSchema {
  files: {
    key: string;
    value: FileTransfer;
  };
  transfers: {
    key: string;
    value: FileTransfer;
  };
}

const DB_NAME = 'FileTransferDB';
const STORE_NAME = 'files';
const TRANSFER_STORE = 'transfers';

let db: IDBPDatabase<FileDB>;

const initDB = async () => {
  if (!db) {
    db = await openDB<FileDB>(DB_NAME, 1, {
      upgrade(db) {
        db.createObjectStore(STORE_NAME);
        db.createObjectStore(TRANSFER_STORE);
      },
    });
  }
  return db;
};

export const storeFile = async (file: File, code: string): Promise<void> => {
  const db = await initDB();
  const fileData: FileTransfer = {
    file,
    code,
    name: file.name,
    timestamp: Date.now(),
  };
  await db.put(STORE_NAME, fileData, code);
};

export const retrieveFile = async (code: string): Promise<FileTransfer | undefined> => {
  const db = await initDB();
  return await db.get(STORE_NAME, code);
};

export const transferFile = async (code: string): Promise<boolean> => {
  const db = await initDB();
  const file = await db.get(STORE_NAME, code);
  
  if (!file) {
    return false;
  }

  // Move file to transfers store
  await db.put(TRANSFER_STORE, file, code);
  await db.delete(STORE_NAME, code);
  
  return true;
};