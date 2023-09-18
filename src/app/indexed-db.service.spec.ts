import { TestBed } from '@angular/core/testing';

import { IndexedDBService } from './indexed-db.service';

describe('IndexedDBService', () => {
  let service: IndexedDBService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IndexedDBService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set database and store names', () => {
    service.setDatabaseAndStore('testDB', 'testStore');
    expect(service['dbName']).toEqual('testDB');
    expect(service['storeName']).toEqual('testStore');
  });

  it('should open and resolve the database', (done: DoneFn) => {
    service.setDatabaseAndStore('testDB', 'testStore');
    service.openDB().then(db => {
      expect(db).toBeTruthy();
      done();
    });
  });

  it('should resolve promise to save data to indexedDB', (done: DoneFn) => {
    service.setDatabaseAndStore('testDB', 'testStore');
    service.saveData([{ id: '1', name: 'Item 1' }])
      .then(() => {
        expect(true).toBeTruthy(); // Should check the data is in the database when the method to query is created
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

    service.setDatabaseAndStore(dbName, storeName);
    service['createStore'](mockEvent);

    expect(mockEvent.target.result.createObjectStore).toHaveBeenCalledWith(storeName, { keyPath: 'id' });
  });
});
