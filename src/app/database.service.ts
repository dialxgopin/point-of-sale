import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { Sale } from './models/sale';
import { Booking } from './models/booking';
import { Expense } from './models/expense';
import { Bank } from './models/bank';
import { CreditSystem } from './models/credit-system';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService extends Dexie {
  sales: Dexie.Table<Sale, string>;
  bookings: Dexie.Table<Booking, string>;
  expenses: Dexie.Table<Expense, string>;
  banks: Dexie.Table<Bank, string>;
  creditSystems: Dexie.Table<CreditSystem, string>;

  constructor() {
    super('appDB');

    this.version(1).stores({
      sales: 'id,saleNumber,identifier,name,item,price,card,cash,transfer,installments,date',
      bookings: 'id,saleNumber,identifier,name,quantity,method,date',
      expenses: 'id,identifier,name,price,date',
      banks: 'id,name',
      creditSystems: 'id,name',
    });

    this.sales = this.table('sales');
    this.bookings = this.table('bookings');
    this.expenses = this.table('expenses');
    this.banks = this.table('banks');
    this.creditSystems = this.table('creditSystems');
  }
}