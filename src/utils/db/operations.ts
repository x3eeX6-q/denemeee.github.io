import { FileTransfer } from '../../types/file';
import { initDB } from './core';
import { STORE_NAME, TRANSFER_STORE } from './config';

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