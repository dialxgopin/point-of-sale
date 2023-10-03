import { Component } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { FiltersService } from '../filters.service';
import { Database } from '../database';
import { Sale } from '../sale';

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
    {
      id: uuidv4(),
      identifier: '',
      name: '',
      item: '',
      price: 0,
      paid: 0,
      due: 0,
      date: new Date()
    }
  ];

  private dbName = 'salesDB';
  private storeName = 'salesStore';
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
        this.querySales();
      }
    );
    this.filtersService.rowCount$.subscribe(
      rows => {
        this.querySales();
      }
    );
  }

  async querySales() {
    const [startDate, endDate] = this.dateOneDayRange();
    const salesData = await this.database.queryByDate(startDate, endDate) as Sale[];
    const bookingData: BookingDetails[] = [];
    for (const sale of salesData) {
      const paid = sale.card + sale.cash;
      const due = sale.price - paid;
      const bookingDetail: BookingDetails = {
        id: uuidv4(),
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
    this.bookingData = bookingData;
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
}
