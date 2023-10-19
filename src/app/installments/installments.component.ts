import { Component } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { FiltersService } from '../filters.service';
import { Sale } from '../models/sale';
import { DatabaseService } from '../database.service';
import bigDecimal from 'js-big-decimal';

interface Installment {
  id: string;
  identifier: string;
  name: string;
  installments: number;
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
    { id: uuidv4(), identifier: '', name: '', installments: 0, date: new Date() }
  ];

  installmentsTotal: InstallmentTotal = {
    price: 0,
  };

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
      this.installmentsTotal.price = Number(
        bigDecimal
          .add(
            this.installmentsTotal.price,
            installment.installments
          )
      );
    });
  }

  async queryClientSalesByIdentifier() {
    this.searchName = '';
    if (this.searchIdentifier.length > 0) {
      this.installmentsData = await this.databaseService.sales
        .where('identifier')
        .equals(this.searchIdentifier)
        .toArray() as Sale[];
      this.calculateTotal();
    } else {
      this.querySales();
    }
  }

  async queryClientSalesByName() {
    this.searchIdentifier = '';
    if (this.searchName.length > 0) {
      this.installmentsData = await this.databaseService.sales
        .where('name')
        .equals(this.searchName)
        .toArray() as Sale[];
      this.calculateTotal();
    } else {
      this.querySales();
    }
  }
}
