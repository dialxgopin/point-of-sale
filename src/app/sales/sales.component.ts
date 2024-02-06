import { Component } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { FiltersService } from '../filters.service';
import { Sale } from '../models/sale';
import { DatabaseService } from '../database.service';
import bigDecimal from 'js-big-decimal';
import { Bank } from '../models/bank';
import { CreditSystem } from '../models/credit-system';
import { PaymentTotal } from '../models/payment-total';

interface SaleTotal {
  price: number;
  card: number;
  cash: number;
  transfer: number;
  installments: number;
  expenses: number;
  balance: number;
}

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css']
})
export class SalesComponent {
  salesData: Sale[] = [
    {
      id: uuidv4(),
      saleNumber: 0,
      identifier: '',
      name: '',
      item: '',
      price: 0,
      card: 0,
      cash: 0,
      transfer: [],
      installments: [],
      date: new Date(),
    },
  ];

  saleTotal: SaleTotal = {
    price: 0,
    card: 0,
    cash: 0,
    transfer: 0,
    installments: 0,
    expenses: 0,
    balance: 0
  };

  banks: Bank[] = [];
  creditSystems: CreditSystem[] = [];

  tableDate: Date = new Date();
  rowCount: number = 0;
  isReadOnly: boolean = false;
  paymentMethodTotal: PaymentTotal = {
    card: 0,
    cash: 0,
    transfer: 0
  };

  constructor(private databaseService: DatabaseService,
    private filtersService: FiltersService) {
    this.getCountOfRows();
  }

  ngOnInit() {
    this.filtersService.tableDate$.subscribe(
      date => {
        this.tableDate = date;
        this.updateReadOnlyStatus();
        this.refreshSalesDataFromDatabase();
      }
    );
    this.updateReadOnlyStatus();
    this.filtersService.expenseTotal$.subscribe(
      quantity => {
        this.saleTotal.expenses = quantity;
        this.calculateTotal();
      }
    );
    this.filtersService.accounts$.subscribe(
      async accounts => {
        await this.getBanks();
        await this.getCreditSystems();
        this.refreshSalesDataFromDatabase();
      }
    );
    this.filtersService.payTotal$.subscribe(
      payments => {
        this.paymentMethodTotal = payments;
        this.calculateTotal();
      }
    );
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

  async getCountOfRows() {
    this.rowCount = await this.databaseService.sales.count();
  }

  async addRow() {
    this.rowCount = this.rowCount + 1;
    const newRow: Sale = {
      id: uuidv4(),
      saleNumber: this.rowCount,
      identifier: '',
      name: '',
      item: '',
      price: 0,
      card: 0,
      cash: 0,
      transfer: [{ quantity: 0, method: '' }],
      installments: [{ quantity: 0, method: '' }],
      date: this.tableDate,
    };
    this.salesData.push(newRow);
  }

  saveRow(index: number) {
    if (this.salesData[index].identifier) {
      this.databaseService.sales.put(this.salesData[index]);
      this.filtersService.changeRowCount(this.salesData.length);
    }
    this.calculateTotal();
  }

  async refreshSalesDataFromDatabase() {
    const startDate = new Date(
      this.tableDate.getFullYear(),
      this.tableDate.getMonth(),
      this.tableDate.getDate(),
      0,
      0,
      0
    );
    const endDate = new Date(
      this.tableDate.getFullYear(),
      this.tableDate.getMonth(),
      this.tableDate.getDate(),
      23,
      59,
      59
    );

    this.salesData = await this.databaseService.sales
      .where('date')
      .between(startDate, endDate, true, true)
      .toArray();
    this.calculateTotal();
  }

  calculateTotal() {
    this.saleTotal.price = 0;
    this.saleTotal.card = 0;
    this.saleTotal.cash = 0;
    this.saleTotal.transfer = 0;
    this.saleTotal.installments = 0;
    this.salesData.forEach((sale) => {
      this.saleTotal.price = Number(
        bigDecimal
          .add(
            this.saleTotal.price,
            sale.price
          )
      );
      this.saleTotal.card = Number(
        bigDecimal.add(
          this.saleTotal.card,
          sale.card
        )
      );
      this.saleTotal.cash = Number(
        bigDecimal
          .add(
            this.saleTotal.cash,
            sale.cash
          )
      );
      sale.transfer.forEach((transfer) => {
        this.saleTotal.transfer = Number(
          bigDecimal
            .add(
              this.saleTotal.transfer,
              transfer.quantity
            )
        );
      });
      sale.installments.forEach((installment) => {
        this.saleTotal.installments = Number(
          bigDecimal
            .add(
              this.saleTotal.installments,
              installment.quantity
            )
        );
      });
    });
    this.sumBookingPayments();
    this.saleTotal.balance = Number(
      bigDecimal.subtract(
        this.saleTotal.cash,
        this.saleTotal.expenses
      )
    );
  }

  private sumBookingPayments() {
    this.saleTotal.card = Number(
      bigDecimal.add(
        this.saleTotal.card,
        this.paymentMethodTotal.card
      )
    );
    this.saleTotal.cash = Number(
      bigDecimal
        .add(
          this.saleTotal.cash,
          this.paymentMethodTotal.cash
        )
    );
    this.saleTotal.transfer = Number(
      bigDecimal
        .add(
          this.saleTotal.transfer,
          this.paymentMethodTotal.transfer
        )
    );
  }

  async getBanks() {
    this.banks = await this.databaseService.banks.toArray();
  }

  async getCreditSystems() {
    this.creditSystems = await this.databaseService.creditSystems.toArray();
  }

  addTransfer(index: number) {
    this.salesData[index].transfer.push({ quantity: 0, method: '' });
  }

  addInstallment(index: number) {
    this.salesData[index].installments.push({ quantity: 0, method: '' });
  }
}
