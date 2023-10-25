import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BookingInformationComponent } from './booking-information.component';
import { FiltersService } from '../filters.service';
import { DatabaseService } from '../database.service';
import { BehaviorSubject } from 'rxjs';
import { DataTableComponent } from '../data-table/data-table.component';
import { FormsModule } from '@angular/forms';
import { Sale } from '../models/sale';
import { Booking } from '../models/booking';

describe('BookingInformationComponent', () => {
  let component: BookingInformationComponent;
  let fixture: ComponentFixture<BookingInformationComponent>;

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
          toArray: () => Promise.resolve([] as Sale[]),
        }),
      }),
    },
    bookings: {
      where: () => ({
        equals: () => ({
          toArray: () => Promise.resolve([] as Booking[]),
        }),
      }),
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BookingInformationComponent, DataTableComponent],
      imports: [FormsModule],
      providers: [
        { provide: FiltersService, useValue: filtersServiceStub },
        { provide: DatabaseService, useValue: databaseServiceStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should refresh booking data', fakeAsync(() => {
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

  it('should query client sales by identifier', fakeAsync(() => {
    component.searchIdentifier = 'test';
    const spySalesWhere = spyOn(databaseServiceStub.sales, 'where').and.returnValue({
      between: () => ({
        toArray: () => Promise.resolve([]),
      }),
      equals: () => ({
        toArray: () => Promise.resolve([
          {
            id: '1',
            saleNumber: 1,
            identifier: 'test',
            name: 'test',
            item: 'Item1',
            price: 25,
            card: 0,
            cash: 0,
            transfer: [{ quantity: 0, method: 'Method 1' }],
            installments: [{ quantity: 25, method: 'Method 2' }],
            date: new Date()
          }
        ]),
      }),
    });
    const spyBookingsWhere = spyOn(databaseServiceStub.bookings, 'where').and.returnValue({
      equals: () => ({
        toArray: () => Promise.resolve([
          { id: '1', saleNumber: 1, identifier: 'test', name: 'test', quantity: 10, method: '', date: new Date() },
          { id: '2', saleNumber: 2, identifier: 'test', name: 'test', quantity: 10, method: '', date: new Date() }
        ]),
      }),
    });
    component.queryClientSalesByIdentifier();
    tick();
    expect(spySalesWhere).toHaveBeenCalled();
    expect(spyBookingsWhere).toHaveBeenCalled();
    expect(component.bookingData.at(0)?.paid).toBe(20);
    expect(component.bookingData.at(0)?.due).toBe(5);
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

  it('should query client sales by name', fakeAsync(() => {
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