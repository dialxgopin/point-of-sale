import { Component } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { FiltersService } from '../filters.service';
import { Sale } from '../models/sale';
import { Booking } from '../models/booking';
import { DatabaseService } from '../database.service';
import bigDecimal from 'js-big-decimal';

interface BookingDetails {
  id: string;
  saleNumber: number;
  identifier: string;
  name: string;
  item: string;
  price: number;
  paid?: number;
  due?: number;
  date: Date;
}

@Component({
  selector: 'app-booking-information',
  templateUrl: './booking-information.component.html',
  styleUrls: ['./booking-information.component.css']
})
export class BookingInformationComponent {
  bookingData: BookingDetails[] = [
    {
      id: uuidv4(),
      saleNumber: 0,
      identifier: '',
      name: '',
      item: '',
      price: 0,
      paid: 0,
      due: 0,
      date: new Date()
    }
  ];

  searchIdentifier: string = '';
  searchName: string = '';

  constructor(private databaseService: DatabaseService,
    private filtersService: FiltersService) { }

  ngOnInit() {
    this.filtersService.rowCount$.subscribe(
      rows => {
        this.searchIdentifier = '';
        this.searchName = '';
        this.querySales();
      }
    );
  }

  async querySales() {
    const salesData = await this.databaseService.sales.toArray() as Sale[];
    this.bookingData = await this.calculateOutstandingBalances(salesData);
  }

  private async calculateOutstandingBalances(results: Sale[]): Promise<BookingDetails[]> {
    const bookingData: BookingDetails[] = [];
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
        let bookingDetail: BookingDetails = sale;
        bookingDetail.paid = paid;
        bookingDetail.due = due;
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

  async queryClientSalesByIdentifier() {
    this.searchName = '';
    if (this.searchIdentifier.length > 0) {
      this.bookingData = await this.calculateOutstandingBalances(
        await this.databaseService.sales
          .where('identifier')
          .equals(this.searchIdentifier)
          .toArray() as Sale[]
      );
    } else {
      this.querySales();
    }
  }

  async queryClientSalesByName() {
    this.searchIdentifier = '';
    if (this.searchName.length > 0) {
      this.bookingData = await this.calculateOutstandingBalances(
        await this.databaseService.sales
          .where('name')
          .equals(this.searchName)
          .toArray() as Sale[]
      );
    } else {
      this.querySales();
    }
  }
}
