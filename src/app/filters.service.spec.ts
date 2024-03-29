import { TestBed } from '@angular/core/testing';
import { FiltersService } from './filters.service';

describe('FiltersService', () => {
  let service: FiltersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FiltersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initially have a default date', (done) => {
    service.tableDate$.subscribe((date) => {
      expect(date.toDateString()).toBe(new Date().toDateString());
      done();
    });
  });

  it('should set and emit a new date', (done) => {
    const newDate = new Date('2020-08-31');
    service.setDate(newDate);
    service.tableDate$.subscribe((date) => {
      expect(date.toDateString()).toBe(newDate.toDateString());
      done();
    });
  });

  it('should initially have a default row count', (done) => {
    service.rowCount$.subscribe((rows) => {
      expect(rows).toBe(0);
      done();
    });
  });

  it('should change and emit a new row count', (done) => {
    service.changeRowCount(1);
    service.rowCount$.subscribe((rows) => {
      expect(rows).toBe(1);
      done();
    });
  });

  it('should update the accounts subject with the given value', (done) => {
    service.updateAccounts(42);
    service.accounts$.subscribe((accountsValue) => {
      expect(accountsValue).toBe(42);
      done();
    });    
  });

  it('should update expense and emit total', (done) => {
    service.updateTotalExpense(100.1);
    service.expenseTotal$.subscribe((expense) => {
      expect(expense).toBe(100.1);
      done();
    });
  });
});
