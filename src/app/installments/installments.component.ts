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
    const installmentsData: Installment[] = [];
    for (const sale of salesData) {
      const saleDetail: Installment = {
        id: uuidv4(),
        identifier: sale.identifier,
        name: sale.name,
        price: sale.installments,
        date: sale.date,
      };
      installmentsData.push(saleDetail);
    }
    this.installmentsData = installmentsData;
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
}
