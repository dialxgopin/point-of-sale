import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BookingsComponent } from './bookings.component';
import { FiltersService } from '../filters.service';
import { DatabaseService } from '../database.service';
import { DataTableComponent } from '../data-table/data-table.component';
import { FormsModule } from '@angular/forms';
import { Sale } from '../models/sale';
import { Booking } from '../models/booking';
import { Bank } from '../models/bank';

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
        equals: () => ({
          toArray: () => Promise.resolve([] as Booking[]),
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
    banks: {
      toArray: () => Promise.resolve([] as Bank[]),
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
      equals: () => ({
        toArray: () => Promise.resolve([]),
      }),
    });
    component.refreshBookingsDataFromDatabase();
    tick();
    expect(spyBookingsWhere).toHaveBeenCalled();
  }));

  it('should calculate total', () => {
    component.bookingData = [
      { id: '1', saleNumber: 1, identifier: 'test', name: 'test', quantity: 10, method: 'Efectivo', date: new Date() },
      { id: '2', saleNumber: 2, identifier: 'test', name: 'test', quantity: 15, method: 'Tarjeta', date: new Date() },
    ];
    component.calculateTotal();
    expect(component.paymentMethodTotal.cash).toBe(10);
    expect(component.paymentMethodTotal.card).toBe(15);
    expect(component.paymentMethodTotal.transfer).toBe(0);
    expect(component.bookingTotal.quantity).toBe(25);
  });

  it('should add row', fakeAsync(() => {
    spyOn(databaseServiceStub.sales, 'where').and.returnValue({
      equals: () => ({
        toArray: () => Promise.resolve([
          {
            id: '1',
            saleNumber: 1,
            identifier: 'test',
            name: 'test',
            item: 'Item1',
            price: 110,
            card: 5,
            cash: 5,
            transfer: [{ quantity: 0, method: 'Method 1' }],
            installments: [{ quantity: 0, method: 'Method 2' }],
            date: new Date()
          }
        ]),
      }),
    });
    spyOn(databaseServiceStub.bookings, 'where').and.returnValue({
      between: () => ({
        toArray: () => Promise.resolve([]),
      }),
      equals: () => ({
        toArray: () => Promise.resolve([
          { id: '1', saleNumber: 1, identifier: 'test', name: 'test', quantity: 10, method: '', date: new Date() },
          { id: '2', saleNumber: 1, identifier: 'test', name: 'test', quantity: 10, method: '', date: new Date() }
        ]),
      }),
    });
    component.addRow();
    tick();
    expect(component.bookingData.length).toBe(1);
  }));

  it('should set isEditing to true and populate salesData when calling editRow', async () => {
    component.bookingData = [
      { id: '1', saleNumber: 1, identifier: 'test', name: 'test', quantity: 10, method: 'Efectivo', date: new Date() },
      { id: '2', saleNumber: 2, identifier: 'test', name: 'test', quantity: 15, method: 'Tarjeta', date: new Date() },
    ];
    spyOn(databaseServiceStub.sales, 'where').and.returnValue({
      equals: () => ({
        toArray: () => Promise.resolve([
          {
            id: '1',
            saleNumber: 1,
            identifier: 'test',
            name: 'test',
            item: 'Item1',
            price: 110,
            card: 5,
            cash: 5,
            transfer: [{ quantity: 0, method: 'Method 1' }],
            installments: [{ quantity: 0, method: 'Method 2' }],
            date: new Date()
          }
        ]),
      }),
    });
    spyOn(databaseServiceStub.bookings, 'where').and.returnValue({
      between: () => ({
        toArray: () => Promise.resolve([]),
      }),
      equals: () => ({
        toArray: () => Promise.resolve([
          { id: '1', saleNumber: 1, identifier: 'test', name: 'test', quantity: 10, method: '', date: new Date() },
          { id: '2', saleNumber: 1, identifier: 'test', name: 'test', quantity: 10, method: '', date: new Date() }
        ]),
      }),
    });
    await component.editRow(0);
    expect(component.isEditing).toBeTrue();
    expect(component.currentWorkingIndex).toBe(0);
    expect(component.salesData.length).toBe(1);
    expect(component.salesData[0].selected).toBeTrue();
  });

  it('should save row', fakeAsync(() => {
    component.addRow();
    component.bookingData = [
      { id: '1', saleNumber: 1, identifier: 'test', name: 'test', quantity: 10, method: 'Efectivo', date: new Date() },
      { id: '2', saleNumber: 1, identifier: 'test', name: 'test', quantity: 15, method: 'Tarjeta', date: new Date() },
      { id: '2', saleNumber: 1, identifier: 'test', name: 'test', quantity: 15, method: 'Banco', date: new Date() },
    ];
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

  it('should set paymentLessThanDebt to true when quantity is less than debt', async () => {
    component.bookingData = [
      { id: '1', saleNumber: 1, identifier: 'test', name: 'test', quantity: 10, method: 'Efectivo', date: new Date() },
      { id: '2', saleNumber: 2, identifier: 'test', name: 'test', quantity: 15, method: 'Tarjeta', date: new Date() },
    ];
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
      selected: true,
      debt: 100
    }];
    component.validPaymentQuantity(0);
    expect(component.paymentLessThanDebt).toBeTrue();
  });

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
    component.selectRow(0);
    expect(component.salesData[0].selected).toBeTruthy();
  }));

  it('should get payment methods from banks', async () => {
    const bankData = [
      { id: '1', name: 'Bank A' },
      { id: '2', name: 'Bank B' },
      { id: '3', name: 'Bank C' },
    ];
    spyOn(databaseServiceStub.banks, 'toArray').and.returnValue(Promise.resolve(bankData));
    await component.getPaymentMethods();
    expect(component.paymentMethods).toEqual(['Bank A', 'Bank B', 'Bank C']);
  });
});