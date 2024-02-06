import { Component } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { FiltersService } from '../filters.service';
import { Sale } from '../models/sale';
import { Booking } from '../models/booking';
import { DatabaseService } from '../database.service';
import bigDecimal from 'js-big-decimal';
import { PaymentTotal } from '../models/payment-total';

interface BookingTotal {
  quantity: number;
}

interface ClientSale extends Sale {
  selected?: boolean;
  debt?: number;
}

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css']
})
export class BookingsComponent {
  bookingData: Booking[] = [];

  bookingTotal: BookingTotal = {
    quantity: 0,
  };

  salesData: ClientSale[] = [];

  paymentMethods: string[] = [];

  paymentMethodTotal: PaymentTotal = {
    card: 0,
    cash: 0,
    transfer: 0
  };

  currentWorkingIndex: number = 0;

  tableDate: Date = new Date();
  isReadOnly: boolean = false;
  isEditing: boolean = false;
  paymentLessThanDebt: boolean = true;

  newPaymentIdentifier: string = '';

  constructor(private databaseService: DatabaseService,
    private filtersService: FiltersService) { }

  ngOnInit() {
    this.filtersService.tableDate$.subscribe(
      date => {
        this.tableDate = date;
        this.updateReadOnlyStatus();
        this.salesData = [];
        this.refreshBookingsDataFromDatabase();
      }
    );
    this.filtersService.accounts$.subscribe(
      async accounts => {
        await this.getPaymentMethods();
        this.refreshBookingsDataFromDatabase();
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

  async refreshBookingsDataFromDatabase() {
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
    this.bookingData = await this.databaseService.bookings
      .where('date')
      .between(startDate, endDate, true, true)
      .toArray();
    this.calculateTotal();
  }

  calculateTotal() {
    this.bookingTotal.quantity = 0;
    this.bookingData.forEach((booking) => {
      this.bookingTotal.quantity = Number(
        bigDecimal.add(this.bookingTotal.quantity, booking.quantity)
      );
    });
    this.calculatePaymentMethodTotal();
  }

  calculatePaymentMethodTotal() {
    this.paymentMethodTotal = {
      card: 0,
      cash: 0,
      transfer: 0
    };
    this.bookingData.forEach((booking) => {
      switch (booking.method) {
        case 'Efectivo': {
          this.paymentMethodTotal.cash = Number(
            bigDecimal.add(booking.quantity, this.paymentMethodTotal.cash)
          );
          break;
        }
        case 'Tarjeta': {
          this.paymentMethodTotal.card = Number(
            bigDecimal.add(booking.quantity, this.paymentMethodTotal.card)
          );
          break;
        }
        default: {
          this.paymentMethodTotal.transfer = Number(
            bigDecimal.add(booking.quantity, this.paymentMethodTotal.transfer)
          );
          break;
        }
      }
    });
    this.filtersService.updateTotalPay(this.paymentMethodTotal);
  }

  async addRow() {
    await this.querySales();
    if (this.salesData.length > 0) {
      const newRow: Booking = {
        id: uuidv4(),
        saleNumber: 0,
        identifier: this.salesData[0].identifier,
        name: this.salesData[0].name,
        quantity: 0,
        method: 'Efectivo',
        date: this.tableDate
      };
      this.bookingData.push(newRow);
      this.currentWorkingIndex = this.bookingData.length - 1;
      this.isEditing = true;
    }
  }

  private async querySales() {
    this.salesData = await this.databaseService.sales
      .where('identifier')
      .equals(this.newPaymentIdentifier)
      .toArray() as ClientSale[];
    if (this.salesData.length > 0) {
      this.salesData = await this.calculateDebt(this.salesData);
      this.salesData[0].selected = this.salesData.length == 1;
    }
  }

  async editRow(index: number) {
    this.salesData = await this.databaseService.sales
      .where('saleNumber')
      .equals(this.bookingData[index].saleNumber)
      .toArray() as ClientSale[];
    if (this.salesData.length > 0) {
      this.salesData = await this.calculateDebt(this.salesData);
      this.salesData[0].selected = true;
      this.currentWorkingIndex = index;
      this.isEditing = true;
    }
  }

  saveRow(index: number) {
    if (this.validSaleSelected(index) && this.paymentLessThanDebt) {
      const selectedSale = this.salesData.find((sale) => sale.selected);
      if (selectedSale) {
        this.bookingData[index].saleNumber = selectedSale!.saleNumber;
      }
      this.databaseService.bookings.put(this.bookingData[index]);
      this.filtersService.changeRowCount(Math.random());
      this.calculateTotal();
      this.salesData = [];
      this.isEditing = false;
    }
  }

  private validSaleSelected(index: number): boolean {
    return this.salesData.some((sale) => sale.selected) ||
      this.bookingData[index].saleNumber !== 0;
  }

  validPaymentQuantity(index: number) {
    const selectedSale = this.salesData.find((sale) => sale.selected);
    let balance: number = 0;
    if (selectedSale) {
      balance = Number(
        bigDecimal.subtract(selectedSale.debt, this.bookingData[index].quantity)
      );
    }
    this.paymentLessThanDebt = balance >= 0;
  }

  private async calculateDebt(results: Sale[]): Promise<ClientSale[]> {
    const bookingData: ClientSale[] = [];
    for (const sale of results as Sale[]) {
      const paymentSum: number = await this.sumSalePayments(sale.saleNumber);
      const transfers: number = this.sumTransferQuantity(sale);
      let paid: number = Number(
        bigDecimal
          .add(
            +bigDecimal.add(sale.card, sale.cash),
            +bigDecimal.add(paymentSum, transfers)
          )
      );
      paid = Number(
        bigDecimal
          .add(
            paid,
            this.sumInstallmentsQuantity(sale)
          )
      );
      const due: number = Number(
        bigDecimal.subtract(sale.price, paid)
      );
      if (due > 0) {
        let bookingDetail: ClientSale = sale;
        bookingDetail.debt = due;
        bookingData.push(bookingDetail);
      }
    }
    return bookingData;
  }

  private async sumSalePayments(saleNumber: number): Promise<number> {
    const salePayments = await this.databaseService.bookings
      .where('saleNumber')
      .equals(saleNumber)
      .toArray() as Booking[];
    return salePayments.reduce((total, booking) => Number(
      bigDecimal
        .add(total, booking.quantity)
    ), 0);
  }

  sumTransferQuantity(sale: Sale) {
    const transfer = sale.transfer;
    let sum: number = 0;
    for (const element of transfer) {
      sum = Number(
        bigDecimal.add(sum, element.quantity)
      );
    }
    return sum;
  }

  sumInstallmentsQuantity(sale: Sale) {
    const installments = sale.installments;
    let sum: number = 0;
    for (const element of installments) {
      sum = Number(
        bigDecimal.add(sum, element.quantity)
      );
    }
    return sum;
  }

  selectRow(radioIndex: number) {
    this.salesData.forEach(sale => (sale.selected = false));
    this.salesData[radioIndex].selected = true;
  }

  async getPaymentMethods() {
    this.paymentMethods = [];
    const banks = await this.databaseService.banks.toArray();
    banks.forEach((bank) => {
      this.paymentMethods.push(bank.name);
    });
  }
}
