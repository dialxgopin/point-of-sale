import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BookingsComponent } from './bookings.component';
import { FiltersService } from '../filters.service';
import { DatabaseService } from '../database.service';
import { DataTableComponent } from '../data-table/data-table.component';
import { FormsModule } from '@angular/forms';
import { Sale } from '../models/sale';

describe('BookingsComponent', () => {
  let component: BookingsComponent;
  let fixture: ComponentFixture<BookingsComponent>;
  let filtersService: FiltersService;

  const databaseServiceStub = {
    bookings: {
      where: () => ({
        between: () => ({
          toArray: () => Promise.resolve([]),
        }),
      }),
      put: () => Promise.resolve(),
    },
    sales: {
      where: () => ({
        equals: () => ({
          toArray: () => Promise.resolve([] as Sale[]),
        }),
      }),
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BookingsComponent, DataTableComponent],
      imports: [FormsModule],
      providers: [
        { provide: DatabaseService, useValue: databaseServiceStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingsComponent);
    component = fixture.componentInstance;
    filtersService = TestBed.inject(FiltersService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should refresh bookings data', fakeAsync(() => {
    const spyBookingsWhere = spyOn(databaseServiceStub.bookings, 'where').and.returnValue({
      between: () => ({
        toArray: () => Promise.resolve([]),
      }),
    });
    component.refreshBookingsDataFromDatabase();
    tick();
    expect(spyBookingsWhere).toHaveBeenCalled();
  }));

  it('should calculate total', () => {
    component.bookingData = [
      { id: '1', saleNumber: 1, identifier: 'test', name: 'test', quantity: 10, date: new Date() },
      { id: '2', saleNumber: 2, identifier: 'test', name: 'test', quantity: 15, date: new Date() },
    ];
    component.calculateTotal();
    expect(component.bookingTotal.quantity).toBe(25);
  });

  it('should add row', () => {
    component.addRow();
    expect(component.bookingData.length).toBe(1);
  });

  it('should save row', fakeAsync(() => {
    component.addRow();
    component.bookingData[0].identifier = 'some-identifier';
    component.salesData = [{
      id: '1',
      saleNumber: 1,
      identifier: 'test',
      name: 'test',
      item: 'Item1',
      price: 10,
      card: 5,
      cash: 5,
      transfer: [{ quantity: 0, method: 'Method 1' }],
      installments: [{ quantity: 0, method: 'Method 2' }],
      date: new Date(),
      selected: true
    }];
    const spyDatabasePut = spyOn(databaseServiceStub.bookings, 'put').and.returnValue(Promise.resolve());
    component.saveRow(0);
    tick();
    expect(spyDatabasePut).toHaveBeenCalled();
  }));

  it('should query client sales by identifier', fakeAsync(() => {
    component.bookingData = [{ id: '1', saleNumber: 1, identifier: 'test', name: '', quantity: 0, date: new Date() }];
    const spySalesWhere = spyOn(databaseServiceStub.sales, 'where').and.returnValue({
      equals: () => ({
        toArray: () => Promise.resolve([
          {
            id: '1',
            saleNumber: 1,
            identifier: 'test',
            name: 'test',
            item: 'Item1',
            price: 10,
            card: 5,
            cash: 5,
            transfer: [{ quantity: 0, method: 'Method 1' }],
            installments: [{ quantity: 0, method: 'Method 2' }],
            date: new Date()
          }
        ]),
      }),
    });
    component.queryClientSalesByIdentifier(0);
    tick();
    expect(spySalesWhere).toHaveBeenCalled();
  }));

  it('should query client sales by name', fakeAsync(() => {
    component.bookingData = [{ id: '1', saleNumber: 1, identifier: '', name: 'test', quantity: 0, date: new Date() }];
    const spySalesWhere = spyOn(databaseServiceStub.sales, 'where').and.returnValue({
      equals: () => ({
        toArray: () => Promise.resolve([
          {
            id: '1',
            saleNumber: 1,
            identifier: 'test',
            name: 'test',
            item: 'Item1',
            price: 10,
            card: 5,
            cash: 5,
            transfer: [{ quantity: 0, method: 'Method 1' }],
            installments: [{ quantity: 0, method: 'Method 2' }],
            date: new Date()
          }
        ]),
      }),
    });
    component.queryClientSalesByName(0);
    tick();
    expect(spySalesWhere).toHaveBeenCalled();
  }));

  it('should select row', fakeAsync(() => {
    component.salesData = [
      {
        id: '1',
        saleNumber: 1,
        identifier: 'testIdentifier',
        name: 'TestName',
        item: 'Item1',
        price: 100,
        card: 50,
        cash: 50,
        transfer: [{ quantity: 0, method: 'Method 1' }],
        installments: [{ quantity: 0, method: 'Method 2' }],
        date: new Date(),
        selected: false
      }
    ];
    component.bookingData = [
      {
        id: 'string',
        saleNumber: 1,
        identifier: 'string',
        name: 'string',
        quantity: 1,
        date: new Date()
      }
    ];
    component.selectRow(0, 0);
    expect(component.salesData[0].selected).toBeTruthy();
  }));
});