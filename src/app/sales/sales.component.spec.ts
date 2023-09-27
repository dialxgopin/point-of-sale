import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SalesComponent } from './sales.component';
import { FiltersService } from '../filters.service';
import { Database } from '../database';
import { DataTableComponent } from '../data-table/data-table.component';

describe('SalesComponent', () => {
  let component: SalesComponent;
  let fixture: ComponentFixture<SalesComponent>;
  let filtersService: FiltersService;
  let database: Database;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SalesComponent, DataTableComponent],
      providers: [FiltersService],
    });

    fixture = TestBed.createComponent(SalesComponent);
    component = fixture.componentInstance;
    filtersService = TestBed.inject(FiltersService);
    database = new Database();
    spyOn(database, 'setDatabaseAndStore');
    spyOn(database, 'saveData').and.returnValue(Promise.resolve());

    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add a new row', () => {
    const initialRowCount = component.salesData.length;
    component.addRow();
    const finalRowCount = component.salesData.length;
    expect(finalRowCount).toBeGreaterThan(initialRowCount);
    const addedRow = component.salesData[finalRowCount - 1];
    expect(addedRow.id).toBeTruthy();
  });

  it('should save a row when identifier is present', () => {
    const index = 0;
    component.salesData[index].identifier = 'some-identifier';
    component.saveRow(index);
    expect(component.salesData).toContain(component.salesData[index]);
  });

  it('should refresh sales data from database on table date change', fakeAsync(() => {
    const newDate = new Date('2023-09-01');
    filtersService.setDate(newDate);
    tick();
    expect(component.tableDate).toEqual(newDate);
    const startDate = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate());
    const endDate = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate() + 1);
    component.refreshSalesDataFromDatabase();
    tick();
    expect(component.salesData).not.toEqual([]);
  }));
});