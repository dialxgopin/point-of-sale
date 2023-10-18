import { TestBed } from '@angular/core/testing';

import { DatabaseService } from './database.service';

describe('DatabaseService', () => {
  let service: DatabaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatabaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have sales, bookings, and expenses tables', () => {
    expect(service.sales).toBeDefined();
    expect(service.bookings).toBeDefined();
    expect(service.expenses).toBeDefined();
  });
});
