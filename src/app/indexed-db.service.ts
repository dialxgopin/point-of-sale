import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IndexedDBService {
  private dbName!: string;
  private storeName!: string;

  setDatabaseAndStore(dbName: string, storeName: string) {
    this.dbName = dbName;
    this.storeName = storeName;
  }

  openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open(this.dbName, 1);

      request.onerror = (event) => {
        reject('Error opening database: ' + (event.target as any).error);
      };

      request.onsuccess = (event) => {
        const db = (event.target as any).result;
        resolve(db);
      };

      request.onupgradeneeded = (event) => {
        this.createStore(event);
      };
    });
  }

  private createStore(event: any) {
    const db = event.target.result;
    db.createObjectStore(this.storeName, { keyPath: 'id' });
  }

  saveData(data: any[]): Promise<void> {
    return this.openDB().then(db => {
      const transaction = db.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);

      data.forEach(item => {
        store.put(item);
      });

      return new Promise((resolve) => {
        transaction.oncomplete = () => {
          resolve();
        };
      });
    });
  }
}