import { Component } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { FiltersService } from '../filters.service';
import { Database } from '../database';
import { Sale } from '../sale';

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
        this.searchIdentifier = '';
        this.searchName = '';
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
    this.bookingData = this.formatResults(salesData);
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

  private formatResults(results: Sale[]): BookingDetails[] {
    const bookingData: BookingDetails[] = [];
    for (const sale of results as Sale[]) {
      const paid = sale.card + sale.cash;
      const due = sale.price - paid;
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

  queryClientSalesByIdentifier() {
    this.searchName = '';
    if (this.searchIdentifier.length > 0) {
      this.database.queryByIdentifier(this.searchIdentifier).then((results) => {
        this.bookingData = this.formatResults(results);
      }).catch((error) => {
        console.error('Error:', error);
      });
    } else {
      this.querySales();
    }
  }

  queryClientSalesByName() {
    this.searchIdentifier = '';
    if (this.searchName.length > 0) {
      this.database.queryByName(this.searchName).then((results) => {
        this.bookingData = this.formatResults(results);
      }).catch((error) => {
        console.error('Error:', error);
      });
    } else {
      this.querySales();
    }
  }
}
