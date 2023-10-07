export class Database {
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
                this.createStore((event.target as any).result);
            };
        });
    }

    private createStore(db: IDBDatabase) {
        const store = db.createObjectStore(this.storeName, { keyPath: 'id' });
        store.createIndex('date', 'date', { unique: false });
        store.createIndex('identifier', 'identifier', { unique: false });
        store.createIndex('name', 'name', { unique: false });
        store.createIndex('saleNumber', 'saleNumber', { unique: false });
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

    queryByDate(startDate: Date, endDate: Date): Promise<any[]> {
        return this.openDB().then((db) => {
            return new Promise<any[]>((resolve, reject) => {
                const transaction = db.transaction(this.storeName, 'readonly');
                const store = transaction.objectStore(this.storeName);
                const index = store.index('date');

                const range = IDBKeyRange.bound(startDate, endDate, false, true);
                const request = index.openCursor(range);

                const results: any[] = [];

                request.onsuccess = (event) => {
                    const cursor = (event.target as IDBRequest).result as IDBCursorWithValue;
                    if (cursor) {
                        results.push(cursor.value);
                        cursor.continue();
                    } else {
                        resolve(results);
                    }
                };

                request.onerror = (event) => {
                    reject('Error querying data: ' + (event.target as any).error);
                };
            });
        });
    }

    countRows(): Promise<number> {
        return this.openDB().then((db) => {
            return new Promise<number>((resolve, reject) => {
                const transaction = db.transaction(this.storeName, 'readonly');
                const store = transaction.objectStore(this.storeName);
                const request = store.count();

                request.onsuccess = (event) => {
                    resolve((event.target as IDBRequest).result);
                };

                request.onerror = (event) => {
                    reject('Error counting rows: ' + (event.target as any).error);
                };
            });
        });
    }

    queryByIdentifier(identifier: string): Promise<any[]> {
        return this.openDB().then((db) => {
            return new Promise<any[]>((resolve, reject) => {
                const transaction = db.transaction(this.storeName, 'readonly');
                const store = transaction.objectStore(this.storeName);
                const index = store.index('identifier');

                const range = IDBKeyRange.only(identifier);
                const request = index.openCursor(range);

                const results: any[] = [];

                request.onsuccess = (event) => {
                    const cursor = (event.target as IDBRequest).result as IDBCursorWithValue;
                    if (cursor) {
                        results.push(cursor.value);
                        cursor.continue();
                    } else {
                        resolve(results);
                    }
                };

                request.onerror = (event) => {
                    reject('Error querying data: ' + (event.target as any).error);
                };
            });
        });
    }

    queryByName(name: string): Promise<any[]> {
        return this.openDB().then((db) => {
            return new Promise<any[]>((resolve, reject) => {
                const transaction = db.transaction(this.storeName, 'readonly');
                const store = transaction.objectStore(this.storeName);
                const index = store.index('name');

                const range = IDBKeyRange.only(name);
                const request = index.openCursor(range);

                const results: any[] = [];

                request.onsuccess = (event) => {
                    const cursor = (event.target as IDBRequest).result as IDBCursorWithValue;
                    if (cursor) {
                        results.push(cursor.value);
                        cursor.continue();
                    } else {
                        resolve(results);
                    }
                };

                request.onerror = (event) => {
                    reject('Error querying data: ' + (event.target as any).error);
                };
            });
        });
    }

    queryBySaleNumber(saleNumber: number): Promise<any[]> {
        return this.openDB().then((db) => {
            return new Promise<any[]>((resolve, reject) => {
                const transaction = db.transaction(this.storeName, 'readonly');
                const store = transaction.objectStore(this.storeName);
                const index = store.index('saleNumber');

                const range = IDBKeyRange.only(saleNumber);
                const request = index.openCursor(range);

                const results: any[] = [];

                request.onsuccess = (event) => {
                    const cursor = (event.target as IDBRequest).result as IDBCursorWithValue;
                    if (cursor) {
                        results.push(cursor.value);
                        cursor.continue();
                    } else {
                        resolve(results);
                    }
                };

                request.onerror = (event) => {
                    reject('Error querying data: ' + (event.target as any).error);
                };
            });
        });
    }
}