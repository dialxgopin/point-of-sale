import { Component } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { FiltersService } from '../filters.service';
import { Sale } from '../models/sale';
import { DatabaseService } from '../database.service';
import bigDecimal from 'js-big-decimal';

interface InstallmentTotal {
  card: number;
  cash: number;
  transfer: number;
  installments: number;
}

@Component({
  selector: 'app-installments',
  templateUrl: './installments.component.html',
  styleUrls: ['./installments.component.css']
})
export class InstallmentsComponent {
  installmentsData: Sale[] = [
    {
      id: uuidv4(),
      saleNumber: 0,
      identifier: '',
      name: '',
      item: '',
      price: 0,
      card: 0,
      cash: 0,
      transfer: [],
      installments: [],
      date: new Date(),
    }
  ];

  installmentsTotal: InstallmentTotal = {
    card: 0,
    cash: 0,
    transfer: 0,
    installments: 0,
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
    const installmentsData = await this.databaseService.sales
      .where('date')
      .between(startDate, endDate, true, true)
      .toArray() as Sale[];
    this.installmentsData = installmentsData;
    this.calculateTotal();
  }

  private dateOneDayRange() {
    const startDate = new Date(
      this.tableDate.getFullYear(),
      this.tableDate.getMonth(),
      this.tableDate.getDate(),
      0,
      0,
      0
    );
    const endDate = new Date(
      this.tableDate.getFullYear(),
      this.tableDate.getMonth(),
      this.tableDate.getDate(),
      23,
      59,
      59
    );
    return [startDate, endDate];
  }

  calculateTotal() {
    this.installmentsTotal.card = 0;
    this.installmentsTotal.cash = 0;
    this.installmentsTotal.transfer = 0;
    this.installmentsTotal.installments = 0;

    this.installmentsData.forEach((sale) => {
      this.installmentsTotal.card = Number(
        bigDecimal.add(
          this.installmentsTotal.card,
          sale.card
        )
      );
      this.installmentsTotal.cash = Number(
        bigDecimal
          .add(
            this.installmentsTotal.cash,
            sale.cash
          )
      );
      sale.transfer.forEach((transfer) => {
        this.installmentsTotal.transfer = Number(
          bigDecimal
            .add(
              this.installmentsTotal.transfer,
              transfer.quantity
            )
        );
      });
      sale.installments.forEach((installment) => {
        this.installmentsTotal.installments = Number(
          bigDecimal
            .add(
              this.installmentsTotal.installments,
              installment.quantity
            )
        );
      });
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
