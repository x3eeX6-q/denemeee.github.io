import { openDB, IDBPDatabase } from 'idb';
import { FileDB } from './types';
import { DB_NAME } from './config';

let db: IDBPDatabase<FileDB>;

export const initDB = async () => {
  if (!db) {
    db = await openDB<FileDB>(DB_NAME, 1, {
      upgrade(db) {
        db.createObjectStore('files');
        db.createObjectStore('transfers');
      },
    });
  }
  return db;
};