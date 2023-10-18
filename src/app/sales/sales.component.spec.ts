import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SalesComponent } from './sales.component';
import { FiltersService } from '../filters.service';
import { DatabaseService } from '../database.service';
import { BehaviorSubject } from 'rxjs';
import { DataTableComponent } from '../data-table/data-table.component';
import { FormsModule } from '@angular/forms';

describe('SalesComponent', () => {
  let component: SalesComponent;
  let fixture: ComponentFixture<SalesComponent>;

  const filtersServiceStub = {
    tableDate$: new BehaviorSubject<Date>(new Date()),
    changeRowCount: () => { },
  };

  const databaseServiceStub = {
    sales: {
      count: async () => 0,
      put: () => Promise.resolve(),
      where: () => ({
        between: () => ({
          toArray: () => Promise.resolve([]),
        }),
      }),
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SalesComponent, DataTableComponent],
      imports: [FormsModule],
      providers: [
        { provide: FiltersService, useValue: filtersServiceStub },
        { provide: DatabaseService, useValue: databaseServiceStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update read-only status', () => {
    component.tableDate = new Date();
    component['updateReadOnlyStatus']();
    expect(component.isReadOnly).toBe(false);
  });

  it('should add a row', () => {
    const initialRowCount = component.rowCount;
    component.addRow();
    expect(component.rowCount).toBe(initialRowCount + 1);
    expect(component.salesData.length).toBe(2);
  });

  it('should save a row', fakeAsync(() => {
    const spy = spyOn(databaseServiceStub.sales, 'put').and.returnValue(Promise.resolve());
    component.salesData = [{
      id: '1',
      saleNumber: 1,
      identifier: 'test',
      name: 'test',
      item: 'Item1',
      price: 10,
      card: 5,
      cash: 5,
      installments: 0,
      date: new Date()
    }];
    component.saveRow(0);
    tick();
    expect(spy).toHaveBeenCalled();
  }));

  it('should refresh sales data from the database', fakeAsync(() => {
    const spyToArray = spyOn(databaseServiceStub.sales, 'where').and.returnValue({
      between: () => ({
        toArray: () => Promise.resolve([]),
      }),
    });
    component.refreshSalesDataFromDatabase();
    tick();
    expect(spyToArray).toHaveBeenCalled();
    expect(component.salesData.length).toBe(0);
  }));

  it('should calculate total', () => {
    component.salesData = [
      {
        id: '1',
        saleNumber: 1,
        identifier: 'test',
        name: 'test',
        item: 'Item1',
        price: 10,
        card: 5,
        cash: 5,
        installments: 0,
        date: new Date()
      },
      {
        id: '2',
        saleNumber: 2,
        identifier: 'test',
        name: 'test',
        item: 'Item2',
        price: 15,
        card: 10,
        cash: 5,
        installments: 0,
        date: new Date()
      },
    ];
    component.calculateTotal();
    expect(component.saleTotal.price).toBe(25);
    expect(component.saleTotal.card).toBe(15);
    expect(component.saleTotal.cash).toBe(10);
    expect(component.saleTotal.installments).toBe(0);
  });
});