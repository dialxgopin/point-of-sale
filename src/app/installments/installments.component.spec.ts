import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { InstallmentsComponent } from './installments.component';
import { FiltersService } from '../filters.service';
import { DatabaseService } from '../database.service';
import { BehaviorSubject } from 'rxjs';
import { DataTableComponent } from '../data-table/data-table.component';
import { FormsModule } from '@angular/forms';

describe('InstallmentsComponent', () => {
  let component: InstallmentsComponent;
  let fixture: ComponentFixture<InstallmentsComponent>;

  const filtersServiceStub = {
    tableDate$: new BehaviorSubject<Date>(new Date()),
    rowCount$: new BehaviorSubject<number>(0),
  };

  const databaseServiceStub = {
    sales: {
      where: () => ({
        between: () => ({
          toArray: () => Promise.resolve([]),
        }),
        equals: () => ({
          toArray: () => Promise.resolve([]),
        }),
      }),
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InstallmentsComponent, DataTableComponent],
      imports: [FormsModule],
      providers: [
        { provide: FiltersService, useValue: filtersServiceStub },
        { provide: DatabaseService, useValue: databaseServiceStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstallmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should query sales', fakeAsync(() => {
    const spySalesWhere = spyOn(databaseServiceStub.sales, 'where').and.returnValue({
      between: () => ({
        toArray: () => Promise.resolve([]),
      }),
      equals: () => ({
        toArray: () => Promise.resolve([]),
      }),
    });
    component.querySales();
    tick();
    expect(spySalesWhere).toHaveBeenCalled();
  }));

  it('should calculate total', () => {
    component.installmentsData = [
      {
        id: '1',
        saleNumber: 1,
        identifier: 'test',
        name: 'test',
        item: 'Item1',
        price: 10,
        card: 5,
        cash: 5,
        transfer: [{ quantity: 1, method: 'Method 1' }],
        installments: [{ quantity: 0.1, method: 'Method 2' }],
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
        transfer: [{ quantity: 1, method: 'Method 1' }],
        installments: [{ quantity: 0.2, method: 'Method 2' }],
        date: new Date()
      },
    ];
    component.calculateTotal();
    expect(component.installmentsTotal.card).toBe(15);
    expect(component.installmentsTotal.cash).toBe(10);
    expect(component.installmentsTotal.transfer).toBe(2);
    expect(component.installmentsTotal.installments).toBe(0.3);
  });

  it('should query sales by identifier', fakeAsync(() => {
    component.searchIdentifier = 'test';
    const spySalesWhere = spyOn(databaseServiceStub.sales, 'where').and.returnValue({
      between: () => ({
        toArray: () => Promise.resolve([]),
      }),
      equals: () => ({
        toArray: () => Promise.resolve([]),
      }),
    });
    component.queryClientSalesByIdentifier();
    tick();
    expect(spySalesWhere).toHaveBeenCalled();
  }));

  it('should query sales when searchIdentifier is empty', fakeAsync(() => {
    component.searchIdentifier = '';
    const spySalesWhere = spyOn(databaseServiceStub.sales, 'where').and.returnValue({
      between: () => ({
        toArray: () => Promise.resolve([]),
      }),
      equals: () => ({
        toArray: () => Promise.resolve([]),
      }),
    });
    component.queryClientSalesByIdentifier();
    tick();
    expect(spySalesWhere).toHaveBeenCalled();
  }));

  it('should query sales by name', fakeAsync(() => {
    component.searchName = 'test';
    const spySalesWhere = spyOn(databaseServiceStub.sales, 'where').and.returnValue({
      between: () => ({
        toArray: () => Promise.resolve([]),
      }),
      equals: () => ({
        toArray: () => Promise.resolve([]),
      }),
    });
    component.queryClientSalesByName();
    tick();
    expect(spySalesWhere).toHaveBeenCalled();
  }));

  it('should query sales when searchName is empty', fakeAsync(() => {
    component.searchName = '';
    const spySalesWhere = spyOn(databaseServiceStub.sales, 'where').and.returnValue({
      between: () => ({
        toArray: () => Promise.resolve([]),
      }),
      equals: () => ({
        toArray: () => Promise.resolve([]),
      }),
    });
    component.queryClientSalesByName();
    tick();
    expect(spySalesWhere).toHaveBeenCalled();
  }));
});