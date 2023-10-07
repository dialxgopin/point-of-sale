import { Component } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { FiltersService } from '../filters.service';
import { Database } from '../database';
import { Sale } from '../sale';

interface Installment {
  id: string;
  identifier: string;
  name: string;
  price: number;
  date: Date;
}

interface InstallmentTotal {
  price: number;
}

@Component({
  selector: 'app-installments',
  templateUrl: './installments.component.html',
  styleUrls: ['./installments.component.css']
})
export class InstallmentsComponent {
  installmentsData: Installment[] = [
    { id: uuidv4(), identifier: '', name: '', price: 0, date: new Date() }
  ];

  installmentsTotal: InstallmentTotal = {
    price: 0,
  };

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
    this.installmentsData = salesData;
    this.calculateTotal();
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

  calculateTotal() {
    this.installmentsTotal.price = 0;

    this.installmentsData.forEach((installment) => {
      this.installmentsTotal.price += installment.price;
    });
  }

  queryClientSalesByIdentifier() {
    this.searchName = '';
    if (this.searchIdentifier.length > 0) {
      this.database.queryByIdentifier(this.searchIdentifier).then((results) => {
        this.installmentsData = results as Sale[];
        this.calculateTotal();
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
        this.installmentsData = results as Sale[];
        this.calculateTotal();
      }).catch((error) => {
        console.error('Error:', error);
      });
    } else {
      this.querySales();
    }
  }
}
