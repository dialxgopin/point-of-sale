import { Database } from './database';

describe('Database', () => {
  let database: Database;

  beforeEach(() => {
    database = new Database();
  });

  it('should be created', () => {
    expect(database).toBeTruthy();
  });

  it('should set database and store names', () => {
    database.setDatabaseAndStore('testDB', 'testStore');
    expect(database['dbName']).toEqual('testDB');
    expect(database['storeName']).toEqual('testStore');
  });

  it('should open and resolve the database', (done: DoneFn) => {
    database.setDatabaseAndStore('testDB', 'testStore');
    database.openDB().then(db => {
      expect(db).toBeTruthy();
      done();
    });
  });

  it('should resolve promise to save data to indexedDB', (done: DoneFn) => {
    database.setDatabaseAndStore('testDB', 'testStore');
    const testData = [{ id: '1', name: 'Item 1' }];
    database.saveData(testData)
      .then(() => {
        // You can add a test here to check if the data is in the database when the method to query is created
        expect(true).toBeTruthy();
        done();
      })
      .catch(() => {
        fail('Failed to save data');
        done();
      });
  });

  it('should create object store', () => {
    const dbName = 'testDB';
    const storeName = 'testStore';
    const mockEvent: any = {
      target: {
        result: {
          createObjectStore: jasmine.createSpy()
        }
      }
    };

    database.setDatabaseAndStore(dbName, storeName);
    database['createStore'](mockEvent);

    expect(mockEvent.target.result.createObjectStore).toHaveBeenCalledWith(storeName, { keyPath: 'id' });
  });
});
