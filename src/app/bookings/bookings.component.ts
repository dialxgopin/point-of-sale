import { Component } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { FiltersService } from '../filters.service';
import { Database } from '../database';
import { Sale } from '../sale';
import { Booking } from '../booking';

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

  private dbName = 'bookingsDB';
  private storeName = 'bookingsStore';
  private dbSalesName = 'salesDB';
  private storeSalesName = 'salesStore';
  private database: Database;
  private salesDatabase: Database;

  tableDate: Date = new Date();

  constructor(private filtersService: FiltersService) {
    this.database = new Database();
    this.database.setDatabaseAndStore(this.dbName, this.storeName);
    this.salesDatabase = new Database();
    this.salesDatabase.setDatabaseAndStore(this.dbSalesName, this.storeSalesName);
  }

  ngOnInit() {
    this.filtersService.tableDate$.subscribe(
      date => {
        this.tableDate = date;
        this.refreshBookingsDataFromDatabase();
      }
    );
  }

  refreshBookingsDataFromDatabase() {
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
      this.bookingData = results as Booking[];
      this.calculateTotal();
    }).catch((error) => {
      console.error('Error:', error);
    });
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
      this.database.saveData([this.bookingData[index]]);
      this.filtersService.changeRowCount(Math.random());
    }
    this.calculateTotal();
  }

  private identifierPresentAndSaleSelected(index: number): boolean {
    return this.bookingData[index].identifier!.length > 0 &&
      this.salesData.some((sale) => sale.selected);
  }

  queryClientSalesByIdentifier(index: number) {
    if (this.bookingData[index].identifier) {
      this.currentWorkingIndex = index;
      this.salesDatabase.queryByIdentifier(this.bookingData[index].identifier).then((results) => {
        this.salesData = results as ClientSale[];
        this.bookingData[index].name = results.length > 0 ? results[0].name : '';
        this.salesData[0].selected = results.length == 1;
      }).catch((error) => {
        console.error('Error:', error);
      });
    }
    this.saveRow(index);
  }

  queryClientSalesByName(index: number) {
    if (this.bookingData[index].name) {
      this.currentWorkingIndex = index;
      this.salesDatabase.queryByName(this.bookingData[index].name).then((results) => {
        this.salesData = results as ClientSale[];
        this.bookingData[index].identifier = results.length > 0 ? results[0].identifier : '';
        this.salesData[0].selected = results.length == 1;
      }).catch((error) => {
        console.error('Error:', error);
      });
    }
    this.saveRow(index);
  }

  selectRow(bookingIndex: number, radioIndex: number) {
    this.salesData.forEach(sale => (sale.selected = false));
    this.salesData[radioIndex].selected = true;
    this.saveRow(bookingIndex);
  }
}
