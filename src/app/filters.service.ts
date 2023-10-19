import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FiltersService {

  private tableDateSubject = new BehaviorSubject<Date>(new Date());
  private rowCountSubgect = new BehaviorSubject<number>(0);
  private expenseTotalSubgect = new BehaviorSubject<number>(0);

  tableDate$ = this.tableDateSubject.asObservable();
  rowCount$ = this.rowCountSubgect.asObservable();
  expenseTotal$ = this.expenseTotalSubgect.asObservable();

  setDate(date: Date) {
    this.tableDateSubject.next(date);
  }

  changeRowCount(rows: number) {
    this.rowCountSubgect.next(rows);
  }

  updateTotalExpense(price: number) {
    this.expenseTotalSubgect.next(price);
  }
}
