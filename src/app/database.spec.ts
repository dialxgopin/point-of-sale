import { Database } from './database';

describe('Database', () => {
  let database: Database;
  const dbName = 'testDB';
  const storeName = 'testStore';

  beforeEach(() => {
    database = new Database();
    database.setDatabaseAndStore(dbName, storeName);
  });

  afterEach((done) => {
    const request = window.indexedDB.deleteDatabase(dbName);

    request.onsuccess = () => {
      done();
    };

    request.onerror = (event) => {
      console.error('Error deleting database:', (event.target as any).error);
      done();
    };
  });

  it('should save and query data by date', (done) => {
    const startDate = new Date('2023-01-01');
    const endDate = new Date('2023-12-31');

    const testData = [
      { id: 1, date: new Date('2023-05-01') },
      { id: 2, date: new Date('2023-07-15') },
      { id: 3, date: new Date('2023-10-30') },
    ];

    database.openDB().then(() => {
      database.saveData(testData).then(() => {
        database.queryByDate(startDate, endDate).then((results) => {
          expect(results.length).toBe(3);
          done();
        }).catch((error) => {
          fail('Failed to query data by date: ' + error);
          done();
        });
      });
    });
  });
});