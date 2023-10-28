import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportsComponent } from './reports.component';
import { DatabaseService } from '../database.service';
import { FiltersService } from '../filters.service';
import { Sale } from '../models/sale';
import { Expense } from '../models/expense';
import { Booking } from '../models/booking';
import { BehaviorSubject, of } from 'rxjs';
import { DateRange } from '../models/date-range';
import { DataTableComponent } from '../data-table/data-table.component';

const sales: Sale[] = [
  {
    id: '1',
    saleNumber: 1,
    identifier: 'test',
    name: 'test',
    item: 'Item1',
    price: 100,
    card: 50,
    cash: 40,
    transfer: [{ quantity: 0.5, method: 'Method 1' }],
    installments: [{ quantity: 0.1, method: 'Method 2' }],
    date: new Date()
  },
  {
    id: '2',
    saleNumber: 2,
    identifier: 'test',
    name: 'test',
    item: 'Item2',
    price: 200,
    card: 100,
    cash: 80,
    transfer: [{ quantity: 0.5, method: 'Method 1' }],
    installments: [{ quantity: 0.2, method: 'Method 2' }],
    date: new Date()
  }
];

const bookings: Booking[] = [
  { id: '1', saleNumber: 1, identifier: 'test', name: 'test', quantity: 60, method: 'Efectivo', date: new Date() },
  { id: '2', saleNumber: 2, identifier: 'test', name: 'test', quantity: 120, method: 'Tarjeta', date: new Date() },
  { id: '3', saleNumber: 1, identifier: 'test', name: 'test', quantity: 50, method: 'Transferencia Banco', date: new Date() }
];

const expenses: Expense[] = [
  { id: '1', identifier: 'A', name: 'Expense 1', price: 30, date: new Date() },
  { id: '2', identifier: 'B', name: 'Expense 2', price: 60, date: new Date() },
];

describe('ReportsComponent', () => {
  let component: ReportsComponent;
  let fixture: ComponentFixture<ReportsComponent>;

  const filtersServiceStub = {
    dateRange$: new BehaviorSubject<DateRange>({
      startDate: new Date(),
      endDate: new Date()
    }),
  };

  const databaseServiceStub = {
    sales: {
      where: () => ({
        between: () => ({
          toArray: () => Promise.resolve([] as Sale[]),
        }),
      }),
    },
    bookings: {
      where: () => ({
        between: () => ({
          toArray: () => Promise.resolve([] as Booking[]),
        }),
      }),
    },
    expenses: {
      where: () => ({
        between: () => ({
          toArray: () => Promise.resolve([] as Expense[]),
        }),
      }),
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportsComponent, DataTableComponent],
      providers: [
        { provide: DatabaseService, useValue: databaseServiceStub },
        { provide: FiltersService, useValue: filtersServiceStub },
      ],
    });

    fixture = TestBed.createComponent(ReportsComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should refresh data from the database when date range changes', async () => {
    const startDate = new Date(2023, 0, 1);
    const endDate = new Date(2023, 0, 31);
    const salesData: Sale[] = sales;
    const bookingData: Booking[] = bookings;
    const expenseData: Expense[] = expenses;

    filtersServiceStub.dateRange$.next({ startDate, endDate });
    spyOn(databaseServiceStub.sales, 'where').and.returnValue({ between: () => ({ toArray: () => Promise.resolve(salesData) }) });
    spyOn(databaseServiceStub.bookings, 'where').and.returnValue({ between: () => ({ toArray: () => Promise.resolve(bookingData) }) });
    spyOn(databaseServiceStub.expenses, 'where').and.returnValue({ between: () => ({ toArray: () => Promise.resolve(expenseData) }) });

    await component.refreshDataFromDatabase();

    expect(component.salesData).toEqual(salesData);
    expect(component.bookingData).toEqual(bookingData);
    expect(component.expenseData).toEqual(expenseData);
  });

  it('should calculate total values correctly', () => {
    component.salesData = sales;
    component.bookingData = bookings;
    component.expenseData = expenses;

    component.calculateTotal();

    expect(component.total.price).toBe(300);
    expect(component.total.card).toBe(270);
    expect(component.total.cash).toBe(180);
    expect(component.total.transfer).toBe(51);
    expect(component.total.installments).toBe(0.3);
    expect(component.total.expenses).toBe(90);
    expect(component.total.balance).toBe(90);
  });
});