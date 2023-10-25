import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PaymentHistoryComponent } from './payment-history.component';
import { DatabaseService } from '../database.service';
import { FiltersService } from '../filters.service';
import { Booking } from '../models/booking';
import { DataTableComponent } from '../data-table/data-table.component';

describe('PaymentHistoryComponent', () => {
  let component: PaymentHistoryComponent;
  let fixture: ComponentFixture<PaymentHistoryComponent>;

  const databaseServiceStub = {
    bookings: {
      where: () => ({
        equals: () => ({
          toArray: () => Promise.resolve([] as Booking[]),
        }),
      }),
      toArray: () => Promise.resolve([] as Booking[]),
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentHistoryComponent, DataTableComponent],
      providers: [
        { provide: DatabaseService, useValue: databaseServiceStub },
        FiltersService,
      ],
    });
    fixture = TestBed.createComponent(PaymentHistoryComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate total quantity', () => {
    component.paymentHistoryData = [
      {
        id: '',
        saleNumber: 1,
        identifier: '1',
        name: 'John',
        quantity: 100,
        method: '',
        date: new Date(),
      },
      {
        id: '',
        saleNumber: 2,
        identifier: '2',
        name: 'Alice',
        quantity: 75,
        method: '',
        date: new Date(),
      },
    ];
    component.calculateTotal();
    expect(component.quantityTotal).toBe(175);
  });

  it('should query payments by identifier', async () => {
    const bookingData: Booking[] = [
      {
        id: '',
        saleNumber: 1,
        identifier: '1',
        name: 'John',
        quantity: 100,
        method: '',
        date: new Date(),
      },
    ];
    const spyBookingsWhere = spyOn(databaseServiceStub.bookings, 'where').and.returnValue({
      equals: () => ({
        toArray: () => Promise.resolve(bookingData),
      }),
    });
    spyOn(databaseServiceStub.bookings, 'toArray').and.returnValue(Promise.resolve(bookingData));
    component.searchIdentifier = '1';
    await component.queryPaymentsByIdentifier();
    expect(spyBookingsWhere).toHaveBeenCalled();
    expect(component.paymentHistoryData).toEqual(bookingData);
    expect(component.quantityTotal).toBe(100);
  });

  it('should query payments by name', async () => {
    const bookingData: Booking[] = [
      {
        id: '',
        saleNumber: 1,
        identifier: '1',
        name: 'John',
        quantity: 100,
        method: '',
        date: new Date(),
      },
    ];
    const spyBookingsWhere = spyOn(databaseServiceStub.bookings, 'where').and.returnValue({
      equals: () => ({
        toArray: () => Promise.resolve(bookingData),
      }),
    });
    spyOn(databaseServiceStub.bookings, 'toArray').and.returnValue(Promise.resolve(bookingData));
    component.searchName = 'John';
    await component.queryPaymentsByName();
    expect(spyBookingsWhere).toHaveBeenCalled();
    expect(component.paymentHistoryData).toEqual(bookingData);
    expect(component.quantityTotal).toBe(100);
  });

  it('should query bookings when searchIdentifier is empty', fakeAsync(() => {
    component.searchIdentifier = '';
    const spyBookingsToArray = spyOn(databaseServiceStub.bookings, 'toArray').and.returnValue(Promise.resolve([]));
    component.queryPaymentsByIdentifier();
    tick();
    expect(spyBookingsToArray).toHaveBeenCalled();
  }));

  it('should query bookings when searchName is empty', fakeAsync(() => {
    component.searchName = '';
    const spyBookingsToArray = spyOn(databaseServiceStub.bookings, 'toArray').and.returnValue(Promise.resolve([]));
    component.queryPaymentsByName();
    tick();
    expect(spyBookingsToArray).toHaveBeenCalled();
  }));
});