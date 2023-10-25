import { Component } from '@angular/core';
import { Booking } from '../models/booking';
import { DatabaseService } from '../database.service';
import { FiltersService } from '../filters.service';
import bigDecimal from 'js-big-decimal';

@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.css']
})
export class PaymentHistoryComponent {
  paymentHistoryData: Booking[] = [];
  quantityTotal: number = 0;

  searchIdentifier: string = '';
  searchName: string = '';

  constructor(private databaseService: DatabaseService,
    private filtersService: FiltersService) { }

  ngOnInit() {
    this.filtersService.rowCount$.subscribe(
      rows => {
        this.refreshBookingsDataFromDatabase();
      }
    );
  }

  async refreshBookingsDataFromDatabase() {
    this.paymentHistoryData = await this.databaseService.bookings.toArray();
    this.calculateTotal();
  }

  calculateTotal() {
    this.quantityTotal = 0;
    this.paymentHistoryData.forEach((payment) => {
      this.quantityTotal = Number(
        bigDecimal.add(
          this.quantityTotal,
          payment.quantity
        )
      );
    });
  }

  async queryPaymentsByIdentifier() {
    this.searchName = '';
    if (this.searchIdentifier.length > 0) {
      this.paymentHistoryData = await this.databaseService.bookings
        .where('identifier')
        .equals(this.searchIdentifier)
        .toArray() as Booking[];
      this.calculateTotal();
    } else {
      this.refreshBookingsDataFromDatabase();
    }
  }

  async queryPaymentsByName() {
    this.searchIdentifier = '';
    if (this.searchName.length > 0) {
      this.paymentHistoryData = await this.databaseService.bookings
        .where('name')
        .equals(this.searchName)
        .toArray() as Booking[];
      this.calculateTotal();
    } else {
      this.refreshBookingsDataFromDatabase();
    }
  }
}
