import { Component } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { FiltersService } from '../filters.service';
import { Database } from '../database';

interface Expense {
  id: string;
  identifier: string;
  name: string;
  price: number;
  date: Date;
}

interface ExpenseTotal {
  price: number;
}

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.css']
})
export class ExpensesComponent {
  expenseData: Expense[] = [
    { id: uuidv4(), identifier: '', name: '', price: 0, date: new Date() }
  ];

  expenseTotal: ExpenseTotal = {
    price: 0,
  };

  private dbName = 'expenseDB';
  private storeName = 'expenseStore';
  private database: Database;

  tableDate: Date = new Date();
  isReadOnly: boolean = false;

  constructor(private filtersService: FiltersService) {
    this.database = new Database();
    this.database.setDatabaseAndStore(this.dbName, this.storeName);
  }

  ngOnInit() {
    this.filtersService.tableDate$.subscribe(
      date => {
        this.tableDate = date;
        this.updateReadOnlyStatus();
        this.refreshInstallmentsDataFromDatabase();
      }
    );
    this.updateReadOnlyStatus();
  }

  private updateReadOnlyStatus() {
    const today = new Date();
    this.isReadOnly = !this.isSameDay(this.tableDate, today);
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  addRow() {
    const newRow: Expense = { id: uuidv4(), identifier: '', name: '', price: 0, date: this.tableDate };
    this.expenseData.push(newRow);
  }

  saveRow(index: number) {
    if (this.expenseData[index].identifier) {
      this.database.saveData([this.expenseData[index]]);
    }
    this.calculateTotal();
  }

  refreshInstallmentsDataFromDatabase() {
    const startDate = new Date(
      this.tableDate.getFullYear(),
      this.tableDate.getMonth(),
      this.tableDate.getDate()
    );
    const endDate = new Date(
      this.tableDate.getFullYear(),
      this.tableDate.getMonth(),
      this.tableDate.getDate() + 1
    );

    this.database.queryByDate(startDate, endDate).then((results) => {
      this.expenseData = results as Expense[];
      this.calculateTotal();
    }).catch((error) => {
      console.error('Error:', error);
    });
  }

  calculateTotal() {
    this.expenseTotal.price = 0;

    this.expenseData.forEach((expense) => {
      this.expenseTotal.price += expense.price;
    });
  }
}
