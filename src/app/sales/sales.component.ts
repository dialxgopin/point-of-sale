import { Component } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { FiltersService } from '../filters.service';
import { Database } from '../database';
import { Sale } from '../sale';

interface SaleTotal {
  price: number;
  card: number;
  cash: number;
  installments: number;
}

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css']
})
export class SalesComponent {
  salesData: Sale[] = [
    {
      id: uuidv4(),
      identifier: '',
      name: '',
      item: '',
      price: 0,
      card: 0,
      cash: 0,
      installments: 0,
      date: new Date(),
    },
  ];

  saleTotal: SaleTotal = {
    price: 0,
    card: 0,
    cash: 0,
    installments: 0,
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
        this.refreshSalesDataFromDatabase();
      }
    );
  }

  addRow() {
    const newRow: Sale = {
      id: uuidv4(),
      identifier: '',
      name: '',
      item: '',
      price: 0,
      card: 0,
      cash: 0,
      installments: 0,
      date: this.tableDate,
    };
    this.salesData.push(newRow);
  }

  saveRow(index: number) {
    if (this.salesData[index].identifier) {
      this.database.saveData([this.salesData[index]]);
      this.filtersService.changeRowCount(this.salesData.length);
    }
    this.calculateTotal();
  }

  refreshSalesDataFromDatabase() {
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
      this.salesData = results as Sale[];
      this.calculateTotal();
    }).catch((error) => {
      console.error('Error:', error);
    });
  }

  calculateTotal() {
    this.saleTotal.price = 0;
    this.saleTotal.card = 0;
    this.saleTotal.cash = 0;
    this.saleTotal.installments = 0;

    this.salesData.forEach((sale) => {
      this.saleTotal.price += sale.price;
      this.saleTotal.card += sale.card;
      this.saleTotal.cash += sale.cash;
      this.saleTotal.installments += sale.installments;
    });
  }
}
