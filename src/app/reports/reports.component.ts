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

interface DailyTotal extends Total {
  date?: Date;
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

  dailyTotal: DailyTotal[] = [];

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
    this.filtersService.rowCount$.subscribe(
      rows => {
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
    this.calculateDailyTotal();
  }

  calculateTotal() {
    this.total = this.resetZeros(this.total);
    this.total = this.sumSales(this.total, this.salesData);
    this.total = this.sumPayments(this.total, this.bookingData);
    this.total = this.sumExpenses(this.total, this.expenseData);
    this.total = this.calculateBalance(this.total);
  }

  calculateDailyTotal() {
    this.dailyTotal = [];
    let currentDate = new Date(this.dateRange.startDate);
    const endDate = new Date(this.dateRange.endDate);
    while (currentDate < endDate) {
      let dailyTotal: DailyTotal = {
        price: 0,
        card: 0,
        cash: 0,
        transfer: 0,
        installments: 0,
        expenses: 0,
        balance: 0,
        date: currentDate
      };
      const salesForDay = this.salesData.filter(sale =>
        sale.date >= currentDate && sale.date < new Date(currentDate.getTime() + 24 * 60 * 60 * 1000)
      );
      const bookingsForDay = this.bookingData.filter(booking =>
        booking.date >= currentDate && booking.date < new Date(currentDate.getTime() + 24 * 60 * 60 * 1000)
      );
      const expensesForDay = this.expenseData.filter(expense =>
        expense.date >= currentDate && expense.date < new Date(currentDate.getTime() + 24 * 60 * 60 * 1000)
      );
      dailyTotal = this.sumSales(dailyTotal, salesForDay);
      dailyTotal = this.sumPayments(dailyTotal, bookingsForDay);
      dailyTotal = this.sumExpenses(dailyTotal, expensesForDay);
      dailyTotal = this.calculateBalance(dailyTotal);
      if (!this.areAllNumbersEqualToZero(dailyTotal)) {
        this.dailyTotal.push(dailyTotal);
      }
      currentDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
    }
  }

  private resetZeros(total: Total): Total {
    total.price = 0;
    total.card = 0;
    total.cash = 0;
    total.transfer = 0;
    total.installments = 0;
    total.expenses = 0;
    return total;
  }

  private sumSales(total: Total, sales: Sale[]): Total {
    sales.forEach((sale) => {
      total.price = Number(
        bigDecimal
          .add(
            total.price,
            sale.price
          )
      );
      total.card = Number(
        bigDecimal.add(
          total.card,
          sale.card
        )
      );
      total.cash = Number(
        bigDecimal
          .add(
            total.cash,
            sale.cash
          )
      );
      sale.transfer.forEach((transfer) => {
        total.transfer = Number(
          bigDecimal
            .add(
              total.transfer,
              transfer.quantity
            )
        );
      });
      sale.installments.forEach((installment) => {
        total.installments = Number(
          bigDecimal
            .add(
              total.installments,
              installment.quantity
            )
        );
      });
    });
    return total;
  }

  private sumPayments(total: Total, bookings: Booking[]): Total {
    bookings.forEach((booking) => {
      switch (booking.method) {
        case 'Efectivo': {
          total.cash = Number(
            bigDecimal.add(booking.quantity, total.cash)
          );
          break;
        }
        case 'Tarjeta': {
          total.card = Number(
            bigDecimal.add(booking.quantity, total.card)
          );
          break;
        }
        default: {
          total.transfer = Number(
            bigDecimal.add(booking.quantity, total.transfer)
          );
          break;
        }
      }
    });
    return total;
  }

  private sumExpenses(total: Total, expenses: Expense[]): Total {
    expenses.forEach((expense) => {
      total.expenses = Number(
        bigDecimal
          .add(total.expenses, expense.price)
      );
    });
    return total;
  }

  private calculateBalance(total: Total): Total {
    total.balance = Number(
      bigDecimal.subtract(
        total.cash,
        total.expenses
      )
    );
    return total;
  }

  areAllNumbersEqualToZero(obj: DailyTotal): boolean {
    for (const key in obj) {
      if (typeof obj[key as keyof DailyTotal] === 'number' &&
        obj[key as keyof DailyTotal] !== 0) {
        return false;
      }
    }
    return true;
  }
}
