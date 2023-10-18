import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { Sale } from './models/sale';
import { Booking } from './models/booking';
import { Expense } from './models/expense';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService extends Dexie {
  sales: Dexie.Table<Sale, string>;
  bookings: Dexie.Table<Booking, string>;
  expenses: Dexie.Table<Expense, string>;

  constructor() {
    super('appDB');

    this.version(1).stores({
      sales: 'id,saleNumber,identifier,name,item,price,card,cash,installments,date',
      bookings: 'id,saleNumber,identifier,name,quantity,date',
      expenses: 'id,identifier,name,price,date',
    });

    this.sales = this.table('sales');
    this.bookings = this.table('bookings');
    this.expenses = this.table('expenses');
  }
}