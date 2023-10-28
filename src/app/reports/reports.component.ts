import { Component } from '@angular/core';
import { DatabaseService } from '../database.service';
import { FiltersService } from '../filters.service';
import { Sale } from '../models/sale';
import { DateRange } from '../models/date-range';
import bigDecimal from 'js-big-decimal';
import { Expense } from '../models/expense';
import { Booking } from '../models/booking';

interface Total {
  price: number;
  card: number;
  cash: number;
  transfer: number;
  installments: number;
  expenses: number;
  balance: number;
}

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent {
  total: Total = {
    price: 0,
    card: 0,
    cash: 0,
    transfer: 0,
    installments: 0,
    expenses: 0,
    balance: 0
  };

  salesData: Sale[] = [];
  bookingData: Booking[] = [];
  expenseData: Expense[] = [];

  dateRange: DateRange = {
    startDate: new Date(),
    endDate: new Date()
  };

  constructor(private databaseService: DatabaseService,
    private filtersService: FiltersService) {
    this.filtersService.dateRange$.subscribe(
      dates => {
        this.dateRange = dates;
        this.dateRange.startDate = new Date(
          this.dateRange.startDate.getFullYear(),
          this.dateRange.startDate.getMonth(),
          this.dateRange.startDate.getDate()
        );
        this.dateRange.endDate = new Date(
          this.dateRange.endDate.getFullYear(),
          this.dateRange.endDate.getMonth(),
          this.dateRange.endDate.getDate() + 1
        );
        this.refreshDataFromDatabase();
      }
    );
  }

  async refreshDataFromDatabase() {
    this.salesData = await this.databaseService.sales
      .where('date')
      .between(this.dateRange.startDate, this.dateRange.endDate, true, true)
      .toArray();
    this.bookingData = await this.databaseService.bookings
      .where('date')
      .between(this.dateRange.startDate, this.dateRange.endDate, true, true)
      .toArray();
    this.expenseData = await this.databaseService.expenses
      .where('date')
      .between(this.dateRange.startDate, this.dateRange.endDate, true, true)
      .toArray();
    this.calculateTotal();
  }

  calculateTotal() {
    this.resetZeros();
    this.sumSales();
    this.sumPayments();
    this.sumExpenses();
    this.calculateBalance();
  }

  private resetZeros() {
    this.total.price = 0;
    this.total.card = 0;
    this.total.cash = 0;
    this.total.transfer = 0;
    this.total.installments = 0;
    this.total.expenses = 0;
  }

  private sumSales() {
    this.salesData.forEach((sale) => {
      this.total.price = Number(
        bigDecimal
          .add(
            this.total.price,
            sale.price
          )
      );
      this.total.card = Number(
        bigDecimal.add(
          this.total.card,
          sale.card
        )
      );
      this.total.cash = Number(
        bigDecimal
          .add(
            this.total.cash,
            sale.cash
          )
      );
      sale.transfer.forEach((transfer) => {
        this.total.transfer = Number(
          bigDecimal
            .add(
              this.total.transfer,
              transfer.quantity
            )
        );
      });
      sale.installments.forEach((installment) => {
        this.total.installments = Number(
          bigDecimal
            .add(
              this.total.installments,
              installment.quantity
            )
        );
      });
    });
  }

  private sumPayments() {
    this.bookingData.forEach((booking) => {
      switch (booking.method) {
        case 'Efectivo': {
          this.total.cash = Number(
            bigDecimal.add(booking.quantity, this.total.cash)
          );
          break;
        }
        case 'Tarjeta': {
          this.total.card = Number(
            bigDecimal.add(booking.quantity, this.total.card)
          );
          break;
        }
        default: {
          this.total.transfer = Number(
            bigDecimal.add(booking.quantity, this.total.transfer)
          );
          break;
        }
      }
    });
  }

  private sumExpenses() {
    this.expenseData.forEach((expense) => {
      this.total.expenses = Number(
        bigDecimal
          .add(this.total.expenses, expense.price)
      );
    });
  }

  private calculateBalance() {
    this.total.balance = Number(
      bigDecimal.subtract(
        this.total.cash,
        this.total.expenses
      )
    );
  }
}
