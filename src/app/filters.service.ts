import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PaymentTotal } from './models/payment-total';
import { DateRange } from './models/date-range';

@Injectable({
  providedIn: 'root'
})
export class FiltersService {

  private tableDateSubject = new BehaviorSubject<Date>(new Date());
  private dateRangeSubject = new BehaviorSubject<DateRange>({
    startDate: new Date(),
    endDate: new Date()
  });
  private rowCountSubject = new BehaviorSubject<number>(0);
  private expenseTotalSubject = new BehaviorSubject<number>(0);
  private accountsSubject = new BehaviorSubject<number>(0);
  private payTotalSubject = new BehaviorSubject<PaymentTotal>({
    card: 0,
    cash: 0,
    transfer: 0
  });

  tableDate$ = this.tableDateSubject.asObservable();
  dateRange$ = this.dateRangeSubject.asObservable();
  rowCount$ = this.rowCountSubject.asObservable();
  expenseTotal$ = this.expenseTotalSubject.asObservable();
  accounts$ = this.accountsSubject.asObservable();
  payTotal$ = this.payTotalSubject.asObservable();

  setDate(date: Date) {
    this.tableDateSubject.next(date);
  }

  setDateRange(dateRange: DateRange) {
    this.dateRangeSubject.next(dateRange);
  }

  changeRowCount(rows: number) {
    this.rowCountSubject.next(rows);
  }

  updateTotalExpense(price: number) {
    this.expenseTotalSubject.next(price);
  }

  updateAccounts(accounts: number) {
    this.accountsSubject.next(accounts);
  }

  updateTotalPay(payments: PaymentTotal) {
    this.payTotalSubject.next(payments);
  }
}
