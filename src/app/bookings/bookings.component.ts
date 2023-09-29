import { Component } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { FiltersService } from '../filters.service';
import { Database } from '../database';

interface Booking {
  id: string;
  identifier: string;
  name: string;
  quantity: number;
  date: Date;
}

interface BookingTotal {
  quantity: number;
}

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css']
})
export class BookingsComponent {
  bookingData: Booking[] = [
    { id: uuidv4(), identifier: '', name: '', quantity: 0, date: new Date() }
  ];

  bookingTotal: BookingTotal = {
    quantity: 0,
  };

  private dbName = 'installmentsDB';
  private storeName = 'installmentsStore';
  private database: Database;

  tableDate: Date = new Date();

  constructor(private filtersService: FiltersService) {
    this.database = new Database();
    this.database.setDatabaseAndStore(this.dbName, this.storeName);
  }

  ngOnInit() {
    this.filtersService.tableDate$.subscribe(
      date => {
        this.tableDate = date;
        this.refreshBookingsDataFromDatabase();
      }
    );
  }

  addRow() {
    const newRow: Booking = { id: uuidv4(), identifier: '', name: '', quantity: 0, date: this.tableDate };
    this.bookingData.push(newRow);
  }

  saveRow(index: number) {
    if (this.bookingData[index].identifier) {
      this.database.saveData([this.bookingData[index]]);
    }
    this.calculateTotal();
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
}
