import { Component } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { FiltersService } from '../filters.service';
import { Sale } from '../models/sale';
import { Booking } from '../models/booking';
import { DatabaseService } from '../database.service';

interface BookingTotal {
  quantity: number;
}

interface ClientSale extends Sale {
  selected?: boolean;
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

  currentWorkingIndex: number = 0;

  tableDate: Date = new Date();
  isReadOnly: boolean = false;

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
      this.tableDate.getDate()
    );
    const endDate = new Date(
      this.tableDate.getFullYear(),
      this.tableDate.getMonth(),
      this.tableDate.getDate() + 1
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
      this.bookingTotal.quantity += booking.quantity;
    });
  }

  addRow() {
    const newRow: Booking = {
      id: uuidv4(),
      saleNumber: 0,
      identifier: '',
      name: '',
      quantity: 0,
      date: this.tableDate
    };
    this.bookingData.push(newRow);
    this.salesData = [];
  }

  saveRow(index: number) {
    if (this.identifierPresentAndSaleSelected(index)) {
      const selectedSale = this.salesData.find((sale) => sale.selected);
      this.bookingData[index].saleNumber = selectedSale!.saleNumber;
      this.databaseService.bookings.put(this.bookingData[index]);
      this.filtersService.changeRowCount(Math.random());
    }
    this.calculateTotal();
  }

  private identifierPresentAndSaleSelected(index: number): boolean {
    return this.bookingData[index].identifier!.length > 0 &&
      this.salesData.some((sale) => sale.selected);
  }

  async queryClientSalesByIdentifier(index: number) {
    if (this.bookingData[index].identifier) {
      this.currentWorkingIndex = index;
      this.salesData = await this.databaseService.sales
        .where('identifier')
        .equals(this.bookingData[index].identifier)
        .toArray() as ClientSale[];
      this.bookingData[index].name = this.salesData.length > 0 ? this.salesData[0].name : '';
      this.salesData[0].selected = this.salesData.length == 1;
      this.saveRow(index);
    }
  }

  async queryClientSalesByName(index: number) {
    if (this.bookingData[index].name) {
      this.currentWorkingIndex = index;
      this.salesData = await this.databaseService.sales
        .where('name')
        .equals(this.bookingData[index].name)
        .toArray() as ClientSale[];
      this.bookingData[index].identifier = this.salesData.length > 0 ? this.salesData[0].identifier : '';
      this.salesData[0].selected = this.salesData.length == 1;
      this.saveRow(index);
    }
  }

  selectRow(bookingIndex: number, radioIndex: number) {
    this.salesData.forEach(sale => (sale.selected = false));
    this.salesData[radioIndex].selected = true;
    this.saveRow(bookingIndex);
  }
}
