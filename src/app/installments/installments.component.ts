import { Component } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { FiltersService } from '../filters.service';
import { Subscription } from 'rxjs';
import { Database } from '../database';

interface Installment {
  id: string;
  identifier: string;
  name: string;
  price: number;
  date: Date;
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

  private dbName = 'installmentsDB';
  private storeName = 'installmentsStore';
  private database: Database;

  subscription: Subscription;
  tableDate: Date = new Date();

  constructor(private filtersService: FiltersService) {
    this.subscription = this.filtersService.tableDate$.subscribe(
      date => {
        this.tableDate = date;
      }
    );
    this.database = new Database();
    this.database.setDatabaseAndStore(this.dbName, this.storeName);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  addRow() {
    const newRow: Installment = { id: uuidv4(), identifier: '', name: '', price: 0, date: this.tableDate };
    this.installmentsData.push(newRow);
  }

  saveRow(index: number) {
    if (this.installmentsData[index].identifier) {
      this.database.saveData([this.installmentsData[index]]);
    }
  }
}
