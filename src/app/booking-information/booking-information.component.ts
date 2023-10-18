import { Component } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { FiltersService } from '../filters.service';
import { Sale } from '../models/sale';
import { Booking } from '../models/booking';
import { DatabaseService } from '../database.service';

interface BookingDetails {
  id: string;
  saleNumber: number;
  identifier: string;
  name: string;
  item: string;
  price: number;
  paid: number;
  due: number;
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

  tableDate: Date = new Date();

  constructor(private databaseService: DatabaseService,
    private filtersService: FiltersService) { }

  ngOnInit() {
    this.filtersService.tableDate$.subscribe(
      date => {
        this.tableDate = date;
        this.searchIdentifier = '';
        this.searchName = '';
        this.querySales();
      }
    );
    this.filtersService.rowCount$.subscribe(
      rows => {
        this.searchIdentifier = '';
        this.searchName = '';
        this.querySales();
      }
    );
  }

  async querySales() {
    const [startDate, endDate] = this.dateOneDayRange();
    const salesData = await this.databaseService.sales
      .where('date')
      .between(startDate, endDate, true, true)
      .toArray() as Sale[];
    this.bookingData = await this.formatResults(salesData);
  }

  private dateOneDayRange() {
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
    return [startDate, endDate];
  }

  private async formatResults(results: Sale[]): Promise<BookingDetails[]> {
    const bookingData: BookingDetails[] = [];
    for (const sale of results as Sale[]) {
      const paymentSum: number = await this.sumSalePayments(sale.saleNumber);
      const paid: number = sale.card + sale.cash + paymentSum;
      const due: number = sale.price - paid;
      const bookingDetail: BookingDetails = {
        id: uuidv4(),
        saleNumber: sale.saleNumber,
        identifier: sale.identifier,
        name: sale.name,
        item: sale.item,
        price: sale.price,
        paid: paid,
        due: due,
        date: sale.date,
      };
      bookingData.push(bookingDetail);
    }
    return bookingData;
  }

  private async sumSalePayments(saleNumber: number): Promise<number> {
    const salePayments = await this.databaseService.bookings
      .where('saleNumber')
      .equals(saleNumber)
      .toArray() as Booking[];
    return salePayments.reduce((total, booking) => total + booking.quantity, 0);
  }

  async queryClientSalesByIdentifier() {
    this.searchName = '';
    if (this.searchIdentifier.length > 0) {
      this.bookingData = await this.formatResults(
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
      this.bookingData = await this.formatResults(
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
