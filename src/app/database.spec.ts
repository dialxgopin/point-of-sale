import { Database } from './database';

describe('Database', () => {
  let database: Database;
  const dbName = 'testDB';
  const storeName = 'testStore';

  beforeAll((done) => {
    database = new Database();
    database.setDatabaseAndStore(dbName, storeName);
    const testData = { id: '1', identifier: 'testIdentifier', name: 'Test' };
    database.saveData([testData]).then(() => {
      done();
    });
  });

  afterAll((done) => {
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

  it('should count rows in the store', async () => {
    const count = await database.countRows();
    expect(count).toBeGreaterThan(0);
  });

  it('should query data by identifier', async () => {
    const identifier = 'testIdentifier';
    const results = await database.queryByIdentifier(identifier);
    expect(results.length).toBeGreaterThan(0);
  });

  it('should query data by name', async () => {
    const name = 'Test';
    const results = await database.queryByName(name);
    expect(results.length).toBeGreaterThan(0);
  });
});