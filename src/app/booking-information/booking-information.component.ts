import { Component } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { FiltersService } from '../filters.service';
import { Database } from '../database';

interface BookingDetails {
  id: string;
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
    { id: uuidv4(), identifier: '', name: '', item: '', price: 0, paid: 0, due: 0, date: new Date() }
  ];

  private dbName = 'bookingDetailsDB';
  private storeName = 'bookingDetailsStore';
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
    const newRow: BookingDetails = { id: uuidv4(), identifier: '', name: '', item: '', price: 0, paid: 0, due: 0, date: this.tableDate };
    this.bookingData.push(newRow);
  }

  saveRow(index: number) {
    if (this.bookingData[index].identifier) {
      this.database.saveData([this.bookingData[index]]);
    }
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
      this.bookingData = results as BookingDetails[];
    }).catch((error) => {
      console.error('Error:', error);
    });
  }
}
