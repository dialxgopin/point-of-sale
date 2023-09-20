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
});
