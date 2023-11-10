import { Component } from '@angular/core';
import { Booking } from '../models/booking';
import { DatabaseService } from '../database.service';
import { FiltersService } from '../filters.service';
import bigDecimal from 'js-big-decimal';
import { Sale } from '../models/sale';
import { Payment } from '../models/payment';

@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.css']
})
export class PaymentHistoryComponent {
  paymentHistoryData: Booking[] = [];
  salesData: Sale[] = [];
  quantityTotal: number = 0;

  searchIdentifier: string = '';
  searchName: string = '';

  constructor(private databaseService: DatabaseService,
    private filtersService: FiltersService) { }

  ngOnInit() {
    this.filtersService.rowCount$.subscribe(
      rows => {
        this.refreshBookingsDataFromDatabase();
      }
    );
  }

  async refreshBookingsDataFromDatabase() {
    this.paymentHistoryData = await this.databaseService.bookings.toArray();
    this.calculateTotal();
  }

  calculateTotal() {
    this.quantityTotal = 0;
    this.paymentHistoryData.forEach((payment) => {
      this.quantityTotal = Number(
        bigDecimal.add(
          this.quantityTotal,
          payment.quantity
        )
      );
    });
  }

  async queryPaymentsByIdentifier() {
    this.searchName = '';
    if (this.searchIdentifier.length > 0) {
      this.paymentHistoryData = await this.databaseService.bookings
        .where('identifier')
        .equals(this.searchIdentifier)
        .toArray() as Booking[];
      this.calculateTotal();
    } else {
      this.refreshBookingsDataFromDatabase();
    }
  }

  async queryPaymentsByName() {
    this.searchIdentifier = '';
    if (this.searchName.length > 0) {
      this.paymentHistoryData = await this.databaseService.bookings
        .where('name')
        .equals(this.searchName)
        .toArray() as Booking[];
      this.calculateTotal();
    } else {
      this.refreshBookingsDataFromDatabase();
    }
  }

  async queryInitialPayment(index: number) {
    this.salesData = await this.databaseService.sales
      .where('saleNumber')
      .equals(this.paymentHistoryData[index].saleNumber)
      .toArray() as Sale[];
    this.calculateTotalBySale(index, this.salesData[0]);
  }

  async calculateTotalBySale(index: number, initialSalePayments: Sale) {
    this.quantityTotal = 0;
    this.sumSalePayments(initialSalePayments);
    const otherPayments = await this.databaseService.bookings
      .where('saleNumber')
      .equals(this.paymentHistoryData[index].saleNumber)
      .toArray() as Booking[];
    otherPayments.forEach((payment) => {
      this.quantityTotal = Number(
        bigDecimal.add(
          this.quantityTotal,
          payment.quantity
        )
      );
    });
  }

  sumSalePayments(sale: Sale) {
    this.quantityTotal = Number(
      bigDecimal.add(
        this.quantityTotal,
        sale.card
      )
    );
    this.quantityTotal = Number(
      bigDecimal.add(
        this.quantityTotal,
        sale.cash
      )
    );
    this.quantityTotal = Number(
      bigDecimal.add(
        this.quantityTotal,
        this.sumPayments(sale.transfer)
      )
    );
    this.quantityTotal = Number(
      bigDecimal.add(
        this.quantityTotal,
        this.sumPayments(sale.installments)
      )
    );
  }

  sumPayments(payments: Payment[]): number {
    let sum: number = 0;
    payments.forEach((payment) => {
      sum = Number(
        bigDecimal
          .add(
            sum,
            payment.quantity
          )
      );
    });
    return sum;
  }
}
