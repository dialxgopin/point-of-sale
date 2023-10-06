import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SalesComponent } from './sales.component';
import { FiltersService } from '../filters.service';
import { DataTableComponent } from '../data-table/data-table.component';
import { Sale } from '../sale';

describe('SalesComponent', () => {
  let component: SalesComponent;
  let fixture: ComponentFixture<SalesComponent>;
  let filtersService: FiltersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SalesComponent, DataTableComponent],
      providers: [FiltersService],
    });

    fixture = TestBed.createComponent(SalesComponent);
    component = fixture.componentInstance;
    filtersService = TestBed.inject(FiltersService);
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
    expect(component.salesData[index].identifier).toEqual('some-identifier');
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

  it('should calculate total correctly', () => {
    const salesData: Sale[] = [
      {
        id: '1',
        saleNumber: 1,
        identifier: 'ID1',
        name: 'Test1',
        item: 'Item1',
        price: 100,
        card: 50,
        cash: 50,
        installments: 2,
        date: new Date()
      },
      {
        id: '2',
        saleNumber: 2,
        identifier: 'ID2',
        name: 'Test2',
        item: 'Item2',
        price: 150,
        card: 75,
        cash: 75,
        installments: 1,
        date: new Date()
      },
    ];
    component.salesData = salesData;
    component.calculateTotal();
    expect(component.saleTotal.price).toEqual(250);
    expect(component.saleTotal.card).toEqual(125);
    expect(component.saleTotal.cash).toEqual(125);
    expect(component.saleTotal.installments).toEqual(3);
  });
});